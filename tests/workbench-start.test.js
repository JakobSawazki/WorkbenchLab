const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const root = path.resolve(__dirname, "..");

function animation() {
  const words = [];
  const ctx = new Proxy({}, {
    get(_target, key) {
      if (key === "measureText") return (value) => ({ width: value.length * 16 });
      if (key === "createLinearGradient") return () => ({ addColorStop() {} });
      if (key === "fillText") return (value) => words.push(value);
      return () => {};
    },
    set() { return true; }
  });
  const elements = new Map();
  const context = vm.createContext({
    window: {},
    document: { querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, {
        getContext: () => ctx, setAttribute() {}, addEventListener() {}
      });
      return elements.get(selector);
    } },
    Image: class { addEventListener() {} },
    requestAnimationFrame() {},
    performance: { now: () => 0 }
  });
  vm.runInContext(fs.readFileSync(path.join(root, "assets/tutorials/workbench-start-animation.js"), "utf8"), context);
  return { film: context.window.WorkbenchStart, words };
}

test("start animation has a continuous timeline in the required order", () => {
  const { film } = animation();
  assert.equal(film.duration, 102);
  let end = 0;
  for (const scene of film.scenes) {
    assert.equal(scene.start, end);
    assert.ok(scene.end > scene.start);
    end = scene.end;
    assert.equal(film.render(scene.start).kind, scene.kind);
  }
  assert.equal(end, film.duration);
  const start = (kind) => film.scenes.find((scene) => scene.kind === kind).start;
  assert.ok(start("mysql") < start("console"));
  assert.ok(start("console") < start("workbench"));
  assert.ok(start("workbench") < start("connection"));
  assert.ok(start("test") < start("save"));
  assert.ok(start("save") < start("open"));
});

test("server readiness, connection values and simulated test remain explicit", () => {
  const { film, words } = animation();
  words.length = 0;
  film.render(2);
  assert.ok(!words.includes("CMD · MySQL läuft"));
  words.length = 0;
  film.render(35);
  assert.ok(words.includes("Nicht schließen!"));
  assert.ok(words.includes("mysqld: ready for connections.  port: 3306"));
  words.length = 0;
  film.render(74);
  for (const value of ["local", "Standard (TCP/IP)", "127.0.0.1", "3306", "root"]) {
    assert.ok(words.includes(value), value);
  }
  words.length = 0;
  film.render(81);
  assert.ok(words.includes("Beispiel eines erfolgreichen Tests"));
});

test("reference video is local, captioned and never autoplays", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const markup = app.match(/<section class="workbench-start-film"[\s\S]*?<\/section>/)[0];
  assert.match(markup, /controls playsinline preload="none"/);
  assert.doesNotMatch(markup, /autoplay|https?:/);
  for (const file of ["workbench-start.mp4", "workbench-start-poster.png", "workbench-start.de.vtt"]) {
    assert.ok(fs.existsSync(path.join(root, "assets/tutorials", file)));
  }
  const vtt = fs.readFileSync(path.join(root, "assets/tutorials/workbench-start.de.vtt"), "utf8");
  assert.ok(vtt.startsWith("WEBVTT"));
  assert.match(vtt, /01:35\.000 --> 01:42\.000/);
});
