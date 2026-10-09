// Claude, OPT-01/OPT-02/OPT-13: deutsche SQL-Meldungen, MySQL-Komfortbefehle, Versionsgleichstand.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js", "practical-exercises.js", "sql-feedback.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const content = context.window.WORKBENCH_CONTENT;
const feedback = context.window.WORKBENCH_SQL_FEEDBACK;
const init = () => initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });

async function errorOf(schemaKey, sql) {
  const SQL = await init();
  const db = new SQL.Database();
  db.run(content.schemas[schemaKey].seed);
  try {
    db.exec(sql);
  } catch (error) {
    return feedback.explain(error, content.schemas[schemaKey]);
  } finally {
    db.close();
  }
  throw new Error(`Kein Fehler für: ${sql}`);
}

test("Tippfehler in Spalte und Tabelle werden deutsch erklärt und mit Vorschlag versehen", async () => {
  const column = await errorOf("fahrschule-basic", "SELECT nachnam FROM fahrschueler;");
  assert.match(column.text, /Die Spalte nachnam wurde nicht gefunden/);
  assert.match(column.text, /Meintest du nachname\?/);
  assert.match(column.original, /no such column/);

  const table = await errorOf("fahrschule-basic", "SELECT * FROM fahrschuler;");
  assert.match(table.text, /Die Tabelle fahrschuler gehört nicht zum Übungsschema/);
  assert.match(table.text, /Meintest du fahrschueler\?/);

  const alias = await errorOf("fahrschule", "SELECT f.vornam FROM fahrschueler f;");
  assert.match(alias.text, /Die Spalte vornam /);
  assert.equal(alias.suggestion, "vorname");
});

test("Fehlendes FROM, fehlende Anführungszeichen und unvollständige Eingaben bleiben verständlich", async () => {
  const noFrom = await errorOf("fahrschule-basic", "SELECT nachname fahrschueler WHERE;");
  assert.match(noFrom.text, /Satzbau|unvollständig/);

  const unquoted = await errorOf("fahrschule-basic", "SELECT * FROM fahrschueler WHERE ort = Stuttgart;");
  assert.match(unquoted.text, /einfache Anführungszeichen/);
  assert.equal(unquoted.suggestion, "");

  const open = await errorOf("fahrschule-basic", "SELECT * FROM fahrschueler WHERE ort = 'Stuttgart;");
  assert.match(open.text, /Anführungszeichen|unvollständig/);

  const incomplete = await errorOf("fahrschule-basic", "SELECT * FROM fahrschueler WHERE");
  assert.match(incomplete.text, /unvollständig/);
});

test("Schlüssel-, Integritäts- und Mehrdeutigkeitsfehler werden fachlich benannt", async () => {
  const unique = await errorOf("fahrschule", "INSERT INTO orte SELECT * FROM orte;");
  assert.match(unique.text, /Schlüssel ist bereits vergeben/);

  const foreign = await errorOf("fahrschule", "DELETE FROM orte;");
  assert.match(foreign.text, /referentielle Integrität/);

  const ambiguous = await errorOf("fahrschule", "SELECT ortnr FROM fahrschueler JOIN orte ON fahrschueler.ortnr = orte.ortnr;");
  assert.match(ambiguous.text, /kommt in mehreren Tabellen vor/);

  const aggregate = await errorOf("fahrschule-basic", "SELECT ort FROM fahrschueler WHERE COUNT(*) > 1;");
  assert.match(aggregate.text, /HAVING/);
});

test("Unbekannte Meldungen und Nicht-SQL-Fehler bleiben unverändert ohne doppelte Originalzeile", () => {
  const plain = feedback.explain(new Error("Schreibe zuerst eine SQL-Anweisung."), content.schemas.fahrschule);
  assert.equal(plain.text, "Schreibe zuerst eine SQL-Anweisung.");
  assert.equal(plain.original, "");
  assert.ok(feedback.explain(null, null).text.length > 10);
});

