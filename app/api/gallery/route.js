import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { validWebUrl } from "../../../lib/adminContent";
import { uploadContentImage } from "../../../lib/contentImages";
import { publicContentQuery } from "../../../lib/publicContent";
import { getDatabase } from "../../../lib/mongodb";

const clean = (value, max = 1000) =>
  String(value || "")
    .trim()
    .slice(0, max);
function isAdmin(request) {
  const configured = process.env.ADMIN_DASHBOARD_KEY || "";
  const supplied = request.headers.get("x-admin-key") || "";
  const a = Buffer.from(configured);
  const b = Buffer.from(supplied);
  return Boolean(configured) && a.length === b.length && timingSafeEqual(a, b);
}
async function upload(dataUrl) {
  return uploadContentImage(dataUrl, "gallery");
}
function map(item) {
  return {
    ...item,
    _id: undefined,
    id: item._id.toString(),
    createdAt: item.createdAt?.toISOString?.() || item.createdAt,
  };
}

export async function GET(request) {
  try {
    const adminView = new URL(request.url).searchParams.get("admin") === "1";
    if (adminView && !isAdmin(request))
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const db = await getDatabase();
    const items = await db
      .collection("gallery")
      .find(
        adminView ? {} : publicContentQuery,
        adminView ? {} : { projection: { draft: 0 } },
      )
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, items: items.map(map) });
  } catch (error) {
    return NextResponse.json(
      { error: "Gallery unavailable." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    if (!isAdmin(request))
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body = await request.json();
    const item = {
      type: body.type === "video" ? "video" : "photo",
      titleEn: clean(body.titleEn, 180),
      titleMr: clean(body.titleMr, 180),
      categoryEn: clean(body.categoryEn, 100) || "Community",
      categoryMr: clean(body.categoryMr, 100),
      date:
        clean(body.date, 10) ||
        (body.action === "save-draft"
          ? ""
          : new Date().toISOString().slice(0, 10)),
      href: clean(body.href, 500),
      published:
        body.action === "save-draft"
          ? false
          : typeof body.published === "boolean"
            ? body.published
            : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!item.titleEn || (body.action !== "save-draft" && !body.image))
      return NextResponse.json(
        { error: "Title and image are required." },
        { status: 400 },
      );
    if (body.action !== "save-draft" && item.type === "video" && !item.href)
      return NextResponse.json(
        { error: "Reel URL is required for videos." },
        { status: 400 },
      );
    if (!validWebUrl(item.href))
      return NextResponse.json(
        { error: "Use an http or https video link." },
        { status: 400 },
      );
    item.image = body.image ? await upload(body.image) : "";
    const db = await getDatabase();
    const result = await db.collection("gallery").insertOne(item);
    return NextResponse.json(
      { success: true, item: map({ ...item, _id: result.insertedId }) },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Gallery item could not be created. Check the required fields and image, then try again.",
      },
      { status: 500 },
    );
  }
}
