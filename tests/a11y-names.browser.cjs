// Claude, 0.41.2: Bedienbarkeit für Bildschirmleser, soweit sie sich automatisch prüfen lässt.
// Auf allen Seiten und in mehreren Zuständen nach Bedienung: Jedes Bedienelement hat einen vorlesbaren
// Namen, jedes Bild einen Alternativtext, Kennungen sind eindeutig, ARIA-Verweise und label-Bezüge
// treffen ein Ziel, Überschriften überspringen keine Ebene. Ersetzt keinen Test mit echtem Bildschirmleser.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const { loadContent } = require("../tools/build-expected.cjs");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const content = loadContent().WORKBENCH_CONTENT;
const lessons = Array.from(content.lessons).map((lesson) => lesson.id);
const practices = Array.from(content.practices).map((practice) => practice.id);
const commands = Array.from(content.commands).map((command) => command.id);
const routes = ["home", "path", "sql", "sql/frei", "sql/wiederholen", "sql/klausur", "modeling", "modeling/editor", "commands", "achievements", "reference", "notes",
  ...lessons.map((id) => `lesson/${id}`), ...practices.map((id) => `practice/${id}`), ...commands.map((id) => `command/${id}`)];
const model = {
  task: "fahrschule-ort", notation: "n", models: { "fahrschule-ort": {
    entities: [
      { id: 1, name: "Ort", attributes: [{ id: 2, name: "ortnr", type: "INT", pk: true, fk: false }] },
      { id: 3, name: "Fahrschueler", attributes: [{ id: 4, name: "schuelernr", type: "INT", pk: true, fk: false }, { id: 5, name: "ortnr", type: "INT", pk: false, fk: true }] }
    ],
    relations: [{ id: 6, from: 1, to: 3, card: "1:N" }], nextId: 7
  } }
};

