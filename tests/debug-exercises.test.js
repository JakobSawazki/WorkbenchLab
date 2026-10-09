// Claude, OPT-03a: Aufgabentyp „Fehlersuche“.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js", "practical-exercises.js", "debug-exercises.js", "sql-feedback.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const content = context.window.WORKBENCH_CONTENT;
const feedback = context.window.WORKBENCH_SQL_FEEDBACK;
const debug = content.practices.filter((item) => item.variant === "debug");
const init = () => initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
const plain = (value) => JSON.parse(JSON.stringify(value));

async function run(schemaKey, sql) {
  const SQL = await init();
  const db = new SQL.Database();
  db.run(content.schemas[schemaKey].seed);
  try {
    const result = db.exec(sql);
    return { table: plain(result.at(-1) || { columns: [], values: [] }) };
  } catch (error) {
    return { error };
  } finally {
    db.close();
  }
}

test("sechs Fehlersuche-Aufgaben sind eindeutig, vollständig und gültigen Einheiten zugeordnet", () => {
  assert.equal(debug.length, 6);
  assert.equal(new Set(content.practices.map((item) => item.id)).size, content.practices.length);
  for (const item of debug) {
    assert.match(item.id, /^debug-[a-z-]+$/);
    assert.equal(item.type, "sql");
    assert.ok(content.lessons.some((lesson) => lesson.id === item.lessonId), item.id);
    assert.ok(content.schemas[item.schema], item.id);
    assert.ok(item.title.startsWith("Fehlersuche: "));
    assert.equal(item.hints.length, 3);
    assert.equal(item.xp, 20);
    assert.equal(item.solution, undefined, "keine Musterlösung im ausgelieferten Aufgabenobjekt");
    assert.notEqual(item.starter, item.check.expectedSql);
  }
  assert.ok(content.debugIntro.includes("genau einen Fehler"));
});

test("der Startcode zeigt das beschriebene Symptom, die Korrektur besteht die Prüfung", async () => {
  for (const item of debug) {
    const expected = await run(item.schema, item.check.expectedSql);
    assert.ok(expected.table && expected.table.values.length > 0, `${item.id}: Sollergebnis leer`);
    const start = await run(item.schema, item.starter);
    if (item.symptom === "error") {
      assert.ok(start.error, `${item.id}: Startcode sollte abbrechen`);
      const info = feedback.explain(start.error, content.schemas[item.schema]);
      assert.ok(info.original, `${item.id}: Meldung sollte übersetzt sein`);
    } else {
      assert.ok(start.table, `${item.id}: Startcode sollte laufen`);
      assert.notDeepEqual(start.table.values, expected.table.values, `${item.id}: Startcode darf nicht schon richtig sein`);
    }
    for (const pattern of item.check.required) {
      assert.match(item.check.expectedSql, new RegExp(pattern, "i"), `${item.id}: ${pattern}`);
    }
  }
});

test("typische Symptome stimmen fachlich", async () => {
  const byId = (id) => debug.find((item) => item.id === id);
  const comma = await run("fahrschule-basic", byId("debug-fehlendes-komma").starter);
  assert.deepEqual(comma.table.columns, ["nachname", "ort"]);
  const empty = await run("fahrschule-basic", byId("debug-and-statt-or").starter);
  assert.equal(empty.table.values.length, 0);
  const students = await run("fahrschule", "SELECT COUNT(*) FROM fahrschueler;");
  const places = await run("fahrschule", "SELECT COUNT(*) FROM orte;");
  const cross = await run("fahrschule", byId("debug-join-ohne-bedingung").starter);
  assert.equal(cross.table.values.length, students.table.values[0][0] * places.table.values[0][0]);
  const fixed = await run("fahrschule", byId("debug-join-ohne-bedingung").check.expectedSql);
  assert.equal(fixed.table.values.length, students.table.values[0][0]);
  const having = await run("fahrschule-basic", byId("debug-where-statt-having").starter);
  assert.match(feedback.explain(having.error, content.schemas["fahrschule-basic"]).text, /HAVING/);
});

test("gleichwertige Korrekturen werden ebenfalls akzeptiert", async () => {
  const item = debug.find((entry) => entry.id === "debug-and-statt-or");
  const expected = await run(item.schema, item.check.expectedSql);
  const alternative = await run(item.schema, "SELECT nachname, vorname, ort FROM fahrschueler WHERE ort IN ('Stuttgart', 'Tuebingen') ORDER BY nachname, vorname;");
  assert.deepEqual(alternative.table.values, expected.table.values);
});

test("Fehlersuche wird vor der App geladen und in Lernplattform und Lehrkraftseite eingebunden", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.ok(html.indexOf('src="debug-exercises.js') > html.indexOf('src="practical-exercises.js'));
  assert.ok(html.indexOf('src="debug-exercises.js') < html.indexOf('src="app.js'));
  assert.match(fs.readFileSync(path.join(root, "lehrkraft.html"), "utf8"), /src="debug-exercises\.js\?v=/);
  assert.equal(require("../tools/build-site.cjs").isPublicFile("debug-exercises.js"), true);
});
