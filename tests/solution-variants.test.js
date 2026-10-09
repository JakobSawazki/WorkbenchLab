// Claude, 0.41.4: Gleichwertige Schreibweisen einer richtigen Lösung müssen angenommen werden.
// Für jede SQL-Aufgabe wird die Musterlösung mechanisch umgeschrieben (Groß-/Kleinschreibung,
// Zeilenumbrüche, Kommentare, ASC, Backticks, Tabellenvorsatz …) und so geprüft wie im Browser:
// Aufgabenmuster plus Ergebnisvergleich. Falsche Lösungen müssen weiterhin durchfallen.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const { loadContent } = require("../tools/build-expected.cjs");

const root = path.resolve(__dirname, "..");
const content = loadContent().WORKBENCH_CONTENT;
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, "sql-check.js"), "utf8"), context, { filename: "sql-check.js" });
const check = context.window.WORKBENCH_SQL_CHECK;
const tasks = Array.from(content.practices).filter((practice) => practice.type === "sql");
const solutionOf = (practice) => practice.solution || practice.check.expectedSql || practice.check.referenceSql;

// Wendet fn nur außerhalb von Textwerten an.
const outside = (sql, fn) => sql.split(/('(?:[^']|'')*')/).map((part, index) => (index % 2 ? part : fn(part))).join("");
const KEYWORDS = /\b(select|distinct|from|where|and|or|not|in|between|like|is|null|order|by|asc|desc|group|having|inner|left|right|join|on|as|insert|into|values|update|set|delete|create|table|primary|key|foreign|references|count|sum|avg|min|max|year|month|datediff|coalesce|limit|integer|int|text|varchar|date|real)\b/gi;
// ORDER BY bis zum Ende der Anweisung umschreiben.
const orderBy = (sql, fn) => outside(sql, (part) => part.replace(/(\bORDER\s+BY\s+)([^;]+)/gi, (_, head, list) => head + list.split(",").map((item) => fn(item.trim())).join(", ")));
const singleTable = (sql) => (/\bjoin\b/i.test(sql) || /\bfrom\s+\w+\s*,/i.test(sql) ? null : sql.match(/\bfrom\s+`?(\w+)`?/i)?.[1] || null);
const variants = {
  "Schlüsselwörter klein": (sql) => outside(sql, (part) => part.replace(KEYWORDS, (word) => word.toLowerCase())),
  "Schlüsselwörter groß": (sql) => outside(sql, (part) => part.replace(KEYWORDS, (word) => word.toUpperCase())),
  "alles in Großbuchstaben": (sql) => outside(sql, (part) => part.toUpperCase()),
  "ohne Semikolon am Ende": (sql) => sql.trim().replace(/;\s*$/, ""),
  "alles in einer Zeile": (sql) => outside(sql, (part) => part.replace(/\s+/g, " ")).trim(),
  "jede Klausel und jedes Komma in neuer Zeile": (sql) => outside(sql, (part) => part.replace(/\s+/g, " ").replace(/,\s*/g, ",\n    ").replace(/\s+\b(FROM|WHERE|GROUP BY|HAVING|ORDER BY|INNER JOIN|LEFT JOIN|JOIN|ON|VALUES|SET|AND|OR)\b/gi, "\n$1")),
  "Tabulatoren und doppelte Leerzeichen": (sql) => outside(sql, (part) => part.replace(/ /g, "  ").replace(/\n\s*/g, "\n\t")),
  "ohne Leerzeichen um Vergleichszeichen": (sql) => outside(sql, (part) => part.replace(/\s*(<=|>=|<>|!=|=|<|>)\s*/g, "$1")),
  "Leerzeichen in Klammern": (sql) => outside(sql, (part) => part.replace(/\(\s*/g, "( ").replace(/\s*\)/g, " )")),
  "Leerzeichen vor Klammern": (sql) => outside(sql, (part) => part.replace(/(\w)\(/g, "$1 (")),
  "Kommentarzeile davor": (sql) => `-- Meine Lösung, mit SELECT * wäre es zu viel\n${sql}`,
  "Kommentar dahinter": (sql) => `${sql.trim()}\n-- fertig, Peter's Idee`,
  "Blockkommentar mittendrin": (sql) => sql.replace(/\bFROM\b/i, "/* Tabelle */ FROM"),
  "Leerzeilen davor und dahinter": (sql) => `\n\n${sql}\n\n`,
  "!= statt <>": (sql) => outside(sql, (part) => part.replace(/<>/g, "!=")),
  "<> statt !=": (sql) => outside(sql, (part) => part.replace(/!=/g, "<>")),
  "JOIN statt INNER JOIN": (sql) => outside(sql, (part) => part.replace(/\bINNER\s+JOIN\b/gi, "JOIN")),
  "INNER JOIN statt JOIN": (sql) => outside(sql, (part) => part.replace(/(?<!\b(?:INNER|LEFT|RIGHT|OUTER|CROSS)\s+)\bJOIN\b/gi, "INNER JOIN")),
  "ASC bei jeder aufsteigenden Sortierspalte": (sql) => orderBy(sql, (item) => (/\b(?:ASC|DESC)$/i.test(item) ? item : `${item} ASC`)),
  "ohne ASC": (sql) => outside(sql, (part) => part.replace(/\s+ASC\b/gi, "")),
  "Tabellenalias ohne AS": (sql) => outside(sql, (part) => part.replace(/(\b(?:FROM|JOIN)\s+\w+)\s+AS\s+(\w+)/gi, "$1 $2")),
  "Backticks um Tabellennamen": (sql) => outside(sql, (part) => part.replace(/(\b(?:FROM|JOIN|INTO|UPDATE)\s+)(\w+)/gi, "$1`$2`")),
  "Sortierspalten mit Tabellennamen davor": (sql) => {
    const table = singleTable(sql);
    return table ? orderBy(sql, (item) => (/^[a-z_]\w*(\s+(?:ASC|DESC))?$/i.test(item) ? `${table}.${item}` : item)) : sql;
  }
};

let SQL;
const database = (schema) => {
  const db = new SQL.Database();
  check.registerSqlFunctions(db);
  db.run(content.schemas[schema].seed);
  return db;
};
// Dieselbe Entscheidung wie runSqlPractice in app.js.
function judge(practice, sql) {
  const problems = check.checkSqlPatterns(sql, practice.check);
  let db, expectedDb;
  try {
    db = database(practice.schema);
    let table, expected, ordered = true;
    if (practice.check.type === "mutation") {
      db.run(sql);
      table = check.tableFromResult(db.exec(practice.check.verifySql));
      if (practice.check.referenceSql) {
        expectedDb = database(practice.schema);
        expectedDb.run(practice.check.referenceSql);
        expected = check.tableFromResult(expectedDb.exec(practice.check.verifySql));
      } else {
        expected = practice.check.expected;
      }
    } else {
      table = check.tableFromResult(db.exec(sql));
      expectedDb = database(practice.schema);
      expected = check.tableFromResult(expectedDb.exec(practice.check.expectedSql));
      ordered = practice.check.orderSensitive;
    }
    if (problems.length) return `Muster: ${Array.from(problems).map((problem) => problem.pattern).join(" | ")}`;
    return check.sameTable(table, expected, ordered) ? "" : "Ergebnis weicht ab";
  } catch (error) {
    return `Fehler: ${error.message}`;
  } finally {
    db?.close();
    expectedDb?.close();
  }
}

test.before(async () => {
  SQL = await initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
});

test("Jede SQL-Aufgabe hat eine Musterlösung, die ihre eigene Prüfung besteht", () => {
  assert.ok(tasks.length >= 32);
  for (const practice of tasks) {
    assert.ok(solutionOf(practice), `${practice.id} ohne Musterlösung`);
    assert.equal(judge(practice, solutionOf(practice)), "", practice.id);
  }
});

test("Gleichwertige Schreibweisen der Musterlösung werden angenommen", () => {
  const rejected = [];
  let checked = 0;
  for (const practice of tasks) {
    const solution = solutionOf(practice);
    for (const [label, rewrite] of Object.entries(variants)) {
      const sql = rewrite(solution);
      if (sql === solution) continue;
      checked += 1;
      const verdict = judge(practice, sql);
      if (verdict) rejected.push(`${practice.id} · ${label} · ${verdict} · ${sql.replace(/\s+/g, " ").slice(0, 120)}`);
    }
  }
  assert.ok(checked > 350, `nur ${checked} Schreibweisen erzeugt`);
  assert.deepEqual(rejected, []);
});

test("Kommentare zählen nicht zur Lösung, Textwerte bleiben unangetastet", () => {
  const rule = { required: ["order\\s+by\\s+nachname\\s*,\\s*vorname"], forbidden: ["select\\s+\\*"] };
  const problems = (sql) => Array.from(check.checkSqlPatterns(sql, rule)).map((problem) => (problem.forbidden ? "verboten" : "fehlt"));
  assert.deepEqual(problems("SELECT a FROM t ORDER BY nachname, vorname;"), []);
  assert.deepEqual(problems("SELECT a FROM t ORDER BY t.nachname ASC, `vorname` ASC;"), []);
  // Verlangtes steht nur im Kommentar: fehlt weiterhin.
  assert.deepEqual(problems("SELECT a FROM t; -- ORDER BY nachname, vorname"), ["fehlt"]);
  assert.deepEqual(problems("SELECT a FROM t /* ORDER BY nachname, vorname */;"), ["fehlt"]);
  // Verbotenes steht nur im Kommentar: kein Verstoß.
  assert.deepEqual(problems("-- SELECT * wäre zu viel\nSELECT a FROM t ORDER BY nachname, vorname;"), []);
  // Verbotenes bleibt verboten, auch mit Tabellenvorsatz.
  assert.deepEqual(problems("SELECT * FROM t ORDER BY nachname, vorname;"), ["verboten"]);
  assert.deepEqual(problems("SELECT t.* FROM t ORDER BY nachname, vorname;"), ["verboten"]);
  // DESC ist nicht dasselbe wie ASC.
  assert.deepEqual(problems("SELECT a FROM t ORDER BY nachname DESC, vorname;"), ["fehlt"]);
  // Ein Apostroph im Kommentar bringt die Zerlegung nicht durcheinander.
  assert.deepEqual(problems("-- Peter's Lösung\nSELECT a FROM t WHERE x = 'a -- b' ORDER BY nachname, vorname;"), []);
  // Muster auf Textwerte greifen weiter.
  assert.deepEqual(Array.from(check.checkSqlPatterns("SELECT a FROM t WHERE ort = 'Stuttgart';", { required: ["'stuttgart'"] })), []);
  assert.equal(Array.from(check.checkSqlPatterns("SELECT a FROM t; -- 'Stuttgart'", { required: ["'stuttgart'"] })).length, 1);
  const [plain, simple] = Array.from(check.patternTexts("SELECT f.a, 'f.b -- x' FROM `t` AS f ORDER BY f.a ASC; -- Ende"));
  assert.equal(plain.trim(), "SELECT f.a, 'f.b -- x' FROM `t` AS f ORDER BY f.a ASC;");
  assert.equal(simple.trim(), "SELECT a, 'f.b -- x' FROM t AS f ORDER BY a;");
  assert.equal(Array.from(check.patternTexts("SELECT 1.5 + 2.25;"))[1], "SELECT 1.5 + 2.25;");
});

test("Falsche Lösungen fallen weiterhin durch", () => {
  const byId = (id) => tasks.find((practice) => practice.id === id);
  const projection = byId("sql-projection");
  assert.match(judge(projection, "SELECT * FROM fahrschueler ORDER BY nachname;"), /Muster/);
  assert.match(judge(projection, solutionOf(projection).replace(/\s*ORDER BY[^;]*/i, "")), /Muster/);
  assert.match(judge(projection, solutionOf(projection).replace(/ORDER BY nachname/i, "ORDER BY nachname DESC")), /Ergebnis weicht ab/);
  assert.match(judge(projection, "SELECT schuelernr FROM fahrschueler ORDER BY nachname;"), /Ergebnis weicht ab/);
  const course = byId("sql-create-course");
  assert.match(judge(course, "CREATE TABLE kurse (kursnr INT NOT NULL PRIMARY KEY, titel VARCHAR(50) NOT NULL, startdatum DATE NOT NULL);"), /Ergebnis weicht ab/);
  assert.match(judge(course, "CREATE TABLE kurse (kursnr INT NOT NULL PRIMARY KEY, titel VARCHAR(60), startdatum DATE NOT NULL);"), /Ergebnis weicht ab/);
  assert.equal(judge(course, "CREATE TABLE kurse (kursnr INT NOT NULL PRIMARY KEY, titel VARCHAR (60) NOT NULL, startdatum DATE NOT NULL);"), "");
  const update = byId("sql-update-hours");
  assert.match(judge(update, "UPDATE fahrschueler SET fahrstunden = 5;"), /Muster/);
});