test("Vorschläge sind vorsichtig: keine Treffer bei kurzen oder weit entfernten Namen", () => {
  assert.equal(feedback.closest("ab", ["abc"]), "");
  assert.equal(feedback.closest("xyzxyz", ["nachname", "vorname"]), "");
  assert.equal(feedback.closest("PLZZ", ["plz", "ort"]), "plz");
  assert.equal(feedback.closest("nachname", ["nachname"]), "");
});

test("SHOW TABLES und DESCRIBE laufen im Browser-Labor; anderes SQL bleibt unverändert", async () => {
  const SQL = await init();
  const db = new SQL.Database();
  db.run(content.schemas.fahrschule.seed);
  try {
    const tables = db.exec(feedback.rewriteMysql("show tables;"))[0];
    assert.deepEqual(tables.values.map((row) => row[0]), ["fahrlehrer", "fahrschueler", "fahrstunden", "kfz", "orte"]);
    const fields = db.exec(feedback.rewriteMysql("DESCRIBE orte"))[0];
    assert.deepEqual(fields.columns, ["Feld", "Typ", "Null", "Schluessel"]);
    assert.deepEqual(fields.values.map((row) => row[0]), ["ortnr", "plz", "ort"]);
    assert.equal(fields.values[0][3], "PRI");
  } finally {
    db.close();
  }
  const untouched = "SELECT * FROM orte; DESCRIBE orte;";
  assert.equal(feedback.rewriteMysql(untouched), untouched);
  assert.equal(feedback.rewriteMysql("DESCRIBE orte'; DROP TABLE orte; --"), "DESCRIBE orte'; DROP TABLE orte; --");
});

test("Alle Cache-Parameter, die App-Version und package.json nennen denselben Stand", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;
  const stamps = [...html.matchAll(/(?:href|src)="([^"?]+\.(?:js|css))\?v=([^"]+)"/g)];
  assert.ok(stamps.length >= 12);
  for (const [, file, stamp] of stamps) assert.equal(stamp, version, file);
  assert.equal(content.version, version);
  const { isPublicFile } = require("../tools/build-site.cjs");
  for (const [, file] of stamps) assert.equal(isPublicFile(file), true, file);
  assert.ok(html.indexOf('src="sql-feedback.js') < html.indexOf('src="app.js'));
});

test("Hinweise auf MySQL-Unterschiede: nur bei passenden Anweisungen, nie wegen Text in Anführungszeichen", () => {
  const notes = (sql, rows) => Array.from(feedback.mysqlNotes(sql, rows));
  assert.deepEqual(notes("SELECT fahrstunden / 4 FROM fahrschueler;", 11), ["division"]);
  assert.deepEqual(notes("SELECT SUM(fahrstunden)/COUNT(*) FROM fahrschueler;", 1), ["division"]);
  assert.deepEqual(notes("SELECT fahrstunden / 4.0 FROM fahrschueler;", 11), []);
  assert.deepEqual(notes("SELECT 7.0 / 2;", 1), []);
  assert.deepEqual(notes("SELECT vorname || ' ' || nachname FROM fahrschueler;", 11), ["verkettung"]);
  assert.deepEqual(notes("SELECT * FROM fahrschueler WHERE ort = 'stuttgart';", 0), ["gross-klein"]);
  assert.deepEqual(notes("SELECT * FROM fahrschueler WHERE ort IN ('stuttgart', 'ulm');", 0), ["gross-klein"]);
  assert.deepEqual(notes("SELECT * FROM fahrschueler WHERE ort = 'Stuttgart';", 4), []);
  assert.deepEqual(notes("SELECT * FROM fahrschueler WHERE fahrstunden = 99;", 0), []);
  assert.deepEqual(notes("SELECT 'a / b', '||' FROM fahrschueler; -- 7 / 2 || x", 11), []);
  assert.deepEqual(notes("SELECT /* 7 / 2 */ nachname FROM fahrschueler;", 11), []);
  assert.deepEqual(notes("SELECT * FROM fahrschueler;", 11), []);
  assert.deepEqual(notes(null, 0), []);
  assert.equal(feedback.MYSQL_DIFFERENCES.length, 6);
  assert.equal(Array.from(feedback.MYSQL_DIFFERENCES).filter((item) => item.listed !== false).length, 5);
  for (const item of feedback.MYSQL_DIFFERENCES) assert.ok(item.id && item.title && item.text.length > 60);
});

