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
const lesson = content.lessons.find((item) => item.courseCode === "L4.1");
const raw = fs.readFileSync(path.join(root, lesson.classroomTask.download.href), "utf8");
const SQLPromise = initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
const rows = (db, sql) => db.exec(sql)[0]?.values || [];
async function database() {
  const SQL = await SQLPromise;
  const db = new SQL.Database();
  db.run("PRAGMA foreign_keys=ON");
  db.run(raw.replace(/CREATE DATABASE IF NOT EXISTS workbenchlab_l4 CHARACTER SET utf8mb4;/, "")
    .replace(/^USE workbenchlab_l4;/m, "").replaceAll("ENGINE=InnoDB", ""));
  return db;
}

// The fixture deliberately uses aligned lists; never combine them as a product.
function alignedLists(values) {
  const lists = values.map((value) => value.split("|"));
  assert.ok(lists.every((list) => list.length === lists[0].length));
  return lists[0].map((_, i) => lists.map((list) => list[i]));
}
function filmRows(db) {
  return rows(db, "SELECT * FROM filmstudio_unf ORDER BY schauspielernr").flatMap(([id, name, ...lists]) => {
    const [first, last] = name.split(" ");
    return alignedLists(lists).map(([role, film, title, category, categoryName]) => [id, first, last, role, Number(film), title, Number(category), categoryName]);
  }).sort((a, b) => a[0] - b[0] || a[4] - b[4]);
}
function danceRows(db) {
  return rows(db, "SELECT * FROM tanzschule_unf ORDER BY kursnr").flatMap(([course, teacher, name, description, ...lists]) => {
    const [first, last] = name.split(" ");
    const [style, price, start, end] = description.split(";");
    return alignedLists(lists).map(([student, studentFirst, studentLast, phone]) => [course, teacher, first, last, style, Number(price), start, end, Number(student), studentFirst, studentLast, phone]);
  }).sort((a, b) => a[0] - b[0] || a[8] - b[8]);
}
function firstNormalForms(db) {
  db.run(`CREATE TABLE film_1nf (
    schauspielernr INT NOT NULL, vorname VARCHAR(30), nachname VARCHAR(30), rolle VARCHAR(40), filmnr INT NOT NULL,
    filmtitel VARCHAR(40), kategorienr INT, kategoriename VARCHAR(30), PRIMARY KEY(schauspielernr,filmnr));
    CREATE TABLE tanz_1nf (
    kursnr INT NOT NULL, lehrernr INT, lehrer_vorname VARCHAR(30), lehrer_nachname VARCHAR(30), tanzstil VARCHAR(30),
    preis DECIMAL(8,2), beginn DATE, ende DATE, schuelernr INT NOT NULL, vorname VARCHAR(30), nachname VARCHAR(30), telefon VARCHAR(20), PRIMARY KEY(kursnr,schuelernr));`);
  for (const row of filmRows(db)) db.run("INSERT INTO film_1nf VALUES (?,?,?,?,?,?,?,?)", row);
  for (const row of danceRows(db)) db.run("INSERT INTO tanz_1nf VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", row);
}

test("L4.1 provides all source stages, transfer tasks, models and SQL evidence", () => {
  const ids = Array.from(lesson.webWorksheet.definitionTerms, (item) => item.id);
  assert.equal(ids.length, 13);
  assert.equal(new Set(ids).size, 13);
  assert.deepEqual(Array.from(lesson.webWorksheet.definitionGroups.flatMap((group) => group.ids)), ids);
  assert.equal(lesson.sourceMaterials.length, 6);
  assert.match(lesson.classroomTask.tool, /Workbench.*EER und SQL/);
  assert.match(lesson.classroomTask.evidence, /Sechs Stufenmodelle/);
  assert.match(JSON.stringify(lesson), /fünf Besetzungen.*28 Anmeldungen/);
  assert.match(JSON.stringify(lesson), /weitere Normalformen/);
  assert.doesNotMatch(raw, /\b(?:DROP|DELETE|TRUNCATE|ALTER)\b|FOREIGN_KEY_CHECKS\s*=\s*0/i);
  assert.equal((raw.match(/CREATE TABLE /g) || []).length, 2);
  const exercise = content.practices.find((item) => item.id === lesson.practiceId);
  assert.match(exercise.prompt, /Filmstudio/);
  assert.doesNotMatch(JSON.stringify(exercise), /PLZ/);
});

