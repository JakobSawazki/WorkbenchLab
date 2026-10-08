const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "command-search.js"]) vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), context);
const commands = context.window.WORKBENCH_CONTENT.commands;
const search = query => context.window.WORKBENCH_COMMAND_SEARCH.search(commands, query);

test("Deutsche Zwecke, SQL-Namen und Mehrwortsuchen finden passende Befehle zuerst", () => {
  for (const [query, id] of [
    ["Filtern", "cmd-where"], ["WHERE", "cmd-where"], ["sortieren", "cmd-order"],
    ["Tabellen verbinden", "cmd-join"], ["Gruppen filtern", "cmd-having"],
    ["Durchschnitt", "cmd-functions"], ["Daten ändern", "cmd-update"],
    ["loeschen", "cmd-delete"], ["Fremdschlüssel", "cmd-foreign-key"],
    ["primaerschluessel", "cmd-primary-key"], ["wie kann ich sortieren", "cmd-order"],
    ["sortiern", "cmd-order"], ["ORDER BY", "cmd-order"]
  ]) assert.equal(search(query)[0]?.id, id, query);
});

test("Leere Suche, unbekannte Begriffe und sichere Eingaben", () => {
  assert.equal(search("  ").length, commands.length);
  assert.equal(search("xyzunbekannt").length, 0);
  assert.equal(search("nichtsgefundenxyz").length, 0);
  assert.equal(search('<script>alert("x")</script>').length, 0);
  assert.equal(search("AVG")[0].id, "cmd-functions");
  assert.ok(search("filtern").some(command => command.id === "cmd-having"));
});
