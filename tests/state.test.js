// Claude, OPT-16 Schritt 3: Aufbau und Bereinigung des Lernstands (state.js), erstmals direkt getestet.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {}, crypto: globalThis.crypto });
context.globalThis = context;
for (const file of ["content.js", "learning-path.js", "lesson-openings.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js", "order-exercises.js", "study-tools.js", "drawing.js", "state.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}
const content = context.window.WORKBENCH_CONTENT;
const S = context.window.WORKBENCH_STATE;
const plain = (value) => JSON.parse(JSON.stringify(value));
const normalize = (candidate) => plain(S.normalizeState(candidate));
const lessonId = content.lessons[0].id;
const practiceId = content.practices[0].id;
const commandId = content.commands[0].id;

test("Schülerkürzel und Klasse werden vereinheitlicht und geprüft", () => {
  assert.equal(S.normalizeStudentCode(" max.mus "), "MAX.MUS");
  assert.equal(S.normalizeStudentCode("maxmus"), "MAX.MUS");
  assert.equal(S.normalizeStudentCode("jörg.müller"), "JOE.MUE");
  assert.equal(S.normalizeStudentCode("Maximilian.Mustermann"), "MAX.MUS");
  assert.equal(S.isValidStudentCode("MAX.MUS"), true);
  for (const bad of ["", "MA.MUS", "MAXMUS", "max.mus", "MAX.MUS1"]) {
    assert.equal(S.isValidStudentCode(bad), false, bad);
  }
  assert.equal(S.normalizeClassName("  wg  12/1 "), "WG 12/1");
  assert.equal(S.normalizeClassName("<b>J1</b>"), "BJ1/B");
  assert.equal(S.normalizeClassName("x".repeat(40)).length, 20);
  assert.equal(S.isValidClassName("WG 12/1"), true);
  assert.equal(S.isValidClassName(""), false);
  assert.equal(S.isValidClassName(" J1"), false);
});

test("Kennungen: erzeugen, prüfen, kürzen", () => {
  const id = S.createOpaqueId("profile");
  assert.equal(S.isOpaqueId(id, "profile"), true);
  assert.equal(S.isOpaqueId(id, "device"), false);
  assert.equal(S.isOpaqueId("profile_kurz", "profile"), false);
  assert.equal(S.isOpaqueId(null, "profile"), false);
  assert.notEqual(S.createOpaqueId("profile"), id);
  assert.match(S.shortIdentity(id), /^[A-Z0-9]{8}$/);
  assert.equal(S.shortIdentity(""), "UNBEKANNT");
});

test("normalizeState: leerer und unbrauchbarer Stand ergeben die Vorgabewerte", () => {
  const empty = normalize({});
  assert.deepEqual(empty, plain(S.defaultState));
  assert.deepEqual(normalize(undefined), empty);
  assert.deepEqual(normalize({ completedLessons: "x", drafts: 5, lessonChecks: null, transferHistory: {}, activityDates: "gestern" }), empty);
  // Die Vorgabewerte selbst werden nie verändert.
  const state = S.normalizeState({});
  state.completedLessons.push("x");
  assert.deepEqual(plain(S.defaultState.completedLessons), []);
});

test("normalizeState: gültiger Stand bleibt erhalten", () => {
  const profileId = S.createOpaqueId("profile");
  const deviceId = S.createOpaqueId("device");
  const state = normalize({
    name: "max.mus", className: "wg 12/1", profileId, profileDeviceId: deviceId, profileCreatedAt: "2026-10-01T08:00:00.000Z",
    completedLessons: [lessonId], completedPractices: [practiceId], completedCommands: [commandId],
    drafts: { [practiceId]: "SELECT 1;", "frei-fahrschule": "SELECT 2;" },
    lessonNotes: { [lessonId]: "Notiz" }, generalNotes: "Allgemein",
    lessonChecks: { [lessonId]: { checks: [true], teacherChecked: true } },
    activityDates: ["2026-10-08", "2026-10-09"], lastLessonId: lessonId
  });
  assert.equal(state.name, "MAX.MUS");
  assert.equal(state.className, "WG 12/1");
  assert.equal(state.profileId, profileId);
  assert.equal(state.profileDeviceId, deviceId);
  assert.deepEqual(state.completedLessons, [lessonId]);
  assert.deepEqual(state.completedPractices, [practiceId]);
  assert.deepEqual(state.completedCommands, [commandId]);
  assert.deepEqual(state.drafts, { [practiceId]: "SELECT 1;", "frei-fahrschule": "SELECT 2;" });
  assert.equal(state.lessonNotes[lessonId], "Notiz");
  assert.equal(state.generalNotes, "Allgemein");
  assert.equal(state.lessonChecks[lessonId].teacherChecked, true);
  assert.equal(state.lessonChecks[lessonId].checks[0], true);
  assert.deepEqual(state.activityDates, ["2026-10-08", "2026-10-09"]);
  // Eine abgeschlossene Einheit gilt immer auch als bestandener Verständnischeck.
  assert.deepEqual(state.passedLessonQuizzes, [lessonId]);
  // Zweimal bereinigen ändert nichts mehr.
  assert.deepEqual(normalize(state), state);
});

test("normalizeState: Unbekanntes, Doppeltes und Überlanges wird entfernt oder gekürzt", () => {
  const state = normalize({
    name: "zu lang und falsch!", className: "",
    profileId: "profile_gefälscht", profileDeviceId: "<script>",
    completedLessons: [lessonId, lessonId, "gibt-es-nicht", 7, null],
    completedPractices: ["gibt-es-nicht"],
    drafts: { [practiceId]: "x".repeat(150000), "gibt-es-nicht": "SELECT 1;", "frei-unbekannt": "x", "frei-fahrschule": 5 },
    slotDrafts: { [practiceId]: { a: "y".repeat(500), b: 5 }, fremd: { a: "x" } },
    lessonNotes: { [lessonId]: "n".repeat(20000), fremd: "x" },
    generalNotes: "g".repeat(20000),
    activityDates: ["2026-10-09", "2026-10-09", "9.10.2026", 5],
    transferHistory: Array.from({ length: 20 }, () => ({ importedAt: "t".repeat(100), sourceExportId: "falsch", sourceDeviceId: S.createOpaqueId("device") })),
    lastLessonId: "gibt-es-nicht",
    zusatzfeld: "soll verschwinden"
  });
  assert.equal(state.name, "");
  assert.equal(state.profileId, "");
  assert.equal(state.profileDeviceId, "");
  assert.deepEqual(state.completedLessons, [lessonId]);
  assert.deepEqual(state.completedPractices, []);
  assert.deepEqual(Object.keys(state.drafts), [practiceId]);
  assert.equal(state.drafts[practiceId].length, 100000);
  assert.deepEqual(Object.keys(state.slotDrafts), [practiceId]);
  assert.deepEqual(Object.keys(state.slotDrafts[practiceId]), ["a"]);
  assert.equal(state.slotDrafts[practiceId].a.length, 240);
  assert.deepEqual(Object.keys(state.lessonNotes), [lessonId]);
  assert.equal(state.lessonNotes[lessonId].length, 12000);
  assert.equal(state.generalNotes.length, 12000);
  assert.deepEqual(state.activityDates, ["2026-10-09"]);
  assert.equal(state.transferHistory.length, 12);
  assert.equal(state.transferHistory[0].importedAt.length, 40);
  assert.equal(state.transferHistory[0].sourceExportId, "");
  assert.equal(S.isOpaqueId(state.transferHistory[0].sourceDeviceId, "device"), true);
  assert.equal(state.lastLessonId, plain(S.defaultState).lastLessonId);
  assert.equal("zusatzfeld" in state, false);
});

test("normalizeState: ein gültiges Kürzel ohne Profilkennung bekommt eine neue Kennung", () => {
  const state = normalize({ name: "MAX.MUS" });
  assert.equal(S.isOpaqueId(state.profileId, "profile"), true);
});

test("normalizeState: Entwürfe aller Datenbestände des freien SQL-Labors bleiben erhalten", () => {
  const drafts = Object.fromEntries(Array.from(S.playgroundSchemas).map((key) => [`frei-${key}`, `-- ${key}`]));
  assert.ok(Object.keys(drafts).length >= 3);
  assert.deepEqual(normalize({ drafts }).drafts, drafts);
});

test("state.js wird nach seinen Quellen und vor app.js geladen, veröffentlicht und ist die einzige Kopie", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const at = (file) => html.indexOf(`src="${file}`);
  for (const before of ["content.js", "order-exercises.js", "study-tools.js", "drawing.js"]) {
    assert.ok(at(before) > 0 && at(before) < at("state.js"), before);
  }
  assert.ok(at("state.js") < at("app.js"));
  assert.equal(require("../tools/build-site.cjs").isPublicFile("state.js"), true);
  const source = fs.readFileSync(path.join(root, "state.js"), "utf8");
  assert.doesNotMatch(source, /document\.|localStorage|sessionStorage/);
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  assert.doesNotMatch(app, /function normalizeState|function normalizeStudentCode|function isOpaqueId|const defaultState = \{|const playgroundSchemas = \[/);
  // Laden und Speichern bleiben in app.js und benutzen die ausgelagerte Bereinigung.
  assert.match(app, /function loadState\(\)[\s\S]{0,300}normalizeState\(stored \|\| \{\}\)/);
});
