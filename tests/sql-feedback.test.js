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
