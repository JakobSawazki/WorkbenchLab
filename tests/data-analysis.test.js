const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js"]) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
const content = context.window.WORKBENCH_CONTENT;
const lessons = content.lessons.filter((item) => item.courseCode?.startsWith("L5."));
const raw = fs.readFileSync(path.join(root, "assets/sql/l5-datenanalyse-testdaten.sql"), "utf8");
const SQLPromise = initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
const rows = (db, sql) => db.exec(sql)[0]?.values || [];
async function database() {
  const SQL = await SQLPromise;
  const db = new SQL.Database();
  db.run("PRAGMA foreign_keys=ON");
  db.create_function("DATE_FORMAT", (value, format) => {
    assert.equal(format, "%Y-%m-%d %H:%i");
    return value.slice(0, 16);
  });
  db.run(raw.replace(/CREATE DATABASE IF NOT EXISTS workbenchlab_l5 CHARACTER SET utf8mb4;/, "")
    .replace(/^USE workbenchlab_l5;/m, "").replaceAll("ENGINE=InnoDB", ""));
  return db;
}

test("all L5 lessons connect information and exercises to real Workbench evidence", () => {
  assert.equal(lessons.length, 3);
  for (const lesson of lessons) {
    assert.equal(lesson.webWorksheet.definitionTerms.length, 5, lesson.courseCode);
    assert.equal(new Set(lesson.webWorksheet.definitionTerms.map((item) => item.id)).size, 5);
    assert.match(lesson.classroomTask.tool, /Workbench/);
    assert.equal(lesson.classroomTask.download.href, "assets/sql/l5-datenanalyse-testdaten.sql");
    assert.match(lesson.classroomTask.fileName, /\.sql/);
    assert.ok(lesson.completionChecks.some((check) => /SQL|Workbench/.test(check)));
  }
  const text = JSON.stringify(lessons);
  for (const phrase of ["Reverse Engineer", "COUNT(DISTINCT", "NULL", "Ereignisrate", "180 bis 250", "keine allgemeine Garantie", "keine realen"]) assert.ok(text.includes(phrase), phrase);
  assert.doesNotMatch(raw, /\b(?:DROP|DELETE|TRUNCATE|ALTER)\b|FOREIGN_KEY_CHECKS/i);
});

test("fictional fixture keeps portal profiles separate from unlinked rental records", async () => {
  const db = await database();
  try {
    assert.equal(rows(db, "SELECT name FROM sqlite_master WHERE type='table'").length, 6);
    assert.deepEqual(rows(db, "SELECT COUNT(*) FROM profile"), [[6]]);
    assert.deepEqual(rows(db, "SELECT COUNT(*) FROM aktivitaeten"), [[12]]);
    assert.deepEqual(rows(db, "SELECT COUNT(*) FROM standorte"), [[8]]);
    assert.equal(rows(db, "PRAGMA foreign_key_list('mieten')").length, 2);
    assert.equal(rows(db, "PRAGMA table_info('mieten')").some((column) => column[1] === "profilnr"), false);
    assert.throws(() => db.run("INSERT INTO aktivitaeten VALUES (99,99,'2020-01-01','TEST')"), /FOREIGN KEY/);
    assert.throws(() => db.run("INSERT INTO mieten VALUES (99,99,1,'2020-01-01',1)"), /FOREIGN KEY/);
  } finally { db.close(); }
});

test("activity counts retain the profile without events and expose misleading COUNT star", async () => {
  const db = await database();
  try {
    assert.deepEqual(rows(db, `SELECT p.profilnr,COUNT(a.ereignisnr) FROM profile p LEFT JOIN aktivitaeten a ON p.profilnr=a.profilnr GROUP BY p.profilnr ORDER BY p.profilnr`), [[1,4],[2,3],[3,2],[4,2],[5,1],[6,0]]);
    assert.deepEqual(rows(db, "SELECT COUNT(*),COUNT(a.ereignisnr) FROM profile p LEFT JOIN aktivitaeten a ON p.profilnr=a.profilnr WHERE p.profilnr=6"), [[1,0]]);
  } finally { db.close(); }
});

