const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";

(async () => {
  const output = require("./artifacts.cjs")("table-design-qa");
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" })));
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [1920, 1440, 1100, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const theme of ["dark", "light"]) {
        await page.goto(`${base}?screenshot=1#lesson/warum-datenbanken`);
        if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
        for (const size of [16, 20]) {
          await page.locator("#appearanceButton").click();
          await page.locator(`[data-font-size="${size}"]`).click();
          await page.locator("#appearanceDoneButton").click();
          const graphic = page.locator(".table-design-flow");
          await graphic.scrollIntoViewIfNeeded();
          const bounds = await graphic.evaluate((el) => {
            const frame = el.getBoundingClientRect();
            return { client: el.clientWidth, scroll: el.scrollWidth, right: frame.right, children: [...el.children].map((child) => { const rect = child.getBoundingClientRect(); return { left: rect.left, right: rect.right }; }), left: frame.left };
          });
          assert.ok(bounds.scroll <= bounds.client + 1, `${width}/${theme}/${size}: overflow`);
          assert.ok(bounds.children.every((child) => child.left >= bounds.left - 1 && child.right <= bounds.right + 1), JSON.stringify(bounds));
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          assert.equal(await page.locator(".designed-table > strong").evaluate((el) => getComputedStyle(el).backgroundColor), "rgb(23, 72, 107)");
          await page.screenshot({ path: path.join(output, `${width}-${theme}-${size}.png`), animations: "disabled" });
        }
      }
    }
    assert.deepEqual(errors, []);
    console.log("PASS: table-design graphic fully contained at five widths, both themes and two font sizes; navy heading.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
