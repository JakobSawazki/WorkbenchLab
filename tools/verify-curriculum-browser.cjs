const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const output = path.resolve(__dirname, "..", ".tmp", "curriculum-audit");
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}#home`);
    await page.locator("#profileDialog[open]").waitFor();
    await page.keyboard.press("Control+Alt+s");
    await page.locator("#developerModeButton").click();
    await page.locator("#profileName").fill("TES.TIA");
    await page.locator("#profileClass").fill("TEST");
    await page.locator("#profileForm button[type=submit]").click();
    const lessons = await page.evaluate(() => window.WORKBENCH_CONTENT.lessons);
    assert.equal(lessons.length, 21);
    const report = [];
    for (const lesson of lessons) {
      await page.goto(`${base}#lesson/${lesson.id}`);
      await page.locator(".lesson-body").waitFor();
      const exercise = page.locator(".lesson-exercises [data-practice]").first();
      assert.ok(await exercise.count(), lesson.courseCode);
      await exercise.click();
      assert.ok(page.url().includes("#practice/"));
      await page.locator(`#mainContent [data-lesson="${lesson.id}"]`).first().click();
      await page.locator("#praxisauftrag").waitFor();
      assert.match(await page.locator("#praxisauftrag").innerText(), /Workbench/i);
      if (lesson.classroomTask.download) {
        const response = await page.request.get(new URL(lesson.classroomTask.download.href, base).href);
        assert.equal(response.status(), 200, lesson.courseCode);
        assert.match(await response.text(), /(?:INSERT INTO|CREATE TABLE)/);
      }
      for (const [theme, width] of [["dark",1440],["light",1440],["dark",390],["light",390]]) {
        await page.setViewportSize({ width, height: 1000 });
        if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
        await page.waitForTimeout(150);
        await page.locator("#praxisauftrag").scrollIntoViewIfNeeded();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${lesson.courseCode}/${theme}/${width}`);
        assert.ok(await page.locator("#praxisauftrag").isVisible());
        await page.screenshot({ path: path.join(output, `${lesson.courseCode}-${theme}-${width}.png`) });
      }
      report.push({ code: lesson.courseCode, exerciseReturn: true, download: lesson.classroomTask.download?.href || null, views: 4 });
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output, "result.json"), JSON.stringify(report, null, 2));
    console.log("PASS: 21 real lesson/exercise return paths, all SQL links, 84 desktop/mobile dark/light views, no horizontal overflow or JavaScript errors.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
