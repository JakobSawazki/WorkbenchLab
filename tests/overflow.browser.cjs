// Claude, 0.41.5: Keine Seite läuft seitlich über – bei gängigen Telefon-, Tablet- und Laptop-Breiten
// und mit der größten einstellbaren Schrift. Bisher prüften die Tests nur 1440 und 390 Pixel mit
// Standardschrift; dazwischen (z. B. 768, 1024, 1280) liefen „SQL-Labor“ und „Modellieren“ über.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const { loadContent } = require("../tools/build-expected.cjs");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const content = loadContent().WORKBENCH_CONTENT;
const lessons = Array.from(content.lessons).map((lesson) => lesson.id);
const practices = Array.from(content.practices).map((practice) => practice.id);
const commands = Array.from(content.commands).map((command) => command.id);
const routes = ["home", "path", "sql", "sql/frei", "sql/wiederholen", "sql/klausur", "modeling", "modeling/editor", "commands", "achievements", "reference", "notes",
  ...lessons.map((id) => `lesson/${id}`), ...practices.map((id) => `practice/${id}`), ...commands.slice(0, 3).map((id) => `command/${id}`)];
// 641, 901 und 1081 liegen direkt über den Umbruchpunkten des Layouts (640, 900, 1080).
const plans = [
  { fontSize: 16, widths: [320, 360, 641, 768, 901, 1024, 1081, 1280] },
  { fontSize: 20, widths: [320, 390, 768, 1081] }
];

const overflow = () => Math.round(document.documentElement.scrollWidth - window.innerWidth);
const dialogProblem = () => {
  const dialog = [...document.querySelectorAll("dialog[open]")].at(-1);
  if (!dialog) return "kein Dialog offen";
  const rect = dialog.getBoundingClientRect();
  if (rect.left < -1 || rect.right > window.innerWidth + 1) return `ragt hinaus (${Math.round(rect.left)} bis ${Math.round(rect.right)} von ${window.innerWidth})`;
  return dialog.scrollWidth > dialog.clientWidth + 2 ? "Inhalt läuft seitlich über" : "";
};

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const problems = [];
  let views = 0;
  try {
    for (const { fontSize, widths } of plans) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      await context.addInitScript(([doneLessons, donePractices, size]) => {
        if (!localStorage.getItem("workbenchlab-v1")) {
          localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: doneLessons, completedPractices: donePractices }));
          localStorage.setItem("workbenchlab-appearance-v1", JSON.stringify({ fontSize: size, palettes: {} }));
        }
        sessionStorage.setItem("workbenchlab-developer-v1", "active");
      }, [lessons.slice(0, 3), practices.slice(0, 30), fontSize]);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base + "#home", { waitUntil: "networkidle" });
      await page.locator("#runtimeChip.is-ready").waitFor();
      assert.equal(await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize)), fontSize);
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        for (const route of routes) {
          await page.evaluate((hash) => { window.location.hash = hash; }, route);
          await page.waitForTimeout(60);
          views += 1;
          let extra = await page.evaluate(overflow);
          if (extra > 1) {
            // Einmal nachmessen, damit ein noch ladendes Bild keinen Fehlalarm auslöst.
            await page.waitForTimeout(350);
            extra = await page.evaluate(overflow);
          }
          if (extra > 1) problems.push(`${route} bei ${width}px, Schrift ${fontSize}px: ${extra}px zu breit`);
        }
        await page.evaluate(() => { window.location.hash = "home"; });
        for (const [button, close, label] of [["#editProfileButton", "#profileCancelButton", "Profil"], ["#appearanceButton", "#appearanceCloseButton", "Darstellung"], ["#backupButton", "#backupCloseButton", "Sicherung"]]) {
          await page.locator(button).click();
          await page.waitForTimeout(120);
          views += 1;
          const problem = await page.evaluate(dialogProblem);
          if (problem) problems.push(`Dialog ${label} bei ${width}px, Schrift ${fontSize}px: ${problem}`);
          if (button === "#editProfileButton") {
            await page.locator("#nagoldTotal").click();
            await page.locator('[data-nagold-edit="0"]').click();
            views += 1;
            const ledgerProblem = await page.evaluate(dialogProblem);
            if (ledgerProblem) problems.push(`NAGOLD bei ${width}px, Schrift ${fontSize}px: ${ledgerProblem}`);
            await page.locator("#nagoldCloseButton").click();
          }
          await page.locator(close).click();
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
    assert.deepEqual(problems, []);
    console.log(`PASS: no horizontal overflow on ${views} views: all routes and dialogs at eight widths from 320 to 1280 px, and with the largest font size at four widths.`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
