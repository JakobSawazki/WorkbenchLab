const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), context);
}
const lesson = context.window.WORKBENCH_CONTENT.lessons.find((item) => item.courseCode === "L3.1");

test("L3.1 covers six source cases once with two core models and optional transfers", () => {
  const worksheet = lesson.webWorksheet;
  assert.equal(worksheet.definitionTerms.length, 15);
  assert.deepEqual(Array.from(worksheet.definitionGroups, (group) => group.ids.length), [4, 2, 9]);
  const ids = Array.from(worksheet.definitionGroups.flatMap((group) => group.ids));
  assert.equal(new Set(ids).size, 15);
  assert.deepEqual(ids.slice().sort(), Array.from(worksheet.definitionTerms, (term) => term.id).sort());
  assert.match(lesson.classroomTask.intro, /Transfer nach Absprache/);
  assert.match(lesson.classroomTask.steps.join(" "), /L3_1_fahrschule\.mwb.*L3_1_fahrradvermietung\.mwb/);
  const field = (id) => worksheet.definitionTerms.find((term) => term.id === id).prompt;
  assert.match(field("f3"), /Schülerbezug.*nicht verlangt/);
  assert.match(field("f4"), /zwei Vorgänge.*selben Tag/);
  assert.match(field("w1"), /jedem Abschluss.*Termin und Note/);
  assert.match(field("w2"), /jeden beteiligten Monteur getrennt/);
  assert.match(field("m1"), /jeweilige Platzierung/);
  assert.match(field("m2"), /Leitung kann mehrere Teams/);
  assert.match(field("s2"), /nur einmal/);
});

test("M:N theory distinguishes pair uniqueness, repeated events and minimum participation", () => {
  const theory = lesson.sections.flatMap((section) => section.body).join(" ");
  assert.match(theory, /kann M:N-Beziehungen darstellen/);
  assert.match(theory, /UNIQUE-Bedingung auf dem Paar/);
  assert.match(theory, /reine Fremdschlüsselpaar.*kein geeigneter Primärschlüssel/);
  assert.match(theory, /zeitlich überschneiden/);
  assert.match(theory, /NOT NULL/);
  assert.match(theory, /0\.\.N/);
  assert.match(theory, /legt aber die Mindestbeteiligung nicht fest/);
  assert.doesNotMatch(theory, /M:N.*nicht abgebildet werden können/);
});

test("pair keys reject repeated assignments while event keys allow distinct repeated events", async () => {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(__dirname, "..", "vendor/sql.js", file) });
  const db = new SQL.Database();
  try {
    db.run(`PRAGMA foreign_keys=ON;
      CREATE TABLE customers(id INTEGER PRIMARY KEY);
      CREATE TABLE bikes(id INTEGER PRIMARY KEY);
      INSERT INTO customers VALUES(1),(2);
      INSERT INTO bikes VALUES(1),(2);
      CREATE TABLE assignments(customer_id INTEGER NOT NULL REFERENCES customers(id),
        bike_id INTEGER NOT NULL REFERENCES bikes(id), PRIMARY KEY(customer_id,bike_id));
      CREATE TABLE events(id INTEGER PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES customers(id),
        bike_id INTEGER NOT NULL REFERENCES bikes(id), begins TEXT NOT NULL);
      INSERT INTO assignments VALUES(1,1);
      INSERT INTO events VALUES(1,1,1,'2026-10-01'),(2,1,1,'2026-10-01');`);
    assert.throws(() => db.run("INSERT INTO assignments VALUES(1,1)"), /UNIQUE/);
    assert.throws(() => db.run("INSERT INTO events VALUES(3,99,1,'2026-10-02')"), /FOREIGN KEY/);
    assert.throws(() => db.run("INSERT INTO events VALUES(3,1,NULL,'2026-10-02')"), /NOT NULL/);
    assert.deepEqual(db.exec("SELECT COUNT(*) FROM events WHERE customer_id=1 AND bike_id=1")[0].values, [[2]]);
    assert.deepEqual(db.exec("SELECT c.id,COUNT(e.id) FROM customers c LEFT JOIN events e ON e.customer_id=c.id GROUP BY c.id ORDER BY c.id")[0].values, [[1,2],[2,0]]);
    assert.deepEqual(db.exec("PRAGMA foreign_key_check"), []);
  } finally { db.close(); }
});
