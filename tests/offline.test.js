const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { createHash } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const test = require("node:test");
const { buildOffline } = require("../tools/build-offline.cjs");
const { isPublicFile } = require("../tools/build-site.cjs");
const root = path.resolve(__dirname, "..");

test("Offline-ZIP enthält ausschließlich öffentliche Dateien, korrekte Hashes und versionsgleiche SQL-Daten", () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "workbenchlab-offline-test-"));
  let result;
  try {
    result = buildOffline({ output });
    const { directory, zip, manifest } = result;
    assert.ok(fs.statSync(zip).size > 10000000);
    assert.equal(manifest.version, require("../package.json").version);
    assert.ok(manifest.files.length >= 67);
    for (const file of manifest.files) {
      assert.ok(isPublicFile(file.path) || ["offline-data.js", "OFFLINE-LESEN.txt"].includes(file.path), file.path);
      const bytes = fs.readFileSync(path.join(directory, file.path));
      assert.equal(file.bytes, bytes.length);
      assert.equal(file.sha256, createHash("sha256").update(bytes).digest("hex"));
    }
    const zipped = JSON.parse(execFileSync(process.env.PYTHON || "python", ["-B", "-c",
      "import json,sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; print(json.dumps(z.namelist()))", zip], { encoding: "utf8" }));
    assert.deepEqual(zipped.sort(), [...manifest.files.map(file => file.path), "offline-manifest.json"].sort());
    assert.equal(zipped.some(name => /resources|tests\/|desktop\.ini|bpe6-settlement-map\.png|claude2codex/.test(name)), false);
    const payload = fs.readFileSync(path.join(directory, "offline-data.js"), "utf8");
    const context = vm.createContext({ window: {}, location: { protocol: "file:" }, atob: value => Buffer.from(value, "base64").toString("binary") });
    vm.runInContext(payload, context);
    const offline = context.window.WORKBENCH_OFFLINE;
    assert.equal(offline.version, manifest.version);
    assert.deepEqual(Buffer.from(offline.wasmBinary), fs.readFileSync(path.join(root, "vendor/sql.js/sql-wasm.wasm")));
    assert.equal(Object.keys(offline.scripts).length, 12);
    for (const [href, sql] of Object.entries(offline.scripts)) assert.equal(sql, fs.readFileSync(path.join(root, href), "utf8"));
    assert.equal(offline.captions, fs.readFileSync(path.join(root, "assets/tutorials/workbench-start.de.vtt"), "utf8"));
    const online = vm.createContext({ window: {}, location: { protocol: "https:" } });
    vm.runInContext(payload, online);
    assert.equal(online.window.WORKBENCH_OFFLINE, undefined);
    const index = fs.readFileSync(path.join(directory, "index.html"), "utf8");
    assert.ok(index.indexOf('src="offline-data.js') < index.indexOf('src="app.js'));
    for (const file of ["content.js", "learning-path.js", "practical-exercises.js", "debug-exercises.js", "predict-exercises.js"]) {
      assert.doesNotMatch(fs.readFileSync(path.join(directory, file), "utf8"), /^\s*(?:solution|expectedSql|referenceSql|fixed|proofSql):/m);
    }
    assert.match(fs.readFileSync(path.join(directory, "OFFLINE-LESEN.txt"), "utf8"), /Vor einem Ordner-, Versions- oder PC-Wechsel sichern/);
  } finally {
    if (result) fs.rmSync(result.directory, { recursive: true, force: true });
    fs.rmSync(output, { recursive: true, force: true });
  }
});
