/* Isolated transport tests: no live storage or database access. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const cache = new Map();
async function load(file) {
  if (cache.has(file)) return cache.get(file);
  const loaded = new vm.SourceTextModule(fs.readFileSync(file, "utf8"), { identifier: file });
  cache.set(file, loaded);
  await loaded.link((name, parent) => load(path.resolve(path.dirname(parent.identifier), name + ".js")));
  return loaded;
}
(async () => {
  const responseModule = await load(path.resolve("lib/adminResponse.js"));
  await responseModule.evaluate();
  const { adminResponse } = responseModule.namespace;
  for (const [status, body, message] of [
    [413, "Request Entity Too Large", /oversized/],
    [502, "<html>Bad gateway</html>", /unexpected response \(502\)/],
    [400, JSON.stringify({ error: { message: "Provider image limit exceeded" } }), /Provider image limit exceeded/],
  ]) await assert.rejects(adminResponse(new Response(body, { status })), message);
  assert.deepEqual(await adminResponse(Response.json({ success: true })), { success: true });

  const imageModule = await load(path.resolve("lib/adminImageFile.js"));
  await imageModule.evaluate();
  const { readAdminImage } = imageModule.namespace;
  const originalFetch = global.fetch;
  const originalXHR = global.XMLHttpRequest;
  const chunks = [];
  const calls = [];
  let failure = false;
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return Response.json({ uploadUrl: "https://storage.invalid/image/upload", apiKey: "public-key", signature: "signature", params: { timestamp: 1 } });
  };
  global.XMLHttpRequest = class {
    upload = {};
    headers = {};
    open(method, url) { assert.equal(method, "POST"); assert.equal(url, "https://storage.invalid/image/upload"); }
    setRequestHeader(key, value) { this.headers[key] = value; }
    send(form) {
      const chunk = form.get("file");
      assert.equal(form.get("signature"), "signature");
      chunks.push({ size: chunk.size, ...this.headers });
      this.upload.onprogress({ lengthComputable: true, loaded: chunk.size, total: chunk.size });
      this.status = failure ? 413 : 200;
      this.responseText = failure ? "Payload too large" : JSON.stringify(
        chunks.length === 3 ? { done: true, secure_url: "https://res.cloudinary.com/fixture/image/upload/v1/large.png" } : { done: false },
      );
      queueMicrotask(() => this.onload());
    }
  };
  try {
    const size = 20 * 1024 * 1024 + 123;
    const file = new File([new Uint8Array(size)], "large.png", { type: "image/png" });
    const progress = [];
    const url = await readAdminImage(file, { adminKey: "test-key", folder: "gallery", onProgress: (p) => progress.push(p) });
    assert.equal(url, "https://res.cloudinary.com/fixture/image/upload/f_auto,q_auto:best/v1/large.png");
    assert.equal(chunks.length, 3);
    assert.equal(chunks.reduce((sum, chunk) => sum + chunk.size, 0), size);
    assert.equal(new Set(chunks.map((chunk) => chunk["X-Unique-Upload-Id"])).size, 1);
    assert.equal(chunks[0]["Content-Range"], `bytes 0-8388607/${size}`);
    assert.equal(chunks[2]["Content-Range"], `bytes 16777216-${size - 1}/${size}`);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].options.body, '{"folder":"gallery"}');
    assert.ok(progress.every((p, i) => !i || p >= progress[i - 1]));
    assert.equal(progress.at(-1), 100);
    await assert.rejects(readAdminImage(new File(["x"], "bad.svg", { type: "image/svg+xml" })), /Select a JPG/);
    await assert.rejects(readAdminImage(new File([], "empty.jpg", { type: "image/jpeg" })), /empty/);
    failure = true;
    await assert.rejects(readAdminImage(file, { adminKey: "test-key", folder: "gallery" }), /supported account limits/);
    console.log("PASS 20 MB+ direct chunked upload, exact byte ranges, progress, URL-only app request, originals preserved, format/empty validation, provider limits, non-JSON 413/502 errors");
  } finally {
    global.fetch = originalFetch;
    global.XMLHttpRequest = originalXHR;
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
