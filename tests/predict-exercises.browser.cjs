// Claude, OPT-03c: Aufgabentyp „Vorhersage“ im Browser.
const artifacts = require("node:path").join(require("node:os").tmpdir(), "workbenchlab-tests");
require("node:fs").mkdirSync(artifacts, { recursive: true });
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

      // Im SQL-Labor unter eigenem Filter, nicht unter „Modellieren“.
      await page.locator('[data-filter="predict"]').click();
      assert.equal(await page.locator("main .practice-card").count(), 5);
      assert.equal(await page.locator("main .practice-kind", { hasText: "Vorhersage" }).count(), 5);
      await page.goto(base + "#modeling");
      await page.locator("main .practice-card").first().waitFor();
      assert.equal(await page.locator('main [data-practice^="predict-"]').count(), 0);

      await page.goto(base + "#practice/predict-where-and");
      await page.locator(".predict-callout").waitFor();
      assert.equal(await page.locator("#viewEyebrow").textContent(), "Vorhersage");
      assert.ok(await page.locator('.nav-item[data-route="sql"]').evaluate((item) => item.classList.contains("is-active")));
      assert.match(await page.locator(".predict-code").innerText(), /WHERE ort = 'Stuttgart' AND fahrstunden > 7/);
      assert.equal(await page.locator("#sqlEditor").count(), 0);

      // Tabelleninhalt lässt sich aufklappen und zeigt alle elf Datensätze.
      await page.locator(".predict-data summary").click();
      await page.locator(".predict-tables tbody tr").first().waitFor();
      assert.equal(await page.locator(".predict-tables tbody tr").count(), 11);

      // Falsche Antwort: Denkhilfe, kein Ergebnis, keine XP.
      await page.locator('input[name="choice-0"][value="0"]').check();
      await page.locator('#choicePracticeForm [type="submit"]').click();
      await page.getByText("Noch nicht ganz").waitFor();
      assert.match(await page.locator("#practiceResult").innerText(), /Klausel für Klausel/);
      assert.ok(await page.locator("#predictResult").isHidden());
      assert.equal(Number.parseInt(await page.locator("#topXp").innerText(), 10), xpStart);

      // Richtige Antwort: XP einmalig, Erklärung und tatsächliches Ergebnis.
      await page.locator('input[name="choice-0"][value="1"]').check();
      await page.locator('#choicePracticeForm [type="submit"]').click();
      await page.getByText("Übung gelöst").waitFor();
      assert.match(await page.locator("#practiceResult").innerText(), /beide Bedingungen zugleich/);
      await page.locator("#predictResult table").waitFor();
      assert.match(await page.locator("#predictResult").innerText(), /Tatsächliches Ergebnis\s+3 Ergebniszeilen/);
      assert.equal(await page.locator("#predictResult tbody tr").count(), 3);
      assert.equal(Number.parseInt(await page.locator("#topXp").innerText(), 10), xpStart + 15);
      await page.locator('#choicePracticeForm [type="submit"]').click();
      assert.equal(Number.parseInt(await page.locator("#topXp").innerText(), 10), xpStart + 15);

      // Mehrere Fragen: nur vollständig richtig zählt.
      await page.goto(base + "#practice/predict-sortierung");
      await page.locator(".predict-callout").waitFor();
      await page.locator('input[name="choice-0"][value="1"]').check();
      await page.locator('#choicePracticeForm [type="submit"]').click();
      await page.getByText("Noch nicht ganz").waitFor();
      await page.locator('input[name="choice-1"][value="2"]').check();
      await page.locator('#choicePracticeForm [type="submit"]').click();
      await page.getByText("Übung gelöst").waitFor();
      await page.locator("#predictResult table").waitFor();
      assert.equal(await page.locator("#predictResult tbody tr").count(), 11);

      // Auch die Vorhersage einer späteren Einheit lässt sich öffnen (0.38.0).
      await page.goto(base + "#practice/predict-join");
      await page.locator(".predict-callout").waitFor();

      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf bei ${width}px`);
      await page.goto(base + "#practice/predict-where-and");
      await page.locator(".predict-callout").waitFor();
      await page.screenshot({ path: `${artifacts}/predict-${width}.png`, animations: "disabled" });
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: five prediction exercises in SQL lab only, table preview, thinking hint on wrong answer, explanation and real result after correct answer, XP once, multi-question, locking unchanged, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
