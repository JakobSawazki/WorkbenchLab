const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
(async () => {
  const output = path.join(__dirname, "..", ".tmp", "opening-layout-qa");
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const page = await browser.newPage();
    const errors = [];
    const failures = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: ["warum-datenbanken", "relation-und-schluessel"] })));
    for (const width of [1440, 1100, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const theme of ["dark", "light"]) {
        for (const lesson of ["warum-datenbanken", "relation-und-schluessel", "eerm-grundlagen"]) {
          await page.goto(`${base}?screenshot=1#lesson/${lesson}`);
          await page.locator("[data-lesson-reading]").waitFor();
          if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
          await page.locator("#appearanceButton").click();
          await page.locator('[data-font-size="20"]').click();
          await page.locator("#appearanceDoneButton").click();
          const overflow = await page.evaluate(() => {
            const nodes = [...document.querySelectorAll(".lesson-reading .diagram-wrap, .lesson-reading .entity-box")];
            return nodes.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => ({ className: el.className, width: el.clientWidth, scroll: el.scrollWidth }));
          });
          if (overflow.length) failures.push({ width, theme, lesson, overflow });
          if (!await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)) failures.push({ width, theme, lesson, pageOverflow: true });
          const diagram = page.locator(".lesson-reading .diagram-wrap").first();
          if (await diagram.count()) {
            await diagram.scrollIntoViewIfNeeded();
            await page.screenshot({ path: path.join(output, `${width}-${theme}-${lesson}.png`), animations: "disabled" });
          }
        }
      }
    }
    assert.deepEqual(failures, []);
    assert.deepEqual(errors, []);
    console.log("PASS: first three lesson diagrams at four widths, both themes, large font; no diagram overflow or runtime errors.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
