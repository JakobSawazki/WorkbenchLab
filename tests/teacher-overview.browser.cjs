// Claude, OPT-08: Klassenübersicht liest echte Sicherungen der Lernplattform lokal ein.
const artifacts = require("node:path").join(require("node:os").tmpdir(), "workbenchlab-tests");
require("node:fs").mkdirSync(artifacts, { recursive: true });
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const dir = path.resolve(artifacts, "teacher-overview");
const asFile = (file) => ({ name: path.basename(file), mimeType: "application/json", buffer: fs.readFileSync(file) });
(async () => {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    // 1. Echte Sicherung über die Lernplattform erzeugen.
    const studentContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    await studentContext.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "MIA.MUE", className: "J1-1", completedCommands: ["cmd-select"], activityDates: ["2026-10-08"] }));
    });
    const student = await studentContext.newPage();
    await student.goto(base + "#home");
    await student.locator("#runtimeChip.is-ready").waitFor();
    await student.locator("#backupButton").click();
    const [download] = await Promise.all([student.waitForEvent("download"), student.locator("#exportProgressButton").click()]);
    const validFile = path.join(dir, "mia.json");
    await download.saveAs(validFile);
    await studentContext.close();

    // 2. Veränderte Kopie, fremde Datei und defekte Datei.
    const tampered = JSON.parse(fs.readFileSync(validFile, "utf8"));
    tampered.identity.studentCode = "BEN.ALT";
    tampered.identity.profileId = "profile-veraendert";
    tampered.data.completedLessons = ["warum-datenbanken", "relation-und-schluessel"];
    const tamperedFile = path.join(dir, "ben.json");
    fs.writeFileSync(tamperedFile, JSON.stringify(tampered));
    const foreignFile = path.join(dir, "fremd.json");
    fs.writeFileSync(foreignFile, JSON.stringify({ app: "Andere", data: {} }));
    // Dateiname mit HTML-Zeichen: darf nur als Text erscheinen.
    const brokenFile = { name: "<kaputt>.json", mimeType: "application/json", buffer: Buffer.from("{ kein json") };

    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
      const page = await context.newPage();
      const errors = [];
      const foreignRequests = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) => { if (!request.url().startsWith(base) && !request.url().startsWith("blob:")) foreignRequests.push(request.url()); });
      await page.goto(base + "lehrkraft.html");
      assert.equal(await page.locator("h1").innerText(), "Klassenübersicht");
      assert.equal(await page.locator(".teacher-table").count(), 0);

      await page.locator("#teacherFiles").setInputFiles([asFile(validFile), asFile(tamperedFile), asFile(foreignFile), brokenFile]);
      await page.locator(".teacher-table").first().waitFor();
      assert.equal(await page.locator("#teacherStatus").innerText(), "2 Sicherungen eingelesen, 2 Dateien abgelehnt.");
      const rejected = await page.locator(".teacher-rejected").innerText();
      assert.match(rejected, /fremd\.json: Keine WorkbenchLab-Sicherung/);
      assert.match(rejected, /<kaputt>\.json: Keine lesbare JSON-Datei/);
      assert.equal(await page.locator(".teacher-rejected script, .teacher-rejected kaputt").count(), 0);

      const overview = page.locator(".teacher-table").first();
      const rows = overview.locator("tbody tr");
      assert.equal(await rows.count(), 2);
      const ben = await rows.nth(0).innerText();
      const mia = await rows.nth(1).innerText();
      assert.match(ben, /J1-1\s+BEN\.ALT/);
      assert.match(ben, /2 \/ 21/);
      assert.match(ben, /verändert oder beschädigt/);
      assert.match(mia, /J1-1\s+MIA\.MUE\s+12\s+0 \/ 21/);
      assert.match(mia, /2026-10-0[89]/);
      assert.match(mia, /gültig/);
      assert.equal(await page.locator(".teacher-stats .is-warning strong").innerText(), "1");

      // Matrix der Einheiten: 21 Spalten, zwei Haken bei der veränderten Datei.
      const matrix = page.locator(".teacher-matrix");
      assert.equal(await matrix.locator("thead th").count(), 22);
      assert.equal(await matrix.locator("tbody tr").nth(0).locator("td.is-done").count(), 2);
      assert.equal(await matrix.locator("tbody tr").nth(1).locator("td.is-done").count(), 0);

      // Dieselbe Datei erneut: wird nicht doppelt gezählt.
      await page.locator("#teacherFiles").setInputFiles([validFile]);
      await page.getByText("bereits eingelesen").waitFor();
      assert.equal(await rows.count(), 2);

      // CSV mit BOM, Semikolon und beiden Personen.
      const [csv] = await Promise.all([page.waitForEvent("download"), page.locator("#teacherCsv").click()]);
      assert.match(csv.suggestedFilename(), /^workbenchlab-klassenuebersicht-\d{4}-\d{2}-\d{2}\.csv$/);
      const csvPath = path.join(dir, `uebersicht-${width}.csv`);
      await csv.saveAs(csvPath);
      const text = fs.readFileSync(csvPath, "utf8");
      assert.ok(text.startsWith("﻿\"Klasse\";\"Kürzel\""));
      assert.equal(text.trim().split("\r\n").length, 3);
      assert.match(text, /"BEN\.ALT"/);

      // Layout: Tabellen scrollen in ihrem Rahmen, die Seite läuft nicht über.
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf bei ${width}px`);
      await page.screenshot({ path: `${artifacts}/teacher-overview-${width}.png`, animations: "disabled", fullPage: true });

      // Nichts wird gespeichert oder übertragen.
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      assert.deepEqual(foreignRequests, []);
      await page.locator("#teacherClear").click();
      assert.equal(await page.locator(".teacher-table").count(), 0);
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: teacher overview reads a real export, flags a tampered copy, rejects foreign/broken files safely, matrix, duplicate guard, CSV, no storage or foreign requests, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
