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
const lessons = context.window.WORKBENCH_CONTENT.lessons;
const code = process.env.WORKBENCH_TEST_LESSON || "L1.8";
const target = lessons.find((item) => item.courseCode === code);
const orderedIds = context.window.WORKBENCH_CONTENT.modules.flatMap((item) => item.lessonIds);
const completed = orderedIds.slice(0, orderedIds.indexOf(target.id));
const answerIds = target.webWorksheet.definitionTerms.filter((_, index) => [0, 2, target.webWorksheet.definitionTerms.length - 1].includes(index)).map((item) => item.id);
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
async function revealAnswer(page, id) {
  const field = page.locator(`[data-worksheet-definition="${id}"]`);
  const group = page.locator(".worksheet-group").filter({ has: field });
  if (await group.count() && !await group.evaluate((el) => el.open)) await group.locator("summary").click();
  return field;
}
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(base);
      await page.evaluate((completedLessons) => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons })), completed);
      await page.goto(`${base}?screenshot=1#lesson/${target.id}`);
      await page.reload();
      const fields = page.locator("[data-worksheet-definition]");
      await fields.first().waitFor();
      assert.equal(await fields.count(), target.webWorksheet.definitionTerms.length);
      assert.equal(await fields.first().getAttribute("placeholder"), target.webWorksheet.answerPlaceholder);
      if (target.webWorksheet.definitionGroups) {
        assert.equal(await page.locator(".worksheet-group").count(), target.webWorksheet.definitionGroups.length);
        assert.deepEqual(await page.locator(".worksheet-group").evaluateAll((elements) => elements.map((el) => el.open)), [true, false, false]);
      }
      for (const id of answerIds) {
        await (await revealAnswer(page, id)).fill(`Testantwort ${id}`);
      }
      await page.reload();
      for (const id of answerIds) {
        assert.equal(await page.locator(`[data-worksheet-definition="${id}"]`).inputValue(), `Testantwort ${id}`);
      }
      if (target.classroomTask.download) {
        assert.ok(await page.locator(`a[href="${target.classroomTask.download.href}"]`).count());
      } else {
        assert.match(target.classroomTask.fileName, /\.mwb$/);
        assert.ok(await page.getByText(target.classroomTask.fileName, { exact: false }).count());
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.screenshot({ path: path.join(root, `.tmp/${code}-${width}.png`), fullPage: true });
      await fields.first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(root, `.tmp/${code}-worksheet-${width}.png`) });
      if (target.webWorksheet.definitionGroups) {
        const group = page.locator(".worksheet-group").nth(1);
        await group.locator("summary").click();
        assert.ok(await group.locator("[data-worksheet-definition]").first().isVisible());
        await group.locator("summary").click();
        assert.equal(await group.locator("[data-worksheet-definition]").first().isVisible(), false);
      }
      await page.close();
    }
    console.log(`PASS: ${code} worksheet tasks, persistent answers, Workbench artifact and desktop/mobile layout.`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
