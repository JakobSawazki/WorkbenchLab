const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 360]) {
      const context = await browser.newContext({ viewport: { width, height: 950 }, acceptDownloads: true });
      await context.addInitScript(() => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      const card = id => page.locator(`.lesson-card[data-lesson="${id}"]`);
      const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")));
      await page.goto(base + "#path");
      assert.deepEqual((await stored()).completedLessons, []);
      assert.notEqual(await page.evaluate(() => sessionStorage.getItem("workbenchlab-developer-v1")), "active");
      assert.equal(await card("select-projektion").getAttribute("aria-disabled"), "false");
      assert.equal(await page.locator('.lesson-card[aria-disabled="true"]').count(), 0);
      const lessonIds = await page.evaluate(() => window.WORKBENCH_CONTENT.lessons.map(lesson => lesson.id));
      assert.equal(await page.locator(".lesson-card").count(), lessonIds.length);
      await page.locator("#lernfortschritt-1 > summary").click();
      await card("select-projektion").click();
      await page.waitForURL(/#lesson\/select-projektion$/);
      await page.locator("[data-lesson-reading]").waitFor();
      await page.reload();
      await page.locator("[data-lesson-reading]").waitFor();
      assert.ok(page.url().endsWith("#lesson/select-projektion"));
      await page.locator("[data-complete-lesson]").click();
      assert.deepEqual((await stored()).completedLessons, [], "Normal completion gates still apply");

      // Sidebar and overview map use the same entry-point rule.
      await page.goto(base + "#home");
      const navSelect = page.locator('#sidebar button[data-lesson="select-projektion"]');
      assert.notEqual(await navSelect.getAttribute("aria-disabled"), "true");
      await page.locator('[data-map-menu="lernfortschritt-1"]').focus();
      const mapSelect = page.locator('.map-lesson-menu button[data-lesson="select-projektion"]');
      assert.notEqual(await mapSelect.getAttribute("aria-disabled"), "true");
      await mapSelect.focus();
      await mapSelect.press("Enter");
      await page.waitForURL(/#lesson\/select-projektion$/);

      await page.goto(base + "#practice/sql-projection");
      await page.locator("#sqlEditor").fill("SELECT schuelernr, vorname, nachname FROM fahrschueler ORDER BY nachname;");
      await page.locator("#checkSqlButton").click();
      await page.locator("#practiceResult.is-success").waitFor();
      assert.ok((await stored()).completedPractices.includes("sql-projection"));
      assert.deepEqual((await stored()).completedLessons, []);

      await page.goto(base + "#lesson/select-projektion");
      const correct = await page.evaluate(() => window.WORKBENCH_CONTENT.lessons.find(lesson => lesson.id === "select-projektion").quiz.correct);
      await page.locator(`input[name="quizAnswer"][value="${correct}"]`).check();
      await page.locator('#quizForm button[type="submit"]').click();
      for (const check of await page.locator("[data-lesson-check], [data-lesson-teacher]").all()) await check.check();
      const backup = page.waitForEvent("download");
      await page.locator("[data-complete-lesson]").click();
      await backup;
      assert.deepEqual((await stored()).completedLessons, ["select-projektion"]);
      assert.equal((await stored()).nagoldEntries.filter(row => row.lessonId === "select-projektion").length, 1);
      await page.reload();
      assert.ok(await page.locator("[data-complete-lesson]").isDisabled());
      assert.deepEqual((await stored()).completedLessons, ["select-projektion"]);
      for (const id of lessonIds) {
        await page.goto(base + `#lesson/${id}`);
        await page.locator(`[data-complete-lesson="${id}"]`).waitFor();
        assert.ok(page.url().endsWith(`#lesson/${id}`));
      }
      assert.deepEqual((await stored()).completedLessons, ["select-projektion"], "Visiting and skipping lessons does not complete them");
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: all lessons freely selectable, SELECT entry via path/sidebar/map/direct links, independent completion persists without earlier units, normal completion gates and no points for skipped lessons, desktop/mobile.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
