/* Isolated CMS tests: no .env, network, production DB writes, or email integration. */
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  assert = require("node:assert/strict");
const { ObjectId } = require("mongodb");
const { NextResponse } = require("next/server");
process.env.ADMIN_DASHBOARD_KEY = "fixture-admin-key";
for (const key of [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
])
  process.env[key] = "fixture";
const store = new Map();
let unavailable = false,
  upload = 0;
function matches(doc, query) {
  return Object.entries(query).every(([key, value]) => {
    if (key === "$and") return value.every((q) => matches(doc, q));
    if (key === "$or") return value.some((q) => matches(doc, q));
    if (key === "$nor") return !value.some((q) => matches(doc, q));
    if (value instanceof RegExp) return value.test(doc[key] || "");
    if (
      value &&
      typeof value === "object" &&
      !(value instanceof ObjectId) &&
      !(value instanceof Date)
    ) {
      return Object.entries(value).every(([operator, operand]) =>
        operator === "$in"
          ? operand.includes(doc[key])
          : operator === "$nin"
            ? !operand.includes(doc[key])
            : operator === "$regex"
              ? new RegExp(operand, value.$options).test(doc[key] || "")
              : operator === "$options"
                ? true
                : operator === "$gte"
                  ? doc[key] >= operand
                  : operator === "$lt"
                    ? doc[key] < operand
                    : operator === "$exists"
                      ? (doc[key] !== undefined) === operand
                      : false,
      );
    }
    return String(doc[key]) === String(value);
  });
}
function project(doc, options = {}) {
  if (!doc) return null;
  const fields = options.projection;
  if (!fields) return { ...doc };
  const include = Object.entries(fields).some(
    ([key, value]) => key !== "_id" && value === 1,
  );
  return Object.fromEntries(
    Object.entries(doc).filter(([key]) =>
      include
        ? fields[key] === 1 || (key === "_id" && fields._id !== 0)
        : fields[key] !== 0,
    ),
  );
}
function collection(name) {
  if (!store.has(name)) store.set(name, []);
  const docs = store.get(name);
  const apply = (doc, update) => {
    Object.assign(doc, update.$set || {});
    for (const [k, v] of Object.entries(update.$push || {}))
      doc[k] = [...(doc[k] || []), v];
  };
  return {
    countDocuments: async (q) => docs.filter((d) => matches(d, q)).length,
    distinct: async (field, q) => [
      ...new Set(docs.filter((d) => matches(d, q)).map((d) => d[field])),
    ],
    findOne: async (q, opts) =>
      project(
        docs.find((d) => matches(d, q)),
        opts,
      ),
    find: (q, opts) => {
      let rows = docs.filter((d) => matches(d, q));
      const cursor = {
        sort: () => cursor,
        skip: (n) => {
          rows = rows.slice(n);
          return cursor;
        },
        limit: (n) => {
          rows = rows.slice(0, n);
          return cursor;
        },
        toArray: async () => rows.map((d) => project(d, opts)),
      };
      return cursor;
    },
    insertOne: async (doc) => {
      const _id = doc._id || new ObjectId();
      docs.push({ ...doc, _id });
      return { insertedId: _id };
    },
    updateOne: async (q, update, options = {}) => {
      let doc = docs.find((d) => matches(d, q));
      if (!doc && options.upsert) {
        doc = { ...q };
        docs.push(doc);
      }
      if (!doc) return { matchedCount: 0 };
      apply(doc, update);
      return { matchedCount: 1 };
    },
    findOneAndUpdate: async (q, update) => {
      const doc = docs.find((d) => matches(d, q));
      if (!doc) return null;
      apply(doc, update);
      return { ...doc };
    },
    deleteOne: async (q) => {
      const index = docs.findIndex((d) => matches(d, q));
      if (index < 0) return { deletedCount: 0 };
      docs.splice(index, 1);
      return { deletedCount: 1 };
    },
  };
}
const root = path.resolve(__dirname, ".."),
  cache = new Map();
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
  if (file === path.join(root, "lib", "mongodb.js"))
    return synthetic(file, {
      getDatabase: async () => {
        if (unavailable) throw Error("Fixture DB unavailable");
        return { collection };
      },
    });
  const loaded = new vm.SourceTextModule(fs.readFileSync(file, "utf8"), {
    identifier: file,
  });
  cache.set(file, loaded);
  await loaded.link((name, parent) => {
    if (name.startsWith(".")) {
      let target = path.resolve(path.dirname(parent.identifier), name);
      if (!path.extname(target)) target += ".js";
      return load(target);
    }
    if (name === "cloudinary")
      return synthetic(name, {
        v2: {
          config: () => {},
          utils: require("cloudinary").v2.utils,
          uploader: {
            upload: async () => ({
              secure_url:
                "https://res.cloudinary.com/fixture/" + ++upload + ".png",
            }),
          },
        },
      });
    return synthetic(
      name,
      name === "next/server" ? { NextResponse } : require(name),
    );
  });
  return loaded;
}
async function route(name) {
  const loaded = await load(path.join(root, name));
  if (loaded.status !== "evaluated") await loaded.evaluate();
  return loaded.namespace;
}
let ip = 0;
const request = (url, method = "GET", body, auth = true) =>
  new Request("http://fixture" + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "fixture-" + ++ip,
      ...(auth ? { "x-admin-key": process.env.ADMIN_DASHBOARD_KEY } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
const png =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jL1kAAAAASUVORK5CYII=";
const checks = [];
const pass = (text) => {
  checks.push(text);
  console.log("PASS " + text);
};
(async () => {
  const signing = await route("app/api/admin/uploads/route.js");
  assert.equal((await signing.POST(request("/", "POST", { folder: "gallery" }, false))).status, 401);
  assert.equal((await signing.POST(request("/", "POST", { folder: "other" }))).status, 400);
  const signed = await (await signing.POST(request("/", "POST", { folder: "gallery" }))).json();
  assert.equal(signed.params.allowed_formats, "jpg,jpeg,png,webp");
  assert.equal(signed.params.overwrite, false);
  assert.equal(signed.params.transformation, undefined);
  assert.equal(signed.signature, require("cloudinary").v2.utils.api_sign_request(signed.params, "fixture"));
  assert.equal(signed.uploadUrl, "https://api.cloudinary.com/v1_1/fixture/image/upload");
  pass("direct uploads require admin authorization; signed format restrictions preserve original dimensions and prevent overwrites");
  const previewGate = await route("app/api/admin/preview/route.js");
  assert.equal(
    (await previewGate.POST(request("/", "POST", null, false))).status,
    401,
  );
  assert.deepEqual(
    await (await previewGate.POST(request("/", "POST"))).json(),
    { authorized: true },
  );
  pass("preview gate requires server authorization and returns no draft data");
  for (const kind of ["works", "news", "gallery"]) {
    const api = await route("app/api/" + kind + "/route.js");
    const edit = await route("app/api/" + kind + "/[id]/route.js");
    assert.equal(
      (await api.GET(request("/?admin=1", "GET", null, false))).status,
      401,
    );
    assert.equal((await api.POST(request("/", "POST", {}, false))).status, 401);
    const body = {
      titleEn: "Fixture genuine title",
      titleMr: "\u092e\u0930\u093e\u0920\u0940",
      categoryEn: "Road",
      categoryMr: "\u0930\u0938\u094d\u0924\u093e",
      locationEn: "Fixture location",
      locationMr: "\u0920\u093f\u0915\u093e\u0923",
      descriptionEn: "Fixture description",
      descriptionMr: "\u092e\u093e\u0939\u093f\u0924\u0940",
      summaryEn: "Fixture summary",
      summaryMr: "\u0938\u093e\u0930\u093e\u0902\u0936",
      contentEn: "Fixture article",
      contentMr: "\u092c\u093e\u0924\u092e\u0940",
      date: "2026-10-19",
      type: "photo",
      beforeImage: png,
      afterImage: png,
      image: png,
      published: false,
    };
    const created = await api.POST(request("/", "POST", body));
    assert.equal(created.status, 201);
    const data = await created.json(),
      item = data.work || data.article || data.item;
    const params = { params: Promise.resolve({ id: item.id }) };
    assert.equal(
      (await edit.PATCH(request("/", "PATCH", {}, false), params)).status,
      401,
    );
    assert.equal(
      (await edit.DELETE(request("/", "DELETE", null, false), params)).status,
      401,
    );
    const key = kind === "gallery" ? "items" : kind;
    assert.equal((await (await api.GET(request("/"))).json())[key].length, 0);
    await edit.PATCH(
      request("/", "PATCH", { published: true, action: "publish" }),
      params,
    );
    const imageKey = kind === "works" ? "afterImage" : "image";
    await edit.PATCH(
      request("/", "PATCH", {
        titleEn: "PRIVATE REVISION",
        titleMr: "\u0928\u0935\u0940\u0928",
        [imageKey]: png,
        published: false,
        action: "save-draft",
      }),
      params,
    );
    const publicItem = (await (await api.GET(request("/"))).json())[key][0];
    assert.equal(publicItem.titleEn, body.titleEn);
    assert.equal(publicItem.published, true);
    assert.equal("draft" in publicItem, false);
    const adminItem = (await (await api.GET(request("/?admin=1"))).json())[
      key
    ][0];
    assert.equal(adminItem.draft.titleEn, "PRIVATE REVISION");
    const storageUrl = `https://res.cloudinary.com/fixture/image/upload/f_auto,q_auto:best/v1/${kind}/new-photo.webp`;
    const uploadCount = upload;
    assert.equal((await edit.PATCH(request("/", "PATCH", {
      [imageKey]: storageUrl, action: "save-draft",
    }), params)).status, 200);
    assert.equal(upload, uploadCount, "storage URLs must not be uploaded again");
    adminItem.draft[imageKey] = storageUrl;
    assert.equal(store.get(kind)[0].draft[imageKey], storageUrl);
    assert.equal((await edit.PATCH(request("/", "PATCH", {
      [imageKey]: "https://untrusted.invalid/photo.png", action: "save-draft",
    }), params)).status, 400);
    assert.equal(adminItem.draft.titleMr, "\u0928\u0935\u0940\u0928");
    assert.notEqual(adminItem.draft[imageKey], publicItem[imageKey]);
    await edit.PATCH(
      request("/", "PATCH", {
        ...adminItem.draft,
        published: true,
        action: "publish",
      }),
      params,
    );
    const live = (await (await api.GET(request("/"))).json())[key][0];
    assert.equal(live.titleEn, "PRIVATE REVISION");
    assert.equal(live[imageKey], storageUrl, "publishing must promote the saved draft image");
    assert.equal(live.titleMr, "\u0928\u0935\u0940\u0928");
    await edit.PATCH(request("/", "PATCH", { published: false }), params);
    assert.equal((await (await api.GET(request("/"))).json())[key].length, 0);
    const originalImage = store.get(kind)[0][imageKey];
    await edit.PATCH(request("/", "PATCH", { categoryEn: "Changed" }), params);
    assert.equal(store.get(kind)[0][imageKey], originalImage);
    assert.equal(
      (
        await edit.PATCH(
          request("/", "PATCH", { [imageKey]: "data:text/html;base64,YQ==" }),
          params,
        )
      ).status,
      400,
    );
    await edit.DELETE(request("/", "DELETE"), params);
    assert.equal(store.get(kind).length, 0);
    const partial = await api.POST(
      request("/", "POST", {
        titleEn: "Incomplete private draft",
        action: "save-draft",
        published: true,
      }),
    );
    assert.equal(partial.status, 201);
    const partialItem = await partial.json();
    const partialId = (
      partialItem.work ||
      partialItem.article ||
      partialItem.item
    ).id;
    assert.equal((await (await api.GET(request("/"))).json())[key].length, 0);
    assert.equal(
      (
        await edit.PATCH(request("/", "PATCH", { action: "publish" }), {
          params: Promise.resolve({ id: partialId }),
        })
      ).status,
      400,
    );
    await edit.DELETE(request("/", "DELETE"), {
      params: Promise.resolve({ id: partialId }),
    });
    pass(
      kind +
        ": authorization, incomplete drafts stay private, live revisions retained, image replacement, bilingual publish, hide, image preservation, delete",
    );
  }
  const site = await route("app/api/site-content/route.js");
  assert.equal(
    (await site.GET(request("/?admin=1", "GET", null, false))).status,
    401,
  );
  assert.equal(
    (await site.PATCH(request("/", "PATCH", {}, false))).status,
    401,
  );
  await site.PATCH(
    request("/", "PATCH", {
      action: "save-draft",
      bannerImage: png,
      announcementEn: "PRIVATE ANNOUNCEMENT",
      announcementMr: "\u0938\u0942\u091a\u0928\u093e",
    }),
  );
  assert.deepEqual((await (await site.GET(request("/"))).json()).content, {});
  const draft = (await (await site.GET(request("/?admin=1"))).json()).draft;
  assert.equal(draft.announcementEn, "PRIVATE ANNOUNCEMENT");
  await site.PATCH(request("/", "PATCH", { action: "publish", ...draft }));
  const liveSite = (await (await site.GET(request("/"))).json()).content;
  assert.equal(liveSite.homeBanner, draft.homeBanner);
  assert.equal(liveSite.announcementMr, draft.announcementMr);
  pass(
    "site settings: private draft, server authorization, saved banner promotion, bilingual persistence",
  );
  for (const [name, phone, status, complaintId] of [
    ["Real citizen", "1111111111", "Resolved", "CMP-111111"],
    ["ACCEPTANCE TEST - disposable", "0000000000", "Resolved", "CMP-222222"],
  ])
    await collection("complaints").insertOne({
      name,
      phone,
      status,
      complaintId,
      complaintType: "Street light",
      location: "Sector 18",
      address: "Private address",
      createdAt: new Date("2026-10-19T09:00:00Z"),
      comments: [],
    });
  await collection("contact_messages").insertOne({
    name: "Real sender",
    phone: "1111111111",
    email: "fixture@example.invalid",
    message: "Fixture stored message",
    createdAt: new Date(),
  });
  const overview = await route("app/api/admin/overview/route.js");
  assert.equal(
    (await overview.GET(request("/", "GET", null, false))).status,
    401,
  );
  const counts = await (await overview.GET(request("/"))).json();
  assert.equal(counts.counts.complaints, 1);
  assert.equal(counts.counts.Resolved, 1);
  assert.equal(counts.excluded.complaints, 1);
  for (let i = 0; i < 25; i++)
    await collection("complaints").insertOne({
      name: "Genuine fixture " + i,
      complaintId: "CMP-" + (300000 + i),
      status: "Under Review",
      complaintType: "Road",
      createdAt: new Date(),
    });
  const fullCounts = (await (await overview.GET(request("/"))).json()).counts;
  assert.equal(fullCounts.complaints, 26);
  assert.equal(fullCounts["Under Review"], 25);
  await collection("works").insertOne({
    titleEn: "ADMIN TEST — Development Work (Not Real)",
    published: false,
  });
  const adminTestCounts = await (await overview.GET(request("/"))).json();
  assert.equal(adminTestCounts.counts.hiddenWorks, 0);
  assert.equal(adminTestCounts.excluded.works, 1);
  unavailable = true;
  assert.equal((await overview.GET(request("/"))).status, 503);
  unavailable = false;
  pass(
    "dashboard: actual counts across collections, tests excluded, database failure is an error",
  );
  const inbox = await route("app/api/admin/submissions/route.js");
  assert.equal(
    (await inbox.GET(request("/?view=contacts", "GET", null, false))).status,
    401,
  );
  let listing = await (
    await inbox.GET(
      request(
        "/?view=complaints&status=Resolved&date=2026-10-19&category=Street%20light&q=CMP-111111&limit=1",
      ),
    )
  ).json();
  assert.equal(listing.total, 1);
  assert.equal(listing.items[0].address, "Private address");
  const paged = await (
    await inbox.GET(request("/?view=complaints&page=2&limit=10"))
  ).json();
  assert.equal(paged.total, 26);
  assert.equal(paged.pages, 3);
  assert.equal(paged.items.length, 10);
  assert.equal(paged.page, 2);
  assert.equal(
    (await inbox.GET(request("/?view=complaints&q=%5B"))).status,
    200,
  );
  assert.equal(
    (await inbox.GET(request("/?view=complaints&date=2026-02-31"))).status,
    400,
  );
  listing = await (
    await inbox.GET(request("/?view=complaints&records=tests"))
  ).json();
  assert.equal(listing.total, 1);
  assert.equal(listing.items[0].name, "ACCEPTANCE TEST - disposable");
  listing = await (await inbox.GET(request("/?view=contacts&q=stored"))).json();
  assert.equal(listing.total, 1);
  assert.equal(
    (await inbox.GET(request("/?view=complaints&date=bad"))).status,
    400,
  );
  for (const status of [
    "Under Review",
    "In Progress",
    "Resolved",
    "Rejected",
  ]) {
    const response = await inbox.PATCH(
      request("/", "PATCH", {
        complaintId: "CMP-111111",
        status,
        comment: "Fixture public update",
      }),
    );
    assert.equal(response.status, 200);
    assert.equal((await response.json()).complaint.status, status);
  }
  pass(
    "complaints/contact inbox: authorized filtering, dates, search, pagination, test separation and all status updates",
  );
  // Public tracking retains its privacy projection; no submission is executed here.
  const track = await route("app/api/complaints/route.js");
  const tracked = (
    await (
      await track.GET(request("/?complaintId=CMP-111111", "GET", null, false))
    ).json()
  ).complaint;
  for (const key of ["name", "phone", "address", "photoUrl"])
    assert.equal(key in tracked, false);
  pass("public tracking excludes private citizen details");
  fs.writeFileSync(
    "docs/phase5-api-check-results.json",
    JSON.stringify(
      {
        environment:
          "Isolated real route modules, in-memory database, stubbed Cloudinary, no live writes or email tests",
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