test("1NF preserves five precise role assignments and 28 course registrations", async () => {
  const db = await database();
  try {
    firstNormalForms(db);
    assert.deepEqual(rows(db, "SELECT * FROM film_1nf ORDER BY schauspielernr,filmnr"), [
      [100,"Emma","Probe","Demo-Rolle A",10,"Demo-Film A",2,"Action"],
      [200,"Uwe","Demo","Demo-Rolle C",10,"Demo-Film A",2,"Action"],
      [200,"Uwe","Demo","Demo-Rolle B",20,"Demo-Film B",1,"Fantasy"],
      [300,"Bastian","Fiktiv","Demo-Rolle D",30,"Demo-Film C",3,"Komoedie"],
      [300,"Bastian","Fiktiv","Demo-Rolle E",40,"Demo-Film D",2,"Action"]
    ]);
    const pairs = [[101,1],[101,2],[101,3],[101,4],[102,2],[102,5],[102,6],[102,7],[102,8],[102,9],[103,3],[103,5],[103,7],[103,10],[104,1],[104,3],[104,8],[104,11],[105,9],[105,12],[105,13],[105,14],[106,1],[106,8],[107,2],[107,13],[107,15],[107,16]];
    assert.deepEqual(rows(db, "SELECT kursnr,schuelernr FROM tanz_1nf ORDER BY kursnr,schuelernr"), pairs);
    assert.deepEqual(rows(db, "SELECT COUNT(*),COUNT(DISTINCT kursnr),COUNT(DISTINCT schuelernr) FROM tanz_1nf"), [[28,7,16]]);
    assert.deepEqual(rows(db, "SELECT DISTINCT preis FROM tanz_1nf WHERE tanzstil='Foxtrott' ORDER BY preis"), [[95],[105]]);
    assert.throws(() => alignedLists(["1|2", "A"]));
  } finally { db.close(); }
});

test("film 2NF and 3NF each reconstruct every original field with preserved roles", async () => {
  const db = await database();
  try {
    firstNormalForms(db);
    const expected = rows(db, "SELECT * FROM film_1nf ORDER BY schauspielernr,filmnr");
    db.run(`CREATE TABLE f2_personen (schauspielernr INT NOT NULL PRIMARY KEY, vorname VARCHAR(30), nachname VARCHAR(30));
      CREATE TABLE f2_filme (filmnr INT NOT NULL PRIMARY KEY, filmtitel VARCHAR(40), kategorienr INT, kategoriename VARCHAR(30));
      CREATE TABLE f2_besetzungen (schauspielernr INT NOT NULL REFERENCES f2_personen(schauspielernr), filmnr INT NOT NULL REFERENCES f2_filme(filmnr), rolle VARCHAR(40), PRIMARY KEY(schauspielernr,filmnr));
      INSERT INTO f2_personen SELECT DISTINCT schauspielernr,vorname,nachname FROM film_1nf;
      INSERT INTO f2_filme SELECT DISTINCT filmnr,filmtitel,kategorienr,kategoriename FROM film_1nf;
      INSERT INTO f2_besetzungen SELECT schauspielernr,filmnr,rolle FROM film_1nf;`);
    assert.deepEqual(rows(db, `SELECT p.schauspielernr,p.vorname,p.nachname,b.rolle,f.filmnr,f.filmtitel,f.kategorienr,f.kategoriename
      FROM f2_besetzungen b JOIN f2_personen p ON b.schauspielernr=p.schauspielernr JOIN f2_filme f ON b.filmnr=f.filmnr ORDER BY p.schauspielernr,f.filmnr`), expected);
    db.run(`CREATE TABLE f3_personen (schauspielernr INT NOT NULL PRIMARY KEY, vorname VARCHAR(30), nachname VARCHAR(30));
      CREATE TABLE f3_kategorien (kategorienr INT NOT NULL PRIMARY KEY, kategoriename VARCHAR(30));
      CREATE TABLE f3_filme (filmnr INT NOT NULL PRIMARY KEY, filmtitel VARCHAR(40), kategorienr INT NOT NULL REFERENCES f3_kategorien(kategorienr));
      CREATE TABLE f3_besetzungen (schauspielernr INT NOT NULL REFERENCES f3_personen(schauspielernr), filmnr INT NOT NULL REFERENCES f3_filme(filmnr), rolle VARCHAR(40), PRIMARY KEY(schauspielernr,filmnr));
      INSERT INTO f3_personen SELECT * FROM f2_personen;
      INSERT INTO f3_kategorien SELECT DISTINCT kategorienr,kategoriename FROM f2_filme;
      INSERT INTO f3_filme SELECT filmnr,filmtitel,kategorienr FROM f2_filme;
      INSERT INTO f3_besetzungen SELECT * FROM f2_besetzungen;`);
    assert.deepEqual(rows(db, `SELECT p.schauspielernr,p.vorname,p.nachname,b.rolle,f.filmnr,f.filmtitel,k.kategorienr,k.kategoriename
      FROM f3_besetzungen b JOIN f3_personen p ON b.schauspielernr=p.schauspielernr JOIN f3_filme f ON b.filmnr=f.filmnr JOIN f3_kategorien k ON f.kategorienr=k.kategorienr
      ORDER BY p.schauspielernr,f.filmnr`), expected);
    assert.throws(() => db.run("INSERT INTO f3_besetzungen VALUES (200,10,'Zweite Rolle')"), /UNIQUE/);
    assert.throws(() => db.run("INSERT INTO f3_besetzungen VALUES (999,10,'Neu')"), /FOREIGN KEY/);
    assert.throws(() => db.run("INSERT INTO f3_filme VALUES (99,'Neu',99)"), /FOREIGN KEY/);
  } finally { db.close(); }
});

