const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const output = require("./artifacts.cjs")("opening-qa");
const fixture = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js"]) vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), fixture);
const ids = Array.from(fixture.window.WORKBENCH_CONTENT.lessons, item => item.id);

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.addInitScript(ids => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: ids }));
    }, ids);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => { if (response.url().includes("/assets/images/lesson-") && ![200, 304].includes(response.status())) errors.push(response.url() + ": " + response.status()); });
    for (const width of [1440, 1024, 390, 320]) {
      await page.setViewportSize({ width, height: width > 1000 ? 1000 : 844 });
      for (const theme of ["dark", "light"]) {
        for (const id of ["warum-datenbanken", "erm-sachtext-analyse", "digitale-spuren"]) {
          await page.goto(`${base}?v=0.25.0#lesson/${id}`);
          await page.locator(".lesson-opening").waitFor();
          if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
          await page.evaluate(width => { document.documentElement.style.fontSize = width < 500 ? "20px" : "16px"; }, width);
          await page.waitForFunction(() => { const img = document.querySelector(".lesson-opening img"); return img.complete && img.naturalWidth >= 1000; });
          assert.ok(await page.locator(".lesson-opening img").evaluate(el => el.naturalHeight > 500 && getComputedStyle(el).objectFit === "contain"));
          assert.equal(await page.locator(".opening-questions > li").count(), 3);
          const comparison = page.locator(".opening-comparison");
          assert.equal(await comparison.evaluate(el => el.open), false);
          const xp = await page.locator("#topXp").innerText();
          const summary = comparison.locator("summary");
          await summary.focus(); await page.keyboard.press("Enter");
          assert.equal(await comparison.evaluate(el => el.open), true);
          assert.equal(await comparison.locator("ol > li").count(), 3);
          assert.equal(await page.locator("#topXp").innerText(), xp);
          for (const selector of ["html", ".lesson-opening", ".opening-comparison"]) assert.ok(await page.locator(selector).evaluate(el => el.scrollWidth <= el.clientWidth + 1), `${selector} width=${width} ${id}`);
          await page.locator(".lesson-opening").screenshot({ path: path.join(output, `${id}-${theme}-${width}.png`), animations: "disabled" });
          await summary.focus(); await page.keyboard.press("Space");
          assert.equal(await comparison.evaluate(el => el.open), false);
        }
      }
    }
    await page.goto(`${base}?v=0.25.0#lesson/warum-datenbanken`);
    const block = '[data-highlight-block="opening-question-0"]';
    const quote = await page.locator(block).innerText();
    await page.locator(block).scrollIntoViewIfNeeded();
    await page.evaluate(selector => {
      const range = document.createRange(); range.selectNodeContents(document.querySelector(selector));
      const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
      document.dispatchEvent(new Event("selectionchange"));
    }, block);
    await page.getByRole("button", { name: "Grün markieren", exact: true }).click();
    assert.equal(await page.locator(`${block} mark`).innerText(), quote);
    await page.reload();
    assert.equal(await page.locator(`${block} mark`).innerText(), quote);
    assert.equal(await page.locator(".opening-comparison").evaluate(el => el.open), false);
    await page.goto(`${base}?v=0.25.0#lesson/relation-und-schluessel`);
    await page.locator("[data-lesson-reading]").waitFor();
    assert.equal(await page.locator(".lesson-opening").count(), 0);
    assert.deepEqual(errors, []);
    console.log("PASS: three local opening photographs, explicit cases/comparisons, keyboard, unchanged XP, highlight persistence, responsive widths in both themes.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
