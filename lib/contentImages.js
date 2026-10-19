import { randomBytes } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";

export function validateContentImage(dataUrl) {
  if (typeof dataUrl !== "string" || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=\r\n]+$/.test(dataUrl)) throw new Error("Select a JPG, PNG or WEBP image.");
  const encoded = dataUrl.slice(dataUrl.indexOf(",") + 1);
  if (Buffer.from(encoded, "base64").length > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");
}

export async function uploadContentImage(dataUrl, folder) {
  validateContentImage(dataUrl);
  const { CLOUDINARY_CLOUD_NAME: cloud_name, CLOUDINARY_API_KEY: api_key, CLOUDINARY_API_SECRET: api_secret } = process.env;
  if (!cloud_name || !api_key || !api_secret) throw new Error("Cloudinary credentials are not configured.");
  cloudinary.config({ cloud_name, api_key, api_secret });
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder, public_id: `${Date.now()}-${randomBytes(6).toString("hex")}`,
    resource_type: "image",
    transformation: [{ width: 2200, crop: "limit", quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url;
}
