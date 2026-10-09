const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const publicRootFiles = new Set([
  "index.html", "styles.css", "styles-lesson.css", "styles-practice.css", "styles-visuals.css", "styles-shared.css", "styles-extensions.css", "app.js", "content.js", "learning-path.js",
  "lesson-openings.js", "practical-exercises.js", "study-tools.js", "appearance.js",
  "drawing.js", "command-search.js", "reference-search.js", "sql-check.js", "backup.js", "nagold.js", "state.js", "sql-feedback.js", "review.js", "erm-editor.js", "debug-exercises.js", "predict-exercises.js", "order-exercises.js", "expected-results.js", "lehrkraft.html", "teacher-overview.js",
]);
const sourceOnlyAssets = new Set([
  "assets/bpe6-relief-map.png", "assets/bpe6-settlement-map.png", "assets/workbenchlab-titanium.png",
]);
function isPublicFile(file) {
  return !file.split("/").some((part) => part.startsWith(".") || part === "desktop.ini")
    && !sourceOnlyAssets.has(file)
    && (publicRootFiles.has(file) || file.startsWith("assets/") || file.startsWith("vendor/"));
}
function buildSite(root = path.resolve(__dirname, "..")) {
  const output = path.resolve(root, "_site");
  if (path.dirname(output) !== root || path.basename(output) !== "_site") {
    throw new Error("Ungültiger Zielordner.");
  }
  if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) {
    throw new Error("Der Ausgabeordner darf keine Verknüpfung sein.");
  }
  const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean);
  const files = tracked.filter(isPublicFile);
  for (const file of publicRootFiles) {
    if (!files.includes(file)) throw new Error(`Öffentliche App-Datei fehlt: ${file}`);
  }
  for (const file of files) {
    if (!fs.lstatSync(path.join(root, file)).isFile()) throw new Error(`Keine reguläre Datei: ${file}`);
  }
  fs.rmSync(output, { recursive: true, force: true });
  for (const file of files) {
    const target = path.join(output, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(root, file), target);
  }
  stripSolutions(output);
  console.log(`${files.length} öffentliche Dateien nach _site kopiert.`);
  return files;
}

// Claude, OPT-12: Lösungsanweisungen werden nicht veröffentlicht. Die Seite prüft mit den
// Sollergebnissen aus expected-results.js. Entfernt werden nur einzeilige Angaben.
const SOLUTION_FILES = ["content.js", "learning-path.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js"];
const SOLUTION_LINE = /^[ \t]*(?:solution|expectedSql|referenceSql|fixed|proofSql):[ \t]*"(?:[^"\\]|\\.)*",?[ \t]*\r?\n/gm;
function stripSolutions(output) {
  for (const file of SOLUTION_FILES) {
    const target = path.join(output, file);
    fs.writeFileSync(target, fs.readFileSync(target, "utf8").replace(SOLUTION_LINE, ""));
  }
  const context = require("node:vm").createContext({ window: {} });
  for (const file of ["content.js", "learning-path.js", "lesson-openings.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js", "order-exercises.js", "expected-results.js"]) {
    require("node:vm").runInContext(fs.readFileSync(path.join(output, file), "utf8"), context, { filename: file });
  }
  const { WORKBENCH_CONTENT: content, WORKBENCH_EXPECTED: expected } = context.window;
  for (const practice of content.practices) {
    const leaked = ["solution", "fixed"].filter((key) => practice[key] !== undefined)
      .concat(["expectedSql", "referenceSql"].filter((key) => practice.check?.[key] !== undefined))
      .concat((practice.questions || []).some((question) => question.proofSql !== undefined) ? ["proofSql"] : []);
    if (leaked.length) throw new Error(`Lösungsangabe würde veröffentlicht: ${practice.id} (${leaked.join(", ")})`);
    if (practice.type === "sql" && !expected[practice.id] && !practice.check.expected) {
      throw new Error(`Sollergebnis fehlt für ${practice.id}. Bitte node tools/build-expected.cjs ausführen.`);
    }
  }
}
module.exports = { isPublicFile, buildSite, stripSolutions, SOLUTION_LINE };
if (require.main === module) buildSite();
