import { randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getDatabase } from "../../../lib/mongodb";
import { rateLimit } from "../../../lib/rateLimit";

const clean = (value, max = 1000) => String(value || "").trim().slice(0, max);

function isAdmin(request) {
  const configured = process.env.ADMIN_DASHBOARD_KEY || "";
  const supplied = request.headers.get("x-admin-key") || "";
  const a = Buffer.from(configured);
  const b = Buffer.from(supplied);
  return Boolean(configured) && a.length === b.length && timingSafeEqual(a, b);
}

function slugify(value) {
  return clean(value, 160).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
}

async function uploadNewsImage(dataUrl) {
  if (!String(dataUrl || "").startsWith("data:image/")) throw new Error("News photo must be an image file.");
  if (dataUrl.length > 7_000_000) throw new Error("News photo is too large. Maximum size is 5 MB.");
  const { CLOUDINARY_CLOUD_NAME: cloud_name, CLOUDINARY_API_KEY: api_key, CLOUDINARY_API_SECRET: api_secret } = process.env;
  if (!cloud_name || !api_key || !api_secret) throw new Error("Cloudinary credentials are not configured.");
  cloudinary.config({ cloud_name, api_key, api_secret });
  const uploaded = await cloudinary.uploader.upload(dataUrl, {
    folder: "news",
    public_id: `${Date.now()}-news-${randomBytes(3).toString("hex")}`,
    resource_type: "image",
    transformation: [{ width: 1800, height: 1200, crop: "limit", quality: "auto", fetch_format: "auto" }],
  });
  return uploaded.secure_url;
}

export async function GET(request) {
  try {
    const db = await getDatabase();
    const adminView = new URL(request.url).searchParams.get("admin") === "1";
    if (adminView && !isAdmin(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const news = await db.collection("news").find(adminView ? {} : { published: true }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, news: news.map((item) => ({ ...item, _id: undefined, id: item._id.toString() })) });
  } catch (error) {
    console.error("News loading failed", error?.message);
    return NextResponse.json({ error: "News is temporarily unavailable." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (rateLimit(request, "admin-news-post", 20, 10 * 60_000)) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body = await request.json();
    const titleEn = clean(body.titleEn, 180);
    const article = {
      slug: `${slugify(titleEn) || "news-update"}-${randomBytes(2).toString("hex")}`,
      titleEn,
      titleMr: clean(body.titleMr, 180),
      categoryEn: clean(body.categoryEn, 100) || "Ward Update",
      categoryMr: clean(body.categoryMr, 100),
      summaryEn: clean(body.summaryEn, 1000),
      summaryMr: clean(body.summaryMr, 1000),
      contentEn: clean(body.contentEn, 12000),
      contentMr: clean(body.contentMr, 12000),
      externalUrl: clean(body.externalUrl, 500),
      date: clean(body.date, 10) || new Date().toISOString().slice(0, 10),
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!article.titleEn || !article.summaryEn || !body.image) {
      return NextResponse.json({ error: "English title, summary, and news photo are required." }, { status: 400 });
    }
    article.image = await uploadNewsImage(body.image);
    const db = await getDatabase();
    const result = await db.collection("news").insertOne(article);
    return NextResponse.json({ success: true, article: { ...article, id: result.insertedId.toString() } }, { status: 201 });
  } catch (error) {
    console.error("News creation failed", error?.message);
    return NextResponse.json({ error: error?.message || "News could not be published." }, { status: 500 });
  }
}
