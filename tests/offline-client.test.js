const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const source = fs.readFileSync(path.join(__dirname, "../offline-client.js"), "utf8");

test("Without offline controls, only an existing own worker is updated; no registration or deletion", async () => {
  const scope = "https://example.test/WorkbenchLab/";
  for (const mode of ["none", "own", "foreign-scope", "foreign-script", "blocked", "offline", "file"]) {
    const calls = [];
    const registration = mode === "none" ? undefined : {
      scope: mode === "foreign-scope" ? "https://example.test/" : scope,
      active: { scriptURL: mode === "foreign-script" ? scope + "foreign.js" : scope + "offline-worker.js" },
      update: async () => { calls.push("update"); if (mode === "offline") throw new Error("offline"); },
      unregister: () => { throw new Error("Must not unregister"); }
    };
    const context = {
      URL, window: {}, isSecureContext: true,
      location: { protocol: mode === "file" ? "file:" : "https:", href: scope },
      document: { querySelector: () => null },
      navigator: { get serviceWorker() {
        if (mode === "blocked") throw new Error("Blocked");
        return {
          getRegistration: async value => { assert.equal(value, scope); calls.push("lookup"); return registration; },
          register: () => { throw new Error("Must not install"); }
        };
      } }
    };
    vm.runInNewContext(source, context);
    context.window.WORKBENCH_OFFLINE_CLIENT.init();
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(calls, ["blocked", "file"].includes(mode) ? [] : ["lookup", ...(["own", "offline"].includes(mode) ? ["update"] : [])], mode);
  }
});
