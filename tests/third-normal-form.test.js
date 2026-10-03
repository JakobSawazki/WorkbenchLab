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
const lesson = content.lessons.find((item) => item.courseCode === "L3.3");
const raw = fs.readFileSync(path.join(root, lesson.classroomTask.download.href), "utf8");
const SQLPromise = initSqlJs({ locateFile: (file) => path.join(root, "vendor/sql.js", file) });
const rows = (db, sql) => db.exec(sql)[0]?.values || [];
async function database() {
  const SQL = await SQLPromise;
  const db = new SQL.Database();
  db.run("PRAGMA foreign_keys=ON");
  db.run(raw.replace(/CREATE DATABASE IF NOT EXISTS workbenchlab_l3_3 CHARACTER SET utf8mb4;/, "")
    .replace(/^USE workbenchlab_l3_3;/m, "").replaceAll("ENGINE=InnoDB", ""));
  return db;
}

test("L3.3 covers all five source cases with explicit assumptions and independent tasks", () => {
  const sheet = lesson.webWorksheet;
  const ids = Array.from(sheet.definitionTerms, (item) => item.id);
  assert.equal(ids.length, 20);
  assert.equal(new Set(ids).size, 20);
  assert.deepEqual(Array.from(sheet.definitionGroups.flatMap((item) => item.ids)), ids);
  assert.equal(sheet.definitionGroups.length, 7);
  assert.equal(sheet.definitionGroups.filter((item) => item.open).length, 1);
  for (const prefix of ["h", "s", "w", "p", "z"]) assert.ok(ids.includes(`${prefix}3`));
  const text = JSON.stringify(lesson);
  for (const phrase of ["Kandidatenschlüssel", "Superschlüssel", "keine Voraussetzung", "historische", "beiden Richtungen", "Forward Engineer SQL CREATE Script", "ungültige Referenz"]) assert.ok(text.includes(phrase), phrase);
  assert.match(text, /keine Musterzerlegung/);
  assert.equal(content.practices.find((item) => item.id === lesson.practiceId).questions.length, 4);
  assert.doesNotMatch(raw, /\b(?:DROP|TRUNCATE|DELETE)\b|FOREIGN_KEY_CHECKS\s*=\s*0/i);
});

test("fixture retains fourteen starting tables and nine enforced foreign keys", async () => {
  const db = await database();
  try {
    const tables = rows(db, "SELECT name FROM sqlite_master WHERE type='table'");
    assert.equal(tables.length, 14);
    assert.equal(tables.reduce((sum, [name]) => sum + rows(db, `PRAGMA foreign_key_list('${name}')`).length, 0), 9);
    assert.throws(() => db.run("INSERT INTO pizza_bestellungen VALUES (99,99,'2020-01-01')"), /FOREIGN KEY/);
    assert.throws(() => db.run("INSERT INTO pizza_auslieferungen VALUES (99,'2020-01-01',1,1,1)"), /UNIQUE/);
    assert.deepEqual(rows(db, "SELECT b.best_nr FROM pizza_bestellungen b LEFT JOIN pizza_auslieferungen a ON b.best_nr=a.best_nr WHERE a.liefer_nr IS NULL"), [[2]]);
  } finally { db.close(); }
});

