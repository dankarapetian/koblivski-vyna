import { NextRequest, NextResponse } from "next/server";
import { getTelegramBotToken, getTelegramBotUsername, getTelegramChatId, SITE_ORIGIN } from "@/lib/env";
import {
  applyRateLimit,
  getClientIpForLogs,
  isSameOriginRequest,
  logSuspiciousRequest,
} from "@/lib/security";
import { getCatalogProductById } from "@/lib/catalog";

const MAX_BODY_BYTES = 20_000;
const MAX_ITEMS = 30;
const MAX_QTY = 20;

type OrderPayload = {
  requestId: string;
  startedAt: number;
  website?: string;
  items: Array<{ id: string; qty: number }>;
  customerName: string;
  customerSurname?: string;
  customerPhone: string;
  ageConfirmed: true;
  deliveryType: "nova-poshta" | "pickup";
  region?: string;
  district?: string;
  city?: string;
  street?: string;
  warehouse?: string;
  notes?: string;
};

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizePayload(value: unknown): OrderPayload | null {
  if (!value || typeof value !== "object") return null;

  const payload = value as Record<string, unknown>;
  const requestId = cleanText(payload.requestId, 80);
  const customerName = cleanText(payload.customerName, 80);
  const customerSurname = cleanText(payload.customerSurname, 80);
  const customerPhone = cleanText(payload.customerPhone, 30);
  const ageConfirmed = payload.ageConfirmed;
  const deliveryType = payload.deliveryType;
  const region = cleanText(payload.region, 100);
  const district = cleanText(payload.district, 100);
  const city = cleanText(payload.city, 100);
  const street = cleanText(payload.street, 160);
  const warehouse = cleanText(payload.warehouse, 120);
  const notes = cleanText(payload.notes, 500);
  const website = cleanText(payload.website, 200);
  const startedAt = typeof payload.startedAt === "number" ? payload.startedAt : 0;
  const items = Array.isArray(payload.items) ? payload.items : [];
  const phoneDigits = customerPhone.replace(/\D/g, "");
  const formAge = Date.now() - startedAt;

  if (!/^[0-9a-f-]{36}$/i.test(requestId)) return null;
  if (!customerName || phoneDigits.length < 10 || phoneDigits.length > 15) return null;
  if (ageConfirmed !== true) return null;
  if (deliveryType !== "nova-poshta" && deliveryType !== "pickup") return null;
  if (!Number.isFinite(startedAt) || formAge < 2_000 || formAge > 7_200_000) return null;
  if (website || items.length < 1 || items.length > MAX_ITEMS) return null;
  if (deliveryType === "nova-poshta" && (!region || !city || !warehouse)) return null;

  const normalizedItems: Array<{ id: string; qty: number }> = [];
  const seenIds = new Set<string>();

  for (const item of items) {
    if (!item || typeof item !== "object") return null;
    const entry = item as Record<string, unknown>;
    const id = typeof entry.id === "string" ? entry.id.slice(0, 120) : "";
    const qty = entry.qty;

    if (!id || seenIds.has(id) || !Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > MAX_QTY) {
      return null;
    }
    if (!getCatalogProductById(id)) return null;

    seenIds.add(id);
    normalizedItems.push({ id, qty: qty as number });
  }

  return {
    requestId,
    startedAt,
    website,
    items: normalizedItems,
    customerName,
    customerSurname,
    customerPhone,
    ageConfirmed,
    deliveryType,
    region,
    district,
    city,
    street,
    warehouse,
    notes,
  };
}

function buildTelegramLink(username: string, message: string) {
  const normalizedUsername = username.trim().replace(/^@/, "");
  if (!/^[A-Za-z0-9_]{5,32}$/.test(normalizedUsername)) return null;

  const url = new URL(`https://t.me/${normalizedUsername}`);
  url.searchParams.set("text", message);
  return url.toString();
}

function buildOrderText(payload: OrderPayload) {
  const trustedItems = payload.items.map(({ id, qty }) => {
    const product = getCatalogProductById(id)!;
    return { name: product.name, qty, price: product.price };
  });
  const total = trustedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const lines = [
    "Нове замовлення з сайту Коблівські Вина",
    `Номер: ${payload.requestId}`,
    "",
    `Клієнт: ${payload.customerName}${payload.customerSurname ? ` ${payload.customerSurname}` : ""}`,
    `Телефон: ${payload.customerPhone}`,
    "Вік: покупець підтвердив 18+",
    "",
    ...trustedItems.map(
      (item) => `• ${item.name} × ${item.qty} — ${((item.price * item.qty) / 100).toFixed(2).replace(".", ",")} грн`
    ),
    "",
    `Загальна сума: ${(total / 100).toFixed(2).replace(".", ",")} грн`,
    "",
  ];

  if (payload.deliveryType === "nova-poshta") {
    lines.push(
      "Доставка: Нова Пошта",
      `Область: ${payload.region}`,
      payload.district ? `Район: ${payload.district}` : "",
      `Місто: ${payload.city}`,
      payload.street ? `Вулиця: ${payload.street}` : "",
      `Відділення: ${payload.warehouse}`
    );
  } else {
    lines.push("Доставка: Самовивіз");
  }

  if (payload.notes) lines.push("", `Примітка: ${payload.notes}`);
  lines.push("", "Будь ласка, зв’яжіться зі мною для підтвердження замовлення.");
  return lines.filter(Boolean).join("\n");
}

function json(body: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: NextRequest) {
  const rateLimit = applyRateLimit(request, { limit: 4, windowMs: 10 * 60_000 });

  if (!rateLimit.allowed) {
    return json({ error: "Забагато спроб. Спробуйте пізніше." }, 429, {
      "Retry-After": String(rateLimit.retryAfter),
    });
  }

  if (!isSameOriginRequest(request, SITE_ORIGIN)) {
    logSuspiciousRequest({ path: request.nextUrl.pathname, ip: getClientIpForLogs(request), reason: "invalid_origin" });
    return json({ error: "Запит відхилено." }, 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
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
    if (!payload) return json({ error: "Некоректні дані замовлення." }, 400);

    const orderText = buildOrderText(payload);
    const botToken = getTelegramBotToken();
    const chatId = getTelegramChatId();
    const botUsername = getTelegramBotUsername();

    if (!botToken || !chatId) {
      const telegramUrl = buildTelegramLink(botUsername, orderText);
      if (telegramUrl) return json({ success: true, telegramUrl, fallback: true, orderId: payload.requestId });
      return json({ error: "Сервіс замовлень тимчасово недоступний." }, 503);
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: orderText, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    const telegramData = (await telegramResponse.json().catch(() => null)) as { ok?: boolean } | null;

    if (!telegramResponse.ok || !telegramData?.ok) {
      return json({ error: "Не вдалося надіслати замовлення. Спробуйте ще раз." }, 502);
    }

    return json({ success: true, orderId: payload.requestId });
  } catch (error) {
    logSuspiciousRequest({
      path: request.nextUrl.pathname,
      ip: getClientIpForLogs(request),
      reason: "checkout_error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return json({ error: "Не вдалося обробити замовлення." }, 400);
  }
}

export function GET() {
  return json({ error: "Method not allowed" }, 405, { Allow: "POST" });
}
