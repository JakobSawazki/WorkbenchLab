const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedCommands: ["cmd-select"] }));
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base + "?v=0.24.1#home");
    await page.locator("#runtimeChip.is-ready").waitFor();
    const profile = page.locator("#editProfileButton"), dialog = page.locator("#profileDialog");
    assert.equal(await page.locator("#sidebar .profile-summary, #xpButton, #xpDialog").count(), 0);
    assert.equal(await page.locator(".topbar-actions #editProfileButton").count(), 1);
    assert.equal(await page.locator("#topXp").innerText(), "12 XP");
    for (const theme of ["dark", "light"]) {
      if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
      const name = await page.locator("#topProfileName").boundingBox(), cls = await page.locator("#topProfileClass").boundingBox(), xp = await page.locator("#topXp").boundingBox();
      assert.ok(cls.x > name.x + name.width && xp.y > name.y);
      assert.equal((await profile.boundingBox()).height, (await page.locator("#appearanceButton").boundingBox()).height);
      for (const selector of ["#topProfileName", "#topProfileClass", "#topXp"]) {
        await page.locator(selector).click();
        assert.ok(await dialog.isVisible());
        assert.ok(await page.locator("#profileHelp").isHidden());
        assert.equal(await page.locator("#xpProgressLabel").innerText(), "12 / 120 XP");
        assert.ok((await page.locator("#xpNextLevel").innerText()).includes("Noch 108 XP bis Level 2"));
        await page.locator("#profileCancelButton").click();
        assert.ok(await profile.evaluate(el => el === document.activeElement));
      }
      await profile.click();
      await page.locator("#profileInfoButton").click();
      assert.ok(await page.locator("#profileHelp").isVisible());
      assert.equal(await page.locator("#profileInfoButton").getAttribute("aria-expanded"), "true");
      await page.locator("#profileInfoButton").click();
      assert.ok(await page.locator("#profileHelp").isHidden());
      await page.screenshot({ path: ".tmp/profile-" + theme + ".png", animations: "disabled" });
      await page.locator("#profileName").fill("BAD");
      await page.locator('#profileForm [type="submit"]').click();
      assert.equal(await page.locator("#profileName").getAttribute("aria-invalid"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#topProfileName").innerText(), "TST.QAA");
    }
    for (const key of ["Enter", "Space"]) {
      await profile.focus(); await page.keyboard.press(key);
      assert.ok(await dialog.isVisible()); await page.keyboard.press("Escape");
    }
    await profile.click();
    await page.locator("#profileName").fill("mia.mue");
    await page.locator("#profileClass").fill("wgj1/1");
    await page.locator('#profileForm [type="submit"]').click();
    assert.equal(await page.locator("#topProfileName").innerText(), "MIA.MUE");
    assert.equal(await page.locator("#topProfileClass").innerText(), "WGJ1/1");
    assert.equal(await page.locator("#topXp").innerText(), "12 XP");
    await page.reload();
    assert.equal(await page.locator("#topProfileName").innerText(), "MIA.MUE");
    await page.evaluate(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: ["warum-datenbanken"] })));
    await page.reload(); await profile.click();
    assert.equal(await page.locator("#xpProgressLabel").innerText(), "40 / 120 XP");
    assert.equal(await page.locator("#xpLevelProgress").evaluate(el => el.value), 40);
    await page.keyboard.press("Escape");
    await page.evaluate(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: window.WORKBENCH_CONTENT.lessons.map(item => item.id), completedPractices: window.WORKBENCH_CONTENT.practices.map(item => item.id) })));
    await page.reload(); await profile.click();
    assert.equal(await page.locator("#xpProgressLabel").innerText(), "Höchstes Level erreicht");
    assert.equal(await page.locator("#xpLevelProgress").evaluate(el => el.value / el.max), 1);
    await page.keyboard.press("Escape");
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.locator("#appearanceButton").click();
      await page.locator('[data-font-size="20"]').click();
      await page.locator("#appearanceDoneButton").click();
      const profileBox = await profile.boundingBox();
      assert.equal(profileBox.height, (await page.locator("#appearanceButton").boundingBox()).height);
      for (const selector of ["#topProfileName", "#topProfileClass", "#topXp"]) {
        const box = await page.locator(selector).boundingBox();
        assert.ok(box.y >= profileBox.y && box.y + box.height <= profileBox.y + profileBox.height);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.screenshot({ path: ".tmp/profile-header-" + width + ".png", animations: "disabled" });
      await profile.click();
      assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth));
      await page.locator("#profileInfoButton").click();
      assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth));
      await page.keyboard.press("Escape"); await profile.click();
      assert.ok(await page.locator("#profileHelp").isHidden());
      await page.screenshot({ path: ".tmp/profile-mobile-" + width + ".png", animations: "disabled" });
      await page.keyboard.press("Escape");
    }
    assert.deepEqual(errors, []);
    const fresh = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const firstVisit = await fresh.newPage();
    await firstVisit.goto(base + "?v=0.24.1#home");
    await firstVisit.locator("#profileDialog").waitFor();
    assert.ok(await firstVisit.locator("#profileHelp").isHidden());
    await firstVisit.locator("#profileInfoButton").click();
    assert.ok(await firstVisit.locator("#profileHelp").isVisible());
    await firstVisit.locator("#profileName").fill("jak.saw");
    await firstVisit.locator("#profileClass").fill("BK2-2");
    await firstVisit.locator('#profileForm [type="submit"]').click();
    assert.equal(await firstVisit.locator("#topProfileName").innerText(), "JAK.SAW");
    assert.equal(await firstVisit.locator("#topXp").innerText(), "0 XP");
    await fresh.close();
    console.log("PASS: unified profile/XP, info toggle, edit/validation/cancel/persistence, levels, keyboard/focus, mobile large font.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
