import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { v2 as cloudinary } from "cloudinary";

const DB_NAME = process.env.MONGODB_DB || "mla";
const COLLECTION = "complaints";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

const clean = (value, max = 2000) => String(value || "").trim().slice(0, max);

function generateComplaintId() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `COMP-${datePart}-${randomPart}`;
}

function configureCloudinary() {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  return true;
}

async function uploadPhotoToCloudinary(photoDataUrl, complaintId) {
  const configured = configureCloudinary();
  if (!configured) {
    throw new Error("Cloudinary is not configured.");
  }

  const uploadResult = await cloudinary.uploader.upload(photoDataUrl, {
    folder: "complaints",
    public_id: complaintId.toLowerCase(),
    overwrite: true,
    resource_type: "image",
  });

  return {
    photoUrl: uploadResult.secure_url || "",
    photoPublicId: uploadResult.public_id || "",
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = clean(body?.name, 120);
    const phone = clean(body?.phone, 30);
    const email = clean(body?.email, 160);
    const address = clean(body?.address, 300);
    const ward = clean(body?.ward, 20);
    const complaintType = clean(body?.complaintType, 80);
    const location = clean(body?.location, 300);
    const description = clean(body?.description, 4000);
    const urgency = clean(body?.urgency, 20) || "medium";
    const photoDataUrl = clean(body?.photoDataUrl, 2_500_000);

    if (!name || !phone || !ward || !complaintType || !location || !description) {
      return NextResponse.json(
        { error: "Please fill all required complaint fields." },
        { status: 400 }
      );
    }

    if (photoDataUrl && photoDataUrl.length > 2_500_000) {
      return NextResponse.json(
        { error: "Photo is too large. Please upload a smaller image." },
        { status: 400 }
      );
    }

    const complaintId = generateComplaintId();
    const now = new Date();
    let photoUrl = null;
    let photoPublicId = null;

    if (photoDataUrl) {
      const uploaded = await uploadPhotoToCloudinary(photoDataUrl, complaintId);
      photoUrl = uploaded.photoUrl || null;
      photoPublicId = uploaded.photoPublicId || null;
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTION).insertOne({
      complaintId,
      name,
      phone,
      email,
      address,
      ward,
      complaintType,
      location,
      description,
      urgency,
      photoUrl,
      photoPublicId,
      status: "Under Review",
      source: "website-complaint-form",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        success: true,
        complaintId,
        status: "Under Review",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit complaint." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const complaintId = clean(searchParams.get("complaintId"), 40).toUpperCase();

    if (!complaintId) {
      return NextResponse.json(
        { error: "complaintId is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const complaint = await db.collection(COLLECTION).findOne(
      { complaintId },
      {
        projection: {
          _id: 0,
          complaintId: 1,
          name: 1,
          phone: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          complaintType: 1,
          location: 1,
        },
      }
    );

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, complaint });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch complaint." },
      { status: 500 }
    );
  }
}
