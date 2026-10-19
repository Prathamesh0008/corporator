import { createHash } from "node:crypto";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";
import { rateLimit } from "../../../lib/rateLimit";
import {
  notifyStoredContact,
  notificationUnavailable,
  validContactEmail,
} from "../../../lib/contactNotification.server.js";

const clean = (value, max = 1000) =>
  String(value || "")
    .trim()
    .slice(0, max);
const hash = (value) => createHash("sha256").update(value).digest("hex");

export async function POST(request) {
  try {
    if (rateLimit(request, "contact-post", 5, 10 * 60_000))
      return NextResponse.json(
        { error: "Too many messages. Please wait and try again." },
        { status: 429 },
      );
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    if (body?.website)
      return NextResponse.json({ success: true }, { status: 201 });
    const fields = {
      name: clean(body?.name, 120),
      phone: clean(body?.phone, 30),
      email: String(body?.email || "").trim(),
      message: clean(body?.message, 4000),
    };
    if (!fields.name || !fields.phone || !fields.message)
      return NextResponse.json(
        { error: "Name, phone and message are required." },
        { status: 400 },
      );
    if (
      !/^[0-9+() -]{10,15}$/.test(fields.phone) ||
      fields.message.length < 10 ||
      (fields.email && !validContactEmail(fields.email))
    )
      return NextResponse.json(
        { error: "Please check the mobile number, email and message." },
        { status: 400 },
      );

    // Optional header preserves legacy callers. The public form reuses a random key after network failure.
    const key = request.headers.get("Idempotency-Key");
    if (
      key &&
      !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(
        key,
      )
    )
      return NextResponse.json(
        { error: "Invalid submission key." },
        { status: 400 },
      );
    const _id = key
      ? new ObjectId(hash(`contact:${key}`).slice(0, 24))
      : new ObjectId();
    const contentHash = hash(JSON.stringify(fields));
    const db = await getDatabase();
    const collection = db.collection("contact_messages");
    let saved = {
      _id,
      ...fields,
      createdAt: new Date(),
      ...(key ? { submissionHash: contentHash } : {}),
      notification: { provider: "resend", status: "pending" },
    };
    try {
      await collection.insertOne(saved);
    } catch (error) {
      if (error?.code !== 11000 || !key) throw error;
      saved = await collection.findOne({ _id });
      if (!saved || saved.submissionHash !== contentHash)
        return NextResponse.json(
          {
            error:
              "This submission key has already been used. Please start a new message.",
          },
          { status: 409 },
        );
    }

    let contact;
    try {
      contact = await notifyStoredContact(db, saved);
    } catch {
      console.error(
        "[contact-notification] " +
          JSON.stringify({ code: "NOTIFICATION_ATTEMPT_UNAVAILABLE" }),
      );
      contact = { sent: false, reason: notificationUnavailable };
    }
    // MongoDB is the source of truth. Never fail a saved submission because email failed.
    return NextResponse.json(
      { success: true, email: { contact } },
      { status: 201 },
    );
  } catch {
    console.error(
      "[contact] " + JSON.stringify({ code: "CONTACT_PERSISTENCE_FAILED" }),
    );
    return NextResponse.json(
      { error: "Failed to submit contact form." },
      { status: 500 },
    );
  }
}
