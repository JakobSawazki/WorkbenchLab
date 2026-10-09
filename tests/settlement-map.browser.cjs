const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const output = require("./artifacts.cjs")("settlement-map");
const contentContext = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), contentContext);
}
const modules = contentContext.window.WORKBENCH_CONTENT.modules;
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    for (const width of [390, 1440, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, hasTouch: width === 390 });
      await page.addInitScript(() => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
      });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${base}?screenshot=1#home`);
      const map = page.locator(".relief-map");
      await map.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector(".relief-map img")?.naturalWidth === 1672);
      assert.ok((await map.locator("img").getAttribute("src")).endsWith("bpe6-alpine-learning-path.webp"));
      assert.ok((await map.locator("img").getAttribute("alt")).includes("Lernweg"));
      const pins = page.locator(".map-pin");
      assert.equal(await pins.count(), 5);
      assert.equal(await page.locator(".map-pin.is-locked").count(), 4);
      const bounds = await map.boundingBox();
      const rectangles = [];
      for (const pin of await pins.all()) {
        const rect = await pin.boundingBox();
        assert.ok(rect.x >= bounds.x && rect.y >= bounds.y);
        assert.ok(rect.x + rect.width <= bounds.x + bounds.width + 1);
        assert.ok(rect.y + rect.height <= bounds.y + bounds.height + 1);
        for (const other of rectangles) {
          assert.ok(rect.x >= other.x + other.width || other.x >= rect.x + rect.width || rect.y >= other.y + other.height || other.y >= rect.y + rect.height);
        }
        rectangles.push(rect);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await map.screenshot({ path: path.join(output, `map-${width}.png`) });
      if (width === 390) await pins.first().tap();
      else await pins.first().hover();
      const menu = page.locator(".map-stop").first().locator(".map-lesson-menu");
      assert.ok(await menu.isVisible());
      await menu.locator('[data-lesson="relation-und-schluessel"]').click({ force: true });
      assert.ok(page.url().endsWith("#home"));
      await menu.locator('[data-lesson="warum-datenbanken"]').click();
      await page.locator("[data-lesson-reading]").waitFor();
      assert.ok(page.url().endsWith("#lesson/warum-datenbanken"));
      if (width === 1440) {
        for (let stage = 1; stage < modules.length; stage += 1) {
          const completedLessons = Array.from(modules.slice(0, stage).flatMap((item) => item.lessonIds));
          await page.evaluate((completedLessons) => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons })), completedLessons);
          await page.goto(`${base}?screenshot=1#home`);
          await page.reload();
          await page.locator(".map-pin").first().waitFor();
          assert.equal(await page.locator(".map-pin.is-locked").count(), modules.length - stage - 1);
          assert.equal(await page.locator(".map-pin").nth(stage).evaluate((el) => el.classList.contains("is-locked")), false);
        }
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
    console.log("PASS: settlement asset loads, five nonoverlapping in-bounds pins, sequential locks, hover/touch menus and lesson navigation at mobile/desktop sizes.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
