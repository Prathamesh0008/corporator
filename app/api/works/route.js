import { randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getDatabase } from "../../../lib/mongodb";
import { rateLimit } from "../../../lib/rateLimit";

const COLLECTION = "works";
const clean = (value, max = 1000) => String(value || "").trim().slice(0, max);

async function uploadWorkImage(dataUrl, label) {
  if (!String(dataUrl || "").startsWith("data:image/")) throw new Error(`${label} must be an image file.`);
  if (dataUrl.length > 7_000_000) throw new Error(`${label} image is too large. Maximum size is 5 MB.`);
  const { CLOUDINARY_CLOUD_NAME: cloud_name, CLOUDINARY_API_KEY: api_key, CLOUDINARY_API_SECRET: api_secret } = process.env;
  if (!cloud_name || !api_key || !api_secret) throw new Error("Cloudinary credentials are not configured.");
  cloudinary.config({ cloud_name, api_key, api_secret });
  const uploaded = await cloudinary.uploader.upload(dataUrl, {
    folder: "works",
    public_id: `${Date.now()}-${label.toLowerCase()}-${randomBytes(3).toString("hex")}`,
    resource_type: "image",
    transformation: [{ width: 1800, height: 1350, crop: "limit", quality: "auto", fetch_format: "auto" }],
  });
  return uploaded.secure_url;
}

function isAdmin(request) {
  const configured = process.env.ADMIN_DASHBOARD_KEY || "";
  const supplied = request.headers.get("x-admin-key") || "";
  const a = Buffer.from(configured);
  const b = Buffer.from(supplied);
  return Boolean(configured) && a.length === b.length && timingSafeEqual(a, b);
}

function mapWork(doc) {
  return { ...doc, _id: undefined, id: doc._id?.toString() || doc.id, createdAt: doc.createdAt?.toISOString?.() || doc.createdAt };
}

export async function GET(request) {
  try {
    const db = await getDatabase();
    const adminView = new URL(request.url).searchParams.get("admin") === "1";
    if (adminView && !isAdmin(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const works = await db.collection(COLLECTION).find(adminView ? {} : { published: true }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, works: works.map(mapWork) });
  } catch (error) {
    console.error("Works loading failed", error?.message);
    return NextResponse.json({ error: "Works are temporarily unavailable." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (rateLimit(request, "admin-work-post", 20, 10 * 60_000)) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body = await request.json();
    const work = {
      titleEn: clean(body.titleEn, 160), titleMr: clean(body.titleMr, 160),
      categoryEn: clean(body.categoryEn, 100), categoryMr: clean(body.categoryMr, 100),
      locationEn: clean(body.locationEn, 200), locationMr: clean(body.locationMr, 200),
      statusEn: clean(body.statusEn, 50) || "Completed", statusMr: clean(body.statusMr, 50) || "पूर्ण झाले",
      descriptionEn: clean(body.descriptionEn, 3000), descriptionMr: clean(body.descriptionMr, 3000),
      highlightsEn: clean(body.highlightsEn, 1500).split("\n").map((item) => item.trim()).filter(Boolean).slice(0, 8),
      highlightsMr: clean(body.highlightsMr, 1500).split("\n").map((item) => item.trim()).filter(Boolean).slice(0, 8),
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!work.titleEn || !work.locationEn || !work.descriptionEn || !body.beforeImage || !body.afterImage) {
      return NextResponse.json({ error: "English title, location, description, and both photos are required." }, { status: 400 });
    }
    [work.beforeImage, work.afterImage] = await Promise.all([
      uploadWorkImage(body.beforeImage, "Before"),
      uploadWorkImage(body.afterImage, "After"),
    ]);
    const db = await getDatabase();
    const result = await db.collection(COLLECTION).insertOne(work);
    return NextResponse.json({ success: true, work: mapWork({ ...work, _id: result.insertedId }) }, { status: 201 });
  } catch (error) {
    console.error("Work creation failed", error?.message);
    return NextResponse.json({ error: "Work could not be published." }, { status: 500 });
  }
}
