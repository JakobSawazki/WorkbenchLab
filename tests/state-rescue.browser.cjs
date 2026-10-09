// Claude, OPT-21: Ein unlesbarer Lernstand wird nie still verworfen.
const artifacts = require("node:path").join(require("node:os").tmpdir(), "workbenchlab-tests");
require("node:fs").mkdirSync(artifacts, { recursive: true });
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      const broken = '{"name":"TST.QAA","className":"TEST","completedCommands":["cmd-select"]';
      const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
      await context.addInitScript((raw) => {
        if (!sessionStorage.getItem("seeded")) {
          sessionStorage.setItem("seeded", "1");
          localStorage.setItem("workbenchlab-v1", raw);
        }
      }, broken);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + "#home");
      const notice = page.locator("#stateRescueNotice");
      await notice.waitFor();
      assert.match(await notice.innerText(), /konnte nicht gelesen werden/);
      assert.equal(await notice.getAttribute("role"), "alert");

      // Rohdaten bleiben unverändert als Rettungskopie erhalten; kein Profildialog überdeckt die Meldung.
      const rescue = await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1-rettung")));
      assert.equal(rescue.raw, broken);
      assert.match(rescue.savedAt, /^\d{4}-\d{2}-\d{2}T/);
      await page.waitForTimeout(600);
      assert.ok(await page.locator("#profileDialog").isHidden());

      // Die Meldung verschwindet nicht von selbst und läuft nicht aus dem Bild.
      await page.waitForTimeout(3600);
      assert.ok(await notice.isVisible());
      const box = await notice.boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= width + 1, `Meldung außerhalb bei ${width}px`);

      const [download] = await Promise.all([page.waitForEvent("download"), page.locator("[data-rescue-download]").click()]);
      assert.equal(download.suggestedFilename(), "workbenchlab-rettungskopie.json");
      await page.screenshot({ path: `${artifacts}/state-rescue-${width}.png`, animations: "disabled" });
      await page.locator("[data-rescue-close]").click();
      assert.equal(await notice.count(), 0);

      // Weiterarbeiten überschreibt die Rettungskopie nicht.
      await page.goto(base + "#sql/frei");
      await page.locator("#sqlEditor").fill("SELECT 1;");
      await page.reload();
      assert.equal(await page.locator("#stateRescueNotice").count(), 0);
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1-rettung")).raw), broken);
      assert.deepEqual(errors, []);
      await context.close();
    }

    // Eine volle Quota kann die Kopie verhindern, obwohl das kleinere Ersatzobjekt noch passen würde.
    for (const width of [1440, 390]) {
      const broken = '{"name":"NEW.RAW","completedLessons":[';
      const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
      await context.addInitScript(({ raw, oldCopy }) => {
        const setItem = Storage.prototype.setItem;
        if (!sessionStorage.getItem("seeded")) {
          sessionStorage.setItem("seeded", "1");
          localStorage.setItem("workbenchlab-v1", raw);
          if (oldCopy) localStorage.setItem("workbenchlab-v1-rettung", JSON.stringify({ raw: "older rescue" }));
        }
        Storage.prototype.setItem = function (key, value) {
          if (this === localStorage && key === "workbenchlab-v1-rettung") {
            throw new DOMException("Quota exceeded", "QuotaExceededError");
          }
          return setItem.call(this, key, value);
        };
      }, { raw: broken, oldCopy: width === 1440 });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + "#home");
      await page.locator("#stateRescueNotice").waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1")), broken,
        "Without a saved rescue copy, startup must not overwrite the original");
      assert.match(await page.locator("#stateRescueNotice").innerText(), /nicht im Browser gespeichert/);
      const box = await page.locator("#stateRescueNotice").boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= width + 1, `Quota notice outside ${width}px`);
      const [download] = await Promise.all([page.waitForEvent("download"), page.locator("[data-rescue-download]").click()]);
      const rescue = JSON.parse(require("node:fs").readFileSync(await download.path(), "utf8"));
      assert.equal(rescue.raw, broken, "Download must contain this session's raw data, not an older rescue");
      await page.locator("[data-rescue-close]").click();
      await page.goto(base + "#sql/frei");
      await page.locator("#sqlEditor").fill("SELECT 1;");
      await page.waitForTimeout(800);
      assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1")), broken,
        "Later saves must preserve the original too");
      await page.reload();
      await page.locator("#stateRescueNotice").waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1")), broken);
      await page.locator("[data-rescue-close]").click();
      await page.locator("#backupButton").click();
      assert.ok(await page.locator("#backupStorageHint").isVisible());
      // Only a valid, explicitly confirmed import may replace the protected original.
      const backupFile = {
        name: "valid-backup.json", mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify({ app: "WorkbenchLab", formatVersion: 1,
          data: { name: "TST.QAA", className: "TEST", completedCommands: ["cmd-select"] } }))
      };
      page.once("dialog", (dialog) => dialog.dismiss());
      await page.locator("#progressFileInput").setInputFiles(backupFile);
      await page.waitForFunction(() => document.querySelector("#backupStatus").textContent.includes("abgebrochen"));
      assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1")), broken);
      page.once("dialog", (dialog) => dialog.accept());
      await page.locator("#progressFileInput").setInputFiles(backupFile);
      await page.waitForFunction(() => !document.querySelector("#backupDialog").open);
      assert.equal(await page.locator("#topXp").innerText(), "12 XP");
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).name), "TST.QAA");
      await page.reload();
      assert.equal(await page.locator("#stateRescueNotice").count(), 0);
      assert.equal(await page.locator("#topXp").innerText(), "12 XP");
      assert.deepEqual(errors, []);
      await context.close();
    }

    // Gegenprobe: Ein gültiger Lernstand erzeugt weder Meldung noch Rettungskopie.
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedCommands: ["cmd-select"] }));
    });
    const page = await context.newPage();
    await page.goto(base + "#home");
    await page.locator("#runtimeChip.is-ready").waitFor();
    assert.equal(await page.locator("#stateRescueNotice").count(), 0);
    assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1-rettung")), null);
    assert.equal(await page.locator("#topXp").innerText(), "12 XP");
    console.log("PASS: unreadable progress keeps raw rescue copy; failed rescue writes preserve originals through startup, saves and reload; current raw download with/without older copy; cancel preserves data, confirmed import restores saving; valid progress untouched, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
