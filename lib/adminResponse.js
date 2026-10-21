// Hosting platforms may return plain text or HTML instead of JSON.
export async function adminResponse(response) {
  const raw = await response.text();
  let data;
  try { data = JSON.parse(raw); } catch {
    if (response.status === 413) throw new Error("The server rejected an oversized request. Re-select the images to upload them directly to storage, then retry.");
    throw new Error(`The server returned an unexpected response (${response.status}). Please retry${response.status === 401 ? " after signing in again" : ""}.`);
  }
  if (!response.ok) throw new Error(data?.error?.message || data?.error || `Request failed (${response.status}). Please retry.`);
  if (!data || typeof data !== "object") throw new Error("The server returned an invalid response. Please retry.");
  return data;
}
