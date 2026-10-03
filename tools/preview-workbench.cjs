const http = require("node:http");
const path = require("node:path");
const send = require("send");
const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4174);
http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname); }
  catch { response.writeHead(400); response.end(); return; }
  if (pathname.split(/[\\/]/).some((part) => part.startsWith(".") || ["resources", "node_modules"].includes(part))) {
    response.writeHead(404); response.end(); return;
  }
  send(request, pathname, { root, dotfiles: "deny", index: "index.html" })
    .on("error", (error) => { response.writeHead(error.statusCode || 500); response.end(); })
    .pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`WorkbenchLab: http://127.0.0.1:${port}`));
