const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const initSqlJs = require("../vendor/sql.js/sql-wasm.js");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const SQL = await initSqlJs();
  try {
    for (const width of [1440, 360]) {
      const page = await browser.newPage({ viewport: { width, height: 840 } });
      await page.addInitScript(() => {
        localStorage.setItem("workbenchlab-sidebar-width-v1", "220");
        localStorage.setItem("workbenchlab-appearance-v1", JSON.stringify({ fontSize: 20, palettes: {} }));
      });
      await page.goto(base + "?screenshot=1#home");
      if (width === 360) await page.locator("#mobileMenuButton").click();
      const nav = page.getByRole("button", { name: "Klausurvorbereitung", exact: true });
      assert.ok(await nav.evaluate(el => el.scrollWidth <= el.clientWidth + 1));
      await nav.click();
      await page.getByRole("heading", { name: "Lernzettel: Relationale Datenbanken" }).waitFor();
      assert.ok(await nav.evaluate(el => el.classList.contains("is-active")));
      const article = page.locator(".exam-preparation");
      const rows = await article.locator("tbody tr").allTextContents();
      assert.equal(rows.length, 5);
      const details = article.locator("details");
      assert.ok(await details.locator("ol").isHidden());
      await details.locator("summary").press("Enter");
      assert.ok(await details.locator("ol").isVisible());
      const queries = await article.locator("pre code").allTextContents();
      const db = new SQL.Database();
      try {
        db.run("CREATE TABLE medien (mediennr INTEGER PRIMARY KEY, titel TEXT, medienart TEXT, bestand INTEGER)");
        for (const row of await article.locator("tbody tr").all()) {
          const [nr, title, type, stock] = await row.locator("td").allTextContents();
          db.run("INSERT INTO medien VALUES (?, ?, ?, ?)", [Number(nr), title, type, Number(stock)]);
        }
        assert.equal(queries.length, 4);
        assert.deepEqual(db.exec(queries[0])[0].values, [[102, "Planet Erde"], [104, "Die Welle"]]);
        assert.deepEqual(db.exec(queries[1])[0].values.slice(0, 2), [["Die Welle", "Buch"], ["Die Welle", "DVD"]]);
        assert.deepEqual(db.exec(queries[2])[0].values.map(row => row[0]).sort(), [103, 104]);
        assert.deepEqual(db.exec(queries[3])[0].values, [["Die Welle", 4], ["Wunder", 7]]);
      } finally { db.close(); }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await article.getByRole("button", { name: "Klausurtraining", exact: true }).click();
      await page.waitForURL("**#sql/klausur");
      await page.close();
    }
    console.log("PASS: BK2 worksheet navigation, collapsible answers, SQL results, desktop and mobile.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
