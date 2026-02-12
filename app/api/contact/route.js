import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import twilio from "twilio";

const DB_NAME = process.env.MONGODB_DB || "mla";
const COLLECTION = "contact_messages";

const clean = (value, max = 1000) => String(value || "").trim().slice(0, max);

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || "";
const TWILIO_WHATSAPP_TO = process.env.TWILIO_WHATSAPP_TO || "";
const TWILIO_CONTENT_SID = process.env.TWILIO_CONTENT_SID || "";
const TWILIO_CONTENT_VARIABLES_JSON = process.env.TWILIO_CONTENT_VARIABLES_JSON || "";

let twilioClient = null;

function getTwilioClient() {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return null;
  if (!twilioClient) {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
}

async function sendWhatsAppAlert({ name, phone, email, message, createdAt }) {
  const client = getTwilioClient();

  if (!client || !TWILIO_WHATSAPP_FROM || !TWILIO_WHATSAPP_TO) {
    return { sent: false, reason: "Twilio WhatsApp env vars are incomplete." };
  }

  const payload = {
    from: TWILIO_WHATSAPP_FROM,
    to: TWILIO_WHATSAPP_TO,
  };

  if (TWILIO_CONTENT_SID) {
    let contentVariables = {
      1: name || "-",
      2: phone || "-",
    };

    if (TWILIO_CONTENT_VARIABLES_JSON) {
      try {
        contentVariables = JSON.parse(TWILIO_CONTENT_VARIABLES_JSON);
      } catch {
        // Fallback to default content variables if parsing fails.
      }
    }

    payload.contentSid = TWILIO_CONTENT_SID;
    payload.contentVariables = JSON.stringify(contentVariables);
  } else {
    payload.body = [
      "New Contact Form Submission",
      `Name: ${name || "-"}`,
      `Phone: ${phone || "-"}`,
      `Email: ${email || "-"}`,
      `Message: ${message || "-"}`,
      `Time: ${createdAt.toLocaleString("en-IN")}`,
    ].join("\n");
  }

  const twilioMessage = await client.messages.create(payload);
  return { sent: true, sid: twilioMessage.sid };
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = clean(body?.name, 120);
    const phone = clean(body?.phone, 30);
    const email = clean(body?.email, 160);
    const message = clean(body?.message, 4000);
    const createdAt = new Date();

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
      createdAt,
    });

    let whatsapp = { sent: false };
    try {
      whatsapp = await sendWhatsAppAlert({ name, phone, email, message, createdAt });
    } catch (error) {
      whatsapp = { sent: false, reason: error?.message || "Failed to send WhatsApp alert." };
    }

    return NextResponse.json(
      { success: true, id: result.insertedId.toString(), whatsapp },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit contact form." },
      { status: 500 }
    );
  }
}
