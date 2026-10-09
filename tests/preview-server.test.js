const assert = require("node:assert/strict");
const test = require("node:test");
const { createPreviewServer } = require("../tools/preview-workbench.cjs");

async function withServer(run) {
  const server = createPreviewServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}

test("Vorschau liefert nur App-Dateien und passende WASM-/Video-Typen", () => withServer(async (base) => {
  for (const [url, type] of [["/", "text/html"], ["/vendor/sql.js/sql-wasm.wasm", "application/wasm"],
    ["/assets/tutorials/workbench-start.mp4", "video/mp4"]]) {
    const response = await fetch(base + url, { method: "HEAD" });
    assert.equal(response.status, 200, url);
    assert.ok(response.headers.get("content-type").startsWith(type));
    assert.equal(response.headers.get("accept-ranges"), "bytes");
    assert.equal(await response.text(), "");
  }
  for (const url of ["/resources/workbenchlab-loesungen.json", "/.git/config", "/tests/nagold.test.js", "/assets/%2e%2e%5cresources/secret.json",
    "/assets/test.png:secret", "/assets/%00", "/assets/no-such-file.png", "/assets/bpe6-relief-map.png", "/assets/%2e%2e/resources/secret.json"]) {
    const response = await fetch(base + url);
    assert.equal(response.status, 404, url);
    await response.arrayBuffer();
  }
  const bad = await fetch(base + "/assets/%zz");
  assert.equal(bad.status, 400);
  const post = await fetch(base + "/", { method: "POST" });
  assert.equal(post.status, 405);
}));

test("Vorschau unterstützt gültige Byte-Bereiche, Suffixe und Bereichsfehler", () => withServer(async (base) => {
  const url = base + "/assets/tutorials/workbench-start.mp4";
  const all = Buffer.from(await (await fetch(url)).arrayBuffer());
  for (const [range, start, end] of [["bytes=0-31", 0, 31], ["bytes=-16", all.length - 16, all.length - 1],
    [`bytes=${all.length - 10}-`, all.length - 10, all.length - 1], [`bytes=${all.length - 10}-${all.length + 50}`, all.length - 10, all.length - 1]]) {
    const response = await fetch(url, { headers: { Range: range } });
    assert.equal(response.status, 206, range);
    assert.equal(response.headers.get("content-range"), `bytes ${start}-${end}/${all.length}`);
    assert.equal(Number(response.headers.get("content-length")), end - start + 1);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), all.subarray(start, end + 1));
  }
  for (const range of ["bytes=-0", "bytes=-", "bytes=20-1", `bytes=${all.length}-`, "bytes=9999999999999999999999999-", "bytes=0-1,3-4", "words=0-2"]) {
    const response = await fetch(url, { headers: { Range: range } });
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get("content-range"), `bytes */${all.length}`);
  }
}));
