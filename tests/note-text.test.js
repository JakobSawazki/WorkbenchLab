const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(require("node:path").join(__dirname, "../note-text.js"), "utf8"), context);
const notes = context.window.WORKBENCH_NOTE_TEXT;
const plain = value => JSON.parse(JSON.stringify(value));
test("Notizfarben sind begrenzte, bekannte Textbereiche ohne HTML oder fremde Farben", () => {
 assert.deepEqual(plain(notes.normalize([{ start: 0, end: 3, color: "blue" }, { start: -1, end: 2, color: "red" }, { start: 0, end: 99, color: "red" }, { start: 0, end: 2, color: "url(test)" }], "Text")), [{ start: 0, end: 3, color: "blue" }]);
 assert.equal(notes.normalize(Array.from({ length: 500 }, () => ({ start: 0, end: 1, color: "blue" })), "a").length, 1);
 assert.equal(notes.normalize(Array.from({ length: 500 }, (_, i) => ({ start: i, end: i + 1, color: i % 2 ? "blue" : "red" })), "a".repeat(500)).length, 400);
});
test("Faerben und Standardfarbe teilen Bereiche; Texteinfuegen verschiebt erhaltene Farben", () => {
 const initial = [{ start: 0, end: 8, color: "blue" }];
 assert.deepEqual(plain(notes.replace(initial, 2, 4, "default")), [{ start: 0, end: 2, color: "blue" }, { start: 4, end: 8, color: "blue" }]);
 assert.deepEqual(plain(notes.rebase([{ start: 6, end: 10, color: "blue" }], "Alpha Beta", "X Alpha Beta")), [{ start: 8, end: 12, color: "blue" }]);
 assert.deepEqual(plain(notes.rebase(initial, "12345678", "")), []);
 assert.deepEqual(plain(notes.rebase(initial, "12345678", "12345678")), initial);
});
test("Kommentare werden an erlaubten Textstellen begrenzt, ohne HTML auszufuehren", () => {
 vm.runInNewContext(fs.readFileSync(require("node:path").join(__dirname, "../study-tools.js"), "utf8"), context);
 const comment = { block: "extra-12", start: 0, end: 4, quote: "Text", text: "<script>untrusted</script>" };
 const result = context.window.WORKBENCH_STUDY.normalizeComments({ lesson: [comment, { ...comment, block: "evil" }, { ...comment, text: " " }], other: [comment] }, new Set(["lesson"]));
 assert.deepEqual(plain(result), { lesson: [comment] });
 assert.equal(context.window.WORKBENCH_STUDY.normalizeComments({ lesson: Array.from({ length: 120 }, () => comment) }, new Set(["lesson"])).lesson.length, 100);
});
