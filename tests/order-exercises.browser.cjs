// Claude, OPT-03b: Aufgabentyp „Klauseln ordnen“ im Browser.
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
      await page.goto(base + "#sql");
      await page.locator("#runtimeChip.is-ready").waitFor();
      const xpStart = Number.parseInt(await page.locator("#topXp").innerText(), 10);
      const lines = () => page.locator("#orderList > li code").allInnerTexts();

      await page.locator('[data-filter="order"]').click();
      assert.equal(await page.locator("main .practice-card").count(), 4);
      assert.equal(await page.locator("main .practice-kind", { hasText: "Klauseln ordnen" }).count(), 4);

      await page.locator('[data-practice="order-where-sortierung"]').click();
      await page.locator(".order-callout").waitFor();
      assert.ok(await page.locator('.nav-item[data-route="sql"]').evaluate((item) => item.classList.contains("is-active")));
      assert.deepEqual(await lines(), ["WHERE ort = 'Stuttgart'", "ORDER BY nachname, vorname;", "SELECT nachname, vorname", "FROM fahrschueler"]);

      // Erste Zeile kann nicht nach oben, letzte nicht nach unten.
      const item = (index) => page.locator("#orderList > li").nth(index);
      assert.ok(await item(0).locator('[data-order-move="-1"]').isDisabled());
      assert.ok(await item(3).locator('[data-order-move="1"]').isDisabled());
      assert.match(await item(0).locator('[data-order-move="1"]').getAttribute("aria-label"), /Zeile 1 nach unten: WHERE/);

      // Falsche Reihenfolge: Hinweis, kein Ergebnis, keine XP.
      await page.locator('#orderPracticeForm [type="submit"]').click();
      await page.getByText("Noch nicht ganz").waitFor();
      assert.match(await page.locator("#practiceResult").innerText(), /feste Reihenfolge/);
      assert.ok(await page.locator("#predictResult").isHidden());
      assert.equal(Number.parseInt(await page.locator("#topXp").innerText(), 10), xpStart);

      // Mit der Tastatur sortieren: Fokus bleibt auf der verschobenen Zeile, Ansage für Screenreader.
      await item(2).locator('[data-order-move="-1"]').focus();
      await page.keyboard.press("Enter");
      assert.match(await page.locator("#orderStatus").textContent(), /SELECT nachname, vorname steht jetzt in Zeile 2 von 4/);
      assert.ok(await item(1).locator('[data-order-move="-1"]').evaluate((button) => button === document.activeElement));
      await page.keyboard.press("Enter");
      assert.deepEqual((await lines())[0], "SELECT nachname, vorname");
      // Am oberen Rand ist „nach oben“ gesperrt; der Fokus wechselt auf „nach unten“ derselben Zeile.
      assert.ok(await item(0).locator('[data-order-move="1"]').evaluate((button) => button === document.activeElement));
      await item(3).locator('[data-order-move="-1"]').click();
      await item(2).locator('[data-order-move="-1"]').click();
      assert.deepEqual(await lines(), ["SELECT nachname, vorname", "FROM fahrschueler", "WHERE ort = 'Stuttgart'", "ORDER BY nachname, vorname;"]);

      // Richtige Reihenfolge: Erklärung, ausgeführtes Ergebnis, XP einmalig.
      await page.locator('#orderPracticeForm [type="submit"]').click();
      await page.getByText("Übung gelöst").waitFor();
      assert.match(await page.locator("#practiceResult").innerText(), /Sortiert wird immer zuletzt/);
      await page.locator("#predictResult table").waitFor();
      assert.equal(await page.locator("#predictResult tbody tr").count(), 4);
      assert.equal(Number.parseInt(await page.locator("#topXp").innerText(), 10), xpStart + 15);
      await page.locator('#orderPracticeForm [type="submit"]').click();
      assert.equal(Number.parseInt(await page.locator("#topXp").innerText(), 10), xpStart + 15);

      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf bei ${width}px`);
      await page.screenshot({ path: `.tmp/order-${width}.png`, animations: "disabled" });

      // Neu geöffnet beginnt die Aufgabe wieder durcheinander; spätere Einheit bleibt gesperrt.
      await page.reload();
      await page.locator(".order-callout").waitFor();
      assert.equal((await lines())[0], "WHERE ort = 'Stuttgart'");
      assert.match(await page.locator("#practiceResult").innerText(), /Bereits gelöst/);
      await page.goto(base + "#practice/order-join");
      await page.waitForFunction(() => location.hash === "#path");
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: four ordering exercises, filter, disabled edge buttons, keyboard moves with focus and announcement, hint on wrong order, explanation and executed result when correct, XP once, locking unchanged, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
