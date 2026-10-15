const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4202/";
const artifacts = require("./artifacts.cjs")("annotation-tools");
(async () => {
 const browser = await chromium.launch({ channel: "msedge", headless: true });
 try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 }, acceptDownloads: true });
  await context.addInitScript(() => {
   if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
  });
  const page = await context.newPage(), errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base + "#home");
  await page.locator("#editProfileButton").click();
  await page.locator("#nagoldTotal").click();
  await page.locator("[data-nagold-combo-toggle]").first().click();
  const menu = page.locator(".nagold-combo-list").first();
  await menu.hover();
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 240);
  await page.waitForFunction(() => document.querySelector(".nagold-combo-list").scrollTop > 0);
  assert.ok(await menu.isVisible());
  assert.equal(await page.evaluate(() => scrollY), before);
  await page.keyboard.press("Escape");
  await page.locator("#nagoldCloseButton").click();
  await page.keyboard.press("Escape");

  await page.goto(base + "#notes/general");
  await page.locator("#notebookEditor").fill("Alpha Beta Gamma");
  await page.locator("#notebookEditor").evaluate(node => {
   const range = document.createRange(); range.setStart(node.firstChild, 6); range.setEnd(node.firstChild, 10);
   getSelection().removeAllRanges(); getSelection().addRange(range);
  });
  await page.locator('[data-note-color="blue"]').click();
  assert.equal(await page.locator('[data-note-ink="blue"]').innerText(), "Beta");
  await page.reload();
  assert.equal(await page.locator('[data-note-ink="blue"]').innerText(), "Beta");
  await page.locator("#notebookEditor").press("End");
  await page.keyboard.type("!");
  assert.match(await page.locator("#notebookEditor").innerText(), /!/);
  await page.locator("#notebookEditor").press("Control+z");
  assert.equal(await page.locator("#notebookEditor").innerText(), "Alpha Beta Gamma");
  assert.equal(await page.locator('[data-note-ink="blue"]').innerText(), "Beta");
  await page.locator("#notebookEditor").press("Control+y");
  assert.match(await page.locator("#notebookEditor").innerText(), /!/);
  await page.locator("#notebookEditor").evaluate(node => {
   const previous = node.value;
   node.textContent = "X".repeat(12001);
   node.dispatchEvent(new Event("input", { bubbles: true }));
   if (node.value !== previous || node.textContent !== previous) throw new Error("Oversized edits must preserve the existing note");
  });

  await page.goto(base + "#lesson/warum-datenbanken");
  await page.locator('[data-highlight-block="section-0-paragraph-0"]').evaluate(node => {
   const range = document.createRange(); range.selectNodeContents(node);
   getSelection().removeAllRanges(); getSelection().addRange(range);
  });
  await page.locator("[data-add-comment]").click();
  await page.locator("#lessonCommentText").fill("Meine Frage <script>window.bad=1</script>");
  await page.locator('#lessonCommentForm [type="submit"]').click();
  assert.match(await page.locator("#lessonComments").innerText(), /Meine Frage/);
  await page.reload();
  assert.match(await page.locator("#lessonComments").innerText(), /<script>/);
  assert.equal(await page.evaluate(() => window.bad), undefined);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  const toolbar = await page.locator(".reading-tools").boundingBox();
  assert.ok(toolbar.y >= 0 && toolbar.y < 250, JSON.stringify(toolbar));
  await page.locator("[data-comment-edit]").click();
  await page.locator("#lessonCommentText").fill("Bearbeiteter Kommentar");
  await page.locator('#lessonCommentForm [type="submit"]').click();

  await page.goto(base + "#notes/general");
  await page.evaluate(() => {
   const strokes = Array.from({ length: 120 }, (_, index) => ({ tool: "pen", color: "#17212b", width: 5, points: [[.2, .2], [.8, .2 + index / 1000]] }));
   const state = JSON.parse(localStorage.getItem("workbenchlab-v1"));
   state.noteDrawings.general = strokes;
   localStorage.setItem("workbenchlab-v1", JSON.stringify(state));
  });
  await page.reload();
  await page.locator('[data-notebook-tab="drawing"]').click();
  const canvas = page.locator("#noteCanvas");
  await canvas.scrollIntoViewIfNeeded();
  const rect = await canvas.boundingBox();
  await page.mouse.move(rect.x + rect.width * .5, rect.y + rect.height * .25);
  await page.mouse.down(); await page.mouse.move(rect.x + rect.width * .6, rect.y + rect.height * .3); await page.mouse.up();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).noteDrawings.general[0].tool), "image");
  await page.locator('[data-draw-tool="erase"]').click();
  await page.mouse.move(rect.x + rect.width * .5, rect.y + rect.height * .25);
  await page.mouse.down(); await page.mouse.up();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).noteDrawings.general.at(-1).tool), "erase");
  assert.equal(await canvas.evaluate(node => node.getContext("2d").getImageData(600, 180, 1, 1).data[3]), 0);
  await page.reload();
  await page.locator('[data-notebook-tab="drawing"]').click();
  await page.waitForFunction(() => document.querySelector("#noteCanvas").getContext("2d").getImageData(240, 144, 1, 1).data[3] > 0);
  assert.equal(await canvas.evaluate(node => node.getContext("2d").getImageData(600, 180, 1, 1).data[3]), 0);
  await page.locator("#backupButton").click();
  const pending = page.waitForEvent("download");
  await page.locator("#exportProgressButton").click();
  const payload = JSON.parse(fs.readFileSync(await (await pending).path(), "utf8"));
  assert.equal(payload.formatVersion, 9);
  assert.equal(payload.data.noteTextStyles.general[0].color, "blue");
  assert.equal(payload.data.lessonComments["warum-datenbanken"][0].text, "Bearbeiteter Kommentar");
  assert.equal(payload.data.noteDrawings.general[0].tool, "image");
  await page.keyboard.press("Escape");
  const fresh = await browser.newContext();
  try {
   const other = await fresh.newPage();
   await other.goto(base + "#home");
   await other.locator("#profileName").fill("NEW.QAA"); await other.locator("#profileClass").fill("TEST");
   await other.locator('#profileForm [type="submit"]').click();
   await other.locator("#backupButton").click();
   other.once("dialog", dialog => dialog.accept());
   await other.locator("#progressFileInput").setInputFiles({ name: "notizen.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
   await other.locator("#backupDialog").waitFor({ state: "hidden" });
   await other.goto(base + "#notes/general");
   assert.equal(await other.locator('[data-note-ink="blue"]').innerText(), "Beta");
   await other.locator('[data-notebook-tab="drawing"]').click();
   await other.waitForFunction(() => document.querySelector("#noteCanvas").getContext("2d").getImageData(240, 144, 1, 1).data[3] > 0);
   assert.equal(await other.locator("#noteCanvas").evaluate(node => node.getContext("2d").getImageData(600, 180, 1, 1).data[3]), 0);
   await other.goto(base + "#lesson/warum-datenbanken");
   assert.match(await other.locator("#lessonComments").innerText(), /Bearbeiteter Kommentar/);
   await other.locator("[data-comment-remove]").click();
   assert.equal(await other.locator("#lessonComments").isVisible(), false);
  } finally { await fresh.close(); }
  await page.evaluate(() => {
   const state = JSON.parse(localStorage.getItem("workbenchlab-v1"));
   state.noteDrawings.general = Array.from({ length: 8 }, (_, index) => ({ tool: "pen", color: "#17212b", width: 5, points: Array.from({ length: 1000 }, (_, point) => [point / 1000, .1 + index / 100]) }));
   localStorage.setItem("workbenchlab-v1", JSON.stringify(state));
  });
  await page.reload();
  await page.locator('[data-notebook-tab="drawing"]').click();
  await page.locator("#noteCanvas").click({ position: { x: 100, y: 100 } });
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).noteDrawings.general[0].tool), "image");
  for (const theme of ["dark", "light"]) for (const width of [1440, 360]) {
   await page.setViewportSize({ width, height: 950 });
   await page.goto(base + "#notes/general");
   await page.reload();
   await page.locator('[data-notebook-tab="text"]').click();
   if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
   await page.locator("#notebookEditor").scrollIntoViewIfNeeded();
   await page.screenshot({ path: `${artifacts}/${theme}-${width}.png`, animations: "disabled" });
   await page.goto(base + "#lesson/warum-datenbanken");
   await page.evaluate(() => { document.documentElement.style.fontSize = "20px"; });
   await page.locator("[data-comment-edit]").click();
   const dialog = page.locator("#lessonCommentDialog"), bounds = await dialog.boundingBox();
   assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width + 1);
   assert.equal(await page.getByLabel("Kommentar", { exact: true }).inputValue(), "Bearbeiteter Kommentar");
   await dialog.screenshot({ path: `${artifacts}/comment-${theme}-${width}.png`, animations: "disabled" });
   await page.keyboard.press("Escape");
   assert.equal(await dialog.isVisible(), false);
  }
  assert.deepEqual(errors, []);
  await context.close();
  console.log("PASS: NAGOLD wheel isolation, colored text persistence, anchored comments, full-page marker, capacity compaction and erasing, backup and responsive themes.");
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
