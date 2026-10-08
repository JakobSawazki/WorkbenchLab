const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "study-tools.js"), "utf8"), context);
const study = context.window.WORKBENCH_STUDY;
const plain = (value) => JSON.parse(JSON.stringify(value));
const anchor = { block: "section-0-paragraph-0", start: 0, end: 10, quote: "abcdefghij" };

test("Grüne Markierungen werden erstellt und beim Import erhalten", () => {
  const entries = study.updateHighlights([], [anchor], "green");
  assert.deepEqual(plain(study.normalizeHighlights({ lesson: entries }, new Set(["lesson"]))), { lesson: [{ ...anchor, color: "green" }] });
});

test("Textmarker ersetzt nur die ausgewählte Teilstrecke und bewahrt Restfarben", () => {
  const result = study.updateHighlights([{ ...anchor, color: "yellow" }], [{ ...anchor, start: 3, end: 6, quote: "def" }], "mint");
  assert.deepEqual(plain(result), [
    { ...anchor, end: 3, quote: "abc", color: "yellow" },
    { ...anchor, start: 6, quote: "ghij", color: "yellow" },
    { ...anchor, start: 3, end: 6, quote: "def", color: "mint" }
  ]);
});

test("Radierer entfernt eine Teilmarkierung, ohne Nachbartexte zu verlieren", () => {
  const result = study.updateHighlights([{ ...anchor, color: "coral" }], [{ ...anchor, start: 2, end: 8, quote: "cdefgh" }], "erase");
  assert.deepEqual(plain(result).map((item) => item.quote), ["ab", "ij"]);
  assert.ok(result.every((item) => item.color === "coral"));
});

test("Import akzeptiert nur passende Textanker, gültige Offsets und erlaubte Farben", () => {
  const valid = { ...anchor, color: "yellow" };
  const result = study.normalizeHighlights({ lesson: [valid, { ...valid, color: "<script>" }, { ...valid, end: 9 }, { ...valid, block: "unknown" }, { ...valid, start: -1 }], foreign: [valid] }, new Set(["lesson"]));
  assert.deepEqual(plain(result), { lesson: [valid] });
});

test("Bildeinstiegs-Anker bleiben erhalten, unbekannte Einstiegs-Anker werden verworfen", () => {
  const blocks = ["opening-scenario", "opening-question-0", "opening-question-2", "opening-answer-1", "opening-takeaway", "opening-bridge"];
  const valid = blocks.map(block => ({ ...anchor, block, color: "green" }));
  const invalid = ["opening-question-3", "opening-answer-999", "opening-image", "opening-script"].map(block => ({ ...anchor, block, color: "green" }));
  assert.deepEqual(plain(study.normalizeHighlights({ lesson: [...valid, ...invalid] }, new Set(["lesson"]))), { lesson: valid });
});

test("Speicherbedarf bleibt als Text erhalten; VARCHAR erhält nur Zeichenzahlen", () => {
  assert.equal(study.worksheetLength("INT", "4 Byte"), "4 Byte");
  assert.equal(study.worksheetLength("DATE", "3 Byte"), "3 Byte");
  assert.equal(study.worksheetLength("VARCHAR", "45 Zeichen"), "45");
  assert.equal(study.fixedStorage("INT"), "4 Byte");
  assert.equal(study.fixedStorage("DATE"), "3 Byte");
  assert.equal(study.fixedStorage("VARCHAR"), "");
});
