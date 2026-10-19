/* Real contact route/helper, isolated MongoDB and Resend. No .env, network or real writes. */
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { ObjectId } = require("mongodb");
const { NextResponse } = require("next/server");
const root = path.resolve(__dirname, "..");
const messages = new Map(),
  cache = new Map(),
  calls = [],
  diagnostics = [],
  checks = [];
let dbFails = false,
  resultSaveFails = false,
  limited = false,
  mode = "success",
  release,
  failClaim = false;
const config = () => {
  process.env.RESEND_API_KEY = "re_isolated_not_real";
  process.env.RESEND_FROM_EMAIL = "Office <office@example.invalid>";
  process.env.RESEND_TO_EMAIL = "inbox@example.invalid";
};
config();
process.env.ADMIN_DASHBOARD_KEY = "contact-test-admin-key";
global.fetch = async () => {
  throw Error("Network forbidden in isolated tests");
};
const get = (object, field) =>
  field.split(".").reduce((value, key) => value?.[key], object);
const matches = (doc, query) =>
  Object.entries(query).every(([key, value]) =>
    value && "$in" in Object(value)
      ? value.$in.includes(get(doc, key))
      : String(get(doc, key)) === String(value),
  );
const db = {
  collection: (name) => {
    if (name === "complaints")
      return {
        find: () => ({
          sort() {
            return this;
          },
          limit() {
            return this;
          },
          toArray: async () => [],
        }),
      };
    assert.equal(name, "contact_messages");
    return {
      find: () => ({
        sort() {
          return this;
        },
        limit() {
          return this;
        },
        toArray: async () =>
          [...messages.values()].map((doc) => structuredClone(doc)),
      }),
      insertOne: async (doc) => {
        if (messages.has(String(doc._id)))
          throw Object.assign(Error("Duplicate"), { code: 11000 });
        messages.set(
          String(doc._id),
          structuredClone({ ...doc, _id: doc._id.toString() }),
        );
        return { insertedId: doc._id };
      },
      findOne: async (query) => {
        const doc = [...messages.values()].find((item) => matches(item, query));
        return doc
          ? { ...structuredClone(doc), _id: new ObjectId(doc._id) }
          : null;
      },
      updateOne: async (query, update) => {
        if (failClaim && query["notification.status"])
          throw Error("Claim failed");
        if (resultSaveFails && update.$set.notification)
          throw Error("Result write failed");
        const doc = [...messages.values()].find((item) => matches(item, query));
        if (!doc) return { matchedCount: 0 };
        for (const [field, value] of Object.entries(update.$set)) {
          const keys = field.split(".");
          let current = doc;
          for (const key of keys.slice(0, -1)) current = current[key] ||= {};
          current[keys.at(-1)] = structuredClone(value);
        }
        return { matchedCount: 1 };
      },
    };
  },
};
class FakeResend {
  constructor(key) {
    assert.equal(key, process.env.RESEND_API_KEY);
    this.emails = {
      send: async (payload, options) => {
        calls.push({ payload, options });
        assert.ok(
          [...messages.values()].some(
            (doc) => doc.notification.status === "sending",
          ),
        );
        if (mode === "wait")
          await new Promise((resolve) => {
            release = resolve;
          });
        if (mode === "throw")
          throw Error(
            "PROVIDER SECRET credential-value address@example.invalid",
          );
        if (mode === "rejected")
          return {
            data: null,
            error: {
              statusCode: 422,
              name: "validation_error",
              message: "PROVIDER SECRET credential-value",
            },
          };
        if (mode === "unknown")
          return {
            data: null,
            error: { message: "PROVIDER SECRET network failure" },
          };
        return { data: { id: "isolated-provider-id" }, error: null };
      },
    };
  }
}
function synthetic(id, exports) {
  if (!cache.has(id))
    cache.set(
      id,
      new vm.SyntheticModule(
        Object.keys(exports),
        function () {
          for (const [key, value] of Object.entries(exports))
            this.setExport(key, value);
        },
        { identifier: id },
      ),
    );
  return cache.get(id);
}
async function load(file) {
  if (cache.has(file)) return cache.get(file);
  if (file === path.join(root, "lib", "mongodb.js"))
    return synthetic(file, {
      getDatabase: async () => {
        if (dbFails) throw Error("DB SECRET mongodb://credentials");
        return db;
      },
    });
  if (file === path.join(root, "lib", "rateLimit.js"))
    return synthetic(file, { rateLimit: () => limited });
  const loaded = new vm.SourceTextModule(fs.readFileSync(file, "utf8"), {
    identifier: file,
  });
  cache.set(file, loaded);
  await loaded.link((specifier, parent) => {
    if (specifier.startsWith(".")) {
      let target = path.resolve(path.dirname(parent.identifier), specifier);
      if (!path.extname(target)) target += ".js";
      return load(target);
    }
    return synthetic(
      specifier,
      specifier === "resend"
        ? { Resend: FakeResend }
        : specifier === "next/server"
          ? { NextResponse }
          : require(specifier),
    );
  });
  return loaded;
}
const fields = {
  name: "Fixture citizen",
  phone: "0000000000",
  email: "citizen@example.invalid",
  message: "Fixture contact enquiry text",
};
const req = (body = fields, key = randomUUID()) =>
  new Request("https://site.example.invalid/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: JSON.stringify(body),
  });
