const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js", "practical-exercises.js"]) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
const content = context.window.WORKBENCH_CONTENT;
const practice = (id) => content.practices.find((item) => item.id === id);
const init = () => initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
const table = (db, sql) => JSON.parse(JSON.stringify(db.exec(sql)[0] || { columns: [], values: [] }));

test("five new practical exercises are linked to valid lessons and reachable before app initialization", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.ok(html.indexOf('src="practical-exercises.js') > html.indexOf('src="learning-path.js'));
  assert.ok(html.indexOf('src="practical-exercises.js') < html.indexOf('src="app.js'));
  assert.equal(new Set(content.practices.map((item) => item.id)).size, content.practices.length);
  for (const id of ["sql-create-course", "sql-students-without-hours", "sql-repeat-rentals", "erm-course-table", "erm-recurring-assignments"]) {
    const item = practice(id);
    assert.ok(content.lessons.some((lesson) => lesson.id === item.lessonId));
    if (item.type === "diagram") {
      assert.equal(new Set(item.slots.map((slot) => slot.id)).size, item.slots.length);
      const links = item.diagram.chain.flatMap((node) => node.type === "relation" ? [node.slotId] : node.attributes.filter((field) => typeof field === "object").map((field) => field.slotId));
      assert.deepEqual(Array.from(links).sort(), Array.from(item.slots, (slot) => slot.id).sort());
      for (const slot of item.slots) assert.ok(slot.options.includes(slot.answer));
    }
  }
});

test("CREATE TABLE checks actual types, mandatory fields, key and absence of extra columns", async () => {
  const SQL = await init();
  const item = practice("sql-create-course");
  const check = (sql) => {
    const db = new SQL.Database();
    try { db.run(sql); return table(db, item.check.verifySql); } finally { db.close(); }
  };
  assert.deepEqual(check(item.solution), JSON.parse(JSON.stringify(item.check.expected)));
  for (const wrong of [item.solution.replace("DATE", "INT"), item.solution.replace("PRIMARY KEY", ""), item.solution.replace("VARCHAR(60)", "VARCHAR(30)"), item.solution.replace("titel VARCHAR(60) NOT NULL", "titel VARCHAR(60)"), item.solution.replace("startdatum DATE NOT NULL", "startdatum DATE NOT NULL, extra INT")]) {
    assert.notDeepEqual(check(wrong), JSON.parse(JSON.stringify(item.check.expected)));
  }
});

test("LEFT JOIN retains the empty student and repeated rentals count contracts, not unique bikes", async () => {
  const SQL = await init();
  for (const id of ["sql-students-without-hours", "sql-repeat-rentals"]) {
    const item = practice(id);
    const db = new SQL.Database();
    try {
      db.run(content.schemas[item.schema].seed);
      const result = table(db, item.solution);
      if (id === "sql-students-without-hours") {
        assert.equal(result.values.length, 11);
        assert.deepEqual(result.values.at(-1), [11, "Muster", 0]);
        assert.notDeepEqual(table(db, item.solution.replace("LEFT JOIN", "JOIN")), result);
        assert.notDeepEqual(table(db, item.solution.replace("SUM(s.stundenzahl)", "COUNT(*)")), result);
      } else {
        assert.deepEqual(result.values, [[1, "Kaya", 2], [2, "Lorenz", 2]]);
        assert.notDeepEqual(table(db, item.solution.replaceAll("COUNT(m.vertragnr)", "COUNT(DISTINCT m.fahrradnr)")), result);
        assert.notDeepEqual(table(db, item.solution.replace(">= 2", "> 2")), result);
      }
    } finally { db.close(); }
  }
});

test("mutation checks reject collateral updates, deletions and inserts even when target result is right", async () => {
  const SQL = await init();
  for (const [id, collateral] of [["sql-update-hours", "UPDATE fahrschueler SET vorname='Falsch' WHERE schuelernr=1;"], ["sql-delete-student", "DELETE FROM fahrschueler WHERE schuelernr=1;"], ["sql-insert", "UPDATE orte SET ort='Falsch' WHERE ortnr=1;"]]) {
    const item = practice(id);
    const expectedDb = new SQL.Database();
    const actualDb = new SQL.Database();
    try {
      for (const db of [expectedDb, actualDb]) db.run(content.schemas[item.schema].seed);
      expectedDb.run(item.check.referenceSql);
      actualDb.run(item.solution);
      assert.deepEqual(table(actualDb, item.check.verifySql), table(expectedDb, item.check.verifySql));
      actualDb.run(collateral);
      assert.notDeepEqual(table(actualDb, item.check.verifySql), table(expectedDb, item.check.verifySql));
    } finally { expectedDb.close(); actualDb.close(); }
  }
});
