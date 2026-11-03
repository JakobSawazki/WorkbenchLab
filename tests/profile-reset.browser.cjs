const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require("playwright");
const artifacts = require("./artifacts.cjs")("profile-reset");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const [width, theme] of [[1440, "dark"], [360, "dark"], [360, "light"]]) {
      const context = await browser.newContext({ viewport: { width, height: 950 } });
      await context.addInitScript(({ theme }) => {
        if (localStorage.getItem("reset-test-seeded")) return;
        localStorage.setItem("reset-test-seeded", "unrelated data");
        localStorage.setItem("workbenchlab-theme-v1", theme);
        localStorage.setItem("workbenchlab-v1", JSON.stringify({
          name: "TST.QAA", className: "TEST", generalNotes: "Keep until confirmed",
          lessonNotes: { "warum-datenbanken": "My notes" },
          completedLessons: ["warum-datenbanken"], completedPractices: ["sql-projection"],
          nagoldStartCapitalClaimed: true,
          nagoldEntries: [{ id: "manual-test", date: "2026-10-20", time: "09:00", purpose: "Startkapital", points: 5 }],
          drafts: { "sql-projection": "SELECT 1;" }
        }));
        for (const key of ["workbenchlab-erm-v1", "workbenchlab-review-v1", "workbenchlab-exam-v1", "workbenchlab-v1-rettung"]) {
          localStorage.setItem(key, JSON.stringify({ test: "learner data" }));
        }
        localStorage.setItem("workbenchlab-auto-download-v1", "true");
        sessionStorage.setItem("workbenchlab-profile-seen", "1");
      }, { theme });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${base}#lesson/warum-datenbanken`);
      await page.locator("#appearanceButton").click();
      await page.locator('[data-font-size="20"]').click();
      await page.locator("#appearanceDoneButton").click();
      await page.locator("#backupButton").click();
      assert.ok(await page.locator("#profileResetButton").isHidden());
      // A synthetic click cannot bypass the developer-mode guard.
      await page.locator("#profileResetButton").dispatchEvent("click");
      assert.ok(await page.locator("#profileResetDialog").isHidden());
      await page.locator("#backupCloseButton").click();
      await page.locator("#editProfileButton").click();
      await page.keyboard.press("Control+Alt+s");
      await page.locator("#developerModeButton").click();
      await page.locator("#profileCancelButton").click();
      await page.locator("#backupButton").click();
      await page.locator("#profileResetButton").click();
      const dialog = page.locator("#profileResetDialog");
      await dialog.waitFor();
      assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "Abbrechen");
      assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1));
      await dialog.screenshot({ path: path.join(artifacts, `${theme}-${width}.png`) });
      const original = await page.evaluate(() => ({ ...localStorage }));
      await page.keyboard.press("Escape");
      assert.deepEqual(await page.evaluate(() => ({ ...localStorage })), original);
      assert.equal(await page.evaluate(() => document.activeElement.id), "profileResetButton");
      await page.locator("#profileResetButton").click();
      for (let step = 0; step < 8; step += 1) {
        await page.keyboard.press("Tab");
        assert.ok(await page.evaluate(() => document.activeElement === document.body || document.activeElement.closest("#profileResetDialog")));
      }
      await dialog.getByRole("button", { name: "Abbrechen", exact: true }).click();
      assert.deepEqual(await page.evaluate(() => ({ ...localStorage })), original);

      // Storage failure after partial removal: restore removed keys, keep the profile open.
      await page.locator("#profileResetButton").click();
      await page.evaluate(() => {
        window.originalRemoveItem = Storage.prototype.removeItem;
        Storage.prototype.removeItem = function(key) {
          if (key === "workbenchlab-review-v1") throw new Error("Test: denied");
          return window.originalRemoveItem.call(this, key);
        };
      });
      await page.locator("#profileResetConfirm").click();
      await page.locator("#profileResetError").waitFor();
      assert.deepEqual(await page.evaluate(() => ({ ...localStorage })), original);
      assert.equal(await page.evaluate(() => sessionStorage.getItem("workbenchlab-developer-v1")), "active");
      await page.evaluate(() => { Storage.prototype.removeItem = window.originalRemoveItem; });
      await dialog.getByRole("button", { name: "Abbrechen", exact: true }).click();
      await page.locator("#profileResetButton").click();
      const device = await page.evaluate(() => localStorage.getItem("workbenchlab-device-v1"));
      const appearance = await page.evaluate(() => localStorage.getItem("workbenchlab-appearance-v1"));
      const secondTab = await context.newPage();
      await secondTab.goto(`${base}#home`);
      await secondTab.locator("#topProfileName").filter({ hasText: "TST.QAA" }).waitFor();
      await page.locator("#profileResetConfirm").click();
      await page.locator("#profileDialog").waitFor({ state: "visible" });
      await secondTab.locator("#profileDialog").waitFor({ state: "visible" });
      assert.equal(await secondTab.locator("#profileName").inputValue(), "");
      await secondTab.close();
      assert.equal(new URL(page.url()).hash, "#home");
      assert.equal(await page.locator("#profileName").inputValue(), "");
      assert.equal(await page.locator("#profileClass").inputValue(), "");
      const stored = await page.evaluate(() => ({ ...localStorage }));
      const fresh = JSON.parse(stored["workbenchlab-v1"]);
      assert.equal(fresh.name, "");
      assert.equal(fresh.generalNotes, "");
      for (const key of ["lessonNotes", "noteDrawings", "noteTextStyles", "lessonComments", "lessonHighlights", "lessonWorksheets", "drafts", "slotDrafts", "completedModels"]) assert.deepEqual(fresh[key], {}, key);
      for (const key of ["nagoldEntries", "completedLessons", "completedPractices", "transferHistory"]) assert.deepEqual(fresh[key], [], key);
      assert.equal(fresh.nagoldStartCapitalClaimed, false);
      assert.equal(fresh.profileId, "");
      for (const key of ["workbenchlab-erm-v1", "workbenchlab-review-v1", "workbenchlab-exam-v1", "workbenchlab-v1-rettung", "workbenchlab-auto-download-v1"]) assert.equal(stored[key], undefined, key);
      assert.equal(stored["reset-test-seeded"], "unrelated data");
      assert.equal(stored["workbenchlab-device-v1"], device);
      assert.equal(stored["workbenchlab-theme-v1"], theme);
      assert.equal(stored["workbenchlab-appearance-v1"], appearance);
      assert.equal(await page.evaluate(() => sessionStorage.getItem("workbenchlab-developer-v1")), null);
      await page.locator("#profileName").fill("NEU.TST");
      await page.locator("#profileClass").fill("BK2-2");
      await page.locator('#profileForm [type="submit"]').click();
      await page.reload();
      await page.locator("#topProfileName").filter({ hasText: "NEU.TST" }).waitFor();
      assert.equal(await page.locator("#topXp").innerText(), "0 XP");
      await page.locator("#backupButton").click();
      assert.ok(await page.locator("#profileResetButton").isHidden());
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: developer-only full learner reset, confirmation/cancel/Escape, storage rollback, new profile persists, unrelated settings retained, desktop/mobile large font dark/light.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
