// Claude, OPT-08: Klassenübersicht für Lehrkräfte aus JSON-Sicherungen.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {}, TextEncoder, crypto: globalThis.crypto });
context.globalThis = context;
for (const file of ["content.js", "learning-path.js", "practical-exercises.js", "teacher-overview.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const content = context.window.WORKBENCH_CONTENT;
const teacher = context.window.WORKBENCH_TEACHER;
const lessonIds = content.modules.flatMap((module) => module.lessonIds);

function backup(overrides = {}, data = {}) {
  const payload = {
    app: "WorkbenchLab",
    formatVersion: 6,
    appVersion: "0.27.0",
    exportedAt: "2026-10-09T08:15:00.000Z",
    identity: { studentCode: "MIA.MUE", studentClass: "J1-1", profileId: "profile-aaaa", deviceCode: "AB12" },
    summary: { xp: 0 },
    data: { name: "MIA.MUE", className: "J1-1", completedLessons: [], completedPractices: [], completedCommands: [], activityDates: [], ...data },
    ...overrides
  };
  const digest = crypto.createHash("sha256").update(teacher.stableStringify(payload)).digest("hex");
  return { ...payload, integrity: { algorithm: "SHA-256", scope: "vollständiger Export ohne integrity-Block", digest } };
}

test("Zusammenfassung zählt Einheiten, Übungen und Module und rechnet XP unabhängig nach", () => {
  const firstModule = content.modules[0];
  const done = firstModule.lessonIds.slice(0, 3);
  const practice = content.practices[0];
  const expectedXp = done.reduce((sum, id) => sum + content.lessons.find((lesson) => lesson.id === id).xp, 0) + practice.xp;
  const row = teacher.summarize(backup({ summary: { xp: 9999 } }, {
    completedLessons: [...done, done[0], "gibt-es-nicht"],
    completedPractices: [practice.id, "unbekannt"],
    activityDates: ["2026-10-07", "2026-10-09", "kaputt", "2026-10-08"]
  }), content);
  assert.equal(row.studentCode, "MIA.MUE");
  assert.equal(row.className, "J1-1");
  assert.equal(row.lessonsDone, 3);
  assert.equal(row.lessonsTotal, lessonIds.length);
  assert.equal(row.practicesDone, 1);
  assert.equal(row.xp, expectedXp);
  assert.equal(row.xpMismatch, true);
  assert.deepEqual(JSON.parse(JSON.stringify(row.modules[0])), { code: firstModule.code, done: 3, total: firstModule.lessonIds.length });
  assert.equal(row.activeDays, 3);
  assert.equal(row.lastActivity, "2026-10-09");
});

test("Prüfsumme: gültig, verändert und altes Format werden unterschieden", async () => {
  const valid = backup();
  assert.equal(await teacher.integrityStatus(valid), "gueltig");
  const tampered = structuredClone(valid);
  tampered.data.completedLessons = lessonIds;
  assert.equal(await teacher.integrityStatus(tampered), "veraendert");
  assert.equal(await teacher.integrityStatus({ ...valid, integrity: undefined }), "veraendert");
  assert.equal(await teacher.integrityStatus({ app: "WorkbenchLab", formatVersion: 2, data: {} }), "alt");
});

test("Die Prüfsumme stimmt mit dem Verfahren der Lernplattform überein", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const overview = fs.readFileSync(path.join(root, "teacher-overview.js"), "utf8");
  const body = (source) => source.slice(source.indexOf("function stableStringify(value) {"), source.indexOf("async function sha256Hex")).replace(/\s+/g, "");
  assert.equal(body(overview), body(app));
});

test("Fremde und unvollständige Dateien werden abgelehnt; fehlende Angaben bleiben sichtbar", () => {
  for (const bad of [null, [], {}, { app: "Andere", data: {} }, { app: "WorkbenchLab" }, { app: "WorkbenchLab", data: "x" }]) {
    assert.throws(() => teacher.summarize(bad, content), /Keine WorkbenchLab-Sicherung/);
  }
  const row = teacher.summarize({ app: "WorkbenchLab", formatVersion: 1, data: { completedLessons: "kein Array" } }, content);
  assert.equal(row.studentCode, "ohne Kürzel");
  assert.equal(row.className, "ohne Klasse");
  assert.equal(row.lessonsDone, 0);
  assert.equal(row.exportedAt, "");
});

test("Ältere Sicherungen desselben Profils werden markiert, die Sortierung ist stabil", () => {
  const rows = [
    teacher.summarize(backup({ exportedAt: "2026-10-01T08:00:00.000Z" }), content),
    teacher.summarize(backup({ exportedAt: "2026-10-09T08:00:00.000Z" }), content),
    teacher.summarize(backup({ identity: { studentCode: "BEN.ALT", studentClass: "J1-1", profileId: "profile-bbbb" } }), content),
    teacher.summarize(backup({ identity: { studentCode: "ZOE.NEU", studentClass: "J1-0", profileId: "profile-cccc" } }), content)
  ];
  teacher.markSuperseded(rows);
  assert.deepEqual(rows.map((row) => row.superseded), [true, false, false, false]);
  assert.deepEqual(Array.from(teacher.sortRows(rows)).map((row) => `${row.className} ${row.studentCode} ${row.exportedAt.slice(8, 10)}`),
    ["J1-0 ZOE.NEU 09", "J1-1 BEN.ALT 09", "J1-1 MIA.MUE 09", "J1-1 MIA.MUE 01"]);
});

test("CSV ist für Tabellenprogramme geeignet und entschärft Formeln", () => {
  const row = teacher.summarize(backup({ identity: { studentCode: "=1+1", studentClass: 'J1;"1"', profileId: "p" } }, { completedLessons: [lessonIds[0]] }), content);
  row.integrity = "gueltig";
  row.fileName = "datei.json";
  row.superseded = false;
  const csv = teacher.toCsv([row], content);
  assert.ok(csv.startsWith("﻿\"Klasse\";\"Kürzel\";\"XP\""));
  const lines = csv.trim().split("\r\n");
  assert.equal(lines.length, 2);
  assert.ok(lines[1].startsWith('"J1;""1""";"\'=1+1";'));
  assert.equal(lines[0].split('";"').length, lines[1].split('";"').length);
  assert.ok(lines[0].includes('"L1.1"') && lines[0].includes('"L5.3"'));
  assert.ok(lines[1].includes('"gültig"'));
});

test("Die Lehrkraftseite ist öffentlich, versionsgleich und lädt keine fremden Quellen", () => {
  const html = fs.readFileSync(path.join(root, "lehrkraft.html"), "utf8");
  const version = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;
  const { isPublicFile } = require("../tools/build-site.cjs");
  assert.equal(isPublicFile("lehrkraft.html"), true);
  assert.equal(isPublicFile("teacher-overview.js"), true);
  const stamps = [...html.matchAll(/(?:href|src)="([^"?]+\.(?:js|css))\?v=([^"]+)"/g)];
  assert.equal(stamps.length, 6);
  for (const [, file, stamp] of stamps) {
    assert.equal(stamp, version, file);
    assert.equal(isPublicFile(file), true, file);
  }
  assert.doesNotMatch(html, /(?:src|href)="https?:/);
  assert.match(html, /name="robots" content="noindex"/);
  assert.doesNotMatch(fs.readFileSync(path.join(root, "teacher-overview.js"), "utf8"), /fetch\(|XMLHttpRequest|localStorage\.setItem|sendBeacon/);
});