const pass = (text) => {
  checks.push(text);
  console.log("PASS " + text);
};
const reset = () => {
  messages.clear();
  calls.length = 0;
  config();
  mode = "success";
  dbFails = resultSaveFails = limited = failClaim = false;
};
(async () => {
  const source = await load(path.join(root, "app/api/contact/route.js"));
  await source.evaluate();
  const { POST } = source.namespace;
  const helper = cache.get(
    path.join(root, "lib", "contactNotification.server.js"),
  ).namespace;
  const oldError = console.error;
  console.error = (...args) => diagnostics.push(args.join(" "));
  try {
    for (const payload of [
      {},
      { ...fields, phone: "bad" },
      { ...fields, email: "x@example.invalid\r\nBcc:x@example.invalid" },
      { ...fields, email: "x@example.invalid@" },
      { ...fields, message: "short" },
    ])
      assert.equal((await POST(req(payload))).status, 400);
    assert.equal(
      (
        await POST(
          new Request("https://fixture/api/contact", {
            method: "POST",
            body: "{",
          }),
        )
      ).status,
      400,
    );
    assert.equal((await POST(req(fields, "bad-key"))).status, 400);
    limited = true;
    assert.equal((await POST(req())).status, 429);
    limited = false;
    assert.equal((await POST(req({ ...fields, website: "bot" }))).status, 201);
    assert.equal(messages.size, 0);
    assert.equal(calls.length, 0);
    pass(
      "Validation, malformed JSON, invalid idempotency key, rate limit and honeypot prevent writes/sends",
    );
    reset();
    const key = randomUUID();
    let response = await POST(req(fields, key));
    let body = await response.json();
    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.equal(body.email.contact.sent, true);
    assert.equal(messages.size, 1);
    assert.equal(calls.length, 1);
    assert.equal([...messages.values()][0].notification.status, "sent");
    assert.equal(
      [...messages.values()][0].notification.providerId,
      "isolated-provider-id",
    );
    assert.equal("autoReply" in body.email, false);
    assert.deepEqual(calls[0].payload.to, ["inbox@example.invalid"]);
    assert.equal(calls[0].payload.replyTo, fields.email);
    assert.equal(
      calls[0].payload.subject,
      "New Website Enquiry — Sachin Lavate Office",
    );
    assert.match(calls[0].payload.text, /not a civic complaint/);
    assert.match(calls[0].options.idempotencyKey, /^contact-office\//);
    assert.ok(calls[0].options.signal);
    const accepted = calls[0];
    await POST(req(fields, key));
    assert.equal(messages.size, 1);
    assert.equal(calls.length, 1);
    assert.equal(
      (await POST(req({ ...fields, message: "Different enquiry text" }, key)))
        .status,
      409,
    );
    assert.equal(messages.size, 1);
    assert.equal(calls.length, 1);
    pass(
      "Persist first; one office notification, safe result recorded, Reply-To, no citizen email; repeated requests do not duplicate",
    );
    // A recorded acceptance prevents a send even after the provider deduplication window.
    await helper.notifyStoredContact(db, {
      ...[...messages.values()][0],
      _id: new ObjectId([...messages.keys()][0]),
    });
    assert.equal(calls.length, 1);
    pass(
      "Notification-only retries reuse stored record and do not resend accepted notifications",
    );
    reset();
    mode = "rejected";
    const retryKey = randomUUID();
    response = await POST(req(fields, retryKey));
    body = await response.json();
    assert.equal(response.status, 201);
    assert.equal(body.email.contact.sent, false);
    assert.equal(messages.size, 1);
    assert.equal(
      [...messages.values()][0].notification.code,
      "PROVIDER_REJECTED",
    );
    assert.doesNotMatch(
      JSON.stringify(body),
      /PROVIDER SECRET|credential-value|validation_error/,
    );
    const firstPayload = JSON.stringify(calls[0].payload),
      firstProviderKey = calls[0].options.idempotencyKey;
    mode = "success";
    await POST(req(fields, retryKey));
    assert.equal(messages.size, 1);
    assert.equal(calls.length, 2);
    assert.equal(JSON.stringify(calls[1].payload), firstPayload);
    assert.equal(calls[1].options.idempotencyKey, firstProviderKey);
    pass(
      "Known provider rejection preserves success; notification retry uses identical payload/key and creates no new record",
    );
    for (const failure of ["throw", "unknown"]) {
      reset();
      mode = failure;
      const token = randomUUID();
      response = await POST(req(fields, token));
      assert.equal(response.status, 201);
      assert.equal((await response.json()).email.contact.sent, false);
      await POST(req(fields, token));
      assert.equal(messages.size, 1);
      assert.equal(calls.length, 1);
      assert.equal([...messages.values()][0].notification.status, "unknown");
    }
    pass(
      "Ambiguous provider/network outcomes are retained for review and not blindly resent",
    );
    const adminSource = await load(
      path.join(root, "app/api/admin/submissions/route.js"),
    );
    await adminSource.evaluate();
    const inbox = await adminSource.namespace.GET(
      new Request("https://fixture/api/admin/submissions", {
        headers: { "x-admin-key": process.env.ADMIN_DASHBOARD_KEY },
      }),
    );
    assert.equal(inbox.status, 200);
    const contacts = (await inbox.json()).contacts;
    assert.equal(contacts.length, 1);
    assert.equal(contacts[0].message, fields.message);
    pass(
      "Saved contact remains visible through the unchanged authorized admin inbox when notification fails",
    );
    for (const [variable, value, code] of [
      ["RESEND_API_KEY", "", "MISSING_RESEND_API_KEY"],
      ["RESEND_API_KEY", "bad key", "INVALID_RESEND_API_KEY"],
      ["RESEND_FROM_EMAIL", "", "MISSING_RESEND_FROM_EMAIL"],
      ["RESEND_FROM_EMAIL", "invalid", "INVALID_RESEND_FROM_EMAIL"],
      ["RESEND_TO_EMAIL", "", "MISSING_RESEND_TO_EMAIL"],
      [
        "RESEND_TO_EMAIL",
        "one@example.invalid,two@example.invalid",
        "INVALID_RESEND_TO_EMAIL",
      ],
    ]) {
      reset();
      process.env[variable] = value;
      response = await POST(req());
      assert.equal(response.status, 201);
      assert.equal((await response.json()).email.contact.sent, false);
      assert.equal(calls.length, 0);
      assert.equal([...messages.values()][0].notification.code, code);
    }
    pass(
      "Missing key/from/to and invalid sender/recipient configuration give fixed diagnostics with durable success",
    );
    reset();
    process.env.RESEND_API_KEY = "";
    const configurationRetry = randomUUID();
    await POST(req(fields, configurationRetry));
    config();
    await POST(req(fields, configurationRetry));
    assert.equal(messages.size, 1);
    assert.equal(calls.length, 1);
    reset();
    const injection = "<script>alert(\"x\")</script> & 'quote'";
    await POST(req({ ...fields, name: injection, message: injection }));
    assert.ok(!calls[0].payload.html.includes("<script>"));
    assert.match(calls[0].payload.html, /&lt;script&gt;/);
    assert.match(calls[0].payload.html, /&amp;/);
    assert.match(calls[0].payload.html, /&quot;/);
    assert.match(calls[0].payload.html, /&#39;/);
    assert.ok(calls[0].payload.text.includes(injection));
    pass(
      "Configuration repair retries existing notification; HTML escapes user fields and plain text retains readable message",
    );
    reset();
    await POST(req({ ...fields, email: "" }));
    assert.equal("replyTo" in calls[0].payload, false);
    assert.equal(calls.length, 1);
    reset();
    await POST(req(fields, null));
    assert.equal(messages.size, 1);
    assert.equal(calls.length, 1);
    pass(
      "Optional email and legacy header-free request contract remain supported",
    );
    reset();
    dbFails = true;
    response = await POST(req());
    assert.equal(response.status, 500);
    assert.equal(messages.size, 0);
    assert.equal(calls.length, 0);
    assert.doesNotMatch(
      JSON.stringify(await response.json()),
      /DB SECRET|mongodb|credentials/,
    );
    reset();
    resultSaveFails = true;
    const resultKey = randomUUID();
    response = await POST(req(fields, resultKey));
    assert.equal(response.status, 201);
    assert.equal(messages.size, 1);
    await POST(req(fields, resultKey));
    assert.equal(calls.length, 1);
    reset();
    failClaim = true;
    response = await POST(req());
    assert.equal(response.status, 201);
    assert.equal(messages.size, 1);
    assert.equal(calls.length, 0);
    pass(
      "DB insertion failure never sends; post-save claim/result-write failure never loses the saved submission",
    );
    reset();
    mode = "wait";
    const concurrentKey = randomUUID();
    const pending = POST(req(fields, concurrentKey));
    while (!release) await new Promise((resolve) => setTimeout(resolve, 1));
    const duplicate = await POST(req(fields, concurrentKey));
    assert.equal(duplicate.status, 201);
    assert.equal(messages.size, 1);
    assert.equal(calls.length, 1);
    mode = "success";
    release();
    await pending;
    pass(
      "Concurrent duplicate submission claims exactly one notification and stores exactly one message",
    );
    assert.doesNotMatch(
      diagnostics.join("\n"),
      /PROVIDER SECRET|credential-value|DB SECRET|re_isolated_not_real|inbox@example.invalid|Fixture citizen/,
    );
    pass(
      "Provider failures, credentials and citizen content never appear in public errors or diagnostic logs",
    );
    assert.equal(accepted.payload.from, "Office <office@example.invalid>");
  } finally {
    console.error = oldError;
  }
  fs.writeFileSync(
    "docs/phase6-resend-check-results.json",
    JSON.stringify(
      {
        environment:
          "Real contact route/helper with in-memory MongoDB and fake official SDK; no .env, network, real sends or production writes",
        checks,
      },
      null,
      2,
    ),
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
