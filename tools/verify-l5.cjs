const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const output = path.resolve(__dirname, "..", ".tmp", "l5");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
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
    for (const [id, field] of [["digitale-spuren","verknuepfung"],["big-data","qualitaet"],["bigdata-fallanalyse","urteil"]]) {
      await page.goto(`${base}#lesson/${id}`);
      await page.locator("#arbeitsblatt").waitFor();
      assert.equal(await page.locator("[data-worksheet-definition]").count(), 5);
      const answer = page.locator(`[data-worksheet-definition="${field}"]`);
      const response = `${id} Testantwort${field === "urteil" ? " Beleg und Begruendung.".repeat(100) : ""}`;
      assert.equal(await answer.getAttribute("maxlength"), field === "urteil" ? "4000" : "1200");
      await answer.fill(response);
      await page.reload();
      await page.locator("#arbeitsblatt").waitFor();
      assert.equal(await answer.inputValue(), response);
      await page.locator('#quizForm input[value="0"]').check();
      await page.locator('#quizForm button[type="submit"]').click();
      await page.locator("#quizResult.is-success").waitFor();
      const downloadReady = page.waitForEvent("download");
      await page.locator(".task-download").click();
      await (await downloadReady).saveAs(path.join(output, `${id}.sql`));
      const sql = fs.readFileSync(path.join(output, `${id}.sql`), "utf8");
      assert.equal((sql.match(/CREATE TABLE /g) || []).length, 6);
      for (const [name, width, theme] of [["desktop-dark",1440,"dark"],["desktop-light",1440,"light"],["mobile",390,"dark"]]) {
        await page.setViewportSize({ width, height: 1000 });
        if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
        assert.equal(await page.locator("html").evaluate((el) => el.style.getPropertyValue("--bg")), theme === "light" ? "#f2f4f7" : "#090b0e");
        await page.waitForTimeout(400);
        await answer.scrollIntoViewIfNeeded();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${id}/${name}`);
        await page.screenshot({ path: path.join(output, `${id}-${name}.png`) });
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.waitForTimeout(400);
    }
    await page.locator("#backupButton").click();
    const ready = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    await (await ready).saveAs(path.join(output, "backup.json"));
    const backup = JSON.stringify(JSON.parse(fs.readFileSync(path.join(output, "backup.json"), "utf8")));
    for (const id of ["digitale-spuren","big-data","bigdata-fallanalyse"]) assert.ok(backup.includes(`${id} Testantwort`));
    assert.ok(backup.includes("bigdata-fallanalyse Testantwort" + " Beleg und Begruendung.".repeat(100)));
    assert.deepEqual(errors, []);
    console.log("PASS: all three L5 worksheets, persistence, quizzes, SQL downloads, JSON export and dark/light desktop/mobile.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
