// Claude, OPT-03a: Aufgabentyp „Fehlersuche“ im Browser.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const firstLessons = ["warum-datenbanken", "relation-und-schluessel", "eerm-grundlagen", "workbench-workflow", "select-projektion"];
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addInitScript((lessons) => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: lessons }));
      }, firstLessons);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("dialog", (dialog) => dialog.accept());
      await page.goto(base + "#sql");
      await page.locator("#runtimeChip.is-ready").waitFor();
      // OPT-22: Die Rückmeldung steht oberhalb der Reiter und bleibt sichtbar, auch wenn der Coach-Reiter aktiv ist.
      const banner = async (text) => {
        await page.waitForFunction((expected) => document.querySelector("#practiceResult")?.textContent.includes(expected), text);
        assert.ok(await page.locator("#practiceResult").isVisible(), `Banner „${text}“ nicht sichtbar`);
        assert.ok(await page.locator('[data-runner-panel="coach"].is-active').isVisible());
      };
      const xpStart = Number.parseInt(await page.locator("#topXp").innerText(), 10);

      // Filter zeigt genau die sechs Fehlersuche-Aufgaben mit eigener Kennzeichnung.
      await page.locator('[data-filter="debug"]').click();
      const cards = page.locator("main .practice-card");
      assert.equal(await cards.count(), 6);
      assert.equal(await page.locator("main .practice-kind", { hasText: "Fehlersuche" }).count(), 6);

      // Symptom „falsches Ergebnis“: Startcode läuft, besteht aber nicht.
      await page.locator('[data-practice="debug-fehlendes-komma"]').click();
      await page.locator(".debug-callout").waitFor();
      assert.match(await page.locator(".debug-callout").innerText(), /genau einen Fehler/);
      const editor = page.locator("#sqlEditor");
      const starter = await editor.inputValue();
      assert.match(starter, /SELECT vorname nachname, ort/);
      await page.locator("#runSqlButton").click();
      await page.locator("#sqlOutput table").waitFor();
      assert.equal(await page.locator("#sqlOutput thead th").count(), 2);
      await page.locator("#checkSqlButton").click();
      await banner("Noch nicht ganz");
      assert.equal(Number.parseInt(await page.locator("#topXp").innerText(), 10), xpStart);

      // Korrektur besteht und bringt einmalig 20 XP.
      await editor.fill(starter.replace("vorname nachname", "vorname, nachname"));
      await page.locator("#checkSqlButton").click();
      await banner("Aufgabe gelöst");
      assert.equal(Number.parseInt(await page.locator("#topXp").innerText(), 10), xpStart + 20);
      await page.locator("#checkSqlButton").click();
      await banner("besteht die Prüfung weiterhin");
      assert.equal(Number.parseInt(await page.locator("#topXp").innerText(), 10), xpStart + 20);

      // Hinweis auf einen gemessenen MySQL-Unterschied auch bei „Ausführen“ in einer Aufgabe (OPT-20).
      assert.equal(await page.locator("#sqlOutput .mysql-note").count(), 0);
      await editor.fill("SELECT fahrstunden / 4 FROM fahrschueler;");
      await page.locator("#runSqlButton").click();
      await page.locator("#sqlOutput .mysql-note").waitFor();
      assert.match(await page.locator("#sqlOutput .mysql-note").innerText(), /In MySQL Workbench anders: Division ganzer Zahlen/);
      await page.locator("#checkSqlButton").click();
      await banner("Noch nicht ganz");
      assert.equal(await page.locator("#sqlOutput .mysql-note").count(), 0);

      // Zurücksetzen stellt den fehlerhaften Startcode wieder her.
      await page.locator("#resetSqlButton").click();
      assert.equal(await editor.inputValue(), starter);

      // Symptom „Meldung“: deutsche Erklärung direkt bei „Ausführen“.
      await page.goto(base + "#practice/debug-text-ohne-anfuehrungszeichen");
      await page.locator(".debug-callout").waitFor();
      await page.locator("#runSqlButton").click();
      await page.locator("#sqlOutput .sql-error").waitFor();
      assert.match(await page.locator("#sqlOutput").innerText(), /einfache Anführungszeichen/);
      await editor.fill((await editor.inputValue()).replace("= Esslingen", "= 'Esslingen'"));
      await page.locator("#checkSqlButton").click();
      await banner("Aufgabe gelöst");

      // Übungen späterer Einheiten sind frei zugänglich und als Vorgriff gekennzeichnet (Entscheidung Jakob, 0.38.0).
      await page.goto(base + "#practice/debug-join-ohne-bedingung");
      await page.locator(".debug-callout").waitFor();
      assert.equal(await page.evaluate(() => location.hash), "#practice/debug-join-ohne-bedingung");
      await page.goto(base + "#sql");
      await page.locator('[data-filter="debug"]').click();
      assert.equal(await page.locator('main [data-practice="debug-join-ohne-bedingung"] .practice-ahead').count(), 1);
      assert.equal(await page.locator('main [data-practice="debug-fehlendes-komma"] .practice-ahead').count(), 0);
      assert.equal(await page.locator("main .practice-card.is-locked").count(), 0);

      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf bei ${width}px`);
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: six debug exercises, filter and label, wrong-result and error symptoms, fix earns XP once, MySQL difference note on run, reset restores bug, locking unchanged, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
