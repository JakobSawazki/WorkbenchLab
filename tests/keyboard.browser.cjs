// Claude, 0.41.5: Bedienung nur mit der Tastatur.
// Geprüft wird auf 16 Seiten bei zwei Breiten: Der Sprunglink führt in den Inhalt; die Tab-Taste
// erreicht nur sichtbare Elemente mit sichtbarer Fokusmarkierung und bleibt nirgends hängen; der
// SQL-Editor rückt mit Tab ein, lässt sich aber mit Esc + Tab und mit Umschalt + Tab verlassen;
// Dialoge nehmen den Fokus auf, halten ihn, schließen mit Esc und geben ihn an den Knopf zurück.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const routes = ["home", "path", "sql", "sql/frei", "practice/sql-projection", "practice/predict-where-and", "practice/order-where-sortierung", "practice/erm-fahrschule-1n-diagram",
  "modeling/editor", "sql/wiederholen", "sql/klausur", "lesson/warum-datenbanken", "commands", "achievements", "reference", "notes"];

// Läuft im Browser: beschreibt das Element, das gerade den Fokus hat.
const describeFocus = () => {
  const element = document.activeElement;
  if (!element || element === document.body) return { key: "body", kind: "body" };
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const kind = element.tagName.toLowerCase() + (element.id ? "#" + element.id : "") + (typeof element.className === "string" && element.className ? "." + element.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
  return {
    key: `${kind}@${[...document.querySelectorAll("*")].indexOf(element)}`, kind, id: element.id,
    visible: rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && Number(style.opacity) > 0.05,
    onScreen: rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth,
    // Markierung: ein Umriss, oder ein Schatten, den das Element ohne Fokus nicht hat.
    // Ein Video zeichnet den Fokus in seinen eigenen Bedienelementen; dort nicht eingreifen.
    indicator: element.tagName === "VIDEO" || (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) || (() => {
      const focused = style.boxShadow;
      element.blur();
      const resting = getComputedStyle(element).boxShadow;
      element.focus({ preventScroll: true });
      return focused !== "none" && focused !== resting;
    })(),
    inDialog: Boolean(element.closest("dialog[open]")), inMain: Boolean(element.closest("main"))
  };
};

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const problems = [];
  let stops = 0;
  let editorsWalked = 0;
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addInitScript(() => {
        if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST", completedPractices: ["sql-projection", "sql-distinct", "sql-insert", "sql-group-having", "sql-join-places"] }));
        sessionStorage.setItem("workbenchlab-developer-v1", "active");
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const focus = () => page.evaluate(describeFocus);

      for (const route of routes) {
        const where = `${width}px ${route}`;
        await page.goto(base + "#" + route, { waitUntil: "networkidle" });
        await page.waitForTimeout(200);

        // Sprunglink: sichtbar bei Fokus, Enter führt in den Inhalt.
        await page.locator(".skip-link").focus();
        const skip = await focus();
        if (!skip.onScreen || !skip.visible) problems.push(`${where}: Sprunglink bei Fokus nicht sichtbar`);
        await page.keyboard.press("Enter");
        await page.waitForTimeout(120);
        const hash = await page.evaluate(() => window.location.hash.replace(/^#/, ""));
        if (hash !== route) problems.push(`${where}: der Sprunglink wechselt die Seite (jetzt „${hash}“)`);
        if ((await focus()).kind.split(".")[0] !== "main#mainContent") problems.push(`${where}: der Sprunglink setzt den Fokus nicht in den Inhalt (${(await focus()).kind})`);
        // Hat der Inhalt Bedienelemente, erreicht der nächste Tab das erste davon.
        const hasControls = await page.evaluate(() => Boolean(document.querySelector("main a[href], main button:not([disabled]), main input, main select, main textarea, main summary, main [tabindex='0']")));
        await page.keyboard.press("Tab");
        if (hasControls && !(await focus()).inMain) problems.push(`${where}: nach dem Sprunglink landet Tab nicht im Inhalt (${(await focus()).kind})`);
        assert.equal(await page.evaluate(() => window.location.hash.replace(/^#/, "")), route, `${where}: Seite hat gewechselt`);

        // Tab-Reihenfolge von oben: keine Falle, alles sichtbar und markiert.
        await page.locator(".skip-link").focus();
        const seen = new Set();
        let last = "", ended = false, repeats = 0;
        for (let step = 0; step < 260; step += 1) {
          await page.keyboard.press("Tab");
          let current = await focus();
          if (current.id === "sqlEditor") {
            editorsWalked += 1;
            if (!current.visible || !current.indicator) problems.push(`${where}: SQL-Editor ohne sichtbaren Fokus`);
            // Der Editor rückt ein und hält den Fokus – mit Esc + Tab geht es weiter.
            await page.keyboard.press("Tab");
            if ((await focus()).id !== "sqlEditor") problems.push(`${where}: Tab rückt im SQL-Editor nicht mehr ein`);
            await page.keyboard.press("Escape");
            await page.keyboard.press("Tab");
            current = await focus();
            if (current.id === "sqlEditor") { problems.push(`${where}: Tastaturfalle im SQL-Editor (Esc + Tab verlässt das Feld nicht)`); break; }
          }
          if (current.key !== "body" && current.key === last) {
            // Ein Video hat eigene Bedienelemente; der Fokus wandert darin weiter und bleibt nach außen „video“.
            repeats += 1;
            if (!/^video/.test(current.kind) || repeats > 12) { problems.push(`${where}: Tastaturfalle auf ${current.kind}`); break; }
            continue;
          }
          repeats = 0;
          last = current.key;
          if (current.key === "body" || seen.has(current.key)) { ended = true; break; }
          seen.add(current.key);
          stops += 1;
          if (!current.visible) problems.push(`${where}: unsichtbares Element erhält den Fokus (${current.kind})`);
          else if (!current.indicator) problems.push(`${where}: Fokus ohne sichtbare Markierung (${current.kind})`);
        }
        if (!ended && seen.size >= 260) problems.push(`${where}: mehr als 260 Tab-Halte`);
        assert.ok(seen.size >= 5, `${where}: nur ${seen.size} Tab-Halte gefunden`);
      }

      // SQL-Editor: Umschalt + Tab führt zurück; der Hinweis ist mit dem Feld verknüpft.
      for (const route of ["sql/frei", "practice/sql-projection"]) {
        await page.goto(base + "#" + route, { waitUntil: "networkidle" });
        const editor = page.locator("#sqlEditor");
        await editor.focus();
        await page.keyboard.press("End");
        const before = await editor.inputValue();
        await page.keyboard.press("Tab");
        assert.equal((await focus()).id, "sqlEditor", `${route}: Tab bleibt im Editor`);
        assert.notEqual(await editor.inputValue(), before, `${route}: Tab rückt ein`);
        await page.keyboard.press("Shift+Tab");
        assert.notEqual((await focus()).id, "sqlEditor", `${route}: Umschalt + Tab verlässt den Editor`);
        await editor.focus();
        await page.keyboard.press("Escape");
        await page.keyboard.type("x");
        await page.keyboard.press("Tab");
        assert.equal((await focus()).id, "sqlEditor", `${route}: nach Esc und weiterem Tippen rückt Tab wieder ein`);
        assert.equal(await editor.getAttribute("aria-describedby"), "sqlEditorKeys");
        assert.match(await page.locator("#sqlEditorKeys").innerText(), /Esc.*Tab/s);
      }

      // Dialoge.
      await page.goto(base + "#home", { waitUntil: "networkidle" });
      for (const [button, dialog] of [["#editProfileButton", "#profileDialog"], ["#appearanceButton", "#appearanceDialog"], ["#backupButton", "#backupDialog"]]) {
        const where = `${width}px ${dialog}`;
        await page.locator(button).focus();
        await page.keyboard.press("Enter");
        await page.locator(dialog).waitFor({ state: "visible" });
        await page.waitForTimeout(150);
        if (!(await focus()).inDialog) problems.push(`${where}: Fokus geht beim Öffnen nicht in den Dialog`);
        for (let step = 0; step < 30; step += 1) {
          await page.keyboard.press("Tab");
          const current = await focus();
          if (current.key !== "body" && !current.inDialog) { problems.push(`${where}: Fokus verlässt den offenen Dialog (${current.kind})`); break; }
          if (current.key !== "body" && current.visible && !current.indicator) problems.push(`${where}: Fokus ohne sichtbare Markierung (${current.kind})`);
        }
        await page.keyboard.press("Escape");
        await page.locator(dialog).waitFor({ state: "hidden" });
        const back = await focus();
        if (`#${back.id}` !== button) problems.push(`${where}: nach Esc liegt der Fokus nicht wieder auf dem Knopf (${back.kind})`);
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
    assert.deepEqual([...new Set(problems)], []);
    // Zwei der 16 Seiten haben einen SQL-Editor; der Weg durch ihn muss bei beiden Breiten gegangen worden sein.
    assert.equal(editorsWalked, 4, "Der Tab-Weg hat den SQL-Editor nicht auf allen Seiten erreicht");
    console.log(`PASS: keyboard-only use on ${routes.length} pages at two widths: skip link, ${stops} tab stops all visible with focus indicator, no keyboard trap, SQL editor indents with Tab and is left with Esc+Tab or Shift+Tab, dialogs take, keep and return focus and close with Esc.`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
