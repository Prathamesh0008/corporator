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
  if (!_id) return NextResponse.json({ error: "Invalid news ID." }, { status: 400 });
  const body = await request.json();
  const limits = { titleEn: 180, titleMr: 180, categoryEn: 100, categoryMr: 100, summaryEn: 1000, summaryMr: 1000, contentEn: 12000, contentMr: 12000, externalUrl: 500, date: 10 };
  const update = { updatedAt: new Date() };
  Object.entries(limits).forEach(([key, max]) => { if (key in body) update[key] = clean(body[key], max); });
  if (typeof body.published === "boolean") update.published = body.published;
  const db = await getDatabase(); const result = await db.collection("news").findOneAndUpdate({ _id }, { $set: update }, { returnDocument: "after" });
  if (!result) return NextResponse.json({ error: "News article not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params; const _id = idFrom(id);
  if (!_id) return NextResponse.json({ error: "Invalid news ID." }, { status: 400 });
  const db = await getDatabase(); const result = await db.collection("news").deleteOne({ _id });
  return result.deletedCount ? NextResponse.json({ success: true }) : NextResponse.json({ error: "News article not found." }, { status: 404 });
}
