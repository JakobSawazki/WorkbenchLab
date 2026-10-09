const assert = require("node:assert/strict");
const output = require("./artifacts.cjs")("command-search");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const context = await browser.newContext();
    await context.addInitScript(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" })));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ["dark", "light"]) {
        await page.goto(`${base}?v=0.23.3#commands`);
        await page.locator("#runtimeChip.is-ready").waitFor();
        assert.equal(await page.locator('#sidebar [data-route="commands"] span').innerText(), "SQL-Befehle");
        if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
        const input = page.locator("#commandSearch");
        for (const [query, id] of [["Filtern", "cmd-where"], ["Tabellen verbinden", "cmd-join"], ["Durchschnitt", "cmd-functions"]]) {
          await input.fill(query);
          assert.equal(await page.locator("#commandResults .command-card").first().getAttribute("data-command"), id);
          assert.ok(await input.evaluate(element => element === document.activeElement));
        }
        await input.fill("Filtern");
        await page.locator('#commandResults [data-command="cmd-where"]').click();
        await page.waitForURL("**#command/cmd-where");
        if (width < 900 && await page.locator("#mobileMenuButton").getAttribute("aria-expanded") !== "true") await page.locator("#mobileMenuButton").click();
        await page.locator('#sidebar [data-route="commands"]').click();
        await page.waitForTimeout(350);
        assert.equal(await input.inputValue(), "Filtern");
        await input.fill("nichtsgefundenxyz");
        assert.ok(await page.locator("#commandSearchEmpty").isVisible());
        assert.equal(await page.locator("#commandResults .command-card").count(), 0);
        await page.locator("#commandSearchClear").click();
        assert.equal(await input.inputValue(), "");
        assert.equal(await page.locator("#commandResults .command-card").count(), 17);
        await input.fill("Gruppen filtern");
        assert.equal(await page.locator("#commandResults .command-card").first().getAttribute("data-command"), "cmd-having");
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        assert.ok((await input.boundingBox()).x >= 0);
        await page.screenshot({ path: path.join(output, `command-search-${width}-${theme}.png`) });
      }
    }
    assert.deepEqual(errors, []);
    console.log("PASS: semantic search, ranking, focus, clear, empty state, detail return, desktop/mobile and dark/light.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
