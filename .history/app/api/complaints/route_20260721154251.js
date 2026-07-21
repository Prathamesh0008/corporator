import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getDatabase } from "../../../lib/mongodb";
import { rateLimit } from "../../../lib/rateLimit";

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
    const body = await request.json();
    if (body?.website) return NextResponse.json({ success: true }, { status: 201 });
    const data = { name: clean(body.name, 120), phone: clean(body.phone, 15), address: clean(body.address, 300), ward: "24(D)", complaintType: clean(body.complaintType, 80), location: clean(body.location, 300), description: clean(body.description, 4000) };
    if (!data.name || !phonePattern.test(data.phone) || !allowedTypes.has(data.complaintType) || !data.location || data.description.length < 10) return NextResponse.json({ error: "Please check the required details and mobile number." }, { status: 400 });
    const photoDataUrl = clean(body.photoDataUrl, 2_100_000);
    if (photoDataUrl && photoDataUrl.length > 2_100_000) return NextResponse.json({ error: "Photo is too large." }, { status: 413 });
    const db = await getDatabase();
    await db.collection("complaints").createIndex({ complaintId: 1 }, { unique: true });
    let complaintId; let inserted = false;
    for (let attempt = 0; attempt < 3 && !inserted; attempt += 1) {
      complaintId = newId();
      const photo = photoDataUrl ? await uploadPhoto(photoDataUrl, complaintId) : { photoUrl: null, photoPublicId: null };
      try { const now = new Date(); await db.collection("complaints").insertOne({ complaintId, ...data, ...photo, urgency: "normal", status: "Under Review", comments: [], source: "website-complaint-form", createdAt: now, updatedAt: now }); inserted = true; } catch (error) { if (error?.code !== 11000) throw error; }
    }
    if (!inserted) throw new Error("Could not create unique complaint number.");
    return NextResponse.json({ success: true, complaintId, status: "Under Review" }, { status: 201 });
  } catch (error) { console.error("Complaint submission failed", error?.message); return NextResponse.json({ error: "Complaint could not be submitted right now. Please try again." }, { status: 500 }); }
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
