// Claude, OPT-16 Schritt 1: die aus app.js ausgelagerte SQL-Prüflogik, erstmals direkt getestet.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, "sql-check.js"), "utf8"), context, { filename: "sql-check.js" });
const check = context.window.WORKBENCH_SQL_CHECK;
const plain = (value) => JSON.parse(JSON.stringify(value));

test("Ergebnisvergleich: Reihenfolge nur, wenn verlangt; Zahlen und NULL werden vereinheitlicht", () => {
  const a = { columns: ["x", "y"], values: [[1, "a"], [2, "b"]] };
  const swapped = { columns: ["x", "y"], values: [[2, "b"], [1, "a"]] };
  assert.equal(check.sameTable(a, a, true), true);
  assert.equal(check.sameTable(a, swapped, true), false);
  assert.equal(check.sameTable(a, swapped, false), true);
  assert.equal(check.sameTable({ values: [[1.0000001]] }, { values: [[1]] }, true), true);
  assert.equal(check.sameTable({ values: [[1.001]] }, { values: [[1]] }, true), false);
  assert.equal(check.sameTable({ values: [[null]] }, { values: [[undefined]] }, true), true);
  assert.equal(check.sameTable({ values: [["1"]] }, { values: [[1]] }, true), false);
  assert.equal(check.sameTable({ values: [] }, { values: [] }, true), true);
  // Spaltenüberschriften zählen beim Vergleich nicht, nur die Werte.
  assert.equal(check.sameTable({ columns: ["anzahl"], values: [[3]] }, { columns: ["COUNT(*)"], values: [[3]] }, true), true);
});

test("tableFromResult nimmt das letzte Ergebnis und verträgt leere Eingaben", () => {
  assert.deepEqual(plain(check.tableFromResult([{ columns: ["a"], values: [[1]] }, { columns: ["b"], values: [[2]] }])), { columns: ["b"], values: [[2]] });
  assert.deepEqual(plain(check.tableFromResult([])), { columns: [], values: [] });
  assert.deepEqual(plain(check.tableFromResult(null)), { columns: [], values: [] });
});

test("Aufbauprüfung meldet fehlende und unzulässige Bestandteile mit verständlichem Hinweis", () => {
  const rule = { required: ["select", "order\\s+by"], forbidden: ["select\\s+\\*"] };
  assert.deepEqual(plain(check.checkSqlPatterns("SELECT a FROM t ORDER BY a;", rule)), []);
  const missing = plain(check.checkSqlPatterns("SELECT a FROM t;", rule));
  assert.equal(missing.length, 1);
  assert.equal(missing[0].label, "Ergebnis sortieren");
  const star = plain(check.checkSqlPatterns("select * from t order by a", rule));
  assert.equal(star.length, 1);
  assert.equal(star[0].forbidden, true);
  assert.ok(star[0].hint.length > 10);
  assert.deepEqual(plain(check.checkSqlPatterns("irgendetwas", {})), []);
  const unknown = plain(check.checkSqlPatterns("x", { required: ["gibtesnicht"] }));
  assert.equal(unknown[0].label, "Aufgabenbestandteil ergänzen");
});

test("nachgebildete MySQL-Funktionen YEAR, MONTH und DATEDIFF rechnen richtig", async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const db = new SQL.Database();
  try {
    check.registerSqlFunctions(db);
    const value = (sql) => db.exec(sql)[0].values[0][0];
    assert.equal(value("SELECT YEAR('2008-03-12');"), 2008);
    assert.equal(value("SELECT MONTH('2008-03-12');"), 3);
    assert.equal(value("SELECT DATEDIFF('2026-10-05', '2026-10-01');"), 4);
    assert.equal(value("SELECT DATEDIFF('2026-10-01', '2026-10-05');"), -4);
    assert.equal(value("SELECT YEAR('kein Datum');"), null);
    assert.match(String(value("SELECT NOW();")), /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  } finally {
    db.close();
  }
});

test("sql-check.js wird vor app.js geladen, veröffentlicht und benutzt weder DOM noch Lernstand", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.ok(html.indexOf('src="sql-check.js') < html.indexOf('src="app.js'));
  assert.equal(require("../tools/build-site.cjs").isPublicFile("sql-check.js"), true);
  const source = fs.readFileSync(path.join(root, "sql-check.js"), "utf8");
  assert.doesNotMatch(source, /document\.|localStorage|state\./);
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  assert.doesNotMatch(app, /function sameTable|function checkSqlPatterns|function registerSqlFunctions|const sqlCoachPatterns/);
});

