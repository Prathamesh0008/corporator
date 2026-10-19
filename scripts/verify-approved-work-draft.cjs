/* One explicitly approved draft. Reuses an existing matching draft; never publishes/deletes.
   Run only with owner approval for these exact two files and this one record. */
const fs = require("node:fs");
const { MongoClient } = require("mongodb");
const { chromium } = require(
  process.env.TEMP + "/civic-browser-check/node_modules/playwright",
);
const title = "ADMIN TEST — Development Work (Not Real)";
const titleMr = "प्रशासकीय चाचणी — विकासकाम (वास्तविक नाही)";
const sources = [
  "public/favicon-32x32.png",
  "public/android-chrome-192x192.png",
];
const report = {
  checkedAt: new Date().toISOString(),
  sources,
  title,
  titleMr,
  publicationApproved: false,
  checks: [],
};
const base = "http://localhost:3000";
const prior = fs.existsSync("docs/overview-cloudinary-draft-check-results.json")
  ? JSON.parse(
      fs.readFileSync(
        "docs/overview-cloudinary-draft-check-results.json",
        "utf8",
      ),
    )
  : null;
if (prior?.recordId)
  report.originalCreation = prior.originalCreation || {
    recordId: prior.recordId,
    beforeCount: prior.beforeCount,
    afterCount: prior.afterCount,
    checks: prior.checks.filter(
      (name) =>
        name.includes("Exactly one Save Draft") ||
        name.includes("stored image URLs"),
    ),
  };
let browser,
  client,
  creates = 0;