test("die Browser-Seite der drei gemessenen Unterschiede stimmt weiterhin", async () => {
  const SQL = await init();
  const db = new SQL.Database();
  db.run(content.schemas["fahrschule-basic"].seed);
  const value = (sql) => db.exec(sql)[0].values[0][0];
  try {
    assert.equal(value("SELECT 7 / 2;"), 3);
    assert.equal(value("SELECT 7 / 2.0;"), 3.5);
    assert.equal(value("SELECT COUNT(*) FROM fahrschueler WHERE ort = 'stuttgart';"), 0);
    assert.equal(value("SELECT COUNT(*) FROM fahrschueler WHERE ort = 'Stuttgart';"), 4);
    assert.equal(value("SELECT vorname || ' ' || nachname FROM fahrschueler WHERE schuelernr = 1;"), "Mia Keller");
    assert.equal(value("SELECT CONCAT(vorname, ' ', nachname) FROM fahrschueler WHERE schuelernr = 1;"), "Mia Keller");
  } finally {
    db.close();
  }
});

// Claude, 0.41.0: MySQL-Nähe des Browser-Labors.
test("rewriteMysql macht TIMESTAMPDIFF, AUTO_INCREMENT und Tabellenoptionen im Browser-Labor ausführbar", async () => {
  const rewrite = feedback.rewriteMysql;
  assert.equal(rewrite("SELECT TIMESTAMPDIFF(YEAR, geburtsdatum, NOW()) FROM fahrschueler;"), "SELECT TIMESTAMPDIFF('YEAR', geburtsdatum, NOW()) FROM fahrschueler;");
  assert.equal(rewrite("select timestampdiff( month , a, b)"), "select TIMESTAMPDIFF('month', a, b)");
  assert.equal(rewrite("CREATE TABLE k (nr INT AUTO_INCREMENT PRIMARY KEY, t VARCHAR(5));"), "CREATE TABLE k (nr INTEGER PRIMARY KEY, t VARCHAR(5));");
  assert.equal(rewrite("CREATE TABLE k (nr INT(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"), "CREATE TABLE k (nr INTEGER NOT NULL PRIMARY KEY);");
  assert.equal(rewrite("CREATE TABLE k (nr INTEGER NOT NULL AUTO_INCREMENT, PRIMARY KEY (nr)) ENGINE = InnoDB"), "CREATE TABLE k (nr INTEGER NOT NULL, PRIMARY KEY (nr))");
  // Textwerte, Kommentare und gewöhnliche Anweisungen bleiben unverändert.
  for (const untouched of [
    "SELECT 'TIMESTAMPDIFF(YEAR, a, b)' FROM orte;",
    "SELECT * FROM orte; -- TIMESTAMPDIFF(YEAR, a, b)",
    "INSERT INTO orte VALUES (9, '70000', 'nr INT AUTO_INCREMENT PRIMARY KEY');",
    "SELECT ort FROM orte WHERE ortnr IN (1) ORDER BY ort;",
    "UPDATE orte SET ort = 'ENGINE=InnoDB' WHERE ortnr = 1;",
    "CREATE TABLE k (nr INTEGER PRIMARY KEY, t VARCHAR(5) DEFAULT 'INT AUTO_INCREMENT');"
  ]) {
    assert.equal(rewrite(untouched), untouched);
  }
  const SQL = await init();
  const db = new SQL.Database();
  try {
    db.run(rewrite("CREATE TABLE kurse (kursnr INT NOT NULL AUTO_INCREMENT, titel VARCHAR(50), PRIMARY KEY (kursnr)) ENGINE=InnoDB;"));
    db.run("INSERT INTO kurse (titel) VALUES ('A'), ('B');");
    assert.deepEqual(db.exec("SELECT kursnr FROM kurse ORDER BY kursnr;")[0].values, [[1], [2]]);
  } finally {
    db.close();
  }
});