// Claude, 0.41.0: MySQL-Nähe des Browser-Labors. Die erwarteten Werte sind an der MariaDB 10.4.13 des
// Informatik-Sticks gemessen (tools/verify-claude-native.cjs, Abschnitt 7), nicht aus dem Kopf gesetzt.
test("MySQL-Funktionen, die SQLite fehlen: Datum, Text und Zahlen", async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const db = new SQL.Database();
  try {
    check.registerSqlFunctions(db);
    const row = (sql) => db.exec(sql)[0].values[0];
    assert.deepEqual(row("SELECT DAY('2008-03-12'), DAYOFMONTH('2026-10-09 14:05:09'), DAY(NULL), DAY('kein Datum');"), [12, 9, null, null]);
    assert.deepEqual(row("SELECT DATE_FORMAT('2008-03-12', '%d.%m.%Y'), DATE_FORMAT('2026-10-09 14:05:09', '%e.%c.%y %k:%i'), DATE_FORMAT('2026-10-09', '%W, %d. %M %Y');"),
      ["12.03.2008", "9.10.26 14:05", "Friday, 09. October 2026"]);
    assert.deepEqual(row("SELECT DATE_FORMAT('2026-03-05 00:07:00', '%h %I %l %p %T'), DATE_FORMAT('2026-03-05 23:07:00', '%h %l %p'), DATE_FORMAT('2026-10-09', '100%% %Q %S');"),
      ["12 12 12 AM 00:07:00", "11 11 PM", "100% Q 00"]);
    assert.deepEqual(row("SELECT DATE_FORMAT(NULL, '%Y'), DATE_FORMAT('2026-10-09', NULL), DATE_FORMAT('2026-02-31', '%d'), DATE_FORMAT('unsinn', '%d');"), [null, null, null, null]);
    assert.deepEqual(row("SELECT CHAR_LENGTH('Müller'), CHARACTER_LENGTH('Straße'), CHAR_LENGTH(''), CHAR_LENGTH(NULL), CHAR_LENGTH(12345);"), [6, 6, 0, null, 5]);
    assert.deepEqual(row("SELECT LEFT('Stuttgart', 3), RIGHT('Stuttgart', 4), LEFT('Müller', 2), RIGHT('Müller', 20), LEFT('abc', 0), RIGHT('abc', 0), LEFT('abc', -1), LEFT(NULL, 2), LEFT('abc', NULL);"),
      ["Stu", "gart", "Mü", "Müller", "", "", "", null, null]);
    assert.deepEqual(row("SELECT MOD(5, 2), MOD(-5, 2), MOD(5, -2), MOD(5, 0), MOD(NULL, 2), MOD(5.5, 2);"), [1, -1, 1, null, null, 1.5]);
    assert.deepEqual(row("SELECT TRUNCATE(3.14159, 2), TRUNCATE(-3.999, 1), TRUNCATE(1234.5, -2), TRUNCATE(1.15, 2), TRUNCATE(NULL, 1), TRUNCATE(5, 0);"), [3.14, -3.9, 1200, 1.15, null, 5]);
    assert.deepEqual(row("SELECT CEILING(2.1), CEIL(-2.1), FLOOR(2.9), FLOOR(-2.1), CEILING(3), CEILING(NULL);"), [3, -2, 2, -3, 3, null]);
    assert.deepEqual(row("SELECT POWER(2, 3), POW(2, 10), SQRT(16), SQRT(-1), POWER(NULL, 2);"), [8, 1024, 4, null, null]);
    assert.match(row("SELECT VERSION();")[0], /^SQLite \d+\.\d+\.\d+ \(Browser-Labor, nicht MySQL\)$/);
  } finally {
    db.close();
  }
});

