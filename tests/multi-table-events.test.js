const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js"]) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
const lesson = context.window.WORKBENCH_CONTENT.lessons.find((item) => item.courseCode === "L3.2");
const raw = fs.readFileSync(path.join(root, lesson.classroomTask.download.href), "utf8");
const marker = "CREATE DATABASE IF NOT EXISTS workbenchlab_l3_2_fahrradvermietung";
const parts = { school: raw.slice(0, raw.indexOf(marker)), rental: raw.slice(raw.indexOf(marker)) };
const SQLPromise = initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
async function database(kind) {
  const SQL = await SQLPromise;
  const db = new SQL.Database();
  db.create_function("DATEDIFF", (end, start) => end == null || start == null ? null : (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000);
  db.create_function("YEAR", (date) => date == null ? null : Number(date.slice(0, 4)));
  db.create_function("MONTH", (date) => date == null ? null : Number(date.slice(5, 7)));
  const portable = parts[kind]
    .replace(/CREATE DATABASE IF NOT EXISTS workbenchlab_l3_2_\w+\s+CHARACTER SET utf8mb4;/g, "")
    .replace(/^USE workbenchlab_l3_2_\w+;/gm, "")
    .replaceAll("ENGINE=InnoDB", "");
  db.run("PRAGMA foreign_keys=ON;");
  db.run(portable);
  return db;
}
const rows = (db, sql) => db.exec(sql)[0]?.values || [];
test("L3.2 maps all 26 source tasks and both real Workbench workflows", () => {
  const sheet = lesson.webWorksheet;
  assert.equal(sheet.definitionTerms.length, 26);
  const expected = [...Array.from({ length: 10 }, (_, i) => `f${i + 1}`), ...Array.from({ length: 16 }, (_, i) => `r${i + 1}`)];
  assert.deepEqual(Array.from(sheet.definitionTerms, (term) => term.id), expected);
  assert.deepEqual(Array.from(sheet.definitionGroups.flatMap((group) => group.ids)), expected);
  assert.match(lesson.title, /Vorgänge.*auswerten/);
  const text = JSON.stringify(lesson);
  for (const phrase of ["Reverse Engineer", "DATEDIFF", "COUNT(*)", "SUM(stundenzahl)", "2019", "133", "genau 40", "Genau fünf"]) assert.ok(text.includes(phrase), phrase);
  assert.match(text, /Modellpreise.*vereinbarte Preis.*Vertrag/);
  assert.match(text, /zehn|F1–F10/);
  assert.equal(lesson.completionChecks.length, 3);
  assert.doesNotMatch(raw, /\bDROP\b|\bTRUNCATE\b|FOREIGN_KEY_CHECKS\s*=\s*0|SQL_SAFE_UPDATES\s*=\s*0/i);
  assert.equal((raw.match(/CREATE TABLE /g) || []).length, 12);
});

const schoolQueries = [
  ["f1", "SELECT DISTINCT s.datum FROM fahrstunden s JOIN fahrlehrer l ON s.fahrlehrernr=l.fahrlehrernr WHERE l.nachname='Probe' ORDER BY s.datum", [["2019-01-05"],["2019-01-06"],["2019-02-01"],["2019-03-01"]]],
  ["f2", "SELECT DISTINCT s.datum,k.kennzeichen FROM fahrstunden s JOIN fahrlehrer l ON s.fahrlehrernr=l.fahrlehrernr JOIN kfz k ON s.kfznr=k.kfznr WHERE l.nachname='Probe' ORDER BY s.datum,k.kennzeichen", [["2019-01-05","DEMO-001"],["2019-01-05","DEMO-002"],["2019-01-06","DEMO-001"],["2019-02-01","DEMO-002"],["2019-03-01","DEMO-002"]]],
  ["f3", "SELECT s.datum,s.stundenzahl,l.nachname FROM fahrstunden s JOIN fahrlehrer l ON s.fahrlehrernr=l.fahrlehrernr JOIN fahrschueler f ON s.schuelernr=f.schuelernr WHERE f.vorname='Andreas' AND f.nachname='Probe' ORDER BY s.datum,s.fahrstundennr", [["2019-01-05",2,"Probe"],["2019-01-06",1,"Demo"],["2019-02-02",2,"Demo"]]],
  ["f4", "SELECT k.kfznr,COALESCE(SUM(s.stundenzahl),0) FROM kfz k LEFT JOIN fahrstunden s ON k.kfznr=s.kfznr GROUP BY k.kfznr,k.kennzeichen ORDER BY k.kfznr", [[1,6],[2,6],[3,0]]],
  ["f5", "SELECT f.schuelernr,SUM(s.stundenzahl) FROM fahrschueler f JOIN fahrstunden s ON f.schuelernr=s.schuelernr GROUP BY f.schuelernr,f.vorname,f.nachname HAVING SUM(s.stundenzahl)>2 ORDER BY f.schuelernr", [[1,5],[3,4]]],
  ["f6", "SELECT SUM(s.stundenzahl)*35 FROM fahrstunden s JOIN fahrschueler f ON s.schuelernr=f.schuelernr WHERE f.vorname='Hakan' AND f.nachname='Fiktiv'", [[140]]],
  ["f7", "SELECT YEAR(datum),MONTH(datum),SUM(stundenzahl) FROM fahrstunden GROUP BY YEAR(datum),MONTH(datum) ORDER BY YEAR(datum),MONTH(datum)", [[2019,1,5],[2019,2,6],[2019,3,1]]],
  ["f8", "SELECT 2019-YEAR(geburtsdatum) AS alter2019,COUNT(*) FROM fahrschueler GROUP BY 2019-YEAR(geburtsdatum) ORDER BY alter2019", [[18,2],[19,1],[20,1]]],
  ["f9", "SELECT 2019-YEAR(geburtsdatum) AS alter2019,COUNT(*) FROM fahrschueler WHERE 2019-YEAR(geburtsdatum)>18 GROUP BY 2019-YEAR(geburtsdatum) ORDER BY alter2019", [[19,1],[20,1]]],
  ["f10", "SELECT AVG(gehalt) FROM fahrlehrer", [[2700]]]
];
const rentalJoin = "FROM vermietungen v JOIN fahrraeder f ON v.fahrradnr=f.fahrradnr JOIN modelle m ON f.modellnr=m.modellnr";
const rentalQueries = [
  ["r1", "SELECT v.vermietnr,f.fahrradnr,f.rahmennr FROM vermietungen v JOIN fahrraeder f ON v.fahrradnr=f.fahrradnr WHERE v.vermietnr=1", [[1,1,"DEMO-R001"]]],
  ["r2", `SELECT v.vermietnr,f.fahrradnr,m.bezeichnung ${rentalJoin} WHERE v.vermietnr=1`, [[1,1,"Demo Basis"]]],
  ["r3", `SELECT v.vermietnr,m.bezeichnung,k.kundennr,k.vorname,k.nachname,o.ort ${rentalJoin} JOIN kunden k ON v.kundennr=k.kundennr JOIN orte o ON k.ortnr=o.ortnr WHERE v.vermietnr=1`, [[1,"Demo Basis",1,"Mia","Probe","Freiburg"]]],
  ["r4", "SELECT fahrradnr,DATEDIFF(bis,von) FROM vermietungen WHERE vermietnr=100", [[3,1]]],
  ["r5", `SELECT DATEDIFF(v.bis,v.von),m.tagesmietpreis,DATEDIFF(v.bis,v.von)*m.tagesmietpreis ${rentalJoin} WHERE v.vermietnr=133`, [[5,10,50]]],
  ["r6", `SELECT COUNT(*),COUNT(DISTINCT v.vermietnr),SUM(DATEDIFF(v.bis,v.von)*m.tagesmietpreis) ${rentalJoin}`, [[17,17,1100]]],
  ["r7", "SELECT vermietnr,DATEDIFF(bis,von) AS miettage FROM vermietungen ORDER BY miettage DESC,vermietnr", [[1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[13,10],[14,10],[11,5],[12,5],[15,5],[133,5],[7,1],[8,1],[9,1],[10,1],[100,1]]],
  ["r8", "SELECT AVG(DATEDIFF(bis,von)),COUNT(*),SUM(DATEDIFF(bis,von)) FROM vermietungen", [[105/17,17,105]]],
  ["r9", "SELECT SUM(DATEDIFF(bis,von)) FROM vermietungen", [[105]]],
  ["r10", "SELECT f.fahrradnr,SUM(DATEDIFF(v.bis,v.von)) FROM fahrraeder f JOIN vermietungen v ON f.fahrradnr=v.fahrradnr GROUP BY f.fahrradnr,f.rahmennr HAVING SUM(DATEDIFF(v.bis,v.von))>40 ORDER BY f.fahrradnr", [[1,60]]],
  ["r11", "SELECT k.kundennr,SUM(DATEDIFF(v.bis,v.von)) AS tage FROM kunden k JOIN vermietungen v ON k.kundennr=v.kundennr GROUP BY k.kundennr,k.vorname,k.nachname HAVING SUM(DATEDIFF(v.bis,v.von))>30 ORDER BY tage DESC,k.kundennr", [[1,60],[3,40]]],
  ["r12", "SELECT k.kundennr,COUNT(v.vermietnr) AS anzahl FROM kunden k JOIN vermietungen v ON k.kundennr=v.kundennr GROUP BY k.kundennr,k.vorname,k.nachname HAVING COUNT(v.vermietnr)>5 ORDER BY anzahl DESC,k.kundennr", [[1,6],[3,6]]],
  ["r13", "SELECT k.kundennr,COUNT(v.vermietnr) FROM kunden k JOIN orte o ON k.ortnr=o.ortnr JOIN vermietungen v ON k.kundennr=v.kundennr WHERE o.ort='Freiburg' GROUP BY k.kundennr,k.vorname,k.nachname HAVING COUNT(v.vermietnr)>5 ORDER BY k.kundennr", [[1,6]]],
  ["r14", "SELECT f.fahrradnr,COUNT(v.vermietnr) FROM fahrraeder f LEFT JOIN vermietungen v ON f.fahrradnr=v.fahrradnr GROUP BY f.fahrradnr ORDER BY f.fahrradnr", [[1,6],[2,6],[3,5],[4,0],[5,0]]],
  ["r15", "SELECT a.artnr,AVG(m.tagesmietpreis) FROM fahrradarten a JOIN modelle m ON a.artnr=m.artnr JOIN fahrraeder f ON m.modellnr=f.modellnr GROUP BY a.artnr,a.bezeichnung ORDER BY a.artnr", [[1,15],[2,30]]],
  ["r16", "SELECT a.artnr,AVG(f.anschaffungswert) FROM fahrradarten a JOIN modelle m ON a.artnr=m.artnr JOIN fahrraeder f ON m.modellnr=f.modellnr GROUP BY a.artnr,a.bezeichnung ORDER BY a.artnr", [[1,800],[2,2000]]]
];
for (const [kind, queries] of [["school", schoolQueries], ["rental", rentalQueries]]) {
  for (const [id, query, expected] of queries) test(`L3.2 ${id}: reference query and exact boundary result`, async () => {
    const db = await database(kind);
    try { assert.deepEqual(rows(db, query), expected); }
    finally { db.close(); }
  });
}
test("both fixture schemas enforce all 11 foreign keys and preserve empty groups", async () => {
  for (const [kind, tables, keys] of [["school", 5, 5], ["rental", 7, 6]]) {
    const db = await database(kind);
    try {
      const names = rows(db, "SELECT name FROM sqlite_master WHERE type='table'").flat();
      assert.equal(names.length, tables);
      assert.equal(names.reduce((count, name) => count + rows(db, `PRAGMA foreign_key_list(${name})`).length, 0), keys);
      assert.deepEqual(rows(db, "PRAGMA foreign_key_check"), []);
      const invalid = kind === "school" ? "INSERT INTO fahrstunden VALUES(999,'2019-01-01',1,999,1,1)" : "INSERT INTO vermietungen VALUES(999,'2019-01-01','2019-01-02',1,999)";
      assert.throws(() => db.run(invalid), /FOREIGN KEY/);
      assert.deepEqual(rows(db, "PRAGMA foreign_keys"), [[1]]);
    } finally { db.close(); }
  }
});
