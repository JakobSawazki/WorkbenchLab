// Claude, OPT-01/OPT-02: freies SQL-Labor und deutsche Fehlermeldungen direkt bei „Ausführen“.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addInitScript(() => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedCommands: ["cmd-select"] }));
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + "#sql");
      await page.locator("#runtimeChip.is-ready").waitFor();

      // Einstieg ist ohne Freischaltung erreichbar.
      await page.locator('[data-route="sql/frei"]').click();
      await page.locator("#playgroundRunButton").waitFor();
      assert.equal(await page.locator("#viewTitle").innerText(), "Freies SQL-Labor");
      const editor = page.locator("#sqlEditor");
      const output = page.locator("#sqlOutput");
      const xpBefore = await page.locator("#topXp").innerText();

      // Startabfrage liefert die Tabelle.
      await page.locator("#playgroundRunButton").click();
      await output.locator("table").waitFor();
      assert.match(await output.innerText(), /11 Ergebniszeilen/);

      // Tippfehler: deutsche Erklärung mit Vorschlag, Original bleibt sichtbar.
      await editor.fill("SELECT nachnam FROM fahrschueler;");
      await editor.press("Control+Enter");
      await output.locator(".sql-error").waitFor();
      const message = await output.innerText();
      assert.match(message, /Die Spalte nachnam wurde nicht gefunden/);
      assert.match(message, /Meintest du nachname\?/);
      assert.match(message, /no such column: nachnam/);

      // Änderungen bleiben bis zum Zurücksetzen erhalten.
      await editor.fill("DELETE FROM fahrschueler WHERE schuelernr = 1;");
      await page.locator("#playgroundRunButton").click();
      await page.getByText("1 Datensatz betroffen").waitFor();
      await page.locator('[data-playground-table="fahrschueler"]').click();
      await page.getByText("10 Ergebniszeilen").waitFor();
      await page.locator("#playgroundResetButton").click();
      await page.locator('[data-playground-table="fahrschueler"]').click();
      await page.getByText("11 Ergebniszeilen").waitFor();

      // MySQL-Komfortbefehle.
      await editor.fill("SHOW TABLES;");
      await page.locator("#playgroundRunButton").click();
      await page.getByText("1 Ergebniszeile", { exact: true }).waitFor();
      await editor.fill("DESCRIBE fahrschueler;");
      await page.locator("#playgroundRunButton").click();
      await page.getByText("7 Ergebniszeilen").waitFor();

      // Datenbankwechsel und gespeicherter Entwurf je Datenbank.
      await editor.fill("SELECT vorname FROM fahrschueler;");
      await page.locator("#playgroundSchema").selectOption("fahrradvermietung");
      await page.locator('[data-playground-table="mietvertraege"]').waitFor();
      assert.match(await editor.inputValue(), /FROM kunden/);
      await page.locator('[data-playground-table="mietvertraege"]').click();
      await output.locator("table").waitFor();
      await page.reload();
      await page.locator("#runtimeChip.is-ready").waitFor();
      await page.goto(base + "#sql/frei");
      await page.locator("#playgroundRunButton").waitFor();
      assert.equal(await editor.inputValue(), "SELECT vorname FROM fahrschueler;");
      // Regression: Der vorhandene Lernstand übersteht das Neuladen (Initialisierungsreihenfolge in app.js).
      assert.equal(await page.locator("#topProfileName").innerText(), "TST.QAA");
      assert.equal(await page.locator("#topXp").innerText(), "12 XP");

      // Keine XP, kein horizontales Überlaufen, keine Skriptfehler.
      assert.equal(await page.locator("#topXp").innerText(), xpBefore);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf bei ${width}px`);
      await page.screenshot({ path: `.tmp/sql-playground-${width}.png`, animations: "disabled" });
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: free SQL playground, German error messages with suggestion, persistent changes until reset, MySQL helpers, per-database drafts, no XP, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
