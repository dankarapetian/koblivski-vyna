import { NextRequest } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitRequest = Pick<NextRequest, "headers"> & {
  nextUrl: { pathname: string };
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const MAX_RATE_LIMIT_KEYS = 5_000;

function getClientIp(request: RateLimitRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (forwarded) {
    return forwarded;
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function applyRateLimit(request: RateLimitRequest, options: { limit: number; windowMs: number }) {
  const ip = getClientIp(request);
  const key = `${request.nextUrl.pathname}:${ip}`;
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (rateLimitStore.size >= MAX_RATE_LIMIT_KEYS) {
    for (const [storedKey, entry] of rateLimitStore) {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(storedKey);
      }
    }

    if (rateLimitStore.size >= MAX_RATE_LIMIT_KEYS) {
      const oldestKey = rateLimitStore.keys().next().value;
      if (oldestKey) rateLimitStore.delete(oldestKey);
    }
  }

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

export function getClientIpForLogs(request: RateLimitRequest) {
  return getClientIp(request);
}

export function createSecurityHeaders() {
  const isDev = process.env.NODE_ENV === "development";

  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    {
      key: "Content-Security-Policy",
      value:
        "default-src 'self'; " +
        `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}; ` +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: blob:; " +
        "font-src 'self' data:; " +
        "connect-src 'self'; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "frame-ancestors 'none'; " +
        "upgrade-insecure-requests;",
    },
  ];
}

export function isSameOriginRequest(request: NextRequest, configuredOrigin: string) {
  const origin = request.headers.get("origin");

  if (!origin) return false;

  const allowedOrigins = new Set<string>([request.nextUrl.origin]);
  if (configuredOrigin) {
    try {
      allowedOrigins.add(new URL(configuredOrigin).origin);
    } catch {
      return false;
    }
  }

  return allowedOrigins.has(origin);
}
