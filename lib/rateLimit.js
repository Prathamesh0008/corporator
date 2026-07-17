const buckets = globalThis.__wardRateLimits || new Map();
globalThis.__wardRateLimits = buckets;

export function getClientIp(request) {
  return (request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
}

export function rateLimit(request, key, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const id = `${key}:${getClientIp(request)}`;
  const bucket = buckets.get(id);
  if (!bucket || bucket.resetAt <= now) { buckets.set(id, { count: 1, resetAt: now + windowMs }); return false; }
  bucket.count += 1;
  return bucket.count > limit;
}
