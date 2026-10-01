const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { chromium } = require("playwright");

const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const output = path.join(__dirname, "..", ".tmp", "study-qa");
const stable = (value) => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.keys(item).sort().reduce((result, key) => ({ ...result, [key]: item[key] }), {}) : item);

async function selectText(page, selector, start = 0, end) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.evaluate(({ selector, start, end }) => {
    const block = document.querySelector(selector);
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let offset = 0;
    while (walker.nextNode()) {
      nodes.push({ node: walker.currentNode, start: offset });
      offset += walker.currentNode.length;
    }
    const last = end ?? offset;
    const from = nodes.find((entry) => entry.start + entry.node.length > start);
    const to = nodes.find((entry) => entry.start + entry.node.length >= last);
    const range = document.createRange();
    range.setStart(from.node, start - from.start);
    range.setEnd(to.node, last - to.start);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
  }, { selector, start, end });
}

async function verifyExport(download, name) {
  const file = path.join(output, name);
  await download.saveAs(file);
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  const { integrity, ...body } = payload;
  assert.equal(integrity.digest, crypto.createHash("sha256").update(stable(body)).digest("hex"));
  return { file, payload };
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.WORKBENCH_TEST_BROWSER || (process.platform === "win32" ? "msedge" : undefined) });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    await context.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}?screenshot=1#home`);
    await page.locator(".model-glossary").waitFor();
    assert.ok((await page.locator(".model-glossary").innerText()).includes("erweitertes Entity-Relationship-Modell"));
    assert.equal(await page.locator(".path-overview").evaluate((element) => element.open), false);
    await page.screenshot({ path: path.join(output, "home-desktop.png") });
    await page.locator('#mobileMenuButton').click();
    assert.equal(await page.locator("#sidebar").isVisible(), false);
    await page.reload();
    assert.equal(await page.locator("#sidebar").isVisible(), false);
    await page.locator('#mobileMenuButton').click();
    assert.equal(await page.locator("#sidebar").isVisible(), true);
    await page.goto(`${base}?screenshot=1#path`);
    assert.ok((await page.locator(".module-block").evaluateAll((elements) => elements.map((element) => element.open))).every((open) => !open));
    await page.locator("#lernfortschritt-1 > summary").click();
    await page.locator('#lernfortschritt-1 [data-lesson="relation-und-schluessel"]').click({ force: true });
    assert.ok(page.url().endsWith("#path"));
    await page.locator('#lernfortschritt-1 [data-lesson="warum-datenbanken"]').click();
    await page.locator('[data-lesson-reading]').waitFor();
    assert.equal(await page.locator(".lesson-workflow").isVisible(), false);
    const type = page.locator('[data-worksheet-row="0"][data-worksheet-field="type"]');
    const length = page.locator('[data-worksheet-row="0"][data-worksheet-field="length"]');
    await type.selectOption("INT");
    assert.equal(await length.inputValue(), "4 Byte");
    await length.fill("4 Bytes");
    await page.reload();
    assert.equal(await length.inputValue(), "4 Bytes");
    await type.selectOption("DATE");
    assert.equal(await length.inputValue(), "3 Byte");
    await type.selectOption("VARCHAR");
    await length.fill("45");
    assert.equal(await length.inputValue(), "45");
    console.log("PASS: collapsed path, sidebar preference, worksheet datatypes.");

    const block = '[data-highlight-block="section-2-rule-0"]';
    const text = await page.locator(block).textContent();
    await selectText(page, block);
    await page.getByRole("button", { name: "Gelb markieren", exact: true }).click();
    assert.ok(await page.locator(`${block} mark`).count() > 0);
    assert.equal(await page.locator(block).textContent(), text);
    await selectText(page, block, 0, 12);
    await page.getByRole("button", { name: "Mint markieren", exact: true }).click();
    assert.ok(await page.locator(`${block} mark[data-study-mark="mint"]`).count() > 0);
    await selectText(page, block, 0, 4);
    await page.getByRole("button", { name: "Markierung im ausgewählten Text entfernen", exact: true }).click();
    assert.equal(await page.locator(block).textContent(), text);
    await page.reload();
    assert.ok(await page.locator(`${block} mark`).count() > 0);
    await page.evaluate(() => {
      const first = document.querySelector('[data-highlight-block="section-0-paragraph-0"]');
      const second = document.querySelector('[data-highlight-block="section-0-paragraph-1"]');
      const range = document.createRange();
      range.setStart(first.firstChild, 10);
      range.setEnd(second.firstChild, 20);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.dispatchEvent(new Event("selectionchange"));
    });
    await page.getByRole("button", { name: "Koralle markieren", exact: true }).click();
    assert.equal(await page.locator('p[data-highlight-block] mark[data-study-mark="coral"]').count(), 2);
    console.log("PASS: marking, recoloring, erasing and reloading inline-code content.");
    await page.locator("#lessonNotes").fill("Mein Primärschlüssel identifiziert jeden Datensatz.");
    await page.goto(`${base}?screenshot=1#notes/warum-datenbanken`);
    assert.equal(await page.locator("#notebookEditor").inputValue(), "Mein Primärschlüssel identifiziert jeden Datensatz.");
    await page.locator("#notebookEditor").fill("Meine Zusammenfassung <script>window.bad=true</script>");
    await page.reload();
    assert.equal(await page.evaluate(() => Boolean(window.bad)), false);
    assert.ok((await page.locator("#notebookEditor").inputValue()).includes("<script>"));
    await page.locator('[data-note-tool="list"]').click();
    await page.goto(`${base}?screenshot=1#notes/general`);
    await page.locator("#notebookEditor").fill("BPE6: Offene Fragen und meine Merksätze.");
    await page.locator("#notebookSearch").fill("Zusammenfassung");
    assert.ok(await page.locator(".notebook-topic:not([hidden])").count() > 0);
    await page.locator("#notebookSearch").fill("unfindbarer-testbegriff");
    assert.equal(await page.locator("#notebookSearchEmpty").isVisible(), true);
    await page.locator("#notebookSearch").fill("");
    await page.screenshot({ path: path.join(output, "notes-desktop.png") });
    console.log("PASS: notebook synchronization and search.");

    const downloaded = page.waitForEvent("download");
    await page.locator("#backupButton").click();
    await page.locator("#exportProgressButton").click();
    const exported = await verifyExport(await downloaded, "study-export.json");
    assert.equal(exported.payload.formatVersion, 5);
    assert.equal(exported.payload.data.generalNotes, "BPE6: Offene Fragen und meine Merksätze.");
    assert.ok(exported.payload.data.lessonHighlights["warum-datenbanken"].length > 0);
    assert.equal(exported.payload.data.lessonWorksheets["warum-datenbanken"].rows[0].length, "45");
    await page.locator("#backupCloseButton").click();
    await page.locator("#notebookEditor").fill("Temporärer Stand vor Import.");
    await page.locator("#backupButton").click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#progressFileInput").setInputFiles(exported.file);
    await page.locator("#backupDialog").waitFor({ state: "hidden" });
    assert.equal(await page.locator("#notebookEditor").inputValue(), "BPE6: Offene Fragen und meine Merksätze.");

    await page.locator("#backupButton").click();
    await page.locator("#autoDownloadBackup").check();
    await page.locator("#backupCloseButton").click();
    await page.goto(`${base}?screenshot=1#lesson/warum-datenbanken`);
    const correct = await page.evaluate(() => window.WORKBENCH_CONTENT.lessons.find((lesson) => lesson.id === "warum-datenbanken").quiz.correct);
    await page.locator(`input[name="quizAnswer"][value="${correct}"]`).check();
    await page.locator('#quizForm button[type="submit"]').click();
    for (const check of await page.locator("[data-lesson-check], [data-lesson-teacher]").all()) await check.check();
    const automatic = page.waitForEvent("download");
    await page.locator("[data-complete-lesson]").click();
    const automaticExport = await verifyExport(await automatic, "study-auto-export.json");
    assert.ok(automaticExport.payload.data.completedLessons.includes("warum-datenbanken"));
    assert.equal(automaticExport.payload.summary.xp, 40);
    await page.screenshot({ path: path.join(output, "lesson-desktop.png") });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}?screenshot=1#notes/general`);
    await page.getByRole("heading", { name: "Meine Notizen", exact: true, level: 1 }).waitFor();
    assert.equal(await page.locator(".notebook-index").evaluate((element) => element.open), false);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.waitForFunction(() => !document.querySelector(".toast-region").children.length);
    await page.screenshot({ path: path.join(output, "notes-mobile.png"), animations: "disabled" });
    await page.locator("#mobileMenuButton").click();
    assert.equal(await page.locator("#mobileMenuButton").getAttribute("aria-expanded"), "true");
    await page.locator('#sidebar [data-route="path"]').click();
    await page.getByRole("heading", { name: "Lernpfad", exact: true, level: 1 }).waitFor();
    assert.equal(await page.locator("#mobileMenuButton").getAttribute("aria-expanded"), "false");
    await page.screenshot({ path: path.join(output, "path-mobile.png"), animations: "disabled" });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.goto(`${base}?screenshot=1#lesson/warum-datenbanken`);
    await page.locator("[data-lesson-reading]").waitFor();
    await page.screenshot({ path: path.join(output, "lesson-mobile.png"), animations: "disabled" });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const legacy = structuredClone(exported.payload);
    legacy.formatVersion = 3;
    delete legacy.data.generalNotes;
    delete legacy.data.lessonHighlights;
    const { integrity: legacyIntegrity, ...legacyBody } = legacy;
    legacy.integrity.digest = crypto.createHash("sha256").update(stable(legacyBody)).digest("hex");
    const legacyFile = path.join(output, "legacy-v3.json");
    fs.writeFileSync(legacyFile, JSON.stringify(legacy));
    await page.goto(`${base}?screenshot=1#notes/general`);
    await page.locator("#backupButton").click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#progressFileInput").setInputFiles(legacyFile);
    await page.locator("#backupDialog").waitFor({ state: "hidden" });
    assert.equal(await page.locator("#notebookEditor").inputValue(), "");
    await page.goto(`${base}?screenshot=1#notes/warum-datenbanken`);
    assert.ok((await page.locator("#notebookEditor").inputValue()).includes("Meine Zusammenfassung"));
    assert.deepEqual(errors, []);
    await context.close();

    const unavailable = await browser.newContext();
    await unavailable.addInitScript(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === "workbenchlab-v1") throw new DOMException("Quota exceeded", "QuotaExceededError");
        return original.call(this, key, value);
      };
    });
    const fallback = await unavailable.newPage();
    await fallback.goto(`${base}?screenshot=1#notes/general`);
    await fallback.locator("#notebookEditor").fill("Bleibt bei Speicherfehler im aktuellen Tab bearbeitbar.");
    assert.ok(await fallback.locator("#backupButton").evaluate((el) => el.classList.contains("has-storage-error")));
    await fallback.locator("#backupButton").click();
    assert.ok((await fallback.locator("#backupStorageHint").innerText()).includes("nicht verfügbar"));
    await unavailable.close();
    console.log("PASS: notes, highlights, worksheet text, sidebar, collapsed path, manual/automatic export, import, storage failure, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
