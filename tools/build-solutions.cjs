// Claude, OPT-23: erzeugt die Lösungsdatei für die Lehrkraft.
// Die Datei landet unter resources/ (nicht versioniert, nicht veröffentlicht) und lässt sich
// im Entwicklermodus der Lernplattform über „Lösungsdatei laden“ einlesen.
// Aufruf: node tools/build-solutions.cjs
const fs = require("node:fs");
const path = require("node:path");
const { loadContent } = require("./build-expected.cjs");

const root = path.resolve(__dirname, "..");
const MARKER = "WorkbenchLab-Loesungen";

function collectSolutions(content) {
  const solutions = {};
  for (const practice of content.practices) {
    const lesson = content.lessons.find((item) => item.id === practice.lessonId);
    let lines = [];
    if (practice.type === "sql") {
      lines = [practice.solution || practice.check?.expectedSql || practice.check?.referenceSql || ""];
    } else if (practice.type === "order") {
      lines = [Array.from(practice.lines).join("\n")];
    } else if (practice.questions) {
      lines = Array.from(practice.questions).map((question) => `${question.question}\n→ ${question.options[question.correct]}`);
    }
    const slots = practice.slots || [];
    for (const slot of Array.from(slots)) {
      if (slot.answer !== undefined) lines.push(`${slot.label || slot.id}: ${slot.answer}`);
    }
    lines = lines.filter((line) => String(line).trim());
    if (lines.length) {
      solutions[practice.id] = { title: practice.title, lesson: lesson?.courseCode || "", lines };
    }
  }
  return { app: MARKER, version: content.version, solutions };
}

module.exports = { collectSolutions, MARKER };

if (require.main === module) {
  const data = collectSolutions(loadContent().WORKBENCH_CONTENT);
  const target = path.join(root, "resources", "workbenchlab-loesungen.json");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(data, null, 2));
  console.log(`${Object.keys(data.solutions).length} Lösungen nach ${path.relative(root, target)} geschrieben (nicht versioniert).`);
}
