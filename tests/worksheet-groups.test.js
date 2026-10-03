const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), context);
}
const lessons = context.window.WORKBENCH_CONTENT.lessons;
const lesson = (code) => lessons.find((item) => item.courseCode === code);

test("all ten long worksheets retain every task exactly once in small ordered groups", () => {
  const long = lessons.filter((item) => item.webWorksheet.definitionTerms.length >= 8);
  assert.equal(long.length, 10);
  for (const item of long) {
    const sheet = item.webWorksheet;
    const ids = Array.from(sheet.definitionTerms, (term) => term.id);
    const grouped = Array.from(sheet.definitionGroups.flatMap((group) => group.ids));
    assert.deepEqual(grouped, ids, item.courseCode);
    assert.equal(new Set(grouped).size, ids.length, item.courseCode);
    assert.equal(sheet.definitionGroups.filter((group) => group.open).length, 1, item.courseCode);
    assert.equal(sheet.definitionGroups[0].open, true, item.courseCode);
    for (const group of sheet.definitionGroups) assert.ok(group.ids.length >= 1 && group.ids.length <= 5, item.courseCode);
  }
});

test("early worksheets start with only three to four fields without reducing workload", () => {
  for (const [code, count, first] of [["L1.6",12,4],["L1.8",14,4],["L1.9",12,3],["L1.10",16,3],["L2.3",9,4]]) {
    const sheet = lesson(code).webWorksheet;
    assert.equal(sheet.definitionTerms.length, count);
    assert.equal(sheet.definitionGroups[0].ids.length, first);
  }
});

test("optional work is separate while the required safety check stays in the core", () => {
  assert.match(lesson("L1.9").webWorksheet.definitionGroups.at(-1).label, /Zusatz/);
  assert.match(lesson("L2.3").webWorksheet.definitionGroups.at(-1).label, /Zusatz/);
  const safety = lesson("L1.10").webWorksheet.definitionGroups.at(-1);
  assert.deepEqual(Array.from(safety.ids), ["s1-sicherheit"]);
  assert.doesNotMatch(safety.label, /Zusatz|Absprache/);
  const transfers = lesson("L3.1").webWorksheet.definitionGroups.slice(2, 6);
  assert.equal(transfers.length, 4);
  transfers.forEach((group) => assert.match(group.label, /Nach Absprache/));
});
