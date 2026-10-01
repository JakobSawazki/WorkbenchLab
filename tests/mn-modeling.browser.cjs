const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
}
const ordered = Array.from(context.window.WORKBENCH_CONTENT.modules.flatMap((module) => module.lessonIds));
const completed = ordered.slice(0, ordered.indexOf("erm-beziehungsentitaet"));
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
(async () => {
  const output = path.join(root, ".tmp", "mn-modeling");
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript((completedLessons) => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons })), completed);
    for (const width of [1440, 1100, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const theme of ["dark", "light"]) {
        await page.goto(`${base}?screenshot=1#lesson/erm-beziehungsentitaet`);
        await page.locator("[data-lesson-reading]").waitFor();
        if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
        await page.locator("#appearanceButton").click();
        await page.locator('[data-font-size="20"]').click();
        await page.locator("#appearanceDoneButton").click();
        const overflow = await page.evaluate(() => [...document.querySelectorAll(".mn-comparison, .mn-state, .mn-row strong")]
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .map((el) => ({ className: el.className, text: el.textContent, width: el.clientWidth, scroll: el.scrollWidth })));
        assert.deepEqual(overflow, [], `${width} ${theme}`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        const diagram = page.locator(".mn-comparison");
        assert.equal(await diagram.locator(".mn-state.is-solved strong").count(), 3);
        const nodes = await diagram.locator(".mn-state.is-solved .mn-row > *").all();
        let previousBottom = -Infinity;
        for (const node of nodes) {
          const rect = await node.boundingBox();
          assert.ok(rect.y >= previousBottom, "Each table and cardinality occupies a separate, ordered row");
          previousBottom = rect.y + rect.height;
        }
        await diagram.scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(output, `${width}-${theme}.png`), animations: "disabled" });
      }
    }
    assert.deepEqual(errors, []);
    console.log("PASS: M:N diagram at four widths, both themes, large font; no clipping or runtime errors.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
