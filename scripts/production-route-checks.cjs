/* Isolated checks execute the real route sources with in-memory MongoDB and Cloudinary/email stubs.
   They never load .env, connect to a real database, upload media, or send messages. */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { ObjectId } = require("mongodb");
const { NextResponse } = require("next/server");

process.env.ADMIN_DASHBOARD_KEY = "isolated-route-test-key";
for (const key of [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
])
  process.env[key] = "isolated-test";
let collision = false,
  uploads = 0,
  dbUnavailable = false;
global.fetch = async () => {
  throw new Error("Network forbidden in isolated tests");
};
const store = new Map();
const match = (doc, query) =>
  Object.entries(query).every(([key, value]) =>
    value && typeof value === "object" && "$nin" in value
      ? !value.$nin.includes(doc[key])
      : String(doc[key]) === String(value),
  );
const project = (doc, options = {}) => {
  if (!doc) return null;
  const fields = options.projection;
  if (!fields) return { ...doc };
  if (
    !Object.entries(fields).some(([key, value]) => key !== "_id" && value === 1)
  )
    return Object.fromEntries(
      Object.entries(doc).filter(([key]) => fields[key] !== 0),
    );
  return Object.fromEntries(
    Object.entries(doc).filter(
      ([key]) => fields[key] === 1 || (key === "_id" && fields._id !== 0),
    ),
  );
};
function collection(name) {
  if (!store.has(name)) store.set(name, []);
  const docs = store.get(name);
  const apply = (doc, update) => {
    if (update.$set) Object.assign(doc, update.$set);
    if (update.$push)
      for (const [key, value] of Object.entries(update.$push))
        doc[key] = [...(doc[key] || []), value];
  };
  return {
    createIndex: async () => "complaintId_1",
    insertOne: async (doc) => {
      if (name === "complaints" && collision) {
        collision = false;
        throw Object.assign(new Error("collision"), { code: 11000 });
      }
      const _id = doc._id || new ObjectId();
      docs.push({ ...doc, _id });
      return { insertedId: _id };
    },
    findOne: async (query, options) =>
      project(
        docs.find((doc) => match(doc, query)),
        options,
      ),
    find: (query, options) => {
      let result = docs.filter((doc) => match(doc, query));
      const cursor = {
        sort: () => cursor,
        limit: (count) => {
          result = result.slice(0, count);
          return cursor;
        },
        toArray: async () => result.map((doc) => project(doc, options)),
      };
      return cursor;
    },
    updateOne: async (query, update, options = {}) => {
      let doc = docs.find((doc) => match(doc, query));
      if (!doc && options.upsert) {
        doc = { ...query };
        docs.push(doc);
      }
      if (!doc) return { matchedCount: 0 };
      apply(doc, update);
      return { matchedCount: 1 };
    },
    findOneAndUpdate: async (query, update) => {
      const doc = docs.find((doc) => match(doc, query));
      if (!doc) return null;
      apply(doc, update);
      return { ...doc };
    },
    deleteOne: async (query) => {
      const index = docs.findIndex((doc) => match(doc, query));
      if (index < 0) return { deletedCount: 0 };
      docs.splice(index, 1);
      return { deletedCount: 1 };
    },
  };
}
const db = { collection };
const cache = new Map();
const root = path.resolve(__dirname, "..");
function synthetic(id, values) {
  if (!cache.has(id))
    cache.set(
      id,
      new vm.SyntheticModule(
        Object.keys(values),
        function () {
          for (const [key, value] of Object.entries(values))
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
        if (dbUnavailable) throw new Error("Database unavailable");
        return db;
      },
    });
  if (file.endsWith(path.join("data", "siteContent.js")))
    return synthetic(file, { newsData: [] });
  const loadedModule = new vm.SourceTextModule(fs.readFileSync(file, "utf8"), {
    identifier: file,
  });
  cache.set(file, loadedModule);
  await loadedModule.link(async (specifier, parent) => {
    if (specifier.startsWith(".")) {
      let target = path.resolve(path.dirname(parent.identifier), specifier);
      if (!path.extname(target)) target += ".js";
      return load(target);
    }
    if (specifier === "cloudinary")
      return synthetic(specifier, {
        v2: {
          config: () => {},
          uploader: {
            upload: async (_data, options) => {
              uploads++;
              return {
                secure_url:
                  "https://res.cloudinary.com/isolated/" +
                  options.folder +
                  "/" +
                  uploads +
                  ".png",
                public_id: "isolated/" + uploads,
              };
            },
          },
        },
      });
    if (specifier === "next/server")
      return synthetic(specifier, { NextResponse });
    return synthetic(specifier, require(specifier));
  });
  return loadedModule;
}
async function route(file) {
  const loadedModule = await load(path.join(root, file));
  if (loadedModule.status !== "evaluated") await loadedModule.evaluate();
  return loadedModule.namespace;
}
let ip = 0;
const request = (url, method = "GET", body, authorized = false) =>
  new Request("http://localhost" + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "isolated-" + ++ip,
      ...(authorized ? { "x-admin-key": process.env.ADMIN_DASHBOARD_KEY } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
const png =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL1kAAAAASUVORK5CYII=";
const checks = [];
function passed(name) {
  checks.push(name);
  console.log("PASS", name);
}
(async () => {
  const auth = await route("app/api/admin/auth/route.js");
  assert.equal(
    (await auth.POST(request("/api/admin/auth", "POST", undefined, false)))
      .status,
    401,
  );
  assert.equal(
    (await auth.POST(request("/api/admin/auth", "POST", undefined, true)))
      .status,
    200,
  );
  passed("admin login rejects missing key and accepts configured key");
  for (const kind of ["works", "news", "gallery"]) {
    const api = await route("app/api/" + kind + "/route.js");
    const itemApi = await route("app/api/" + kind + "/[id]/route.js");
    const params = {
      params: Promise.resolve({ id: new ObjectId().toString() }),
    };
    assert.equal(
      (await api.GET(request("/api/" + kind + "?admin=1"))).status,
      401,
    );
    assert.equal(
      (await api.POST(request("/api/" + kind, "POST", {}))).status,
      401,
    );
    assert.equal(
      (await itemApi.PATCH(request("/", "PATCH", {}), params)).status,
      401,
    );
    assert.equal(
      (await itemApi.DELETE(request("/", "DELETE"), params)).status,
      401,
    );
    const body =
      kind === "works"
        ? {
            titleEn: "Isolated work fixture",
            titleMr: "Fixture",
            locationEn: "Test location",
            descriptionEn: "Isolated verification",
            statusEn: "In Progress",
            beforeImage: png,
            afterImage: png,
            highlightsEn: "One\nTwo",
            published: false,
          }
        : kind === "news"
          ? {
              titleEn: "Isolated news fixture",
              summaryEn: "Isolated verification",
              image: png,
              date: "2026-10-19",
              published: false,
            }
          : {
              type: "photo",
              titleEn: "Isolated gallery fixture",
              categoryEn: "Community",
              image: png,
              published: false,
            };
    const created = await api.POST(request("/", "POST", body, true));
    assert.equal(created.status, 201, kind + " create");
    const data = await created.json();
    const id = (data.work || data.article || data.item).id;
    const context = { params: Promise.resolve({ id }) };
    const key = kind === "gallery" ? "items" : kind;
    assert.equal(
      (await (await api.GET(request("/"))).json())[key].length,
      0,
      "draft is private",
    );
    assert.equal(
      (
        await (
          await api.GET(request("/?admin=1", "GET", undefined, true))
        ).json()
      )[key].length,
      1,
    );
    const imageKey = kind === "works" ? "beforeImage" : "image";
    const previousUploads = uploads;
    assert.equal(
      (
        await itemApi.PATCH(
          request(
            "/",
            "PATCH",
            {
              titleMr: "Updated",
              [imageKey]: png,
              published: true,
              ...(kind === "works"
                ? { highlightsEn: ["Updated highlight"] }
                : {}),
            },
            true,
          ),
          context,
        )
      ).status,
      200,
    );
    assert.equal(uploads, previousUploads + 1);
    assert.equal((await (await api.GET(request("/"))).json())[key].length, 1);
    assert.equal(
      (
        await itemApi.PATCH(
          request("/", "PATCH", { published: false }, true),
          context,
        )
      ).status,
      200,
    );
    assert.equal((await (await api.GET(request("/"))).json())[key].length, 0);
    assert.equal(
      (
        await itemApi.PATCH(
          request("/", "PATCH", { titleEn: "" }, true),
          context,
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await itemApi.PATCH(
          request(
            "/",
            "PATCH",
            {
              [imageKey]:
                "data:image/png;base64," +
                Buffer.alloc(6 * 1024 * 1024).toString("base64"),
            },
            true,
          ),
          context,
        )
      ).status,
      400,
    );
    if (kind !== "works")
      assert.equal(
        (
          await itemApi.PATCH(
            request(
              "/",
              "PATCH",
              kind === "news"
                ? { externalUrl: "javascript:alert(1)" }
                : { href: "javascript:alert(1)" },
              true,
            ),
            context,
          )
        ).status,
        400,
      );
    assert.equal(
      (await itemApi.DELETE(request("/", "DELETE", undefined, true), context))
        .status,
      200,
    );
    assert.equal(
      (await itemApi.DELETE(request("/", "DELETE", undefined, true), context))
        .status,
      404,
    );
    passed(
      kind +
        " auth, create draft, list, replace image, publish, hide, validate and delete",
    );
    await db
      .collection(kind)
      .insertOne({ titleEn: "Demo Road Improvement Work", published: true });
    assert.equal((await (await api.GET(request("/"))).json())[key].length, 0);
    assert.equal(
      (
        await (
          await api.GET(request("/?admin=1", "GET", undefined, true))
        ).json()
      )[key].length,
      1,
    );
  }
  passed(
    "known demo records remain admin-visible but not public; no records purged",
  );
  const complaint = await route("app/api/complaints/route.js");
  const admin = await route("app/api/admin/submissions/route.js");
  const payload = {
    name: "Private fixture",
    phone: "9999999999",
    address: "Private address",
    ward: "wrong",
    complaintType: "Street light",
    location: "Public location",
    description: "Isolated test complaint",
    photoDataUrl: png,
  };
  assert.equal(
    (await complaint.POST(request("/", "POST", { ...payload, phone: "bad" })))
      .status,
    400,
  );
  assert.equal(
    (
      await complaint.POST(
        request("/", "POST", { ...payload, photoDataUrl: "x".repeat(2100001) }),
      )
    ).status,
    413,
  );
  collision = true;
  const submitted = await complaint.POST(request("/", "POST", payload));
  assert.equal(submitted.status, 201);
  const id = (await submitted.json()).complaintId;
  assert.match(id, /^CMP-\d{6}$/);
  assert.equal(store.get("complaints").length, 1);
  assert.equal(store.get("complaints")[0].ward, "24(D)");
  assert(store.get("complaints")[0].photoUrl);
  assert.equal((await admin.GET(request("/"))).status, 401);
  assert.equal((await admin.PATCH(request("/", "PATCH", {}))).status, 401);
  assert.equal(
    (
      await admin.PATCH(
        request("/", "PATCH", { complaintId: id, status: "Other" }, true),
      )
    ).status,
    400,
  );
  const listed = await (
    await admin.GET(request("/", "GET", undefined, true))
  ).json();
  assert.equal(listed.complaints.length, 1);
  for (const status of [
    "Under Review",
    "In Progress",
    "Resolved",
    "Rejected",
  ]) {
    const changed = await admin.PATCH(
      request(
        "/",
        "PATCH",
        { complaintId: id, status, comment: "Office update: " + status },
        true,
      ),
    );
    assert.equal(changed.status, 200);
    const tracked = await (
      await complaint.GET(request("/?complaintId=" + id))
    ).json();
    assert.equal(tracked.complaint.status, status);
    assert(
      tracked.complaint.comments.some(
        (comment) => comment.text === "Office update: " + status,
      ),
    );
    for (const personal of [
      "name",
      "phone",
      "address",
      "description",
      "photoUrl",
      "photoPublicId",
      "_id",
    ])
      assert.equal(personal in tracked.complaint, false);
  }
  assert.equal((await complaint.GET(request("/?complaintId=bad"))).status, 400);
  assert.equal(
    (await complaint.GET(request("/?complaintId=CMP-000000"))).status,
    404,
  );
  passed(
    "complaint validation, ID collision retry, persistence, photo, admin list, all four updates/comments and public privacy",
  );
  require("node:child_process").execFileSync(
    process.execPath,
    [
      "--experimental-vm-modules",
      path.join(__dirname, "contact-resend-checks.cjs"),
    ],
    { stdio: "inherit" },
  );
  passed(
    "contact Resend persistence, notification safety and retry regressions delegated to isolated contact suite",
  );
  const site = await route("app/api/site-content/route.js");
  assert.equal((await site.PATCH(request("/", "PATCH", {}))).status, 401);
  assert.equal((await site.GET(request("/?admin=1"))).status, 401);
  const saved = await site.PATCH(
    request(
      "/",
      "PATCH",
      {
        bannerImage: png,
        announcementEnabled: false,
        announcementEn: "Real office update",
      },
      true,
    ),
  );
  assert.equal(saved.status, 200);
  assert((await (await site.GET(request("/"))).json()).content.homeBanner);
  await site.PATCH(request("/", "PATCH", { announcementMr: "Updated" }, true));
  assert.equal(
    (await (await site.GET(request("/"))).json()).content.announcementEn,
    "Real office update",
  );
  passed(
    "site-content authorization, banner upload, partial update and public projection",
  );
  const config = await route("lib/publicContent.js");
  assert.equal(config.approvedStatic([{ id: "example" }], "works").length, 0);
  assert.equal(
    config.publicItems([
      { titleEn: "Demo Ward Development Update", published: true },
      { titleEn: "A genuinely old record", published: true },
    ]).length,
    1,
  );
  passed(
    "unverified static entries isolated; age does not classify records as demo",
  );
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "docs", "route-check-results.json"),
    JSON.stringify(
      {
        environment: "isolated in-memory adapters; no live services used",
        checks,
        passed: checks.length,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "All",
    checks.length,
    "check groups passed. No live writes/uploads/emails.",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
