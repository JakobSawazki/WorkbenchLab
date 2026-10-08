const { readdirSync } = require("node:fs");
const { resolve } = require("node:path");
const { spawnSync } = require("node:child_process");

const root = resolve(__dirname, "..");
const files = readdirSync(resolve(root, "tests"))
  .filter((file) => file.endsWith(".test.js"))
  .sort()
  .map((file) => resolve(root, "tests", file));
if (!files.length) throw new Error("Keine Node-Tests gefunden.");
const result = spawnSync(process.execPath, ["--test", ...files], { cwd: root, stdio: "inherit" });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
