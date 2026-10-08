const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "command-search.js", "reference-search.js"]) vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), context);
const content = context.window.WORKBENCH_CONTENT;
const library = context.window.WORKBENCH_REFERENCE_SEARCH;
const search = query => library.search(content, query);

test("Alle Nachschlagebereiche sind vollstaendig und eindeutig indexiert", () => {
  const entries = library.entries(content);
  assert.equal(entries.length, 2 + content.tools.length + content.tutorials.length + content.sources.length + content.reference.length);
  assert.equal(new Set(entries.map(item => item.id)).size, entries.length);
  assert.equal(search("").length, entries.length);
});

test("Deutsche Zwecke, SQL, Umlaute, Tippfehler und Video-Lektionscodes", () => {
  for (const [query, title] of [["Filtern", "Selektion"], ["Tabellen verbinden", "Join"], ["normalisieren", "3NF"], ["primaerschluessel", "Primärschlüssel"], ["Selekton", "Selektion"], ["WHERE", "Selektion"]]) {
    assert.ok(search(query).some(item => item.title === title), query);
  }
  assert.ok(search("Verbindung einrichten").some(item => item.id === "connection-guide"));
  assert.ok(search("3306").some(item => item.id === "connection-guide"));
  assert.ok(search("L2.2").filter(item => item.category === "Videos").length >= 2);
  assert.ok(search("Informatik Stick").some(item => item.id === "tool-0"));
  assert.ok(search("eERM").some(item => item.category === "Videos"));
  assert.ok(search("Bildungsplan").some(item => item.category === "Quellen"));
  assert.equal(search("nichtsgefundenxyz").length, 0);
  assert.equal(search('<script>alert("x")</script>').length, 0);
});
