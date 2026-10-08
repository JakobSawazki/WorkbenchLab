const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js"]) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
const before = JSON.stringify(context.window.WORKBENCH_CONTENT.lessons);
vm.runInContext(fs.readFileSync(path.join(root, "lesson-openings.js"), "utf8"), context);
const lessons = context.window.WORKBENCH_CONTENT.lessons;
const opening = code => lessons.find(item => item.courseCode === code).opening;

test("Three targeted lesson openings have local optimized photographs, alt text and bounded tasks", () => {
  assert.deepEqual(Array.from(lessons.filter(item => item.opening), item => item.courseCode), ["L1.1", "L2.1", "L5.1"]);
  for (const lesson of lessons.filter(item => item.opening)) {
    const item = lesson.opening;
    assert.match(item.image, /^assets\/images\/lesson-[\w-]+\.webp$/);
    const bytes = fs.readFileSync(path.join(root, item.image));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    assert.ok(bytes.length > 10000 && bytes.length < 300000);
    assert.ok(item.alt.length > 50 && item.title.length > 10);
    assert.equal(item.questions.length, 3);
    assert.ok(item.questions.every(entry => entry.question.length > 30 && entry.answer.length > 100));
    assert.ok(item.takeaway && item.bridge);
  }
  assert.equal(JSON.stringify(lessons.map(({ opening, ...rest }) => rest)), before);
});

test("Opening comparisons distinguish stable keys, storage redundancy, case rules and inference", () => {
  assert.match(opening("L1.1").questions[1].answer, /nicht eindeutig.*NULL/);
  assert.match(opening("L1.1").questions[2].answer, /Text.*führende Null/);
  assert.match(opening("L2.1").scenario, /nicht aus dem Bild ablesbar/);
  assert.match(opening("L2.1").questions[0].answer, /DISTINCT.*keine gespeicherten Daten/);
  assert.match(opening("L2.1").questions[1].answer, /erst in L2.2/);
  assert.match(opening("L5.1").scenario, /keine echten Konten/);
  assert.match(opening("L5.1").questions[1].answer, /genaue Route sind nicht enthalten/);
  assert.match(opening("L5.1").questions[2].answer, /Profilnummer.*zugeordnet/);
});