test("dealer decomposition reconstructs every field and allows an independent new dealer", async () => {
  const db = await database();
  try {
    db.run(`CREATE TABLE h_haendler (haendlernr INT NOT NULL PRIMARY KEY, firma VARCHAR(50), telefon VARCHAR(20));
      CREATE TABLE h_modelle (modellnr INT NOT NULL PRIMARY KEY, modellbezeichnung VARCHAR(30), marke VARCHAR(30));
      CREATE TABLE h_fahrzeuge (kfznr INT NOT NULL PRIMARY KEY, kennzeichen VARCHAR(20), kaufdatum DATE, kaufpreis DECIMAL(10,2),
        haendlernr INT NOT NULL REFERENCES h_haendler(haendlernr), modellnr INT NOT NULL REFERENCES h_modelle(modellnr));
      INSERT INTO h_haendler SELECT DISTINCT haendlernr,firma,telefon FROM haendler_roh;
      INSERT INTO h_modelle SELECT DISTINCT modellnr,modellbezeichnung,marke FROM haendler_roh;
      INSERT INTO h_fahrzeuge SELECT kfznr,kennzeichen,kaufdatum,kaufpreis,haendlernr,modellnr FROM haendler_roh;`);
    const joined = rows(db, `SELECT f.kfznr,f.kennzeichen,h.haendlernr,h.firma,h.telefon,m.modellnr,m.modellbezeichnung,m.marke,f.kaufdatum,f.kaufpreis
      FROM h_fahrzeuge f JOIN h_haendler h ON f.haendlernr=h.haendlernr JOIN h_modelle m ON f.modellnr=m.modellnr ORDER BY f.kfznr`);
    assert.deepEqual(joined, rows(db, "SELECT * FROM haendler_roh ORDER BY kfznr"));
    assert.throws(() => db.run("INSERT INTO h_fahrzeuge VALUES (99,'TEST',NULL,1,99,11)"), /FOREIGN KEY/);
    db.run("INSERT INTO h_haendler VALUES (3,'Neu','TEST')");
    assert.deepEqual(rows(db, "SELECT COUNT(*) FROM h_fahrzeuge WHERE haendlernr=3"), [[0]]);
  } finally { db.close(); }
});

test("food decomposition preserves exactly five pairs and separates categories and prices", async () => {
  const db = await database();
  try {
    db.run(`CREATE TABLE s_kategorien (kuerzel VARCHAR(4) NOT NULL PRIMARY KEY, bezeichnung VARCHAR(30));
      CREATE TABLE s_stoffe (stoffnr VARCHAR(4) NOT NULL PRIMARY KEY, bezeichnung VARCHAR(30), kuerzel VARCHAR(4) NOT NULL REFERENCES s_kategorien(kuerzel));
      CREATE TABLE s_speisen (speisenr INT NOT NULL PRIMARY KEY, bezeichnung VARCHAR(40), preis DECIMAL(8,2));
      CREATE TABLE s_paare (speisenr INT NOT NULL REFERENCES s_speisen(speisenr), stoffnr VARCHAR(4) NOT NULL REFERENCES s_stoffe(stoffnr), PRIMARY KEY(speisenr,stoffnr));
      INSERT INTO s_kategorien SELECT DISTINCT kategorie_kuerzel,kategoriebezeichnung FROM speisen_roh;
      INSERT INTO s_stoffe SELECT DISTINCT stoffnr,stoffbezeichnung,kategorie_kuerzel FROM speisen_roh;
      INSERT INTO s_speisen SELECT DISTINCT speisenr,speisebezeichnung,preis FROM speisen_roh;
      INSERT INTO s_paare SELECT speisenr,stoffnr FROM speisen_roh;`);
    assert.deepEqual(rows(db, `SELECT s.speisenr,s.bezeichnung,s.preis,t.stoffnr,t.bezeichnung,k.kuerzel,k.bezeichnung
      FROM s_paare p JOIN s_speisen s ON p.speisenr=s.speisenr JOIN s_stoffe t ON p.stoffnr=t.stoffnr JOIN s_kategorien k ON t.kuerzel=k.kuerzel
      ORDER BY s.speisenr,t.stoffnr`), rows(db, "SELECT * FROM speisen_roh ORDER BY speisenr,stoffnr"));
    assert.throws(() => db.run("INSERT INTO s_paare VALUES (1,'Z1')"), /UNIQUE/);
    assert.throws(() => db.run("INSERT INTO s_paare VALUES (1,'Z9')"), /FOREIGN KEY/);
    db.run("INSERT INTO s_speisen VALUES (4,'Neue Speise',5)");
    assert.deepEqual(rows(db, "SELECT COUNT(*) FROM s_paare WHERE speisenr=4"), [[0]]);
  } finally { db.close(); }
});

