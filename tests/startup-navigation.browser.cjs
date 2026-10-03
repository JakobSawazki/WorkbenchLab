const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const output = path.resolve(__dirname, "..", ".tmp", "startup-navigation");
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
    const lessons = await page.evaluate(() => window.WORKBENCH_CONTENT.lessons.filter((lesson) => lesson.classroomTask.startupGuide));
    assert.deepEqual(lessons.map((lesson) => lesson.courseCode), ["L1.1", "L1.2", "L1.3", "L1.4"]);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const lesson of lessons) {
        await page.goto(`${base}#lesson/${lesson.id}`);
        const source = page.locator('.classroom-task [data-route="reference/workbench-start"]');
        await source.waitFor();
        await page.locator(".task-step").nth(2).locator("summary").click();
        await source.scrollIntoViewIfNeeded();
        await source.click({ trial: true });
        await page.waitForTimeout(400);
        const steps = await page.locator(".task-step").evaluateAll((items) => items.map((item) => item.open));
        const top = await page.evaluate(() => scrollY);
        await source.click();
        await page.locator("#workbench-start:focus").waitFor();
        assert.ok(await page.evaluate(() => document.querySelector("#workbench-start").getBoundingClientRect().top >= document.querySelector(".topbar").getBoundingClientRect().bottom), "Guide controls must clear the sticky header");
        assert.ok(page.url().endsWith("#reference/workbench-start"));
        assert.equal(await page.locator("video").evaluate((video) => video.paused), true);
        assert.equal(await page.locator("video source").getAttribute("src"), "assets/tutorials/workbench-start.mp4");
        assert.ok((await page.locator(".connection-guide").innerText()).includes("127.0.0.1"));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        await page.screenshot({ path: path.join(output, `${lesson.courseCode}-${width}.png`) });
        await page.locator("[data-startup-return]").click();
        await source.waitFor();
        await page.waitForFunction(() => document.activeElement?.dataset.route === "reference/workbench-start");
        assert.deepEqual(await page.locator(".task-step").evaluateAll((items) => items.map((item) => item.open)), steps);
        const returnedTop = await page.evaluate(() => scrollY);
        assert.ok(Math.abs(returnedTop - top) < 3, `${lesson.courseCode} at ${width}: expected ${top}, returned ${returnedTop}`);
        await source.click();
        await page.locator("#workbench-start:focus").waitFor();
        await page.goBack();
        await source.waitFor();
        await page.waitForFunction(() => document.activeElement?.dataset.route === "reference/workbench-start");
        assert.deepEqual(await page.locator(".task-step").evaluateAll((items) => items.map((item) => item.open)), steps);
      }
    }
    await page.goto(`${base}#home`);
    await page.goto(`${base}#reference/workbench-start`);
    await page.locator("#workbench-start:focus").waitFor();
    assert.equal(await page.locator("[data-startup-return]").count(), 0);
    await page.reload();
    await page.locator("#workbench-start:focus").waitFor();
    assert.equal(await page.locator("[data-startup-return]").count(), 0);
    assert.deepEqual(errors, []);
    console.log("PASS: four startup links, return and browser back preserve steps/position/focus, direct and reloaded guide, desktop/mobile, paused video.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
