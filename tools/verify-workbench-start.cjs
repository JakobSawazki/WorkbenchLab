const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..");
const url = (process.env.WORKBENCH_TEST_URL || "http://127.0.0.1:4174").replace(/\/$/, "");
const qa = require("../tests/artifacts.cjs")("workbench-start-video");
(async () => {
  fs.mkdirSync(qa, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${url}/#reference`);
    await page.waitForTimeout(500);
    if (await page.locator("#profileDialog").evaluate((dialog) => dialog.open)) {
      await page.locator("#profileName").fill("TES.TIA");
      await page.locator("#profileClass").fill("TEST");
      await page.locator("#profileForm button[type=submit]").click();
    }
    const video = page.locator(".workbench-start-film video");
    await video.waitFor();
    for (const [name, width, height] of [["desktop", 1440, 1000], ["mobile", 390, 844]]) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(400);
      await video.scrollIntoViewIfNeeded();
      const box = await video.boundingBox();
      assert.ok(box.width > 200 && box.x >= 0 && box.x + box.width <= width + 1, name);
      assert.ok(Math.abs(box.width / box.height - 16 / 9) < 0.02, name);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name);
      await page.screenshot({ path: path.join(qa, `reference-${name}.png`) });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    const media = await video.evaluate(async (element) => {
      await new Promise((resolve, reject) => {
        element.addEventListener("loadedmetadata", resolve, { once: true });
        element.addEventListener("error", () => reject(new Error("Video decoding failed")), { once: true });
        element.load();
      });
      const seek = (time) => new Promise((resolve, reject) => {
        element.addEventListener("seeked", resolve, { once: true });
        element.addEventListener("error", () => reject(new Error("Seeking failed")), { once: true });
        element.currentTime = time;
      });
      // Fragmented MediaRecorder MP4 can expose duration only after seeking.
      if (!Number.isFinite(element.duration)) await seek(1e6);
      const canvas = document.createElement("canvas");
      canvas.width = 192; canvas.height = 108;
      const ctx = canvas.getContext("2d");
      const samples = [];
      for (const time of [2, 8, 35, 74, 81, 99]) {
        await seek(time);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        ctx.drawImage(element, 0, 0, 192, 108);
        const pixels = ctx.getImageData(0, 0, 192, 108).data;
        let brightness = 0, hash = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          brightness += pixels[i] + pixels[i + 1] + pixels[i + 2];
          hash = (Math.imul(hash, 31) + pixels[i] + pixels[i + 1] * 2 + pixels[i + 2] * 3) >>> 0;
        }
        samples.push({ time, actual: element.currentTime, brightness, hash });
      }
      element.currentTime = 35;
      const captionTrack = element.querySelector("track");
      const captionsReady = new Promise((resolve, reject) => {
        if (captionTrack.readyState === 2) return resolve();
        const timeout = setTimeout(() => reject(new Error("Caption loading timed out")), 20000);
        captionTrack.addEventListener("load", () => { clearTimeout(timeout); resolve(); }, { once: true });
        captionTrack.addEventListener("error", () => { clearTimeout(timeout); reject(new Error("Caption loading failed")); }, { once: true });
      });
      element.textTracks[0].mode = "hidden";
      await captionsReady;
      return { width: element.videoWidth, height: element.videoHeight, duration: element.duration,
        samples, captions: element.textTracks[0].cues?.length || 0, error: element.error?.code || 0 };
    });
    assert.equal(media.width, 1920);
    assert.equal(media.height, 1080);
    assert.ok(media.duration >= 100 && media.duration <= 104, JSON.stringify(media));
    assert.equal(media.error, 0);
    assert.equal(media.captions, 15);
    assert.ok(media.samples.every((sample) => Math.abs(sample.actual - sample.time) < 0.1), JSON.stringify(media.samples));
    assert.ok(media.samples.every((sample) => sample.brightness > 100000));
    assert.equal(new Set(media.samples.map((sample) => sample.hash)).size, 6);
    await video.scrollIntoViewIfNeeded();
    await video.screenshot({ path: path.join(qa, "mp4-playback.png") });
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(qa, "verification.json"), JSON.stringify(media, null, 2));
    console.log(`PASS: MP4 ${media.width}x${media.height}, ${media.duration.toFixed(2)} seconds, ${media.captions} captions, 6 distinct decoded frames; desktop/mobile fit.`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
