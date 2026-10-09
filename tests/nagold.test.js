const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const { loadContent } = require("../tools/build-expected.cjs");
const root = path.resolve(__dirname, "..");
const content = loadContent().WORKBENCH_CONTENT;
const context = vm.createContext({ window: { WORKBENCH_CONTENT: content } });
vm.runInContext(fs.readFileSync(path.join(root, "nagold.js"), "utf8"), context);
const N = context.window.WORKBENCH_NAGOLD;
const plain = value => JSON.parse(JSON.stringify(value));
const entry = (overrides = {}) => ({ date: "2026-10-09", time: "09:05", purpose: "Mitarbeit", points: 5, ...overrides });

test("NAGOLD akzeptiert echte Kalenderdaten, auch Schaltjahre", () => {
  for (const date of ["2026-10-09", "2024-02-29", "2026-12-31"]) assert.equal(N.validDate(date), true, date);
  for (const date of ["", null, 1, "2026-2-9", "2026-02-29", "2026-04-31", "2026-13-01", "2026-10-00", "2026-10-09T12:00:00Z"]) assert.equal(N.validDate(date), false, String(date));
});

test("Uhrzeiten werden als HH:MM geprüft; alte Einträge behalten eine unbekannte Uhrzeit", () => {
  for (const time of ["00:00", "09:05", "12:34", "23:59"]) assert.equal(N.validTime(time), true);
  for (const time of ["24:00", "12:60", "9:05", "09:5", "12:34:56", "", null, 5]) assert.equal(N.validTime(time), false);
  const old = entry();
  delete old.time;
  assert.equal(N.normalizeEntries([old])[0].time, "");
  assert.equal(N.normalizeEntries([entry({ time: "24:00" })]).length, 0);
});

test("NAGOLD begrenzt jeden Eintrag auf 1 bis 5 ganze Punkte und bereinigt Importe", () => {
  assert.deepEqual(plain(N.normalizeEntries([entry({ purpose: "  Eigener Anlass  ", points: 1 }), entry({ date: "", points: 5 })])),
    [entry({ purpose: "Eigener Anlass", points: 1 }), entry({ date: "", points: 5 })]);
  for (const points of [0, -1, 6, 5.5, "5", NaN, Infinity, null]) assert.equal(N.normalizeEntries([entry({ points })]).length, 0, String(points));
  for (const bad of [null, {}, entry({ date: "2026-02-31" }), entry({ purpose: " " }), entry({ purpose: 5 })]) assert.equal(N.normalizeEntries([bad]).length, 0);
  assert.equal(N.normalizeEntries([entry({ purpose: "x".repeat(500) })])[0].purpose.length, 160);
  assert.equal(N.normalizeEntries(Array.from({ length: N.maxEntries + 1 }, () => entry())).length, N.maxEntries);
  for (const bad of [null, {}, "Eintrag", 5]) assert.deepEqual(plain(N.normalizeEntries(bad)), []);
});

test("Ältere NAGOLD werden einmalig und ohne erfundene Daten übernommen", () => {
  const lessons = content.lessons.slice(0, 2);
  const legacy = { completedLessons: [lessons[0].id, lessons[0].id, lessons[1].id, "unbekannt"] };
  const entries = N.entriesFor(legacy);
  assert.equal(entries.length, 2);
  assert.equal(N.total(legacy), 10);
  assert.ok(entries.every(row => row.date === "" && row.time === "" && row.points === 5));
  assert.ok(entries[0].purpose.includes(lessons[0].title.slice(0, 30)));
  assert.deepEqual(plain(N.entriesFor({ ...legacy, nagoldEntries: entries })), plain(entries));
  assert.equal(N.total({ ...legacy, nagoldEntries: [] }), 0);
  assert.equal(N.total({ ...legacy, nagoldEntries: null }), 0);
});

test("Nur die Tabelle bestimmt NAGOLD; XP und weitere Abschlüsse zählen nicht doppelt", () => {
  const data = { nagoldEntries: [entry({ points: 2 }), entry({ points: 5 })], completedLessons: content.lessons.map(lesson => lesson.id) };
  assert.equal(N.total(data), 7);
  assert.equal(N.total({ ...data, nagoldEntries: [entry({ points: 5 })] }), 5);
  assert.equal(N.total({ ...data, nagoldEntries: [] }), 0);
  assert.equal(N.total({ nagoldEntries: Array.from({ length: 1000 }, () => entry()) }), 5000);
});

test("Abschlüsse erhalten genau eine datierte Tabellenzeile; manuelle Zeilen verdrängen keine Einheit", () => {
  const data = { completedLessons: [], nagoldEntries: [] };
  const lesson = content.lessons[0];
  assert.equal(N.addLessonEntry(data, lesson, "2026-10-09", "09:05"), true);
  assert.equal(N.addLessonEntry(data, lesson, "2026-10-10", "12:00"), false);
  assert.equal(N.total(data), 5);
  assert.equal(data.nagoldEntries[0].lessonId, lesson.id);
  assert.equal(data.nagoldEntries[0].date, "2026-10-09");
  assert.equal(data.nagoldEntries[0].time, "09:05");
  assert.equal(N.normalizeEntries(data.nagoldEntries)[0].lessonId, lesson.id);
  const full = { nagoldEntries: Array.from({ length: N.maxManualEntries }, () => entry()) };
  for (const unit of content.lessons) assert.equal(N.addLessonEntry(full, unit, "2026-10-09", "12:34"), true);
  assert.equal(N.normalizeEntries(full.nagoldEntries).length, N.maxEntries);
  assert.equal(N.addLessonEntry(data, { id: "unbekannt" }, "2026-10-09", "12:34"), false);
  assert.equal(N.addLessonEntry(data, content.lessons[1], "2026-02-31", "12:34"), false);
  assert.equal(N.addLessonEntry(data, content.lessons[1], "2026-10-09", "24:00"), false);
});

test("NAGOLD-Helfer ist öffentlich und auf beiden Seiten vor seinen Nutzern geladen", () => {
  for (const [page, consumer] of [["index.html", "state.js"], ["lehrkraft.html", "teacher-overview.js"]]) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    assert.ok(html.indexOf('src="nagold.js') > 0 && html.indexOf('src="nagold.js') < html.indexOf(`src="${consumer}`));
    assert.doesNotMatch(html, /nagold-key|nagoldKeyFile/);
  }
  assert.equal(require("../tools/build-site.cjs").isPublicFile("nagold.js"), true);
  assert.equal(fs.existsSync(path.join(root, "nagold-key.js")), false);
  assert.equal(fs.existsSync(path.join(root, "tools/provision-nagold-key.cjs")), false);
});
