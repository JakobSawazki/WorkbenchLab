const fs = require("node:fs");
const path = require("node:path");

const tableRow = /^\|\s*(\d+\.\d+(?:\.\d+)?(?: bis \d+\.\d+)?)\s*\|\s*(?:(?:C|Cl)(?:,\s*(?:C|Cl))?\s*\|\s*)?([^|]+?)\s*\|/;
const historyBlock = /(<!-- RELEASE_HISTORY_START -->)\r?\n[\s\S]*?([ \t]*<!-- RELEASE_HISTORY_END -->)/;
const escapeHtml = text => text.replace(/[&<>]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]);

function updateReleaseHistory(html, changelog) {
  const entries = changelog.split(/\r?\n/).map(line => line.match(tableRow)).filter(Boolean);
  if (!entries.length || !historyBlock.test(html)) throw new Error("Versionsverlauf oder HTML-Markierungen fehlen.");
  const eol = html.includes("\r\n") ? "\r\n" : "\n";
  const rows = entries.map(([, version, summary]) =>
    `      <li><strong>V${version.replace(" bis ", " bis V")}</strong><p>${escapeHtml(summary.replaceAll("`", ""))}</p></li>`
  ).join(eol);
  return html.replace(historyBlock, (_, start, end) => `${start}${eol}${rows}${eol}${end}`);
}

module.exports = { updateReleaseHistory };
if (require.main === module) {
  const root = path.resolve(__dirname, "..");
  const index = path.join(root, "index.html");
  const html = fs.readFileSync(index, "utf8");
  const changelog = fs.readFileSync(path.join(root, "CHANGELOG.md"), "utf8");
  const updated = updateReleaseHistory(html, changelog);
  if (updated !== html) fs.writeFileSync(index, updated);
}
