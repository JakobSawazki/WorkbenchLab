const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const output = require("./artifacts.cjs")("worksheet-groups");
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
    const lessons = await page.evaluate(() => window.WORKBENCH_CONTENT.lessons.filter((item) => item.webWorksheet.definitionTerms.length >= 8));
    assert.equal(lessons.length, 10);
    for (const lesson of lessons) {
      await page.goto(`${base}#lesson/${lesson.id}`);
      await page.locator("#arbeitsblatt").waitFor();
      assert.equal(await page.locator("[data-worksheet-definition]:visible").count(), lesson.webWorksheet.definitionGroups[0].ids.length);
      const groups = page.locator(".worksheet-group");
      assert.equal(await groups.count(), lesson.webWorksheet.definitionGroups.length);
      for (let index = 0; index < lesson.webWorksheet.definitionGroups.length; index++) {
        const group = groups.nth(index);
        const definition = lesson.webWorksheet.definitionGroups[index];
        assert.equal(await group.locator("summary").innerText(), definition.label);
        if (!await group.evaluate((element) => element.open)) await group.locator("summary").click();
        for (const id of definition.ids) await group.locator(`[data-worksheet-definition="${id}"]`).fill(`${lesson.courseCode}: ${id} gespeichert`);
        await group.locator("summary").click();
      }
      await page.reload();
      await page.locator("#arbeitsblatt").waitFor();
      assert.equal(await page.locator(".worksheet-group[open]").count(), 1);
      for (const field of lesson.webWorksheet.definitionTerms) assert.equal(await page.locator(`[data-worksheet-definition="${field.id}"]`).inputValue(), `${lesson.courseCode}: ${field.id} gespeichert`);
      const second = groups.nth(1);
      await second.locator("summary").focus();
      await page.keyboard.press("Enter");
      assert.equal(await second.evaluate((element) => element.open), true);
      await page.keyboard.press("Space");
      assert.equal(await second.evaluate((element) => element.open), false);
      for (const [theme, width] of [["dark",1440],["light",1440],["dark",390],["light",390]]) {
        await page.setViewportSize({ width, height: 1000 });
        if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
        await page.waitForTimeout(150);
        await page.locator("#arbeitsblatt").scrollIntoViewIfNeeded();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), lesson.courseCode);
        await page.screenshot({ path: path.join(output, `${lesson.courseCode}-${theme}-${width}.png`) });
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator("#backupButton").click();
    const ready = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    const file = path.join(output, "answers.json");
    await (await ready).saveAs(file);
    const payload = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const lesson of lessons) for (const field of lesson.webWorksheet.definitionTerms) assert.equal(payload.data.lessonWorksheets[lesson.id].definitions[field.id], `${lesson.courseCode}: ${field.id} gespeichert`);
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("workbenchlab-v1"));
      state.lessonWorksheets = {};
      localStorage.setItem("workbenchlab-v1", JSON.stringify(state));
    });
    await page.reload();
    await page.locator("#backupButton").click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#progressFileInput").setInputFiles(file);
    await page.locator("#backupDialog").waitFor({ state: "hidden" });
    const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).lessonWorksheets);
    for (const lesson of lessons) for (const field of lesson.webWorksheet.definitionTerms) assert.equal(restored[lesson.id].definitions[field.id], `${lesson.courseCode}: ${field.id} gespeichert`);
    assert.deepEqual(errors, []);
    console.log("PASS: ten grouped worksheets, every field retained, keyboard toggles, reload, JSON export/import and 40 dark/light desktop/mobile views.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
