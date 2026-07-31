import { NextRequest } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (forwarded) {
    return forwarded;
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function applyRateLimit(request: NextRequest, options: { limit: number; windowMs: number }) {
  const ip = getClientIp(request);
  const key = `${request.nextUrl.pathname}:${ip}`;
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= options.limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function logSuspiciousRequest(details: Record<string, unknown>) {
  console.warn("[security] suspicious request", details);
}

export function getClientIpForLogs(request: NextRequest) {
  return getClientIp(request);
}
