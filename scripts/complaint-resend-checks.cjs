/* Isolated real route/helper execution. No .env, live database, uploads or email. */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { ObjectId } = require("mongodb");
const { NextResponse } = require("next/server");
const root = path.resolve(__dirname, "..");
const cache = new Map(),
  docs = [],
  sends = [],
  checks = [];
let mode = "success",
  dbFail = false,
  uploadFail = false,
  uploads = 0,
  collision = false,
  resultFail = false;
global.fetch = async () => {
  throw Error("Live network forbidden");
};
process.env.RESEND_API_KEY = "re_isolated";
process.env.RESEND_FROM_EMAIL = "office@example.invalid";
process.env.RESEND_TO_EMAIL = "inbox@example.invalid";
process.env.ADMIN_DASHBOARD_KEY = "isolated-admin";
for (const key of [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
])
  process.env[key] = "isolated";
const field = (doc, key) => key.split(".").reduce((d, k) => d?.[k], doc);
const matches = (doc, query) =>
  Object.entries(query).every(([k, v]) => String(field(doc, k)) === String(v));
function apply(doc, update) {
  for (const [k, v] of Object.entries(update.$set || {})) {
    const keys = k.split(".");
    let obj = doc;
    for (const part of keys.slice(0, -1)) obj = obj[part] ||= {};
    obj[keys.at(-1)] = v;
  }
  for (const [k, v] of Object.entries(update.$push || {}))
    (doc[k] ||= []).push(v);
}
const collection = {
  createIndex: async () => "complaintId_1",
  insertOne: async (doc) => {
    if (dbFail) throw Error("Private DB error");
    if (collision) {
      collision = false;
      throw Object.assign(Error("Collision"), { code: 11000 });
    }
    if (
      docs.some(
        (d) =>
          String(d._id) === String(doc._id) ||
          d.complaintId === doc.complaintId,
      )
    )
      throw Object.assign(Error("Duplicate"), { code: 11000 });
    docs.push({ ...doc });
    return { insertedId: doc._id };
  },
  findOne: async (q, options) => {
    const d = docs.find((d) => matches(d, q));
    if (!d) return null;
    if (options?.projection)
      return Object.fromEntries(
        Object.entries(d).filter(([k]) => options.projection[k] === 1),
      );
    return { ...d };
  },
  updateOne: async (q, u) => {
    if (resultFail && u.$set.notification) throw Error("Result write failed");
    const d = docs.find((d) => matches(d, q));
    if (!d) return { matchedCount: 0 };
    apply(d, u);
    return { matchedCount: 1 };
  },
  findOneAndUpdate: async (q, u) => {
    const d = docs.find((d) => matches(d, q));
    if (!d) return null;
    apply(d, u);
    return { ...d };
  },
};
const db = {
  collection: (name) => {
    assert.equal(name, "complaints");
    return collection;
  },
};
class FakeResend {
  constructor() {
    this.emails = {
      send: async (payload, options) => {
        sends.push({ payload, options });
        if (mode === "throw") throw Error("Secret provider error");
        if (mode === "unknown")
          return { error: { message: "Network uncertainty" } };
        if (mode === "rejected")
          return { error: { statusCode: 403, message: "Secret error" } };
        return { data: { id: "isolated-email-" + sends.length } };
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
          for (const [k, v] of Object.entries(exports)) this.setExport(k, v);
        },
        { identifier: id },
      ),
    );
  return cache.get(id);
}
async function load(file) {
  if (cache.has(file)) return cache.get(file);
  if (file === path.join(root, "lib/mongodb.js"))
    return synthetic(file, { getDatabase: async () => db });
  if (file === path.join(root, "lib/rateLimit.js"))
    return synthetic(file, { rateLimit: () => false });
  const mod = new vm.SourceTextModule(fs.readFileSync(file, "utf8"), {
    identifier: file,
  });
  cache.set(file, mod);
  await mod.link((s, p) => {
    if (s.startsWith(".")) {
      let f = path.resolve(path.dirname(p.identifier), s);
      if (!path.extname(f)) f += ".js";
      return load(f);
    }
    if (s === "resend") return synthetic(s, { Resend: FakeResend });
    if (s === "next/server") return synthetic(s, { NextResponse });
    if (s === "cloudinary")
      return synthetic(s, {
        v2: {
          config: () => {},
          uploader: {
            upload: async (data, options) => {
              assert(data.startsWith("data:image/"));
              assert.equal(options.folder, "complaints");
              assert.equal(options.overwrite, false);
              uploads++;
              if (uploadFail) throw Error("Upload failed");
              return {
                secure_url: "https://example.invalid/private.png",
                public_id: options.public_id,
              };
            },
          },
        },
      });
    return synthetic(s, require(s));
  });
  return mod;
}
async function moduleAt(file) {
  const m = await load(path.join(root, file));
  if (m.status !== "evaluated") await m.evaluate();
  return m.namespace;
}
const payload = {
  name: "PRIVATE NAME",
  phone: "0000000000",
  address: "PRIVATE ADDRESS",
  complaintType: "Street light",
  location: "Sector <script>alert(1)</script>",
  description: "Issue <img src=x onerror=bad()> requiring civic follow-up.",
  website: "",
};
const request = (body = payload, key = randomUUID()) =>
  new Request("http://localhost/api/complaints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: JSON.stringify(body),
  });
