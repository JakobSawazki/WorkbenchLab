// Claude, 0.40.0: Entwürfe des Modell-Editors reisen mit der JSON-Sicherung.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const stable = (value) => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.keys(item).sort().reduce((result, key) => ({ ...result, [key]: item[key] }), {}) : item);
const digest = (payload) => { const { integrity, ...body } = payload; return crypto.createHash("sha256").update(stable(body)).digest("hex"); };
const sign = (payload) => { payload.integrity.digest = digest(payload); return payload; };
const asFile = (name, payload) => ({ name, mimeType: "application/json", buffer: Buffer.from(typeof payload === "string" ? payload : JSON.stringify(payload)) });

const model = {
  entities: [
    { id: 1, name: "Ort", attributes: [{ id: 2, name: "ortnr", type: "INT", pk: true, fk: false }] },
    { id: 3, name: "Fahrschueler", attributes: [{ id: 4, name: "schuelernr", type: "INT", pk: true, fk: false }, { id: 5, name: "ortnr", type: "INT", pk: false, fk: true }] }
  ],
  relations: [{ id: 6, from: 1, to: 3, card: "1:N" }],
  nextId: 7
};
const drafts = { task: "fahrschule-ort", notation: "workbench", models: { "fahrschule-ort": model } };

async function open(browser, seedDrafts) {
  const context = await browser.newContext({ acceptDownloads: true });
  await context.addInitScript((seed) => {
    if (!localStorage.getItem("workbenchlab-v1")) {
      localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
      if (seed) localStorage.setItem("workbenchlab-erm-v1", JSON.stringify(seed));
    }
  }, seedDrafts);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base + "#home");
  await page.locator("#backupButton").waitFor();
  return { context, page, errors };
}

