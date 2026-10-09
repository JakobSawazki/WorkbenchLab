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
for (const file of ["content.js", "learning-path.js", "practical-exercises.js", "backup.js", "nagold.js", "erm-editor.js", "teacher-overview.js"]) {
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
  assert.equal(row.nagold, 15);
  assert.equal(row.lessonsTotal, lessonIds.length);
  assert.equal(row.practicesDone, 1);
  assert.equal(row.xp, expectedXp);
  assert.equal(row.xpMismatch, true);
  assert.deepEqual(JSON.parse(JSON.stringify(row.modules[0])), { code: firstModule.code, done: 3, total: firstModule.lessonIds.length });
  assert.equal(row.activeDays, 3);
  assert.equal(row.lastActivity, "2026-10-09");
});

test("NAGOLD werden aus derselben Tabelle berechnet, nicht aus der behaupteten Summe", () => {
  const data = { completedLessons: lessonIds.slice(0, 3), nagoldEntries: [
    { date: "2026-10-09", purpose: "Mitarbeit", points: 2 },
    { date: "2026-10-09", purpose: "Zusatzaufgabe", points: 5 },
    { date: "2026-10-09", purpose: "Ungültig", points: 99 }
  ] };
  const row = teacher.summarize(backup({ summary: { nagold: 999 } }, data), content);
  assert.equal(row.nagold, 7);
  assert.equal(teacher.summarize(backup({}, { ...data, nagoldEntries: [] }), content).nagold, 0);
  assert.match(teacher.toCsv([row], content), /"7"/);
});

test("Lehrkraft-Bestätigungen sind getrennt von gemeldeten Punkten und reagieren auf Änderungen", () => {
  const lessonId = lessonIds[0];
  const row = teacher.summarize(backup({}, { completedLessons: [lessonId], nagoldEntries: [
    { date: "2026-10-09", time: "09:05", purpose: "Einheit", points: 5, lessonId },
    { date: "2026-10-09", time: "09:10", purpose: "Mitarbeit", points: 2 }
  ] }), content);
  const key = teacher.studentKey(row);
  const entries = teacher.entryKeys(row.nagoldEntries);
  const reviews = teacher.normalizeReviews({ app: "WorkbenchLab-Lehrkraft", formatVersion: 1,
    records: [{ studentKey: key, entries: [entries[0]], lessons: [lessonId] }] }, content);
  assert.equal(teacher.approvedSummary(row, reviews).nagold, 5);
  assert.equal(teacher.approvedSummary(row, reviews).lessons.length, 1);
  assert.equal(teacher.approvedSummary({ ...row, profileId: "other" }, reviews).nagold, 0);
  assert.equal(teacher.approvedSummary({ ...row, nagoldEntries: [...row.nagoldEntries].reverse() }, reviews).nagold, 5);
  assert.equal(teacher.approvedSummary({ ...row, nagoldEntries: [{ ...row.nagoldEntries[0], time: "09:06" }] }, reviews).nagold, 0);
  assert.equal(teacher.approvedSummary({ ...row, nagoldEntries: [] }, reviews).nagold, 0);
  const csv = teacher.toCsv([row], content, reviews);
  assert.match(csv, /"NAGOLD bestätigt";"Einheiten bestätigt"/);
  assert.match(csv, /"L1.1 bestätigt"/);
});

