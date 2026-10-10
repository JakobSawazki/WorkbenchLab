"use strict";
importScripts("offline-assets.js");

const manifest = self.WORKBENCH_OFFLINE_MANIFEST;
const scope = new URL(self.registration.scope);
const prefix = `workbenchlab-offline:${scope.href}:`;
const buildPrefix = `${prefix}${manifest.build}:`;
const marker = new URL("__offline_complete__", scope).href;
const entries = new Map();
let currentCache = "";
let preparing = null;

if (!/^\d+\.\d+\.\d+$/.test(manifest.version) || !/^[a-f0-9]{64}$/.test(manifest.build)) throw new Error("Invalid offline build");
for (const file of manifest.files) {
  if (!/^[a-zA-Z0-9_./-]+$/.test(file.path) || file.path.split("/").some(part => !part || part.startsWith("."))
    || !/^[a-f0-9]{64}$/.test(file.sha256) || !Number.isSafeInteger(file.bytes) || file.bytes < 0) throw new Error("Invalid offline asset");
  entries.set(new URL(file.path, scope).href, file);
}

function appClient(client) {
  if (!client?.url) return false;
  const url = new URL(client.url);
  return url.origin === scope.origin && url.pathname.startsWith(scope.pathname);
}

async function announce(message) {
  for (const client of await self.clients.matchAll({ type: "window", includeUncontrolled: true })) {
    if (appClient(client)) client.postMessage({ type: "WORKBENCH_OFFLINE", ...message });
  }
}

async function findCache() {
  if (currentCache && await caches.has(currentCache)) return caches.open(currentCache);
  currentCache = "";
  for (const name of (await caches.keys()).reverse()) {
    if (!name.startsWith(buildPrefix)) continue;
    const cache = await caches.open(name);
    const response = await cache.match(marker);
    if (response) {
      try {
        if ((await response.json()).build === manifest.build) { currentCache = name; return cache; }
      } catch {}
    }
  }
  return null;
}

async function complete(cache) {
  if (!cache) return false;
  const response = await cache.match(marker);
  try { if (!response || (await response.json()).build !== manifest.build) return false; }
  catch { return false; }
  for (const url of entries.keys()) if (!await cache.match(url)) return false;
  return true;
}

async function verifiedFetch(url, file) {
  const requestUrl = new URL(url);
  requestUrl.searchParams.set("v", manifest.version);
  requestUrl.searchParams.set("build", manifest.build.slice(0, 16));
  const response = await fetch(requestUrl, { cache: "reload", credentials: "omit", redirect: "error", mode: "same-origin" });
  if (response.status !== 200 || response.type === "opaque") throw new Error("Offline file not available");
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength !== file.bytes) throw new Error("Offline file size mismatch");
  const digest = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(byte => byte.toString(16).padStart(2, "0")).join("");
  if (digest !== file.sha256) throw new Error("Offline file hash mismatch");
  return new Response(bytes, { headers: {
    "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
    "Content-Length": String(bytes.byteLength), "X-WorkbenchLab-Build": manifest.build,
    "Accept-Ranges": "bytes"
  } });
}

async function prepare() {
  if (preparing) return preparing;
  preparing = (async () => {
    if (await complete(await findCache())) return;
    // A separate cache becomes eligible only after every hash has been verified.
    const name = buildPrefix + crypto.randomUUID();
    try {
      const cache = await caches.open(name);
      let done = 0;
      for (const [url, file] of entries) {
        await cache.put(url, await verifiedFetch(url, file));
        await announce({ progress: ++done, total: entries.size, version: manifest.version });
      }
      await cache.put(marker, new Response(JSON.stringify({ build: manifest.build, version: manifest.version })));
      currentCache = name;
      for (const previous of await caches.keys()) {
        if (previous !== name && previous.startsWith(buildPrefix)) await caches.delete(previous);
      }
    } catch (error) {
      await caches.delete(name).catch(() => {});
      throw error;
    }
  })();
  try { await preparing; } finally { preparing = null; }
}

self.addEventListener("install", event => event.waitUntil(prepare()));
self.addEventListener("activate", event => event.waitUntil((async () => {
  await findCache();
  for (const name of await caches.keys()) {
    if (!name.startsWith(prefix) || name === currentCache) continue;
    const cache = await caches.open(name);
    const response = await cache.match(marker);
    if (!response) { await caches.delete(name); continue; }
    try {
      const saved = await response.json();
      const version = value => value.split(".").map(Number);
      if (/^\d+\.\d+\.\d+$/.test(saved.version)) {
        const previous = version(saved.version), active = version(manifest.version);
        const different = previous.findIndex((part, index) => part !== active[index]);
        if (different >= 0 && previous[different] < active[different]) await caches.delete(name);
      }
    } catch {}
  }
  // No skipWaiting, claim or reload: existing tabs keep their complete old build.
})()));

self.addEventListener("message", event => {
  if (!appClient(event.source) || !event.ports[0] || !["status", "prepare"].includes(event.data?.command)) return;
  event.waitUntil((async () => {
    try {
      if (event.data.command === "prepare") await prepare();
      const clients = (await self.clients.matchAll({ type: "window", includeUncontrolled: true })).filter(appClient);
      event.ports[0].postMessage({ version: manifest.version, build: manifest.build, ready: await complete(await findCache()), clients: clients.length });
    } catch {
      event.ports[0].postMessage({ error: "Die Offline-Kopie konnte nicht vollständig gespeichert werden. Internetverbindung und freien Browserspeicher prüfen." });
    }
  })());
});

async function rangeResponse(response, range) {
  const bytes = await response.arrayBuffer();
  const length = bytes.byteLength;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  const invalid = () => new Response(null, { status: 416, headers: { "Content-Range": `bytes */${length}` } });
  if (!match || (!match[1] && !match[2]) || !length) return invalid();
  let start, end;
  if (match[1]) { start = Number(match[1]); end = match[2] ? Math.min(Number(match[2]), length - 1) : length - 1; }
  else { const count = Number(match[2]); if (!Number.isSafeInteger(count) || count < 1) return invalid(); start = Math.max(0, length - count); end = length - 1; }
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= length) return invalid();
  const headers = new Headers(response.headers);
  headers.set("Content-Range", `bytes ${start}-${end}/${length}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(bytes.slice(start, end + 1), { status: 206, headers });
}

async function cachedResponse(request, url, file) {
  try {
    const cache = await findCache();
    let response = await cache?.match(url);
    if (!response) {
      // Repair only with the exact old bytes, never a newer deployment's asset.
      response = await verifiedFetch(url, file);
      if (cache) await cache.put(url, response.clone()).catch(() => {});
    }
    if (request.method === "HEAD") return new Response(null, { headers: response.headers });
    return request.headers.has("Range") ? rangeResponse(response, request.headers.get("Range")) : response;
  } catch {
    await announce({ missing: true });
    const message = "Offline-Kopie unvollständig. Bitte mit Internet alle WorkbenchLab-Tabs schließen und die Seite erneut öffnen. Falls nötig die Offline-Kopie unter Speichern & Laden neu vorbereiten.";
    return new Response(message, { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (!["GET", "HEAD"].includes(request.method)) return;
  const url = new URL(request.url);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  if (request.mode === "navigate" && url.searchParams.get("offline") === "off") return;
  if (request.mode !== "navigate" && url.searchParams.has("v") && url.searchParams.get("v") !== manifest.version) return;
  if (url.pathname === scope.pathname) url.pathname += "index.html";
  url.search = "";
  url.hash = "";
  const file = entries.get(url.href);
  if (!file) return;
  event.respondWith(cachedResponse(request, url.href, file));
});
