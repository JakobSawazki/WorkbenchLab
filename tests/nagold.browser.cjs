const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4199/";
const artifacts = path.join(os.tmpdir(), "workbenchlab-tests", "nagold");
fs.mkdirSync(artifacts, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: "Europe/Berlin", acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base + "?screenshot#home");
    await page.evaluate(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedCommands: ["cmd-select"] })));
    await page.reload();
    await page.locator("#runtimeChip.is-ready").waitFor();
    const open = async () => {
      if (!await page.locator("#profileDialog").isVisible()) await page.locator("#editProfileButton").click();
      await page.locator("#nagoldTotal").click();
      await page.locator("#nagoldDialog").waitFor();
    };
    const field = (index, name) => page.locator(`[data-nagold-index="${index}"] [data-nagold-field="${name}"]`);
    const remove = index => page.locator(`[data-nagold-remove="${index}"]`);
    const today = await page.evaluate(() => {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    });
    const beforeTime = await page.evaluate(() => {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    });
    await open();
    assert.equal(await page.locator("#nagoldRows tr").count(), 1);
    assert.equal(await field(0, "date").inputValue(), today);
    const localTime = await page.evaluate(() => {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    });
    assert.ok([beforeTime, localTime].includes(await field(0, "time").inputValue()));
    await page.locator("#nagoldSaveButton").click();
    assert.ok(await page.locator("#nagoldDialog").isVisible());
    await page.locator("[data-nagold-preset]").selectOption("Mitarbeit");
    assert.equal(await field(0, "purpose").inputValue(), "Mitarbeit");
    await field(0, "time").fill("");
    await page.locator("#nagoldSaveButton").click();
    assert.ok(await page.locator("#nagoldDialog").isVisible());
    await field(0, "time").fill(localTime);
    for (const value of ["6", "5.5", "0", "-1"]) {
      await field(0, "points").fill(value);
      assert.equal(await field(0, "points").evaluate(el => el.checkValidity()), false);
      await page.locator("#nagoldSaveButton").click();
      assert.ok(await page.locator("#nagoldDialog").isVisible());
      assert.equal(await page.locator("#topNagold").innerText(), "0 NAG");
    }
    await field(0, "points").fill("3");
    await page.locator("#nagoldAddButton").click();
    assert.equal(await field(1, "date").inputValue(), today);
    const secondTime = await field(1, "time").inputValue();
    assert.match(secondTime, /^\d{2}:\d{2}$/);
    await field(1, "purpose").fill("Eigener Arbeitsauftrag");
    await page.locator("#nagoldAddButton").click();
    await field(2, "purpose").fill("Versehentlicher Eintrag");
    await remove(2).click();
    assert.equal(await page.locator("#nagoldRows tr").count(), 2);
    assert.equal(await page.locator("#nagoldSum").innerText(), "8 NAGOLD gesamt");
    await page.locator("#nagoldSaveButton").click();
    assert.equal(await page.locator("#topNagold").innerText(), "8 NAG");
    assert.equal(await page.locator("#topXp").innerText(), "12 XP");
    await page.reload();
    assert.equal(await page.locator("#topNagold").innerText(), "8 NAG");
    await open();
    assert.equal(await page.locator("#nagoldRows input").count(), 0);
    await page.locator('[data-nagold-index="0"] td:nth-child(3)').dblclick();
    await field(0, "date").fill("2026-10-01");
    await field(0, "time").fill("13:42");
    await field(0, "purpose").fill("Korrigierter Anlass");
    await field(0, "points").fill("2");
    await page.locator("#nagoldSaveButton").click();
    assert.equal(await page.locator("#topNagold").innerText(), "7 NAG");
    await open();
    assert.match(await page.locator('[data-nagold-index="0"]').innerText(), /01\.10\.2026/);
    assert.match(await page.locator('[data-nagold-index="0"]').innerText(), /13:42/);
    await remove(0).click();
    await page.keyboard.press("Escape");
    assert.ok(await page.locator("#profileDialog").isVisible());
    assert.ok(await page.locator("#nagoldTotal").evaluate(el => el === document.activeElement));
    assert.equal(await page.locator("#topNagold").innerText(), "7 NAG");
    await open();
    assert.equal(await page.locator("#nagoldRows tr").count(), 2);
    await page.locator('[data-nagold-edit="0"]').focus();
    await page.keyboard.press("Enter");
    await field(0, "purpose").fill("Nicht speichern");
    await page.locator("#nagoldCloseButton").click();
    await open();
    assert.match(await page.locator('[data-nagold-index="0"]').innerText(), /Korrigierter Anlass/);
    await remove(0).click();
    await page.locator("#nagoldSaveButton").click();
    assert.equal(await page.locator("#topNagold").innerText(), "5 NAG");
    await page.keyboard.press("Escape");
    await page.locator("#backupButton").click();
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    const download = await downloadPromise;
    const payload = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
    assert.equal(payload.formatVersion, 7);
    assert.equal(payload.summary.nagold, 5);
    assert.deepEqual(payload.data.nagoldEntries, [{ date: today, time: secondTime, purpose: "Eigener Arbeitsauftrag", points: 5 }]);
    await page.keyboard.press("Escape");
    await open();
    await remove(0).click();
    await page.locator("#nagoldSaveButton").click();
    await page.reload();
    assert.equal(await page.locator("#topNagold").innerText(), "0 NAG");
    await page.locator("#backupButton").click();
    page.once("dialog", dialog => dialog.accept());
    await page.locator("#progressFileInput").setInputFiles({ name: "nagold-test.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
    await page.waitForFunction(() => document.querySelector("#topNagold").textContent === "5 NAG");
    const teacher = await context.newPage();
    await teacher.goto(base + "lehrkraft.html");
    const summary = await teacher.evaluate(async parsed => window.WORKBENCH_TEACHER.readFile({ size: 1000, name: "test.json", text: async () => JSON.stringify(parsed) }, window.WORKBENCH_CONTENT), payload);
    assert.equal(summary.nagold, 5);
    assert.equal(summary.xp, 12);
    assert.equal(summary.integrity, "gueltig");
    await teacher.close();

    for (const theme of ["dark", "light"]) {
      if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
      await page.locator("#appearanceButton").click();
      await page.locator('[data-font-size="20"]').click();
      await page.locator("#appearanceDoneButton").click();
      for (const width of [1440, 360, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await open();
        await page.locator('[data-nagold-edit="0"]').click();
        const dialog = page.locator("#nagoldDialog");
        assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        for (const selector of ["#nagoldAddButton", "#nagoldSaveButton", '[data-nagold-field="date"]', '[data-nagold-field="time"]', '[data-nagold-field="purpose"]', '[data-nagold-field="points"]', "[data-nagold-remove]"]) {
          const box = await page.locator(selector).boundingBox();
          assert.ok(box.width > 20 && box.x >= 0 && box.x + box.width <= width + 1, `${theme} ${width} ${selector}`);
        }
        await page.screenshot({ path: path.join(artifacts, `${theme}-${width}.png`), animations: "disabled" });
        await page.keyboard.press("Escape");
        await page.keyboard.press("Escape");
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await open();
    await page.locator('[data-nagold-edit="0"]').click();
    await field(0, "purpose").fill('<img src=x onerror="window.nagoldInjected=true">');
    await page.locator("#nagoldSaveButton").click();
    await open();
    assert.equal(await page.locator("#nagoldRows img").count(), 0);
    assert.equal(await page.evaluate(() => Boolean(window.nagoldInjected)), false);
    assert.deepEqual(errors, []);
    console.log("PASS: open NAGOLD ledger, local date, preset/custom reasons, 1..5 validation, plus/minus, double-click and keyboard edit, cancel/focus, persistence, backup/import/teacher total, safe text, dark/light desktop and 360/320 large font.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