test("deliveries preserve differing article prices and both historical contact numbers", async () => {
  const db = await database();
  try {
    db.run(`CREATE TABLE w_lieferanten (lieferernr INT NOT NULL PRIMARY KEY, firma VARCHAR(40), ort VARCHAR(30));
      CREATE TABLE w_lieferungen (liefnr INT NOT NULL PRIMARY KEY, lieferernr INT NOT NULL REFERENCES w_lieferanten(lieferernr), kontakttelefon VARCHAR(20), lieferdatum DATE);
      CREATE TABLE w_artikel (artnr INT NOT NULL PRIMARY KEY, artikel VARCHAR(40));
      CREATE TABLE w_positionen (liefnr INT NOT NULL REFERENCES w_lieferungen(liefnr), artnr INT NOT NULL REFERENCES w_artikel(artnr), menge INT, stueckpreis DECIMAL(8,2), PRIMARY KEY(liefnr,artnr));
      INSERT INTO w_lieferanten SELECT DISTINCT lieferernr,firma,ort FROM lieferungen_roh;
      INSERT INTO w_lieferungen SELECT DISTINCT liefnr,lieferernr,kontakttelefon,lieferdatum FROM lieferungen_roh;
      INSERT INTO w_artikel SELECT DISTINCT artnr,artikel FROM lieferungen_roh;
      INSERT INTO w_positionen SELECT liefnr,artnr,menge,stueckpreis FROM lieferungen_roh;`);
    assert.deepEqual(rows(db, `SELECT p.liefnr,p.artnr,s.lieferernr,s.firma,s.ort,l.kontakttelefon,l.lieferdatum,a.artikel,p.menge,p.stueckpreis
      FROM w_positionen p JOIN w_lieferungen l ON p.liefnr=l.liefnr JOIN w_lieferanten s ON l.lieferernr=s.lieferernr JOIN w_artikel a ON p.artnr=a.artnr
      ORDER BY p.liefnr,p.artnr`), rows(db, "SELECT * FROM lieferungen_roh ORDER BY liefnr,artnr"));
    assert.deepEqual(rows(db, "SELECT DISTINCT stueckpreis FROM w_positionen WHERE artnr=101 ORDER BY stueckpreis"), [[0.8],[0.85],[0.9]]);
    assert.deepEqual(rows(db, "SELECT kontakttelefon FROM w_lieferungen WHERE lieferernr=2 ORDER BY liefnr"), [["DEMO-TEL-B"],["DEMO-TEL-C"]]);
    assert.throws(() => db.run("INSERT INTO w_positionen VALUES (1,999,1,1)"), /FOREIGN KEY/);
  } finally { db.close(); }
});

test("projects preserve four participations and do not replace supplied department totals with counts", async () => {
  const db = await database();
  try {
    db.run(`CREATE TABLE p_abteilungen (abteilungsnr INT NOT NULL PRIMARY KEY, bezeichnung VARCHAR(30), gesamte_mitarbeiterzahl INT);
      CREATE TABLE p_mitarbeiter (mitarbeiternr INT NOT NULL PRIMARY KEY, vorname VARCHAR(30), nachname VARCHAR(30), email VARCHAR(60), abteilungsnr INT NOT NULL REFERENCES p_abteilungen(abteilungsnr));
      CREATE TABLE p_projekte (projektnr INT NOT NULL PRIMARY KEY, projektname VARCHAR(40), startdatum DATE);
      CREATE TABLE p_beteiligung (mitarbeiternr INT NOT NULL REFERENCES p_mitarbeiter(mitarbeiternr), projektnr INT NOT NULL REFERENCES p_projekte(projektnr), arbeitstage INT, PRIMARY KEY(mitarbeiternr,projektnr));
      INSERT INTO p_abteilungen SELECT DISTINCT abteilungsnr,abteilungsbezeichnung,gesamte_mitarbeiterzahl FROM projekte_roh;
      INSERT INTO p_mitarbeiter SELECT DISTINCT mitarbeiternr,vorname,nachname,email,abteilungsnr FROM projekte_roh;
      INSERT INTO p_projekte SELECT DISTINCT projektnr,projektname,projekt_startdatum FROM projekte_roh;
      INSERT INTO p_beteiligung SELECT mitarbeiternr,projektnr,arbeitstage FROM projekte_roh;`);
    assert.deepEqual(rows(db, `SELECT m.mitarbeiternr,m.vorname,m.nachname,m.email,p.projektnr,p.projektname,p.startdatum,b.arbeitstage,a.abteilungsnr,a.bezeichnung,a.gesamte_mitarbeiterzahl
      FROM p_beteiligung b JOIN p_mitarbeiter m ON b.mitarbeiternr=m.mitarbeiternr JOIN p_projekte p ON b.projektnr=p.projektnr JOIN p_abteilungen a ON m.abteilungsnr=a.abteilungsnr
      ORDER BY m.mitarbeiternr,p.projektnr`), rows(db, "SELECT * FROM projekte_roh ORDER BY mitarbeiternr,projektnr"));
    assert.deepEqual(rows(db, "SELECT arbeitstage FROM p_beteiligung WHERE mitarbeiternr=2 ORDER BY projektnr"), [[23],[78]]);
    assert.deepEqual(rows(db, "SELECT a.abteilungsnr,a.gesamte_mitarbeiterzahl,COUNT(m.mitarbeiternr) FROM p_abteilungen a JOIN p_mitarbeiter m ON a.abteilungsnr=m.abteilungsnr GROUP BY a.abteilungsnr,a.gesamte_mitarbeiterzahl ORDER BY a.abteilungsnr"), [[1,33,2],[2,22,1]]);
    assert.throws(() => db.run("INSERT INTO p_beteiligung VALUES (99,1,3)"), /FOREIGN KEY/);
  } finally { db.close(); }
});

