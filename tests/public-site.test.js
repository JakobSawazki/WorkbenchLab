// Claude, 0.38.0: Sollergebnisse statt Lösungsanweisungen (OPT-12), freie Übungen, NAGOLD.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const { loadContent, computeExpected, render } = require("../tools/build-expected.cjs");
const { SOLUTION_LINE } = require("../tools/build-site.cjs");

const root = path.resolve(__dirname, "..");
const plain = (value) => JSON.parse(JSON.stringify(value));

test("expected-results.js ist aktuell und deckt jede SQL-Aufgabe ab", async () => {
  const content = loadContent().WORKBENCH_CONTENT;
  const expected = await computeExpected(content);
  assert.equal(fs.readFileSync(path.join(root, "expected-results.js"), "utf8").replace(/\r\n/g, "\n"), render(expected),
    "expected-results.js ist veraltet: node tools/build-expected.cjs ausführen");
  for (const practice of content.practices.filter((item) => item.type === "sql")) {
    assert.ok(expected[practice.id] || practice.check.expected, `${practice.id}: Sollergebnis fehlt`);
    if (expected[practice.id]) assert.ok(expected[practice.id].columns.length > 0, `${practice.id}: leeres Sollergebnis`);
  }
  assert.ok(Object.keys(expected).length >= 25);
});

test("die veröffentlichten Inhaltsdateien enthalten keine Lösungsanweisungen und bleiben lauffähig", () => {
  const files = ["content.js", "learning-path.js", "lesson-openings.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js", "order-exercises.js", "expected-results.js"];
  const stripped = ["content.js", "learning-path.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js"];
  const context = vm.createContext({ window: {} });
  let removed = 0;
  for (const file of files) {
    let source = fs.readFileSync(path.join(root, file), "utf8");
    if (stripped.includes(file)) {
      const before = source.split("\n").length;
      source = source.replace(SOLUTION_LINE, "");
      removed += before - source.split("\n").length;
      assert.doesNotMatch(source, /^\s*(?:solution|expectedSql|referenceSql|fixed|proofSql):/m, file);
    }
    vm.runInContext(source, context, { filename: file });
  }
  assert.ok(removed >= 55, `nur ${removed} Zeilen entfernt`);
  const content = context.window.WORKBENCH_CONTENT;
  const full = loadContent().WORKBENCH_CONTENT;
  assert.equal(content.practices.length, full.practices.length);
  for (const practice of content.practices) {
    assert.equal(practice.solution, undefined, practice.id);
    assert.equal(practice.fixed, undefined, practice.id);
    assert.equal(practice.check?.expectedSql, undefined, practice.id);
    assert.equal(practice.check?.referenceSql, undefined, practice.id);
    for (const question of practice.questions || []) assert.equal(question.proofSql, undefined, practice.id);
    if (practice.type === "sql") {
      assert.ok(context.window.WORKBENCH_EXPECTED[practice.id] || practice.check.expected, practice.id);
      assert.ok(practice.starter !== undefined && practice.check.type, practice.id);
    }
  }
  // Was die Lernenden sehen und was die Prüfung braucht, bleibt unverändert.
  const keep = (item) => plain({ id: item.id, title: item.title, description: item.description, starter: item.starter, hints: item.hints, required: item.check?.required, verifySql: item.check?.verifySql, questions: (item.questions || []).map((q) => [q.question, q.options, q.correct]) });
  assert.deepEqual(plain(content.practices.map(keep)), plain(full.practices.map(keep)));
});

test("Übungen sind frei, Einheiten bleiben in Reihenfolge; NAGOLD je Einheit ist einheitlich", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  assert.match(app, /function isPracticeUnlocked\(practice\) \{\s*return Boolean\(practice\);\s*\}/);
  assert.match(app, /function isLessonUnlocked\(lesson\)/);
  assert.match(app, /const nagoldPerLesson = 5;/);
  assert.match(fs.readFileSync(path.join(root, "teacher-overview.js"), "utf8"), /const NAGOLD_PER_LESSON = 5;/);
  assert.match(fs.readFileSync(path.join(root, "index.html"), "utf8"), /id="nagoldTotal"/);
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.ok(html.indexOf('src="expected-results.js') < html.indexOf('src="app.js'));
});
