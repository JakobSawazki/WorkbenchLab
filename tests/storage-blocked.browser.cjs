// Claude, 0.41.3: Die Lernplattform bei gesperrtem, vollem oder nach jedem Schließen geleertem
// Browserspeicher – wie es auf verwalteten Schul-PCs vorkommen kann. Alles Wesentliche muss
// funktionieren, es darf kein Skriptfehler auftreten, und die Sicherungsdatei bleibt der Ausweg.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const modes = [
  ["voll", true, () => {
    Storage.prototype.setItem = () => { const error = new Error("The quota has been exceeded."); error.name = "QuotaExceededError"; throw error; };
  }],
  ["gesperrt", true, () => {
    const denied = () => { const error = new Error("The operation is insecure."); error.name = "SecurityError"; throw error; };
    Object.defineProperty(window, "localStorage", { configurable: true, get: denied });
    Object.defineProperty(window, "sessionStorage", { configurable: true, get: denied });
  }],
  ["leer bei jedem Start", false, () => { try { localStorage.clear(); sessionStorage.clear(); } catch {} }]
];

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const [label, expectHint, init] of modes) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
      await context.addInitScript(init);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + "#home");

      // Erster Besuch: Der Profil-Dialog erscheint auch ohne nutzbaren Speicher.
      await page.locator("#profileDialog").waitFor({ state: "visible" });
      await page.locator("#profileName").fill("TST.QAA");
      await page.locator("#profileClass").fill("TEST");
      await page.locator('#profileForm [type="submit"]').click();
      await page.locator("#profileDialog").waitFor({ state: "hidden" });
      assert.equal(await page.locator("#topProfileName").innerText(), "TST.QAA", label);

      // Der Hinweis nennt die Sicherungsdatei als Ausweg.
      await page.locator("#backupButton").click();
      assert.equal(await page.locator("#backupStorageHint").isVisible(), expectHint, `Hinweis im Dialog (${label})`);
      if (expectHint) assert.match(await page.locator("#backupStorageHint").innerText(), /Browserspeicher nicht verfügbar/);
      await page.locator("#backupCloseButton").click();

      // Aufgabe lösen, freies Labor, Modell-Editor, Wiederholung, Klausurtraining, Einheit.
      await page.evaluate(() => { window.location.hash = "practice/sql-projection"; });
      await page.locator("#sqlEditor").fill("SELECT schuelernr, vorname, nachname FROM fahrschueler ORDER BY nachname;");
      await page.locator("#checkSqlButton").click();
      await page.locator("#practiceResult.is-success").waitFor();
      assert.equal(await page.locator("#topXp").innerText(), "35 XP", label);
      await page.evaluate(() => { window.location.hash = "sql/frei"; });
      await page.locator("#playgroundRunButton").click();
      await page.locator("#sqlOutput table").waitFor();
      await page.evaluate(() => { window.location.hash = "modeling/editor"; });
      await page.locator("#ermEditor button").filter({ hasText: "Entitätstyp" }).first().click();
      assert.equal(await page.locator("#ermDiagram .erm-entity-box").count(), 1, label);
      await page.evaluate(() => { window.location.hash = "sql/wiederholen"; });
      await page.locator(".review-list li").first().waitFor();
      await page.evaluate(() => { window.location.hash = "sql/klausur"; });
      await page.locator(".exam-head, .review-head").first().waitFor();
      await page.evaluate(() => { window.location.hash = "lesson/warum-datenbanken"; });
      await page.locator(".lesson-head").waitFor();

      // Die Sicherung enthält den Stand dieser Sitzung.
      await page.locator("#backupButton").click();
      const download = page.waitForEvent("download");
      await page.locator("#exportProgressButton").click();
      const chunks = [];
      for await (const chunk of await (await download).createReadStream()) chunks.push(chunk);
      const backup = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      assert.equal(backup.identity.studentCode, "TST.QAA", label);
      assert.deepEqual(backup.data.completedPractices, ["sql-projection"], label);
      assert.equal(backup.extras.ermDrafts.models[backup.extras.ermDrafts.task].entities.length, 1, label);
      assert.deepEqual(errors, [], `Skriptfehler bei „${label}“`);
      await context.close();
    }

    // Klassenübersicht bei gesperrtem Speicher.
    const context = await browser.newContext();
    await context.addInitScript(modes[1][2]);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "lehrkraft.html");
    await page.locator("#teacherFiles").setInputFiles({ name: "a.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ app: "WorkbenchLab", formatVersion: 2, data: { name: "TST.QAA", className: "TEST" } })) });
    await page.locator(".teacher-table").first().waitFor();
    assert.deepEqual(errors, []);
    console.log("PASS: with full, blocked or always-empty browser storage the first-visit profile dialog opens, tasks, free lab, model editor, review, exam and lessons work, the backup holds the session, the hint points to the backup, no script errors; class overview works with blocked storage.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
