const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const name of ["content.js", "learning-path.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, name), "utf8"), context);
}
const content = context.window.WORKBENCH_CONTENT;
const lesson = (code) => content.lessons.find((item) => item.courseCode === code);
const raw = fs.readFileSync(path.join(root, lesson("L1.1").classroomTask.download.href), "utf8");

test("L1.1 and L1.2 provide real SQL and EER work before L1.3", () => {
  const first = lesson("L1.1");
  assert.match(first.classroomTask.tool, /Workbench.*SQL/);
  const steps = first.classroomTask.steps.join(" ");
  assert.match(steps, /ready for connections/);
  assert.match(steps, /6\.3\.10/);
  assert.match(steps, /127\.0\.0\.1.*3306.*root/);
  assert.match(steps, /nur die SELECT/);
  assert.equal(first.classroomTask.fileName, "L1_1_einstieg.sql");
  const second = lesson("L1.2");
  assert.match(second.classroomTask.tool, /Workbench.*EER/);
  assert.match(second.classroomTask.steps.join(" "), /New Model.*Add Diagram/);
  assert.match(second.classroomTask.steps.join(" "), /elf Attribute.*PK und NN/);
  assert.match(lesson("L1.3").classroomTask.steps.join(" "), /L1_2_entwurf\.mwb/);
  assert.match(lesson("L1.3").classroomTask.steps[3], /vorhandene Tabelle.*nur fehlende Attribute/);
  assert.match(lesson("L1.3").classroomTask.steps[3], /keine zweite fahrschueler-Tabelle/);
});

test("SQL introduction preserves its two records and rejects duplicate primary keys", async () => {
  assert.doesNotMatch(raw, /\b(?:DROP|DELETE|TRUNCATE|ALTER)\b|FOREIGN_KEY_CHECKS/i);
  assert.equal((raw.match(/CREATE TABLE /g) || []).length, 1);
  const portable = raw
    .replace(/CREATE DATABASE IF NOT EXISTS workbenchlab_l1_1_einstieg\s+CHARACTER SET utf8mb4;/, "")
    .replace(/^USE workbenchlab_l1_1_einstieg;/m, "")
    .replaceAll("ENGINE=InnoDB", "")
    .replaceAll("workbenchlab_l1_1_einstieg.fahrschueler", "fahrschueler");
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const db = new SQL.Database();
  try {
    db.run(portable);
    const expected = [[1, "Mara", "Probe"], [2, "Tari", "Demo"]];
    const select = "SELECT schuelernr, vorname, nachname FROM fahrschueler ORDER BY schuelernr";
    assert.deepEqual(db.exec(select)[0].values, expected);
    assert.deepEqual(db.exec(select)[0].values, expected);
    assert.throws(() => db.run("INSERT INTO fahrschueler VALUES (1, 'Neu', 'Probe')"), /UNIQUE/);
    assert.throws(() => db.run(portable), /already exists/);
    assert.deepEqual(db.exec(select)[0].values, expected);
  } finally { db.close(); }
});

test("L2.1 builds an independent draft that L2.2 continues without duplicate columns", () => {
  const draft = lesson("L2.1");
  const followup = lesson("L2.2");
  assert.match(draft.classroomTask.tool, /Workbench.*EER/);
  assert.equal(draft.classroomTask.fileName, "L2_1_tabellenentwurf.mwb");
  const text = JSON.stringify(draft);
  assert.match(text, /handgezeichnetes ERD/);
  assert.match(text, /File > Save Model As/);
  assert.match(text, /INT PK NN AI/);
  assert.match(text, /VARCHAR\(5\) NN/);
  assert.match(text, /alle anderen L1-Attribute erhalten/);
  assert.match(text, /noch keinen Foreign-Key-Constraint/);
  assert.match(text, /Kein Forward Engineer/);
  assert.match(text, /erneut geöffnete/);
  assert.doesNotMatch(text, /Software folgt erst/);
  assert.ok(draft.webWorksheet.definitionTerms.some((item) => item.id === "modellkontrolle"));
  assert.match(JSON.stringify(followup), /L2_1_tabellenentwurf\.mwb/);
  assert.match(JSON.stringify(followup), /Foreign Keys/);
  assert.match(JSON.stringify(followup), /genau eine Orts-Verweisspalte INT NN/);
  assert.match(followup.classroomTask.steps.join(" "), /Zusatzspalte erst nach dieser Kontrolle/);
});

test("every learning unit contains its own real Workbench task and evidence", () => {
  assert.equal(content.lessons.length, 21);
  for (const item of content.lessons) {
    assert.ok(item.sections.length >= 2, item.courseCode);
    assert.ok(item.sourceMaterials.length > 0, item.courseCode);
    const exercises = content.practices.filter((practice) => practice.lessonId === item.id);
    assert.ok(exercises.length > 0, item.courseCode);
    assert.ok(exercises.some((practice) => practice.id === item.practiceId), item.courseCode);
    assert.match(item.classroomTask?.tool || "", /Workbench/, item.courseCode);
    assert.ok(item.classroomTask.steps.length >= 3, item.courseCode);
    assert.equal(item.classroomTask.stepTitles.length, item.classroomTask.steps.length, item.courseCode);
    for (const title of item.classroomTask.stepTitles) assert.ok(title.length >= 10 && title.length <= 70, `${item.courseCode}: ${title}`);
    assert.ok(item.classroomTask.evidence.length > 30, item.courseCode);
    assert.ok(item.webWorksheet?.definitionTerms.length >= 4, item.courseCode);
    assert.ok(item.quiz && item.completionChecks.length >= 3, item.courseCode);
    if (item.classroomTask.download) assert.ok(fs.existsSync(path.join(root, item.classroomTask.download.href)), item.courseCode);
  }
});
