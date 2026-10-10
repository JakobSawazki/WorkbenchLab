const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");

function writeOfflineManifest(directory, files, version) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error("Ungültige Offline-Version.");
  if (new Set(files).size !== files.length) throw new Error("Doppelte Offline-Datei.");
  const excluded = new Set(["offline-worker.js", "offline-assets.js"]);
  const entries = files.filter(file => !excluded.has(file)).sort().map(file => {
    if (!/^[a-zA-Z0-9_./-]+$/.test(file) || file.split("/").some(part => !part || part.startsWith("."))) throw new Error("Ungültiger Offline-Dateipfad.");
    const bytes = fs.readFileSync(path.join(directory, file));
    return { path: file, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") };
  });
  const worker = fs.readFileSync(path.join(directory, "offline-worker.js"));
  const build = createHash("sha256").update(version).update(JSON.stringify(entries)).update(worker).digest("hex");
  const manifest = { version, build, files: entries };
  fs.writeFileSync(path.join(directory, "offline-assets.js"), `self.WORKBENCH_OFFLINE_MANIFEST = ${JSON.stringify(manifest)};\n`);
  return manifest;
}

module.exports = { writeOfflineManifest };
