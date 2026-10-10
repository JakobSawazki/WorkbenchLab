// Claude, 2026-10-09: prüft Claudes Aufgaben, den SQL-Export des Modell-Editors und die
// Unterschiede zwischen Browser-Labor (SQLite) und der MariaDB des Informatik-Sticks.
// Startet eine eigene, getrennte Instanz auf Port 33399 mit Datenverzeichnis im
// Temp-Ordner des Systems und beendet sie wieder. Aufruf: node tools/verify-claude-native.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const vm = require("node:vm");
const { spawn, spawnSync } = require("node:child_process");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const { Parser } = require("../vendor/node-sql-parser/mysql.umd.js");

const root = path.resolve(__dirname, "..");
const base = process.env.WORKBENCH_MARIADB_HOME || "C:/Informatik-Stick/Programme/Xampp_7.4.7/mysql";
const bin = (name) => path.join(base, "bin", `${name}.exe`);
const port = 33399;
const output = fs.mkdtempSync(path.join(os.tmpdir(), "workbenchlab-claude-native-"));
const data = path.join(output, "data");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const connection = ["--no-defaults", "--protocol=TCP", "--host=127.0.0.1", `--port=${port}`, "--user=root"];

function mysql(sql, expectFailure = false) {
  // Liefert die Ausgabe; mit expectFailure stattdessen, ob die Anweisung scheiterte.
  // A regular file avoids intermittently empty stdout pipes in the Windows runtime.
  const filename = path.join(output, "mysql-stdout.txt");
  const descriptor = fs.openSync(filename, "w");
  let result;
  try {
    result = spawnSync(bin("mysql"), [...connection, "--batch", "--skip-column-names", "--default-character-set=utf8mb4"], { input: sql, encoding: "utf8", windowsHide: true, timeout: 90000, stdio: ["pipe", descriptor, "pipe"] });
  } finally { fs.closeSync(descriptor); }
  result.stdout = fs.readFileSync(filename, "utf8");
  if (result.error) throw result.error;
  if (expectFailure) return { failed: result.status !== 0, message: result.stderr.trim() };
  assert.equal(result.status, 0, `mysql: ${result.stderr || result.stdout}\n${sql.slice(0, 300)}`);
  return result.stdout.replace(/\r\n/g, "\n").replace(/\n$/, "");
}
const rows = (text) => (text === "" ? [] : text.split("\n").map((line) => line.split("\t")));
const same = (a, b) => a.length === b.length && a.every((row, i) => row.length === b[i].length && row.every((cell, j) => {
  const x = String(cell), y = String(b[i][j]);
  return x === y || (x !== "" && y !== "" && Number.isFinite(Number(x)) && Number.isFinite(Number(y)) && Math.abs(Number(x) - Number(y)) < 1e-6);
}));

const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js", "order-exercises.js", "erm-editor.js", "sql-check.js", "sql-feedback.js", "sql-workspace.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const content = context.window.WORKBENCH_CONTENT;
const erm = context.window.WORKBENCH_ERM;
const sqlCheck = context.window.WORKBENCH_SQL_CHECK;
const feedback = context.window.WORKBENCH_SQL_FEEDBACK;