test("Fehlermeldungen erkennen gültiges MySQL, das der Browser nicht kann, und Tippfehler bei Funktionen", () => {
  const explain = (message, sql) => feedback.explain(new Error(message), content.schemas.fahrschule, sql);
  assert.match(explain("no such column: YEAR", "SELECT TIMESTAMPDIFF(YEAR, geburtsdatum, NOW()) FROM fahrschueler;").text, /TIMESTAMPDIFF ist gültiges MySQL/);
  assert.match(explain('near "7": syntax error', "SELECT DATE_ADD(datum, INTERVAL 7 DAY) FROM fahrstunden;").text, /Datumsrechnung mit INTERVAL/);
  assert.match(explain('near "SET": syntax error', "INSERT INTO orte SET ortnr = 9;").text, /INSERT … SET ist eine MySQL-Kurzform/);
  assert.match(explain('near "MODIFY": syntax error', "ALTER TABLE orte MODIFY ort VARCHAR(80);").text, /nur in MySQL/);
  assert.match(explain('near "AUTO_INCREMENT": syntax error', "CREATE TABLE k (nr INT NOT NULL AUTO_INCREMENT, PRIMARY KEY (nr));").text, /INTEGER PRIMARY KEY/);
  assert.match(explain('near "=": syntax error', "CREATE TABLE k (nr INT PRIMARY KEY) ENGINE=InnoDB;").text, /ENGINE=InnoDB gibt es nur in MySQL/);
  assert.match(explain('near "2": syntax error', "SELECT 5 DIV 2;").text, /DIV \(ganzzahlige Division\)/);
  // Die Originalmeldung bleibt sichtbar.
  assert.equal(explain('near "2": syntax error', "SELECT 5 DIV 2;").original, 'near "2": syntax error');
  // Kein MySQL-Hinweis, wenn das Wort nur in einem Textwert steht oder der Fehler ein anderer ist.
  assert.doesNotMatch(explain('near "FROM": syntax error', "SELECT 'DIV', FROM orte;").text, /DIV/);
  assert.match(explain("no such table: ortee", "SELECT 5 DIV 2 FROM ortee;").text, /gehört nicht zum Übungsschema/);
  assert.match(explain('near "FRM": syntax error', "SELECT * FRM orte;").text, /Satzbau/);
  // Ohne Anweisung verhält sich explain wie bisher.
  assert.match(explain('near "2": syntax error').text, /Satzbau/);
  // Funktionen: in MySQL vorhanden, hier nicht nachgebildet – oder vertippt.
  const elsewhere = explain("no such function: MONTHNAME", "SELECT MONTHNAME(datum) FROM fahrstunden;");
  assert.match(elsewhere.text, /gibt es in MySQL; das Browser-Labor bildet sie nicht nach/);
  assert.equal(elsewhere.suggestion, "");
  const typo = explain("no such function: COUT", "SELECT COUT(*) FROM orte;");
  assert.equal(typo.suggestion, "COUNT");
  assert.match(typo.text, /Meintest du COUNT\?/);
  assert.equal(explain("no such function: CONCATT", "SELECT CONCATT(a, b);").suggestion, "CONCAT");
  assert.equal(explain("no such function: QWERTZ", "SELECT QWERTZ(1);").suggestion, "");
  for (const name of feedback.MYSQL_FUNCTIONS_ELSEWHERE) assert.equal(Array.from(feedback.KNOWN_FUNCTIONS).includes(name), false, name);
});

