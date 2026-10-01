const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const output = path.join(__dirname, "..", ".tmp", "appearance-qa");

async function checkWidth(page, selector = "html") {
  const sizes = await page.locator(selector).evaluate((el) => ({ width: el.clientWidth, scroll: el.scrollWidth }));
  assert.ok(sizes.scroll <= sizes.width + 1, `${selector}: ${JSON.stringify(sizes)}`);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    await context.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}?screenshot=1#home`);
    await page.locator("#runtimeChip.is-ready").waitFor();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    assert.ok(await page.locator(".brand-mark").evaluate((img) => img.complete && img.naturalWidth === 192));
    await checkWidth(page);
    await page.screenshot({ path: path.join(output, "dark-desktop.png"), animations: "disabled" });
    await page.locator("#backupButton").click();
    const backup = await page.locator("#backupDialog").innerText();
    assert.ok(!/Gerätecode|Profil-Herkunft|SHA-256|MAC-Adresse/.test(backup));
    assert.ok(backup.includes("TST.QAA") && backup.includes("TEST"));
    await checkWidth(page, "#backupDialog");
    assert.ok(await page.locator("#backupDialog").evaluate((el) => el.scrollHeight <= el.clientHeight));
    await page.screenshot({ path: path.join(output, "backup-desktop.png"), animations: "disabled" });
    await page.locator("#backupCloseButton").click();
    await page.locator("#appearanceButton").click();
    await page.locator('[data-color-field="accent"][data-color-value="#9fc8ff"]').click();
    await page.locator('[data-color-field="background"][data-color-value="#11151c"]').click();
    await page.locator('[data-font-size="20"]').click();
    assert.equal(await page.locator("html").evaluate((el) => getComputedStyle(el).fontSize), "20px");
    await checkWidth(page, "#appearanceDialog");
    const picker = page.locator('[data-custom-color="text"]');
    await picker.evaluate((el) => { el.value = "#11151c"; el.dispatchEvent(new Event("change", { bubbles: true })); });
    assert.ok((await page.locator("#appearanceError").innerText()).includes("kontrastarm"));
    await page.locator("#appearanceDoneButton").click();
    await page.reload();
    assert.equal(await page.locator("html").evaluate((el) => getComputedStyle(el).fontSize), "20px");
    assert.equal(await page.locator("html").evaluate((el) => el.style.getPropertyValue("--bg")), "#11151c");
    await page.locator("#themeToggleButton").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
    assert.equal(await page.locator("html").evaluate((el) => el.style.getPropertyValue("--bg")), "#f2f4f7");
    await page.locator("#appearanceButton").click();
    await page.locator('[data-color-field="accent"][data-color-value="#73468b"]').click();
    await page.locator("#appearanceResetButton").click();
    assert.equal(await page.locator("html").evaluate((el) => getComputedStyle(el).fontSize), "16px");
    await page.screenshot({ path: path.join(output, "options-light.png"), animations: "disabled" });
    await page.locator("#appearanceCloseButton").click();
    await page.screenshot({ path: path.join(output, "light-desktop.png"), animations: "disabled" });
    await page.locator("#runtimeChip").click();
    await page.waitForURL(/#sql$/);
    await page.getByRole("heading", { name: "SQL-Labor", level: 1, exact: true }).waitFor();
    await page.locator("#themeToggleButton").click();
    await page.goto(`${base}?screenshot=1#home`);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const theme of ["dark", "light"]) {
      if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
      await page.locator("#appearanceButton").click();
      await page.locator('[data-font-size="20"]').click();
      await checkWidth(page, "#appearanceDialog");
      for (const button of await page.locator("#appearanceDialog .button").all()) {
        assert.ok(await button.evaluate((el) => el.scrollWidth <= el.clientWidth + 1), `clipped button: ${await button.innerText()}`);
      }
      await page.screenshot({ path: path.join(output, `options-${theme}-mobile-large.png`), animations: "disabled" });
      await page.locator("#appearanceDoneButton").click();
      await checkWidth(page);
      await page.locator("#backupButton").click();
      await checkWidth(page, "#backupDialog");
      await page.screenshot({ path: path.join(output, `backup-${theme}-mobile-large.png`), animations: "disabled" });
      await page.locator("#backupCloseButton").click();
      await page.goto(`${base}?screenshot=1#lesson/warum-datenbanken`);
      await page.locator("[data-lesson-reading]").waitFor();
      await checkWidth(page);
      await page.screenshot({ path: path.join(output, `lesson-${theme}-mobile-large.png`), animations: "disabled" });
    }
    assert.deepEqual(errors, []);
    await context.close();
    console.log("PASS: generated icon, dark default, palettes, contrast guard, font scale, persistence, reset, simplified backup, SQL icon, desktop/mobile both modes.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
