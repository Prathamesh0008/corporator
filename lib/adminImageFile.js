export function readAdminImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return reject(new Error("Select a JPG, PNG or WEBP image."));
    if (file.size > 5 * 1024 * 1024) return reject(new Error("Image must be 5 MB or smaller."));
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read the image. Please select it again."));
    reader.readAsDataURL(file);
  });
}
