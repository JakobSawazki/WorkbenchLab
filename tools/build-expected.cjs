// Claude, OPT-12: berechnet die Sollergebnisse aller SQL-Aufgaben und schreibt sie nach
// expected-results.js. Die veröffentlichte Seite prüft damit Lösungen, ohne dass die
// Lösungsanweisungen selbst ausgeliefert werden (siehe tools/build-site.cjs).
// Aufruf nach jeder Änderung an SQL-Aufgaben: node tools/build-expected.cjs
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");

const root = path.resolve(__dirname, "..");
const CONTENT_FILES = ["content.js", "learning-path.js", "lesson-openings.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js", "order-exercises.js"];

function loadContent(directory = root) {
  const context = vm.createContext({ window: {} });
  for (const file of CONTENT_FILES) {
    vm.runInContext(fs.readFileSync(path.join(directory, file), "utf8"), context, { filename: file });
  }
  return context.window;
}

function registerFunctions(db) {
  const parts = (value) => { const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/); return match ? { year: Number(match[1]), month: Number(match[2]) } : null; };
  db.create_function("YEAR", (value) => parts(value)?.year ?? null);
  db.create_function("MONTH", (value) => parts(value)?.month ?? null);
  db.create_function("DATEDIFF", (a, b) => { const left = Date.parse(String(a)), right = Date.parse(String(b)); return Number.isNaN(left) || Number.isNaN(right) ? null : Math.round((left - right) / 86400000); });
}

async function computeExpected(content) {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
  const table = (result) => { const last = result.at(-1); return { columns: last?.columns || [], values: last?.values || [] }; };
  const expected = {};
  for (const practice of content.practices.filter((item) => item.type === "sql")) {
    const check = practice.check;
    if (check.type === "query" ? !check.expectedSql : !check.referenceSql) continue;
    const db = new SQL.Database();
    try {
      registerFunctions(db);
      db.run(content.schemas[practice.schema].seed);
      if (check.type === "query") {
        expected[practice.id] = table(db.exec(check.expectedSql));
      } else {
        db.run(check.referenceSql);
        expected[practice.id] = table(db.exec(check.verifySql));
      }
    } finally {
      db.close();
    }
  }
  return expected;
}

function render(expected) {
  const body = Object.keys(expected).sort().map((id) => `  ${JSON.stringify(id)}: ${JSON.stringify(expected[id])}`).join(",\n");
  return `// Erzeugt von tools/build-expected.cjs – nicht von Hand ändern.\n// Sollergebnisse der SQL-Aufgaben; die Lösungsanweisungen werden nicht veröffentlicht.\nwindow.WORKBENCH_EXPECTED = {\n${body}\n};\n`;
}

module.exports = { CONTENT_FILES, loadContent, computeExpected, render };

if (require.main === module) {
  computeExpected(loadContent().WORKBENCH_CONTENT).then((expected) => {
    fs.writeFileSync(path.join(root, "expected-results.js"), render(expected));
    console.log(`${Object.keys(expected).length} Sollergebnisse nach expected-results.js geschrieben.`);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
