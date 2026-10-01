const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const root = path.resolve(__dirname, "..");

test("L1.10 covers adapted source tasks and teaches protected, verified changes", () => {
  const context = vm.createContext({ window: {} });
  for (const file of ["content.js", "learning-path.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
  }
  const lesson = context.window.WORKBENCH_CONTENT.lessons.find((item) => item.courseCode === "L1.10");
  const tasks = lesson.webWorksheet.definitionTerms;
  assert.equal(tasks.length, 16);
  assert.equal(new Set(tasks.map((item) => item.id)).size, 16);
  assert.equal(lesson.sourceMaterials.length, 9);
  const text = JSON.stringify(lesson);
  assert.match(text, /Lass die Schutzfunktion eingeschaltet/);
  assert.match(text, /Bezugsjahr 2018/);
  assert.match(text, /ROL(L)?BACK/);
  assert.match(text, /Unbekannt bedeutet nicht 0/);
  assert.doesNotMatch(text, /SQL_SAFE_UPDATES\s*=\s*0/i);
  assert.ok(fs.existsSync(path.join(root, lesson.classroomTask.download.href)));
});

test("isolated initial fixture supports sequential changes, NULL and strict delete boundaries", async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const db = new SQL.Database();
  const rows = (query) => db.exec(query)[0]?.values || [];
  try {
    const fixture = fs.readFileSync(path.join(root, "assets/sql/l1-10-aenderungen-testdaten.sql"), "utf8");
    assert.doesNotMatch(fixture, /\b(DROP|DELETE|UPDATE)\b/i);
    // Only MySQL database selection and storage-engine declarations are omitted.
    const portable = fixture.replace("CREATE DATABASE IF NOT EXISTS workbenchlab_l1_10\n  CHARACTER SET utf8mb4;", "").replace("USE workbenchlab_l1_10;", "").replaceAll("ENGINE=InnoDB", "");
    db.run(portable);
    const control = rows("SELECT * FROM fahrschueler WHERE schuelernr = 1");
    assert.equal(rows("SELECT COUNT(*) FROM fahrraeder")[0][0], 10);
    db.run("INSERT INTO fahrschueler (schuelernr,nachname,vorname,telefon,email,strasse,hausnr,plz,ort,geburtsdatum,fahrstundenzahl) VALUES (13,'Demo','Sina','0000000013','sina@example.invalid','Testweg','8','00013','Teststadt','2002-02-18',1)");
    db.run("INSERT INTO fahrschueler (schuelernr,nachname,vorname,telefon,strasse,hausnr,plz,ort) VALUES (14,'Probe','Hadi','0000000014','Musterweg','19','00014','Testdorf')");
    db.run("INSERT INTO fahrschueler (schuelernr,nachname,vorname,strasse,hausnr,plz,ort,fahrstundenzahl) VALUES (15,'Beispiel','Luca','Demoweg','33','00015','Beispielort',2)");
    assert.deepEqual(rows("SELECT email,geburtsdatum,fahrstundenzahl FROM fahrschueler WHERE schuelernr=14"), [[null,null,null]]);
    db.run("UPDATE fahrschueler SET email='hadi@example.invalid',geburtsdatum='2002-05-21',fahrstundenzahl=3 WHERE schuelernr=14");
    db.run("UPDATE fahrschueler SET strasse='Testpfad',hausnr='19' WHERE schuelernr=15");
    assert.deepEqual(rows("SELECT strasse,hausnr FROM fahrschueler WHERE schuelernr=15"), [["Testpfad","19"]]);
    db.run("DELETE FROM fahrschueler WHERE schuelernr IN (13,15)");
    assert.deepEqual(rows("SELECT schuelernr FROM fahrschueler ORDER BY schuelernr"), [[1],[14]]);
    assert.deepEqual(rows("SELECT * FROM fahrschueler WHERE schuelernr=1"), control);
    db.run("INSERT INTO fahrraeder (fahrradnr,modell,typ,rahmennr,anschaffungspreis,anschaffungsdatum) VALUES (20,'Test-Trail','Mountainbike','TEST-20',2499,'2026-05-21'),(21,'Test-Trail','Mountainbike','TEST-21',2499,'2026-05-21'),(22,'Test-Tour','Trekkingrad','TEST-22',889,'2026-05-21')");
    db.run("UPDATE fahrraeder SET tagessatz=15 WHERE fahrradnr=5");
    db.run("UPDATE fahrraeder SET tagessatz=ROUND(tagessatz+2.85,2) WHERE fahrradnr=1");
    db.run("UPDATE fahrraeder SET tagessatz=ROUND(tagessatz*0.88,2) WHERE fahrradnr=16");
    db.run("UPDATE fahrraeder SET tagessatz=ROUND(tagessatz*1.2,2) WHERE fahrradnr IN (30,31)");
    db.run("UPDATE fahrraeder SET tagessatz=ROUND(tagessatz*0.95,2) WHERE fahrradnr IN (5,16,30,31,50,51,52)");
    assert.deepEqual(rows("SELECT fahrradnr,tagessatz FROM fahrraeder WHERE fahrradnr IN (1,5,16,30,31,20) ORDER BY fahrradnr"), [[1,21.35],[5,14.25],[16,18.39],[20,null],[30,28.5],[31,31.92]]);
    assert.deepEqual(rows("SELECT fahrradnr FROM fahrraeder WHERE anschaffungspreis<100 OR typ='Kinderfahrrad' ORDER BY fahrradnr"), [[50],[51]]);
    db.run("DELETE FROM fahrraeder WHERE fahrradnr IN (50,51)");
    assert.deepEqual(rows("SELECT fahrradnr FROM fahrraeder WHERE 2018-CAST(strftime('%Y',anschaffungsdatum) AS INTEGER)>4 ORDER BY fahrradnr"), [[1]]);
    db.run("DELETE FROM fahrraeder WHERE fahrradnr=1");
    assert.equal(rows("SELECT COUNT(*) FROM fahrraeder")[0][0], 10);
    assert.deepEqual(rows("SELECT fahrradnr FROM fahrraeder WHERE fahrradnr=52"), [[52]]);
    assert.throws(() => db.run(portable), /already exists/);
  } finally { db.close(); }
});
