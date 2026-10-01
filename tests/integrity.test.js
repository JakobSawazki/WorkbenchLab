const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const root = path.resolve(__dirname, "..");

test("L2.3 covers the source workflow, distinguishes roles and retains protection", () => {
  const context = vm.createContext({ window: {} });
  for (const file of ["content.js", "learning-path.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
  }
  const lesson = context.window.WORKBENCH_CONTENT.lessons.find((item) => item.courseCode === "L2.3");
  const tasks = lesson.webWorksheet.definitionTerms;
  assert.equal(tasks.length, 9);
  assert.equal(new Set(tasks.map((item) => item.id)).size, 9);
  assert.equal(tasks.filter((item) => item.label.includes("Zusatz")).length, 2);
  assert.match(tasks.find((item) => item.id === "erfassen").prompt, /0 Fahrstunden/);
  const text = JSON.stringify(lesson);
  assert.match(text, /Rollen einer konkreten Beziehung/);
  assert.match(text, /garantiert nicht/);
  assert.match(text, /Lass Fremdschlüsselprüfungen und Safe Updates eingeschaltet/);
  assert.doesNotMatch(text, /(?:FOREIGN_KEY_CHECKS|SQL_SAFE_UPDATES)\s*=\s*0/i);
  assert.ok(fs.existsSync(path.join(root, lesson.classroomTask.download.href)));
});

test("three enforced foreign keys reject invalid operations and permit the ordered workflow", async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const db = new SQL.Database();
  const rows = (query) => db.exec(query)[0]?.values || [];
  const snapshot = () => ["orte", "fahrlehrer", "fahrschueler"].map((table) => rows(`SELECT * FROM ${table} ORDER BY 1`));
  try {
    const fixture = fs.readFileSync(path.join(root, "assets/sql/l2-3-integritaet-testdaten.sql"), "utf8");
    assert.doesNotMatch(fixture, /\bDROP\b|\bDELETE\s+FROM\b|\bUPDATE\s+\w+\s+SET\b|FOREIGN_KEY_CHECKS\s*=\s*0/i);
    // Verify table constraints in SQLite; MySQL database creation is a separate check.
    const portable = fixture.replace("CREATE DATABASE IF NOT EXISTS workbenchlab_l2_3\n  CHARACTER SET utf8mb4;", "").replace("USE workbenchlab_l2_3;", "").replaceAll("ENGINE=InnoDB", "");
    db.run("PRAGMA foreign_keys = ON");
    db.run(portable);
    assert.deepEqual(rows("PRAGMA foreign_keys"), [[1]]);
    assert.equal(rows("PRAGMA foreign_key_list(fahrlehrer)").length, 1);
    assert.equal(rows("PRAGMA foreign_key_list(fahrschueler)").length, 2);
    const initial = snapshot();
    const teacher = "INSERT INTO fahrlehrer (fahrlehrernr,nachname,vorname,telefon,email,strasse,hausnr,geburtsdatum,gehalt,wochenstunden,ortnr) VALUES (203,'Fiktiv','Tari','0000000203','tari@example.invalid','Testweg','23','1990-05-02',2100,40,103)";
    const student = "INSERT INTO fahrschueler (schuelernr,nachname,vorname,telefon,email,strasse,hausnr,geburtsdatum,fahrstundenzahl,ortnr,fahrlehrernr) VALUES (2,'Fiktiv','Finn','0000000002','finn@example.invalid','Musterweg','22A','2001-10-10',0,101,203)";
    for (const invalid of [
      "DELETE FROM fahrlehrer WHERE fahrlehrernr=201",
      "UPDATE fahrlehrer SET fahrlehrernr=999 WHERE fahrlehrernr=201",
      "DELETE FROM orte WHERE ortnr=101",
      "UPDATE fahrschueler SET ortnr=999 WHERE schuelernr=1",
      "UPDATE fahrschueler SET fahrlehrernr=999 WHERE schuelernr=1",
      "UPDATE fahrlehrer SET ortnr=999 WHERE fahrlehrernr=201",
      teacher,
      student
    ]) {
      assert.throws(() => db.run(invalid), /FOREIGN KEY constraint failed/);
      assert.deepEqual(snapshot(), initial, invalid);
    }
    assert.throws(() => db.run("UPDATE fahrschueler SET ortnr=NULL WHERE schuelernr=1"), /NOT NULL constraint/);
    db.run("INSERT INTO orte (ortnr,plz,ort) VALUES (103,'00103','Beispielheim')");
    db.run(teacher);
    db.run(student);
    assert.deepEqual(rows("SELECT schuelernr,fahrstundenzahl,ortnr,fahrlehrernr FROM fahrschueler WHERE schuelernr=2"), [[2,0,101,203]]);
    const expanded = snapshot();
    assert.throws(() => db.run("DELETE FROM fahrlehrer WHERE fahrlehrernr=203"), /FOREIGN KEY constraint failed/);
    assert.deepEqual(snapshot(), expanded);
    db.run("DELETE FROM fahrschueler WHERE schuelernr=2");
    db.run("DELETE FROM fahrlehrer WHERE fahrlehrernr=203");
    assert.deepEqual(rows("SELECT * FROM fahrlehrer ORDER BY 1"), initial[1]);
    assert.deepEqual(rows("SELECT * FROM fahrschueler ORDER BY 1"), initial[2]);
    assert.deepEqual(rows("SELECT ortnr FROM orte ORDER BY ortnr"), [[101],[102],[103]]);
    db.run("BEGIN; DELETE FROM fahrlehrer WHERE fahrlehrernr=202; ROLLBACK;");
    assert.deepEqual(rows("SELECT * FROM fahrlehrer ORDER BY 1"), initial[1]);
    assert.deepEqual(rows("PRAGMA foreign_key_check"), []);
  } finally { db.close(); }
});
