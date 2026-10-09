// Claude, OPT-21: Ein unlesbarer Lernstand wird nie still verworfen.
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
      await page.screenshot({ path: `.tmp/state-rescue-${width}.png`, animations: "disabled" });
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
    console.log("PASS: unreadable progress keeps raw rescue copy, persistent alert, download, no silent overwrite, valid progress untouched, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
