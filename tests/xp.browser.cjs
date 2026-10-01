const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const output = path.join(__dirname, "..", ".tmp", "xp-qa");
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}?screenshot=1#home`);
    for (const theme of ["dark", "light"]) {
      if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
      await page.locator("#xpButton").hover();
      const profile = page.locator("#editProfileButton");
      const before = await profile.evaluate((el) => ({ background: getComputedStyle(el).backgroundImage, width: el.offsetWidth, height: el.offsetHeight }));
      for (const selector of ["#sidebarAvatar", "#sidebarName", "#sidebarClass", "#sidebarLevel"]) {
        await page.locator(selector).hover();
        await page.waitForTimeout(200);
        const after = await profile.evaluate((el) => ({ background: getComputedStyle(el).backgroundImage, border: getComputedStyle(el).borderTopColor, accent: getComputedStyle(el).getPropertyValue("--brand-2").trim(), width: el.offsetWidth, height: el.offsetHeight }));
        const accentRgb = await page.evaluate((color) => { const el = document.createElement("span"); el.style.color = color; document.body.append(el); const rgb = getComputedStyle(el).color; el.remove(); return rgb; }, after.accent);
        assert.equal(after.border, accentRgb);
        assert.notEqual(after.background, before.background);
        assert.equal(after.width, before.width);
        assert.equal(after.height, before.height);
      }
    }
    await page.locator("#themeToggleButton").click();
    for (const selector of ["#sidebarAvatar", "#sidebarName", "#sidebarClass", "#sidebarLevel"]) {
      await page.locator(selector).click();
      assert.ok(await page.locator("#profileDialog").isVisible());
      await page.locator("#profileCancelButton").click();
    }
    await page.locator("#editProfileButton").click({ position: { x: 5, y: 5 } });
    assert.ok(await page.locator("#profileDialog").isVisible());
    await page.locator("#profileCancelButton").click();
    for (const key of ["Enter", "Space"]) {
      await page.locator("#editProfileButton").focus();
      await page.keyboard.press(key);
      assert.ok(await page.locator("#profileDialog").isVisible());
      await page.locator("#profileCancelButton").click();
    }
    assert.equal(await page.locator("#sidebarXpBar, #sidebarXpText").count(), 0);
    await page.locator("#xpButton").click();
    assert.equal(await page.locator("#xpProgressLabel").innerText(), "0 / 120 XP");
    assert.ok((await page.locator("#xpNextLevel").innerText()).includes("Noch 120 XP bis Level 2"));
    await page.locator("#xpCloseButton").click();
    assert.equal(await page.locator("#xpDialog").isVisible(), false);
    assert.equal(await page.locator("#xpButton").evaluate((el) => el === document.activeElement), true);
    await page.evaluate(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: ["warum-datenbanken"] })));
    await page.reload();
    await page.locator("#xpButton").click();
    assert.equal(await page.locator("#xpProgressLabel").innerText(), "40 / 120 XP");
    assert.ok((await page.locator("#xpNextLevel").innerText()).includes("Noch 80 XP"));
    assert.equal(await page.locator("#xpLevelProgress").evaluate((el) => el.value), 40);
    await page.screenshot({ path: path.join(output, "xp-desktop.png"), animations: "disabled" });
    await page.keyboard.press("Escape");
    await page.evaluate(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: window.WORKBENCH_CONTENT.lessons.map((lesson) => lesson.id), completedPractices: window.WORKBENCH_CONTENT.practices.map((practice) => practice.id) })));
    await page.reload();
    await page.locator("#xpButton").click();
    assert.equal(await page.locator("#xpProgressLabel").innerText(), "Höchstes Level erreicht");
    assert.equal(await page.locator("#xpLevelProgress").evaluate((el) => el.value / el.max), 1);
    await page.locator("#xpCloseButton").click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#appearanceButton").click();
    await page.locator('[data-font-size="20"]').click();
    await page.locator("#appearanceDoneButton").click();
    await page.locator("#xpButton").click();
    assert.ok(await page.locator("#xpDialog").evaluate((el) => el.scrollWidth <= el.clientWidth));
    await page.screenshot({ path: path.join(output, "xp-mobile.png"), animations: "disabled" });
    assert.deepEqual(errors, []);
    await context.close();
    console.log("PASS: XP dialog, no duplicate sidebar points, next-level targets, progress, highest level, close/focus, mobile large font.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