async function exportBackup(page) {
  if (!(await page.locator("#backupDialog").isVisible())) await page.locator("#backupButton").click();
  const download = page.waitForEvent("download");
  await page.locator("#exportProgressButton").click();
  const stream = await (await download).createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function importBackup(page, payload, accept = true) {
  if (!(await page.locator("#backupDialog").isVisible())) await page.locator("#backupButton").click();
  let message = "";
  page.once("dialog", (dialog) => { message = dialog.message(); return accept ? dialog.accept() : dialog.dismiss(); });
  await page.locator("#progressFileInput").setInputFiles(asFile("sicherung.json", payload));
  if (accept) await page.locator("#backupDialog").waitFor({ state: "hidden" });
  else await page.waitForFunction(() => document.querySelector("#backupStatus").textContent === "Laden abgebrochen.");
  return message;
}

const storedDrafts = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-erm-v1") || "null"));

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    // Gerät A: Entwurf vorhanden → Sicherung enthält ihn, Prüfsumme deckt ihn ab.
    const a = await open(browser, drafts);
    const exported = await exportBackup(a.page);
    assert.equal(exported.formatVersion, 6);
    assert.deepEqual(exported.extras.ermDrafts, drafts);
    assert.equal(exported.integrity.digest, digest(exported));

    // Auch ein im Editor gerade erst geänderter Entwurf landet in der Sicherung.
    await a.page.locator("#backupCloseButton").click();
    await a.page.goto(base + "#modeling/editor");
    await a.page.locator("#ermEditor").waitFor();
    assert.match(await a.page.locator("main").innerText(), /gehört zur JSON-Sicherung/);
    assert.equal(await a.page.locator("#ermDiagram .erm-entity-box").count(), 2);
    assert.equal((await exportBackup(a.page)).extras.ermDrafts.models["fahrschule-ort"].entities.length, 2);
    await a.context.close();

    // Gerät B ohne Entwürfe: Laden übernimmt den Entwurf; der Editor zeigt ihn.
    const b = await open(browser, null);
    assert.equal(await storedDrafts(b.page), null);
    const message = await importBackup(b.page, exported);
    assert.match(message, /Das gilt auch für deine Entwürfe im Modell-Editor \(in der Sicherung: 1\)/);
    assert.deepEqual(await storedDrafts(b.page), drafts);
    await b.page.goto(base + "#modeling/editor");
    await b.page.locator("#ermEditor").waitFor();
    assert.equal(await b.page.locator("#ermDiagram .erm-entity-box").count(), 2);
    assert.match(await b.page.locator("#ermDiagram").innerText(), /Fahrschueler/);

    // Abbrechen ändert nichts; eine veränderte Sicherung wird wegen der Prüfsumme abgelehnt.
    const other = structuredClone(exported);
    other.extras.ermDrafts.models["fahrschule-ort"].entities[0].name = "Geändert";
    await b.page.locator("#backupButton").click();
    await b.page.locator("#progressFileInput").setInputFiles(asFile("veraendert.json", other));
    await b.page.locator("#backupStatus.is-error").waitFor();
    assert.match(await b.page.locator("#backupStatus").innerText(), /Prüfsumme stimmt nicht/);
    await importBackup(b.page, sign(structuredClone(other)), false);
    assert.deepEqual(await storedDrafts(b.page), drafts);
    await b.page.locator("#backupCloseButton").click();

    // Ältere Sicherung ohne Zusatzblock: Lernstand wird geladen, Entwürfe dieses Browsers bleiben.
    const legacy = structuredClone(exported);
    delete legacy.extras;
    const legacyMessage = await importBackup(b.page, sign(legacy));
    assert.doesNotMatch(legacyMessage, /Modell-Editor/);
    assert.deepEqual(await storedDrafts(b.page), drafts);

    // Sicherung mit leerem Entwurfsblock ersetzt die Entwürfe (wie der übrige Lernstand ersetzt wird).
    const empty = structuredClone(exported);
    empty.extras.ermDrafts = { task: "frei", notation: "n", models: {} };
    assert.match(await importBackup(b.page, sign(empty)), /in der Sicherung: 0/);
    assert.deepEqual(await storedDrafts(b.page), { task: "frei", notation: "n", models: {} });
    await b.page.goto(base + "#modeling/editor");
    await b.page.locator("#ermEditor").waitFor();
    assert.equal(await b.page.locator("#ermDiagram .erm-entity-box").count(), 0);

    // Unbrauchbarer oder bösartiger Zusatzblock wird bereinigt, nie ungeprüft gespeichert.
    const hostile = structuredClone(exported);
    hostile.extras.ermDrafts = {
      task: "gibt-es-nicht", notation: "<script>", unbekannt: "x",
      models: {
        "fahrschule-ort": { entities: [{ id: 1, name: "<img src=x onerror=window.__xss=1>" + "x".repeat(500), attributes: [{ id: 2, name: "a", type: "DROP TABLE", pk: 1 }] }, { id: "kaputt" }], relations: [{ id: 3, from: 1, to: 99, card: "1:N" }] },
        "fremde-aufgabe": model
      }
    };
    await importBackup(b.page, sign(hostile));
    const cleaned = await storedDrafts(b.page);
    assert.equal(cleaned.task, "fahrschule-ort");
    assert.equal(cleaned.notation, "n");
    assert.deepEqual(Object.keys(cleaned), ["task", "notation", "models"]);
    assert.deepEqual(Object.keys(cleaned.models), ["fahrschule-ort"]);
    assert.equal(cleaned.models["fahrschule-ort"].entities.length, 1);
    assert.ok(cleaned.models["fahrschule-ort"].entities[0].name.length <= 60);
    assert.equal(cleaned.models["fahrschule-ort"].entities[0].attributes[0].type, "INT");
    assert.deepEqual(cleaned.models["fahrschule-ort"].relations, []);
    await b.page.goto(base + "#modeling/editor");
    await b.page.locator("#ermEditor").waitFor();
    assert.equal(await b.page.locator("#ermEditor img").count(), 0);
    assert.equal(await b.page.evaluate(() => window.__xss), undefined);
    for (const junk of [null, 5, "text", []]) {
      const broken = structuredClone(exported);
      broken.extras.ermDrafts = junk;
      await importBackup(b.page, sign(broken));
      assert.deepEqual(await storedDrafts(b.page), { task: "fahrschule-ort", notation: "n", models: {} }, JSON.stringify(junk));
    }
    assert.deepEqual(b.errors, []);
    await b.context.close();
    console.log("PASS: model editor drafts are exported with checksum, imported on another device, kept for legacy backups, replaced by new backups, tampering rejected, hostile content sanitised.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
