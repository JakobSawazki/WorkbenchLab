const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const publicRootFiles = new Set([
  "index.html", "styles.css", "app.js", "content.js", "learning-path.js",
  "lesson-openings.js", "practical-exercises.js", "study-tools.js", "appearance.js",
  "drawing.js", "command-search.js", "reference-search.js",
]);
function isPublicFile(file) {
  return !file.split("/").some((part) => part.startsWith(".") || part === "desktop.ini")
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
  console.log(`${files.length} öffentliche Dateien nach _site kopiert.`);
  return files;
}
module.exports = { isPublicFile, buildSite };
if (require.main === module) buildSite();
