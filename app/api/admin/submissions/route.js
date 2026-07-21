import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getDatabase } from "../../../../lib/mongodb";
import { rateLimit } from "../../../../lib/rateLimit";

const COMPLAINTS_COLLECTION = "complaints";
const CONTACT_COLLECTION = "contact_messages";
const ALLOWED_COMPLAINT_STATUSES = ["Under Review", "In Progress", "Resolved", "Rejected"];

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized. Invalid admin key." },
    { status: 401 }
  );
}

function normalizeLimit(rawLimit) {
  const parsed = Number.parseInt(rawLimit || "50", 10);
  if (Number.isNaN(parsed)) return 50;
  return Math.min(Math.max(parsed, 1), 200);
}

function validateAdminKey(request) {
  const configuredKey = process.env.ADMIN_DASHBOARD_KEY;
  if (!configuredKey) {
    return NextResponse.json(
      { error: "ADMIN_DASHBOARD_KEY is not configured on server." },
      { status: 500 }
    );
  }

  const requestKey = request.headers.get("x-admin-key");
  const requestBuffer = Buffer.from(requestKey || "");
  const configuredBuffer = Buffer.from(configuredKey);
  if (requestBuffer.length !== configuredBuffer.length || !timingSafeEqual(requestBuffer, configuredBuffer)) {
    return unauthorizedResponse();
  }

  return null;
}

function mapComplaint(doc) {
  return {
    id: doc._id?.toString(),
    complaintId: doc.complaintId || "",
    name: doc.name || "",
    phone: doc.phone || "",
    ward: doc.ward || "",
    complaintType: doc.complaintType || "",
    urgency: doc.urgency || "",
    status: doc.status || "",
    location: doc.location || "",
    description: doc.description || "",
    photoUrl: doc.photoUrl || "",
    comments: Array.isArray(doc.comments) ? doc.comments.map((comment) => ({
      text: String(comment?.text || ""),
      createdAt: comment?.createdAt ? new Date(comment.createdAt).toISOString() : null,
    })) : [],
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

function mapContact(doc) {
  return {
    id: doc._id?.toString(),
    name: doc.name || "",
    phone: doc.phone || "",
    email: doc.email || "",
    message: doc.message || "",
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
  };
}

export async function GET(request) {
  try {
    if (rateLimit(request, "admin-get", 20, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
    const authError = validateAdminKey(request);
    if (authError) {
      return authError;
    }

    const { searchParams } = new URL(request.url);
    const limit = normalizeLimit(searchParams.get("limit"));

    const db = await getDatabase();

    const [complaintsRaw, contactsRaw] = await Promise.all([
      db
        .collection(COMPLAINTS_COLLECTION)
        .find(
          {},
          {
            projection: {
              complaintId: 1,
              name: 1,
              phone: 1,
              ward: 1,
              complaintType: 1,
              urgency: 1,
              status: 1,
              location: 1,
              description: 1,
              photoUrl: 1,
              comments: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          }
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray(),
      db
        .collection(CONTACT_COLLECTION)
        .find(
          {},
          {
            projection: {
              name: 1,
              phone: 1,
              email: 1,
              message: 1,
              createdAt: 1,
            },
          }
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray(),
    ]);

    return NextResponse.json({
      success: true,
      complaints: complaintsRaw.map(mapComplaint),
      contacts: contactsRaw.map(mapContact),
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load admin submissions." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    if (rateLimit(request, "admin-patch", 30, 10 * 60_000)) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
    const authError = validateAdminKey(request);
    if (authError) {
      return authError;
    }

    const body = await request.json();
    const complaintId = String(body?.complaintId || "").trim().toUpperCase();
    const status = String(body?.status || "").trim();
    const comment = String(body?.comment || "").trim().slice(0, 1000);

    if (!complaintId || (!status && !comment)) {
      return NextResponse.json(
        { error: "complaintId and a status or comment are required." },
        { status: 400 }
      );
    }

    if (status && !ALLOWED_COMPLAINT_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status.",
          allowedStatuses: ALLOWED_COMPLAINT_STATUSES,
        },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const now = new Date();

    const update = { $set: { updatedAt: now } };
    if (status) update.$set.status = status;
    if (comment) update.$push = { comments: { text: comment, createdAt: now } };

    const result = await db.collection(COMPLAINTS_COLLECTION).findOneAndUpdate(
      { complaintId },
      update,
      { returnDocument: "after" }
    );
    const updatedComplaint = result?.value || result;

    if (!updatedComplaint?.complaintId) {
      return NextResponse.json(
        { error: "Complaint not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      complaint: mapComplaint(updatedComplaint),
      updatedAt: now.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update complaint status." },
      { status: 500 }
    );
  }
}
