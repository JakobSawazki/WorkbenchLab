const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");
const { buildOffline } = require("../tools/build-offline.cjs");
const artifacts = require("./artifacts.cjs")("offline");

(async () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "workbenchlab-offline-browser-"));
  const result = buildOffline({ output });
  const extracted = path.join(output, "Entpackt mit Leerzeichen");
  execFileSync(process.env.PYTHON || "python", ["-B", "-c", "import sys,zipfile; zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])", result.zip, extracted]);
  const base = pathToFileURL(extracted + path.sep).href;
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 360]) {
      const context = await browser.newContext({ viewport: { width, height: 950 }, offline: true, acceptDownloads: true });
      context.setDefaultTimeout(15000);
      await context.addInitScript(({ width }) => {
        if (!localStorage.getItem("workbenchlab-v1")) {
          localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedCommands: ["cmd-select"] }));
          localStorage.setItem("workbenchlab-appearance-v1", JSON.stringify({ fontSize: width === 360 ? 20 : 16, palettes: {} }));
        }
      }, { width });
      const page = await context.newPage();
      const errors = [], network = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("request", request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
      page.on("dialog", dialog => dialog.accept());
      await page.goto(base + "index.html#home");
      await page.locator("#runtimeChip.is-ready").waitFor();
      console.log(`Offline ${width}: SQL runtime ready`);
      assert.equal(await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize)), width === 360 ? 20 : 16);
      await page.locator('img[src="assets/bpe6-alpine-learning-path.webp"]').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('img[src="assets/bpe6-alpine-learning-path.webp"]').naturalWidth > 0);
      await page.goto(base + "index.html#notes/warum-datenbanken");
      await page.locator("#notebookEditor").fill("Meine Notiz ohne Internet.");
      await page.locator("#notebookEditor").dispatchEvent("input");
      await page.reload();
      assert.equal(await page.locator("#notebookEditor").inputValue(), "Meine Notiz ohne Internet.");
      await page.goto(base + "index.html#sql/frei");
      assert.equal(await page.evaluate(() => crypto.subtle !== undefined), true);
      await page.locator("#playgroundSchema").selectOption("leer");
      await page.locator("#playgroundScript").selectOption("assets/sql/l1-1-workbench-einstieg.sql");
      await page.locator("#playgroundScriptOpen").click();
      await page.waitForFunction(() => document.querySelector("#sqlEditor").value.includes("CREATE TABLE"));
      await page.locator("#playgroundRunButton").click();
      await page.locator("#sqlOutput table").waitFor();
      console.log(`Offline ${width}: lesson script executed`);
      assert.equal(await page.locator("#sqlOutput tbody tr").count(), 2);
      await page.locator("#sqlEditor").fill("SELECT 42 AS offline;");
      await page.locator("#playgroundRunButton").click();
      await page.waitForFunction(() => document.querySelector("#sqlOutput td")?.textContent === "42");
      await page.locator("#backupButton").click();
      assert.equal(await page.locator("#offlinePackageLink").isVisible(), false);
      assert.equal(await page.locator("#offlineCachePanel").isVisible(), false);
      assert.match(await page.locator("#backupStorageHint").innerText(), /Ordner-, Versions- oder PC-Wechsel/);
      const downloadPromise = page.waitForEvent("download");
      await page.locator("#exportProgressButton").click();
      const download = await downloadPromise;
      const payload = fs.readFileSync(await download.path());
      const parsed = JSON.parse(payload);
      assert.equal(parsed.data.drafts["frei-leer"], "SELECT 42 AS offline;");
      assert.equal(parsed.data.lessonNotes["warum-datenbanken"], "Meine Notiz ohne Internet.");
      assert.equal(parsed.integrity.algorithm, "SHA-256");
      await page.keyboard.press("Escape");
      await page.locator("#sqlEditor").fill("SELECT 7;");
      await page.locator("#sqlEditor").dispatchEvent("input");
      await page.locator("#backupButton").click();
      await page.locator("#progressFileInput").setInputFiles({ name: "offline.json", mimeType: "application/json", buffer: payload });
      await page.waitForFunction(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).drafts["frei-leer"] === "SELECT 42 AS offline;");
      if (await page.locator("#backupDialog").isVisible()) await page.keyboard.press("Escape");
      await page.reload();
      await page.locator("#runtimeChip.is-ready").waitFor();
      await page.locator("#playgroundSchema").selectOption("leer");
      assert.equal(await page.locator("#sqlEditor").inputValue(), "SELECT 42 AS offline;");
      console.log(`Offline ${width}: backup restored`);
      await page.goto(base + "index.html#reference/workbench-start");
      const video = page.locator("#workbench-start video");
      await video.evaluate(element => { element.load(); });
      await page.waitForFunction(() => document.querySelector("#workbench-start video").readyState >= 2);
      await video.evaluate(element => { element.currentTime = 12; });
      await page.waitForFunction(() => Math.abs(document.querySelector("#workbench-start video").currentTime - 12) < .5);
      await video.evaluate(element => { element.textTracks[0].mode = "showing"; });
      await page.waitForFunction(() => document.querySelector("#workbench-start track").readyState === 2);
      assert.ok(await page.evaluate(() => document.querySelector("#workbench-start video").textTracks[0].cues.length > 5));
      assert.ok(await page.evaluate(() => [...document.images].filter(image => image.getBoundingClientRect().width > 0).every(image => image.complete && image.naturalWidth > 0)));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: path.join(artifacts, `file-${width}.png`), animations: "disabled" });
      const teacher = await context.newPage();
      await teacher.goto(base + "lehrkraft.html");
      const summary = await teacher.evaluate(async parsed => window.WORKBENCH_TEACHER.readFile({ size: 1000, name: "offline.json", text: async () => JSON.stringify(parsed) }, window.WORKBENCH_CONTENT), parsed);
      assert.equal(summary.integrity, "gueltig");
      assert.equal(summary.xp, 12);
      assert.deepEqual(errors, []);
      assert.deepEqual(network, []);
      await context.close();
    }
    // A mismatched or missing embedded runtime must not fall back to file:// fetches.
    for (const broken of ["missing", "version"]) {
      const context = await browser.newContext({ offline: true });
      context.setDefaultTimeout(15000);
      await context.addInitScript(broken => {
        localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
        Object.defineProperty(window, "WORKBENCH_OFFLINE", {
          configurable: true,
          set(payload) { Object.defineProperty(window, "WORKBENCH_OFFLINE", { value: broken === "missing" ? null : { ...payload, version: "0.0.0" } }); }
        });
      }, broken);
      const page = await context.newPage();
      const errors = [], wasmRequests = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("request", request => { if (request.url().includes("sql-wasm.wasm")) wasmRequests.push(request.url()); });
      await page.goto(base + "index.html#home");
      await page.locator("#runtimeChip.is-error").waitFor();
      assert.deepEqual(wasmRequests, []);
      assert.deepEqual(errors, []);
      await context.close();
    }
    const context = await browser.newContext({ offline: true, acceptDownloads: true });
    context.setDefaultTimeout(15000);
    await context.addInitScript(() => {
      const seed = JSON.stringify({ name: "TST.QAA", className: "TEST" });
      Storage.prototype.getItem = key => key === "workbenchlab-v1" ? seed : null;
      Storage.prototype.setItem = () => { throw new DOMException("blocked", "SecurityError"); };
    });
    const page = await context.newPage();
    await page.goto(base + "index.html#home");
    await page.locator("#runtimeChip.is-ready").waitFor();
    await page.locator("#backupButton").click();
    assert.match(await page.locator("#backupStorageHint").innerText(), /Browserspeicher nicht verfügbar/);
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    const download = await downloadPromise;
    assert.equal(JSON.parse(fs.readFileSync(await download.path(), "utf8")).app, "WorkbenchLab");
    await context.close();
    console.log("PASS: extracted ZIP via file:// with network offline, SQL scripts, export/import, teacher verification, local film/captions, desktop/mobile.");
  } finally {
    await browser.close();
    fs.rmSync(result.directory, { recursive: true, force: true });
    fs.rmSync(output, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
