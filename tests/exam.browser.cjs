// Claude, OPT-07: Klausurtraining im Browser.
const artifacts = require("node:path").join(require("node:os").tmpdir(), "workbenchlab-tests");
require("node:fs").mkdirSync(artifacts, { recursive: true });
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const { loadContent } = require("../tools/build-expected.cjs");
const content = loadContent().WORKBENCH_CONTENT;
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const lessons = ["warum-datenbanken", "relation-und-schluessel", "eerm-grundlagen", "workbench-workflow", "select-projektion"];

// Löst die gerade geöffnete Aufgabe über die Oberfläche, unabhängig vom Aufgabentyp.
async function solve(page, id) {
  const item = content.practices.find(entry => entry.id === id);
  assert.ok(item, `Lokale Testaufgabe fehlt: ${id}`);
  const practice = { type: item.type, variant: item.variant || "", sql: item.check?.expectedSql || item.check?.referenceSql || item.solution || "", correct: (item.questions || []).map(question => question.correct), lines: item.lines?.length || 0 };
  if (practice.type === "sql") {
    await page.locator("#sqlEditor").fill(practice.sql);
    await page.locator("#checkSqlButton").click();
  } else if (practice.type === "order") {
    for (let position = 0; position < practice.lines; position += 1) {
      for (;;) {
        const index = await page.locator("#orderList > li").evaluateAll((items, wanted) => items.findIndex((item) => Number(item.dataset.line) === wanted), position);
        if (index === position) break;
        await page.locator("#orderList > li").nth(index).locator('[data-order-move="-1"]').click();
      }
    }
    await page.locator('#orderPracticeForm [type="submit"]').click();
  } else {
    for (const [index, correct] of practice.correct.entries()) {
      await page.locator(`input[name="choice-${index}"][value="${correct}"]`).check();
    }
    await page.locator('#choicePracticeForm [type="submit"]').click();
  }
  try {
    await page.waitForFunction(() => /gelöst|besteht die Prüfung/.test(document.querySelector("#practiceResult")?.textContent || ""), null, { timeout: 8000 });
  } catch (error) {
    const seen = await page.evaluate(() => ({ hash: location.hash, banner: document.querySelector("#practiceResult")?.textContent.trim(), coach: document.querySelector("#sqlCoach")?.innerText }));
    throw new Error(`Aufgabe ${id} (${practice.type}/${practice.variant}) nicht bestanden: ${JSON.stringify(seen)}`);
  }
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addInitScript((doneLessons) => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: doneLessons }));
      }, lessons);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + "#sql");
      await page.locator("#runtimeChip.is-ready").waitFor();

      // Einstieg und Startbildschirm.
      await page.locator('.exam-teaser [data-route="sql/klausur"]').click();
      await page.locator("#examStart").waitFor();
      assert.equal(await page.locator("#viewTitle").innerText(), "Klausurtraining");
      assert.equal(await page.locator(".review-list li").count(), 0);

      // Start: fünf freigeschaltete Aufgaben, die Uhr läuft.
      await page.locator("#examStart").click();
      await page.locator(".review-list li").first().waitFor();
      const picks = await page.locator(".review-list [data-practice]").evaluateAll((cards) => cards.map((card) => card.dataset.practice));
      assert.equal(picks.length, 5);
      assert.equal(new Set(picks).size, 5);
      assert.equal(await page.locator(".review-list .is-locked").count(), 0);
      const first = await page.locator("#examClock").innerText();
      assert.match(first, /^(20:00|19:5\d)$/);
      await page.waitForFunction((value) => document.querySelector("#examClock").textContent !== value, first);
      assert.equal(await page.locator("#examClock").getAttribute("role"), "timer");

      // Die Runde übersteht Neuladen; der Einstieg im SQL-Labor zeigt die laufende Runde.
      await page.reload();
      await page.locator(".review-list li").first().waitFor();
      assert.deepEqual(await page.locator(".review-list [data-practice]").evaluateAll((cards) => cards.map((card) => card.dataset.practice)), picks);
      await page.goto(base + "#sql");
      assert.match(await page.locator(".exam-teaser").innerText(), /Eine Runde läuft noch/);
      await page.locator('.exam-teaser [data-route="sql/klausur"]').click();

      // Zwei Aufgaben in der Zeit lösen; der Rückweg führt in die Runde.
      for (const [index, id] of picks.slice(0, 2).entries()) {
        await page.locator(`.review-list [data-practice="${id}"]`).click();
        await page.locator('.detail-actions [data-route="sql/klausur"]').waitFor();
        await solve(page, id);
        await page.locator('.detail-actions [data-route="sql/klausur"]').click();
        await page.locator(".review-list li").first().waitFor();
        assert.match(await page.locator(".review-head h2").innerText(), new RegExp(`${index + 1} von 5 gelöst`));
      }

      // Zeit künstlich ablaufen lassen: Hinweis erscheint, eine weitere Lösung zählt getrennt.
      await page.evaluate(() => {
        const exam = JSON.parse(localStorage.getItem("workbenchlab-exam-v1"));
        const shift = 21 * 60000;
        exam.startedAt -= shift;
        Object.keys(exam.solved).forEach((id) => { exam.solved[id] -= shift; });
        localStorage.setItem("workbenchlab-exam-v1", JSON.stringify(exam));
      });
      await page.reload();
      await page.locator("#examClock").waitFor();
      assert.equal(await page.locator("#examClock").innerText(), "00:00");
      assert.match(await page.locator("#examTimeUp").innerText(), /Zeit ist abgelaufen/);
      await page.locator(`.review-list [data-practice="${picks[2]}"]`).click();
      await solve(page, picks[2]);
      await page.locator('.detail-actions [data-route="sql/klausur"]').click();

      // Auswertung.
      await page.locator("#examFinish").click();
      await page.locator(".exam-result").waitFor();
      const result = await page.locator(".exam-result").innerText();
      assert.match(result, /2 von 5 Aufgaben in der Zeit gelöst/);
      assert.match(result, /Benötigte Zeit: 20:00 von 20:00 Minuten/);
      assert.match(result, /1 weitere Aufgabe nach Ablauf der Zeit gelöst/);
      const rows = await page.locator(".exam-table tbody tr").count();
      assert.ok(rows >= 1 && rows <= 3);
      assert.match(await page.locator(".exam-table tbody").innerText(), /L1\.[56] · /);
      assert.equal(await page.locator(".review-list li.is-reviewed").count(), 3);
      assert.match(await page.locator(".review-list").innerText(), /nach der Zeit gelöst/);
      assert.ok(await page.locator("#examRestart").evaluate((button) => button === document.activeElement));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Überlauf bei ${width}px`);
      await page.screenshot({ path: `${artifacts}/exam-${width}.png`, animations: "disabled" });

      // Nicht im Lernstand; neue Runde beginnt beim Startbildschirm.
      assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-v1").includes("startedAt")), false);
      await page.locator("#examRestart").click();
      await page.locator("#examStart").waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-exam-v1")), null);
      assert.deepEqual(errors, []);
      await context.close();
    }

    // Ohne freigeschaltete SQL-Aufgaben: kein Einstieg, verständlicher Hinweis.
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
    });
    const page = await context.newPage();
    await page.goto(base + "#sql");
    await page.locator("#runtimeChip.is-ready").waitFor();
    assert.equal(await page.locator(".exam-teaser").count(), 0);
    await page.goto(base + "#sql/klausur");
    await page.getByText("Noch nicht genug Aufgaben freigeschaltet").waitFor();
    assert.equal(await page.locator("#examStart").count(), 0);
    console.log("PASS: exam training start, five unlocked picks, running clock, survives reload, return path, solving every exercise type, time-up notice, late solutions counted separately, evaluation per lesson, restart, not in progress data, empty state, desktop/mobile.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
