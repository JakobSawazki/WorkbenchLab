const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const context = await browser.newContext();
    await context.addInitScript(() => localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" })));
    const page = await context.newPage();
    const errors = [], youtube = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (/youtube|ytimg/.test(request.url())) youtube.push(request.url()); });
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const theme of ["dark", "light"]) {
        await page.goto(`${base}?v=0.23.4#reference`);
        await page.locator("#runtimeChip.is-ready").waitFor();
        if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator("#themeToggleButton").click();
        const input = page.locator("#referenceSearch");
        if (await page.locator("#referenceSearchClear").isVisible()) await page.locator("#referenceSearchClear").click();
        assert.equal(await page.locator('[data-reference-entry]:not([hidden])').count(), 32);
        assert.equal(await page.locator("#referenceSearchCount").innerText(), "31 Einträge");
        for (const [query, title] of [["Filtern", "Selektion"], ["Tabellen verbinden", "Join"], ["normalisieren", "3NF"], ["primaerschluessel", "Primärschlüssel"]]) {
          await input.fill(query);
          assert.ok(await page.locator('[data-reference-entry]:not([hidden]) h3').filter({ hasText: title }).first().isVisible());
          assert.ok(await input.evaluate(element => element === document.activeElement));
          assert.ok(await page.locator(".video-library").isHidden());
        }
        await input.fill("L2.2");
        assert.equal(await page.locator('.video-card:not([hidden])').count(), 2);
        assert.equal(await page.locator('iframe').count(), 0);
        await input.fill("Bildungsplan");
        assert.ok(await page.locator('.source-card:not([hidden])').count() > 0);
        await input.fill("3306");
        assert.ok(await page.locator(".connection-guide").isVisible());
        await input.fill("video");
        assert.equal(await page.locator('.video-card:not([hidden])').count(), 6);
        await page.locator('.video-stage').first().evaluate(stage => stage.append(document.createElement('iframe')));
        await input.fill("Tabellen verbinden");
        assert.equal(await page.locator('iframe').count(), 0);
        assert.ok(await page.locator('.video-stage [data-video-load]').first().count());
        await input.fill("nichtsgefundenxyz");
        assert.ok(await page.locator("#referenceSearchEmpty").isVisible());
        assert.equal(await page.locator('[data-reference-group]:not([hidden])').count(), 0);
        await page.locator("#referenceSearchClear").click();
        assert.equal(await input.inputValue(), "");
        assert.equal(await page.locator('[data-reference-group]:not([hidden])').count(), 4);
        await input.fill("Filtern");
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        await page.screenshot({ path: `.tmp/reference-search-${width}-${theme}.png` });
        await page.goto(`${base}?v=0.23.4#commands`);
        await page.goto(`${base}?v=0.23.4#reference`);
        assert.equal(await input.inputValue(), "Filtern");
        await page.goto(`${base}?v=0.23.4#reference/fgOiWEGNJ-o`);
        await page.locator('#tutorial-fgOiWEGNJ-o').waitFor();
        assert.equal(await input.inputValue(), "");
        assert.ok(await page.locator('#tutorial-fgOiWEGNJ-o').isVisible());
        await input.fill("normalisieren");
        await page.goto(`${base}?v=0.23.4#reference/workbench-start`);
        assert.equal(await input.inputValue(), "");
        assert.ok(await page.locator('#workbench-start').isVisible());
        assert.equal(await page.locator('#workbench-start video').getAttribute('autoplay'), null);
      }
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(youtube, []);
    console.log("PASS: all reference sections, semantic terms, videos/sources, clear, empty state, persistence, deep links, no YouTube requests, desktop/mobile and dark/light.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
