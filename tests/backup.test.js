// Claude, OPT-16 Schritt 2: die aus app.js ausgelagerte Prüfsumme der JSON-Sicherung.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {}, TextEncoder, crypto: globalThis.crypto });
context.globalThis = context;
vm.runInContext(fs.readFileSync(path.join(root, "backup.js"), "utf8"), context, { filename: "backup.js" });
const backup = context.window.WORKBENCH_BACKUP;

function signed(payload) {
  const digest = crypto.createHash("sha256").update(backup.stableStringify(payload)).digest("hex");
  return { ...payload, integrity: { algorithm: "SHA-256", digest } };
}

test("stableStringify sortiert Schlüssel auf jeder Ebene und lässt Listen in ihrer Reihenfolge", () => {
  assert.equal(backup.stableStringify({ b: 1, a: [3, { d: null, c: "x" }] }), '{"a":[3,{"c":"x","d":null}],"b":1}');
  assert.equal(backup.stableStringify({ a: 1, b: 2 }), backup.stableStringify({ b: 2, a: 1 }));
  assert.notEqual(backup.stableStringify([1, 2]), backup.stableStringify([2, 1]));
});

test("sha256Hex entspricht SHA-256 über UTF-8", async () => {
  for (const text of ["", "abc", "Schüler – 15 Punkte"]) {
    assert.equal(await backup.sha256Hex(text), crypto.createHash("sha256").update(text, "utf8").digest("hex"));
  }
});

test("verifyBackupIntegrity: gültig, verändert, ohne Prüfsumme, altes Format", async () => {
  const payload = { app: "WorkbenchLab", formatVersion: 3, data: { name: "TST.QAA", completedLessons: ["a"] } };
  const good = signed(payload);
  assert.equal((await backup.verifyBackupIntegrity(good)).verified, true);
  // Reihenfolge der Schlüssel in der Datei spielt keine Rolle.
  assert.equal((await backup.verifyBackupIntegrity({ integrity: good.integrity, data: payload.data, formatVersion: 3, app: "WorkbenchLab" })).verified, true);
  const changed = structuredClone(good);
  changed.data.completedLessons.push("b");
  await assert.rejects(() => backup.verifyBackupIntegrity(changed), /Prüfsumme stimmt nicht/);
  await assert.rejects(() => backup.verifyBackupIntegrity(payload), /keine gültige SHA-256-Prüfsumme/);
  await assert.rejects(() => backup.verifyBackupIntegrity({ ...payload, integrity: { algorithm: "MD5", digest: good.integrity.digest } }), /keine gültige/);
  const legacy = await backup.verifyBackupIntegrity({ app: "WorkbenchLab", formatVersion: 2, data: {} });
  assert.equal(legacy.verified, false);
  assert.equal(legacy.legacy, true);
});

test("backup.js wird vor app.js und vor teacher-overview.js geladen, veröffentlicht und ist die einzige Kopie", () => {
  const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const teacherPage = fs.readFileSync(path.join(root, "lehrkraft.html"), "utf8");
  assert.ok(index.indexOf('src="backup.js') > 0 && index.indexOf('src="backup.js') < index.indexOf('src="app.js'));
  assert.ok(teacherPage.indexOf('src="backup.js') > 0 && teacherPage.indexOf('src="backup.js') < teacherPage.indexOf('src="teacher-overview.js'));
  assert.equal(require("../tools/build-site.cjs").isPublicFile("backup.js"), true);
  const source = fs.readFileSync(path.join(root, "backup.js"), "utf8");
  assert.doesNotMatch(source, /document\.|localStorage|state\./);
  for (const file of ["app.js", "teacher-overview.js"]) {
    assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /function stableStringify|function sha256Hex|function verifyBackupIntegrity/, file);
  }
});