test("dance 2NF and 3NF preserve all attributes, offering prices and repeated participants", async () => {
  const db = await database();
  try {
    firstNormalForms(db);
    const expected = rows(db, "SELECT * FROM tanz_1nf ORDER BY kursnr,schuelernr");
    db.run(`CREATE TABLE t2_schueler (schuelernr INT NOT NULL PRIMARY KEY, vorname VARCHAR(30), nachname VARCHAR(30), telefon VARCHAR(20));
      CREATE TABLE t2_kurse (kursnr INT NOT NULL PRIMARY KEY, lehrernr INT, lehrer_vorname VARCHAR(30), lehrer_nachname VARCHAR(30), tanzstil VARCHAR(30), preis DECIMAL(8,2), beginn DATE, ende DATE);
      CREATE TABLE t2_anmeldungen (kursnr INT NOT NULL REFERENCES t2_kurse(kursnr), schuelernr INT NOT NULL REFERENCES t2_schueler(schuelernr), PRIMARY KEY(kursnr,schuelernr));
      INSERT INTO t2_schueler SELECT DISTINCT schuelernr,vorname,nachname,telefon FROM tanz_1nf;
      INSERT INTO t2_kurse SELECT DISTINCT kursnr,lehrernr,lehrer_vorname,lehrer_nachname,tanzstil,preis,beginn,ende FROM tanz_1nf;
      INSERT INTO t2_anmeldungen SELECT kursnr,schuelernr FROM tanz_1nf;`);
    assert.deepEqual(rows(db, `SELECT k.kursnr,k.lehrernr,k.lehrer_vorname,k.lehrer_nachname,k.tanzstil,k.preis,k.beginn,k.ende,s.schuelernr,s.vorname,s.nachname,s.telefon
      FROM t2_anmeldungen a JOIN t2_kurse k ON a.kursnr=k.kursnr JOIN t2_schueler s ON a.schuelernr=s.schuelernr ORDER BY k.kursnr,s.schuelernr`), expected);
    db.run(`CREATE TABLE t3_lehrer (lehrernr INT NOT NULL PRIMARY KEY, vorname VARCHAR(30), nachname VARCHAR(30));
      CREATE TABLE t3_schueler (schuelernr INT NOT NULL PRIMARY KEY, vorname VARCHAR(30), nachname VARCHAR(30), telefon VARCHAR(20));
      CREATE TABLE t3_kurse (kursnr INT NOT NULL PRIMARY KEY, lehrernr INT NOT NULL REFERENCES t3_lehrer(lehrernr), tanzstil VARCHAR(30), preis DECIMAL(8,2), beginn DATE, ende DATE);
      CREATE TABLE t3_anmeldungen (kursnr INT NOT NULL REFERENCES t3_kurse(kursnr), schuelernr INT NOT NULL REFERENCES t3_schueler(schuelernr), PRIMARY KEY(kursnr,schuelernr));
      INSERT INTO t3_lehrer SELECT DISTINCT lehrernr,lehrer_vorname,lehrer_nachname FROM t2_kurse;
      INSERT INTO t3_schueler SELECT * FROM t2_schueler;
      INSERT INTO t3_kurse SELECT kursnr,lehrernr,tanzstil,preis,beginn,ende FROM t2_kurse;
      INSERT INTO t3_anmeldungen SELECT * FROM t2_anmeldungen;`);
    const reconstruct = `SELECT k.kursnr,l.lehrernr,l.vorname,l.nachname,k.tanzstil,k.preis,k.beginn,k.ende,s.schuelernr,s.vorname,s.nachname,s.telefon
      FROM t3_anmeldungen a JOIN t3_kurse k ON a.kursnr=k.kursnr JOIN t3_lehrer l ON k.lehrernr=l.lehrernr JOIN t3_schueler s ON a.schuelernr=s.schuelernr ORDER BY k.kursnr,s.schuelernr`;
    assert.deepEqual(rows(db, reconstruct), expected);
    assert.deepEqual(rows(db, "SELECT kursnr FROM t3_anmeldungen WHERE schuelernr=1 ORDER BY kursnr"), [[101],[104],[106]]);
    assert.throws(() => db.run("INSERT INTO t3_anmeldungen VALUES (101,1)"), /UNIQUE/);
    assert.throws(() => db.run("INSERT INTO t3_anmeldungen VALUES (101,999)"), /FOREIGN KEY/);
    db.run("INSERT INTO t3_kurse VALUES (108,10,'Swing',120,'2019-01-01','2019-03-01')");
    assert.deepEqual(rows(db, "SELECT k.kursnr,COUNT(a.schuelernr) FROM t3_kurse k LEFT JOIN t3_anmeldungen a ON k.kursnr=a.kursnr WHERE k.kursnr=108 GROUP BY k.kursnr"), [[108,0]]);
    assert.deepEqual(rows(db, reconstruct), expected);
  } finally { db.close(); }
});
