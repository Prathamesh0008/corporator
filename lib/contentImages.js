import { randomBytes } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";

export function validateContentImage(dataUrl) {
  if (isStorageImage(dataUrl)) return;
  if (typeof dataUrl !== "string" || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=\r\n]+$/.test(dataUrl)) throw new Error("Select a JPG, PNG or WEBP image.");
}

export function isStorageImage(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" &&
      !url.username && !url.password && !url.port &&
      url.pathname.startsWith(`/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`) &&
      /\.(jpe?g|png|webp)$/i.test(url.pathname);
  } catch { return false; }
}

export async function uploadContentImage(dataUrl, folder) {
  validateContentImage(dataUrl);
  if (isStorageImage(dataUrl)) return dataUrl;
  const { CLOUDINARY_CLOUD_NAME: cloud_name, CLOUDINARY_API_KEY: api_key, CLOUDINARY_API_SECRET: api_secret } = process.env;
  if (!cloud_name || !api_key || !api_secret) throw new Error("Cloudinary credentials are not configured.");
  cloudinary.config({ cloud_name, api_key, api_secret });
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder, public_id: `${Date.now()}-${randomBytes(6).toString("hex")}`,
    resource_type: "image",
  });
  return result.secure_url.replace("/image/upload/", "/image/upload/f_auto,q_auto:best/");
}
