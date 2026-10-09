// Claude, 0.41.0: MySQL-Nähe des Browser-Labors – nachgebildete Funktionen, Umschreibungen und Hinweise.
// Die Werte sind an der MariaDB 10.4.13 des Informatik-Sticks gemessen (tools/verify-claude-native.cjs).
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const artifacts = require("node:path").join(require("node:os").tmpdir(), "workbenchlab-tests");
require("node:fs").mkdirSync(artifacts, { recursive: true });
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addInitScript(() => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + "#sql/frei");
      await page.locator("#runtimeChip.is-ready").waitFor();
      await page.locator("#playgroundRunButton").waitFor();
      const editor = page.locator("#sqlEditor");
      const output = page.locator("#sqlOutput");
      const run = async (sql) => {
        await editor.fill(sql);
        await page.evaluate(() => { document.querySelector("#sqlOutput").dataset.stale = "1"; document.querySelector("#sqlOutput").innerHTML = ""; });
        await page.locator("#playgroundRunButton").click();
        await page.waitForFunction(() => document.querySelector("#sqlOutput").innerHTML.trim() !== "");
        return output;
      };
      const cells = async () => (await output.locator("tbody tr").first().locator("td").allInnerTexts()).map((text) => text.trim());

      // Funktionen, die es im Browser bisher nicht gab oder die anders rechneten.
      await run("SELECT UPPER('Müller'), LOWER('MÜLLER'), FORMAT(24800, 2), DAY('2026-10-09'), MOD(7, 2), LEFT('Stuttgart', 3), CHAR_LENGTH('Müller'), CONCAT('a', NULL);");
      assert.deepEqual(await cells(), ["MÜLLER", "müller", "24,800.00", "9", "1", "Stu", "6", "NULL"]);
      await run("SELECT CONCAT(UPPER(nachname), ', ', LEFT(vorname, 1), '.') AS name, DATE_FORMAT(geburtsdatum, '%d.%m.%Y') AS geboren, TIMESTAMPDIFF(YEAR, geburtsdatum, '2026-10-09') AS jahre FROM fahrschueler ORDER BY schuelernr LIMIT 1;");
      const first = await cells();
      assert.match(first[0], /^[A-ZÄÖÜ-]+, [A-ZÄÖÜ]\.$/);
      assert.match(first[1], /^\d{2}\.\d{2}\.\d{4}$/);
      assert.ok(Number(first[2]) >= 14 && Number(first[2]) <= 30, first[2]);
      assert.equal(await output.locator(".mysql-note").count(), 0);

      // NOW() und CURDATE() zeigen die Ortszeit des Geräts.
      await run("SELECT NOW(), CURDATE();");
      const [now, today] = await cells();
      const local = await page.evaluate(() => { const d = new Date(); return { ms: d.getTime(), offset: d.getTimezoneOffset() }; });
      const shown = Date.parse(now.replace(" ", "T") + "Z") + local.offset * 60000;
      assert.ok(Math.abs(shown - local.ms) < 120000, `NOW() = ${now}`);
      assert.equal(today, now.slice(0, 10));
      await run("SELECT VERSION();");
      assert.match((await cells())[0], /Browser-Labor, nicht MySQL/);

      // CREATE TABLE in MySQL-Schreibweise läuft; ein Hinweis erklärt die Anpassung.
      await run("CREATE TABLE kurse (kursnr INT NOT NULL AUTO_INCREMENT, titel VARCHAR(50) NOT NULL, PRIMARY KEY (kursnr)) ENGINE=InnoDB;");
      assert.match(await output.innerText(), /Befehl ausgeführt/);
      assert.match(await output.locator(".mysql-note").innerText(), /AUTO_INCREMENT/);
      await run("INSERT INTO kurse (titel) VALUES ('Theorie'), ('Praxis');");
      assert.match(await output.innerText(), /2 Datensätze betroffen/);
      assert.equal(await output.locator(".mysql-note").count(), 0);
      await run("SELECT kursnr, titel FROM kurse ORDER BY kursnr;");
      assert.deepEqual((await output.locator("tbody td").allInnerTexts()).map((text) => text.trim()), ["1", "Theorie", "2", "Praxis"]);

      // Gültiges MySQL, das der Browser nicht kann: deutsche Erklärung, Originalmeldung bleibt sichtbar.
      await run("SELECT 5 DIV 2;");
      assert.match(await output.locator(".sql-error").innerText(), /DIV \(ganzzahlige Division\) gibt es nur in MySQL/);
      assert.match(await output.locator(".sql-error").innerText(), /syntax error/);
      await run("SELECT MONTHNAME('2026-10-09');");
      assert.match(await output.locator(".sql-error").innerText(), /MONTHNAME gibt es in MySQL; das Browser-Labor bildet sie nicht nach/);
      await run("SELECT DATE_ADD('2026-10-09', INTERVAL 7 DAY);");
      assert.match(await output.locator(".sql-error").innerText(), /Datumsrechnung mit INTERVAL/);
      await run("SELECT COUT(*) FROM fahrschueler;");
      assert.match(await output.locator(".sql-error").innerText(), /Meintest du COUNT\?/);

      // Neue Hinweise auf gemessene Unterschiede.
      await run("SELECT nachname AS name FROM fahrschueler WHERE name = 'Gibtesnicht';");
      assert.match(await output.innerText(), /Spaltenname aus AS in WHERE/);
      await run("SELECT AVG(fahrstunden) FROM fahrschueler;");
      assert.match(await output.locator(".mysql-note").innerText(), /Nachkommastellen bei AVG/);
      await run("SELECT ROUND(AVG(fahrstunden), 2) FROM fahrschueler;");
      assert.equal(await output.locator(".mysql-note").count(), 0);
      assert.equal(await page.locator(".mysql-differences dt").count(), 5);
      assert.match(await page.locator(".mysql-differences").evaluate((element) => element.textContent), /TIMESTAMPDIFF/);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf im Labor bei ${width}px`);
      await page.screenshot({ path: `${artifacts}/mysql-lab-${width}.png`, animations: "disabled" });

      // In einer Übungsaufgabe: Funktionen laufen; TIMESTAMPDIFF wird erklärt statt nur abgelehnt.
      await page.goto(base + "#practice/sql-projection");
      await page.locator("#runSqlButton").waitFor();
      await editor.fill("SELECT DAY(geburtsdatum), UPPER(nachname) FROM fahrschueler ORDER BY schuelernr;");
      await page.locator("#runSqlButton").click();
      await output.locator("table").waitFor();
      assert.match((await output.locator("tbody tr").first().locator("td").allInnerTexts())[0].trim(), /^\d{1,2}$/);
      await editor.fill("SELECT TIMESTAMPDIFF(YEAR, geburtsdatum, NOW()) FROM fahrschueler;");
      await page.locator("#runSqlButton").click();
      await output.locator(".sql-error").waitFor();
      assert.match(await output.locator(".sql-error").innerText(), /TIMESTAMPDIFF ist gültiges MySQL\. In den Übungsaufgaben kennt es das Browser-Labor nicht/);
      // Gleichwertige Schreibweise einer richtigen Lösung wird angenommen (0.41.4): Kommentar, Backticks,
      // Tabellenvorsatz und ausdrückliches ASC – so, wie es die Einheit L1.5 selbst zeigt.
      await page.goto(base + "#practice/sql-projection-gleichstand");
      await page.locator("#checkSqlButton").waitFor();
      await editor.fill(["-- sortiert nach Name", "select schuelernr, vorname, nachname", "from `fahrschueler`", "order by fahrschueler.nachname ASC, vorname ASC"].join("\n"));
      await page.locator("#checkSqlButton").click();
      await page.locator("#practiceResult.is-success").waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf in der Aufgabe bei ${width}px`);
      assert.deepEqual(errors, []);
      await context.close();
    }
    // Andere Zeitzonen (0.41.2): NOW() und CURDATE() folgen der Uhr des Geräts, auch wenn dort ein anderer Tag ist.
    for (const timezoneId of ["America/Los_Angeles", "Asia/Tokyo", "Pacific/Kiritimati"]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, timezoneId });
      await context.addInitScript(() => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
      });
      const page = await context.newPage();
      await page.goto(base + "#sql/frei");
      await page.locator("#runtimeChip.is-ready").waitFor();
      await page.locator("#sqlEditor").fill("SELECT NOW(), CURDATE();");
      await page.locator("#playgroundRunButton").click();
      await page.locator("#sqlOutput tbody td").first().waitFor();
      const [now, today] = (await page.locator("#sqlOutput tbody td").allInnerTexts()).map((text) => text.trim());
      const device = await page.evaluate(() => {
        const d = new Date();
        const pad = (value) => String(value).padStart(2, "0");
        return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, minutes: d.getHours() * 60 + d.getMinutes(), zone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      });
      assert.equal(device.zone, timezoneId);
      const shownMinutes = Number(now.slice(11, 13)) * 60 + Number(now.slice(14, 16));
      const distance = Math.min(Math.abs(shownMinutes - device.minutes), 1440 - Math.abs(shownMinutes - device.minutes));
      assert.ok(distance <= 2, `NOW() = ${now} in ${timezoneId}, Gerät bei Minute ${device.minutes}`);
      if (distance === Math.abs(shownMinutes - device.minutes)) assert.equal(today, device.date, timezoneId);
      await context.close();
    }
    console.log("PASS: MySQL functions in the browser lab (text, date, numbers), local NOW/CURDATE, AUTO_INCREMENT and ENGINE rewritten with note, German hints for MySQL-only syntax and functions, typo suggestion, alias and AVG notes, exercises explain TIMESTAMPDIFF, three time zones, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
