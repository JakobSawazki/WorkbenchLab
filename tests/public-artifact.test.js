const assert = require("node:assert/strict");
const test = require("node:test");
const { isPublicFile } = require("../tools/build-site.cjs");

test("Pages enthält App, Bilder, SQL-Downloads und lokale Bibliotheken", () => {
  for (const file of ["index.html", "app.js", "styles.css", "assets/sql/exercise.sql", "assets/tutorials/workbench-start.mp4", "vendor/sql.js/sql-wasm.wasm"]) {
    assert.equal(isPublicFile(file), true, file);
  }
});
test("Pages schließt Quellen, interne Unterlagen und Testartefakte aus", () => {
  for (const file of ["resources/original.pdf", "references/answers.pdf", "Lehrbuch/README.md", "documentation/report.md", "tests/secret.test.js", "tools/build-site.cjs", "claude2codex.md", ".git/config", ".tmp/shot.png", "assets/desktop.ini", "assets/.private/file.txt"]) {
    assert.equal(isPublicFile(file), false, file);
  }
});
