const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const { chromium } = require("playwright");
const artifacts = require("./artifacts.cjs")("erm-progress");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4199/";
const scope = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../erm-editor.js"), "utf8"), scope);
const erm = scope.window.WORKBENCH_ERM;
const models = {};
// Structural fixtures for the three existing graders, not part of the published app.
for (const task of erm.TASKS.filter(task => task.target)) {
  let id = 1;
  const byKey = {};
  const entities = task.target.entities.map(target => {
    const entity = { id: id++, name: target.names[0], attributes: [] };
    byKey[target.key] = entity;
    entity.attributes.push({ id: id++, name: target.key + "_id", type: "INT", pk: true, fk: false });
    for (const relation of task.target.relations.filter(relation => relation.many === target.key)) {
      entity.attributes.push({ id: id++, name: relation.one + "_id", type: "INT", pk: false, fk: true });
    }
    while (entity.attributes.length < Math.max(target.minAttributes || 2, 2)) {
      entity.attributes.push({ id: id++, name: "beschreibung_" + id, type: "VARCHAR(50)", pk: false, fk: false });
    }
    return entity;
  });
  const relations = task.target.relations.map(relation => ({ id: id++, from: byKey[relation.one].id, to: byKey[relation.many].id, card: "1:N" }));
  models[task.id] = { entities, relations, nextId: id };
  assert.equal(erm.checkModel(models[task.id], task.target).passed, true);
}
const stable = value => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.keys(item).sort().reduce((result, key) => ({ ...result, [key]: item[key] }), {}) : item);
const sign = payload => {
  const { integrity, ...body } = payload;
  return { ...body, integrity: { ...integrity, digest: crypto.createHash("sha256").update(stable(body)).digest("hex") } };
};
const asFile = payload => ({ name: "modelle.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await context.addInitScript(models => {
      if (!localStorage.getItem("workbenchlab-v1")) {
        localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
        localStorage.setItem("workbenchlab-erm-v1", JSON.stringify({ task: "fahrschule-ort", notation: "n", models }));
      }
    }, models);
    await page.goto(base + "#modeling/editor");
    await page.locator("#runtimeChip.is-ready").waitFor();
    assert.equal(await page.locator("#topXp").innerText(), "0 XP", "Drafts must not silently earn XP");
    const earned = {};
    for (const [index, task] of Object.keys(models).entries()) {
      await page.locator("#ermTask").selectOption(task);
      await page.locator("#ermCheck").click();
      assert.match(await page.locator("#ermResult").innerText(), /Modell stimmt/);
      assert.equal(await page.locator("#topXp").innerText(), `${(index + 1) * 30} XP`);
      assert.equal(await page.locator("#topNagold").innerText(), "0 NAG");
      assert.match(await page.locator("#ermProgress").innerText(), /30 XP · Abgeschlossen/);
      await page.locator("#ermCheck").click();
      assert.equal(await page.locator("#topXp").innerText(), `${(index + 1) * 30} XP`);
      earned[task] = await page.evaluate(task => JSON.parse(localStorage.getItem("workbenchlab-v1")).completedModels[task], task);
    }
    await page.locator("#ermTask").selectOption("fahrschule-ort");
    await page.locator("[data-erm-entity-name]").first().fill("Weiterbearbeiteter Entwurf");
    await page.locator("#ermCheck").click();
    assert.match(await page.locator("#ermResult").innerText(), /Noch nicht ganz/);
    assert.equal(await page.locator("#topXp").innerText(), "90 XP");
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).completedModels), earned);
    page.once("dialog", dialog => dialog.accept());
    await page.locator("#ermReset").click();
    await page.reload();
    assert.equal(await page.locator("#topXp").innerText(), "90 XP");
    assert.equal(await page.locator(".erm-entity").count(), 0);
    await page.locator("#ermCheck").click();
    assert.equal(await page.locator("#topXp").innerText(), "90 XP");
    await page.locator("#ermTask").selectOption("frei");
    assert.equal(await page.locator("#ermCheck").count(), 0);
    assert.equal(await page.locator("#ermProgress").count(), 0);
    const exportBackup = async () => {
      await page.locator("#backupButton").click();
      const downloaded = page.waitForEvent("download");
      await page.locator("#exportProgressButton").click();
      const payload = JSON.parse(fs.readFileSync(await (await downloaded).path(), "utf8"));
      await page.keyboard.press("Escape");
      return payload;
    };
    const payload = await exportBackup();
    assert.equal(payload.formatVersion, 8);
    assert.equal(payload.summary.xp, 90);
    assert.equal(payload.summary.completedTasks, 3);
    assert.deepEqual(payload.data.completedModels, earned);
    assert.deepEqual(payload.data.completedPractices, []);
    assert.equal(payload.data.activityDates.length, 1);

    const fresh = await browser.newContext({ acceptDownloads: true });
    try {
      const other = await fresh.newPage();
      await other.goto(base + "#home");
      await other.locator("#profileName").fill("NEW.QAA");
      await other.locator("#profileClass").fill("TEST");
      await other.locator('#profileForm [type="submit"]').click();
      await other.locator("#backupButton").click();
      other.once("dialog", dialog => dialog.accept());
      await other.locator("#progressFileInput").setInputFiles(asFile(payload));
      await other.locator("#backupDialog").waitFor({ state: "hidden" });
      await other.reload();
      assert.equal(await other.locator("#topXp").innerText(), "90 XP");
      await other.evaluate(() => { location.hash = "modeling/editor"; });
      await other.locator("#ermTask").selectOption("fahrradvermietung");
      await other.locator("#ermCheck").click();
      assert.equal(await other.locator("#topXp").innerText(), "90 XP");
    } finally { await fresh.close(); }

    const blocked = await browser.newContext({ acceptDownloads: true });
    try {
      await blocked.addInitScript(() => {
        const denied = () => { throw new DOMException("Storage denied", "SecurityError"); };
        Object.defineProperty(window, "localStorage", { configurable: true, get: denied });
        Object.defineProperty(window, "sessionStorage", { configurable: true, get: denied });
      });
      const offline = await blocked.newPage();
      const blockedErrors = [];
      offline.on("pageerror", error => blockedErrors.push(error.message));
      await offline.goto(base + "#home");
      await offline.locator("#profileName").fill("BLK.QAA");
      await offline.locator("#profileClass").fill("TEST");
      await offline.locator('#profileForm [type="submit"]').click();
      await offline.evaluate(models => {
        window.WORKBENCH_ERM.importDrafts({ task: "fahrschule-ort", models });
        location.hash = "modeling/editor";
      }, models);
      await offline.locator("#ermCheck").click();
      assert.equal(await offline.locator("#topXp").innerText(), "30 XP");
      await offline.locator("#backupButton").click();
      assert.match(await offline.locator("#backupStorageHint").innerText(), /Browserspeicher nicht verf/);
      const pending = offline.waitForEvent("download");
      await offline.locator("#exportProgressButton").click();
      const saved = JSON.parse(fs.readFileSync(await (await pending).path(), "utf8"));
      assert.equal(saved.summary.xp, 30);
      assert.deepEqual(saved.data.completedModels["fahrschule-ort"], earned["fahrschule-ort"]);
      assert.deepEqual(blockedErrors, []);
    } finally { await blocked.close(); }
    console.log("PASS model XP portability: independent browser import, no duplicate reward, denied storage still permits grading and file backup");

    const teacher = await context.newPage();
    await teacher.goto(base + "lehrkraft.html");
    await teacher.locator("#teacherFiles").setInputFiles(asFile(payload));
    await teacher.locator(".teacher-table").first().waitFor();
    const summary = await teacher.evaluate(payload => window.WORKBENCH_TEACHER.summarize(payload, window.WORKBENCH_CONTENT), payload);
    assert.equal(summary.xp, 90);
    assert.equal(summary.xpMismatch, false);
    assert.equal(summary.models.passed.length, 3);
    await teacher.close();
    const importBackup = async (value, accept = true) => {
      await page.locator("#backupButton").click();
      const pending = page.waitForEvent("dialog");
      const upload = page.locator("#progressFileInput").setInputFiles(asFile(sign(value)));
      const dialog = await pending;
      accept ? await dialog.accept() : await dialog.dismiss();
      await upload;
      if (accept) await page.locator("#backupDialog").waitFor({ state: "hidden" });
      else { await page.waitForFunction(() => document.querySelector("#backupStatus").textContent === "Laden abgebrochen."); await page.keyboard.press("Escape"); }
    };
    const legacy = structuredClone(payload);
    legacy.formatVersion = 7;
    delete legacy.data.completedModels;
    await importBackup(legacy);
    assert.equal(await page.locator("#topXp").innerText(), "0 XP");
    await importBackup(payload, false);
    assert.equal(await page.locator("#topXp").innerText(), "0 XP");
    await importBackup(payload);
    await page.reload();
    assert.equal(await page.locator("#topXp").innerText(), "90 XP");
    const invalid = structuredClone(payload);
    invalid.data.completedModels["fahrschule-ort"].entities = [];
    await importBackup(invalid);
    assert.equal(await page.locator("#topXp").innerText(), "60 XP");
    await importBackup(payload);
    console.log("PASS model XP: three once-only rewards, unchanged NAGOLD, independent snapshots survive edits/reset/reload, format 8 export/import/cancel/legacy, teacher rechecks and invalid snapshots rejected");

    await page.evaluate(models => window.WORKBENCH_ERM.importDrafts({ task: "fahrschule-ort", notation: "crowfoot", models }), models);
    await page.reload();
    await page.locator("#ermTask").selectOption("fahrschule-ort");
    await page.locator("#ermNotation").selectOption("crowfoot");
    const card = page.locator("[data-erm-relation-card]").first();
    for (const value of ["1:N", "N:1", "1:1", "M:N"]) for (const [from, to] of [[false, false], [true, false], [false, true], [true, true]]) {
      await card.selectOption(value);
      await page.locator('[data-erm-optional="from"]').first().setChecked(from);
      await page.locator('[data-erm-optional="to"]').first().setChecked(to);
      const ends = await page.locator(".erm-crowfoot-end").evaluateAll(nodes => nodes.map(node => ({ min: node.dataset.min, max: node.dataset.max, circle: Boolean(node.querySelector("circle")) })));
      assert.deepEqual(ends, value.split(":").map((maximum, index) => ({ min: [from, to][index] ? "0" : "1", max: maximum === "1" ? "1" : "many", circle: [from, to][index] })));
      assert.equal(await page.locator(".erm-card").count(), 0);
      assert.doesNotMatch(await page.locator("#ermDiagram").innerHTML(), /NaN|Infinity/);
    }
    await card.selectOption("1:N");
    await page.locator('[data-erm-optional="from"]').first().check();
    await page.locator('[data-erm-optional="to"]').first().uncheck();
    assert.match(await page.locator("#ermDiagram svg").getAttribute("aria-label"), /0\.\.1.*1\.\.N/);
    await page.reload();
    assert.equal(await page.locator("#ermNotation").inputValue(), "crowfoot");
    for (const theme of ["dark", "light"]) for (const width of [1440, 360, 320]) {
      await page.setViewportSize({ width, height: 950 });
      if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
      await page.evaluate(() => { document.documentElement.style.fontSize = "20px"; });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.locator("#ermDiagram").scrollIntoViewIfNeeded();
      const geometry = await page.locator(".erm-crowfoot-end").evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { width: r.width, height: r.height, stroke: getComputedStyle(node).stroke }; }));
      assert.ok(geometry.every(item => item.width > 0 && item.height > 0 && item.stroke !== "none"));
      const contrast = await page.locator("#ermDiagram").evaluate(node => {
        const luminance = color => {
          const rgb = color.match(/[\d.]+/g).map(Number);
          const linear = rgb.slice(0, 3).map(value => { const c = value / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
          return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
        };
        const background = luminance(getComputedStyle(node).backgroundColor);
        return [...node.querySelectorAll(".erm-crowfoot-end")].map(mark => {
          const stroke = luminance(getComputedStyle(mark).stroke);
          return (Math.max(stroke, background) + .05) / (Math.min(stroke, background) + .05);
        });
      });
      assert.ok(contrast.every(ratio => ratio >= 3), `Graphical contrast: ${theme}/${width}: ${contrast}`);
      const diagram = page.locator("#ermDiagram");
      await diagram.evaluate(node => { node.scrollLeft = 0; });
      const scrolls = await diagram.evaluate(node => node.scrollWidth > node.clientWidth);
      if (width < 640) assert.equal(scrolls, true);
      if (scrolls) {
        await diagram.focus();
        assert.equal(await diagram.evaluate(node => node === document.activeElement), true);
        await page.keyboard.press("ArrowRight");
        await page.waitForFunction(() => document.querySelector("#ermDiagram").scrollLeft > 0);
        await diagram.evaluate(node => { node.scrollLeft = 0; });
      }
      await page.locator("#ermDiagram").screenshot({ path: path.join(artifacts, `${theme}-${width}.png`) });
    }
    const download = page.waitForEvent("download");
    await page.locator("#ermImage").click();
    const svg = fs.readFileSync(await (await download).path(), "utf8");
    assert.match(svg, /<circle/);
    assert.doesNotMatch(svg, /NaN|Infinity|var\(--/);
    await page.locator("#ermNotation").selectOption("workbench");
    assert.equal(await page.locator(".erm-crowfoot-end").count(), 0);
    assert.equal(await page.locator(".erm-card").count(), 2);
    assert.deepEqual(errors, []);
    await context.close();
    console.log("PASS crowfoot: all cardinalities and optional ends, persistence, accessible meaning, nonblank symbols, dark/light desktop/360/320 with large text and standalone SVG export");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
