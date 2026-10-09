// Claude, OPT-07: Auswahl-Logik der Wiederholungsrunde.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, "review.js"), "utf8"), context, { filename: "review.js" });
const pick = (...args) => Array.from(context.window.WORKBENCH_REVIEW.pick(...args));
const items = (count, lessons) => Array.from({ length: count }, (_, index) => ({ id: `p${index}`, lessonId: `l${index % lessons}` }));

test("dieselbe Auswahl für denselben Tag und dasselbe Profil, andere Auswahl an anderen Tagen", () => {
  const pool = items(20, 6);
  const today = pick(pool, "2026-10-09|profil-a", 5);
  assert.deepEqual(pick(pool, "2026-10-09|profil-a", 5), today);
  assert.equal(today.length, 5);
  assert.equal(new Set(today).size, 5);
  const days = new Set(Array.from({ length: 14 }, (_, day) => pick(pool, `2026-10-${10 + day}|profil-a`, 5).join(",")));
  assert.ok(days.size >= 12, "die Auswahl sollte von Tag zu Tag wechseln");
  assert.notDeepEqual(pick(pool, "2026-10-09|profil-b", 5), today);
});

test("bevorzugt verschiedene Einheiten und füllt erst danach auf", () => {
  const pool = items(20, 6);
  for (let day = 1; day <= 20; day += 1) {
    const chosen = pick(pool, `tag-${day}`, 5);
    const lessons = chosen.map((id) => pool.find((item) => item.id === id).lessonId);
    assert.equal(new Set(lessons).size, 5, `Tag ${day}: fünf verschiedene Einheiten erwartet`);
  }
  const narrow = pick(items(8, 2), "x", 5);
  assert.equal(narrow.length, 5);
  assert.equal(new Set(narrow).size, 5);
});

test("kleine und leere Mengen bleiben gültig, die Eingabe wird nicht verändert", () => {
  assert.deepEqual(pick([], "x", 5), []);
  const three = items(3, 3);
  const snapshot = JSON.stringify(three);
  assert.deepEqual(pick(three, "x", 5).sort(), ["p0", "p1", "p2"]);
  assert.equal(JSON.stringify(three), snapshot);
  assert.equal(pick(items(10, 10), "x").length, 5);
});

test("auf lange Sicht kommt jede Aufgabe dran", () => {
  const pool = items(12, 4);
  const seen = new Set();
  for (let day = 0; day < 40; day += 1) pick(pool, `d${day}`, 5).forEach((id) => seen.add(id));
  assert.equal(seen.size, 12);
});

test("die Wiederholungsrunde wird vor der App geladen und veröffentlicht", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.ok(html.indexOf('src="review.js') < html.indexOf('src="app.js'));
  assert.equal(require("../tools/build-site.cjs").isPublicFile("review.js"), true);
  assert.doesNotMatch(fs.readFileSync(path.join(root, "review.js"), "utf8"), /Math\.random|Date\.now|new Date/);
});
