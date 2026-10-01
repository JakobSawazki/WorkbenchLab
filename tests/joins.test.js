const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const root = path.resolve(__dirname, "..");

test("L2.4 groups all source tasks exactly once and specifies empty groups and age semantics", () => {
  const context = vm.createContext({ window: {} });
  for (const file of ["content.js", "learning-path.js"]) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
  const lesson = context.window.WORKBENCH_CONTENT.lessons.find((item) => item.courseCode === "L2.4");
  const worksheet = lesson.webWorksheet;
  assert.equal(worksheet.definitionTerms.length, 27);
  assert.deepEqual(Array.from(worksheet.definitionGroups, (group) => group.ids.length), [5,15,7]);
  const grouped = Array.from(worksheet.definitionGroups.flatMap((group) => group.ids));
  assert.equal(new Set(grouped).size, 27);
  assert.deepEqual(grouped.slice().sort(), Array.from(worksheet.definitionTerms, (item) => item.id).sort());
  assert.match(JSON.stringify(lesson), /nicht das heutige Alter/);
  assert.match(JSON.stringify(lesson), /ungerundeten Zahlenwert/);
  assert.match(worksheet.definitionTerms.find((item) => item.id === "m10").prompt, /ohne Schüler/);
  assert.ok(fs.existsSync(path.join(root, lesson.classroomTask.download.href)));
});

test("JOIN fixture exposes cartesian products, empty groups, role aliases and scalar averages", async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const db = new SQL.Database();
  const rows = (query) => db.exec(query)[0]?.values || [];
  try {
    const fixture = fs.readFileSync(path.join(root, "assets/sql/l2-4-join-testdaten.sql"), "utf8");
    assert.doesNotMatch(fixture, /\bDROP\b|\bDELETE\s+FROM\b|\bUPDATE\s+\w+\s+SET\b/);
    db.run("PRAGMA foreign_keys=ON");
    db.run(fixture.replace("CREATE DATABASE IF NOT EXISTS workbenchlab_l2_4\n  CHARACTER SET utf8mb4;", "").replace("USE workbenchlab_l2_4;", "").replaceAll("ENGINE=InnoDB", ""));
    assert.deepEqual(rows("SELECT COUNT(*) FROM fahrschueler CROSS JOIN orte"), [[45]]);
    assert.deepEqual(rows("SELECT COUNT(*) FROM fahrschueler f JOIN orte o ON f.ortnr=o.ortnr"), [[9]]);
    assert.deepEqual(rows("SELECT o.ortnr,COUNT(f.schuelernr) FROM orte o LEFT JOIN fahrschueler f ON f.ortnr=o.ortnr GROUP BY o.ortnr ORDER BY o.ortnr"), [[101,3],[102,3],[103,1],[104,2],[105,0]]);
    assert.deepEqual(rows("SELECT COUNT(*),COUNT(f.schuelernr) FROM orte o LEFT JOIN fahrschueler f ON f.ortnr=o.ortnr WHERE o.ortnr=105"), [[1,0]]);
    assert.deepEqual(rows("SELECT o.ortnr FROM orte o JOIN fahrschueler f ON f.ortnr=o.ortnr GROUP BY o.ortnr HAVING COUNT(*)>2 ORDER BY o.ortnr"), [[101],[102]]);
    assert.deepEqual(rows("SELECT l.fahrlehrernr,COUNT(f.schuelernr) FROM fahrlehrer l LEFT JOIN fahrschueler f ON f.fahrlehrernr=l.fahrlehrernr GROUP BY l.fahrlehrernr ORDER BY l.fahrlehrernr"), [[201,3],[202,4],[203,2],[204,0]]);
    assert.deepEqual(rows("SELECT f.schuelernr FROM fahrschueler f JOIN fahrlehrer l ON f.fahrlehrernr=l.fahrlehrernr JOIN orte schuelerort ON f.ortnr=schuelerort.ortnr JOIN orte lehrerort ON l.ortnr=lehrerort.ortnr WHERE schuelerort.ort='Testdorf' AND lehrerort.ort='Beispielheim'"), [[5]]);
    assert.deepEqual(rows("SELECT DISTINCT o.ort FROM fahrschueler f JOIN fahrlehrer l ON f.fahrlehrernr=l.fahrlehrernr JOIN orte o ON f.ortnr=o.ortnr WHERE l.nachname='Probe' ORDER BY o.ort"), [["Musterstadt"],["Talort"],["Testdorf"]]);
    assert.deepEqual(rows("SELECT DISTINCT o.ort FROM fahrschueler f JOIN fahrlehrer l ON f.fahrlehrernr=l.fahrlehrernr JOIN orte o ON f.ortnr=o.ortnr WHERE l.nachname='Probe' AND o.ort LIKE '%e%' ORDER BY o.ort"), [["Musterstadt"],["Testdorf"]]);
    assert.deepEqual(rows("SELECT SUM(f.fahrstundenzahl) FROM fahrschueler f JOIN fahrlehrer l ON f.fahrlehrernr=l.fahrlehrernr WHERE l.nachname='Probe'"), [[51]]);
    assert.equal(rows("SELECT AVG(fahrstundenzahl) FROM fahrschueler")[0][0], 100/9);
    assert.deepEqual(rows("SELECT schuelernr FROM fahrschueler WHERE fahrstundenzahl>(SELECT AVG(fahrstundenzahl) FROM fahrschueler) ORDER BY schuelernr"), [[2],[4],[6],[9]]);
    assert.deepEqual(rows("SELECT schuelernr FROM fahrschueler WHERE 2026-CAST(strftime('%Y',geburtsdatum) AS INTEGER)>(SELECT AVG(2026-CAST(strftime('%Y',geburtsdatum) AS INTEGER)) FROM fahrschueler) AND fahrstundenzahl>(SELECT AVG(fahrstundenzahl) FROM fahrschueler) ORDER BY schuelernr"), [[2],[4],[9]]);
    assert.deepEqual(rows("PRAGMA foreign_key_check"), []);
  } finally { db.close(); }
});
