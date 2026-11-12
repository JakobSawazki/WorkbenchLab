const assert = require("node:assert/strict");
const output = require("./artifacts.cjs")("home-navigation");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";

(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" })));
    const page = await context.newPage();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}?v=0.23.2#home`);
      await page.locator("#runtimeChip.is-ready").waitFor();
      if (width < 900) await page.locator("#mobileMenuButton").click();
      const version = page.locator("#versionHistoryButton");
      const dialog = page.locator("#versionHistoryDialog");
      assert.equal(await version.innerText(), "V" + await page.evaluate(() => window.WORKBENCH_CONTENT.version));
      await version.press("Enter");
      assert.ok(await dialog.isVisible());
      assert.equal(await dialog.locator("li strong").first().innerText(), await version.innerText());
      assert.ok(await dialog.locator("li").count() > 40);
      assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1));
      const history = dialog.locator("ol");
      await history.press("End");
      await page.waitForFunction(() => document.querySelector("#versionHistoryList").scrollTop > 0);
      await page.keyboard.press("Escape");
      assert.ok(await dialog.isHidden());
      await page.waitForFunction(() => document.activeElement?.id === "versionHistoryButton");
      await version.click();
      assert.equal(await history.evaluate(el => el.scrollTop), 0);
      await dialog.getByRole("button", { name: "Versionsverlauf schließen" }).click();
      assert.ok(await dialog.isHidden());
      assert.equal(await page.locator('.main-nav [data-route="home"]').count(), 0);
      assert.equal(await page.locator('.main-nav .nav-item').first().innerText(), "Lernpfad");
      for (const route of ["home", "lesson/warum-datenbanken"]) {
        await page.goto(`${base}?v=0.23.2#${route}`);
        await page.waitForTimeout(150);
        await page.evaluate(() => window.scrollTo(0, 600));
        assert.ok(await page.evaluate(() => scrollY > 0));
        if (width < 900 && await page.locator("#mobileMenuButton").getAttribute("aria-expanded") !== "true") await page.locator("#mobileMenuButton").click();
        await page.locator('.brand img').click();
        await page.waitForURL('**#home');
        await page.waitForFunction(() => scrollY === 0);
      }
      await page.screenshot({ path: path.join(output, `home-navigation-${width}.png`) });
    }
    console.log("PASS: no redundant overview, brand returns home and scrolls to top on desktop/mobile.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