(async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const sqlite = (schemaKey, sql) => {
    const db = new SQL.Database();
    try {
      if (schemaKey) db.run(content.schemas[schemaKey].seed);
      const result = db.exec(sql);
      return (result.at(-1)?.values || []).map((row) => row.map((cell) => (cell === null ? "NULL" : String(cell))));
    } finally {
      db.close();
    }
  };
  const sqliteFails = (schemaKey, sql) => { try { sqlite(schemaKey, sql); return false; } catch { return true; } };

  await new Promise((resolve, reject) => { const probe = net.createServer(); probe.once("error", reject); probe.listen(port, "127.0.0.1", () => probe.close(resolve)); });
  const version = spawnSync(bin("mysqld"), ["--no-defaults", "--version"], { encoding: "utf8", windowsHide: true }).stdout.trim();
  const install = spawnSync(bin("mysql_install_db"), [`--datadir=${data}`, `--port=${port}`], { encoding: "utf8", windowsHide: true, timeout: 120000 });
  assert.equal(install.status, 0, install.stderr || install.stdout);
  const server = spawn(bin("mysqld"), ["--no-defaults", `--basedir=${base}`, `--datadir=${data}`, `--port=${port}`, "--bind-address=127.0.0.1", "--console"], { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  let log = "";
  server.stdout.on("data", (chunk) => { log += chunk; });
  server.stderr.on("data", (chunk) => { log += chunk; });
  let exited = false;
  const finished = new Promise((resolve) => server.on("exit", () => { exited = true; resolve(); }));
  const report = { version, checks: 0, differences: {} };
  try {
    let ready = false;
    for (let attempt = 0; attempt < 120 && !exited; attempt += 1) {
      if (spawnSync(bin("mysqladmin"), [...connection, "ping"], { encoding: "utf8", windowsHide: true, timeout: 1000 }).status === 0) { ready = true; break; }
      await sleep(250);
    }
    assert.ok(ready, `Eigene MariaDB-Instanz startete nicht: ${log.slice(-1500)}`);
    assert.equal(path.resolve(mysql("SELECT @@datadir;").replaceAll("\\\\", "\\")), path.resolve(data), "Native checks must use the isolated data directory");
    assert.equal(mysql("SELECT @@port;"), String(port));

    // Übungsdatenbanken anlegen.
    const databases = {};
    for (const key of ["fahrschule-basic", "fahrschule", "fahrradvermietung"]) {
      databases[key] = `wbl_${key.replace(/-/g, "_")}`;
      mysql(`CREATE DATABASE ${databases[key]} CHARACTER SET utf8mb4; USE ${databases[key]}; ${content.schemas[key].seed.replace(/PRAGMA foreign_keys = ON;/g, "")}`);
    }
    const native = (schemaKey, sql) => rows(mysql(`USE ${databases[schemaKey]}; ${sql}`));
    const nativeFails = (schemaKey, sql) => mysql(`USE ${databases[schemaKey]}; ${sql}`, true).failed;
    const check = (label, condition) => { assert.ok(condition, label); report.checks += 1; };

    // 1. Fehlersuche: Symptom und Korrektur verhalten sich in MariaDB wie im Browser.
    for (const item of content.practices.filter((practice) => practice.variant === "debug")) {
      const fixed = native(item.schema, item.check.expectedSql);
      const browserFixed = sqlite(item.schema, item.check.expectedSql);
      check(`${item.id}: Korrektur liefert in MariaDB dasselbe wie im Browser (${JSON.stringify(fixed)} / ${JSON.stringify(browserFixed)})`, same(fixed, browserFixed));
      if (item.symptom === "error") {
        check(`${item.id}: Startcode bricht auch in MariaDB ab`, nativeFails(item.schema, item.starter));
      } else {
        const start = native(item.schema, item.starter);
        check(`${item.id}: Startcode läuft in MariaDB und ist falsch`, !same(start, fixed));
        check(`${item.id}: Startcode liefert in MariaDB dasselbe falsche Ergebnis wie im Browser`, same(start, sqlite(item.schema, item.starter)) || item.id === "debug-join-ohne-bedingung");
        if (item.id === "debug-join-ohne-bedingung") check(`${item.id}: Kreuzprodukt hat in MariaDB dieselbe Zeilenzahl`, start.length === sqlite(item.schema, item.starter).length);
      }
    }

    // 2. Vorhersage: Jede richtige Antwort stimmt auch in MariaDB.
    for (const item of content.practices.filter((practice) => practice.variant === "predict")) {
      check(`${item.id}: gezeigte Abfrage läuft in MariaDB`, native(item.schema, item.sql).length > 0);
      for (const question of item.questions) {
        const value = native(item.schema, question.proofSql.replace(/FROM \((SELECT[^;]+)\)(?=\s*(WHERE|;|$))/i, "FROM ($1) AS teil"));
        check(`${item.id}: „${question.question}“`, String(value[0][0]) === question.options[question.correct]);
      }
    }

    // 3. Klauseln ordnen: Die richtige Reihenfolge läuft in MariaDB und liefert dasselbe.
    for (const item of content.practices.filter((practice) => practice.variant === "order")) {
      check(`${item.id}: Ergebnis in MariaDB wie im Browser`, same(native(item.schema, item.sql), sqlite(item.schema, item.sql)));
      const swapped = [item.lines[0], ...item.lines.slice(2), item.lines[1]].join("\n");
      check(`${item.id}: vertauschte Reihenfolge bricht auch in MariaDB ab`, nativeFails(item.schema, swapped));
    }

    // 4. Modell-Editor: Exportiertes SQL läuft in MariaDB mit echten Schlüsseln und Verweisen.
    let id = 1;
    const attribute = (name, type, flags = {}) => ({ id: id++, name, type, pk: Boolean(flags.pk), fk: Boolean(flags.fk) });
    const entity = (name, attributes) => ({ id: id++, name, attributes });
    const relation = (from, to, card) => ({ id: id++, from: from.id, to: to.id, card });
    const ort = entity("Ort", [attribute("ortnr", "INT", { pk: true }), attribute("ort", "VARCHAR(50)")]);
    const schueler = entity("Fahrschüler", [attribute("schuelernr", "INT", { pk: true }), attribute("nachname", "VARCHAR(50)"), attribute("geburtsdatum", "DATE"), attribute("groesse", "DOUBLE"), attribute("aktiv", "BOOLEAN"), attribute("ortnr", "INT", { fk: true })]);
    const kunde = entity("Kunden", [attribute("kundennr", "INT", { pk: true }), attribute("nachname", "VARCHAR(50)")]);
    const rad = entity("Fahrräder", [attribute("fahrradnr", "INT", { pk: true }), attribute("modell", "VARCHAR(50)")]);
    const vertrag = entity("Mietvertrag", [attribute("vertragnr", "INT", { pk: true }), attribute("von_datum", "DATE"), attribute("kundennr", "INT", { fk: true }), attribute("fahrradnr", "INT", { fk: true })]);
    const models = {
      wbl_erm_1n: { entities: [schueler, ort], relations: [relation(ort, schueler, "1:N")] },
      wbl_erm_mn: { entities: [vertrag, kunde, rad], relations: [relation(kunde, vertrag, "1:N"), relation(vertrag, rad, "N:1")] }
    };
    for (const [database, model] of Object.entries(models)) {
      mysql(`CREATE DATABASE ${database} CHARACTER SET utf8mb4; USE ${database}; ${erm.toSql(model)}`);
      const tables = Number(mysql(`SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA='${database}';`));
      const keys = Number(mysql(`SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA='${database}' AND CONSTRAINT_TYPE='PRIMARY KEY';`));
      const foreign = Number(mysql(`SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA='${database}' AND CONSTRAINT_TYPE='FOREIGN KEY';`));
      check(`${database}: Tabellen, Primär- und Fremdschlüssel angelegt (Tabellen=${tables}, PK=${keys}, FK=${foreign}; erwartet ${model.entities.length}/${model.entities.length}/${model.relations.length})`, tables === model.entities.length && keys === model.entities.length && foreign === model.relations.length);
    }
    // Optionalität: 0..1 an der 1-Seite lässt den Fremdschlüssel leer zu, sonst nicht.
    const ortO = entity("Ort", [attribute("ortnr", "INT", { pk: true }), attribute("ort", "VARCHAR(50)")]);
    const schuelerO = entity("Fahrschüler", [attribute("schuelernr", "INT", { pk: true }), attribute("ortnr", "INT", { fk: true })]);
    const optionalRelation = relation(ortO, schuelerO, "1:N");
    optionalRelation.fromOptional = true;
    mysql(`CREATE DATABASE wbl_erm_optional CHARACTER SET utf8mb4; USE wbl_erm_optional; ${erm.toSql({ entities: [ortO, schuelerO], relations: [optionalRelation] })}`);
    check("optionaler Fremdschlüssel darf in MariaDB leer bleiben", !mysql("USE wbl_erm_optional; INSERT INTO fahrschueler (schuelernr, ortnr) VALUES (1, NULL);", true).failed);
    check("optionaler Fremdschlüssel prüft vorhandene Werte weiterhin", mysql("USE wbl_erm_optional; INSERT INTO fahrschueler (schuelernr, ortnr) VALUES (2, 999);", true).failed);
    check("verpflichtender Fremdschlüssel darf in MariaDB nicht leer bleiben", mysql("USE wbl_erm_1n; INSERT INTO fahrschueler (schuelernr, ortnr) VALUES (3, NULL);", true).failed);
    check("Fremdschlüssel aus dem Export wird von MariaDB durchgesetzt", mysql("USE wbl_erm_1n; INSERT INTO fahrschueler (schuelernr, ortnr) VALUES (1, 999);", true).failed);

    // 5. SHOW TABLES und DESCRIBE aus dem freien Labor gibt es in MariaDB wirklich.
    check("SHOW TABLES", native("fahrschule", "SHOW TABLES;").length === 5);
    check("DESCRIBE", native("fahrschule", "DESCRIBE orte;").length === 3);

    // 6. Gemessene Unterschiede zwischen Browser-Labor und MariaDB (Grundlage für OPT-20).
    const pair = (label, schemaKey, sql) => {
      const lite = sqliteFails(schemaKey, sql) ? "Fehler" : JSON.stringify(sqlite(schemaKey, sql));
      const maria = nativeFails(schemaKey, sql) ? "Fehler" : JSON.stringify(native(schemaKey, sql));
      report.differences[label] = { sql, browser: lite, mariadb: maria, gleich: lite === maria };
    };
    pair("Textvergleich Gross/Klein", "fahrschule-basic", "SELECT COUNT(*) FROM fahrschueler WHERE ort = 'stuttgart';");
    pair("LIKE Gross/Klein", "fahrschule-basic", "SELECT COUNT(*) FROM fahrschueler WHERE nachname LIKE 'k%';");
    pair("Ganzzahl-Division", "fahrschule-basic", "SELECT 7 / 2;");
    pair("Division mit Spalte", "fahrschule-basic", "SELECT fahrstunden / 4 FROM fahrschueler WHERE schuelernr = 2;");
    pair("Verkettung mit ||", "fahrschule-basic", "SELECT vorname || ' ' || nachname FROM fahrschueler WHERE schuelernr = 1;");
    pair("CONCAT", "fahrschule-basic", "SELECT CONCAT(vorname, ' ', nachname) FROM fahrschueler WHERE schuelernr = 1;");
    pair("Doppelte Anfuehrungszeichen als Text", "fahrschule-basic", 'SELECT COUNT(*) FROM fahrschueler WHERE ort = "Stuttgart";');
    pair("GROUP BY mit weiterer Spalte", "fahrschule-basic", "SELECT ort, plz, COUNT(*) FROM fahrschueler GROUP BY ort ORDER BY ort;");
    pair("AVG", "fahrschule-basic", "SELECT AVG(fahrstunden) FROM fahrschueler WHERE ort = 'Esslingen';");
    pair("Datum als Text vergleichen", "fahrschule-basic", "SELECT COUNT(*) FROM fahrschueler WHERE geburtsdatum >= '2008-01-01';");
    pair("LIMIT", "fahrschule-basic", "SELECT nachname FROM fahrschueler ORDER BY schuelernr LIMIT 2;");
    pair("Tabellenname Gross", "fahrschule-basic", "SELECT COUNT(*) FROM FAHRSCHUELER;");
    pair("Fremdschluessel verletzen", "fahrschule", "INSERT INTO fahrschueler VALUES (99, 'Test', 'Tina', '2008-01-01', 999);");

    // 7. MySQL-Nähe des Browser-Labors (0.41.0): nachgebildete Funktionen und Umschreibungen liefern
    //    dasselbe wie MariaDB. „lab“ entspricht dem freien SQL-Labor (mit rewriteMysql), „exercise“
    //    einer Übungsaufgabe (nur die Funktionen).
    const runLab = (sql, rewrite) => {
      const db = new SQL.Database();
      try {
        sqlCheck.registerSqlFunctions(db);
        db.run(content.schemas.fahrschule.seed);
        const result = db.exec(rewrite ? feedback.rewriteMysql(sql) : sql);
        return { ok: true, text: (result.at(-1)?.values || []).map((row) => row.map((cell) => (cell === null ? "NULL" : String(cell))).join("\t")).join("\n") };
      } catch (error) {
        return { ok: false, error };
      } finally {
        db.close();
      }
    };
    mysql(`CREATE DATABASE wbl_lab CHARACTER SET utf8mb4; USE wbl_lab; ${content.schemas.fahrschule.seed.replace(/PRAGMA foreign_keys = ON;/g, "")}`);
    const labNative = (sql) => mysql(`USE wbl_lab; ${sql}`);
    const labEqual = [
      "SELECT schuelernr, DAY(geburtsdatum), DAYOFMONTH(geburtsdatum) FROM fahrschueler ORDER BY schuelernr;",
      "SELECT DAY('2026-10-09 14:05:09'), DAY(NULL), DAY('kein Datum');",
      "SELECT LENGTH(CURDATE()), LENGTH(NOW()), YEAR(CURDATE()) = YEAR(NOW()), CURDATE() = LEFT(NOW(), 10);",
      "SELECT schuelernr, DATE_FORMAT(geburtsdatum, '%d.%m.%Y') FROM fahrschueler ORDER BY schuelernr;",
      "SELECT DATE_FORMAT('2026-10-09 14:05:09', '%Y-%m-%d %H:%i:%s'), DATE_FORMAT('2026-10-09 14:05:09', '%e.%c.%y %k:%i');",
      "SELECT DATE_FORMAT('2026-03-05 00:07:00', '%h %I %l %p %T'), DATE_FORMAT('2026-03-05 12:07:00', '%h %p'), DATE_FORMAT('2026-03-05 23:07:00', '%h %l %p');",
      "SELECT DATE_FORMAT('2026-10-09', '%W, %d. %M %Y'), DATE_FORMAT('2026-10-09', '%a %b'), DATE_FORMAT('2026-10-09', '100%% %Q %S');",
      "SELECT DATE_FORMAT(NULL, '%Y'), DATE_FORMAT('2026-10-09', NULL), DATE_FORMAT('2026-02-31', '%d'), DATE_FORMAT('unsinn', '%d');",
      "SELECT fahrstundennr, DATE_FORMAT(datum, '%Y-%m') FROM fahrstunden ORDER BY fahrstundennr LIMIT 4;",
      "SELECT kfznr, FORMAT(anschaffungspreis, 2), FORMAT(anschaffungspreis, 0) FROM kfz ORDER BY kfznr;",
      "SELECT FORMAT(1234567.891, 2), FORMAT(0.5, 0), FORMAT(1.5, 0), FORMAT(-1234.5, 1), FORMAT(12, 3), FORMAT(NULL, 2);",
      "SELECT MOD(5, 2), MOD(-5, 2), MOD(5, -2), MOD(5, 0), MOD(NULL, 2), MOD(5.5, 2);",
      "SELECT TRUNCATE(3.14159, 2), TRUNCATE(-3.999, 1), TRUNCATE(1234.5, -2), TRUNCATE(1.15, 2), TRUNCATE(NULL, 1), TRUNCATE(5, 0);",
      "SELECT CEILING(2.1), CEIL(-2.1), FLOOR(2.9), FLOOR(-2.1), CEILING(3), CEILING(NULL);",
      "SELECT POWER(2, 3), POW(2, 10), SQRT(16), SQRT(-1), POWER(NULL, 2);",
      "SELECT ROUND(2.5), ROUND(3.5), ROUND(-2.5), ROUND(3.14159, 2), ROUND(AVG(anschaffungspreis), 2) FROM kfz;",
      "SELECT UPPER('müller'), LOWER('MÜLLER'), UPPER('Straße'), LOWER('STRASSE'), UPPER('äöü éà'), UPPER(NULL), LOWER(NULL);",
      "SELECT schuelernr, UPPER(nachname), LOWER(vorname) FROM fahrschueler ORDER BY schuelernr;",
      "SELECT CHAR_LENGTH('Müller'), CHARACTER_LENGTH('Straße'), CHAR_LENGTH(''), CHAR_LENGTH(NULL), CHAR_LENGTH(12345);",
      "SELECT LEFT('Stuttgart', 3), RIGHT('Stuttgart', 4), LEFT('Müller', 2), RIGHT('Müller', 20), LEFT('abc', 0), RIGHT('abc', 0), LEFT('abc', -1), LEFT(NULL, 2), LEFT('abc', NULL);",
      "SELECT schuelernr, CONCAT(vorname, ' ', nachname), CONCAT(LEFT(vorname, 1), '. ', nachname) FROM fahrschueler ORDER BY schuelernr;",
      "SELECT CONCAT('a', NULL, 'b'), CONCAT('a'), CONCAT('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'), CONCAT(1, 2), CONCAT('Nr. ', 5), CONCAT(schuelernr, '-', ortnr) FROM fahrschueler WHERE schuelernr = 1;",
      "SELECT kfznr, CONCAT(kennzeichen, ': ', FORMAT(anschaffungspreis, 2), ' EUR') FROM kfz ORDER BY kfznr;",
      "SELECT nachname FROM fahrschueler WHERE UPPER(nachname) = 'MAIER' ORDER BY schuelernr;",
      "SELECT nachname FROM fahrschueler WHERE LEFT(nachname, 1) = 'M' ORDER BY schuelernr;",
      "SELECT ortnr, COUNT(*) FROM fahrschueler GROUP BY ortnr HAVING MOD(COUNT(*), 2) = 0 ORDER BY ortnr;",
      "SELECT schuelernr, TIMESTAMPDIFF(YEAR, geburtsdatum, '2026-10-09') FROM fahrschueler ORDER BY schuelernr;",
      "SELECT TIMESTAMPDIFF(YEAR, '2008-10-09', '2026-10-09'), TIMESTAMPDIFF(YEAR, '2008-10-10', '2026-10-09'), TIMESTAMPDIFF(YEAR, '2026-10-09', '2008-10-10'), TIMESTAMPDIFF(YEAR, '2004-02-29', '2026-02-28');",
      "SELECT TIMESTAMPDIFF(MONTH, '2026-01-31', '2026-02-28'), TIMESTAMPDIFF(MONTH, '2026-01-15', '2026-10-09'), TIMESTAMPDIFF(MONTH, '2026-10-09', '2026-01-15'), TIMESTAMPDIFF(QUARTER, '2025-01-01', '2026-10-09');",
      "SELECT TIMESTAMPDIFF(DAY, '2026-10-01', '2026-10-09'), TIMESTAMPDIFF(DAY, '2026-10-09', '2026-10-01'), TIMESTAMPDIFF(WEEK, '2026-09-01', '2026-10-09'), TIMESTAMPDIFF(DAY, '2026-10-01 12:00:00', '2026-10-09 11:59:59');",
      "SELECT TIMESTAMPDIFF(HOUR, '2026-10-09 08:00:00', '2026-10-09 13:45:00'), TIMESTAMPDIFF(MINUTE, '2026-10-09 08:00:00', '2026-10-09 13:45:00'), TIMESTAMPDIFF(SECOND, '2026-10-09 08:00:00', '2026-10-09 08:01:01');",
      "SELECT TIMESTAMPDIFF(YEAR, NULL, '2026-10-09'), TIMESTAMPDIFF(DAY, 'unsinn', '2026-10-09');",
      "select timestampdiff( year , geburtsdatum, '2026-10-09') from fahrschueler order by schuelernr limit 2;",
      "SELECT schuelernr, YEAR(geburtsdatum), MONTH(geburtsdatum), DATEDIFF('2026-10-09', geburtsdatum) FROM fahrschueler ORDER BY schuelernr;",
      "SELECT COUNT(*), SUM(stundenzahl), MIN(datum), MAX(datum) FROM fahrstunden;",
      "CREATE TABLE kurse (kursnr INT AUTO_INCREMENT PRIMARY KEY, titel VARCHAR(50) NOT NULL); INSERT INTO kurse (titel) VALUES ('A'), ('B'); SELECT kursnr, titel FROM kurse ORDER BY kursnr;",
      "CREATE TABLE kurse2 (kursnr INT NOT NULL AUTO_INCREMENT, titel VARCHAR(50), PRIMARY KEY (kursnr)); INSERT INTO kurse2 (titel) VALUES ('A'), ('B'); SELECT kursnr FROM kurse2 ORDER BY kursnr;",
      "CREATE TABLE kurse3 (kursnr INT(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, preis DECIMAL(6,2), start DATE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; INSERT INTO kurse3 (preis, start) VALUES (12.5, '2026-10-09'); SELECT kursnr, start FROM kurse3;",
      "CREATE TABLE `kurse4` (`kursnr` INTEGER AUTO_INCREMENT PRIMARY KEY, `titel` VARCHAR(50) DEFAULT 'INT AUTO_INCREMENT') ENGINE = InnoDB; INSERT INTO kurse4 (kursnr) VALUES (7); SELECT kursnr, titel FROM kurse4;"
    ];
    for (const sql of labEqual) {
      const browser = runLab(sql, true);
      check(`Browser-Labor wie MariaDB: ${sql.slice(0, 90)}`, browser.ok && browser.text === labNative(sql));
    }
    // Gültiges MySQL, das im Browser nicht läuft: MariaDB führt es aus, der Browser erklärt es.
    const mysqlOnly = [
      ["SELECT TIMESTAMPDIFF(YEAR, '2008-03-12', '2026-10-09');", /TIMESTAMPDIFF ist gültiges MySQL/, false],
      ["SELECT DATE_ADD('2026-10-09', INTERVAL 7 DAY);", /Datumsrechnung mit INTERVAL/, true],
      ["SELECT '2026-10-09' + INTERVAL 1 MONTH;", /Datumsrechnung mit INTERVAL/, true],
      ["INSERT INTO orte SET ortnr = 93, plz = '70003', ort = 'Mit SET';", /INSERT … SET ist eine MySQL-Kurzform/, true],
      ["ALTER TABLE kfz MODIFY kennzeichen VARCHAR(80);", /MODIFY und … CHANGE gibt es nur in MySQL/, true],
      ["CREATE TABLE nur_mysql_a (nr INT NOT NULL AUTO_INCREMENT, PRIMARY KEY (nr));", /AUTO_INCREMENT ist gültiges MySQL/, false],
      ["CREATE TABLE nur_mysql_b (nr INT PRIMARY KEY) ENGINE=InnoDB;", /ENGINE=InnoDB gibt es nur in MySQL/, false],
      ["SELECT 5 DIV 2;", /DIV \(ganzzahlige Division\)/, true]
    ];
    for (const [sql, hint, rewrite] of mysqlOnly) {
      const browser = runLab(sql, rewrite);
      check(`nur MySQL, läuft in MariaDB: ${sql}`, !mysql(`USE wbl_lab; ${sql}`, true).failed);
      check(`nur MySQL, Browser erklärt es: ${sql}`, !browser.ok && hint.test(feedback.explain(browser.error, content.schemas.fahrschule, sql).text));
    }
    const elsewhere = {
      DATABASE: "DATABASE()", USER: "USER()", MONTHNAME: "MONTHNAME('2026-10-09')", DAYNAME: "DAYNAME('2026-10-09')", WEEKDAY: "WEEKDAY('2026-10-09')",
      DAYOFWEEK: "DAYOFWEEK('2026-10-09')", DAYOFYEAR: "DAYOFYEAR('2026-10-09')", WEEK: "WEEK('2026-10-09')", QUARTER: "QUARTER('2026-10-09')",
      HOUR: "HOUR('12:34:56')", MINUTE: "MINUTE('12:34:56')", SECOND: "SECOND('12:34:56')", CURTIME: "CURTIME()", STR_TO_DATE: "STR_TO_DATE('09.10.2026', '%d.%m.%Y')",
      LAST_DAY: "LAST_DAY('2026-10-09')", IF: "IF(1 = 1, 'a', 'b')", LPAD: "LPAD('a', 3, 'x')", RPAD: "RPAD('a', 3, 'x')",
      REPEAT: "REPEAT('a', 2)", LOCATE: "LOCATE('b', 'abc')", RAND: "RAND()"
    };
    for (const [name, call] of Object.entries(elsewhere)) {
      const browser = runLab(`SELECT ${call};`, true);
      check(`${name}: in MariaDB vorhanden`, !mysql(`USE wbl_lab; SELECT ${call};`, true).failed);
      check(`${name}: im Browser nicht nachgebildet und so erklärt`, !browser.ok && /gibt es in MySQL; das Browser-Labor bildet sie nicht nach/.test(feedback.explain(browser.error, content.schemas.fahrschule, `SELECT ${call};`).text));
    }
    check("Liste der nicht nachgebildeten Funktionen ist vollständig gemessen", JSON.stringify(Object.keys(elsewhere).sort()) === JSON.stringify(Array.from(feedback.MYSQL_FUNCTIONS_ELSEWHERE).sort()));
    // Gemessene Unterschiede, auf die das Labor hinweist.
    const aliasWhere = "SELECT nachname AS name FROM fahrschueler WHERE name = 'Maier';";
    check("Alias in WHERE: MariaDB lehnt ab, Browser nimmt an, Hinweis erscheint", mysql(`USE wbl_lab; ${aliasWhere}`, true).failed && runLab(aliasWhere, true).ok && feedback.mysqlNotes(aliasWhere, 0).includes("alias-where"));
    const aliasHaving = "SELECT ortnr, COUNT(*) AS anzahl FROM fahrschueler GROUP BY ortnr HAVING anzahl > 1 ORDER BY ortnr;";
    check("Alias in HAVING: in beiden gleich, kein Hinweis", runLab(aliasHaving, true).text === labNative(aliasHaving) && !feedback.mysqlNotes(aliasHaving, 3).includes("alias-where"));
    const average = "SELECT AVG(stundenzahl) FROM fahrstunden;";
    check("AVG: unterschiedliche Stellenzahl, Hinweis erscheint", runLab(average, true).text !== labNative(average) && Math.abs(Number(runLab(average, true).text) - Number(labNative(average))) < 0.0001 && feedback.mysqlNotes(average, 1).includes("avg-stellen"));
    const rounded = "SELECT ROUND(AVG(stundenzahl), 2) FROM fahrstunden;";
    check("ROUND(AVG): in beiden gleich, kein Hinweis", runLab(rounded, true).text === labNative(rounded) && !feedback.mysqlNotes(rounded, 1).includes("avg-stellen"));
    // OPT-25: genuine schemas, same-named tables, aliases and FK targets.
    const workspaceDb = new SQL.Database();
    sqlCheck.registerSqlFunctions(workspaceDb);
    const workspace = context.window.WORKBENCH_SQL_WORKSPACE.create(workspaceDb, new Parser(), feedback);
    const workspaceSetup = `CREATE DATABASE wbl_ws_a; CREATE DATABASE wbl_ws_b;
      USE wbl_ws_a; CREATE TABLE orte (id INT PRIMARY KEY AUTO_INCREMENT, ort VARCHAR(50));
      INSERT INTO orte(ort) VALUES('A'),('B');
      CREATE TABLE kinder (id INT PRIMARY KEY, ortnr INT, FOREIGN KEY(ortnr) REFERENCES orte(id));
      INSERT INTO kinder VALUES(1,2);
      USE wbl_ws_b; CREATE TABLE orte (id INT PRIMARY KEY, ort VARCHAR(50)); INSERT INTO orte VALUES(9,'C');`;
    try {
      mysql(workspaceSetup);
      workspace.exec(workspaceSetup);
      const queries = [
        "SELECT wbl_ws_a.orte.id, wbl_ws_b.orte.id FROM wbl_ws_a.orte CROSS JOIN wbl_ws_b.orte ORDER BY 1,2;",
        "SELECT a.ort,b.ort FROM wbl_ws_a.orte a CROSS JOIN wbl_ws_b.orte b ORDER BY a.id;",
        "USE wbl_ws_a; SELECT orte.id,orte.ort FROM orte ORDER BY id;",
        "USE wbl_ws_b; SELECT DATABASE(),id,ort FROM orte;",
        "SELECT o.id FROM wbl_ws_a.orte o WHERE EXISTS(SELECT 1 FROM wbl_ws_a.kinder k WHERE k.ortnr=o.id);",
        "SELECT t.id FROM wbl_ws_a.orte t WHERE t.id IN (SELECT t.ortnr FROM wbl_ws_a.kinder t);",
        "SELECT 'USE wbl_ws_a; wbl_ws_b.orte' AS textwert;",
        "UPDATE wbl_ws_a.orte SET ort='Neu' WHERE orte.id=1; SELECT ort FROM wbl_ws_a.orte ORDER BY id;",
        "SELECT HEX('O\\'Brien'), HEX('O''Brien'), HEX('C:\\\\tmp'), HEX('a\\nb');",
        "CREATE TABLE wbl_ws_b.folge(id INT PRIMARY KEY AUTO_INCREMENT, n INT); INSERT INTO wbl_ws_b.folge(n) VALUES(1),(2); DELETE FROM wbl_ws_b.folge WHERE id=2; INSERT INTO wbl_ws_b.folge(n) VALUES(3); SELECT id,n FROM wbl_ws_b.folge ORDER BY id;",
        "USE wbl_ws_b; ALTER TABLE wbl_ws_b.folge RENAME TO fortsetzung; SELECT id,n FROM wbl_ws_b.fortsetzung ORDER BY id;",
        "TRUNCATE TABLE wbl_ws_b.fortsetzung; INSERT INTO wbl_ws_b.fortsetzung(n) VALUES(9); SELECT id,n FROM wbl_ws_b.fortsetzung;"
      ];
      for (const sql of queries) check(`Workspace wie MariaDB: ${sql}`, same(rows(mysql(sql)), workspace.exec(sql).at(-1)?.values || []));
      const badFk = "INSERT INTO wbl_ws_a.kinder VALUES(2,999);";
      check("Workspace und MariaDB lehnen ungültigen FK ab", mysql(badFk, true).failed && (() => { try { workspace.exec(badFk); return false; } catch { return true; } })());
      const badSchema = "USE wbl_ws_missing;";
      check("Workspace und MariaDB lehnen unbekannte Datenbank ab", mysql(badSchema, true).failed && (() => { try { workspace.exec(badSchema); return false; } catch { return true; } })());
      const badDescribe = "USE wbl_ws_b; DESCRIBE missing;";
      check("Workspace und MariaDB lehnen DESCRIBE einer fehlenden Tabelle ab", mysql(badDescribe, true).failed && (() => { try { workspace.exec(badDescribe); return false; } catch { return true; } })());
      const crossFk = "CREATE TABLE wbl_ws_b.extern(id INT, parent INT, FOREIGN KEY(parent) REFERENCES wbl_ws_a.orte(id));";
      mysql(crossFk);
      workspace.exec(crossFk);
      for (const sql of ["TRUNCATE TABLE wbl_ws_a.orte;", "DROP DATABASE wbl_ws_a;"]) {
        check(`Workspace und MariaDB schützen externe Fremdschlüssel: ${sql}`, mysql(sql, true).failed && (() => { try { workspace.exec(sql); return false; } catch { return true; } })());
      }
    } finally { workspace.close(); }
    console.log(JSON.stringify(report, null, 1));
    console.log(`PASS: ${report.checks} native Prüfungen gegen ${version}`);
  } finally {
    spawnSync(bin("mysqladmin"), [...connection, "shutdown"], { encoding: "utf8", windowsHide: true, timeout: 20000 });
    await Promise.race([finished, sleep(15000)]);
    if (!exited) server.kill();
    await sleep(500);
    fs.rmSync(output, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
