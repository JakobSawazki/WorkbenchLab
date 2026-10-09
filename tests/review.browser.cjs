// Claude, OPT-07: Wiederholungsrunde im Browser.
const artifacts = require("node:path").join(require("node:os").tmpdir(), "workbenchlab-tests");
require("node:fs").mkdirSync(artifacts, { recursive: true });
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const lessons = ["warum-datenbanken", "relation-und-schluessel", "eerm-grundlagen", "workbench-workflow", "select-projektion"];
const solved = ["predict-sortierung", "debug-fehlendes-komma", "predict-where-and", "order-where-sortierung", "debug-text-ohne-anfuehrungszeichen", "debug-and-statt-or"];

const banner = (page, text) => page.waitForFunction((expected) => document.querySelector("#practiceResult")?.textContent.includes(expected), text);
const solvers = {
  "predict-sortierung": async (page) => {
    await page.locator('input[name="choice-0"][value="1"]').check();
    await page.locator('input[name="choice-1"][value="2"]').check();
    await page.locator('#choicePracticeForm [type="submit"]').click();
  },
  "predict-where-and": async (page) => {
    await page.locator('input[name="choice-0"][value="1"]').check();
    await page.locator('#choicePracticeForm [type="submit"]').click();
  },
  "order-where-sortierung": async (page) => {
    const up = (index) => page.locator("#orderList > li").nth(index).locator('[data-order-move="-1"]').click();
    await up(2); await up(1); await up(3); await up(2);
    await page.locator('#orderPracticeForm [type="submit"]').click();
  },
  "debug-fehlendes-komma": (page) => fix(page, "SELECT vorname, nachname, ort FROM fahrschueler ORDER BY nachname, vorname;"),
  "debug-text-ohne-anfuehrungszeichen": (page) => fix(page, "SELECT nachname, vorname FROM fahrschueler WHERE ort = 'Esslingen' ORDER BY nachname;"),
  "debug-and-statt-or": (page) => fix(page, "SELECT nachname, vorname, ort FROM fahrschueler WHERE ort IN ('Stuttgart', 'Tuebingen') ORDER BY nachname, vorname;")
};
async function fix(page, sql) {
  await page.locator("#sqlEditor").fill(sql);
  await page.locator("#checkSqlButton").click();
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addInitScript(([doneLessons, donePractices]) => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: doneLessons, completedPractices: donePractices }));
      }, [lessons, solved]);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + "#sql");
      await page.locator("#runtimeChip.is-ready").waitFor();

      // Einstieg im SQL-Labor.
      const teaser = page.locator(".review-teaser");
      assert.match(await teaser.innerText(), /Heute 0 von 5 bereits gelösten Aufgaben wiederholt/);
      await teaser.locator('[data-route="sql/wiederholen"]').click();
      await page.locator(".review-list li").first().waitFor();
      assert.equal(await page.locator("#viewTitle").innerText(), "Wiederholungsrunde");
      const picks = await page.locator(".review-list [data-practice]").evaluateAll((cards) => cards.map((card) => card.dataset.practice));
      assert.equal(picks.length, 5);
      assert.equal(new Set(picks).size, 5);
      for (const id of picks) assert.ok(solved.includes(id), id);
      assert.equal(await page.locator(".review-progress").getAttribute("value"), "0");

      // Die Auswahl bleibt am selben Tag stehen, auch nach Neuladen und einer neu gelösten Aufgabe.
      await page.evaluate(() => {
        const state = JSON.parse(localStorage.getItem("workbenchlab-v1"));
        state.completedPractices.push("sql-projection");
        localStorage.setItem("workbenchlab-v1", JSON.stringify(state));
      });
      await page.reload();
      await page.locator(".review-list li").first().waitFor();
      assert.deepEqual(await page.locator(".review-list [data-practice]").evaluateAll((cards) => cards.map((card) => card.dataset.practice)), picks);
      const xpStart = await page.locator("#topXp").innerText();

      // Jede Aufgabe erneut lösen; der Rückweg führt in die Runde.
      for (const [index, id] of picks.entries()) {
        await page.locator(`.review-list [data-practice="${id}"]`).click();
        await page.locator('.detail-actions [data-route="sql/wiederholen"]').waitFor();
        await solvers[id](page);
        await banner(page, "löst");
        await page.locator('.detail-actions [data-route="sql/wiederholen"]').click();
        await page.locator(".review-list li").first().waitFor();
        assert.match(await page.locator(".review-head h2").innerText(), new RegExp(`Heute ${index + 1} von 5 wiederholt`));
        assert.equal(await page.locator(".review-list li.is-reviewed").count(), index + 1);
      }
      assert.match(await page.locator(".review-complete").innerText(), /Runde geschafft/);
      assert.equal(await page.locator("#topXp").innerText(), xpStart);

      // Wiederholen zählt als Aktivität; der Tagesstand übersteht das Neuladen und steht nicht im Lernstand.
      const stored = await page.evaluate(() => ({
        state: JSON.parse(localStorage.getItem("workbenchlab-v1")),
        review: JSON.parse(localStorage.getItem("workbenchlab-review-v1"))
      }));
      assert.equal(stored.state.activityDates.length, 1);
      assert.equal(stored.review.ids.length, 5);
      assert.equal(JSON.stringify(stored.state).includes("review"), false);
      await page.reload();
      await page.locator(".review-complete").waitFor();
      await page.goto(base + "#sql");
      assert.match(await page.locator(".review-teaser").innerText(), /Für heute geschafft/);

      // Außerhalb der Runde erscheint der Rückweg nicht.
      await page.locator(`[data-practice="${picks[0]}"]`).first().click();
      await page.locator(".lesson-head").waitFor();
      assert.equal(await page.locator('.detail-actions [data-route="sql/wiederholen"]').count(), 0);

      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf bei ${width}px`);
      await page.goto(base + "#sql/wiederholen");
      await page.locator(".review-complete").waitFor();
      await page.screenshot({ path: `${artifacts}/review-${width}.png`, animations: "disabled" });
      assert.deepEqual(errors, []);
      await context.close();
    }

    // Ohne gelöste Aufgaben: kein Einstieg, verständlicher Leerzustand.
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
    });
    const page = await context.newPage();
    await page.goto(base + "#sql");
    await page.locator("#runtimeChip.is-ready").waitFor();
    assert.equal(await page.locator(".review-teaser").count(), 0);
    await page.goto(base + "#sql/wiederholen");
    await page.getByText("Noch nichts zu wiederholen").waitFor();
    assert.equal(await page.locator(".review-list li").count(), 0);
    console.log("PASS: review round teaser, five stable daily picks, return path, progress per solved task, no XP, counts as activity, survives reload, not in progress data, empty state, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
