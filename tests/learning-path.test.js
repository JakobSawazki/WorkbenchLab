const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

const content = context.window.WORKBENCH_CONTENT;
const lesson = (code) => content.lessons.find((item) => item.courseCode === code);
const practice = (item) => content.practices.find((entry) => entry.id === item.practiceId);

test("sechs öffentliche Tutorials sind eindeutigen Lernstellen zugeordnet", () => {
  assert.equal(content.tutorials.length, 6);
  assert.equal(new Set(content.tutorials.map((item) => item.id)).size, 6);
  for (const item of content.tutorials) {
    assert.match(item.id, /^[A-Za-z0-9_-]{11}$/);
    assert.match(item.lesson, /^L[12]\.\d/);
    assert.ok(item.title && item.channel && item.description);
  }
});

test("Dark Mode startet ohne gespeicherte Einstellung als Standard", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(html, /<html lang="de" data-theme="dark">/);
  assert.match(html, /localStorage\.getItem\("workbenchlab-theme-v1"\) === "light"/);
  assert.match(css, /:root\s*\{\s*color-scheme: dark;/);
  assert.match(css, /:root\[data-theme="light"\]\s*\{\s*color-scheme: light;/);
});

test("die ersten drei Lerneinheiten stehen in der richtigen Reihenfolge", () => {
  const firstModule = content.modules[0];
  assert.equal(firstModule.code, "L1");
  assert.deepEqual(Array.from(firstModule.lessonIds.slice(0, 3)), [
    "warum-datenbanken", "relation-und-schluessel", "eerm-grundlagen"
  ]);
  assert.deepEqual(["L1.1", "L1.2", "L1.3"].map((code) => lesson(code)?.id),
    Array.from(firstModule.lessonIds.slice(0, 3)));
});

test("jede Starteinheit hat Quellen, Aufgabenblatt, Praxisauftrag und gültige Checks", () => {
  for (const code of ["L1.1", "L1.2", "L1.3"]) {
    const item = lesson(code);
    assert.ok(item, `${code} fehlt`);
    assert.ok(item.sections.length >= 2, `${code}: Erklärung fehlt`);
    assert.ok(item.webWorksheet.definitionTerms.length >= 4, `${code}: Aufgabenblatt fehlt`);
    assert.ok(item.classroomTask.steps.length >= 3, `${code}: Praxisauftrag fehlt`);
    assert.ok(item.notePrompts.length >= 3, `${code}: Notizfragen fehlen`);
    assert.ok(item.sourceMaterials.length >= 2, `${code}: Materialbezug fehlt`);
    assert.ok(item.quiz.options[item.quiz.correct], `${code}: Verständnischeck ungültig`);
    assert.equal(practice(item)?.lessonId, item.id, `${code}: Browserübung falsch zugeordnet`);
  }
});

test("L1.2 trennt fachliches ERD und Relationenschema vor der Workbench", () => {
  const item = lesson("L1.2");
  assert.equal(item.webWorksheet.definitionTerms.length, 4);
  assert.equal(item.webWorksheet.columnCount || 0, 0);
  assert.ok(!item.workflow.some((step) => step.includes("Workbench")));
  assert.ok(item.sections.some((section) => section.visual === "single-table-model"));
  assert.equal(practice(item).questions.length, 3);
});

test("L1.3 kontrolliert das gespeicherte Ein-Tabellen-Modell", () => {
  const item = lesson("L1.3");
  assert.equal(item.webWorksheet.definitionTerms.length, 6);
  assert.ok(item.classroomTask.fileName.endsWith(".mwb"));
  assert.ok(item.sections.some((section) => section.visual === "single-table-workbench"));
  assert.ok(item.sections.some((section) => section.code?.includes("SELECT VERSION();")));
  assert.ok(item.classroomTask.steps.some((step) => step.includes("Workbench 6.3.10")));
  assert.ok(item.webWorksheet.definitionTerms.some((term) => term.id === "start-verbindung"));
  assert.equal(practice(item).slots.length, 5);
  for (const slot of practice(item).slots) {
    assert.ok(slot.options.includes(slot.answer), `Ungültige Antwort: ${slot.id}`);
  }
});

test("Nachschlagen erklaert Stick, Schulversion und lokale Verbindung", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  assert.match(app, /MySQL Workbench 6\.3\.10/);
  assert.match(app, /connection-guide/);
  assert.match(app, /SELECT VERSION\(\);/);
  assert.match(app, /Windows- oder Microsoft-365-Passwort/);
  const stick = content.tools.find((tool) => tool.title === "Informatik-Stick");
  assert.equal(stick.url, "https://schultasche-bw.de/");
});

test("L1.4 leitet von der Modelldatei zum geprueften Datenimport", () => {
  const item = lesson("L1.4");
  assert.equal(lesson("L1.1").webWorksheet.columnCount, 11);
  assert.equal(item.webWorksheet.definitionTerms.length, 5);
  assert.ok(item.sections.some((section) => section.body?.some((text) => text.includes("Synchronize Model"))));
  assert.ok(item.sections.some((section) => section.code?.includes("SELECT COUNT(*)")));
  assert.equal(item.classroomTask.steps.length, 5);
  assert.equal(practice(item).slots[3].answer, "Synchronize Model ausführen und die SQL-Vorschau prüfen");
  const download = path.join(root, item.classroomTask.download.href);
  assert.ok(fs.existsSync(download), "Das Unterrichtsskript fehlt");
  const sql = fs.readFileSync(download, "utf8");
  assert.match(sql, /INSERT INTO fahrschueler/);
  assert.match(sql, /SELECT COUNT\(\*\)/);
  assert.doesNotMatch(sql, /\b(?:DROP|DELETE|TRUNCATE)\b/i);
});

