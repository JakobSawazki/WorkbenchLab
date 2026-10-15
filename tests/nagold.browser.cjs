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
    assert.equal(await page.locator("#nagoldSaveButton").count(), 0);
    assert.ok(await page.locator("#nagoldDialog").isVisible());
    // Ein Feld: Vorschläge aus der Liste oder eigener Text (Claude, 2026-10-11).
    assert.equal(await page.locator("[data-nagold-preset]").count(), 0);
    assert.equal(await page.locator('#nagoldRows [data-nagold-field="purpose"]').count(), await page.locator("#nagoldRows tr.is-editing").count());
    // Neue Zeile beginnt mit 0 NAGOLD; 0 lässt sich nicht speichern.
    assert.equal(await field(0, "points").inputValue(), "0");
    // Pfeil öffnet die Liste weich; ein Vorschlag wird übernommen.
    const list = page.locator("#nagoldList0");
    assert.ok(await list.isHidden());
    await page.locator("[data-nagold-combo-toggle]").first().click();
    await page.waitForFunction(() => getComputedStyle(document.querySelector("#nagoldList0")).opacity === "1");
    assert.equal(await field(0, "purpose").getAttribute("aria-expanded"), "true");
    assert.match(await list.evaluate(el => getComputedStyle(el).transitionProperty), /opacity/);
    const box = await list.boundingBox();
    const inputBox = await field(0, "purpose").boundingBox();
    assert.ok(Math.abs(box.x - inputBox.x) <= 2 && box.y >= inputBox.y + inputBox.height, "Liste sitzt unter dem Feld");
    await list.locator('[data-nagold-option="Startkapital"]').click();
    assert.equal(await field(0, "purpose").inputValue(), "Startkapital");
    assert.equal(await field(0, "points").inputValue(), "5", "Startkapital gibt einmalig 5 NAGOLD");
    assert.equal(await page.locator("#topNagold").innerText(), "5 NAG");
    await page.locator("#nagoldAddButton").click();
    await field(1, "purpose").fill("startkapital");
    await field(1, "points").fill("5");
    assert.equal(await page.locator("#topNagold").innerText(), "5 NAG", "No second start capital by typing");
    assert.match(await page.locator("#nagoldError").innerText(), /bereits einmal/);
    await remove(1).click();
    await page.locator("[data-nagold-combo-toggle]").first().click();
    await list.locator('[data-nagold-option="Anwesenheit"]').click();
    assert.equal(await field(0, "purpose").inputValue(), "Anwesenheit");
    assert.equal(await field(0, "points").inputValue(), "2");
    assert.equal(await page.locator("#nagoldSum").textContent(), "2 NAGOLD gesamt");
    // Anwesenheit remains editable; blur must not overwrite a manual correction.
    await field(0, "points").fill("1");
    await field(0, "purpose").focus();
    await field(0, "points").focus();
    assert.equal(await field(0, "points").inputValue(), "1");
    await field(0, "points").fill("0");
    await page.locator("[data-nagold-combo-toggle]").first().click();
    await list.locator('[data-nagold-option="Zusatzaufgabe"]').click();
    assert.equal(await field(0, "purpose").inputValue(), "Zusatzaufgabe");
    await list.waitFor({ state: "hidden" });
    // Tastatur: Tippen filtert, Pfeil und Enter wählen, Esc schließt nur die Liste.
    await field(0, "purpose").fill("");
    await field(0, "purpose").pressSequentially("Mitarb");
    await list.waitFor({ state: "visible" });
    assert.deepEqual(await list.locator("li:not([hidden])").allInnerTexts(), ["Mitarbeit"]);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    assert.equal(await field(0, "purpose").inputValue(), "Mitarbeit");
    await page.keyboard.press("ArrowDown");
    await list.waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await list.waitFor({ state: "hidden" });
    assert.ok(await page.locator("#nagoldDialog").isVisible(), "Esc schließt nur die Liste");
    assert.equal(await field(0, "purpose").inputValue(), "Mitarbeit");
    await field(0, "time").fill("");
    assert.ok(await page.locator("#nagoldDialog").isVisible());
    assert.match(await page.locator("#nagoldError").innerText(), /noch nicht gespeichert/);
    await field(0, "time").fill(localTime);
    for (const value of ["6", "5.5", "0", "-11"]) {
      await field(0, "points").fill(value);
      if (value !== "0") assert.equal(await field(0, "points").evaluate(el => el.checkValidity()), false);
      assert.ok(await page.locator("#nagoldDialog").isVisible());
      assert.equal(await page.locator("#topNagold").innerText(), "1 NAG", "Last valid entry is preserved");
    }
    await field(0, "points").fill("3");
    await page.locator("#nagoldAddButton").click();
    assert.equal(await field(1, "date").inputValue(), today);
    const savedWithBlankRow = await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).nagoldEntries);
    assert.equal(savedWithBlankRow.length, 1, "Blank new row does not block saving a valid row");
    assert.equal(savedWithBlankRow[0].points, 3);
    const secondTime = await field(1, "time").inputValue();
    assert.match(secondTime, /^\d{2}:\d{2}$/);
    await field(1, "purpose").fill("Eigener Arbeitsauftrag");
    // Neue Zeilen beginnen mit 0; Abzüge sind erlaubt und zählen in der Summe mit (Vorgabe Jakob, 2026-10-11).
    assert.equal(await field(1, "points").inputValue(), "0");
    await field(1, "points").fill("-2");
    assert.equal(await field(1, "points").evaluate(el => el.checkValidity()), true);
    assert.equal(await page.locator("#nagoldSum").innerText(), "1 NAGOLD gesamt");
    await field(1, "points").fill("5");
    await page.locator("#nagoldAddButton").click();
    await field(2, "purpose").fill("Versehentlicher Eintrag");
    await remove(2).click();
    assert.equal(await page.locator("#nagoldRows tr").count(), 2);
    assert.equal(await page.locator("#nagoldSum").innerText(), "8 NAGOLD gesamt");
    assert.equal(await page.locator("#topNagold").innerText(), "8 NAG");
    assert.equal(await page.locator("#topXp").innerText(), "12 XP");
    await page.reload();
    assert.equal(await page.locator("#topNagold").innerText(), "8 NAG");
    await open();
    assert.equal(await page.locator('[data-nagold-option="Startkapital"]').count(), 0);
    assert.equal(await page.locator("#nagoldRows input").count(), 0);
    await page.locator('[data-nagold-index="0"] td:nth-child(3)').dblclick();
    await field(0, "date").fill("2026-10-01");
    await field(0, "time").fill("13:42");
    await field(0, "purpose").fill("Korrigierter Anlass");
    await field(0, "points").fill("2");
    assert.equal(await page.locator("#topNagold").innerText(), "7 NAG");
    await page.locator("#nagoldCloseButton").click();
    await open();
    assert.match(await page.locator('[data-nagold-index="0"]').innerText(), /01\.10\.2026/);
    assert.match(await page.locator('[data-nagold-index="0"]').innerText(), /13:42/);
    await remove(0).click();
    await page.keyboard.press("Escape");
    assert.ok(await page.locator("#profileDialog").isVisible());
    assert.ok(await page.locator("#nagoldTotal").evaluate(el => el === document.activeElement));
    assert.equal(await page.locator("#topNagold").innerText(), "5 NAG", "Deletion persists on Escape");
    await open();
    assert.equal(await page.locator("#nagoldRows tr").count(), 1);
    await page.locator('[data-nagold-edit="0"]').focus();
    await page.keyboard.press("Enter");
    await field(0, "purpose").fill("");
    await page.locator("#nagoldCloseButton").click();
    await open();
    assert.match(await page.locator('[data-nagold-index="0"]').innerText(), /Eigener Arbeitsauftrag/);
    await page.locator("#nagoldCloseButton").click();
    assert.equal(await page.locator("#topNagold").innerText(), "5 NAG");
    await page.keyboard.press("Escape");
    await page.locator("#backupButton").click();
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    const download = await downloadPromise;
    const payload = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
    assert.equal(payload.formatVersion, 9);
    assert.equal(payload.summary.nagold, 5);
    assert.equal(payload.data.nagoldStartCapitalClaimed, true);
    assert.deepEqual(payload.data.nagoldEntries, [{ date: today, time: secondTime, purpose: "Eigener Arbeitsauftrag", points: 5 }]);
    await page.keyboard.press("Escape");
    await open();
    await remove(0).click();
    await page.reload();
    assert.equal(await page.locator("#topNagold").innerText(), "0 NAG");
    await open();
    assert.equal(await page.locator('[data-nagold-option="Startkapital"]').count(), 0, "Deleting rows and reload do not reset the claim");
    await field(0, "purpose").fill("Startkapital");
    await field(0, "points").fill("5");
    assert.equal(await page.locator("#topNagold").innerText(), "0 NAG");
    assert.match(await page.locator("#nagoldError").innerText(), /bereits einmal/);
    await page.reload();
    await page.locator("#backupButton").click();
    page.once("dialog", dialog => dialog.accept());
    await page.locator("#progressFileInput").setInputFiles({ name: "nagold-test.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
    await page.waitForFunction(() => document.querySelector("#topNagold").textContent === "5 NAG");
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).nagoldStartCapitalClaimed), true);
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
        for (const selector of ["#nagoldAddButton", "#nagoldCloseButton", '[data-nagold-field="date"]', '[data-nagold-field="time"]', '[data-nagold-field="purpose"]', '[data-nagold-field="points"]', "[data-nagold-remove]"]) {
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
    await page.locator("#nagoldCloseButton").click();
    await open();
    assert.equal(await page.locator("#nagoldRows img").count(), 0);
    assert.equal(await page.evaluate(() => Boolean(window.nagoldInjected)), false);
    const blocked = await context.newPage();
    await blocked.addInitScript(() => {
      Storage.prototype.setItem = () => { throw new DOMException("Storage blocked", "QuotaExceededError"); };
    });
    await blocked.goto(base + "#home");
    await blocked.locator("#editProfileButton").click();
    await blocked.locator("#nagoldTotal").click();
    await blocked.locator("#nagoldAddButton").click();
    await blocked.locator('#nagoldRows tr:last-child [data-nagold-field="purpose"]').fill("Anwesenheit");
    assert.match(await blocked.locator("#nagoldError").innerText(), /Browserspeicher nicht verfügbar/);
    await blocked.close();
    assert.deepEqual(errors, []);
    console.log("PASS: NAGOLD autosave, attendance/start capital, validation with last-valid fallback, immediate deletion, close/Esc/reload, blocked-storage warning, backup/import/teacher total, safe text, dark/light desktop and 360/320 large font.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
