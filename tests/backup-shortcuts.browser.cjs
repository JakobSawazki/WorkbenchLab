const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const output = require("./artifacts.cjs")("backup-shortcuts");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 920, 360, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 950 }, acceptDownloads: true });
      await context.addInitScript(() => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "BK2-2", generalNotes: "Gesicherter Teststand" }));
        localStorage.setItem("workbenchlab-appearance-v1", JSON.stringify({ fontSize: 20, palettes: {} }));
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(base + "#home");
      const save = page.getByRole("button", { name: "Lernstand speichern", exact: true });
      const open = page.getByRole("button", { name: "Lernstand öffnen", exact: true });
      const manager = page.getByRole("button", { name: "Sicherungen verwalten", exact: true });
      const dialog = page.locator("#backupDialog");
      assert.equal(await save.getAttribute("aria-keyshortcuts"), "Alt+S");
      assert.equal(await open.getAttribute("aria-keyshortcuts"), "Alt+O");
      for (const button of [save, open, manager]) {
        const bounds = await button.boundingBox();
        assert.ok(bounds.width >= 40 && bounds.height >= 40 && bounds.x >= 0 && bounds.x + bounds.width <= width + 1);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.locator(".topbar").screenshot({ path: path.join(output, `toolbar-${width}.png`) });

      const saveWith = async action => {
        const pending = page.waitForEvent("download");
        await action();
        const download = await pending;
        assert.match(download.suggestedFilename(), /^workbenchlab-BK2-2-TST\.QAA-/);
        assert.ok(await dialog.isHidden());
        const bytes = fs.readFileSync(await download.path());
        assert.equal(JSON.parse(bytes).data.generalNotes, "Gesicherter Teststand");
        return bytes;
      };
      const bytes = await saveWith(() => save.click());
      await saveWith(() => page.keyboard.press("Alt+s"));
      await page.evaluate(() => {
        const key = "workbenchlab-v1";
        const state = JSON.parse(localStorage.getItem(key));
        state.generalNotes = "Aktueller Teststand";
        localStorage.setItem(key, JSON.stringify(state));
      });
      await page.reload();
      const choose = async (action, buffer, accept) => {
        const pending = page.waitForEvent("filechooser");
        await action();
        const chooser = await pending;
        assert.ok(await dialog.isHidden());
        if (accept !== undefined) page.once("dialog", prompt => accept ? prompt.accept() : prompt.dismiss());
        await chooser.setFiles({ name: "test-backup.json", mimeType: "application/json", buffer });
      };
      const notes = () => page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).generalNotes);
      await choose(() => open.click(), bytes, false);
      await page.waitForFunction(() => document.querySelector("#backupStatus").textContent === "Laden abgebrochen.");
      assert.equal(await notes(), "Aktueller Teststand");
      await choose(() => page.keyboard.press("Alt+o"), bytes, true);
      await page.getByText("Lernstand erfolgreich geladen", { exact: true }).waitFor();
      assert.equal(await notes(), "Gesicherter Teststand");
      await choose(() => open.click(), Buffer.from("{"));
      await page.locator("#toastRegion .is-error").filter({ hasText: "keine lesbare JSON-Sicherung" }).waitFor();
      assert.equal(await notes(), "Gesicherter Teststand");
      await manager.click();
      assert.ok(await dialog.isVisible());
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: direct download and file picker with buttons and Alt+S/Alt+O, import confirmation, invalid file feedback, manager retained, 320-1440px large font.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
