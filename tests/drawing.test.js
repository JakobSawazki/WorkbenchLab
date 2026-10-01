const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "drawing.js"), "utf8"), context);
const drawing = context.window.WORKBENCH_DRAWING;
const stroke = { tool: "pen", color: "#17212b", width: 5, points: [[0.1, 0.2], [0.123456, 0.5]] };

test("Zeichnungsimport akzeptiert nur bekannte Notizen, Werkzeuge, Farben und endliche Koordinaten", () => {
  const result = drawing.normalize({ general: [stroke, { ...stroke, tool: "eval" }, { ...stroke, color: "url(secret)" },
    { ...stroke, width: 999 }, { ...stroke, points: [[NaN, 0]] }, { ...stroke, points: [[-1, 0]] },
    { ...stroke, points: [[1, null]] }], unknown: [stroke] }, new Set(["general"]));
  assert.deepEqual(JSON.parse(JSON.stringify(result)), { general: [{ ...stroke, points: [[0.1, 0.2], [0.1235, 0.5]] }] });
});

test("Zeichnungsimport begrenzt Datenmenge und bewahrt Radieroperationen", () => {
  const dense = { ...stroke, points: Array.from({ length: 1000 }, () => [0.5, 0.5]) };
  const result = drawing.normalize({ general: Array.from({ length: 100 }, () => dense) }, new Set(["general"]));
  assert.equal(result.general.length, 8);
  const erased = drawing.normalize({ general: [stroke, { ...stroke, tool: "erase", width: 20 }] }, new Set(["general"]));
  assert.equal(erased.general[1].tool, "erase");
  for (const width of drawing.eraserWidths) {
    assert.equal(drawing.normalize({ general: [{ ...stroke, tool: "erase", width }] }, new Set(["general"])).general[0].width, width);
    assert.equal(drawing.normalize({ general: [{ ...stroke, width }] }, new Set(["general"])).general.length, 0);
  }
});
