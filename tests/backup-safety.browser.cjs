const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const stable = (value) => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.keys(item).sort().reduce((result, key) => ({ ...result, [key]: item[key] }), {}) : item);
function sign(payload) {
  const { integrity, ...body } = payload;
  payload.integrity.digest = crypto.createHash("sha256").update(stable(body)).digest("hex");
  return payload;
}
(async () => {
  const output = require("./artifacts.cjs")("backup-safety-qa");
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const context = await browser.newContext({ acceptDownloads: true });
    await context.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", generalNotes: "Meine Arbeit bleibt erhalten." }));
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}?screenshot=1#home`);
    await page.locator("#quickSaveButton").click({ button: "right" });
    const initialDownload = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    const originalPath = path.join(output, "original.json");
    await (await initialDownload).saveAs(originalPath);
    const original = JSON.parse(fs.readFileSync(originalPath, "utf8"));
    const before = await page.evaluate(() => localStorage.getItem("workbenchlab-v1"));
    const cases = [
      ["invalid-json", "{"],
      ["foreign-app", JSON.stringify({ ...original, app: "OtherApp" })],
      ["array-data", JSON.stringify({ ...original, data: [] })],
      ["zero-version", JSON.stringify({ ...original, formatVersion: 0 })],
      ["negative-version", JSON.stringify({ ...original, formatVersion: -1 })],
      ["future-version", JSON.stringify({ ...original, formatVersion: 999 })],
      ["missing-checksum", JSON.stringify({ ...original, integrity: null })],
      ["tampered", JSON.stringify({ ...original, data: { ...original.data, generalNotes: "Changed without checksum" } })],
      ["wrong-identity", JSON.stringify(sign({ ...structuredClone(original), identity: { ...original.identity, studentClass: "OTHER" } }))],
      ["modern-class-separator", JSON.stringify(sign({ ...structuredClone(original), identity: { ...original.identity, studentClass: "WGJ1/1" }, data: { ...original.data, className: "WGJ1/1" } }))],
      ["legacy-class-mismatch", JSON.stringify(sign({ ...structuredClone(original), formatVersion: 8, identity: { ...original.identity, studentClass: "WGJ1/1" }, data: { ...original.data, className: "WGJ1_1" } }))],
      ["legacy-class-checksum", JSON.stringify({ ...original, formatVersion: 8, identity: { ...original.identity, studentClass: "WGJ1/1" }, data: { ...original.data, className: "WGJ1/1" } })]
    ];
    for (const [name, contents] of cases) {
      await page.locator("#progressFileInput").setInputFiles({ name: `${name}.json`, mimeType: "application/json", buffer: Buffer.from(contents) });
      await page.locator("#backupStatus.is-error").waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1")), before, name);
      assert.equal(await page.locator("#progressFileInput").inputValue(), "");
      assert.equal(await page.locator("#importProgressButton").isDisabled(), false);
    }
    await page.locator("#progressFileInput").setInputFiles({ name: "oversize.json", mimeType: "application/json", buffer: Buffer.alloc(25 * 1024 * 1024 + 1, 32) });
    assert.ok((await page.locator("#backupStatus").innerText()).includes("zu groß"));
    assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1")), before);
    page.once("dialog", (dialog) => dialog.dismiss());
    await page.locator("#progressFileInput").setInputFiles(originalPath);
    await page.waitForFunction(() => document.querySelector("#backupStatus").textContent === "Laden abgebrochen.");
    assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1")), before);
    const ids = await page.evaluate(() => ({ practices: window.WORKBENCH_CONTENT.practices.map((item) => item.id), lessons: window.WORKBENCH_CONTENT.lessons.map((item) => item.id) }));
    const large = structuredClone(original);
    large.data.drafts = Object.fromEntries(ids.practices.slice(0, 10).map((id) => [id, "ä".repeat(100000)]));
    large.data.noteDrawings = Object.fromEntries(ids.lessons.slice(0, 6).map((id) => [id, Array.from({ length: 8 }, () => ({ tool: "pen", color: "#17212b", width: 5, points: Array.from({ length: 1000 }, () => [0.1111, 0.2222]) }))]));
    const largePath = path.join(output, "large.json");
    fs.writeFileSync(largePath, JSON.stringify(sign(large)));
    assert.ok(fs.statSync(largePath).size > 2_000_000);
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#progressFileInput").setInputFiles(largePath);
    await page.locator("#backupDialog").waitFor({ state: "hidden" });
    await page.locator("#quickSaveButton").click({ button: "right" });
    const largeDownload = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    const roundtripPath = path.join(output, "large-roundtrip.json");
    await (await largeDownload).saveAs(roundtripPath);
    const roundtrip = JSON.parse(fs.readFileSync(roundtripPath, "utf8"));
    assert.deepEqual(roundtrip.data.drafts, large.data.drafts);
    assert.deepEqual(roundtrip.data.noteDrawings, large.data.noteDrawings);
    assert.equal(roundtrip.data.generalNotes, original.data.generalNotes);
    assert.equal(roundtrip.integrity.digest, sign(structuredClone(roundtrip)).integrity.digest);
    await page.locator("#backupCloseButton").click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#quickSaveButton").click({ button: "right" });
    await page.locator("#progressFileInput").setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from("{") });
    await page.locator("#backupStatus.is-error").waitFor();
    assert.ok(await page.locator("#backupDialog").evaluate((el) => el.scrollWidth <= el.clientWidth + 1));
    await page.screenshot({ path: path.join(output, "import-error-mobile.png"), animations: "disabled" });
    // Synthetic regression fixture, never the real student's personal backup.
    const legacy = sign({ ...structuredClone(original), formatVersion: 8,
      identity: { ...original.identity, studentClass: "WGJ1/1" },
      data: { ...original.data, className: "WGJ1/1", completedLessons: ["warum-datenbanken"], completedPractices: ["db-benefit-choice"],
        lessonNotes: { "warum-datenbanken": "Meine alten Notizen" },
        nagoldEntries: [
          { date: "2026-10-06", time: "11:10", purpose: "Startkapital", points: 5 },
          { date: "2026-10-13", time: "11:11", purpose: "Anwesenheit", points: 2 },
          { date: "2026-10-13", time: "11:16", purpose: "Mitarbeit", points: 2 },
          { date: "2026-10-06", time: "11:18", purpose: "Zusatzaufgabe", points: 3 },
          { date: "2026-10-13", time: "12:27", purpose: "L1.1", points: 5, lessonId: "warum-datenbanken" }
        ] }
    });
    page.once("dialog", dialog => dialog.dismiss());
    const legacyFile = { name: "legacy-class.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(legacy)) };
    const beforeLegacy = await page.evaluate(() => localStorage.getItem("workbenchlab-v1"));
    await page.locator("#progressFileInput").setInputFiles(legacyFile);
    await page.waitForFunction(() => document.querySelector("#backupStatus").textContent === "Laden abgebrochen.");
    assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1")), beforeLegacy);
    page.once("dialog", dialog => dialog.accept());
    await page.locator("#progressFileInput").setInputFiles(legacyFile);
    await page.locator("#backupDialog").waitFor({ state: "hidden" });
    await page.reload();
    assert.equal(await page.locator("#topXp").innerText(), "65 XP");
    assert.equal(await page.locator("#topNagold").innerText(), "17 EP");
    assert.equal(await page.locator("#topProfileClass").innerText(), "WGJ11");
    await page.locator("#quickSaveButton").click({ button: "right" });
    const legacyDownload = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    const repaired = JSON.parse(fs.readFileSync(await (await legacyDownload).path(), "utf8"));
    assert.deepEqual(repaired.data.nagoldEntries, legacy.data.nagoldEntries);
    assert.deepEqual(repaired.data.lessonNotes, legacy.data.lessonNotes);
    assert.equal(repaired.identity.studentClass, repaired.data.className);
    assert.equal(repaired.integrity.digest, sign(structuredClone(repaired)).integrity.digest);
    const unavailable = await browser.newContext();
    await unavailable.addInitScript(() => {
      localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", generalNotes: "Nicht verlieren." }));
      Object.defineProperty(crypto, "subtle", { value: undefined });
    });
    const unsupported = await unavailable.newPage();
    unsupported.on("pageerror", (error) => errors.push(error.message));
    await unsupported.goto(`${base}?screenshot=1#home`);
    await unsupported.locator("#quickSaveButton").click({ button: "right" });
    await unsupported.locator("#exportProgressButton").click();
    await unsupported.locator("#backupStatus.is-error").waitFor();
    assert.ok((await unsupported.locator("#backupStatus").innerText()).includes("Speichern nicht möglich"));
    assert.equal(await unsupported.locator("#exportProgressButton").isDisabled(), false);
    assert.equal(await unsupported.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).generalNotes), "Nicht verlieren.");
    assert.deepEqual(errors, []);
    await unavailable.close();
    await context.close();
    console.log("PASS: twelve invalid imports, verified legacy class migration with 65 XP/17 EP and notes after reload/export, cancel preservation, oversized file, >2 MB roundtrip, checksum, mobile feedback, unsupported crypto.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
