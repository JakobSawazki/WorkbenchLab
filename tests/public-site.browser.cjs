// Claude, 0.38.0: prüft die veröffentlichte Fassung (_site) ohne Lösungsanweisungen,
// freie Übungen und NAGOLD. Der Test baut _site selbst und liefert es auf einem freien Port aus.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");
const { buildSite } = require("../tools/build-site.cjs");

const root = path.resolve(__dirname, "..");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".wasm": "application/wasm", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png" };

(async () => {
  buildSite(root);
  const site = path.join(root, "_site");
  const server = http.createServer((request, response) => {
    const name = decodeURIComponent(new URL(request.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
    const file = path.join(site, name);
    if (!file.startsWith(site) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: ["warum-datenbanken", "relation-und-schluessel"] }));
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "#sql");
    await page.locator("#runtimeChip.is-ready").waitFor();

    // Veröffentlichte Daten enthalten keine Lösungsanweisungen, aber alle Sollergebnisse.
    const leak = await page.evaluate(() => window.WORKBENCH_CONTENT.practices.filter((item) => item.solution !== undefined || item.fixed !== undefined || item.check?.expectedSql !== undefined || item.check?.referenceSql !== undefined || (item.questions || []).some((q) => q.proofSql !== undefined)).map((item) => item.id));
    assert.deepEqual(leak, []);
    assert.ok(await page.evaluate(() => Object.keys(window.WORKBENCH_EXPECTED).length) >= 25);
    for (const file of ["content.js", "learning-path.js", "practical-exercises.js", "debug-exercises.js"]) {
      const text = await (await page.request.get(base + file)).text();
      assert.doesNotMatch(text, /^\s*(?:solution|expectedSql|fixed):\s*"/m, file);
    }

    // Übungen sind frei zugänglich; nichts ist gesperrt, spätere Einheiten sind als Vorgriff markiert.
    assert.equal(await page.locator("main .practice-card.is-locked").count(), 0);
    assert.ok(await page.locator("main .practice-ahead").count() > 5);
    const xpStart = Number.parseInt(await page.locator("#topXp").innerText(), 10);
    await page.locator("#backupButton").click();
    const version = await page.evaluate(() => window.WORKBENCH_CONTENT.version);
    assert.equal(await page.locator("#offlinePackageLink").getAttribute("href"), `https://github.com/JakobSawazki/WorkbenchLab/releases/download/v${version}/WorkbenchLab-${version}-offline.zip`);
    assert.equal(await page.locator("#offlinePackageLink").isVisible(), true);
    await page.keyboard.press("Escape");
    const banner = (text) => page.waitForFunction((expected) => document.querySelector("#practiceResult")?.textContent.includes(expected), text);

    // Abfrage-Aufgabe: falsche und richtige Lösung werden allein mit dem Sollergebnis beurteilt.
    await page.locator('[data-practice="sql-projection"]').click();
    const editor = page.locator("#sqlEditor");
    await editor.fill("SELECT schuelernr, vorname, nachname FROM fahrschueler ORDER BY vorname;");
    await page.locator("#checkSqlButton").click();
    await banner("Noch nicht ganz");
    assert.match(await page.locator("#sqlCoach").innerText(), /Reihenfolge noch nicht/);
    await editor.fill("SELECT schuelernr, vorname, nachname FROM fahrschueler ORDER BY nachname;");
    await page.locator("#checkSqlButton").click();
    await banner("Aufgabe gelöst");
    assert.equal(Number.parseInt(await page.locator("#topXp").innerText(), 10), xpStart + 35);

    // Fehlersuche und eine Änderungsaufgabe (INSERT) funktionieren ebenso.
    await page.goto(base + "#practice/debug-where-statt-having");
    await page.locator(".debug-callout").waitFor();
    await editor.fill("SELECT ort, COUNT(*) AS anzahl FROM fahrschueler GROUP BY ort HAVING COUNT(*) > 1 ORDER BY ort;");
    await page.locator("#checkSqlButton").click();
    await banner("Aufgabe gelöst");
    await page.goto(base + "#practice/sql-insert");
    await page.locator("#sqlEditor").waitFor();
    await editor.fill("INSERT INTO orte VALUES (6, '71638', 'Stuttgart');");
    await page.locator("#checkSqlButton").click();
    await banner("Noch nicht ganz");
    await editor.fill("INSERT INTO orte VALUES (6, '71638', 'Ludwigsburg');");
    await page.locator("#checkSqlButton").click();
    await banner("Aufgabe gelöst");

    // Einheiten bleiben in Reihenfolge gesperrt: L1.3 offen, L1.4 nicht.
    await page.goto(base + "#lesson/workbench-workflow");
    await page.waitForFunction(() => location.hash === "#path");
    await page.goto(base + "#lesson/eerm-grundlagen");
    await page.locator(".lesson-head").waitFor();
    assert.equal(await page.evaluate(() => location.hash), "#lesson/eerm-grundlagen");

    // The new workspace must also work from the filtered deployment, not only sources.
    await page.goto(base + "#sql/frei");
    await page.locator("#playgroundSchema").selectOption("leer");
    await page.locator("#playgroundScript").selectOption("assets/sql/l1-1-workbench-einstieg.sql");
    await page.locator("#playgroundScriptOpen").click();
    await page.waitForFunction(() => document.querySelector("#sqlEditor").value.includes("CREATE TABLE"));
    await page.locator("#playgroundRunButton").click();
    await page.locator("#sqlOutput table").waitFor();
    assert.equal(await page.locator("#sqlOutput tbody tr").count(), 2);
    assert.match(await page.locator("#playgroundCatalog").innerText(), /workbenchlab_l1_1_einstieg/);
    assert.equal((await page.request.get(base + "resources/workbenchlab-loesungen.json")).status(), 404);

    // NAGOLD im Profil: zwei abgeschlossene Einheiten ergeben 10.
    await page.locator("#editProfileButton").click();
    await page.locator("#profileDialog").waitFor();
    assert.match(await page.locator("#nagoldTotal").innerText(), /10 NAGOLD/);
    await page.locator("#nagoldTotal").click();
    assert.equal(await page.locator("#nagoldRows tr").count(), 2);
    await page.keyboard.press("Escape");
    assert.deepEqual(errors, []);
    console.log("PASS: published site without solution statements, checks by expected results (query, debug, insert), free exercises with preview mark, lessons still sequential, NAGOLD in profile.");
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
