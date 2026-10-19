import { Resend } from "resend";

const SUBJECT = "New Website Enquiry — Sachin Lavate Office";
export const notificationUnavailable =
  "Email notification unavailable. The office message was saved.";

export function validContactEmail(value) {
  if (
    typeof value !== "string" ||
    value.length > 254 ||
    /[\s<>(),;:"\\\x00-\x1f\x7f]/.test(value)
  )
    return false;
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return Boolean(
    local &&
      local.length <= 64 &&
      !local.startsWith(".") &&
      !local.endsWith(".") &&
      !local.includes("..") &&
      domain &&
      /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain),
  );
}

export function resendConfiguration() {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.RESEND_TO_EMAIL?.trim();
  if (!key) return { error: "MISSING_RESEND_API_KEY" };
  if (/[\s\x00-\x1f\x7f]/.test(key)) return { error: "INVALID_RESEND_API_KEY" };
  if (!from) return { error: "MISSING_RESEND_FROM_EMAIL" };
  const named = from.match(/^([^<>\x00-\x1f\x7f]+)<([^<>]+)>$/);
  if (!validContactEmail(named ? named[2].trim() : from))
    return { error: "INVALID_RESEND_FROM_EMAIL" };
  if (!to) return { error: "MISSING_RESEND_TO_EMAIL" };
  if (!validContactEmail(to)) return { error: "INVALID_RESEND_TO_EMAIL" };
  return { key, from, to };
}

export const escapeEmailHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );

export function contactEmailTemplate(message) {
  const submitted = new Date(message.createdAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "long",
  });
  const fields = [
    ["Citizen name", message.name],
    ["Mobile number", message.phone],
    ["Email address", message.email || "Not supplied"],
    ["Submission date/time", submitted],
    ["Website source", "Website contact form (/contact)"],
  ];
  return {
    subject: SUBJECT,
    text: `${SUBJECT}\n\nWebsite contact enquiry — not a civic complaint.\n\n${fields.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nMessage:\n${message.message}`,
    html: `<!doctype html><html><body style="margin:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#202020"><main style="max-width:640px;margin:24px auto;padding:28px;background:#ffffff"><h1 style="font-size:22px;margin:0 0 12px">New Website Enquiry</h1><p>Sachin Lavate Office</p><p><strong>Website contact enquiry — not a civic complaint.</strong></p><table style="width:100%;border-collapse:collapse">${fields.map(([label, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:10px 8px 10px 0;border-bottom:1px solid #dddddd">${label}</th><td style="padding:10px 0;border-bottom:1px solid #dddddd;overflow-wrap:anywhere">${escapeEmailHtml(value)}</td></tr>`).join("")}</table><h2 style="font-size:17px;margin-top:24px">Message</h2><p style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeEmailHtml(message.message)}</p></main></body></html>`,
  };
}

function diagnostic(code) {
  // Fixed codes only: never log provider messages, credentials or citizen content.
  console.error(
    "[contact-notification] " + JSON.stringify({ provider: "resend", code }),
  );
}

function publicResult(notification) {
  return notification?.status === "sent"
    ? { sent: true }
    : { sent: false, reason: notificationUnavailable };
}

export async function notifyStoredContact(db, message) {
  const collection = db.collection("contact_messages");
  // Only a persisted message can be notified; an atomic claim prevents concurrent sends.
  const claimed = await collection.updateOne(
    {
      _id: message._id,
      "notification.status": { $in: ["pending", "failed", "not_configured"] },
    },
    {
      $set: {
        "notification.status": "sending",
        "notification.attemptedAt": new Date(),
      },
    },
  );
  if (!claimed.matchedCount)
    return publicResult(
      (await collection.findOne({ _id: message._id }))?.notification,
    );
  let notification;
  try {
    const config = resendConfiguration();
    if (config.error) {
      diagnostic(config.error);
      notification = {
        provider: "resend",
        status: "not_configured",
        code: config.error,
      };
    } else {
      const resend = new Resend(config.key);
      // The SDK logs raw provider errors in development; use our fixed-code diagnostics instead.
      resend.logError = () => {};
      const { data, error } = await resend.emails.send(
        {
          from: config.from,
          to: [config.to],
          ...contactEmailTemplate(message),
          ...(message.email && validContactEmail(message.email)
            ? { replyTo: message.email }
            : {}),
        },
        {
          idempotencyKey: `contact-office/${message._id.toString()}`,
          signal: AbortSignal.timeout(10000),
        },
      );
      if (error || !data?.id) {
        // An HTTP rejection is a known failure; a network/application ambiguity must not be auto-resent.
        const knownRejection =
          Number.isInteger(error?.statusCode) &&
          error.statusCode >= 400 &&
          error.statusCode < 500;
        const code = knownRejection
          ? "PROVIDER_REJECTED"
          : "PROVIDER_RESULT_UNKNOWN";
        diagnostic(code);
        notification = {
          provider: "resend",
          status: knownRejection ? "failed" : "unknown",
          code,
        };
      } else
        notification = {
          provider: "resend",
          status: "sent",
          providerId: String(data.id).slice(0, 200),
        };
    }
  } catch {
    diagnostic("PROVIDER_RESULT_UNKNOWN");
    notification = {
      provider: "resend",
      status: "unknown",
      code: "PROVIDER_RESULT_UNKNOWN",
    };
  }
  notification.attemptedAt = new Date();
  try {
    await collection.updateOne(
      { _id: message._id },
      { $set: { notification } },
    );
  } catch {
    // Submission is durable. Leave the claim closed if outcome persistence fails to avoid duplicates.
    diagnostic("NOTIFICATION_RESULT_SAVE_FAILED");
  }
  return publicResult(notification);
}
