import { timingSafeEqual } from "node:crypto";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDatabase } from "../../../../lib/mongodb";

const clean = (value, max = 1000) => String(value || "").trim().slice(0, max);
function isAdmin(request) { const configured = process.env.ADMIN_DASHBOARD_KEY || ""; const supplied = request.headers.get("x-admin-key") || ""; const a = Buffer.from(configured); const b = Buffer.from(supplied); return Boolean(configured) && a.length === b.length && timingSafeEqual(a, b); }
function idFrom(value) { return ObjectId.isValid(value) ? new ObjectId(value) : null; }

export async function PATCH(request, { params }) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params; const _id = idFrom(id);
  if (!_id) return NextResponse.json({ error: "Invalid work ID." }, { status: 400 });
  const body = await request.json();
  const allowed = ["titleEn", "titleMr", "categoryEn", "categoryMr", "locationEn", "locationMr", "statusEn", "statusMr", "descriptionEn", "descriptionMr"];
  const update = { updatedAt: new Date() };
  allowed.forEach((key) => { if (key in body) update[key] = clean(body[key], key.includes("description") ? 3000 : 200); });
  if ("highlightsEn" in body) update.highlightsEn = Array.isArray(body.highlightsEn) ? body.highlightsEn.map((item) => clean(item, 300)).filter(Boolean).slice(0, 8) : clean(body.highlightsEn, 1500).split("\n").filter(Boolean);
  if ("highlightsMr" in body) update.highlightsMr = Array.isArray(body.highlightsMr) ? body.highlightsMr.map((item) => clean(item, 300)).filter(Boolean).slice(0, 8) : clean(body.highlightsMr, 1500).split("\n").filter(Boolean);
  if (typeof body.published === "boolean") update.published = body.published;
  const db = await getDatabase();
  const result = await db.collection("works").findOneAndUpdate({ _id }, { $set: update }, { returnDocument: "after" });
  if (!result) return NextResponse.json({ error: "Work not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params; const _id = idFrom(id);
  if (!_id) return NextResponse.json({ error: "Invalid work ID." }, { status: 400 });
  const db = await getDatabase(); const result = await db.collection("works").deleteOne({ _id });
  return result.deletedCount ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Work not found." }, { status: 404 });
}
