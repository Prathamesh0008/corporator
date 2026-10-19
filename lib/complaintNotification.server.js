import { Resend } from "resend";
import {
  escapeEmailHtml,
  resendConfiguration,
} from "./contactNotification.server.js";

export function complaintEmailTemplate(complaint) {
  const fields = [
    ["Complaint ID", complaint.complaintId],
    ["Category", complaint.complaintType],
    ["Area / location", complaint.location],
    [
      "Submitted (IST)",
      new Date(complaint.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "long",
      }),
    ],
    ["Initial status", "Under Review"],
    ["Issue description", complaint.description.slice(0, 600)],
  ];
  // Canonical public origin already used by layout metadata; never trust request Host headers.
  const adminPath =
    "https://www.sachinlavatenagarsevak.com/ward-control/complaints";
  return {
    subject: `New Citizen Complaint — ${complaint.complaintId}`,
    text: `New citizen complaint\n\n${fields.map(([label, value]) => `${label}: ${value}`).join("\n\n")}\n\nOpen the authenticated website dashboard: ${adminPath}\nFull private details and attachments are available only in the admin dashboard.`,
    html: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#202020"><main style="max-width:640px;margin:auto;padding:24px"><h1 style="font-size:22px">New Citizen Complaint</h1>${fields.map(([label, value]) => `<p><strong>${label}</strong><br>${escapeEmailHtml(value)}</p>`).join("")}<p>Open the authenticated website dashboard: <a href="${adminPath}">${adminPath}</a></p><p>Full private details and attachments are available only in the admin dashboard.</p></main></body></html>`,
  };
}

export async function notifyStoredComplaint(db, complaint) {
  const collection = db.collection("complaints");
  // A complaint gets one attempt. Even known failures are not retried by registration replays.
  const claim = await collection.updateOne(
    { _id: complaint._id, "notification.status": "pending" },
    {
      $set: {
        "notification.status": "sending",
        "notification.attemptedAt": new Date(),
      },
    },
  );
  if (!claim.matchedCount) return;
  let notification;
  try {
    const config = resendConfiguration();
    if (config.error) {
      notification = {
        provider: "resend",
        status: "not_configured",
        code: config.error,
      };
    } else {
      const resend = new Resend(config.key);
      resend.logError = () => {};
      const { data, error } = await resend.emails.send(
        {
          from: config.from,
          to: [config.to],
          ...complaintEmailTemplate(complaint),
        },
        {
          idempotencyKey: `complaint-office/${complaint.complaintId}`,
          signal: AbortSignal.timeout(10000),
        },
      );
      if (!error && data?.id) {
        notification = {
          provider: "resend",
          status: "sent",
          providerId: String(data.id).slice(0, 200),
        };
      } else {
        const rejected =
          Number.isInteger(error?.statusCode) &&
          error.statusCode >= 400 &&
          error.statusCode < 500;
        notification = {
          provider: "resend",
          status: rejected ? "failed" : "unknown",
          code: rejected ? "PROVIDER_REJECTED" : "PROVIDER_RESULT_UNKNOWN",
        };
      }
    }
  } catch {
    notification = {
      provider: "resend",
      status: "unknown",
      code: "PROVIDER_RESULT_UNKNOWN",
    };
  }
  notification.attemptedAt = new Date();
  try {
    await collection.updateOne(
      { _id: complaint._id },
      { $set: { notification } },
    );
  } catch {
    // Leave the sending claim closed; ambiguous outcomes must not cause another send.
    console.error("[complaint-notification] NOTIFICATION_RESULT_SAVE_FAILED");
  }
}
