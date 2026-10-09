// Claude, OPT-03c: Aufgabentyp „Vorhersage“.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const content = context.window.WORKBENCH_CONTENT;
const predict = content.practices.filter((item) => item.variant === "predict");
const init = () => initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });

async function scalar(schemaKey, sql) {
  const SQL = await init();
  const db = new SQL.Database();
  db.run(content.schemas[schemaKey].seed);
  try {
    return db.exec(sql)[0].values[0][0];
  } finally {
    db.close();
  }
}

test("fünf Vorhersage-Aufgaben sind eindeutig, vollständig und gültigen Einheiten zugeordnet", () => {
  assert.equal(predict.length, 5);
  assert.equal(new Set(content.practices.map((item) => item.id)).size, content.practices.length);
  for (const item of predict) {
    assert.match(item.id, /^predict-[a-z-]+$/);
    assert.equal(item.type, "choice");
    assert.equal(item.xp, 15);
    assert.ok(item.title.startsWith("Vorhersage: "));
    assert.ok(content.lessons.some((lesson) => lesson.id === item.lessonId), item.id);
    const schema = content.schemas[item.schema];
    assert.ok(schema, item.id);
    for (const name of item.preview) assert.ok(schema.tables.some((table) => table.name === name), `${item.id}: ${name}`);
    assert.ok(item.questions.length >= 1);
    assert.ok(item.questions.at(-1).feedback.length > 40, `${item.id}: Erklärung fehlt`);
    for (const question of item.questions) {
      assert.equal(new Set(question.options).size, question.options.length, `${item.id}: doppelte Antwort`);
      assert.ok(question.correct >= 0 && question.correct < question.options.length);
    }
  }
  assert.ok(content.predictIntro && content.predictRetry);
});

test("jede als richtig markierte Antwort stimmt mit der echten Ausführung überein", async () => {
  for (const item of predict) {
    assert.doesNotThrow(() => item.sql);
    for (const question of item.questions) {
      const actual = String(await scalar(item.schema, question.proofSql));
      assert.equal(question.options[question.correct], actual, `${item.id}: ${question.question}`);
      assert.equal(question.options.filter((option) => option === actual).length, 1);
    }
  }
});

test("die gezeigte Abfrage ist ausführbar und liefert ein nicht leeres Ergebnis", async () => {
  const SQL = await init();
  for (const item of predict) {
    const db = new SQL.Database();
    db.run(content.schemas[item.schema].seed);
    try {
      const result = db.exec(item.sql);
      assert.ok(result[0].values.length > 0, item.id);
    } finally {
      db.close();
    }
  }
});

test("Vorhersage wird vor der App geladen und überall eingebunden", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.ok(html.indexOf('src="predict-exercises.js') > html.indexOf('src="debug-exercises.js'));
  assert.ok(html.indexOf('src="predict-exercises.js') < html.indexOf('src="app.js'));
  assert.match(fs.readFileSync(path.join(root, "lehrkraft.html"), "utf8"), /src="predict-exercises\.js\?v=/);
  assert.equal(require("../tools/build-site.cjs").isPublicFile("predict-exercises.js"), true);
});