test("pizzeria improvement retains vehicles and distinguishes pair uniqueness from dependencies", async () => {
  const db = await database();
  try {
    db.run(`CREATE TABLE z_haendler (haendlernr INT NOT NULL PRIMARY KEY, firma VARCHAR(45), strasse VARCHAR(45), plz VARCHAR(5), ort VARCHAR(45));
      CREATE TABLE z_fahrzeuge (fahrzeug_nr INT NOT NULL PRIMARY KEY, kennzeichen VARCHAR(45), anschaffungspreis DECIMAL(10,2), haendlernr INT NOT NULL REFERENCES z_haendler(haendlernr));
      INSERT INTO z_haendler SELECT DISTINCT haendlernr,firma,strasse,plz,ort FROM pizza_fahrzeuge;
      INSERT INTO z_fahrzeuge SELECT fahrzeug_nr,kennzeichen,anschaffungspreis,haendlernr FROM pizza_fahrzeuge;`);
    assert.deepEqual(rows(db, `SELECT f.fahrzeug_nr,f.kennzeichen,f.anschaffungspreis,h.haendlernr,h.firma,h.strasse,h.plz,h.ort
      FROM z_fahrzeuge f JOIN z_haendler h ON f.haendlernr=h.haendlernr ORDER BY f.fahrzeug_nr`), rows(db, "SELECT * FROM pizza_fahrzeuge ORDER BY fahrzeug_nr"));
    assert.throws(() => db.run("INSERT INTO z_fahrzeuge VALUES (99,'TEST',1,99)"), /FOREIGN KEY/);
    assert.deepEqual(rows(db, "SELECT plz,COUNT(DISTINCT ortname) FROM pizza_orte GROUP BY plz"), [["00001",2]]);
    db.run("INSERT INTO pizza_zuordnungen VALUES (4,1,1)");
    assert.deepEqual(rows(db, "SELECT COUNT(*) FROM pizza_zuordnungen WHERE p_nr=1 AND z_nr=1"), [[2]]);
    db.run("CREATE TABLE z_paare (p_nr INT NOT NULL REFERENCES pizza_pizzen(p_nr), z_nr INT NOT NULL REFERENCES pizza_zutaten(z_nr), PRIMARY KEY(p_nr,z_nr)); INSERT INTO z_paare SELECT DISTINCT p_nr,z_nr FROM pizza_zuordnungen;");
    assert.throws(() => db.run("INSERT INTO z_paare VALUES (1,1)"), /UNIQUE/);
    assert.deepEqual(rows(db, "SELECT p_nr,z_nr FROM z_paare ORDER BY p_nr,z_nr"), [[1,1],[1,2],[2,1]]);
  } finally { db.close(); }
});
