const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const output = require("./artifacts.cjs")("teacher-reviews");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4199/";
const storageKey = "workbenchlab-teacher-reviews-v1";
const lessonId = "warum-datenbanken";
const entries = [
  { date: "2026-10-09", time: "09:00", purpose: "L1.1", points: 5, lessonId },
  { date: "2026-10-09", time: "09:05", purpose: "Mitarbeit <script>bad()</script>", points: 2 }
];
const backup = (overrides = {}) => ({ app: "WorkbenchLab", formatVersion: 7,
  identity: { studentCode: "TST.QAA", studentClass: "TEST", profileId: "teacher-test" },
  exportedAt: "2026-10-09T10:00:00Z", data: { completedLessons: [lessonId], nagoldEntries: entries }, ...overrides });
const file = (data, name = "student.json") => ({ name, mimeType: "application/json", buffer: Buffer.from(JSON.stringify(data)) });

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const theme of ["dark", "light"]) {
      const context = await browser.newContext({ viewport: { width: 360, height: 900 }, acceptDownloads: true });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + "lehrkraft.html");
      await page.evaluate((theme) => { document.documentElement.dataset.theme = theme; document.documentElement.style.fontSize = "20px"; }, theme);
      const load = async (value = backup(), name) => {
        await page.locator("#teacherFiles").setInputFiles(file(value, name));
        await page.locator("[data-teacher-review]").first().waitFor();
      };
      const open = () => page.locator("[data-teacher-review]:not([disabled])").first().click();
      await load();
      assert.equal(await page.locator("[data-approved-nagold]").innerText(), "0");
      await open();
      assert.equal(await page.locator("#teacherReviewBody script").count(), 0);
      await page.locator("[data-review-lesson]").check();
      assert.equal(await page.locator('[data-review-entry="0"]').isChecked(), true);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("[data-approved-nagold]").innerText(), "0");
      assert.equal(await page.locator("[data-teacher-review]").evaluate((el) => document.activeElement === el), true);
      await open();
      assert.equal(await page.locator("[data-review-lesson]").isChecked(), false);
      await page.locator("[data-review-lesson]").check();
      await page.locator('[data-review-entry="1"]').check();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const bounds = await page.locator("#teacherReviewDialog").boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 360);
      await page.screenshot({ path: path.join(output, `${theme}-360.png`) });
      await page.locator("#teacherReviewSave").click();
      assert.equal(await page.locator("[data-approved-nagold]").innerText(), "7");
      const saved = await page.evaluate((key) => localStorage.getItem(key), storageKey);
      const wait = page.waitForEvent("download");
      await page.locator("#teacherReviewExport").click();
      const download = await wait;
      const savedFile = path.join(output, `${theme}.json`);
      await download.saveAs(savedFile);
      assert.deepEqual(JSON.parse(fs.readFileSync(savedFile, "utf8")), JSON.parse(saved));
      const csvWait = page.waitForEvent("download");
      await page.locator("#teacherCsv").click();
      const csv = await csvWait;
      const csvFile = path.join(output, `${theme}.csv`);
      await csv.saveAs(csvFile);
      assert.match(fs.readFileSync(csvFile, "utf8"), /"NAGOLD bestätigt"/);
      await page.reload();
      assert.equal(await page.locator(".teacher-table").count(), 0);
      await load();
      assert.equal(await page.locator("[data-approved-nagold]").innerText(), "7");
      const changed = backup({ exportedAt: "2026-10-09T11:00:00Z", data: { completedLessons: [lessonId], nagoldEntries: [entries[0], { ...entries[1], points: 3 }] } });
      await load(changed, "updated.json");
      assert.equal(await page.locator("[data-approved-nagold]").innerText(), "5");
      await page.locator("#teacherClear").click();
      assert.equal(await page.evaluate((key) => localStorage.getItem(key), storageKey), saved);
      await page.locator("#teacherReviewImport").setInputFiles(file(backup(), "not-a-teacher-list.json"));
      await page.getByText(/Liste nicht geladen/).waitFor();
      assert.equal(await page.evaluate((key) => localStorage.getItem(key), storageKey), saved);
      await page.evaluate((key) => localStorage.removeItem(key), storageKey);
      await page.reload();
      await page.locator("#teacherReviewImport").setInputFiles(savedFile);
      await page.getByText("Bestätigungen auf diesem Gerät gespeichert.").waitFor();
      await load();
      assert.equal(await page.locator("[data-approved-nagold]").innerText(), "7");
      assert.deepEqual(errors, []);
      await context.close();
    }
    // A damaged stored assessment must not be overwritten by a new approval.
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(base + "lehrkraft.html");
    await page.evaluate((key) => localStorage.setItem(key, "{broken"), storageKey);
    await page.reload();
    await page.locator("#teacherFiles").setInputFiles(file(backup()));
    await page.locator("[data-teacher-review]").click();
    await page.locator("[data-review-lesson]").check();
    await page.locator("#teacherReviewSave").click();
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), storageKey), "{broken");
    await page.getByText(/unlesbare gespeicherte Liste bleibt erhalten/).waitFor();
    await context.close();
    // Blocked storage still permits file-backed work without a false saved message.
    const blocked = await browser.newContext();
    await blocked.addInitScript(() => { Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new Error("blocked"); }; });
    const blockedPage = await blocked.newPage();
    await blockedPage.goto(base + "lehrkraft.html");
    await blockedPage.locator("#teacherFiles").setInputFiles(file(backup()));
    await blockedPage.locator("[data-teacher-review]").click();
    await blockedPage.locator('[data-review-entry="1"]').check();
    await blockedPage.locator("#teacherReviewSave").click();
    assert.equal(await blockedPage.locator("[data-approved-nagold]").innerText(), "2");
    assert.match(await blockedPage.locator("#teacherReviewStatus").innerText(), /als Datei sichern/);
    await blocked.close();
    console.log("PASS: independent teacher approvals, entry-edit invalidation, unit approval, CSV, persistence, separate backup/import, cancel/focus, safe text, corrupt/blocked storage, light/dark 360px large text.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exit(1); });
