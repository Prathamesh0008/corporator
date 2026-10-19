import { randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { uploadContentImage } from "../../../lib/contentImages";
import { publicContentQuery } from "../../../lib/publicContent";
import { getDatabase } from "../../../lib/mongodb";
import { rateLimit } from "../../../lib/rateLimit";

const COLLECTION = "works";
const clean = (value, max = 1000) =>
  String(value || "")
    .trim()
    .slice(0, max);

async function uploadWorkImage(dataUrl) {
  return uploadContentImage(dataUrl, "works");
}

function isAdmin(request) {
  const configured = process.env.ADMIN_DASHBOARD_KEY || "";
  const supplied = request.headers.get("x-admin-key") || "";
  const a = Buffer.from(configured);
  const b = Buffer.from(supplied);
  return Boolean(configured) && a.length === b.length && timingSafeEqual(a, b);
}

function mapWork(doc) {
  return {
    ...doc,
    _id: undefined,
    id: doc._id?.toString() || doc.id,
    createdAt: doc.createdAt?.toISOString?.() || doc.createdAt,
  };
}

export async function GET(request) {
  try {
    const adminView = new URL(request.url).searchParams.get("admin") === "1";
    if (adminView && !isAdmin(request))
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const db = await getDatabase();
    const works = await db
      .collection(COLLECTION)
      .find(
        adminView ? {} : publicContentQuery,
        adminView ? {} : { projection: { draft: 0 } },
      )
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, works: works.map(mapWork) });
  } catch (error) {
    console.error("Works loading failed", error?.message);
    return NextResponse.json(
      { error: "Works are temporarily unavailable." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    if (rateLimit(request, "admin-work-post", 20, 10 * 60_000))
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429 },
      );
    if (!isAdmin(request))
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body = await request.json();
    const work = {
      slug: `${
        clean(body.titleEn, 100)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "work"
      }-${randomBytes(3).toString("hex")}`,
      titleEn: clean(body.titleEn, 160),
      titleMr: clean(body.titleMr, 160),
      categoryEn: clean(body.categoryEn, 100),
      categoryMr: clean(body.categoryMr, 100),
      locationEn: clean(body.locationEn, 200),
      locationMr: clean(body.locationMr, 200),
      statusEn: clean(body.statusEn, 50) || "Completed",
      statusMr: clean(body.statusMr, 50) || "पूर्ण झाले",
      descriptionEn: clean(body.descriptionEn, 3000),
      descriptionMr: clean(body.descriptionMr, 3000),
      highlightsEn: clean(body.highlightsEn, 1500)
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8),
      highlightsMr: clean(body.highlightsMr, 1500)
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8),
      published:
        body.action === "save-draft"
          ? false
          : typeof body.published === "boolean"
            ? body.published
            : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (
      !work.titleEn ||
      (body.action !== "save-draft" &&
        (!work.locationEn ||
          !work.descriptionEn ||
          !body.beforeImage ||
          !body.afterImage))
    ) {
      return NextResponse.json(
        {
          error:
            "English title, location, description, and both photos are required.",
        },
        { status: 400 },
      );
    }
    [work.beforeImage, work.afterImage] = await Promise.all([
      body.beforeImage
        ? uploadWorkImage(body.beforeImage, "Before")
        : Promise.resolve(""),
      body.afterImage
        ? uploadWorkImage(body.afterImage, "After")
        : Promise.resolve(""),
    ]);
    const db = await getDatabase();
    const result = await db.collection(COLLECTION).insertOne(work);
    return NextResponse.json(
      { success: true, work: mapWork({ ...work, _id: result.insertedId }) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Work creation failed", error?.message);
    return NextResponse.json(
      { error: "Work could not be published." },
      { status: 500 },
    );
  }
}
