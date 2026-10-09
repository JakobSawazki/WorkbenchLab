const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..");
const output = require("../tests/artifacts.cjs")("l3-3");
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
    await page.goto(`${base}#lesson/redundanz-3nf`);
    await page.locator("#arbeitsblatt").waitFor();
    assert.equal(await page.locator("[data-worksheet-definition]").count(), 20);
    assert.equal(await page.locator(".worksheet-group").count(), 7);
    assert.equal(await page.locator(".worksheet-group[open]").count(), 1);
    for (const [id, group, text] of [["g1", 0, "Normalformen Testantwort"], ["h4", 1, "Alle vier Fahrzeuge Testantwort"], ["w3", 3, "Beide Kontakte Testantwort"], ["pruefung", 6, "FK abgewiesen Testantwort"]]) {
      const details = page.locator(".worksheet-group").nth(group);
      if (!(await details.evaluate((el) => el.open))) await details.locator("summary").click();
      await page.locator(`[data-worksheet-definition="${id}"]`).fill(text);
    }
    await page.reload();
    await page.locator("#arbeitsblatt").waitFor();
    assert.equal(await page.locator('[data-worksheet-definition="h4"]').inputValue(), "Alle vier Fahrzeuge Testantwort");
    assert.equal(await page.locator('[data-worksheet-definition="w3"]').inputValue(), "Beide Kontakte Testantwort");
    const text = await page.locator("#mainContent").innerText();
    assert.ok(text.includes("Superschlüssel") && text.includes("haendlernr bestimmt telefon"));
    const sqlDownload = page.waitForEvent("download");
    await page.locator(".task-download").click();
    await (await sqlDownload).saveAs(path.join(output, "ausgangsdaten.sql"));
    assert.equal((fs.readFileSync(path.join(output, "ausgangsdaten.sql"), "utf8").match(/CREATE TABLE /g) || []).length, 14);
    await page.locator('#quizForm input[value="0"]').check();
    await page.locator('#quizForm button[type="submit"]').click();
    await page.locator("#quizResult.is-success").waitFor();
    await page.locator("#backupButton").click();
    const backupDownload = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    await (await backupDownload).saveAs(path.join(output, "backup.json"));
    const backup = JSON.stringify(JSON.parse(fs.readFileSync(path.join(output, "backup.json"), "utf8")));
    for (const answer of ["Normalformen Testantwort", "Alle vier Fahrzeuge Testantwort", "Beide Kontakte Testantwort", "FK abgewiesen Testantwort"]) assert.ok(backup.includes(answer));
    await page.locator("#backupCloseButton").click();
    await page.waitForTimeout(4500);
    for (const [name, width, theme] of [["desktop-dark", 1440, "dark"], ["desktop-light", 1440, "light"], ["mobile", 390, "dark"]]) {
      await page.setViewportSize({ width, height: 1000 });
      if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
      assert.equal(await page.locator("html").getAttribute("data-theme"), theme);
      assert.equal(await page.locator("html").evaluate((el) => el.style.getPropertyValue("--bg")), theme === "light" ? "#f2f4f7" : "#090b0e");
      await page.waitForTimeout(400);
      const group = page.locator(".worksheet-group").nth(1);
      if (!(await group.evaluate((el) => el.open))) await group.locator("summary").click();
      await page.locator('[data-worksheet-definition="h4"]').scrollIntoViewIfNeeded();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name);
      await page.screenshot({ path: path.join(output, `${name}.png`) });
    }
    assert.deepEqual(errors, []);
    console.log("PASS: L3.3 20 fields, seven groups, persistence, SQL download, quiz, JSON export, dark/light and mobile.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
