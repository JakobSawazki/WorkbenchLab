const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const artifacts = require("./artifacts.cjs")("sql-workspace");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4202/";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const theme of ["dark", "light"]) for (const width of [1440, 360]) {
      const context = await browser.newContext({ viewport: { width, height: 950 }, acceptDownloads: true });
      await context.addInitScript(({ theme, width }) => {
        if (!localStorage.getItem("workbenchlab-v1")) {
          localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedCommands: ["cmd-select"] }));
          localStorage.setItem("workbenchlab-theme-v1", theme);
          localStorage.setItem("workbenchlab-appearance-v1", JSON.stringify({ fontSize: width === 360 ? 20 : 16, palettes: {} }));
        }
      }, { theme, width });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("dialog", dialog => dialog.accept());
      await page.goto(base + "#sql/frei");
      await page.locator("#runtimeChip.is-ready").waitFor();
      assert.equal(await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize)), width === 360 ? 20 : 16);
      const xp = await page.locator("#topXp").innerText();
      await page.locator("#playgroundSchema").selectOption("leer");
      const editor = page.locator("#sqlEditor");
      const output = page.locator("#sqlOutput");
      const run = async sql => {
        if (sql !== undefined) await editor.fill(sql);
        await page.locator("#playgroundRunButton").click();
        await page.waitForFunction(() => !document.querySelector("#playgroundRunButton").disabled);
      };
      assert.equal(await page.locator("#playgroundScript option").count(), 13);
      await page.locator("#playgroundScript").selectOption("assets/sql/l1-4-fahrschule-beispieldaten.sql");
      await page.locator("#playgroundScriptOpen").click();
      await page.waitForFunction(() => document.querySelector("#sqlEditor").value.includes("USE fahrschule"));
      await run();
      assert.match(await output.innerText(), /Datenbank fahrschule gibt es noch nicht/);
      assert.equal(await page.locator(".workspace-database").count(), 0, "Insert-only scripts must not invent prerequisite tables or solutions");
      await page.locator("#playgroundScript").selectOption("assets/sql/l3-2-mehrtabellen-testdaten.sql");
      await page.locator("#playgroundScriptOpen").click();
      await page.waitForFunction(() => document.querySelector("#sqlEditor").value.includes("CREATE TABLE fahrstunden"));
      assert.equal(await page.locator("#playgroundCatalog .schema-card").count(), 0, "Opening a script must not execute it");
      await run();
      assert.equal(await output.locator(".sql-error").count(), 0, await output.innerText());
      assert.equal(await page.locator(".workspace-database").count(), 2);
      assert.match(await page.locator("#playgroundCatalog").innerText(), /workbenchlab_l3_2_fahrradvermietung/);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `${artifacts}/${theme}-${width}-loaded.png`, animations: "disabled" });
      await run("SELECT f.fahrradnr,COALESCE(SUM(DATEDIFF(v.bis,v.von)),0) AS tage FROM workbenchlab_l3_2_fahrradvermietung.fahrraeder f LEFT JOIN workbenchlab_l3_2_fahrradvermietung.vermietungen v ON f.fahrradnr=v.fahrradnr GROUP BY f.fahrradnr ORDER BY 1;");
      assert.deepEqual(await output.locator("tbody tr").allTextContents(), ["160", "240", "35", "40", "50"]);
      const draft = await editor.inputValue();
      await page.locator('[data-playground-table="`workbenchlab_l3_2_fahrschule`.`orte`"]').click();
      await page.getByText("2 Ergebniszeilen", { exact: true }).waitFor();
      assert.equal(await editor.inputValue(), draft, "Inspecting a table must preserve the script");
      await run("USE workbenchlab_l3_2_fahrschule; CREATE TABLE extra(id INT); INSERT INTO extra VALUES(7); SELECT * FROM missing;");
      assert.match(await output.innerText(), /3 Anweisungen wurden zuvor ausgeführt/);
      assert.match(await page.locator("#playgroundCatalog").innerText(), /extra/);
      assert.doesNotMatch(await output.innerText(), /__wbl_/);
      await run("SELECT id FROM extra;");
      assert.equal(await output.locator("tbody td").innerText(), "7");
      await run("SELECT id FROM extra; SELECT id FROM extra WHERE id=999;");
      assert.match(await output.innerText(), /0 Ergebniszeilen/);
      assert.equal(await output.locator("tbody tr").count(), 0);
      await page.locator("#playgroundFile").setInputFiles({ name: "mein.sql", mimeType: "text/plain", buffer: Buffer.from("SELECT 42 AS antwort;") });
      await page.waitForFunction(() => document.querySelector("#sqlEditor").value === "SELECT 42 AS antwort;");
      await run();
      assert.equal(await output.locator("tbody td").innerText(), "42");
      const downloadPromise = page.waitForEvent("download");
      await page.locator("#playgroundDownloadButton").click();
      assert.match((await downloadPromise).suggestedFilename(), /frei-leer\.sql$/);
      await page.locator("#playgroundResetButton").click();
      assert.equal(await page.locator(".workspace-database").count(), 0);
      assert.equal(await editor.inputValue(), "SELECT 42 AS antwort;");
      await page.reload();
      await page.locator("#runtimeChip.is-ready").waitFor();
      await page.locator("#playgroundSchema").selectOption("leer");
      assert.equal(await editor.inputValue(), "SELECT 42 AS antwort;");
      assert.equal(await page.locator(".workspace-database").count(), 0, "Runtime data is session-only, not silently restored");
      assert.equal(await page.locator("#topXp").innerText(), xp);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme}/${width} overflow`);
      await page.screenshot({ path: `${artifacts}/${theme}-${width}.png`, fullPage: true, animations: "disabled" });
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log("PASS: lesson SQL scripts, separate databases, live catalog, partial errors, file open/export, drafts, no XP, dark/light desktop/mobile.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
