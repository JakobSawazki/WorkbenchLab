const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const output = path.resolve(__dirname, "..", ".tmp", "l4-1");
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
    await page.goto(`${base}#lesson/normalisierung`);
    await page.locator("#arbeitsblatt").waitFor();
    assert.equal(await page.locator("[data-worksheet-definition]").count(), 13);
    assert.equal(await page.locator(".worksheet-group").count(), 5);
    assert.equal(await page.locator(".worksheet-group[open]").count(), 1);
    for (const [id, group, text] of [["g2",0,"Drei Unterrichtsstufen Testantwort"],["f5",2,"Fuenf Besetzungen Testantwort"],["t4",3,"28 Anmeldungen Testantwort"]]) {
      const details = page.locator(".worksheet-group").nth(group);
      if (!(await details.evaluate((el) => el.open))) await details.locator("summary").click();
      await page.locator(`[data-worksheet-definition="${id}"]`).fill(text);
    }
    await page.reload();
    await page.locator("#arbeitsblatt").waitFor();
    assert.equal(await page.locator('[data-worksheet-definition="f5"]').inputValue(), "Fuenf Besetzungen Testantwort");
    assert.equal(await page.locator('[data-worksheet-definition="t4"]').inputValue(), "28 Anmeldungen Testantwort");
    const downloadReady = page.waitForEvent("download");
    await page.locator(".task-download").click();
    await (await downloadReady).saveAs(path.join(output, "listendaten.sql"));
    const sql = fs.readFileSync(path.join(output, "listendaten.sql"), "utf8");
    assert.equal((sql.match(/CREATE TABLE /g) || []).length, 2);
    assert.ok(sql.includes("filmstudio_unf") && sql.includes("tanzschule_unf"));
    await page.locator('#quizForm input[value="0"]').check();
    await page.locator('#quizForm button[type="submit"]').click();
    await page.locator("#quizResult.is-success").waitFor();
    await page.locator(".lesson-exercises [data-practice]").first().click();
    await page.locator("#mainContent").getByText("Personenname hängt nur von schauspielernr ab", { exact: false }).waitFor();
    await page.locator('#mainContent [data-lesson="normalisierung"]').first().click();
    await page.locator("#arbeitsblatt").waitFor();
    await page.locator("#backupButton").click();
    const backupReady = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    await (await backupReady).saveAs(path.join(output, "backup.json"));
    const backup = JSON.stringify(JSON.parse(fs.readFileSync(path.join(output, "backup.json"), "utf8")));
    assert.ok(backup.includes("Fuenf Besetzungen Testantwort") && backup.includes("28 Anmeldungen Testantwort"));
    await page.locator("#backupCloseButton").click();
    await page.waitForTimeout(4500);
    for (const [name, width, theme] of [["desktop-dark",1440,"dark"],["desktop-light",1440,"light"],["mobile",390,"dark"]]) {
      await page.setViewportSize({ width, height: 1000 });
      if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
      assert.equal(await page.locator("html").evaluate((el) => el.style.getPropertyValue("--bg")), theme === "light" ? "#f2f4f7" : "#090b0e");
      await page.waitForTimeout(400);
      const film = page.locator(".worksheet-group").nth(2);
      if (!(await film.evaluate((el) => el.open))) await film.locator("summary").click();
      await page.locator('[data-worksheet-definition="f5"]').scrollIntoViewIfNeeded();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name);
      await page.screenshot({ path: path.join(output, `${name}.png`) });
    }
    assert.deepEqual(errors, []);
    console.log("PASS: L4.1 fields, groups, persistence, SQL download, adapted exercise and return, quiz, backup and desktop/mobile themes.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