test("Alle als bekannt genannten Funktionen laufen im Browser-Labor wirklich", async () => {
  const samples = {
    COUNT: "COUNT(*)", SUM: "SUM(ortnr)", AVG: "AVG(ortnr)", MIN: "MIN(ort)", MAX: "MAX(ort)", ROUND: "ROUND(2.345, 2)", YEAR: "YEAR('2026-10-09')", MONTH: "MONTH('2026-10-09')",
    DAY: "DAY('2026-10-09')", NOW: "NOW()", CURDATE: "CURDATE()", DATEDIFF: "DATEDIFF('2026-10-09', '2026-10-01')", DATE_FORMAT: "DATE_FORMAT('2026-10-09', '%d.%m.%Y')",
    CONCAT: "CONCAT('a', 'b')", UPPER: "UPPER('a')", LOWER: "LOWER('A')", LENGTH: "LENGTH('abc')", CHAR_LENGTH: "CHAR_LENGTH('abc')", LEFT: "LEFT('abc', 1)", RIGHT: "RIGHT('abc', 1)",
    SUBSTRING: "SUBSTRING('abc', 1, 2)", REPLACE: "REPLACE('abc', 'b', 'x')", TRIM: "TRIM(' a ')", COALESCE: "COALESCE(NULL, 1)", IFNULL: "IFNULL(NULL, 1)", FORMAT: "FORMAT(1234.5, 2)",
    MOD: "MOD(5, 2)", TRUNCATE: "TRUNCATE(1.29, 1)", CEILING: "CEILING(1.2)", FLOOR: "FLOOR(1.8)", ABS: "ABS(-1)", POWER: "POWER(2, 3)", SQRT: "SQRT(9)"
  };
  assert.deepEqual(Object.keys(samples).sort(), Array.from(feedback.KNOWN_FUNCTIONS).sort());
  const labContext = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(path.join(root, "sql-check.js"), "utf8"), labContext, { filename: "sql-check.js" });
  const SQL = await init();
  const db = new SQL.Database();
  try {
    labContext.window.WORKBENCH_SQL_CHECK.registerSqlFunctions(db);
    db.run(content.schemas.fahrschule.seed);
    for (const [name, call] of Object.entries(samples)) {
      assert.doesNotThrow(() => db.exec(`SELECT ${call} FROM orte;`), name);
    }
  } finally {
    db.close();
  }
});

test("Neue Hinweise: Alias in WHERE, AVG ohne Runden, AUTO_INCREMENT", () => {
  const notes = (sql, rows) => Array.from(feedback.mysqlNotes(sql, rows));
  assert.deepEqual(notes("SELECT nachname AS name FROM fahrschueler WHERE name = 'Maier';", 1), ["alias-where"]);
  assert.deepEqual(notes("SELECT stundenzahl * 45 AS minuten FROM fahrstunden WHERE minuten > 60 ORDER BY minuten;", 3), ["alias-where"]);
  // Tabellenalias, Alias nur in HAVING oder ORDER BY, Alias nur als Text: kein Hinweis.
  assert.deepEqual(notes("SELECT s.nachname AS name FROM fahrschueler AS s WHERE s.ortnr = 1 ORDER BY name;", 2), []);
  assert.deepEqual(notes("SELECT ortnr, COUNT(*) AS anzahl FROM fahrschueler GROUP BY ortnr HAVING anzahl > 1;", 3), []);
  assert.deepEqual(notes("SELECT nachname AS name FROM fahrschueler WHERE nachname = 'name';", 0), ["gross-klein"]);
  assert.deepEqual(notes("SELECT COUNT(*) AS anzahl FROM fahrschueler WHERE ortnr = 1;", 1), []);
  assert.deepEqual(notes("SELECT AVG(stundenzahl) FROM fahrstunden;", 1), ["avg-stellen"]);
  assert.deepEqual(notes("SELECT ROUND(AVG(stundenzahl), 2) FROM fahrstunden;", 1), []);
  assert.deepEqual(notes("SELECT 'AVG(x)' FROM fahrstunden;", 1), []);
  assert.deepEqual(notes("CREATE TABLE k (nr INT AUTO_INCREMENT PRIMARY KEY);"), ["auto-increment"]);
  assert.deepEqual(notes("CREATE TABLE k (nr INTEGER PRIMARY KEY);"), []);
  assert.deepEqual(notes("INSERT INTO k VALUES ('AUTO_INCREMENT');"), []);
});
