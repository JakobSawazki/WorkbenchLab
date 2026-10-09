const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174/";
const artifacts = path.join(os.tmpdir(), "workbenchlab-tests", "material-design");

// Audit rendered pixels as well as CSS colours: the ordinary contrast test cannot see texture layers.
async function buttonContrast(page, selector) {
  const button = page.locator(selector);
  const saved = await button.evaluate((element) => {
    const colours = new Set();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.trim()) colours.add(getComputedStyle(walker.currentNode.parentElement).color);
    }
    if (!colours.size) colours.add(getComputedStyle(element).color);
    const nodes = [element, ...element.querySelectorAll("*")];
    const styles = nodes.map((node) => node.getAttribute("style"));
    element.style.color = "transparent";
    element.style.textShadow = "none";
    nodes.slice(1).forEach((node) => { node.style.visibility = "hidden"; });
    return { colours: [...colours], styles };
  });
  let screenshot;
  try { screenshot = await button.screenshot({ animations: "disabled" }); }
  finally {
    await button.evaluate((element, styles) => {
      [element, ...element.querySelectorAll("*")].forEach((node, index) => {
        if (styles[index] === null) node.removeAttribute("style");
        else node.setAttribute("style", styles[index]);
      });
    }, saved.styles);
  }
  const worst = await page.evaluate(async ({ imageData, colours }) => {
    const image = new Image();
    image.src = "data:image/png;base64," + imageData;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const luminance = (rgb) => rgb.map((value) => {
      const n = value / 255;
      return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
    const foregrounds = colours.map((colour) => luminance(colour.match(/[\d.]+/g).slice(0, 3).map(Number)));
    let result = Infinity;
    let pair;
    // Exclude the rounded, reflective rim; labels and icons occupy the inner surface.
    for (let y = 8; y < image.height - 8; y++) {
      for (let x = 8; x < image.width - 8; x++) {
        const index = (y * image.width + x) * 4;
        const background = luminance([...data.slice(index, index + 3)]);
        for (const foreground of foregrounds) {
          const ratio = (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05);
          if (ratio < result) { result = ratio; pair = { x, y, rgb: [...data.slice(index, index + 3)], colours }; }
        }
      }
    }
    return { ratio: result, pair };
  }, { imageData: screenshot.toString("base64"), colours: saved.colours });
  assert.ok(worst.ratio >= 4.5, `${selector}: rendered material contrast ${worst.ratio.toFixed(2)}:1 ${JSON.stringify(worst.pair)}`);
}

(async () => {
  fs.mkdirSync(artifacts, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const theme of ["dark", "light"]) {
      for (const width of [1440, 390]) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
        await context.addInitScript((mode) => {
          localStorage.setItem("workbenchlab-theme-v1", mode);
          if (!localStorage.getItem("workbenchlab-v1")) {
            localStorage.setItem("workbenchlab-v1", JSON.stringify({ name: "TST.QAA", className: "TEST" }));
          }
        }, theme);
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(base + "#home");
        await page.locator("#runtimeChip.is-ready").waitFor();
        const texture = await page.evaluate(async () => {
          const image = new Image();
          image.src = new URL("assets/titanium-blue-satin.webp", document.baseURI);
          await image.decode();
          return { width: image.naturalWidth, height: image.naturalHeight };
        });
        assert.ok(texture.width >= 1000 && texture.height >= 700);
        assert.match(await page.locator("body").evaluate((el) => getComputedStyle(el, "::before").backgroundImage), /titanium-blue-satin\.webp/);
        const heights = await page.locator(".topbar-actions").evaluate((el) => [...el.querySelectorAll("button")]
          .filter((button) => button.checkVisibility()).map((button) => button.getBoundingClientRect().height));
        assert.ok(Math.max(...heights) - Math.min(...heights) < 1);
        const before = await page.locator("#backupButton").boundingBox();
        await page.locator("#backupButton").hover();
        const after = await page.locator("#backupButton").boundingBox();
        assert.deepEqual(after, before, "Metal hover must not shift the button");
        for (const selector of ["#backupButton", "#editProfileButton"]) await buttonContrast(page, selector);
        await page.mouse.move(0, 0);
        await page.screenshot({ path: path.join(artifacts, `${theme}-${width}-home.png`), animations: "disabled" });
        await page.locator("#appearanceButton").click();
        assert.match(await page.locator("#appearanceDialog").evaluate((el) => getComputedStyle(el).backdropFilter), /blur/);
        for (const selector of ["#appearanceDoneButton", "#appearanceResetButton"]) await buttonContrast(page, selector);
        if (width === 1440) {
          const swatches = page.locator('[data-color-field="accent"]');
          for (let index = 0; index < await swatches.count(); index++) {
            await swatches.nth(index).click();
            await buttonContrast(page, "#appearanceDoneButton");
          }
          await swatches.first().click();
        }
        await page.screenshot({ path: path.join(artifacts, `${theme}-${width}-dialog.png`), animations: "disabled" });
        await page.keyboard.press("Escape");
        assert.ok(await page.locator("#appearanceDialog").isHidden());
        for (const route of ["sql/frei", "lesson/warum-datenbanken", "commands"]) {
          await page.goto(base + "#" + route);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        }
        await page.emulateMedia({ media: "print" });
        assert.equal(await page.locator("body").evaluate((el) => getComputedStyle(el, "::before").display), "none");
        await page.emulateMedia({ media: "screen", forcedColors: "active" });
        assert.equal(await page.locator("body").evaluate((el) => getComputedStyle(el, "::before").display), "none");
        assert.deepEqual(errors, []);
        await context.close();
      }
    }
    // The public package must carry the texture, not just the source checkout.
    assert.ok(fs.statSync(path.join(__dirname, "..", "assets", "titanium-blue-satin.webp")).size < 300000);
    assert.equal(require("../tools/build-site.cjs").isPublicFile("assets/titanium-blue-satin.webp"), true);
    console.log("PASS: local titanium asset, rendered-pixel button contrast, stable hover and profile height, glass dialogs, keyboard close, four routes in both themes at desktop/mobile widths, print and forced-colour fallback.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exit(1); });
