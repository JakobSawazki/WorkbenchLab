const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const net = require("node:net");
const vm = require("node:vm");
const { spawn, spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const base = process.env.WORKBENCH_MARIADB_HOME || "C:/Informatik-Stick/Programme/Xampp_7.4.7/mysql";
const bin = (name) => path.join(base, "bin", `${name}.exe`);
const port = 33379;
const output = fs.mkdtempSync(path.join(require("../tests/artifacts.cjs")("native-sql"), "run-"));
const data = path.join(output, "data");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const connection = ["--no-defaults", "--protocol=TCP", "--host=127.0.0.1", `--port=${port}`, "--user=root"];
function run(name, args, input) {
  const result = spawnSync(bin(name), args, { input, encoding: "utf8", windowsHide: true, timeout: 90000 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.stdout}`);
  return result.stdout.replace(/\r\n/g, "\n").trim();
}
const query = (sql) => run("mysql", [...connection, "--batch", "--skip-column-names", "--default-character-set=utf8mb4"], sql);
async function portAvailable() {
  const server = net.createServer();
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(port, "127.0.0.1", resolve); });
  await new Promise((resolve) => server.close(resolve));
}
(async () => {
  await portAvailable();
  const version = run("mysqld", ["--no-defaults", "--version"]);
  run("mysql_install_db", [`--datadir=${data}`, `--port=${port}`]);
  const server = spawn(bin("mysqld"), ["--no-defaults", `--basedir=${base}`, `--datadir=${data}`, `--port=${port}`, "--bind-address=127.0.0.1", "--console"], { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  let log = "";
  server.stdout.on("data", (chunk) => { log += chunk; });
  server.stderr.on("data", (chunk) => { log += chunk; });
  let exited = false;
  const finished = new Promise((resolve) => server.on("exit", () => { exited = true; resolve(); }));
  try {
    let ready = false;
    for (let attempt = 0; attempt < 80 && !exited; attempt++) {
      const ping = spawnSync(bin("mysqladmin"), [...connection, "ping"], { encoding: "utf8", windowsHide: true, timeout: 1000 });
      if (ping.status === 0) { ready = true; break; }
      await sleep(250);
    }
    assert.ok(ready, `Isolated server did not start: ${log.slice(-2000)}`);
    query(`CREATE DATABASE fahrschule CHARACTER SET utf8mb4;
      CREATE TABLE fahrschule.fahrschueler (schuelernr INT PRIMARY KEY, nachname VARCHAR(45), vorname VARCHAR(45), telefon VARCHAR(30), email VARCHAR(100), strasse VARCHAR(45), hausnr VARCHAR(10), plz VARCHAR(5), ort VARCHAR(50), geburtsdatum DATE, fahrstundenzahl INT) ENGINE=InnoDB;
      CREATE DATABASE fahrschule_l2 CHARACTER SET utf8mb4;
      CREATE TABLE fahrschule_l2.orte (ortnr INT PRIMARY KEY AUTO_INCREMENT, plz VARCHAR(5) NOT NULL, ort VARCHAR(50) NOT NULL) ENGINE=InnoDB;
      CREATE TABLE fahrschule_l2.fahrschueler (schuelernr INT PRIMARY KEY, nachname VARCHAR(45), vorname VARCHAR(45), telefon VARCHAR(30), email VARCHAR(100), strasse VARCHAR(45), hausnr VARCHAR(10), geburtsdatum DATE, fahrstundenzahl INT, ortnr INT NOT NULL, FOREIGN KEY (ortnr) REFERENCES orte(ortnr)) ENGINE=InnoDB;`);
    const files = fs.readdirSync(path.join(root, "assets/sql")).filter((file) => /^l[1-5]-.*\.sql$/.test(file)).sort();
    for (const file of files) {
      query(fs.readFileSync(path.join(root, "assets/sql", file), "utf8"));
      console.log(`PASS native import: ${file}`);
    }
    assert.equal(query("SELECT COUNT(*) FROM fahrschule_l2.fahrschueler f JOIN fahrschule_l2.orte o ON f.ortnr=o.ortnr;"), "5");
    assert.equal(query("SELECT DATEDIFF('2026-10-05','2026-10-01'),TIMESTAMPDIFF(YEAR,'2000-10-04','2026-10-03'),YEAR('2026-10-03')-YEAR('2000-10-04');"), "4\t25\t26");
    assert.equal(query("SELECT YEAR(datum),MONTH(datum),SUM(stundenzahl) FROM workbenchlab_l3_2_fahrschule.fahrstunden GROUP BY YEAR(datum),MONTH(datum) ORDER BY 1,2;"), "2019\t1\t5\n2019\t2\t6\n2019\t3\t1");
    assert.equal(query("SELECT f.fahrradnr,COALESCE(SUM(DATEDIFF(v.bis,v.von)),0) FROM workbenchlab_l3_2_fahrradvermietung.fahrraeder f LEFT JOIN workbenchlab_l3_2_fahrradvermietung.vermietungen v ON f.fahrradnr=v.fahrradnr GROUP BY f.fahrradnr ORDER BY 1;"), "1\t60\n2\t40\n3\t5\n4\t0\n5\t0");
    assert.equal(query("SELECT COUNT(*),COUNT(DISTINCT a.ereignisnr),COUNT(DISTINCT s.standortnr) FROM workbenchlab_l5.aktivitaeten a JOIN workbenchlab_l5.standorte s ON a.profilnr=s.profilnr;"), "22\t10\t8");
    assert.equal(query("SELECT DATE_FORMAT(zeitpunkt,'%Y-%m-%d %H:%i'),COUNT(*) FROM workbenchlab_l5.aktivitaeten GROUP BY DATE_FORMAT(zeitpunkt,'%Y-%m-%d %H:%i') ORDER BY 1;"), "2020-01-01 08:00\t3\n2020-01-01 08:01\t3\n2020-01-01 08:02\t3\n2020-01-01 08:03\t2\n2020-01-01 08:04\t1");
    const invalid = spawnSync(bin("mysql"), [...connection, "--batch"], { input: "UPDATE workbenchlab_l2_3.fahrschueler SET ortnr=999 WHERE schuelernr=1;", encoding: "utf8", windowsHide: true });
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /1452/);
    const context = vm.createContext({ window: {} });
    for (const file of ["content.js", "learning-path.js", "practical-exercises.js"]) vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
    const content = context.window.WORKBENCH_CONTENT;
    for (const id of ["sql-create-course", "sql-students-without-hours", "sql-repeat-rentals"]) {
      const exercise = content.practices.find((item) => item.id === id);
      const database = id.replaceAll("-", "_");
      const seed = content.schemas[exercise.schema].seed.replace("PRAGMA foreign_keys = ON;", "");
      query(`CREATE DATABASE ${database}; USE ${database}; ${seed}`);
      const result = query(`USE ${database}; ${exercise.solution}`);
      if (id === "sql-create-course") {
        assert.equal(query(`SELECT COLUMN_NAME,DATA_TYPE,IS_NULLABLE,COLUMN_KEY FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='${database}' AND TABLE_NAME='kurse' ORDER BY ORDINAL_POSITION;`), "kursnr\tint\tNO\tPRI\ntitel\tvarchar\tNO\t\nstartdatum\tdate\tNO");
        assert.equal(query(`SELECT CHARACTER_MAXIMUM_LENGTH FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='${database}' AND TABLE_NAME='kurse' AND COLUMN_NAME='titel';`), "60");
      } else if (id === "sql-students-without-hours") {
        assert.equal(result.split("\n").length, 11);
        assert.ok(result.endsWith("11\tMuster\t0"));
      } else {
        assert.equal(result, "1\tKaya\t2\n2\tLorenz\t2");
      }
      console.log(`PASS native practice: ${id}`);
    }
    fs.writeFileSync(path.join(output, "result.json"), JSON.stringify({ version, port, files, practiceIds: ["sql-create-course", "sql-students-without-hours", "sql-repeat-rentals"], passed: true, scope: "SQL imports, three new practical exercises and representative native checks; no Workbench GUI verification" }, null, 2));
    console.log(`PASS: ${version}; isolated data directory; ${files.length} imports; native DATE_FORMAT, JOIN and FK enforcement.`);
  } finally {
    if (!exited) {
      spawnSync(bin("mysqladmin"), [...connection, "shutdown"], { windowsHide: true, timeout: 10000 });
      await Promise.race([finished, sleep(10000)]);
      if (!exited) { server.kill(); await finished; }
    }
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
