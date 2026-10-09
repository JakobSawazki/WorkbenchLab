// Claude, OPT-23: Lösungsdatei für die Lehrkraft (tools/build-solutions.cjs).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadContent } = require("../tools/build-expected.cjs");
const { collectSolutions, MARKER } = require("../tools/build-solutions.cjs");

const root = path.resolve(__dirname, "..");
const content = loadContent().WORKBENCH_CONTENT;
const data = collectSolutions(content);

test("solution file covers every exercise with at least one non-empty line", () => {
  assert.equal(data.app, MARKER);
  assert.equal(data.version, content.version);
  const ids = Array.from(content.practices).map((practice) => practice.id);
  assert.deepEqual(Object.keys(data.solutions).sort(), ids.slice().sort());
  for (const id of ids) {
    const entry = data.solutions[id];
    assert.ok(entry.title, id);
    assert.ok(entry.lines.length >= 1 && entry.lines.every((line) => typeof line === "string" && line.trim()), id);
  }
});

test("solution file contains the expected kinds of solutions", () => {
  assert.match(data.solutions["sql-projection"].lines[0], /^SELECT schuelernr, vorname, nachname/);
  assert.match(data.solutions["predict-where-and"].lines[0], /\n→ /);
  assert.match(data.solutions["order-where-sortierung"].lines[0], /^SELECT[\s\S]+\nFROM /);
  assert.ok(data.solutions["erm-fahrschule-1n-diagram"].lines.some((line) => /1:N/.test(line)));
});

test("solution file is neither versioned nor published", () => {
  const ignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.match(ignore, /^\/?resources\/?\s*$/m);
  const build = fs.readFileSync(path.join(root, "tools", "build-site.cjs"), "utf8");
  assert.equal(build.includes("build-solutions"), false);
  assert.equal(build.includes("workbenchlab-loesungen"), false);
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const start = app.indexOf("async function loadSolutionFile");
  const end = app.indexOf("function teacherSolutionHtml");
  assert.ok(start > 0 && end > start);
  assert.equal(/localStorage|sessionStorage|saveState/.test(app.slice(start, end)), false);
});
