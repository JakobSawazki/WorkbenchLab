const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4199/";
const artifacts = path.join(os.tmpdir(), "workbenchlab-tests", "nagold-progress");
fs.mkdirSync(artifacts, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base + "#home");
    for (const total of [-10, 0, 5, 99, 100, 125]) {
      await page.evaluate(total => {
        const points = total < 0 ? [total] : Array.from({ length: Math.ceil(total / 5) }, (_, i) => Math.min(5, total - i * 5));
        localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", nagoldEntries: points.map(points => ({ date: "2026-10-15", time: "09:00", purpose: "Mitarbeit", points })) }));
      }, total);
      await page.reload();
      await page.locator("#editProfileButton").click();
      const percent = Math.max(0, Math.min(100, total));
      assert.equal(await page.locator("#nagoldProgress").evaluate(e => e.value), percent);
      assert.equal(await page.locator("#nagoldProgressLabel").innerText(), `${total} / 100 NAGOLD`);
      assert.equal(await page.locator("#nagoldProgressPercent").innerText(), `${percent} %`);
      assert.match(await page.locator("#nagoldProgress").getAttribute("aria-valuetext"), new RegExp(`${total} von 100 NAGOLD`));
      assert.equal(await page.locator("#nagoldRemaining").innerText(), total >= 100
        ? "Jahresziel erreicht! Sehr gut (Note 1)."
        : `Noch ${100 - total} NAGOLD bis zum Jahresziel.`);
      await page.locator("#profileCancelButton").click();
    }
    let expectedTotal = 125;
    for (const theme of ["dark", "light"]) {
      if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
      await page.locator("#appearanceButton").click();
      await page.locator('[data-font-size="20"]').click();
      await page.locator("#appearanceDoneButton").click();
      for (const width of [1440, 360]) {
        await page.setViewportSize({ width, height: 900 });
        await page.locator("#editProfileButton").click();
        assert.equal(await page.locator("#profileDialog").evaluate(e => e.scrollWidth <= e.clientWidth + 1), true);
        const bounds = await page.locator("#nagoldProgress").boundingBox();
        assert.ok(bounds.width > 100 && bounds.x >= 0 && bounds.x + bounds.width <= width);
        await page.locator("#nagoldProgress").scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(artifacts, `${theme}-${width}.png`), animations: "disabled" });
        await page.locator("#nagoldTotal").click();
        await page.locator("#nagoldAddButton").click();
        await page.locator('#nagoldRows tr:last-child [data-nagold-field="purpose"]').fill("Anwesenheit");
        await page.locator("#nagoldCloseButton").click();
        expectedTotal += 2;
        assert.equal(await page.locator("#nagoldProgressLabel").innerText(), `${expectedTotal} / 100 NAGOLD`);
        await page.keyboard.press("Escape");
      }
    }
    assert.deepEqual(errors, []);
    console.log("PASS: NAGOLD annual goal, negative/zero/partial/full/above-target totals, live update, accessible labels, dark/light desktop/mobile large font");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