test("joining independent profile observations multiplies rows and excludes unmatched events", async () => {
  const db = await database();
  try {
    assert.deepEqual(rows(db, "SELECT COUNT(*),COUNT(DISTINCT a.ereignisnr),COUNT(DISTINCT s.standortnr) FROM aktivitaeten a JOIN standorte s ON a.profilnr=s.profilnr"), [[22,10,8]]);
    assert.deepEqual(rows(db, "SELECT COUNT(*) FROM aktivitaeten a JOIN standorte s ON a.profilnr=s.profilnr WHERE a.zeitpunkt=s.zeitpunkt"), [[1]]);
    assert.deepEqual(rows(db, "SELECT COUNT(*) FROM aktivitaeten WHERE profilnr=4"), [[2]]);
  } finally { db.close(); }
});

test("calendar-minute event rates are not a server-performance benchmark", async () => {
  const db = await database();
  try {
    assert.deepEqual(rows(db, "SELECT DATE_FORMAT(zeitpunkt,'%Y-%m-%d %H:%i'),COUNT(*) FROM aktivitaeten GROUP BY DATE_FORMAT(zeitpunkt,'%Y-%m-%d %H:%i') ORDER BY DATE_FORMAT(zeitpunkt,'%Y-%m-%d %H:%i')"), [["2020-01-01 08:00",3],["2020-01-01 08:01",3],["2020-01-01 08:02",3],["2020-01-01 08:03",2],["2020-01-01 08:04",1]]);
  } finally { db.close(); }
});

test("NULL, zero and positive duration produce different disclosed populations", async () => {
  const db = await database();
  try {
    const [[total, known, avg]] = rows(db, "SELECT COUNT(*),COUNT(dauer_min),AVG(dauer_min) FROM mieten");
    assert.equal(total, 10);
    assert.equal(known, 9);
    assert.ok(Math.abs(avg - 160 / 9) < 1e-9);
    assert.deepEqual(rows(db, "SELECT COUNT(*),AVG(dauer_min) FROM mieten WHERE dauer_min>0"), [[8,20]]);
    assert.deepEqual(rows(db, "SELECT mietnr FROM mieten WHERE dauer_min IS NULL OR dauer_min<=0 ORDER BY mietnr"), [[3],[10]]);
  } finally { db.close(); }
});

test("station aggregation retains empty groups and discloses suppression", async () => {
  const db = await database();
  try {
    assert.deepEqual(rows(db, "SELECT s.stationnr,COUNT(m.mietnr) FROM stationen s LEFT JOIN mieten m ON s.stationnr=m.startstationnr GROUP BY s.stationnr ORDER BY s.stationnr"), [[1,6],[2,3],[3,1],[4,0]]);
    assert.deepEqual(rows(db, "SELECT s.stationnr,COUNT(m.mietnr) FROM stationen s LEFT JOIN mieten m ON s.stationnr=m.startstationnr GROUP BY s.stationnr HAVING COUNT(m.mietnr)>=3 ORDER BY s.stationnr"), [[1,6],[2,3]]);
  } finally { db.close(); }
});

test("daily rental aggregation joins one weather record per day without inventing causality", async () => {
  const db = await database();
  try {
    assert.deepEqual(rows(db, "SELECT t.datum,t.anzahl,w.temperatur FROM (SELECT DATE(zeitpunkt) AS datum,COUNT(*) AS anzahl FROM mieten GROUP BY DATE(zeitpunkt)) t JOIN wetter w ON t.datum=w.datum ORDER BY t.datum"), [["2020-01-01",4,5],["2020-01-02",3,10],["2020-01-03",3,15]]);
    assert.deepEqual(rows(db, "SELECT w.datum,COUNT(m.mietnr) FROM wetter w JOIN mieten m ON w.datum=DATE(m.zeitpunkt) GROUP BY w.datum ORDER BY w.datum"), [["2020-01-01",4],["2020-01-02",3],["2020-01-03",3]]);
  } finally { db.close(); }
});
