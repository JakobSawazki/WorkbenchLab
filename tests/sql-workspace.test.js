const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const { Parser } = require("../vendor/node-sql-parser/mysql.umd.js");
const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["sql-check.js", "sql-feedback.js", "sql-workspace.js"]) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
const values = result => JSON.parse(JSON.stringify(result.at(-1)?.values || []));
test("Vendored MySQL parser matches the verified upstream build", () => {
  const bytes = fs.readFileSync(path.join(root, "vendor/node-sql-parser/mysql.umd.js"));
  assert.equal(require("node:crypto").createHash("sha256").update(bytes).digest("hex"), "c54dadfc68e94efc8deb447448a3506d130f4da342d19881466e9c6010314a17");
  assert.match(fs.readFileSync(path.join(root, "vendor/node-sql-parser/LICENSE"), "utf8"), /Apache License/);
});
async function workspace() {
  const SQL = await initSqlJs({ locateFile: file => path.join(root, "vendor/sql.js", file) });
  const db = new SQL.Database();
  context.window.WORKBENCH_SQL_CHECK.registerSqlFunctions(db);
  return context.window.WORKBENCH_SQL_WORKSPACE.create(db, new Parser(), context.window.WORKBENCH_SQL_FEEDBACK);
}

test("SQL workspace separates schemas, qualified names, aliases and literal text", async () => {
  const w = await workspace();
  try {
    w.exec("CREATE DATABASE a; CREATE DATABASE b; USE a; CREATE TABLE t(id INT PRIMARY KEY, label VARCHAR(50)); INSERT INTO t VALUES(1,'USE b; a.t'); USE b; CREATE TABLE t(id INT PRIMARY KEY, label VARCHAR(50)); INSERT INTO t VALUES(2,'b');");
    assert.deepEqual(values(w.exec("SELECT a.t.id, b.t.id FROM a.t CROSS JOIN b.t;")), [[1, 2]]);
    assert.deepEqual(values(w.exec("SELECT x.label, y.label FROM a.t x JOIN b.t y ON x.id+1=y.id;")), [["USE b; a.t", "b"]]);
    assert.deepEqual(values(w.exec("SELECT t.id, DATABASE() FROM t;")), [[2, "b"]]);
    w.exec("UPDATE a.t SET label='neu' WHERE t.id=1; DELETE FROM b.t WHERE t.id=2;");
    assert.deepEqual(values(w.exec("SELECT label FROM a.t;")), [["neu"]]);
    assert.deepEqual(values(w.exec("SELECT * FROM b.t;")), []);
    assert.deepEqual(values(w.exec("SHOW TABLES;")), [["t"]]);
    assert.deepEqual(values(w.exec("SHOW DATABASES;")), [["a"], ["b"]]);
    assert.deepEqual(values(w.exec("DESCRIBE t;" )).map(row => row[0]), ["id", "label"]);
    assert.throws(() => w.exec("DESCRIBE missing;"), /no such table: b\.missing/);
    const empty = w.exec("SELECT id FROM a.t; SELECT id FROM a.t WHERE id=999;").at(-1);
    assert.deepEqual(JSON.parse(JSON.stringify(empty)), { columns: ["id"], values: [] });
    assert.deepEqual(JSON.parse(JSON.stringify(w.catalog())).map(db => [db.name, db.tables[0].name]), [["a", "t"], ["b", "t"]]);
  } finally { w.close(); }
});

test("SQL workspace resolves nested scopes, correlated queries and CTEs", async () => {
  const w = await workspace();
  try {
    w.exec("CREATE DATABASE a; USE a; CREATE TABLE t(id INT); INSERT INTO t VALUES(1),(2); CREATE TABLE u(id INT); INSERT INTO u VALUES(2);");
    assert.deepEqual(values(w.exec("SELECT t.id FROM t WHERE EXISTS(SELECT 1 FROM u WHERE u.id=t.id);")), [[2]]);
    assert.deepEqual(values(w.exec("SELECT t.id FROM t WHERE t.id IN (SELECT t.id FROM u t);")), [[2]]);
    assert.deepEqual(values(w.exec("WITH t AS (SELECT id+1 AS id FROM u) SELECT t.id FROM t;")), [[3]]);
    assert.deepEqual(values(w.exec("SELECT v.id FROM (SELECT id FROM u) v;")), [[2]]);
  } finally { w.close(); }
});

