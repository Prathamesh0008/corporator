import { NextResponse } from "next/server";
import { rateLimit } from "../../../lib/rateLimit";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const clean = (value, max = 1000) => String(value || "").trim().slice(0, max);

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "service_ai8xkcz";
const EMAILJS_CONTACT_TEMPLATE_ID = process.env.EMAILJS_CONTACT_TEMPLATE_ID || "template_0h513le";
const EMAILJS_AUTO_REPLY_TEMPLATE_ID = process.env.EMAILJS_AUTO_REPLY_TEMPLATE_ID || "template_qe8wgrq";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || "";

async function sendEmail(templateId, templateParams) {
  if (!EMAILJS_PUBLIC_KEY) throw new Error("EMAILJS_PUBLIC_KEY is not configured.");

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      ...(EMAILJS_PRIVATE_KEY ? { accessToken: EMAILJS_PRIVATE_KEY } : {}),
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `EmailJS request failed with status ${response.status}.`);
  }

  return { sent: true };
}

async function sendContactEmails({ name, phone, email, message, createdAt }) {
  const submittedAt = createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const templateParams = {
    name,
    from_name: name,
    phone,
    email: email || "Not provided",
    from_email: email || "Not provided",
    reply_to: email || "",
    message,
    submitted_at: submittedAt,
    time: submittedAt,
  };
  const deliveries = [["contact", sendEmail(EMAILJS_CONTACT_TEMPLATE_ID, templateParams)]];

  if (email) {
    deliveries.push([
      "autoReply",
      sendEmail(EMAILJS_AUTO_REPLY_TEMPLATE_ID, {
        ...templateParams,
        to_name: name,
        to_email: email,
      }),
    ]);
  }

  const settled = await Promise.allSettled(deliveries.map(([, delivery]) => delivery));
  return Object.fromEntries(
    deliveries.map(([key], index) => {
      const result = settled[index];
      return [key, result.status === "fulfilled"
        ? result.value
        : { sent: false, reason: result.reason?.message || "Failed to send email." }];
    })
  );
}

export async function POST(request) {
  try {
    if (
      process.env.NODE_ENV === "production" &&
      rateLimit(request, "contact-post", 5, 10 * 60_000)
    ) {
      return NextResponse.json({ error: "Too many messages. Please wait and try again." }, { status: 429 });
    }
    const body = await request.json();
    if (body?.website) return NextResponse.json({ success: true }, { status: 201 });

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

    const emailDelivery = await sendContactEmails({ name, phone, email, message, createdAt });

    if (!emailDelivery.contact?.sent) {
      throw new Error(emailDelivery.contact?.reason || "Contact email was not delivered.");
    }

    return NextResponse.json(
      {
        success: true,
        email: emailDelivery,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json(
      {
        error: "Failed to submit contact form.",
        ...(process.env.NODE_ENV === "development" && error?.message
          ? { details: error.message }
          : {}),
      },
      { status: 500 }
    );
  }
}
