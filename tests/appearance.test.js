const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "appearance.js"), "utf8"), context);
const appearance = context.window.WORKBENCH_APPEARANCE;

test("Standardpaletten und sämtliche vorgegebenen Text/Hintergrund-Kombinationen sind kontrastreich", () => {
  for (const theme of ["dark", "light"]) {
    for (const text of appearance.choices[theme].text) {
      for (const background of appearance.choices[theme].background) {
        const result = appearance.tokens({ ...appearance.defaults[theme], text, background }, theme);
        assert.ok(result.minimum >= 4.5, `${theme} ${text} ${background}`);
        for (const surface of ["--bg", "--panel", "--panel-strong"]) {
          assert.ok(appearance.contrast(result.properties["--muted"], result.properties[surface]) >= 4.5);
        }
      }
    }
  }
});

test("Akzentfarben bleiben als Links und Primärbuttons gut lesbar", () => {
  for (const theme of ["dark", "light"]) {
    for (const accent of [...appearance.choices[theme].accent, "#ffffff", "#000000", "#ff0000"]) {
      const { properties } = appearance.tokens({ ...appearance.defaults[theme], accent }, theme);
      assert.ok(appearance.contrast(properties["--brand-2"], properties["--panel-strong"]) >= 4.5);
      assert.ok(appearance.contrast(properties["--on-accent"], properties["--metal-primary-top"]) >= 4.5);
    }
  }
});

test("Ungültige gespeicherte Farben, Schriftgrößen und kontrastarme Paletten werden verworfen", () => {
  const defaults = appearance.normalize(null);
  const invalid = appearance.normalize({ fontSize: 200, palettes: { dark: { text: "#090b0e", background: "#090b0e", accent: "url(secret)" } } });
  assert.equal(JSON.stringify(invalid), JSON.stringify(defaults));
  const custom = appearance.normalize({ fontSize: 20, palettes: { dark: { ...appearance.defaults.dark, background: "#101018" } } });
  assert.equal(custom.fontSize, 20);
  assert.equal(custom.palettes.dark.background, appearance.defaults.dark.background);
});
