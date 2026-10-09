// Claude, OPT-16 Schritt 4: styles.css ist in sechs Dateien aufgeteilt. Die Reihenfolge der Dateien
// ist die Reihenfolge der früheren Datei und bestimmt, welche Regel gewinnt.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const order = ["styles.css", "styles-lesson.css", "styles-practice.css", "styles-visuals.css", "styles-shared.css", "styles-extensions.css"];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Beide Seiten laden alle sechs Style-Dateien in der festen Reihenfolge", () => {
  for (const page of ["index.html", "lehrkraft.html"]) {
    const linked = [...read(page).matchAll(/<link rel="stylesheet" href="([^"?]+)\?v=[^"]+">/g)].map((match) => match[1]);
    assert.deepEqual(linked, order, page);
  }
});

test("Jede Style-Datei ist veröffentlicht, in sich geschlossen und ohne @import", () => {
  const { isPublicFile } = require("../tools/build-site.cjs");
  for (const file of order) {
    assert.equal(isPublicFile(file), true, file);
    const css = read(file);
    assert.match(css, /^\/\* WorkbenchLab-Styles, Teil \d von 6:/, file);
    assert.doesNotMatch(css, /@import|@charset|@namespace/, file);
    let depth = 0;
    for (const char of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
      depth += (char === "{") - (char === "}");
      assert.ok(depth >= 0, `${file}: schließende Klammer ohne öffnende`);
    }
    assert.equal(depth, 0, `${file}: offene Klammer am Dateiende`);
  }
});

test("Es gibt keine weiteren Style-Dateien im Hauptordner, die keine Seite lädt", () => {
  const present = fs.readdirSync(root).filter((file) => /^styles.*\.css$/.test(file)).sort();
  assert.deepEqual(present, order.slice().sort());
});

test("Farbwerte und Grundlagen stehen weiter in der ersten Datei", () => {
  const css = read("styles.css");
  assert.match(css, /:root\s*\{\s*color-scheme: dark;/);
  assert.match(css, /--brand-2:/);
});