test("SQL workspace supports more than ten schemas and reports partial execution honestly", async () => {
  const w = await workspace();
  try {
    for (let i = 0; i < 15; i++) w.exec(`CREATE DATABASE d${i}; CREATE TABLE d${i}.t(id INT); INSERT INTO d${i}.t VALUES(${i});`);
    assert.equal(w.catalog().length, 15);
    assert.deepEqual(values(w.exec("SELECT t.id FROM d14.t;")), [[14]]);
    assert.throws(() => w.exec("USE absent;"), /gibt es noch nicht/);
    assert.throws(() => w.exec("SELECT * FROM t;"), /Keine Datenbank/);
    assert.throws(() => w.exec("USE d0; INSERT INTO t VALUES(100); INSERT INTO missing VALUES(1); INSERT INTO t VALUES(200);"), error => error.completedStatements === 2);
    assert.deepEqual(values(w.exec("SELECT id FROM t ORDER BY id;")), [[0], [100]]);
    w.exec("DROP DATABASE d0;");
    assert.equal(w.currentDatabase, null);
    assert.equal(w.catalog().length, 14);
    assert.deepEqual(values(w.exec("SELECT id FROM d14.t;")), [[14]]);
    assert.throws(() => w.exec("PRAGMA foreign_keys=OFF;"));
    assert.throws(() => w.exec("ATTACH DATABASE ':memory:' AS evil;"));
  } finally { w.close(); }
});

test("SQL workspace preserves MySQL string escapes and handles table lifecycle", async () => {
  const w = await workspace();
  try {
    assert.deepEqual(values(w.exec("SELECT 'O\\'Brien', 'O''Brien', 'a\\nb', 'C:\\\\tmp';")), [["O'Brien", "O'Brien", "a\nb", "C:\\tmp"]]);
    w.exec("CREATE DATABASE a; CREATE DATABASE b; USE a; CREATE TABLE a.t(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(30)); INSERT INTO a.t(name) VALUES('a'); ALTER TABLE a.t RENAME TO u;");
    assert.deepEqual(values(w.exec("SELECT * FROM a.u;")), [[1, "a"]]);
    w.exec("INSERT INTO a.u(name) VALUES('c'); DELETE FROM a.u WHERE id=2; INSERT INTO a.u(name) VALUES('d');");
    assert.deepEqual(values(w.exec("SELECT id FROM a.u ORDER BY id;")), [[1], [3]]);
    assert.equal(w.catalog().find(db => db.name === "a").tables[0].name, "u");
    assert.throws(() => w.exec("SELECT * FROM a.t;"), /a\.t/);
    w.exec("TRUNCATE TABLE a.u; INSERT INTO a.u(name) VALUES('b');");
    assert.deepEqual(values(w.exec("SELECT * FROM a.u;")), [[1, "b"]]);
    w.exec("DROP TABLE a.u;");
    assert.equal(w.catalog().find(db => db.name === "a").tables.length, 0);
    assert.throws(() => w.exec("CREATE TABLE b.t(id INT AUTO_INCREMENT UNIQUE);"), /Primärschlüssel/);
  } finally { w.close(); }
});

