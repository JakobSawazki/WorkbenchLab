const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
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
    await page.goto(`${base}?screenshot=1#lesson/eerm-grundlagen`);
    const glossary = page.locator(".model-glossary");
    await glossary.waitFor();
    assert.equal(await glossary.evaluate((el) => el.open), false);
    await glossary.locator("summary").click();
    assert.ok((await glossary.locator("p").innerText()).includes("erweitertes Entity-Relationship-Modell"));
    assert.ok((await glossary.locator("p").innerText()).includes("später"));
    await glossary.locator("summary").click();
    assert.equal(await glossary.locator("p").isVisible(), false);
    console.log("PASS: no premature eERM glossary on home/L1.1/L1.2; contextual, collapsible introduction in L1.3.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
