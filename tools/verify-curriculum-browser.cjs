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
      const steps = page.locator(".task-step");
      assert.equal(await steps.count(), lesson.classroomTask.steps.length, lesson.courseCode);
      assert.equal(await page.locator(".task-step[open]").count(), 1, lesson.courseCode);
      for (let index = 0; index < lesson.classroomTask.steps.length; index++) {
        const step = steps.nth(index);
        assert.equal(await step.locator("summary > span:nth-child(2)").innerText(), lesson.classroomTask.stepTitles[index]);
        if (index !== 0) await step.locator("summary").click();
        assert.equal(await step.locator("p").innerText(), lesson.classroomTask.steps[index].replace(/`([^`]+)`/g, "$1"));
        await step.locator("summary").click();
      }
      const firstSummary = steps.first().locator("summary");
      await firstSummary.focus();
      await page.keyboard.press("Enter");
      assert.ok(await steps.first().getAttribute("open") !== null);
      await page.keyboard.press("Space");
      assert.equal(await steps.first().getAttribute("open"), null);
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
        await steps.evaluateAll((elements) => elements.forEach((element) => { element.open = true; }));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${lesson.courseCode}/expanded/${theme}/${width}`);
        await page.screenshot({ path: path.join(output, `${lesson.courseCode}-${theme}-${width}-expanded.png`) });
        await steps.evaluateAll((elements) => elements.forEach((element) => { element.open = false; }));
      }
      report.push({ code: lesson.courseCode, exerciseReturn: true, fullStepText: true, keyboard: true, download: lesson.classroomTask.download?.href || null, views: 8 });
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output, "result.json"), JSON.stringify(report, null, 2));
    console.log("PASS: 21 lesson/exercise return paths, all SQL links, complete step text and keyboard toggles, 168 compact/expanded desktop/mobile dark/light views, no overflow or JavaScript errors.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
