const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const vm = require("node:vm");
const { createHash } = require("node:crypto");
const test = require("node:test");
const { writeOfflineManifest } = require("../tools/offline-manifest.cjs");
const root = path.resolve(__dirname, "..");

test("Offline-Manifest bindet Version, Worker und jede veröffentlichte Datei an echte SHA-256-Werte", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "workbenchlab-cache-manifest-"));
  try {
    fs.writeFileSync(path.join(directory, "index.html"), "fixture");
    fs.writeFileSync(path.join(directory, "offline-worker.js"), "worker");
    const manifest = writeOfflineManifest(directory, ["index.html", "offline-worker.js"], "1.2.3");
    assert.deepEqual(manifest.files, [{ path: "index.html", bytes: 7, sha256: createHash("sha256").update("fixture").digest("hex") }]);
    assert.equal(writeOfflineManifest(directory, ["index.html", "offline-worker.js"], "1.2.3").build, manifest.build);
    assert.notEqual(writeOfflineManifest(directory, ["index.html", "offline-worker.js"], "1.2.4").build, manifest.build);
    fs.writeFileSync(path.join(directory, "offline-worker.js"), "changed worker");
    assert.notEqual(writeOfflineManifest(directory, ["index.html", "offline-worker.js"], "1.2.3").build, manifest.build);
    for (const file of ["../private", "/private", "a//b", ".git/config", "a\\b", "a?b"]) assert.throws(() => writeOfflineManifest(directory, [file], "1.2.3"));
    assert.throws(() => writeOfflineManifest(directory, ["index.html", "index.html"], "1.2.3"));
    assert.throws(() => writeOfflineManifest(directory, ["index.html"], "wrong"));
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

function workerContext() {
  const events = {};
  const context = vm.createContext({ self: { WORKBENCH_OFFLINE_MANIFEST: { version: "1.2.3", build: "a".repeat(64), files: [] },
    registration: { scope: "https://example.test/WorkbenchLab/" }, addEventListener: (name, fn) => { events[name] = fn; } },
    importScripts() {}, URL, Headers, Response, Uint8Array, Map, Number, crypto: require("node:crypto").webcrypto });
  vm.runInContext(fs.readFileSync(path.join(root, "offline-worker.js"), "utf8"), context);
  return { context, events };
}

test("Offline-Video liefert korrekte Bytebereiche und 416 bei ungültigen Bereichsanfragen", async () => {
  const { context } = workerContext();
  for (const [range, start, end] of [["bytes=0-3", 0, 3], ["bytes=4-", 4, 9], ["bytes=-3", 7, 9], ["bytes=7-99", 7, 9]]) {
    const response = await context.rangeResponse(new Response(Uint8Array.from({ length: 10 }, (_, index) => index)), range);
    assert.equal(response.status, 206);
    assert.equal(response.headers.get("Content-Range"), `bytes ${start}-${end}/10`);
    assert.equal(response.headers.get("Content-Length"), String(end - start + 1));
    assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], Array.from({ length: end - start + 1 }, (_, index) => start + index));
  }
  for (const range of ["bytes=", "bytes=-0", "bytes=10-", "bytes=8-2", "bytes=0-1,4-5", "items=1-2", "bytes=999999999999999999999-"]) {
    const response = await context.rangeResponse(new Response("0123456789"), range);
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get("Content-Range"), "bytes */10");
  }
});

test("Offline-Worker übernimmt keine fremden Apps oder Schreibanfragen und erzwingt keine Aktivierung", () => {
  const { context, events } = workerContext();
  assert.equal(context.appClient({ url: "https://example.test/WorkbenchLab/index.html" }), true);
  for (const url of ["https://example.test/Other/", "https://example.test/WorkbenchLab2/", "https://foreign.test/WorkbenchLab/", "about:blank"]) assert.equal(context.appClient({ url }), false);
  for (const [url, method] of [["https://foreign.test/WorkbenchLab/index.html", "GET"], ["https://example.test/Other/index.html", "GET"], ["https://example.test/WorkbenchLab/index.html", "POST"]]) {
    let intercepted = false;
    events.fetch({ request: { url, method }, respondWith() { intercepted = true; } });
    assert.equal(intercepted, false);
  }
  const source = fs.readFileSync(path.join(root, "offline-worker.js"), "utf8");
  assert.doesNotMatch(source, /\bskipWaiting\s*\(|\bclients\.claim\s*\(/);
  const client = fs.readFileSync(path.join(root, "offline-client.js"), "utf8");
  assert.match(client, /updateViaCache: "none"/);
  assert.match(client, /candidate\?\.scope === scope/);
  assert.match(client, /event\.source\?\.scriptURL !== script/);
});

test("Offline-Navigation normalisiert Einstieg, Version und Hashroute auf dieselbe gespeicherte HTML-Datei", async () => {
  const { context, events } = workerContext();
  vm.runInContext(`entries.set("https://example.test/WorkbenchLab/index.html", { path: "index.html" }); cachedResponse = async (request, url) => new Response(url);`, context);
  for (const url of ["https://example.test/WorkbenchLab/#sql/frei", "https://example.test/WorkbenchLab/?v=1.2.3#home", "https://example.test/WorkbenchLab/index.html#reference"]) {
    let result;
    events.fetch({ request: { url, method: "GET", mode: "navigate" }, respondWith(response) { result = response; } });
    assert.equal(await (await result).text(), "https://example.test/WorkbenchLab/index.html");
  }
});

test("Ein vollständiger Offline-Cache braucht sowohl Abschlussmarker als auch alle Dateien", async () => {
  const { context } = workerContext();
  const index = "https://example.test/WorkbenchLab/index.html";
  const marker = "https://example.test/WorkbenchLab/__offline_complete__";
  vm.runInContext(`entries.set(${JSON.stringify(index)}, { path: "index.html" });`, context);
  const stored = new Map([[index, new Response("fixture")]]);
  const cache = { match: async url => stored.get(url)?.clone() };
  assert.equal(await context.complete(cache), false);
  stored.set(marker, new Response(JSON.stringify({ build: "b".repeat(64) })));
  assert.equal(await context.complete(cache), false);
  stored.set(marker, new Response(JSON.stringify({ build: "a".repeat(64) })));
  assert.equal(await context.complete(cache), true);
  stored.delete(index);
  assert.equal(await context.complete(cache), false);
  stored.set(marker, new Response("invalid"));
  assert.equal(await context.complete(cache), false);
});
