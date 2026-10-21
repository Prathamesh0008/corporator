import { adminResponse } from "./adminResponse";

// Transport chunk size, never a limit on the selected file.
const CHUNK_BYTES = 8 * 1024 * 1024;

function uploadChunk(url, form, headers, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = 180000;
    for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onerror = () => reject(new Error("Storage could not be reached. Check your connection and retry the upload."));
    xhr.ontimeout = () => reject(new Error("The image upload timed out. Please retry on a stable connection."));
    xhr.onabort = () => reject(new Error("Image upload was cancelled. Please select the image again."));
    xhr.onload = async () => {
      try {
        if (xhr.status === 413) throw new Error("Image storage rejected this upload because of its supported account limits. Contact the site administrator to check the storage plan.");
        resolve(await adminResponse(new Response(xhr.responseText, { status: xhr.status })));
      }
      catch (error) { reject(error); }
    };
    xhr.send(form);
  });
}

export async function readAdminImage(file, { adminKey, folder, onProgress = () => {} } = {}) {
  const extension = file?.name?.split(".").pop()?.toLowerCase();
  if (!file || !["jpg", "jpeg", "png", "webp"].includes(extension) ||
      (file.type && !["image/jpeg", "image/png", "image/webp"].includes(file.type)))
    throw new Error("Select a JPG, JPEG, PNG or WEBP image.");
  if (!file.size) throw new Error("The selected image is empty. Select another file.");
  onProgress(0);
  const signed = await adminResponse(await fetch("/api/admin/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
    body: JSON.stringify({ folder }),
  }));
  const uploadId = crypto.randomUUID();
  let result;
  for (let start = 0; start < file.size; start += CHUNK_BYTES) {
    const end = Math.min(start + CHUNK_BYTES, file.size);
    const form = new FormData();
    for (const [key, value] of Object.entries(signed.params)) form.append(key, String(value));
    form.append("api_key", signed.apiKey);
    form.append("signature", signed.signature);
    form.append("file", file.slice(start, end, file.type), file.name);
    result = await uploadChunk(signed.uploadUrl, form, {
      "X-Unique-Upload-Id": uploadId,
      "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
    }, (fraction) => onProgress(Math.min(99, Math.floor(100 * (start + fraction * (end - start)) / file.size))));
  }
  if (!result?.secure_url || result.done === false) throw new Error("Storage did not confirm the completed upload. Please retry.");
  onProgress(100);
  // Optimize delivery, preserving the full-resolution original in storage.
  return result.secure_url.replace("/image/upload/", "/image/upload/f_auto,q_auto:best/");
}
