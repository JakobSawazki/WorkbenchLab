const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { updateReleaseHistory } = require("../tools/update-release-history.cjs");
const { version } = require("../package.json");

test("der eingebettete Versionsverlauf entspricht dem Changelog und beginnt mit der aktuellen Version", () => {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const changelog = fs.readFileSync(path.join(root, "CHANGELOG.md"), "utf8");
  const history = html.split("<!-- RELEASE_HISTORY_START -->")[1].split("<!-- RELEASE_HISTORY_END -->")[0];
  assert.equal(updateReleaseHistory(html, changelog), html, "Bitte node tools/update-release-history.cjs ausführen.");
  const versions = [...history.matchAll(/<strong>V([^<]+)<\/strong>/g)].map(match => match[1]);
  assert.equal(versions[0], version);
  assert.equal(new Set(versions).size, versions.length);
  assert.deepEqual(versions, [...versions].sort((a, b) => b.split(" bis ").at(-1).replace(/^V/, "").localeCompare(a.split(" bis ").at(-1).replace(/^V/, ""), "en", { numeric: true })));
  assert.doesNotMatch(history, /href=|documentation\//);
});
