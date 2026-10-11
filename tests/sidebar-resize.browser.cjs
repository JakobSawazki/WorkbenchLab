// Claude, 2026-10-11: Die Trennlinie zwischen Navigation und Inhalt lässt sich verschieben.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4199/";

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
    await page.goto(base + "#home", { waitUntil: "networkidle" });
    const width = () => page.locator("#sidebar").evaluate((element) => Math.round(element.getBoundingClientRect().width));
    const handle = page.locator(".sidebar-resizer");
    assert.equal(await width(), 292);
    assert.equal(await handle.getAttribute("role"), "separator");

    // Ziehen nach rechts und links; die Seite läuft nicht über.
    const box = await handle.boundingBox();
    const y = box.y + 300;
    await page.mouse.move(box.x + box.width / 2, y);
    await page.mouse.down();
    await page.mouse.move(400, y, { steps: 6 });
    await page.mouse.up();
    assert.ok(Math.abs((await width()) - 400) <= 3, `Breite nach dem Ziehen: ${await width()}`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    assert.equal(await page.evaluate(() => localStorage.getItem("workbenchlab-sidebar-width-v1")), String(await width()));

    // Grenzen: nicht schmaler als 220, nicht breiter als 520 Pixel.
    for (const [target, expected] of [[40, 220], [1200, 520]]) {
      const now = await handle.boundingBox();
      await page.mouse.move(now.x + now.width / 2, y);
      await page.mouse.down();
      await page.mouse.move(target, y, { steps: 6 });
      await page.mouse.up();
      assert.equal(await width(), expected);
    }

    // Die Breite bleibt nach dem Neuladen; Tastatur und Doppelklick funktionieren.
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await width(), 520);
    await handle.focus();
    await page.keyboard.press("ArrowLeft");
    assert.equal(await width(), 504);
    await page.keyboard.press("ArrowRight");
    assert.equal(await width(), 520);
    await handle.dblclick();
    assert.equal(await width(), 292);
    assert.equal(await handle.getAttribute("aria-valuenow"), "292");

    // Navigation ausgeblendet oder schmaler Bildschirm: keine Trennlinie, Layout wie bisher.
    await page.locator("#mobileMenuButton").click();
    assert.equal(await page.locator("#sidebar").isVisible(), false);
    await page.locator("#mobileMenuButton").click();
    assert.equal(await width(), 292);
    await page.setViewportSize({ width: 900, height: 800 });
    assert.equal(await handle.isVisible(), false);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    assert.deepEqual(errors, []);
    console.log("PASS: sidebar divider can be dragged, is limited to 220-520 px, survives reload, works with arrow keys and double-click reset, is absent with hidden navigation and on narrow screens.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