test("Lehrkraft-Liste lehnt fremde und übergroße Daten ab; doppelte Punkte werden nicht mitbestätigt", () => {
  const entry = { date: "2026-10-09", time: "09:00", purpose: "Mitarbeit", points: 5 };
  const row = teacher.summarize(backup({}, { nagoldEntries: [entry, entry] }), content);
  const keys = teacher.entryKeys(row.nagoldEntries);
  assert.notEqual(keys[0], keys[1]);
  const value = { app: "WorkbenchLab-Lehrkraft", formatVersion: 1,
    records: [{ studentKey: teacher.studentKey(row), entries: [keys[0]], lessons: [] }] };
  assert.equal(teacher.approvedSummary(row, teacher.normalizeReviews(value, content)).nagold, 5);
  for (const bad of [backup(), null, { ...value, formatVersion: 2 }, { ...value, records: [value.records[0], value.records[0]] },
    { ...value, records: [{ ...value.records[0], lessons: ["unknown"] }] },
    { ...value, records: [{ ...value.records[0], entries: ["x".repeat(4097)] }] }]) {
    assert.throws(() => teacher.normalizeReviews(bad, content));
  }
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

test("Die Prüfsumme stammt aus backup.js, derselben Datei wie bei der Lernplattform", () => {
  assert.equal(teacher.stableStringify, context.window.WORKBENCH_BACKUP.stableStringify);
  for (const file of ["app.js", "teacher-overview.js"]) {
    assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /function stableStringify/, file);
  }
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
  assert.ok(csv.startsWith("﻿\"Klasse\";\"Kürzel\";\"NAGOLD\";\"XP\""));
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
  assert.equal(stamps.length, 16);
  for (const file of ["app.js", "teacher-overview.js"]) {
    assert.match(fs.readFileSync(path.join(root, file), "utf8"), /(?:nagold|WORKBENCH_NAGOLD)\.total\(/);
  }
  for (const [, file, stamp] of stamps) {
    assert.equal(stamp, version, file);
    assert.equal(isPublicFile(file), true, file);
  }
  assert.doesNotMatch(html, /(?:src|href)="https?:/);
  assert.match(html, /name="robots" content="noindex"/);
  assert.doesNotMatch(fs.readFileSync(path.join(root, "teacher-overview.js"), "utf8"), /fetch\(|XMLHttpRequest|sendBeacon/);
});

test("Modellaufgaben werden aus den Entwürfen der Sicherung neu geprüft (0.40.1)", () => {
  const erm = context.window.WORKBENCH_ERM;
  const total = erm.TASKS.filter((task) => task.target).length;
  // Ältere Sicherung ohne Zusatzblock: keine Aussage.
  assert.equal(teacher.summarize(backup(), content).models, null);
  // Leerer Block: nichts bestanden, keine Entwürfe.
  assert.deepEqual(JSON.parse(JSON.stringify(teacher.summarize(backup({ extras: { ermDrafts: {} } }), content).models)), { drafts: 0, passed: [], total });
  const solved = {
    entities: [
      { id: 1, name: "Ort", attributes: [{ id: 2, name: "ortnr", type: "INT", pk: true, fk: false }, { id: 7, name: "ort", type: "VARCHAR(50)", pk: false, fk: false }] },
      { id: 3, name: "Fahrschueler", attributes: [{ id: 4, name: "schuelernr", type: "INT", pk: true, fk: false }, { id: 5, name: "ortnr", type: "INT", pk: false, fk: true }] }
    ],
    relations: [{ id: 6, from: 1, to: 3, card: "1:N" }]
  };
  const unfinished = { entities: [{ id: 1, name: "Buch", attributes: [] }], relations: [] };
  const row = teacher.summarize(backup({ extras: { ermDrafts: { models: { "fahrschule-ort": solved, schulbibliothek: unfinished, frei: unfinished, "gibt-es-nicht": solved } } } }), content);
  assert.equal(row.models.total, total);
  assert.equal(row.models.drafts, 3);
  assert.deepEqual(Array.from(row.models.passed), [erm.TASKS.find((task) => task.id === "fahrschule-ort").title]);
  // Eine Behauptung in der Datei zählt nicht: nur der Entwurf selbst wird geprüft.
  const claimed = teacher.summarize(backup({ extras: { ermDrafts: { passed: ["fahrschule-ort"], models: { "fahrschule-ort": unfinished } } } }), content);
  assert.deepEqual(Array.from(claimed.models.passed), []);
  // Unbrauchbarer Block wirft nicht.
  for (const junk of [null, 5, "x", []]) {
    assert.equal(teacher.summarize(backup({ extras: { ermDrafts: junk } }), content).models.drafts, 0);
  }
  row.integrity = "gueltig"; row.fileName = "a.json"; row.superseded = false;
  const [head, line] = teacher.toCsv([row], content).trim().split("\r\n");
  const cells = (text) => text.replace(/^\uFEFF/, "").split(";").map((cell) => cell.replace(/^"|"$/g, ""));
  const at = cells(head).indexOf("Modellaufgaben bestanden");
  assert.ok(at > 0);
  assert.deepEqual(cells(line).slice(at, at + 3), ["1", String(total), "3"]);
});
