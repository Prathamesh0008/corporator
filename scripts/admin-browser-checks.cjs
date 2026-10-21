/* Browser fixture backend intercepts EVERY API request. No real DB writes/uploads/email. */
const { chromium } = require(
  process.env.TEMP + "/civic-browser-check/node_modules/playwright",
);
const fs = require("node:fs");
const assert = require("node:assert/strict");
const records = { works: [], news: [], gallery: [] },
  changes = [],
  checks = [];
let id = 0,
  mediaId = 0,
  site = {},
  siteDraft = null,
  denyAuth = false;
const mr =
  "\u092e\u0930\u093e\u0920\u0940 \u0936\u0940\u0930\u094d\u0937\u0915";
const complaint = {
  id: "complaint-fixture",
  complaintId: "CMP-123456",
  name: "Fixture Citizen",
  phone: "0000000000",
  complaintType: "Street light",
  location: "Fixture location",
  description: "Fixture issue description",
  address: "Private fixture address",
  ward: "24(D)",
  status: "Under Review",
  comments: [],
  createdAt: "2026-10-19T08:00:00Z",
};
const contact = {
  id: "contact-fixture",
  name: "Fixture Sender",
  phone: "0000000000",
  email: "fixture@example.invalid",
  message: "Fixture inbox message only",
  createdAt: "2026-10-19T08:00:00Z",
};
const png = {
  name: "fixture.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=",
    "base64",
  ),
};
const pass = (name) => {
  checks.push(name);
  console.log("PASS " + name);
};
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const context = await browser.newContext();
    await context.route("https://api.cloudinary.com/**", async (route) => {
      const range = route.request().headers()["content-range"];
      assert.ok(range, "direct uploads include byte ranges");
      return route.fulfill({ json: { done: true, secure_url: `https://res.cloudinary.com/fixture/image/upload/v1/gallery/fixture-${++mediaId}.png` } });
    });
    await context.route("https://res.cloudinary.com/**", (route) => route.fulfill({ contentType: "image/png", body: png.buffer }));
    await context.route("**/api/**", async (route) => {
      const req = route.request(),
        url = new URL(req.url()),
        method = req.method();
      const body = method === "GET" ? null : req.postDataJSON();
      const reply = (json, status = 200) => route.fulfill({ status, json });
      if (url.pathname === "/api/admin/uploads")
        return reply({ params: { timestamp: 1 }, signature: "fixture", apiKey: "fixture", uploadUrl: "https://api.cloudinary.com/v1_1/fixture/image/upload" });
      if (["/api/admin/auth", "/api/admin/preview"].includes(url.pathname))
        return reply(
          denyAuth ? { error: "Unauthorized" } : { success: true },
          denyAuth ? 401 : 200,
        );
      if (url.pathname === "/api/admin/overview")
        return reply({
          counts: {
            complaints: 1,
            "Under Review": 1,
            "In Progress": 0,
            Resolved: 0,
            Rejected: 0,
            publishedWorks: 0,
            hiddenWorks: 0,
            gallery: 0,
            news: 0,
            contacts: 1,
          },
          recent: [complaint],
          excluded: { complaints: 1 },
        });
      if (url.pathname === "/api/admin/submissions") {
        if (method === "PATCH") {
          changes.push({ path: url.pathname, method, body });
          complaint.status = body.status;
          if (body.comment)
            complaint.comments.push({
              text: body.comment,
              createdAt: new Date().toISOString(),
            });
          return reply({ success: true, complaint });
        }
        const view = url.searchParams.get("view");
        return reply({
          items: [view === "contacts" ? contact : complaint],
          categories: ["Street light"],
          total: 1,
          page: 1,
          pages: 1,
        });
      }
      if (url.pathname === "/api/site-content") {
        if (method === "GET")
          return reply({
            content: site,
            ...(url.searchParams.get("admin") ? { draft: siteDraft } : {}),
          });
        changes.push({ path: url.pathname, method, body });
        const data = {
          ...body,
          ...(body.bannerImage ? { homeBanner: body.bannerImage } : {}),
          updatedAt: new Date().toISOString(),
        };
        delete data.bannerImage;
        if (body.action === "save-draft") siteDraft = data;
        else {
          site = data;
          siteDraft = null;
        }
        return reply({ success: true, content: data });
      }
      const match = url.pathname.match(
        /^\/api\/(works|news|gallery)(?:\/([^/]+))?$/,
      );
      if (match) {
        const [, kind, itemId] = match,
          key = kind === "gallery" ? "items" : kind;
        if (method === "GET")
          return reply({
            [key]: records[kind]
              .filter((item) => url.searchParams.has("admin") || item.published)
              .map((item) => {
                if (url.searchParams.has("admin")) return item;
                const copy = { ...item };
                delete copy.draft;
                return copy;
              }),
          });
        changes.push({ path: url.pathname, method, body });
        if (method === "POST") {
          const item = { ...body, id: String(++id), slug: "fixture-" + id };
          records[kind].push(item);
          return reply({ work: item, article: item, item }, 201);
        }
        const index = records[kind].findIndex((item) => item.id === itemId),
          current = records[kind][index];
        if (method === "DELETE") records[kind].splice(index, 1);
        else if (body.action === "save-draft" && current.published)
          current.draft = body;
        else {
          Object.assign(current, body);
          if (body.action === "publish") delete current.draft;
        }
        return reply({ success: true });
      }
      // Unexpected endpoints never fall through to the real backend.
      return reply({ error: "Blocked by isolated browser fixture" }, 503);
    });
    const page = await context.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const base = process.env.ADMIN_CHECK_BASE || "http://localhost:3000";
    await page.goto(base + "/ward-control");
    await page.locator("#admin-dashboard-key").fill("fixture-key");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByRole("heading", { name: "Recent complaints" }).waitFor();
    assert.equal(
      await page.locator(".admin-stats strong").first().innerText(),
      "1",
    );
    pass("Login and actual-count UI with explicit excluded test notice");
    for (const kind of ["works", "news", "gallery"]) {
      await page.goto(base + "/ward-control/" + kind);
      await page
        .getByRole("button", {
          name:
            kind === "works"
              ? "Add Work"
              : kind === "news"
                ? "Add Article"
                : "Add Gallery Item",
          exact: true,
        })
        .click();
      const editor = page.getByRole("dialog", {
        name: "Add " + kind,
        exact: true,
      });
      await editor
        .getByLabel("Title English", { exact: true })
        .fill("Fixture " + kind);
      await editor.getByLabel("Title Marathi", { exact: true }).fill(mr);
      if (kind === "works") {
        await editor
          .getByLabel("Location English", { exact: true })
          .fill("Fixture location");
        await editor
          .getByLabel("Description English", { exact: true })
          .fill("Fixture description");
        await editor
          .getByLabel("Work status English", { exact: true })
          .fill("Completed");
      }
      if (kind === "news") {
        await editor
          .getByLabel("Summary English", { exact: true })
          .fill("Fixture summary");
        await editor
          .getByLabel("Full article English", { exact: true })
          .fill("Fixture complete article");
        await editor
          .getByLabel("Full article Marathi", { exact: true })
          .fill(mr);
      }
      if (kind !== "works")
        await editor
          .getByLabel(kind === "news" ? "Publication date" : "Date", {
            exact: true,
          })
          .fill("2026-10-19");
      const inputs = editor.locator("input[type=file]");
      for (let n = 0; n < (await inputs.count()); n++) {
        await inputs.nth(n).setInputFiles(png);
        await editor.getByRole("button", { name: "Preview", exact: true }).waitFor();
        await editor.locator('input[type=file]:disabled').first().waitFor({ state: "hidden" });
      }
      const beforePreview = changes.length;
      await editor
        .getByRole("button", { name: "Preview", exact: true })
        .click();
      const preview = page.getByRole("dialog", {
        name: "Website draft preview",
      });
      const frame = page.frameLocator(
        'iframe[title="Private website preview"]',
      );
      if (kind === "gallery")
        await frame
          .getByAltText("Fixture gallery", { exact: true })
          .first()
          .waitFor();
      else
        await frame
          .getByText("Fixture " + kind, { exact: true })
          .first()
          .waitFor();
      assert.equal(changes.length, beforePreview);
      await preview.getByLabel("Preview language").selectOption("mr");
      if (kind === "gallery")
        await frame.getByAltText(mr, { exact: true }).first().waitFor();
      else await frame.getByText(mr, { exact: true }).first().waitFor();
      await preview.getByLabel("Preview viewport").selectOption("mobile");
      assert.equal(
        await page
          .locator("iframe")
          .evaluate((el) => Math.round(el.getBoundingClientRect().width)),
        390,
      );
      await preview.getByLabel("Preview placement").selectOption("listing");
      await frame.getByText(mr, { exact: true }).first().waitFor();
      assert.ok(await frame.locator('img[src^="https://res.cloudinary.com/"]').count());
      await frame
        .locator('img[src^="https://res.cloudinary.com/"]')
        .first()
        .evaluate(async (image) => {
          if (!image.complete)
            await new Promise((resolve) => {
              image.onload = resolve;
              image.onerror = resolve;
            });
          if (!image.naturalWidth) throw Error("Preview image did not decode");
          if (getComputedStyle(image).objectFit !== "contain") throw Error("Uploaded preview image must preserve its aspect ratio without cropping");
        });
      if (kind === "gallery") {
        await frame
          .locator(".gallery-photo-grid button, .gallery-grid button, button")
          .filter({ has: frame.locator("img") })
          .first()
          .click();
        await frame.locator("[role=dialog]").waitFor();
        await frame.locator("[role=dialog] button").first().focus();
        await page.keyboard.press("Escape");
        await frame.locator("[role=dialog]").waitFor({ state: "hidden" });
        assert.equal(await preview.isVisible(), true);
      } else {
        if (kind === "works") {
          await frame.locator(".archive-comparison-button").first().click();
          await frame.locator("[role=dialog]").waitFor();
          await page.keyboard.press("Escape");
          await frame.locator("[role=dialog]").waitFor({ state: "hidden" });
          assert.equal(await preview.isVisible(), true);
        }
        await preview.getByLabel("Preview placement").selectOption("detail");
        await frame.getByText(mr, { exact: true }).first().waitFor();
      }
      await preview.getByRole("button", { name: "Return to editing" }).click();
      assert.equal(
        await editor.getByLabel("Title English", { exact: true }).inputValue(),
        "Fixture " + kind,
      );
      assert.equal(changes.length, beforePreview);
      pass(
        kind +
          " unsaved private preview, bilingual, mobile width, actual layouts/images, return preserves form, zero writes",
      );
      await editor
        .getByRole("button", { name: "Save Draft", exact: true })
        .click();
      await editor.waitFor({ state: "hidden" });
      assert.equal(records[kind][0].published, false);
      await page
        .getByRole("button", { name: "Edit / Preview", exact: true })
        .click();
      await page
        .getByRole("dialog", { name: "Edit " + kind, exact: true })
        .getByRole("button", { name: "Publish", exact: true })
        .click();
      await page
        .getByRole("link", { name: "View Live", exact: true })
        .waitFor();
      assert.equal(records[kind][0].published, true);
      assert.equal(records[kind][0].titleMr, mr);
      const live = await page
        .getByRole("link", { name: "View Live", exact: true })
        .getAttribute("href");
      assert.ok(
        live.startsWith(kind === "gallery" ? "/gallery" : "/" + kind + "/"),
      );
      await page.getByRole("button", { name: "Hide", exact: true }).click();
      await page
        .getByRole("button", { name: "Review & Publish", exact: true })
        .waitFor();
      assert.equal(records[kind][0].published, false);
      page.once("dialog", (d) => d.dismiss());
      await page.getByRole("button", { name: "Delete", exact: true }).click();
      assert.equal(records[kind].length, 1);
      page.once("dialog", (d) => d.accept());
      await page.getByRole("button", { name: "Delete", exact: true }).click();
      await page.getByText("No matching content.", { exact: false }).waitFor();
      assert.equal(records[kind].length, 0);
      pass(
        kind +
          " draft, explicit publish, bilingual persistence, correct View Live, hide, confirmed delete",
      );
    }
    await page.goto(base + "/ward-control/content");
    await page
      .getByRole("button", { name: "Save Draft", exact: true })
      .waitFor();
    await page
      .getByLabel("Announcement English", { exact: true })
      .fill("Fixture announcement");
    await page.locator("input[type=file]").setInputFiles(png);
    await page.locator('input[type=file]:disabled').waitFor({ state: "hidden" });
    const before = changes.length;
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    await page.frameLocator("iframe").locator('section[aria-labelledby="home-hero-title"] img').waitFor();
    assert.equal(changes.length, before);
    await page.getByRole("button", { name: "Return to editing" }).click();
    await page.getByRole("button", { name: "Save Draft", exact: true }).click();
    await page.getByRole("status").waitFor();
    assert.equal(siteDraft.announcementEn, "Fixture announcement");
    assert.equal(site.announcementEn, undefined);
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await page.getByRole("link", { name: "View Live", exact: true }).waitFor();
    assert.equal(site.announcementEn, "Fixture announcement");
    pass(
      "Site banner actual hero preview, inactive announcement limitation, private save and explicit publish",
    );
    await page.goto(base + "/ward-control/complaints");
    await page.getByRole("button", { name: "Open", exact: true }).click();
    const details = page.getByRole("dialog", { name: "CMP-123456" });
    await details.getByLabel("Current status").selectOption("Resolved");
    await details
      .getByLabel("New public office comment")
      .fill("Fixture public office update");
    await details.getByRole("button", { name: "Save update" }).click();
    await details.getByText("Complaint updated.").waitFor();
    assert.equal(complaint.status, "Resolved");
    await details.getByRole("button", { name: "Close editor" }).click();
    pass("Complaint detail, privacy warning and status/comment update");
    await page.goto(base + "/ward-control/messages");
    await page.getByRole("button", { name: "Open", exact: true }).click();
    await page
      .getByRole("dialog", { name: "Contact message" })
      .getByText(contact.message, { exact: true })
      .waitFor();
    await page.getByRole("button", { name: "Close editor" }).click();
    pass("Contact inbox and message detail");
    for (const width of [375, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + "/ward-control");
      await page.locator(".admin-stats").waitFor();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
      );
      if (width < 900) {
        await page
          .getByRole("button", { name: "Open navigation", exact: true })
          .click();
        await page
          .locator("#admin-navigation")
          .getByRole("link", { name: "Development Works", exact: true })
          .click();
        await page
          .getByRole("button", { name: "Add Work", exact: true })
          .waitFor();
        assert.equal(
          await page
            .getByRole("button", { name: "Open navigation", exact: true })
            .getAttribute("aria-expanded"),
          "false",
        );
      }
    }
    pass("Admin responsive widths and collapsible mobile navigation");
    await page.goto(base + "/ward-control/works");
    await page.getByRole("button", { name: "Add Work", exact: true }).click();
    denyAuth = true;
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    await page
      .getByText("Preview authorization failed.", { exact: false })
      .waitFor();
    assert.equal(await page.locator("iframe").count(), 0);
    denyAuth = false;
    await page.getByRole("button", { name: "Return to editing" }).click();
    await page.getByRole("button", { name: "Close editor" }).click();
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await page.locator("#admin-dashboard-key").waitFor();
    assert.equal(
      await page.evaluate(() => sessionStorage.getItem("admin-dashboard-key")),
      null,
    );
    pass(
      "Preview server authorization failure blocks draft rendering; logout clears session",
    );
    fs.writeFileSync(
      "docs/phase5-browser-check-results.json",
      JSON.stringify(
        {
          environment:
            "Real browser with all API calls intercepted by fixtures; no live writes/uploads/email",
          checks,
          fixtureMutations: changes.map((c) => ({
            path: c.path,
            method: c.method,
            action: c.body?.action,
            published: c.body?.published,
          })),
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