test("MySQL-Funktionen, die SQLite anders rechnet: UPPER, LOWER, CONCAT, FORMAT", async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const db = new SQL.Database();
  try {
    const plainSqlite = db.exec("SELECT UPPER('müller'), CONCAT('a', NULL, 'b');")[0].values[0];
    assert.deepEqual(plainSqlite, ["MüLLER", "ab"], "Ausgangslage: SQLite ohne Nachbildung");
    check.registerSqlFunctions(db);
    const row = (sql) => db.exec(sql)[0].values[0];
    assert.deepEqual(row("SELECT UPPER('müller'), LOWER('MÜLLER'), UPPER('Straße'), LOWER('STRASSE'), UPPER('äöü éà'), UPPER(NULL), LOWER(NULL);"),
      ["MÜLLER", "müller", "STRAßE", "strasse", "ÄÖÜ ÉÀ", null, null]);
    assert.deepEqual(row("SELECT CONCAT('a', NULL, 'b'), CONCAT('a'), CONCAT('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'), CONCAT(1, 2), CONCAT('Nr. ', 5);"),
      [null, "a", "abcdefghij", "12", "Nr. 5"]);
    assert.deepEqual(row("SELECT FORMAT(24800, 2), FORMAT(1234567.891, 2), FORMAT(0.5, 0), FORMAT(1.5, 0), FORMAT(-1234.5, 1), FORMAT(12, 3), FORMAT(NULL, 2);"),
      ["24,800.00", "1,234,567.89", "1", "2", "-1,234.5", "12.000", null]);
    // Die Prüfabfrage einer vorhandenen Aufgabe nutzt UPPER auf Datentypen; das Ergebnis bleibt gleich.
    db.run("CREATE TABLE kurse (kursnr INT NOT NULL PRIMARY KEY, titel VARCHAR(60) NOT NULL);");
    assert.deepEqual(db.exec("SELECT UPPER(type) FROM pragma_table_info('kurse') ORDER BY cid;")[0].values.map((item) => item[0]), ["INT", "VARCHAR(60)"]);
  } finally {
    db.close();
  }
});

test("NOW und CURDATE liefern die Ortszeit des Geräts, nicht Weltzeit", () => {
  const moment = new Date(2026, 9, 9, 0, 30, 5); // 9. Oktober 2026, 00:30:05 Ortszeit
  assert.equal(check.localDate(moment), "2026-10-09");
  assert.equal(check.localDateTime(moment), "2026-10-09 00:30:05");
  assert.equal(check.mysqlFunctions.CURDATE(), check.localDate(new Date()));
});

test("TIMESTAMPDIFF zählt ganze Einheiten wie MySQL", () => {
  const diff = check.timestampDiff;
  assert.equal(diff("YEAR", "2008-10-09", "2026-10-09"), 18);
  assert.equal(diff("YEAR", "2008-10-10", "2026-10-09"), 17);
  assert.equal(diff("YEAR", "2026-10-09", "2008-10-10"), -17);
  assert.equal(diff("YEAR", "2004-02-29", "2026-02-28"), 21);
  assert.equal(diff("MONTH", "2026-01-31", "2026-02-28"), 0);
  assert.equal(diff("MONTH", "2026-01-15", "2026-10-09"), 8);
  assert.equal(diff("MONTH", "2026-10-09", "2026-01-15"), -8);
  assert.equal(diff("QUARTER", "2025-01-01", "2026-10-09"), 7);
  assert.equal(diff("DAY", "2026-10-01", "2026-10-09"), 8);
  assert.equal(diff("DAY", "2026-10-01 12:00:00", "2026-10-09 11:59:59"), 7);
  assert.equal(diff("WEEK", "2026-09-01", "2026-10-09"), 5);
  assert.equal(diff("HOUR", "2026-10-09 08:00:00", "2026-10-09 13:45:00"), 5);
  assert.equal(diff("MINUTE", "2026-10-09 08:00:00", "2026-10-09 13:45:00"), 345);
  assert.equal(diff("SECOND", "2026-10-09 08:00:00", "2026-10-09 08:01:01"), 61);
  assert.equal(diff("year", "2008-10-09", "2026-10-09"), 18);
  for (const bad of [["YEAR", null, "2026-10-09"], ["DAY", "unsinn", "2026-10-09"], ["JAHRE", "2008-10-09", "2026-10-09"], [null, "2008-10-09", "2026-10-09"]]) {
    assert.equal(diff(...bad), null);
  }
});