test("All twelve lesson scripts work with their real prerequisite schemas", async () => {
  const w = await workspace();
  try {
    w.exec(`CREATE DATABASE fahrschule;
      CREATE TABLE fahrschule.fahrschueler (schuelernr INT PRIMARY KEY, nachname VARCHAR(45), vorname VARCHAR(45), telefon VARCHAR(30), email VARCHAR(100), strasse VARCHAR(45), hausnr VARCHAR(10), plz VARCHAR(5), ort VARCHAR(50), geburtsdatum DATE, fahrstundenzahl INT);
      CREATE DATABASE fahrschule_l2;
      CREATE TABLE fahrschule_l2.orte (ortnr INT PRIMARY KEY AUTO_INCREMENT, plz VARCHAR(5) NOT NULL, ort VARCHAR(50) NOT NULL);
      CREATE TABLE fahrschule_l2.fahrschueler (schuelernr INT PRIMARY KEY, nachname VARCHAR(45), vorname VARCHAR(45), telefon VARCHAR(30), email VARCHAR(100), strasse VARCHAR(45), hausnr VARCHAR(10), geburtsdatum DATE, fahrstundenzahl INT, ortnr INT NOT NULL, FOREIGN KEY (ortnr) REFERENCES orte(ortnr));`);
    const files = fs.readdirSync(path.join(root, "assets/sql")).filter(file => /^l[1-5]-.*\.sql$/.test(file)).sort();
    assert.equal(files.length, 12);
    for (const file of files) {
      assert.doesNotThrow(() => w.exec(fs.readFileSync(path.join(root, "assets/sql", file), "utf8")), file);
    }
    assert.deepEqual(values(w.exec("SELECT COUNT(*) FROM fahrschule_l2.fahrschueler f JOIN fahrschule_l2.orte o ON f.ortnr=o.ortnr;")), [[5]]);
    assert.deepEqual(values(w.exec("SELECT YEAR(datum),MONTH(datum),SUM(stundenzahl) FROM workbenchlab_l3_2_fahrschule.fahrstunden GROUP BY YEAR(datum),MONTH(datum) ORDER BY 1,2;")), [[2019, 1, 5], [2019, 2, 6], [2019, 3, 1]]);
    assert.deepEqual(values(w.exec("SELECT f.fahrradnr,COALESCE(SUM(DATEDIFF(v.bis,v.von)),0) FROM workbenchlab_l3_2_fahrradvermietung.fahrraeder f LEFT JOIN workbenchlab_l3_2_fahrradvermietung.vermietungen v ON f.fahrradnr=v.fahrradnr GROUP BY f.fahrradnr ORDER BY 1;")), [[1, 60], [2, 40], [3, 5], [4, 0], [5, 0]]);
    assert.deepEqual(values(w.exec("SELECT COUNT(*),COUNT(DISTINCT a.ereignisnr),COUNT(DISTINCT s.standortnr) FROM workbenchlab_l5.aktivitaeten a JOIN workbenchlab_l5.standorte s ON a.profilnr=s.profilnr;")), [[22, 10, 8]]);
    assert.throws(() => w.exec("UPDATE workbenchlab_l2_3.fahrschueler SET ortnr=999 WHERE schuelernr=1;"), /FOREIGN KEY/);
  } finally { w.close(); }
});

test("Destructive schema operations retain foreign keys, even with empty child tables", async () => {
  const w = await workspace();
  try {
    w.exec("CREATE DATABASE a; CREATE DATABASE b; CREATE TABLE a.parent(id INT PRIMARY KEY); INSERT INTO a.parent VALUES(1); CREATE TABLE b.child(id INT, parent INT, FOREIGN KEY(parent) REFERENCES a.parent(id));");
    assert.throws(() => w.exec("TRUNCATE TABLE a.parent;"), /Fremdschlüssel/);
    assert.throws(() => w.exec("DROP DATABASE a;"), /Fremdschlüssel/);
    assert.deepEqual(values(w.exec("SELECT * FROM a.parent;")), [[1]]);
    w.exec("INSERT INTO b.child VALUES(1,1);");
    assert.throws(() => w.exec("INSERT INTO b.child VALUES(2,9);"), /FOREIGN KEY/);
    w.exec("DROP DATABASE b; DROP DATABASE a;");
    assert.equal(w.catalog().length, 0);
  } finally { w.close(); }
});
