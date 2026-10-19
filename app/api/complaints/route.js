import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import { getDatabase } from "../../../lib/mongodb";
import { rateLimit } from "../../../lib/rateLimit";
import { notifyStoredComplaint } from "../../../lib/complaintNotification.server.js";

const clean = (value, max = 1000) => String(value || "").trim().slice(0, max);
const allowedTypes = new Set(["Road / pothole / footpath", "Water supply / leakage", "Garbage / cleanliness", "Drainage / sewer", "Street light", "Public toilet", "Garden / public space", "Other civic issue"]);
const phonePattern = /^[0-9+() -]{10,15}$/;

function newId() {
  const number = Math.floor(100000 + Math.random() * 900000);
  return `CMP-${number}`;
}
async function uploadPhoto(data, id) {
  if (!data.startsWith("data:image/")) throw new Error("Invalid photo format.");
  const { CLOUDINARY_CLOUD_NAME: cloud_name, CLOUDINARY_API_KEY: api_key, CLOUDINARY_API_SECRET: api_secret } = process.env;
  if (!cloud_name || !api_key || !api_secret) throw new Error("Photo upload is temporarily unavailable.");
  cloudinary.config({ cloud_name, api_key, api_secret });
  const uploaded = await cloudinary.uploader.upload(data, { folder: "complaints", public_id: id.toLowerCase(), resource_type: "image", overwrite: false });
  return { photoUrl: uploaded.secure_url, photoPublicId: uploaded.public_id };
}

export async function POST(request) {
  try {
    if (rateLimit(request, "complaint-post", 5, 10 * 60_000)) return NextResponse.json({ error: "Too many complaints submitted. Please wait and try again." }, { status: 429 });
    let body;
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
    if (body?.website) return NextResponse.json({ success: true }, { status: 201 });
    const data = { name: clean(body.name, 120), phone: clean(body.phone, 15), address: clean(body.address, 300), ward: "24(D)", complaintType: clean(body.complaintType, 80), location: clean(body.location, 300), description: clean(body.description, 4000) };
    if (!data.name || !phonePattern.test(data.phone) || !allowedTypes.has(data.complaintType) || !data.location || data.description.length < 10) return NextResponse.json({ error: "Please check the required details and mobile number." }, { status: 400 });
    if (String(body.photoDataUrl || "").length > 2_100_000) return NextResponse.json({ error: "Photo is too large." }, { status: 413 });
    const photoDataUrl = clean(body.photoDataUrl, 2_100_000);
    if (photoDataUrl && !photoDataUrl.startsWith("data:image/")) return NextResponse.json({ error: "Invalid photo format." }, { status: 400 });
    const key = request.headers.get("Idempotency-Key");
    if (key && !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(key)) return NextResponse.json({ error: "Invalid submission key." }, { status: 400 });
    const hash = value => createHash("sha256").update(value).digest("hex");
    const _id = key ? new ObjectId(hash(`complaint:${key}`).slice(0, 24)) : new ObjectId();
    const submissionHash = hash(JSON.stringify({ ...data, photoDataUrl }));
    const db = await getDatabase();
    const collection = db.collection("complaints");
    const replay = saved => saved.submissionHash === submissionHash
      ? NextResponse.json({ success: true, complaintId: saved.complaintId, status: "Under Review" }, { status: 201 })
      : NextResponse.json({ error: "This submission key has already been used. Please start a new complaint." }, { status: 409 });
    if (key) { const saved = await collection.findOne({ _id }); if (saved) return replay(saved); }
    await collection.createIndex({ complaintId: 1 }, { unique: true });
    let complaintId; let inserted = false; let saved;
    for (let attempt = 0; attempt < 3 && !inserted; attempt += 1) {
      complaintId = newId();
      const photo = photoDataUrl ? await uploadPhoto(photoDataUrl, complaintId) : { photoUrl: null, photoPublicId: null };
      try {
        const now = new Date();
        saved = { _id, complaintId, ...data, ...photo, urgency: "normal", status: "Under Review", comments: [], source: "website-complaint-form", createdAt: now, updatedAt: now, ...(key ? { submissionHash } : {}), notification: { provider: "resend", status: "pending" } };
        await collection.insertOne(saved); inserted = true;
      } catch (error) {
        if (error?.code !== 11000) throw error;
        if (key) { const existing = await collection.findOne({ _id }); if (existing) return replay(existing); }
      }
    }
    if (!inserted) throw new Error("Could not create unique complaint number.");
    try { await notifyStoredComplaint(db, saved); }
    catch { console.error("[complaint-notification] NOTIFICATION_ATTEMPT_UNAVAILABLE"); }
    return NextResponse.json({ success: true, complaintId, status: "Under Review" }, { status: 201 });
  } catch { console.error("[complaint] COMPLAINT_PERSISTENCE_FAILED"); return NextResponse.json({ error: "Complaint could not be submitted right now. Please try again." }, { status: 500 }); }
}

export async function GET(request) {
  try {
    if (rateLimit(request, "complaint-track", 20, 10 * 60_000)) return NextResponse.json({ error: "Too many tracking attempts. Please wait." }, { status: 429 });
    const id = clean(new URL(request.url).searchParams.get("complaintId"), 40).toUpperCase();
    if (!/^CMP-\d{6}$/.test(id)) return NextResponse.json({ error: "Enter a valid complaint number." }, { status: 400 });
    const db = await getDatabase();
    const complaint = await db.collection("complaints").findOne({ complaintId: id }, { projection: { _id: 0, complaintId: 1, status: 1, comments: 1, createdAt: 1, updatedAt: 1, complaintType: 1, location: 1 } });
    if (!complaint) return NextResponse.json({ error: "Complaint not found. Check the number and try again." }, { status: 404 });
    return NextResponse.json({ success: true, complaint });
  } catch (error) { console.error("Complaint tracking failed", error?.message); return NextResponse.json({ error: "Status is temporarily unavailable." }, { status: 500 }); }
}
