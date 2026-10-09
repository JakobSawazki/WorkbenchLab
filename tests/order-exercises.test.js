// Claude, OPT-03b: Aufgabentyp „Klauseln ordnen“.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js", "order-exercises.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const content = context.window.WORKBENCH_CONTENT;
const order = content.practices.filter((item) => item.variant === "order");
const init = () => initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });

function permutations(items) {
  if (items.length <= 1) return [items];
  return items.flatMap((item, index) => permutations([...items.slice(0, index), ...items.slice(index + 1)]).map((rest) => [item, ...rest]));
}

test("vier Ordnungsaufgaben sind eindeutig, vollständig und gültigen Einheiten zugeordnet", () => {
  assert.equal(order.length, 4);
  assert.equal(new Set(content.practices.map((item) => item.id)).size, content.practices.length);
  for (const item of order) {
    assert.match(item.id, /^order-[a-z-]+$/);
    assert.equal(item.type, "order");
    assert.equal(item.xp, 15);
    assert.ok(item.title.startsWith("Klauseln ordnen: "));
    assert.ok(content.lessons.some((lesson) => lesson.id === item.lessonId), item.id);
    assert.ok(content.schemas[item.schema], item.id);
    assert.ok(item.lines.length >= 4 && item.lines.length <= 5);
    assert.equal(item.sql, Array.from(item.lines).join("\n"));
    assert.ok(item.feedback.length > 40);
    const start = Array.from(item.start);
    assert.deepEqual([...start].sort(), Array.from(item.lines, (_, index) => index), `${item.id}: start ist keine Permutation`);
    assert.ok(start.every((lineIndex, position) => lineIndex !== position), `${item.id}: keine Zeile darf am Anfang schon richtig stehen`);
  }
  assert.ok(content.orderIntro && content.orderRetry);
});

test("nur die vorgesehene Reihenfolge ist ausführbar und liefert ein Ergebnis", async () => {
  const SQL = await init();
  for (const item of order) {
    const db = new SQL.Database();
    db.run(content.schemas[item.schema].seed);
    try {
      const runnable = [];
      for (const candidate of permutations(item.lines.map((_, index) => index))) {
        try {
          db.exec(candidate.map((index) => item.lines[index]).join("\n"));
          runnable.push(candidate.join(""));
        } catch {}
      }
      assert.deepEqual(runnable, [item.lines.map((_, index) => index).join("")], item.id);
      assert.ok(db.exec(item.sql)[0].values.length > 0, `${item.id}: Ergebnis leer`);
    } finally {
      db.close();
    }
  }
});

test("Ordnungsaufgaben werden vor der App geladen und überall eingebunden", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.ok(html.indexOf('src="order-exercises.js') > html.indexOf('src="predict-exercises.js'));
  assert.ok(html.indexOf('src="order-exercises.js') < html.indexOf('src="app.js'));
  assert.match(fs.readFileSync(path.join(root, "lehrkraft.html"), "utf8"), /src="order-exercises\.js\?v=/);
  assert.equal(require("../tools/build-site.cjs").isPublicFile("order-exercises.js"), true);
});
