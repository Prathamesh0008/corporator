import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "../../../../lib/adminContent";

export async function POST(request) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { folder } = await request.json();
    if (!["works", "news", "gallery", "site-content"].includes(folder))
      return NextResponse.json({ error: "Choose a valid image destination." }, { status: 400 });
    const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: secret } = process.env;
    if (!cloudName || !apiKey || !secret)
      return NextResponse.json({ error: "Image storage is not configured. Contact the site administrator." }, { status: 503 });
    const params = {
      timestamp: Math.floor(Date.now() / 1000), folder,
      public_id: `${Date.now()}-${randomBytes(12).toString("hex")}`,
      overwrite: false, allowed_formats: "jpg,jpeg,png,webp",
    };
    return NextResponse.json({ params, apiKey,
      signature: cloudinary.utils.api_sign_request(params, secret),
      uploadUrl: `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    }, { headers: { "Cache-Control": "no-store, private" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof SyntaxError ? "Invalid upload request." : "Could not authorize the image upload. Please retry." }, { status: error instanceof SyntaxError ? 400 : 500 });
  }
}
