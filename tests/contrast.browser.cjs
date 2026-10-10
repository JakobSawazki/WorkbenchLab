// Claude, 0.41.3: Farbkontrast sichtbarer Texte nach WCAG 2.1 AA (4,5:1; große Schrift 3:1) auf allen
// Seiten, in hellem und dunklem Design und mit jeder wählbaren Akzentfarbe an Stichproben. Wichtig für
// die Lesbarkeit am Beamer. Texte auf Fotos werden nicht bewertet; bei Farbverläufen zählt die
// ungünstigste Stelle des Verlaufs.
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
// Stichprobe für die übrigen Akzentfarben: je eine Seite jeder Art.
const sample = ["home", "sql", "sql/frei", "lesson/warum-datenbanken", "practice/sql-projection", "practice/predict-where-and", "practice/order-where-sortierung", "modeling/editor", "achievements"];

// Läuft im Browser: liefert Texte unter der Schwelle.
const audit = () => {
  const parse = (value) => {
    const match = String(value).match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };
  const blend = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
  const luminance = ({ r, g, b }) => {
    const channel = (value) => { const v = value / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const ratio = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
  // Mögliche Hintergrundfarben hinter einem Element; null, wenn ein Foto dahinter liegt.
  const backgrounds = (element) => {
    const layers = [];
    for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
      const style = getComputedStyle(node);
      const image = style.backgroundImage;
      if (image && image !== "none") {
        if (image.includes("url(")) return null;
        const stops = [...image.matchAll(/rgba?\([^)]+\)/g)].map((match) => parse(match[0])).filter(Boolean);
        if (stops.length) { layers.push(stops); if (stops.every((stop) => stop.a === 1)) break; continue; }
      }
      const color = parse(style.backgroundColor);
      if (color && color.a > 0) { layers.push([color]); if (color.a === 1) break; }
    }
    let results = [{ r: 255, g: 255, b: 255, a: 1 }];
    for (const layer of layers.reverse()) results = layer.flatMap((color) => results.map((under) => blend(color, under)));
    return results.slice(0, 64);
  };
  const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const found = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.nodeValue.trim()) continue;
    const element = node.parentElement;
    if (!element || seen.has(element)) continue;
    seen.add(element);
    if (element.closest("[hidden], [aria-hidden='true'], script, style, template, option, [disabled], .sr-only")) continue;
    const dialog = element.closest("dialog");
    if (dialog && !dialog.open) continue;
    if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    const rect = element.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    const style = getComputedStyle(element);
    const text = parse(style.color);
    const behind = backgrounds(element);
    if (!text || !behind) continue;
    let opacity = 1;
    for (let up = element; up && up.nodeType === 1; up = up.parentElement) opacity *= Number(getComputedStyle(up).opacity);
    const size = parseFloat(style.fontSize);
    const need = size >= 24 || (Number(style.fontWeight) >= 700 && size >= 18.66) ? 3 : 4.5;
    let worst = Infinity, worstPair = null;
    for (const background of behind) {
      const shown = blend({ ...text, a: text.a * opacity }, background);
      const value = ratio(shown, background);
      if (value < worst) { worst = value; worstPair = `${hex(shown)} auf ${hex(background)}`; }
    }
    if (worst < need - 0.05) {
      const name = (item) => `${item.tagName.toLowerCase()}${typeof item.className === "string" && item.className ? "." + item.className.trim().split(/\s+/).slice(0, 2).join(".") : ""}`;
      found.push({ key: `${element.parentElement ? name(element.parentElement) + " > " : ""}${name(element)}`, pair: worstPair, ratio: Math.round(worst * 100) / 100, need, sample: node.nodeValue.trim().slice(0, 30) });
    }
  }
  return found;
};

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const problems = new Map();
  let views = 0;
  try {
    const accents = await (async () => {
      const page = await browser.newPage();
      await page.goto(base + "#home");
      const choices = await page.evaluate(() => window.WORKBENCH_APPEARANCE.choices);
      await page.close();
      return choices;
    })();
    for (const theme of ["dark", "light"]) {
      for (const [index, accent] of accents[theme].accent.entries()) {
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        await context.addInitScript(([doneLessons, donePractices, seedTheme, seedAccent, defaults]) => {
          if (!localStorage.getItem("workbenchlab-v1")) {
            localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: doneLessons, completedPractices: donePractices }));
            localStorage.setItem("workbenchlab-theme-v1", seedTheme);
            localStorage.setItem("workbenchlab-appearance-v1", JSON.stringify({ fontSize: 16, palettes: { [seedTheme]: { ...defaults, accent: seedAccent } } }));
          }
          sessionStorage.setItem("workbenchlab-developer-v1", "active");
        }, [lessons.slice(0, 3), practices.slice(0, 30), theme, accent, { text: accents[theme].text[0], background: accents[theme].background[0] }]);
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(base + "#home", { waitUntil: "networkidle" });
        await page.locator("#runtimeChip.is-ready").waitFor();
        assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--on-brand").trim().length > 0), true);
        const check = async (where) => {
          views += 1;
          for (const item of await page.evaluate(audit)) {
            const key = `${theme}/${accent} ${item.key} ${item.pair}`;
            if (!problems.has(key)) problems.set(key, { ...item, where: [] });
            problems.get(key).where.push(where);
          }
        };
        // Vollständig mit der Standardfarbe, Stichprobe mit den übrigen Akzentfarben.
        for (const route of index === 0 ? routes : sample) {
          await page.evaluate((hash) => { window.location.hash = hash; }, route);
          await page.waitForTimeout(90);
          await check(route);
        }
        await page.evaluate(() => { window.location.hash = "sql/frei"; });
        await page.locator("#playgroundSchema").selectOption("leer");
        await check("Leerer SQL-Arbeitsbereich");
        await page.locator("#sqlEditor").fill("CREATE DATABASE kontrast; USE kontrast; CREATE TABLE t(id INT); INSERT INTO t VALUES(1); SELECT * FROM t;");
        await page.locator("#playgroundRunButton").click();
        await page.locator("#sqlOutput table").waitFor();
        await check("SQL-Arbeitsbereich mit Tabellen und Ergebnis");
        if (index === 0) {
          await page.evaluate(() => { window.location.hash = "home"; });
          for (const [button, close, label] of [["#editProfileButton", "#profileCancelButton", "Profil"], ["#appearanceButton", "#appearanceCloseButton", "Darstellung"], ["#backupButton", "#backupCloseButton", "Sicherung"]]) {
            await page.locator(button).click();
            await page.waitForTimeout(150);
            await check(`Dialog ${label}`);
            if (button === "#editProfileButton") {
              await page.locator("#nagoldTotal").click();
              await check("NAGOLD-Tabelle");
              await page.locator('[data-nagold-edit="0"]').click();
              await check("NAGOLD bearbeiten");
              await page.locator("#nagoldCloseButton").click();
            }
            await page.locator(close).click();
          }
          await page.goto(base + "lehrkraft.html", { waitUntil: "networkidle" });
          await page.locator("#teacherFiles").setInputFiles({ name: "a.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ app: "WorkbenchLab", formatVersion: 2, data: { name: "TST.QAA", className: "TEST", completedLessons: lessons.slice(0, 2) } })) });
          await page.locator(".teacher-table").first().waitFor();
          await check("Klassenübersicht");
          await page.locator("[data-teacher-review]").click();
          await check("Lehrkraft-Bestätigungen");
          await page.keyboard.press("Escape");
        }
        assert.deepEqual(errors, []);
        await context.close();
      }
    }
    const report = [...problems].sort((a, b) => a[1].ratio - b[1].ratio).map(([key, item]) => `- ${item.ratio} statt ${item.need}: ${key} „${item.sample}“ (${item.where.length}×, z. B. ${item.where.slice(0, 2).join(", ")})`).join("\n");
    assert.equal(problems.size, 0, `Texte mit zu geringem Kontrast:\n${report}`);
    console.log(`PASS: text contrast meets WCAG AA on ${views} views: all routes, dialogs and class overview in dark and light, plus samples for every selectable accent colour.`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
