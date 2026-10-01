const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
(async () => {
  const output = path.join(__dirname, "..", ".tmp", "completion-qa");
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const state = () => page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")));
    await page.goto(`${base}?screenshot=1#lesson/relation-und-schluessel`);
    await page.waitForURL(/#path$/);
    await page.goto(`${base}?screenshot=1#lesson/warum-datenbanken`);
    const ordered = await page.evaluate(() => window.WORKBENCH_CONTENT.modules.flatMap((module) => module.lessonIds).map((id) => window.WORKBENCH_CONTENT.lessons.find((item) => item.id === id)));
    const first = ordered[0];
    assert.equal(await page.locator("[data-next-lesson]").count(), 0);
    await page.locator("[data-complete-lesson]").click();
    assert.equal(await page.locator('[data-lesson-check="0"]').evaluate((el) => document.activeElement === el), true);
    assert.deepEqual((await state()).completedLessons, []);
    for (const check of await page.locator("[data-lesson-check]").all()) await check.check();
    await page.reload();
    assert.equal(await page.locator("[data-lesson-check]:checked").count(), first.completionChecks.length);
    await page.locator("[data-complete-lesson]").click();
    assert.equal(await page.locator('#quizForm input[name="quizAnswer"]').first().evaluate((el) => document.activeElement === el), true);
    await page.locator('#quizForm button[type="submit"]').click();
    assert.equal(await page.locator('#quizForm input[name="quizAnswer"]').first().evaluate((el) => document.activeElement === el), true);
    assert.equal(await page.locator("#quizResult").getAttribute("role"), "status");
    assert.equal(await page.locator('#quizForm [role="radiogroup"]').getAttribute("aria-labelledby"), "quizQuestion");
    await page.locator(`input[name="quizAnswer"][value="${(first.quiz.correct + 1) % first.quiz.options.length}"]`).check();
    await page.locator('#quizForm button[type="submit"]').click();
    assert.ok(await page.locator("#quizResult.is-error").isVisible());
    assert.deepEqual((await state()).passedLessonQuizzes, []);
    await page.locator(`input[name="quizAnswer"][value="${first.quiz.correct}"]`).check();
    await page.locator('#quizForm button[type="submit"]').click();
    await page.locator("[data-complete-lesson]").click();
    assert.equal(await page.locator("[data-lesson-teacher]").evaluate((el) => document.activeElement === el), true);
    assert.deepEqual((await state()).completedLessons, []);
    for (let index = 0; index < ordered.length; index++) {
      const lesson = ordered[index];
      await page.locator("[data-lesson-reading]").waitFor();
      assert.ok(page.url().endsWith(`#lesson/${lesson.id}`));
      await page.locator(`input[name="quizAnswer"][value="${lesson.quiz.correct}"]`).check();
      await page.locator('#quizForm button[type="submit"]').click();
      for (const check of await page.locator("[data-lesson-check], [data-lesson-teacher]").all()) await check.check();
      await page.locator("[data-complete-lesson]").click();
      assert.ok(await page.locator("[data-complete-lesson]").isDisabled());
      assert.equal((await state()).completedLessons.length, index + 1);
      if (index + 1 < ordered.length) {
        const next = page.locator("[data-next-lesson]");
        assert.equal(await next.getAttribute("data-lesson"), ordered[index + 1].id);
        assert.equal(await next.evaluate((el) => document.activeElement === el), true);
        if (index === 0) {
          await page.waitForFunction(() => !document.querySelector("#toastRegion").children.length);
          await page.screenshot({ path: path.join(output, "next-desktop.png"), animations: "disabled" });
          await page.setViewportSize({ width: 390, height: 844 });
          await page.locator("#appearanceButton").click();
          await page.locator('[data-font-size="20"]').click();
          await page.locator("#appearanceDoneButton").click();
          await next.scrollIntoViewIfNeeded();
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          await page.screenshot({ path: path.join(output, "next-mobile.png"), animations: "disabled" });
          await page.setViewportSize({ width: 1440, height: 1000 });
        }
        await next.click();
        await page.waitForURL(new RegExp(`#lesson/${ordered[index + 1].id}$`));
      } else assert.equal(await page.locator("[data-next-lesson]").count(), 0);
    }
    const xp = await page.locator("#xpButton").innerText();
    assert.equal(Number(xp.replace(/\D/g, "")), ordered.reduce((sum, lesson) => sum + lesson.xp, 0));
    await page.goto(`${base}?screenshot=1#lesson/warum-datenbanken`);
    assert.ok(await page.locator("[data-complete-lesson]").isDisabled());
    assert.equal(await page.locator("#xpButton").innerText(), xp);
    assert.equal((await state()).completedLessons.length, ordered.length);
    assert.deepEqual(errors, []);
    console.log(`PASS: incomplete gates and focus, wrong/correct quiz, persistence, all ${ordered.length} sequential completions and module transitions, next-unit focus, final unit, no duplicate XP, mobile large font.`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
