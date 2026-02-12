import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const DB_NAME = process.env.MONGODB_DB || "mla";
const COLLECTION = "contact_messages";

const clean = (value, max = 1000) => String(value || "").trim().slice(0, max);

export async function POST(request) {
  try {
    const body = await request.json();

    const name = clean(body?.name, 120);
    const phone = clean(body?.phone, 30);
    const email = clean(body?.email, 160);
    const message = clean(body?.message, 4000);

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Name, phone and message are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection(COLLECTION).insertOne({
      name,
      phone,
      email,
      message,
      source: "website-contact-form",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit contact form." },
      { status: 500 }
    );
  }
}
