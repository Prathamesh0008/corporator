import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { rateLimit } from "../../../../lib/rateLimit";

export async function POST(request) {
  if (rateLimit(request, "admin-login", 10, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  const configuredKey = process.env.ADMIN_DASHBOARD_KEY;
  if (!configuredKey) {
    return NextResponse.json(
      { error: "Admin login is not configured on the server." },
      { status: 500 }
    );
  }

  const requestKey = request.headers.get("x-admin-key") || "";
  const requestBuffer = Buffer.from(requestKey);
  const configuredBuffer = Buffer.from(configuredKey);
  const valid =
    requestBuffer.length === configuredBuffer.length &&
    timingSafeEqual(requestBuffer, configuredBuffer);

  if (!valid) {
    return NextResponse.json({ error: "Wrong admin key." }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
