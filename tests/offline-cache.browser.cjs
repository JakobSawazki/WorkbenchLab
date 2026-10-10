const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");
const { buildSite } = require("../tools/build-site.cjs");
const { writeOfflineManifest } = require("../tools/offline-manifest.cjs");
const { createPreviewServer } = require("../tools/preview-workbench.cjs");
const artifacts = require("./artifacts.cjs")("offline-cache");

(async () => {
  const root = path.resolve(__dirname, "..");
  const files = buildSite(root);
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "workbenchlab-cache-browser-"));
  const version = require("../package.json").version;
  const nextVersion = version.split(".").map((part, index) => index === 2 ? String(Number(part) + 1) : part).join(".");
  const fixtures = {};
  for (const name of ["current", "next", "quota"]) {
    const directory = path.join(output, name);
    for (const file of files) {
      fs.mkdirSync(path.dirname(path.join(directory, file)), { recursive: true });
      fs.copyFileSync(path.join(root, "_site", file), path.join(directory, file));
    }
    if (name === "next") for (const file of files.filter(file => /^(?:index\.html|lehrkraft\.html|content\.js|learning-path\.js)$/.test(file))) {
      const target = path.join(directory, file);
      fs.writeFileSync(target, fs.readFileSync(target, "utf8").replaceAll(version, nextVersion));
    }
    if (name === "quota") {
      const target = path.join(directory, "offline-worker.js");
      fs.writeFileSync(target, 'const originalPut = Cache.prototype.put; Cache.prototype.put = function(key, response) { if (String(key).includes("styles.css")) return Promise.reject(new DOMException("quota", "QuotaExceededError")); return originalPut.call(this, key, response); };\n' + fs.readFileSync(target, "utf8"));
    }
    const manifest = writeOfflineManifest(directory, files, name === "next" ? nextVersion : version);
    fixtures[name] = { directory, manifest, server: createPreviewServer(directory) };
  }
  let current = "current", corrupt = false;
  const requests = [];
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://localhost");
    requests.push({ path: url.pathname, range: request.headers.range });
    if (url.pathname === "/other/") { response.writeHead(200, { "Content-Type": "text/html" }); response.end("<!doctype html><title>Other app</title>"); return; }
    if (!url.pathname.startsWith("/WorkbenchLab/")) { response.writeHead(404); response.end(); return; }
    if (corrupt && url.pathname === "/WorkbenchLab/styles.css") {
      const bytes = fs.readFileSync(path.join(fixtures[current].directory, "styles.css"));
      bytes[0] ^= 1;
      response.writeHead(200, { "Content-Type": "text/css" }); response.end(bytes); return;
    }
    request.url = request.url.slice("/WorkbenchLab".length);
    fixtures[current].server.emit("request", request, response);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const base = origin + "/WorkbenchLab/";
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const seed = async context => {
    context.setDefaultTimeout(30000);
    await context.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedCommands: ["cmd-select"] }));
    });
  };
  const openBackup = async page => { await page.locator("#backupButton").click(); await page.locator("#offlineCachePanel").waitFor(); };
  const ready = async page => { await page.waitForFunction(() => document.querySelector("#offlineCacheStatus").textContent.startsWith("Offline verfügbar")); };
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    await seed(context);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base + "#sql/frei");
    await page.locator("#runtimeChip.is-ready").waitFor();
    assert.equal(await page.evaluate(async () => Boolean(await navigator.serviceWorker.getRegistration())), false, "No automatic opt-in");
    await page.evaluate(async () => { await caches.open("another-app-cache"); });
    await openBackup(page);
    await page.locator("#offlineCachePrepare").click();
    await ready(page);
    assert.match(await page.locator("#offlineCacheStatus").innerText(), new RegExp(version.replaceAll(".", "\\.")));
    assert.equal(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)), false, "Preparing must not claim or reload the current page");
    const cachedPaths = await page.evaluate(async base => {
      const name = (await caches.keys()).find(name => name.startsWith(`workbenchlab-offline:${base}:`));
      return (await (await caches.open(name)).keys()).map(request => new URL(request.url).pathname.slice(new URL(base).pathname.length)).sort();
    }, base);
    assert.deepEqual(cachedPaths, [...fixtures.current.manifest.files.map(file => file.path), "__offline_complete__"].sort());
    console.log("PASS cache: explicit opt-in, complete hashed install, no forced claim/reload");
    await page.keyboard.press("Escape");
    await page.locator("#sqlEditor").fill("SELECT 42 AS cache_test;");
    await page.locator("#sqlEditor").dispatchEvent("input");
    await page.reload();
    await page.locator("#runtimeChip.is-ready").waitFor();
    assert.equal(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)), true);
    await context.setOffline(true);
    await page.reload();
    await page.locator("#runtimeChip.is-ready").waitFor();
    await page.locator("#playgroundSchema").selectOption("leer");
    await page.locator("#playgroundScript").selectOption("assets/sql/l1-1-workbench-einstieg.sql");
    page.once("dialog", dialog => dialog.accept());
    await page.locator("#playgroundScriptOpen").click();
    await page.waitForFunction(() => document.querySelector("#sqlEditor").value.includes("CREATE TABLE"));
    await page.locator("#playgroundRunButton").click();
    await page.locator("#sqlOutput table").waitFor();
    assert.equal(await page.locator("#sqlOutput tbody tr").count(), 2);
    await page.goto(base + "#reference/workbench-start");
    const video = page.locator("#workbench-start video");
    await video.evaluate(element => { element.load(); });
    await page.waitForFunction(() => document.querySelector("video").readyState >= 2);
    await video.evaluate(element => { element.currentTime = 70; element.textTracks[0].mode = "showing"; });
    await page.waitForFunction(() => document.querySelector("track").readyState === 2);
    await page.waitForFunction(() => Math.abs(document.querySelector("video").currentTime - 70) < .5);
    const ranges = await page.evaluate(async () => {
      const results = [];
      for (const range of ["bytes=0-15", "bytes=-16", "bytes=999999999-", "bytes=0-1,4-5"]) {
        const response = await fetch("assets/tutorials/workbench-start.mp4", { headers: { Range: range } });
        results.push({ status: response.status, length: (await response.arrayBuffer()).byteLength, range: response.headers.get("Content-Range") });
      }
      return results;
    });
    assert.deepEqual(ranges.map(result => result.status), [206, 206, 416, 416]);
    assert.deepEqual(ranges.slice(0, 2).map(result => result.length), [16, 16]);
    const teacher = await context.newPage();
    await teacher.goto(base + "lehrkraft.html");
    assert.equal(await teacher.locator("h1").innerText(), "Klassenübersicht");
    await teacher.close();
    await openBackup(page);
    await ready(page);
    await page.locator("#offlineCacheCheck").click();
    await page.waitForFunction(() => document.querySelector("#offlineCacheHint").textContent.includes("bisherige Offline-Kopie bleibt"));
    console.log("PASS cache: offline reload, SQL script, local video/seek/captions, range 206/416, teacher page, failed offline update keeps old copy");

    // A cache miss must be reported, never disguised as complete offline availability.
    await page.evaluate(async base => {
      const name = (await caches.keys()).find(name => name.startsWith(`workbenchlab-offline:${base}:`));
      await (await caches.open(name)).delete(new URL("assets/sql/l1-1-workbench-einstieg.sql", base).href);
    }, base);
    await page.keyboard.press("Escape");
    await openBackup(page);
    await page.waitForFunction(() => document.querySelector("#offlineCacheStatus").textContent.includes("unvollständig"));
    assert.equal(await page.locator("#offlineCachePrepare").isVisible(), true);
    const missing = await page.evaluate(async () => (await fetch("assets/sql/l1-1-workbench-einstieg.sql")).status);
    assert.equal(missing, 503);
    await context.setOffline(false);
    await page.locator("#offlineCachePrepare").click();
    await ready(page);
    assert.equal(await page.evaluate(async () => (await fetch("assets/sql/l1-1-workbench-einstieg.sql")).status), 200);
    assert.equal(await page.evaluate(async () => (await caches.keys()).filter(name => name.startsWith("workbenchlab-offline:")).length), 1);
    console.log("PASS cache: missing asset detected, 503 offline, full repair online, no incomplete cache promoted");

    const other = await context.newPage();
    await other.goto(origin + "/other/");
    const second = await context.newPage();
    await second.goto(base + "#notes/general");
    await second.locator("#notebookEditor").fill("Ununterbrochene Arbeit im zweiten Tab.");
    await second.locator("#notebookEditor").dispatchEvent("input");
    const firstVersion = await page.evaluate(() => window.WORKBENCH_CONTENT.version);
    const oldCache = await page.evaluate(async () => (await caches.keys()).find(name => name.startsWith("workbenchlab-offline:")));
    current = "next";
    corrupt = true;
    await page.locator("#offlineCacheCheck").click();
    await page.waitForFunction(() => document.querySelector("#offlineCacheHint").textContent.includes("bisherige Offline-Kopie bleibt"));
    assert.equal(await page.evaluate(() => window.WORKBENCH_CONTENT.version), firstVersion);
    assert.equal(await page.evaluate(async name => caches.has(name), oldCache), true);
    corrupt = false;
    current = "quota";
    await page.locator("#offlineCacheCheck").click();
    await page.waitForFunction(() => document.querySelector("#offlineCacheHint").textContent.includes("bisherige Offline-Kopie bleibt"));
    assert.equal(await page.evaluate(async name => caches.has(name), oldCache), true);
    assert.equal(await page.evaluate(async () => (await caches.keys()).filter(name => name.startsWith("workbenchlab-offline:")).length), 1);
    current = "next";
    await page.locator("#offlineCacheCheck").click();
    await page.waitForFunction(() => document.querySelector("#offlineCacheStatus").textContent.startsWith("Aktualisierung bereit"));
    assert.match(await page.locator("#offlineCacheStatus").innerText(), new RegExp(nextVersion.replaceAll(".", "\\.")));
    assert.equal(await page.locator("#offlineCacheRemove").isDisabled(), true);
    assert.equal(await second.locator("#notebookEditor").inputValue(), "Ununterbrochene Arbeit im zweiten Tab.");
    assert.equal(await second.evaluate(() => window.WORKBENCH_CONTENT.version), firstVersion);
    await page.reload();
    await page.locator("#runtimeChip.is-ready").waitFor();
    assert.equal(await page.evaluate(() => window.WORKBENCH_CONTENT.version), firstVersion, "Reload must not mix waiting assets into the old build");
    await page.close();
    await second.close();
    await other.waitForFunction(async base => { const registration = await navigator.serviceWorker.getRegistration(base); return registration?.active?.state === "activated" && !registration.waiting; }, base);
    await context.setOffline(true);
    const upgraded = await context.newPage();
    await upgraded.goto(base + "#notes/general");
    assert.equal(await upgraded.evaluate(() => window.WORKBENCH_CONTENT.version), nextVersion);
    assert.equal(await upgraded.locator("#notebookEditor").inputValue(), "Ununterbrochene Arbeit im zweiten Tab.");
    assert.equal(await upgraded.evaluate(async name => caches.has(name), oldCache), false);
    assert.equal(await upgraded.evaluate(async () => caches.has("another-app-cache")), true);
    console.log("PASS cache: corrupt update rejected, two tabs remain old and editable, waiting build activates only after both close, old scoped cache retired, unrelated cache preserved");
    await context.setOffline(false);
    await openBackup(upgraded);
    await ready(upgraded);
    const cancelledDialog = upgraded.waitForEvent("dialog");
    const cancelClick = upgraded.locator("#offlineCacheRemove").click();
    await (await cancelledDialog).dismiss();
    await cancelClick;
    assert.equal(await upgraded.evaluate(async () => Boolean(await navigator.serviceWorker.getRegistration())), true);
    const acceptedDialog = upgraded.waitForEvent("dialog");
    const removeClick = upgraded.locator("#offlineCacheRemove").click();
    await (await acceptedDialog).accept();
    await removeClick;
    await upgraded.waitForURL(/offline=off/);
    assert.equal(await upgraded.evaluate(async () => Boolean(await navigator.serviceWorker.getRegistration())), false);
    assert.equal(await upgraded.evaluate(async () => (await caches.keys()).filter(name => name.startsWith("workbenchlab-offline:")).length), 0);
    assert.equal(await upgraded.evaluate(async () => caches.has("another-app-cache")), true);
    assert.equal(await upgraded.locator("#notebookEditor").inputValue(), "Ununterbrochene Arbeit im zweiten Tab.");
    assert.deepEqual(errors, []);
    await context.close();

    // Initial corruption or quota failure must never leave a ready registration/cache.
    for (const fault of ["hash", "quota"]) {
      current = fault === "quota" ? "quota" : "current";
      corrupt = fault === "hash";
      const context = await browser.newContext({ viewport: { width: 360, height: 950 } });
      await seed(context);
      const page = await context.newPage();
      await page.goto(base + "#home");
      await openBackup(page);
      await page.locator("#offlineCachePrepare").click();
      await page.waitForFunction(() => document.querySelector("#offlineCacheStatus").textContent === "Nicht vollständig vorbereitet");
      assert.equal(await page.evaluate(async () => (await caches.keys()).filter(name => name.startsWith("workbenchlab-offline:")).length), 0);
      assert.equal(await page.locator("#offlineCachePrepare").isDisabled(), false);
      await context.close();
    }
    corrupt = false;
    current = "current";
    for (const theme of ["dark", "light"]) {
      const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
      await seed(context);
      await context.addInitScript(theme => {
        localStorage.setItem("workbenchlab-theme-v1", theme);
        localStorage.setItem("workbenchlab-appearance-v1", JSON.stringify({ fontSize: 20, palettes: {} }));
      }, theme);
      const page = await context.newPage();
      await page.goto(base + "#home");
      await openBackup(page);
      await page.locator("#offlineCachePrepare").scrollIntoViewIfNeeded();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: path.join(artifacts, `${theme}-360-unprepared.png`) });
      await page.locator("#offlineCachePrepare").click();
      await ready(page);
      await page.locator("#offlineCacheCheck").scrollIntoViewIfNeeded();
      for (const selector of ["#offlineCacheCheck", "#offlineCacheRemove"]) {
        const button = page.locator(selector);
        await button.focus();
        assert.equal(await button.evaluate(node => node === document.activeElement), true);
        const bounds = await button.boundingBox();
        assert.ok(bounds.width >= 40 && bounds.height >= 40);
      }
      assert.ok(await page.locator("#backupDialog").evaluate(node => node.scrollWidth <= node.clientWidth + 1));
      await page.screenshot({ path: path.join(artifacts, `${theme}-360-ready.png`) });
      await context.close();
    }
    console.log("PASS cache: cancellation/removal, no cross-app deletion, quota/hash failures, dark/light 360px large text");
    for (const unavailable of ["serviceWorker", "caches"]) {
      const context = await browser.newContext();
      await seed(context);
      await context.addInitScript(unavailable => {
        const target = unavailable === "serviceWorker" ? navigator : window;
        Object.defineProperty(target, unavailable, { get() { throw new DOMException("Blocked", "SecurityError"); } });
      }, unavailable);
      const page = await context.newPage();
      await page.goto(base + "#home");
      await page.locator("#runtimeChip.is-ready").waitFor();
      await openBackup(page);
      assert.equal(await page.locator("#offlineCacheStatus").innerText(), "Offline-Cache nicht verfügbar");
      assert.equal(await page.locator("#offlineCachePrepare").isDisabled(), true);
      assert.equal(await page.locator("#offlinePackageLink").isVisible(), true);
      await context.close();
    }
    console.log("PASS cache: blocked worker/cache APIs leave the app and alternative ZIP usable");
    const profile = path.join(output, "edge-profile");
    let persistent;
    try {
      persistent = await chromium.launchPersistentContext(profile, { channel: "msedge", headless: true });
      await seed(persistent);
      const page = persistent.pages()[0];
      await page.goto(base + "#notes/general");
      await openBackup(page);
      await page.locator("#offlineCachePrepare").click();
      await ready(page);
      await page.keyboard.press("Escape");
      await page.locator("#notebookEditor").fill("Offline nach vollständigem Browser-Neustart.");
      await page.locator("#notebookEditor").dispatchEvent("input");
      await persistent.close();
      persistent = await chromium.launchPersistentContext(profile, { channel: "msedge", headless: true, offline: true });
      persistent.setDefaultTimeout(30000);
      const restarted = persistent.pages()[0];
      await restarted.goto(base + "#notes/general");
      await restarted.locator("#runtimeChip.is-ready").waitFor();
      assert.equal(await restarted.locator("#notebookEditor").inputValue(), "Offline nach vollständigem Browser-Neustart.");
      await openBackup(restarted);
      await ready(restarted);
      console.log("PASS cache: real browser and worker restart with network offline, cached HTML/WASM and persisted notes");
    } finally { await persistent?.close(); }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
    for (const fixture of Object.values(fixtures)) fixture.server.close();
    fs.rmSync(output, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
