const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");

const root = path.resolve(__dirname, "..");

test("L1.8 provides fourteen distinct, persistent worksheet tasks", () => {
  const context = vm.createContext({ window: {} });
  for (const file of ["content.js", "learning-path.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
  }
  const lesson = context.window.WORKBENCH_CONTENT.lessons.find((item) => item.courseCode === "L1.8");
  const tasks = lesson.webWorksheet.definitionTerms;
  assert.equal(tasks.length, 14);
  assert.equal(new Set(tasks.map((item) => item.id)).size, 14);
  assert.equal(tasks.filter((item) => item.id.startsWith("f")).length, 6);
  assert.equal(tasks.filter((item) => item.id.startsWith("g")).length, 8);
  for (const task of tasks) {
    assert.match(task.id, /^[a-z0-9-]{1,40}$/);
    assert.ok(task.prompt.length > 20);
  }
  assert.match(tasks.find((item) => item.id === "g7-mehr-als-zwei").prompt, /mehr als zwei/);
  assert.match(lesson.sections.map((item) => item.body.join(" ")).join(" "), /garantiert keine sortierte Ausgabe/);
  assert.ok(fs.existsSync(path.join(root, lesson.classroomTask.download.href)));
});

test("supplementary data preserves original rows and exercises aggregation boundaries", async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const db = new SQL.Database();
  const rows = (query) => db.exec(query)[0]?.values || [];
  try {
    db.run("CREATE TABLE fahrschueler (schuelernr INTEGER PRIMARY KEY, nachname TEXT, vorname TEXT, telefon TEXT, email TEXT, strasse TEXT, hausnr TEXT, plz TEXT, ort TEXT, geburtsdatum TEXT, fahrstundenzahl INTEGER)");
    const load = (file) => db.run(fs.readFileSync(path.join(root, "assets/sql", file), "utf8").replace(/^USE fahrschule;\s*$/m, ""));
    load("l1-4-fahrschule-beispieldaten.sql");
    const original = rows("SELECT * FROM fahrschueler ORDER BY schuelernr");
    assert.equal(original.length, 5);
    load("l1-8-fahrschule-testfaelle.sql");
    assert.deepEqual(rows("SELECT * FROM fahrschueler WHERE schuelernr < 9001 ORDER BY schuelernr"), original);
    assert.deepEqual(rows("SELECT COUNT(*), MAX(fahrstundenzahl), SUM(fahrstundenzahl), SUM(fahrstundenzahl) * 30, ROUND(AVG(fahrstundenzahl), 2) FROM fahrschueler"), [[11, 25, 96, 2880, 8.73]]);
    assert.deepEqual(rows("SELECT ort, COUNT(*) FROM fahrschueler GROUP BY ort HAVING COUNT(*) > 2 ORDER BY ort"), [["Schorndorf", 4]]);
    assert.deepEqual(rows("SELECT ort, SUM(fahrstundenzahl) FROM fahrschueler GROUP BY ort HAVING SUM(fahrstundenzahl) > 20 ORDER BY ort"), [["Demodorf", 25], ["Schorndorf", 29]]);
    assert.deepEqual(rows("SELECT ort, SUM(fahrstundenzahl) FROM fahrschueler WHERE ort IN ('Lorch', 'Plüderhausen') GROUP BY ort ORDER BY ort"), [["Lorch", 3], ["Plüderhausen", 12]]);
    assert.deepEqual(rows("SELECT ort, COUNT(*) FROM fahrschueler WHERE plz LIKE '736%' GROUP BY ort ORDER BY ort"), [["Lorch", 2], ["Plüderhausen", 1], ["Schorndorf", 1], ["Welzheim", 2]]);
    assert.deepEqual(rows("SELECT fahrstundenzahl, COUNT(*) FROM fahrschueler WHERE fahrstundenzahl < 4 GROUP BY fahrstundenzahl ORDER BY fahrstundenzahl"), [[0, 1], [1, 1], [2, 2], [3, 1]]);
    assert.throws(() => load("l1-8-fahrschule-testfaelle.sql"), /UNIQUE constraint/);
    db.run("CREATE TABLE null_probe (wert INTEGER); INSERT INTO null_probe VALUES (NULL), (0), (2)");
    assert.deepEqual(rows("SELECT COUNT(*), COUNT(wert), SUM(wert) FROM null_probe"), [[3, 2, 2]]);
  } finally {
    db.close();
  }
});
