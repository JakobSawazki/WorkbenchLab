const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const { finalize } = require("./finalize-workbench-start.cjs");
const root = path.resolve(__dirname, "..");
const output = path.join(root, "assets/tutorials");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true, args: ["--disable-background-timer-throttling", "--disable-renderer-backgrounding"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1160 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:4174/assets/tutorials/workbench-start-animation.html");
    await page.waitForFunction(() => window.WorkbenchStart && document.querySelector("canvas").width === 1920);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete));
    await page.waitForTimeout(300);
    const qa = require("../tests/artifacts.cjs")("workbench-start-video");
    fs.mkdirSync(qa, { recursive: true });
    for (const time of [2, 8, 18, 23, 35, 39, 46, 53, 58, 64, 70, 74, 81, 86, 93, 99]) {
      const scene = await page.evaluate((time) => window.WorkbenchStart.render(time), time);
      await page.locator("#film").screenshot({ path: path.join(qa, `${String(time).padStart(3, "0")}-${scene.kind}.png`) });
    }
    await page.evaluate(() => window.WorkbenchStart.render(35));
    await page.locator("#film").screenshot({ path: path.join(output, "workbench-start-poster.png") });
    if (process.argv.includes("--preview")) {
      assert.deepEqual(errors, []);
      console.log("PASS: 16 storyboard frames generated.");
      return;
    }
    await page.exposeFunction("saveRecording", (base64) => fs.writeFileSync(path.join(output, "workbench-start.mp4"), Buffer.from(base64, "base64")));
    await page.evaluate(async () => {
      const film = window.WorkbenchStart;
      film.pause();
      const canvas = document.querySelector("#film");
      const type = "video/mp4;codecs=avc1.42001E";
      if (!MediaRecorder.isTypeSupported(type)) throw new Error("H.264 MP4 recording unavailable");
      film.render(0);
      const stream = canvas.captureStream(24);
      const recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 4800000 });
      const chunks = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      const stopped = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = (event) => reject(new Error(event.error?.message || "Recording failed"));
      });
      recorder.start(1000);
      const start = performance.now();
      await new Promise((resolve) => {
        function frame() {
          const time = (performance.now() - start) / 1000;
          film.render(time);
          if (time < film.duration) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
      recorder.stop();
      await stopped;
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type });
      const data = await new Promise((resolve) => {
        const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(",")[1]); reader.readAsDataURL(blob);
      });
      await window.saveRecording(data);
    });
    assert.deepEqual(errors, []);
    assert.ok(fs.statSync(path.join(output, "workbench-start.mp4")).size > 100000);
    const video = path.join(output, "workbench-start.mp4");
    fs.writeFileSync(video, finalize(fs.readFileSync(video)).buffer);
    console.log("PASS: 1920x1080 H.264 MP4, 102-second animation and 16 storyboard frames generated.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
