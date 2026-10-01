const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const root = path.resolve(__dirname, "..");

test("L1.9 separates eight original transfer tasks from date introductions and extra work", () => {
  const context = vm.createContext({ window: {} });
  for (const file of ["content.js", "learning-path.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
  }
  const lesson = context.window.WORKBENCH_CONTENT.lessons.find((item) => item.courseCode === "L1.9");
  const tasks = lesson.webWorksheet.definitionTerms;
  assert.equal(tasks.length, 12);
  assert.equal(new Set(tasks.map((item) => item.id)).size, 12);
  assert.equal(tasks.filter((item) => item.id.startsWith("r")).length, 8);
  assert.match(tasks.find((item) => item.id === "r6-wochenpreis").prompt, /sieben Tage mit 30 Prozent/);
  assert.match(tasks.find((item) => item.id === "r8-alter").prompt, /Kalenderjahresdifferenz/);
  assert.match(tasks.find((item) => item.id === "d4-tageszaehlung").label, /Zusatz/);
  const explanations = lesson.sections.map((item) => item.body.join(" ")).join(" ");
  assert.match(explanations, /vollständig vergangenen Jahren/);
  assert.match(explanations, /Uhrzeitanteile werden nicht mitgerechnet/);
  assert.match(explanations, /workbenchlab_l1_9/);
  assert.ok(fs.existsSync(path.join(root, lesson.classroomTask.download.href)));
});

test("fictional bicycle fixture supports price, year and boundary checks without changing school data", async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const db = new SQL.Database();
  const rows = (query) => db.exec(query)[0]?.values || [];
  try {
    // SQLite checks the shared table/data statements, not MySQL database creation.
    const fixture = fs.readFileSync(path.join(root, "assets/sql/l1-9-fahrradvermietung-testdaten.sql"), "utf8");
    assert.doesNotMatch(fixture, /\b(DROP|DELETE|UPDATE)\b/i);
    db.run(fixture.replace("CREATE DATABASE IF NOT EXISTS workbenchlab_l1_9\n  CHARACTER SET utf8mb4;", "").replace("USE workbenchlab_l1_9;", ""));
    assert.deepEqual(rows("SELECT COUNT(*), MAX(anschaffungspreis), SUM(anschaffungspreis), SUM(anschaffungspreis) / 5, ROUND(AVG(tagessatz), 2) FROM fahrraeder"), [[6, 2400, 8500, 1700, 20.67]]);
    assert.deepEqual(rows("SELECT COUNT(*) FROM fahrraeder WHERE typ = 'Mountainbike'"), [[2]]);
    assert.deepEqual(rows("SELECT fahrradnr, ROUND(tagessatz * 7 * 0.7, 0) FROM fahrraeder WHERE typ IN ('Mountainbike', 'Rennrad') ORDER BY fahrradnr"), [[1, 91], [2, 118], [3, 154], [4, 108]]);
    assert.deepEqual(rows("SELECT fahrradnr, CAST(strftime('%Y', anschaffungsdatum) AS INTEGER) FROM fahrraeder ORDER BY fahrradnr"), [[1, 2020], [2, 2022], [3, 2023], [4, 2021], [5, 2019], [6, 2024]]);
    assert.deepEqual(rows("SELECT julianday('2026-10-05') - julianday('2026-10-01'), julianday('2026-10-01') - julianday('2026-10-01')"), [[4, 0]]);
    assert.throws(() => db.run(fixture.replace("CREATE DATABASE IF NOT EXISTS workbenchlab_l1_9\n  CHARACTER SET utf8mb4;", "").replace("USE workbenchlab_l1_9;", "")), /already exists/);
  } finally { db.close(); }
});
