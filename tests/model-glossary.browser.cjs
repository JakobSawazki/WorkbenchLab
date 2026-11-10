const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const artifacts = require("./artifacts.cjs")("model-glossary");
const path = require("node:path");
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: ["warum-datenbanken", "relation-und-schluessel"] })));
    for (const route of ["home", "lesson/warum-datenbanken", "lesson/relation-und-schluessel"]) {
      await page.goto(`${base}?screenshot=1#${route}`);
      await page.locator("#mainContent").waitFor();
      assert.equal(await page.locator(".model-glossary").count(), 0);
    }
    const er = page.locator('[data-highlight-block="section-0-definition-2"]');
    assert.match(await er.innerText(), /ER steht für Entity-Relationship/);
    assert.match(await er.innerText(), /Relationship bedeutet Beziehung/);
    assert.equal(await page.getByText("ERD = Entity-Relationship Diagram", { exact: true }).count(), 1);
    assert.equal(await page.getByText("PK = Primary Key (Primärschlüssel)", { exact: true }).count(), 1);
    assert.match(await page.locator('[data-highlight-block="section-1-definition-0"]').innerText(), /jeden Datensatz eindeutig/);
    assert.match(await page.locator('[data-highlight-block="section-1-definition-0"]').innerText(), /schuelernr/);
    await page.locator("#appearanceButton").click();
    await page.locator('[data-font-size="20"]').click();
    await page.locator("#appearanceDoneButton").click();
    for (const theme of ["dark", "light"]) {
      if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
      for (const width of [1440, 360]) {
        await page.setViewportSize({ width, height: 950 });
        await page.reload();
        await page.locator(".lesson-definition-grid").first().waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        const pkGrid = page.locator(".lesson-definition-grid.is-wide");
        assert.equal(await pkGrid.count(), 1);
        assert.ok(await pkGrid.evaluate(grid => {
          const section = grid.parentElement;
          return section.matches(".content-section") && grid.offsetWidth >= section.clientWidth * .9
            && grid.firstElementChild.offsetWidth === grid.clientWidth;
        }), `PK spans the section at ${width}px in ${theme}`);
        for (const grid of await page.locator(".lesson-definition-grid").all()) {
          assert.equal(await grid.evaluate(el => el.scrollWidth <= el.clientWidth + 1), true);
          await grid.screenshot({ path: path.join(artifacts, `${theme}-${width}-${await grid.locator("dt").count()}.png`), animations: "disabled" });
        }
      }
    }
    await page.goto(`${base}?screenshot=1#lesson/eerm-grundlagen`);
    const glossary = page.locator(".model-glossary");
    await glossary.waitFor();
    assert.equal(await glossary.evaluate((el) => el.open), false);
    await glossary.locator("summary").click();
    assert.ok((await glossary.locator("p").innerText()).includes("erweitertes Entity-Relationship-Modell"));
    assert.ok((await glossary.locator("p").innerText()).includes("später"));
    await glossary.locator("summary").click();
    assert.equal(await glossary.locator("p").isVisible(), false);
    console.log("PASS: ER/ERD/PK definitions in L1.2, German meanings and key example, dark/light desktop/mobile large font; no premature eERM glossary, contextual introduction in L1.3.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