// Läuft im Browser und liefert die Befunde der gerade sichtbaren Seite.
const audit = () => {
  const visible = (element) => {
    if (element.closest("[hidden], [aria-hidden='true'], template")) return false;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return false;
    const dialog = element.closest("dialog");
    return !dialog || dialog.open;
  };
  const text = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const byIds = (ids) => text(String(ids || "").split(/\s+/).map((id) => document.getElementById(id)?.textContent || "").join(" "));
  const name = (element) => {
    const labelled = byIds(element.getAttribute("aria-labelledby"));
    if (labelled) return labelled;
    if (text(element.getAttribute("aria-label"))) return text(element.getAttribute("aria-label"));
    if (element.matches("input, select, textarea")) {
      const label = (element.id && document.querySelector(`label[for="${CSS.escape(element.id)}"]`)) || element.closest("label");
      if (label && text(label.textContent)) return text(label.textContent);
      if (element.matches("input[type=submit], input[type=button]") && text(element.value)) return text(element.value);
      return text(element.getAttribute("title"));
    }
    const own = text(element.textContent);
    if (own) return own;
    const image = element.querySelector("img[alt]");
    if (image && text(image.alt)) return text(image.alt);
    return text(element.getAttribute("title"));
  };
  const describe = (element) => `<${element.tagName.toLowerCase()}${element.id ? ` #${element.id}` : ""}${typeof element.className === "string" && element.className ? ` .${element.className.trim().split(/\s+/).slice(0, 3).join(".")}` : ""}${[...element.attributes].filter((a) => a.name.startsWith("data-")).slice(0, 2).map((a) => ` ${a.name}`).join("")}>`;
  const problems = [];
  for (const element of document.querySelectorAll("button, a[href], [role=button], [role=tab], [role=link], input:not([type=hidden]), select, textarea, summary")) {
    if (visible(element) && !name(element)) problems.push(`ohne Namen: ${describe(element)}`);
  }
  for (const image of document.querySelectorAll("img")) {
    if (visible(image) && !image.hasAttribute("alt")) problems.push(`Bild ohne alt: ${describe(image)} ${image.getAttribute("src")}`);
  }
  for (const svg of document.querySelectorAll("svg[role=img]")) {
    if (visible(svg) && !text(svg.getAttribute("aria-label")) && !byIds(svg.getAttribute("aria-labelledby")) && !svg.querySelector("title")) problems.push(`Grafik ohne Namen: ${describe(svg)}`);
  }
  const ids = new Map();
  for (const element of document.querySelectorAll("[id]")) ids.set(element.id, (ids.get(element.id) || 0) + 1);
  for (const [id, count] of ids) if (count > 1) problems.push(`Kennung doppelt: #${id} (${count}×)`);
  for (const attribute of ["aria-labelledby", "aria-describedby", "aria-controls"]) {
    for (const element of document.querySelectorAll(`[${attribute}]`)) {
      for (const id of element.getAttribute(attribute).split(/\s+/).filter(Boolean)) {
        if (visible(element) && !document.getElementById(id)) problems.push(`${attribute} zeigt ins Leere: ${describe(element)} → #${id}`);
      }
    }
  }
  for (const label of document.querySelectorAll("label[for]")) {
    if (visible(label) && !document.getElementById(label.htmlFor)) problems.push(`label ohne Feld: for="${label.htmlFor}"`);
  }
  const headings = [...(document.querySelector("main") || document.body).querySelectorAll("h1, h2, h3, h4, h5, h6")].filter(visible);
  for (let i = 1; i < headings.length; i += 1) {
    const [before, level] = [Number(headings[i - 1].tagName[1]), Number(headings[i].tagName[1])];
    if (level > before + 1) { problems.push(`Überschrift springt von h${before} auf h${level}: „${text(headings[i].textContent).slice(0, 50)}“`); break; }
  }
  if (!document.documentElement.lang) problems.push("html ohne lang");
  if (!text(document.title)) problems.push("Seite ohne Titel");
  return problems;
};

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const found = new Map();
  let views = 0;
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addInitScript(([doneLessons, donePractices, drafts]) => {
        if (!localStorage.getItem("workbenchlab-v1")) {
          localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedLessons: doneLessons, completedPractices: donePractices }));
          localStorage.setItem("workbenchlab-erm-v1", JSON.stringify(drafts));
        }
        sessionStorage.setItem("workbenchlab-developer-v1", "active");
      }, [lessons.slice(0, 3), practices.slice(0, 30), model]);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const check = async (where) => {
        views += 1;
        for (const problem of await page.evaluate(audit)) {
          if (!found.has(problem)) found.set(problem, []);
          found.get(problem).push(`${width}px ${where}`);
        }
      };
      const go = async (route) => {
        await page.evaluate((hash) => { window.location.hash = hash; }, route);
        await page.waitForTimeout(100);
      };
      await page.goto(base + "#home", { waitUntil: "networkidle" });
      await page.locator("#runtimeChip.is-ready").waitFor();
      for (const route of routes) {
        await go(route);
        await check(route);
      }

      // Zustände nach Bedienung.
      await go("sql/frei");
      await page.locator("#playgroundRunButton").click();
      await page.locator("#sqlOutput table").waitFor();
      await check("freies Labor mit Ergebnis");
      await page.locator("#sqlEditor").fill("SELECT 5 DIV 2;");
      await page.locator("#playgroundRunButton").click();
      await page.locator("#sqlOutput .sql-error").waitFor();
      await check("freies Labor mit Fehlermeldung");
      await go("practice/sql-projection");
      await page.locator("#checkSqlButton").click();
      await page.waitForTimeout(600);
      await check("Aufgabe nach „Lösung prüfen“");
      await go("modeling/editor");
      await page.locator("#ermDiagram .erm-entity-box").first().waitFor();
      await check("Modell-Editor mit Entwurf");
      await go("sql/klausur");
      await page.locator("#examStart").click();
      await page.locator("#examFinish").waitFor();
      await check("laufendes Klausurtraining");
      await page.locator("#examFinish").click();
      await page.locator("#examRestart").waitFor();
      await check("ausgewertetes Klausurtraining");
      await go("notes");
      await page.locator("#noteDrawingTab").click();
      await page.waitForTimeout(200);
      await check("Notizen, Zeichenfläche");
      await go("home");
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
      await check("Klassenübersicht leer");
      await page.locator("#teacherFiles").setInputFiles({ name: "sicherung.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ app: "WorkbenchLab", formatVersion: 2, data: { name: "TST.QAA", className: "TEST", completedLessons: lessons.slice(0, 2) } })) });
      await page.locator(".teacher-table").first().waitFor();
      await check("Klassenübersicht mit Tabelle");
      await page.locator("[data-teacher-review]").click();
      await check("Lehrkraft-Bestätigungen");
      await page.keyboard.press("Escape");
      assert.deepEqual(errors, []);
      await context.close();
    }
    const report = [...found].map(([problem, where]) => `- ${problem} (${where.length}×, z. B. ${where.slice(0, 3).join("; ")})`).join("\n");
    assert.equal(found.size, 0, `Befunde zur Bedienbarkeit:\n${report}`);
    console.log(`PASS: accessible names, alt texts, unique ids, ARIA and label targets, heading order on ${views} views (all routes plus states after interaction, dialogs, class overview), desktop/mobile.`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