const check = (name) => {
  report.checks.push(name);
  console.log("PASS " + name);
};
(async () => {
  client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "mla");
  const matching = await db
    .collection("works")
    .find({ titleEn: title })
    .toArray();
  if (matching.length > 1 || matching.some((item) => item.published))
    throw Error("Unexpected existing test state; stop for review.");
  const before = await db.collection("works").countDocuments({});
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  // Public navigation may include a visit counter; do not create unrelated counter writes.
  await page.route("**/api/visits", (route) =>
    route.fulfill({ json: { count: 0 } }),
  );
  await page.route("**/api/works", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    const payload = route.request().postDataJSON();
    if (
      ++creates > 1 ||
      payload.published !== false ||
      payload.action !== "save-draft" ||
      payload.titleEn !== title
    )
      return route.abort();
    return route.continue();
  });
  await page.goto(base + "/ward-control");
  await page
    .locator("#admin-dashboard-key")
    .fill(process.env.ADMIN_DASHBOARD_KEY);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("heading", { name: "Recent complaints" }).waitFor();
  check("Actual overview loads in browser after server restart");
  await page.goto(base + "/ward-control/works");
  if (!matching.length) {
    await page.getByRole("button", { name: "Add Work", exact: true }).click();
    const editor = page.getByRole("dialog", { name: "Add works", exact: true });
    const fields = {
      "Title English": title,
      "Title Marathi": titleMr,
      "Category English": "Admin verification — test only",
      "Category Marathi": "प्रशासकीय चाचणी",
      "Location English": "TEST ONLY — no actual civic location",
      "Location Marathi": "फक्त चाचणी — वास्तविक ठिकाण नाही",
      "Work status English": "Unpublished admin test — not a completed work",
      "Work status Marathi": "अप्रकाशित प्रशासकीय चाचणी — वास्तविक काम नाही",
      "Description English":
        "Owner-authorized temporary CMS verification. Before/after slots contain existing site lotus icons at different sizes, not civic-work evidence. This is not a real development project or achievement. Keep unpublished until separately approved.",
      "Description Marathi":
        "मालकाच्या परवानगीने केलेली तात्पुरती प्रशासकीय चाचणी. दोन्ही चित्रे वेबसाइटच्या कमळ चिन्हाची आहेत. हे वास्तविक विकासकाम किंवा कामगिरी नाही. स्वतंत्र परवानगीशिवाय प्रकाशित करू नये.",
      "Highlights English (one per line)":
        "Test only; not genuine civic activity\nExisting non-sensitive website logos",
      "Highlights Marathi (one per line)":
        "फक्त चाचणी; वास्तविक नागरी काम नाही\nवेबसाइटची विद्यमान चिन्हे",
    };
    for (const [label, value] of Object.entries(fields))
      await editor.getByLabel(label, { exact: true }).fill(value);
    await editor.locator("input[type=file]").nth(0).setInputFiles(sources[0]);
    await editor
      .getByRole("button", { name: "Save Draft", exact: true })
      .waitFor({ state: "visible" });
    await page.waitForFunction(
      () =>
        ![...document.querySelectorAll("button")].find(
          (b) => b.textContent === "Save Draft",
        )?.disabled,
    );
    await editor.locator("input[type=file]").nth(1).setInputFiles(sources[1]);
    await page.waitForFunction(
      () =>
        ![...document.querySelectorAll("button")].find(
          (b) => b.textContent === "Save Draft",
        )?.disabled,
    );
    const previewImages = await editor
      .locator("img.admin-image-preview")
      .evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0),
      );
    if (!previewImages) throw Error("Selected admin images failed to decode");
    await editor
      .getByRole("button", { name: "Save Draft", exact: true })
      .click();
    await editor.waitFor({ state: "hidden", timeout: 60000 });
    check("Exactly one Save Draft submitted through actual Works editor");
  } else
    check("Reused existing matching unpublished test record; no new upload");
  const saved = await db.collection("works").findOne({ titleEn: title });
  if (!saved || saved.published !== false)
    throw Error("Draft missing or unexpectedly published");
  report.recordId = saved._id.toString();
  report.slug = saved.slug;
  report.published = saved.published;
  report.beforeCount = before;
  report.afterCount = await db.collection("works").countDocuments({});
  if (report.afterCount !== before + (matching.length ? 0 : 1))
    throw Error("Unexpected record count change");
  for (const key of ["beforeImage", "afterImage"]) {
    const url = new URL(saved[key]);
    if (
      url.hostname !== "res.cloudinary.com" ||
      url.pathname.split("/")[1] !== process.env.CLOUDINARY_CLOUD_NAME
    )
      throw Error("Image does not belong to configured account");
    const response = await fetch(saved[key]);
    if (
      !response.ok ||
      !response.headers.get("content-type")?.startsWith("image/")
    )
      throw Error("Uploaded image unavailable");
  }
  check(
    "Both stored image URLs use the updated Cloudinary account and serve valid images",
  );
  await page.getByLabel("Records").selectOption("tests");
  const row = page.getByRole("row").filter({ hasText: title });
  await row.waitFor();
  await row
    .getByRole("button", { name: "Edit / Preview", exact: true })
    .click();
  const edit = page.getByRole("dialog", { name: "Edit works", exact: true });
  await edit.locator("img.admin-image-preview").first().waitFor();
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll(".admin-modal img.admin-image-preview")]
        .length === 2 &&
      [
        ...document.querySelectorAll(".admin-modal img.admin-image-preview"),
      ].every((image) => image.complete && image.naturalWidth > 0),
  );
  check(
    "Draft appears under test records and both saved images decode in admin editor",
  );
  report.controls = {};
  for (const action of ["Save Draft", "Preview", "Publish"])
    report.controls[action] = await edit
      .getByRole("button", { name: action, exact: true })
      .isVisible();
  if (await edit.getByRole("link", { name: "View Live", exact: true }).count())
    throw Error("Unpublished draft incorrectly exposes View Live");
  report.controls.viewLiveCorrectlyHiddenForDraft = true;
  await edit.getByRole("button", { name: "Preview", exact: true }).click();
  const preview = page.getByRole("dialog", { name: "Website draft preview" });
  const frame = page.frameLocator('iframe[title="Private website preview"]');
  await frame.getByText(title, { exact: true }).first().waitFor();
  for (const placement of ["homepage", "listing", "detail"]) {
    await preview.getByLabel("Preview placement").selectOption(placement);
    await frame.getByText(title, { exact: true }).first().waitFor();
    const expected =
      placement === "detail"
        ? [saved.afterImage]
        : [saved.beforeImage, saved.afterImage];
    for (const src of expected) {
      const image = frame.locator("img");
      await image.first().waitFor();
      const decoded = await frame
        .locator("img")
        .evaluateAll(
          (images, value) =>
            images.some(
              (img) =>
                img.getAttribute("src") === value &&
                img.complete &&
                img.naturalWidth > 0,
            ),
          src,
        );
      if (!decoded) {
        await page.waitForTimeout(1500);
        if (
          !(await frame
            .locator("img")
            .evaluateAll(
              (images, value) =>
                images.some(
                  (img) =>
                    img.getAttribute("src") === value &&
                    img.complete &&
                    img.naturalWidth > 0,
                ),
              src,
            ))
        )
          throw Error("Preview image failed: " + placement);
      }
    }
    check(
      "Protected " + placement + " preview renders expected uploaded images",
    );
  }
  await preview.getByLabel("Preview language").selectOption("mr");
  await frame.getByText(titleMr, { exact: true }).first().waitFor();
  await preview.getByLabel("Preview viewport").selectOption("mobile");
  check("Saved draft preview supports Marathi and mobile width");
  await preview
    .getByRole("button", { name: "Return to editing", exact: true })
    .click();
  if (
    (await edit.getByLabel("Title English", { exact: true }).inputValue()) !==
    title
  )
    throw Error("Editor values lost");
  await edit.getByRole("button", { name: "Close editor" }).click();
  report.controls.deleteWithConfirmationAvailable = await row
    .getByRole("button", { name: "Delete", exact: true })
    .isVisible();
  report.controls.publishReviewAvailable = await row
    .getByRole("button", { name: "Review & Publish", exact: true })
    .isVisible();
  const response = await fetch(base + "/api/works");
  const publicItems = (await response.json()).works;
  if (
    publicItems.some(
      (item) => item.id === report.recordId || item.titleEn === title,
    )
  )
    throw Error("Draft exposed by public works API");
  for (const path of ["/", "/works", "/works/" + saved.slug]) {
    await page.goto(base + path);
    await page.waitForTimeout(500);
    if (
      (await page.getByText(title, { exact: true }).count()) ||
      (await page.getByText(titleMr, { exact: true }).count())
    )
      throw Error("Draft exposed publicly");
  }
  const final = await db.collection("works").findOne({ _id: saved._id });
  if (final.published !== false) throw Error("Publication state changed");
  check(
    "Draft remains absent from homepage, Works listing, detail URL and public API",
  );
  report.completed = true;
  report.creates = creates;
})()
  .catch((error) => {
    report.completed = false;
    report.error = error.message.replace(/https?:\/\/[^\s]+/g, "[URL omitted]");
    console.error("CHECK FAILED: " + report.error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (client) await client.close();
    fs.writeFileSync(
      "docs/overview-cloudinary-draft-check-results.json",
      JSON.stringify(report, null, 2),
    );
  });
