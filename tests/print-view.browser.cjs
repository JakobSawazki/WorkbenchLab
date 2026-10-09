// Claude, OPT-19: Druckansicht einer Einheit mit ausgefüllten Antworten.
const artifacts = require("node:path").join(require("node:os").tmpdir(), "workbenchlab-tests");
require("node:fs").mkdirSync(artifacts, { recursive: true });
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      if (!localStorage.getItem("workbenchlab-v1")) localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "#lesson/warum-datenbanken");
    await page.locator("[data-print-page]").waitFor();
    const longAnswer = Array.from({ length: 14 }, (_, index) => `Zeile ${index + 1} meiner Antwort`).join("\n");
    const field = page.locator("main textarea").first();
    await field.fill(longAnswer);
    const before = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      closed: document.querySelectorAll("main details:not([open])").length,
      height: document.querySelector("main textarea").style.height
    }));
    assert.equal(before.theme, "dark");
    assert.ok(before.closed > 3);

    // Druckvorbereitung: hell, alles geöffnet, Antwort vollständig sichtbar.
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await page.emulateMedia({ media: "print" });
    const during = await page.evaluate(() => {
      const area = document.querySelector("main textarea");
      const visible = (selector) => [...document.querySelectorAll(selector)].some((item) => item.getClientRects().length > 0);
      return {
        theme: document.documentElement.dataset.theme,
        closed: document.querySelectorAll("main details:not([open])").length,
        fits: area.clientHeight >= area.scrollHeight - 2,
        sidebar: visible("#sidebar"), actions: visible(".topbar-actions"), tools: visible(".reading-tools"),
        printButton: visible("[data-print-page]"), heading: visible("#viewTitle"), content: visible("main h2")
      };
    });
    assert.deepEqual(during, { theme: "light", closed: 0, fits: true, sidebar: false, actions: false, tools: false, printButton: false, heading: true, content: true });
    const pdf = await page.pdf({ path: `${artifacts}/print-view-l1-1.pdf`, format: "A4" });
    assert.ok(pdf.length > 20000);

    // Danach ist alles wie vorher; die Eingabe bleibt gespeichert.
    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    const after = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      closed: document.querySelectorAll("main details:not([open])").length,
      height: document.querySelector("main textarea").style.height
    }));
    assert.deepEqual(after, before);
    assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-theme-v1")), null);
    assert.equal(await field.inputValue(), longAnswer);
    assert.deepEqual(errors, []);
    console.log("PASS: print view switches to light, opens all sections, shows full answers, hides navigation and tools, restores state afterwards.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