test("L1.5 hat die drei Projektion-Auftraege als ausfuehrbare SQL-Uebungen", () => {
  const item = lesson("L1.5");
  assert.equal(item.webWorksheet.definitionTerms.length, 4);
  assert.ok(item.sections.some((section) => section.code?.includes("ORDER BY nachname")));
  const exercises = content.practices.filter((entry) => entry.lessonId === item.id);
  assert.equal(exercises.length, 3);
  for (const exercise of exercises) {
    assert.equal(exercise.type, "sql");
    assert.equal(exercise.schema, "fahrschule-basic");
    assert.match(exercise.check.expectedSql, /SELECT schuelernr, vorname, nachname/);
    assert.match(exercise.check.expectedSql, /ORDER BY/);
    assert.ok(exercise.hints.length >= 2);
  }
  assert.match(exercises[1].check.expectedSql, /ort DESC/);
  assert.match(exercises[2].check.expectedSql, /nachname, vorname/);
  assert.match(content.schemas["fahrschule-basic"].seed, /'Keller', 'Mia'/);
  assert.match(content.schemas["fahrschule-basic"].seed, /'Keller', 'Aaron'/);
});

test("die Schueleransicht zeigt keinen Musterloesungs-Reiter", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  assert.doesNotMatch(app, /data-runner-tab="solution"/);
  assert.doesNotMatch(app, /escapeHtml\(practice\.solution\)/);
  assert.match(app, /data-runner-tab="hint"/);
});

test("L1.6 bildet die Selektionsaufgaben und passende Browseruebungen ab", () => {
  const item = lesson("L1.6");
  assert.equal(item.webWorksheet.definitionTerms.length, 12);
  assert.equal(item.classroomTask.steps.length, 4);
  assert.ok(item.sections.some((section) => section.code?.includes("BETWEEN")));
  const exercises = content.practices.filter((entry) => entry.lessonId === item.id);
  assert.equal(exercises.length, 5);
  for (const exercise of exercises) {
    assert.equal(exercise.type, "sql");
    assert.ok(exercise.check.expectedSql);
    assert.ok(exercise.hints.length >= 2);
  }
  const script = fs.readFileSync(path.join(root, "assets/sql/l1-4-fahrschule-beispieldaten.sql"), "utf8");
  assert.match(script, /Dressel/);
  assert.match(script, /Schorndorf/);
  assert.match(script, /Drosselweg/);
  assert.doesNotMatch(script, /\b(?:DROP|DELETE|TRUNCATE)\b/i);
});

test("L1.7 bildet die vier DISTINCT-Auftraege aus dem Material ab", () => {
  const item = lesson("L1.7");
  assert.equal(item.webWorksheet.definitionTerms.length, 4);
  assert.equal(item.classroomTask.steps.length, 4);
  assert.ok(item.sections.some((section) => section.code?.includes("SELECT DISTINCT ort, plz")));
  assert.ok(item.sections.every((section) => !section.code?.includes("LIKE")));
  const exercises = content.practices.filter((entry) => entry.lessonId === item.id);
  for (const column of ["ort, plz", "vorname", "nachname", "fahrstunden"]) {
    assert.ok(exercises.some((entry) => entry.check.expectedSql?.includes(`SELECT DISTINCT ${column}`)), `${column}: Browserübung fehlt`);
  }
  assert.ok(item.webWorksheet.definitionTerms[3].prompt.includes("fahrstundenzahl"));
  assert.ok(item.webWorksheet.hint.includes("fahrstunden"));
  assert.equal(item.quiz.correct, 0);
  const seed = content.schemas["fahrschule-basic"].seed;
  assert.match(seed, /'Keller', 'Mia'.*, 8\)/);
  assert.match(seed, /'Keller', 'Aaron'.*, 8\)/);
});

test("L2.1 erklaert Speicherredundanz und das fachliche Zwei-Tabellen-Modell", () => {
  const item = lesson("L2.1");
  assert.equal(item.webWorksheet.definitionTerms.length, 5);
  assert.ok(item.sections.some((section) => section.visual === "redundancy"));
  assert.ok(item.sections.some((section) => section.visual === "two-table-concept"));
  assert.ok(item.sections.some((section) => section.code?.includes("ortnr FK")));
  assert.ok(item.sections.some((section) => section.body?.some((paragraph) => paragraph.includes("DISTINCT"))));
  assert.equal(practice(item).questions.length, 4);
  assert.equal(item.classroomTask.steps.length, 4);
});

test("L2.2 laesst eine 1:N-Beziehung in Workbench und im Browser pruefen", () => {
  const item = lesson("L2.2");
  const diagram = practice(item);
  assert.equal(diagram.type, "diagram");
  assert.equal(diagram.slots.length, 3);
  assert.deepEqual(Array.from(diagram.diagram.chain.filter((entry) => entry.type === "entity").map((entry) => entry.title)), ["orte", "fahrschueler"]);
  assert.equal(diagram.slots.find((slot) => slot.id === "placeForeignKey").answer, "ortnr FK");
  assert.ok(item.sections.some((section) => section.code?.includes("JOIN orte")));
  assert.ok(item.sections.some((section) => section.warning?.includes("DROP")));
  assert.equal(item.webWorksheet.definitionTerms.length, 5);
  const download = path.join(root, item.classroomTask.download.href);
  assert.ok(fs.existsSync(download), "Das fiktive L2-Importscript fehlt");
  const sql = fs.readFileSync(download, "utf8");
  assert.match(sql, /USE fahrschule_l2;/);
  assert.match(sql, /JOIN orte AS o ON f\.ortnr = o\.ortnr/);
  assert.doesNotMatch(sql, /\b(?:DROP|DELETE|TRUNCATE|ALTER)\b/i);
});
