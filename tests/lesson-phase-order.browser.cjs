const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..");
const output = path.join(root, ".tmp", "lesson-phase-order");
const context = vm.createContext({ window: {} });
for (const file of ["content.js", "learning-path.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context);
}
const lessons = context.window.WORKBENCH_CONTENT.lessons;
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
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
    for (const lesson of lessons) {
      await page.goto(`${base}#lesson/${lesson.id}`);
      await page.locator(".lesson-body").waitFor();
      const order = await page.evaluate(() => {
        const nodes = [...document.querySelector(".lesson-body").children];
        return {
          reading: nodes.findIndex((el) => el.matches(".lesson-reading")),
          sheet: nodes.findIndex((el) => el.matches(".lesson-worksheet")),
          quiz: nodes.findIndex((el) => el.matches(".quiz-panel")),
          exercises: nodes.findIndex((el) => el.matches(".lesson-exercises")),
          task: nodes.findIndex((el) => el.matches(".classroom-task")),
          completion: nodes.findIndex((el) => el.matches(".lesson-completion"))
        };
      });
      assert.ok(order.reading >= 0 && order.reading < order.quiz, lesson.courseCode);
      if (order.sheet >= 0) assert.ok(order.sheet < order.quiz, lesson.courseCode);
      if (order.task >= 0) {
        assert.ok(order.quiz < order.task && order.task < order.completion, lesson.courseCode);
        if (order.exercises >= 0) assert.ok(order.quiz < order.exercises && order.exercises < order.task, lesson.courseCode);
        assert.equal(await page.locator(".classroom-task [data-practice]").count(), 0);
      }
      assert.equal(await page.locator("#quizForm").count(), 1);
    }
    await page.goto(`${base}#lesson/erm-sachtext-analyse`);
    const modelAnswer = page.locator('[data-worksheet-definition="modellkontrolle"]');
    await modelAnswer.fill("L2_1_tabellenentwurf.mwb: zwei Tabellen, technische Beziehung folgt in L2.2.");
    await page.reload();
    assert.equal(await modelAnswer.inputValue(), "L2_1_tabellenentwurf.mwb: zwei Tabellen, technische Beziehung folgt in L2.2.");
    await page.locator(".lesson-exercises [data-practice]").first().click();
    assert.ok(page.url().includes("#practice/"));
    await page.locator('#mainContent [data-lesson="erm-sachtext-analyse"]').first().click();
    await page.locator("#praxisauftrag").waitFor();
    assert.ok((await page.locator("#praxisauftrag").innerText()).includes("L2_1_tabellenentwurf.mwb"));
    for (const [name, width] of [["l2-desktop",1440],["l2-mobile",390]]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForTimeout(400);
      await page.locator("#praxisauftrag").scrollIntoViewIfNeeded();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: path.join(output, `${name}.png`) });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${base}#lesson/warum-datenbanken`);
    const firstLink = page.locator(".lesson-exercises [data-practice]").first();
    await firstLink.click();
    assert.ok(page.url().includes("#practice/"));
    await page.locator('#mainContent [data-lesson="warum-datenbanken"]').first().click();
    await page.locator("#praxisauftrag").waitFor();
    const downloadReady = page.waitForEvent("download");
    await page.locator(".task-download").click();
    const download = await downloadReady;
    await download.saveAs(path.join(output, "einstieg.sql"));
    assert.match(fs.readFileSync(path.join(output, "einstieg.sql"), "utf8"), /workbenchlab_l1_1_einstieg/);
    for (const [name, width] of [["desktop", 1440], ["mobile", 390]]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForTimeout(400);
      await page.locator("#praxisauftrag").scrollIntoViewIfNeeded();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.screenshot({ path: path.join(output, `${name}.png`) });
    }
    assert.deepEqual(errors, []);
    console.log(`PASS: phase order in ${lessons.length} lessons, exercise return, SQL download, desktop and mobile.`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
