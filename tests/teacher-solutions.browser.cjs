// Claude, OPT-23: Lösungen für die Lehrkraft im Entwicklermodus über eine lokale Lösungsdatei.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const { loadContent } = require("../tools/build-expected.cjs");
const { collectSolutions } = require("../tools/build-solutions.cjs");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const file = (name, text) => ({ name, mimeType: "application/json", buffer: Buffer.from(text) });

(async () => {
  const data = collectSolutions(loadContent().WORKBENCH_CONTENT);
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
      await page.goto(base + "#practice/sql-projection");
      await page.locator("#sqlEditor").waitFor();

      // Ohne Entwicklermodus: keine Lösung, kein Ladeknopf.
      assert.equal(await page.locator(".teacher-solution").count(), 0);
      await page.locator("#editProfileButton").click();
      assert.ok(await page.locator("#solutionFileButton").isHidden());

      // Entwicklermodus einblenden und einschalten: Ladeknopf erscheint, noch keine Lösung.
      await page.keyboard.press("Control+Alt+s");
      assert.ok(await page.locator("#solutionFileButton").isHidden());
      await page.locator("#developerModeButton").click();
      assert.ok(await page.locator("#solutionFileButton").isVisible());
      assert.equal(await page.locator("#solutionFileLabel").innerText(), "Lösungsdatei laden");
      assert.equal(await page.locator(".teacher-solution").count(), 0);

      // Ungültige Dateien werden abgelehnt.
      for (const bad of ["{ kein json", JSON.stringify({ app: "Andere", solutions: {} }), JSON.stringify({ app: "WorkbenchLab-Loesungen", solutions: { unbekannt: { lines: ["x"] } } })]) {
        await page.locator("#solutionFileInput").setInputFiles(file("falsch.json", bad));
        await page.getByText("keine gültige WorkbenchLab-Lösungsdatei").last().waitFor();
      }
      assert.equal(await page.locator(".teacher-solution").count(), 0);

      // Gültige Datei: Lösung erscheint eingeklappt bei der Aufgabe; HTML in der Datei bleibt Text.
      const withMarkup = structuredClone(data);
      withMarkup.solutions["sql-projection"].lines.push('<img src=x onerror="window.__xss=1">');
      await page.locator("#solutionFileInput").setInputFiles(file("workbenchlab-loesungen.json", JSON.stringify(withMarkup)));
      await page.locator(".teacher-solution").waitFor();
      assert.match(await page.locator("#solutionFileLabel").innerText(), /Lösungsdatei geladen \(\d+ Aufgaben\)/);
      await page.locator("#profileCancelButton").click();
      const solution = page.locator(".teacher-solution");
      assert.equal(await solution.evaluate((element) => element.open), false);
      await solution.locator("summary").click();
      assert.match(await solution.innerText(), /SELECT schuelernr, vorname, nachname\s+FROM fahrschueler\s+ORDER BY nachname;/);
      assert.match(await solution.innerText(), /<img src=x/);
      assert.equal(await solution.locator("img").count(), 0);
      assert.equal(await page.evaluate(() => window.__xss), undefined);

      // Auch Auswahl-, Ordnungs- und Diagrammaufgaben zeigen ihre Lösung.
      await page.goto(base + "#practice/predict-where-and");
      assert.match(await page.locator(".teacher-solution").textContent(), /Wie viele Zeilen hat das Ergebnis\?\s+→ 3/);
      await page.goto(base + "#practice/order-where-sortierung");
      assert.match(await page.locator(".teacher-solution").textContent(), /SELECT nachname, vorname\s+FROM fahrschueler\s+WHERE/);
      await page.goto(base + "#practice/erm-fahrschule-1n-diagram");
      assert.match(await page.locator(".teacher-solution").textContent(), /orte zu fahrschueler: 1:N/);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf bei ${width}px`);

      // Nichts davon wird gespeichert; nach dem Neuladen sind die Lösungen weg.
      const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
      assert.equal(stored.includes("ORDER BY nachname"), false);
      assert.equal(stored.includes("Loesungen"), false);
      await page.reload();
      await page.locator(".lesson-head").waitFor();
      assert.equal(await page.locator(".teacher-solution").count(), 0);

      // Entwicklermodus ausschalten verwirft geladene Lösungen sofort.
      await page.locator("#editProfileButton").click();
      await page.keyboard.press("Control+Alt+s");
      await page.locator("#solutionFileInput").setInputFiles(file("workbenchlab-loesungen.json", JSON.stringify(data)));
      await page.locator(".teacher-solution").waitFor();
      await page.locator("#developerModeButton").click();
      assert.equal(await page.locator(".teacher-solution").count(), 0);
      assert.ok(await page.locator("#solutionFileButton").isHidden());
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: teacher solutions only in developer mode from a local file, invalid files rejected, markup stays text, all exercise types, nothing stored, gone after reload or leaving developer mode, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
