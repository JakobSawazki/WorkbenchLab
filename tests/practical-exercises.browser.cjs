const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const output = require("./artifacts.cjs")("practical-exercises");
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}#home`);
    await page.locator("#profileDialog[open]").waitFor();
    await page.keyboard.press("Control+Alt+s");
    await page.locator("#developerModeButton").click();
    await page.locator("#profileName").fill("TES.TIA");
    await page.locator("#profileClass").fill("TEST");
    await page.locator("#profileForm button[type=submit]").click();
    const ids = ["sql-create-course", "sql-students-without-hours", "sql-repeat-rentals", "erm-course-table", "erm-recurring-assignments", "sql-update-hours", "sql-delete-student", "sql-insert"];
    const practices = await page.evaluate((ids) => ids.map((id) => window.WORKBENCH_CONTENT.practices.find((item) => item.id === id)), ids);
    const completed = () => page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")).completedPractices);
    for (const item of practices) {
      await page.goto(`${base}#lesson/${item.lessonId}`);
      await page.locator(`.lesson-exercises [data-practice="${item.id}"]`).click();
      assert.ok(page.url().endsWith(`#practice/${item.id}`));
      if (item.type === "sql") {
        const wrong = item.id === "sql-create-course" ? item.solution.replace("DATE", "INT")
          : item.id === "sql-students-without-hours" ? item.solution.replace("LEFT JOIN", "JOIN")
          : item.id === "sql-repeat-rentals" ? item.solution.replaceAll("COUNT(m.vertragnr)", "COUNT(DISTINCT m.fahrradnr)")
          : item.solution + (item.id === "sql-insert" ? " UPDATE orte SET ort='Falsch' WHERE ortnr=1;" : " DELETE FROM fahrschueler WHERE schuelernr=1;");
        await page.locator("#sqlEditor").fill(wrong);
        await page.locator("#checkSqlButton").click();
        await page.locator("#checkSqlButton").waitFor({ state: "visible" });
        await page.waitForFunction(() => !document.querySelector("#checkSqlButton").disabled);
        assert.ok(!(await completed()).includes(item.id), item.id);
        await page.locator("#sqlEditor").fill(item.solution);
        await page.reload();
        assert.equal(await page.locator("#sqlEditor").inputValue(), item.solution);
        const ownExport = `-- Meine eigene Arbeitsnotiz\n${item.solution}\n`;
        await page.locator("#sqlEditor").fill(ownExport);
        const sqlDownload = page.waitForEvent("download");
        await page.locator("#downloadSqlButton").click();
        const exportedSql = await sqlDownload;
        assert.equal(exportedSql.suggestedFilename(), `workbenchlab-${item.id}.sql`);
        const sqlFile = path.join(output, exportedSql.suggestedFilename());
        await exportedSql.saveAs(sqlFile);
        assert.equal(fs.readFileSync(sqlFile, "utf8"), ownExport);
        await page.locator("#sqlEditor").fill(item.solution);
        await page.locator("#coachSqlButton").click();
        await page.waitForFunction(() => !document.querySelector("#coachSqlButton").disabled);
        assert.ok(!(await completed()).includes(item.id), "Coach must not award XP");
        await page.locator("#checkSqlButton").click();
        await page.waitForFunction((id) => JSON.parse(localStorage.getItem("workbenchlab-v1")).completedPractices.includes(id), item.id);
      } else {
        await page.locator('#diagramPracticeForm button[type="submit"]').click();
        assert.ok(!(await completed()).includes(item.id));
        for (const slot of item.slots) await page.locator(`[data-slot-id="${slot.id}"]`).selectOption(slot.answer);
        await page.reload();
        for (const slot of item.slots) assert.equal(await page.locator(`[data-slot-id="${slot.id}"]`).inputValue(), slot.answer);
        await page.locator('#diagramPracticeForm button[type="submit"]').click();
        assert.ok((await completed()).includes(item.id));
      }
      const xp = await page.locator("#topXp").innerText();
      if (item.type === "sql") {
        await page.locator("#checkSqlButton").click();
        await page.waitForFunction(() => !document.querySelector("#checkSqlButton").disabled);
      } else await page.locator('#diagramPracticeForm button[type="submit"]').click();
      assert.equal(await page.locator("#topXp").innerText(), xp);
      for (const [width, theme] of [[1440, "dark"], [390, "dark"], [390, "light"]]) {
        await page.setViewportSize({ width, height: 1000 });
        if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${item.id} ${width}`);
        await page.waitForFunction(() => !document.querySelector("#toastRegion").children.length);
        if (item.type === "diagram") await page.locator(".diagram-practice-canvas").screenshot({ path: path.join(output, `${item.id}-${width}-${theme}-diagram.png`) });
        await page.screenshot({ path: path.join(output, `${item.id}-${width}-${theme}.png`) });
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    await page.locator("#backupButton").click();
    const download = page.waitForEvent("download");
    await page.locator("#exportProgressButton").click();
    const file = path.join(output, "exercises.json");
    await (await download).saveAs(file);
    const saved = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const item of practices) {
      assert.ok(saved.data.completedPractices.includes(item.id));
      if (item.type === "sql") assert.equal(saved.data.drafts[item.id], item.solution);
      else for (const slot of item.slots) assert.equal(saved.data.slotDrafts[item.id][slot.id], slot.answer);
    }
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("workbenchlab-v1"));
      state.drafts = {};
      state.slotDrafts = {};
      state.completedPractices = [];
      localStorage.setItem("workbenchlab-v1", JSON.stringify(state));
    });
    await page.reload();
    await page.locator("#backupButton").click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#progressFileInput").setInputFiles(file);
    await page.locator("#backupDialog").waitFor({ state: "hidden" });
    const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("workbenchlab-v1")));
    for (const item of practices) {
      assert.ok(restored.completedPractices.includes(item.id));
      if (item.type === "sql") assert.equal(restored.drafts[item.id], item.solution);
      else for (const slot of item.slots) assert.equal(restored.slotDrafts[item.id][slot.id], slot.answer);
    }
    const locked = await browser.newPage();
    await locked.addInitScript(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TES.TIA", className: "TEST" })));
    // Seit 0.38.0 sind Übungen frei zugänglich (Entscheidung Jakob, 2026-10-09; Test angepasst von Claude).
    // Die Einheit selbst bleibt gesperrt, bis die vorherige abgeschlossen ist.
    await locked.goto(`${base}#practice/sql-create-course`);
    await locked.locator("#sqlEditor").waitFor();
    assert.equal(await locked.evaluate(() => location.hash), "#practice/sql-create-course");
    await locked.goto(`${base}#lesson/workbench-workflow`);
    await locked.waitForURL(/#path$/);
    await locked.close();
    assert.deepEqual(errors, []);
    console.log("PASS: five new exercises and three protected mutations, wrong/right results, persistence, coach without XP, no duplicate XP, SQL download, JSON roundtrip, free exercises with locked lesson and 24 desktop/mobile views.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
