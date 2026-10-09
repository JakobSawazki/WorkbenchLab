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

const root = path.resolve(__dirname, "..");
const base = process.env.WORKBENCH_MARIADB_HOME || "C:/Informatik-Stick/Programme/Xampp_7.4.7/mysql";
const bin = (name) => path.join(base, "bin", `${name}.exe`);
const port = 33399;
const output = fs.mkdtempSync(path.join(os.tmpdir(), "workbenchlab-claude-native-"));
const data = path.join(output, "data");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const connection = ["--no-defaults", "--protocol=TCP", "--host=127.0.0.1", `--port=${port}`, "--user=root"];

function mysql(sql, expectFailure = false) {
  const result = spawnSync(bin("mysql"), [...connection, "--batch", "--skip-column-names", "--default-character-set=utf8mb4"], { input: sql, encoding: "utf8", windowsHide: true, timeout: 90000 });
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
for (const file of ["content.js", "learning-path.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js", "order-exercises.js", "erm-editor.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const content = context.window.WORKBENCH_CONTENT;
const erm = context.window.WORKBENCH_ERM;

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
      check(`${item.id}: Korrektur liefert in MariaDB dasselbe wie im Browser`, same(fixed, sqlite(item.schema, item.check.expectedSql)));
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
        const value = native(item.schema, question.verifySql.replace(/FROM \((SELECT[^;]+)\)(?=\s*(WHERE|;|$))/i, "FROM ($1) AS teil"));
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
      check(`${database}: Tabellen, Primär- und Fremdschlüssel angelegt`, tables === model.entities.length && keys === model.entities.length && foreign === model.relations.length);
    }
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