async function run() {
  const route = await moduleAt("app/api/complaints/route.js");
  const helper = await moduleAt("lib/complaintNotification.server.js");
  const admin = await moduleAt("app/api/admin/submissions/route.js");
  const key = randomUUID();
  let r = await route.POST(request(payload, key));
  assert.equal(r.status, 201);
  const result = await r.json();
  assert.match(result.complaintId, /^CMP-\d{6}$/);
  assert.equal(result.status, "Under Review");
  assert.equal(docs.length, 1);
  assert.equal(sends.length, 1);
  assert.equal(docs[0].notification.status, "sent");
  const mail = sends[0].payload;
  assert.equal(mail.subject, "New Citizen Complaint — " + result.complaintId);
  assert(
    mail.text.includes("IST") || mail.text.includes("India Standard Time"),
  );
  assert(mail.html.includes("&lt;script&gt;"));
  assert(!mail.html.includes("<script>"));
  assert(!mail.html.includes("<img src=x"));
  assert(mail.text.includes("/ward-control/complaints"));
  for (const value of ["PRIVATE NAME", "0000000000", "PRIVATE ADDRESS"])
    assert(!JSON.stringify(mail).includes(value));
  assert(!mail.attachments);
  assert(!mail.replyTo);
  assert.equal(mail.to.length, 1);
  assert.equal(
    sends[0].options.idempotencyKey,
    "complaint-office/" + result.complaintId,
  );
  checks.push(
    "Saved complaint, original ID/status/response, one office email, escaped HTML/plain text, IST, no citizen PII/attachments/auto-reply",
  );
  await route.POST(request(payload, key));
  await Promise.all([
    route.POST(request(payload, key)),
    route.POST(request(payload, key)),
  ]);
  assert.equal(docs.length, 1);
  assert.equal(sends.length, 1);
  assert.equal(
    (await route.POST(request({ ...payload, location: "changed" }, key)))
      .status,
    409,
  );
  const concurrentKey = randomUUID();
  const both = await Promise.all([
    route.POST(request(payload, concurrentKey)),
    route.POST(request(payload, concurrentKey)),
  ]);
  assert.equal(both[0].status, 201);
  assert.equal(both[1].status, 201);
  assert.equal(
    (await both[0].json()).complaintId,
    (await both[1].json()).complaintId,
  );
  assert.equal(docs.length, 2);
  assert.equal(sends.length, 2);
  await Promise.all([
    helper.notifyStoredComplaint(db, docs[1]),
    helper.notifyStoredComplaint(db, docs[1]),
  ]);
  assert.equal(sends.length, 2);
  checks.push(
    "Sequential/concurrent replays keep one record/ID/send per key; changed payload rejected; atomic notification claim",
  );
  for (const [m, expected] of [
    ["rejected", "failed"],
    ["unknown", "unknown"],
    ["throw", "unknown"],
  ]) {
    mode = m;
    const k = randomUUID();
    r = await route.POST(request(payload, k));
    assert.equal(r.status, 201);
    const d = docs.at(-1);
    assert.equal(d.notification.status, expected);
    const n = sends.length;
    await route.POST(request(payload, k));
    assert.equal(sends.length, n);
  }
  mode = "success";
  delete process.env.RESEND_API_KEY;
  const n = sends.length;
  assert.equal((await route.POST(request())).status, 201);
  assert.equal(docs.at(-1).notification.status, "not_configured");
  assert.equal(sends.length, n);
  process.env.RESEND_API_KEY = "re_isolated";
  checks.push(
    "Rejected/ambiguous/thrown provider failures and missing configuration preserve successful registration; no automatic retries",
  );
  dbFail = true;
  const count = docs.length,
    before = sends.length;
  assert.equal((await route.POST(request())).status, 500);
  assert.equal(docs.length, count);
  assert.equal(sends.length, before);
  dbFail = false;
  checks.push("Persistence failure sends no email and creates no record");
  collision = true;
  assert.equal((await route.POST(request())).status, 201);
  assert.match(docs.at(-1).complaintId, /^CMP-\d{6}$/);
  const photo = { ...payload, photoDataUrl: "data:image/png;base64,AAAA" };
  const pk = randomUUID(),
    u = uploads;
  assert.equal((await route.POST(request(photo, pk))).status, 201);
  assert.equal(uploads, u + 1);
  assert(docs.at(-1).photoUrl);
  const pn = sends.length;
  await route.POST(request(photo, pk));
  assert.equal(uploads, u + 1);
  assert.equal(sends.length, pn);
  uploadFail = true;
  const dc = docs.length;
  assert.equal((await route.POST(request(photo))).status, 500);
  assert.equal(docs.length, dc);
  assert.equal(sends.length, pn);
  uploadFail = false;
  assert.equal(
    (await route.POST(request({ ...payload, photoDataUrl: "bad" }))).status,
    400,
  );
  assert.equal(
    (
      await route.POST(
        request({ ...payload, photoDataUrl: "x".repeat(2100001) }),
      )
    ).status,
    413,
  );
  checks.push(
    "Complaint ID collision recovery; Cloudinary photo upload/options, replay reuse, upload failures and size/format validation",
  );
  for (const status of [
    "Under Review",
    "In Progress",
    "Resolved",
    "Rejected",
  ]) {
    const patch = new Request("http://localhost/api/admin/submissions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": process.env.ADMIN_DASHBOARD_KEY,
      },
      body: JSON.stringify({
        complaintId: result.complaintId,
        status,
        comment: "Public office update",
      }),
    });
    assert.equal((await admin.PATCH(patch)).status, 200);
    const tracked = await (
      await route.GET(
        new Request(
          "http://localhost/api/complaints?complaintId=" + result.complaintId,
        ),
      )
    ).json();
    assert.equal(tracked.complaint.status, status);
    for (const privateKey of [
      "name",
      "phone",
      "address",
      "photoUrl",
      "photoPublicId",
      "notification",
      "submissionHash",
      "_id",
    ])
      assert(!(privateKey in tracked.complaint));
  }
  assert.equal(sends.length, pn);
  checks.push(
    "All four admin status/comment updates preserved; tracking excludes notification metadata and private fields; updates send no email",
  );
  resultFail = true;
  r = await route.POST(request());
  assert.equal(r.status, 201);
  const stuck = docs.at(-1);
  assert.equal(stuck.notification.status, "sending");
  const sn = sends.length;
  await helper.notifyStoredComplaint(db, stuck);
  assert.equal(sends.length, sn);
  resultFail = false;
  checks.push(
    "Notification result-save failure keeps registration successful and closes send claim",
  );
  assert.equal(
    (await route.POST(request({ ...payload, phone: "bad" }))).status,
    400,
  );
  assert.equal((await route.POST(request(payload, "invalid"))).status, 400);
  const dc2 = docs.length;
  assert.equal(
    (await route.POST(request({ ...payload, website: "bot" }))).status,
    201,
  );
  assert.equal(docs.length, dc2);
  checks.push("Validation, invalid idempotency key and honeypot remain safe");
  const report = {
    passed: true,
    isolated: true,
    liveEmails: 0,
    productionWrites: 0,
    checks,
  };
  fs.writeFileSync(
    path.join(root, "docs/phase7-complaint-check-results.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
}
run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
