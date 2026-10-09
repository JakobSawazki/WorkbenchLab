const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

module.exports = function artifacts(folder) {
  const directory = path.join(os.tmpdir(), "workbenchlab-tests", folder);
  fs.mkdirSync(directory, { recursive: true });
  return directory;
};
