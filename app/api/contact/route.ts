import { NextRequest, NextResponse } from "next/server";
import { getTelegramBotToken, getTelegramChatId, SITE_ORIGIN } from "@/lib/env";
import {
  applyRateLimit,
  getClientIpForLogs,
  isSameOriginRequest,
  logSuspiciousRequest,
} from "@/lib/security";

const MAX_BODY_BYTES = 8_000;
const CONTACT_FIELDS = new Set(["requestId", "startedAt", "website", "name", "phone", "message"]);

type ContactPayload = {
  requestId: string;
  startedAt: number;
  name: string;
  phone: string;
  message: string;
};

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizePayload(value: unknown): ContactPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const input = value as Record<string, unknown>;
  if (Object.keys(input).some((key) => !CONTACT_FIELDS.has(key))) return null;
  if (typeof input.requestId !== "string" || input.requestId.length > 80) return null;
  if (typeof input.name !== "string" || input.name.length > 80) return null;
  if (typeof input.phone !== "string" || input.phone.length > 30) return null;
  if (typeof input.message !== "string" || input.message.length > 1000) return null;
  if (input.website !== undefined && (typeof input.website !== "string" || input.website.length > 200)) return null;

  const requestId = cleanText(input.requestId, 80);
  const name = cleanText(input.name, 80);
  const phone = cleanText(input.phone, 30);
  const message = cleanText(input.message, 1000);
  const website = cleanText(input.website, 200);
  const startedAt = typeof input.startedAt === "number" ? input.startedAt : 0;
  const formAge = Date.now() - startedAt;
  const phoneDigits = phone.replace(/\D/g, "");

  if (!/^[0-9a-f-]{36}$/i.test(requestId)) return null;
  if (!name || phoneDigits.length < 10 || phoneDigits.length > 15) return null;
  if (message.length < 5 || website) return null;
  if (!Number.isFinite(startedAt) || formAge < 2_000 || formAge > 7_200_000) return null;

  return { requestId, startedAt, name, phone, message };
}

function json(body: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: NextRequest) {
  const rateLimit = applyRateLimit(request, { limit: 3, windowMs: 10 * 60_000 });

  if (!rateLimit.allowed) {
    return json({ error: "Забагато звернень. Спробуйте пізніше." }, 429, {
      "Retry-After": String(rateLimit.retryAfter),
    });
  }

  if (!isSameOriginRequest(request, SITE_ORIGIN)) {
    logSuspiciousRequest({ path: request.nextUrl.pathname, ip: getClientIpForLogs(request), reason: "invalid_origin" });
    return json({ error: "Запит відхилено." }, 403);
  }

  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    return json({ error: "Потрібен JSON-запит." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return json({ error: "Запит завеликий." }, 413);
  }

  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ error: "Запит завеликий." }, 413);
    }

    const payload = normalizePayload(JSON.parse(rawBody));
    if (!payload) return json({ error: "Перевірте введені дані." }, 400);

    const botToken = getTelegramBotToken();
    const chatId = getTelegramChatId();
    if (!botToken || !chatId) return json({ error: "Форма тимчасово недоступна." }, 503);

    const text = [
      "Нове звернення з контактної форми",
      `Номер: ${payload.requestId}`,
      "",
      `Ім’я: ${payload.name}`,
      `Телефон: ${payload.phone}`,
      "",
      `Повідомлення: ${payload.message}`,
    ].join("\n");

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    const telegramData = (await telegramResponse.json().catch(() => null)) as { ok?: boolean } | null;

    if (!telegramResponse.ok || !telegramData?.ok) {
      return json({ error: "Не вдалося надіслати повідомлення. Спробуйте ще раз." }, 502);
    }

    return json({ success: true });
  } catch (error) {
    logSuspiciousRequest({
      path: request.nextUrl.pathname,
      ip: getClientIpForLogs(request),
      reason: "contact_error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return json({ error: "Не вдалося обробити повідомлення." }, 400);
  }
}

function methodNotAllowed() {
  return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
}

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
