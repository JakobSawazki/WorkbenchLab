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
