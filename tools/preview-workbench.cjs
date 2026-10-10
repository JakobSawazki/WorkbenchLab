const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");
const { isPublicFile } = require("./build-site.cjs");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".wasm": "application/wasm",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".mp4": "video/mp4", ".vtt": "text/vtt; charset=utf-8", ".sql": "text/plain; charset=utf-8" };

function createPreviewServer(directory = path.resolve(__dirname, "..")) {
  const root = fs.realpathSync(directory);
  return http.createServer((request, response) => {
    const fail = (status, headers = {}) => { response.writeHead(status, headers); response.end(); };
    if (!["GET", "HEAD"].includes(request.method)) { fail(405, { Allow: "GET, HEAD" }); return; }
    let name;
    try { name = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname).replace(/^\/+/, "") || "index.html"; }
    catch { fail(400); return; }
    if (name.includes("\\") || name.includes(":") || name.includes("\0") || name.split("/").includes("..") || !isPublicFile(name)) {
      fail(404); return;
    }
    let filename, stat;
    try {
      filename = fs.realpathSync(path.join(root, name));
      const relative = path.relative(root, filename);
      if (relative.startsWith("..") || path.isAbsolute(relative) || !isPublicFile(relative.split(path.sep).join("/"))) { fail(404); return; }
      stat = fs.statSync(filename);
      if (!stat.isFile()) { fail(404); return; }
    } catch { fail(404); return; }
    const headers = { "Content-Type": types[path.extname(filename).toLowerCase()] || "application/octet-stream",
      "Accept-Ranges": "bytes", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
    let start = 0, end = stat.size - 1, status = 200;
    if (request.headers.range && request.method === "GET") {
      const range = request.headers.range.match(/^bytes=(\d*)-(\d*)$/);
      if (!range || (!range[1] && !range[2]) || !stat.size) { fail(416, { "Content-Range": `bytes */${stat.size}` }); return; }
      if (range[1]) {
        start = Number(range[1]);
        if (range[2]) end = Math.min(Number(range[2]), end);
      } else {
        const suffix = Number(range[2]);
        if (!Number.isSafeInteger(suffix) || suffix < 1) { fail(416, { "Content-Range": `bytes */${stat.size}` }); return; }
        start = Math.max(0, stat.size - suffix);
      }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) {
        fail(416, { "Content-Range": `bytes */${stat.size}` }); return;
      }
      headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
      status = 206;
    }
    headers["Content-Length"] = stat.size ? end - start + 1 : 0;
    response.writeHead(status, headers);
    if (request.method === "HEAD" || !stat.size) { response.end(); return; }
    const stream = fs.createReadStream(filename, { start, end }).on("error", () => response.destroy());
    response.on("close", () => stream.destroy());
    stream.pipe(response);
  });
}

module.exports = { createPreviewServer };
if (require.main === module) {
  const port = Number(process.env.PORT || 4174);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid preview port");
  createPreviewServer(process.env.WORKBENCH_PREVIEW_DIR || undefined).listen(port, "127.0.0.1", () => console.log(`WorkbenchLab: http://127.0.0.1:${port}`));
}
