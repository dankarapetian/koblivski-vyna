import { NextRequest, NextResponse } from "next/server";
import { getTelegramBotToken, getTelegramChatId, getTelegramBotUsername } from "@/lib/env";
import { applyRateLimit, getClientIpForLogs, logSuspiciousRequest } from "@/lib/security";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getCatalogProductById } from "@/lib/catalog";

function sanitizeText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/<[^>]*>/g, "").trim();
}

function isValidOrderPayload(payload: unknown): payload is {
  message: string;
  total?: number;
  items?: Array<{ id?: string; name: string; qty: number; price: number }>;
  customerName?: string;
  customerSurname?: string;
  customerPhone?: string;
  deliveryType?: string;
  region?: string;
  district?: string;
  city?: string;
  street?: string;
  warehouse?: string;
  notes?: string;
} {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Record<string, unknown>;
  const message = sanitizeText(candidate.message);
  const items = Array.isArray(candidate.items) ? candidate.items : [];
  const total = typeof candidate.total === "number" ? candidate.total : Number(candidate.total);
  const customerName = sanitizeText(candidate.customerName);
  const customerPhone = sanitizeText(candidate.customerPhone);
  const deliveryType = sanitizeText(candidate.deliveryType);
  const region = sanitizeText(candidate.region);
  const district = sanitizeText(candidate.district);
  const city = sanitizeText(candidate.city);
  const street = sanitizeText(candidate.street);
  const warehouse = sanitizeText(candidate.warehouse);

  if (!message || !Number.isFinite(total) || total <= 0) {
    return false;
  }

  if (!customerName || !customerPhone) {
    return false;
  }

  if (deliveryType === "nova-poshta") {
    const addressFields = [region, district, city, street, warehouse].filter(Boolean);
    if (addressFields.length < 4) {
      return false;
    }
  }

  if (!items.length) {
    return false;
  }

  return items.every((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const entry = item as Record<string, unknown>;
    return (
      typeof entry.name === "string" &&
      typeof entry.qty === "number" &&
      entry.qty > 0 &&
      typeof entry.price === "number" &&
      entry.price >= 0
    );
  });
}

function buildTelegramLink(username: string | undefined, message: string) {
  const normalizedUsername = username?.trim().replace(/^@/, "");

  if (!normalizedUsername) {
    return null;
  }

  const url = new URL(`https://t.me/${normalizedUsername}`);
  url.searchParams.set("text", message);
  return url.toString();
}

function buildOrderText(payload: {
  message: string;
  customerName?: string;
  customerSurname?: string;
  customerPhone?: string;
  deliveryType?: string;
  region?: string;
  district?: string;
  city?: string;
  street?: string;
  warehouse?: string;
  notes?: string;
  total?: number;
  items?: Array<{ name: string; qty: number; price: number }>;
}) {
  const lines = [
    "Нове замовлення з сайту Коблівські Вина",
    "",
    `Клієнт: ${payload.customerName || "не вказано"} ${payload.customerSurname || ""}`.trim(),
    `Телефон: ${payload.customerPhone || "не вказано"}`,
    "",
  ];

  if (payload.items?.length) {
    payload.items.forEach((item) => {
      const subtotal = item.price * item.qty;
      lines.push(`• ${item.name} × ${item.qty} — ${(subtotal / 100).toFixed(2).replace(".", ",")} грн`);
    });
  }

  lines.push("", `Загальна сума: ${((payload.total ?? 0) / 100).toFixed(2).replace(".", ",")} грн`, "");

  if (payload.deliveryType === "nova-poshta") {
    lines.push(
      "Доставка: Нова Пошта",
      payload.region ? `Область: ${payload.region}` : "Область: не вказано",
      payload.district ? `Район: ${payload.district}` : "Район: не вказано",
      payload.city ? `Місто: ${payload.city}` : "Місто: не вказано",
      payload.street ? `Вулиця: ${payload.street}` : "Вулиця: не вказано",
      payload.warehouse ? `Відділення: ${payload.warehouse}` : "Відділення: не вказано"
    );
  } else {
    lines.push("Доставка: Самовивіз");
  }

  lines.push("", "Оплата: переказ на картку", "Реквізити для переказу: уточнимо після оформлення замовлення.");

  if (payload.notes) {
    lines.push("", `Примітка: ${payload.notes}`);
  }

  lines.push("", "Будь ласка, зв’яжіться зі мною для підтвердження доставки.");

  return [...lines, "", payload.message].join("\n");
}

export async function POST(request: NextRequest) {
  const rateLimit = applyRateLimit(request, { limit: 5, windowMs: 60_000 });

  if (!rateLimit.allowed) {
    logSuspiciousRequest({
      path: request.nextUrl.pathname,
      ip: getClientIpForLogs(request),
      reason: "rate_limit_exceeded",
      retryAfter: rateLimit.retryAfter,
    });

    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }

  try {
    const payload = await request.json();

    if (!isValidOrderPayload(payload)) {
      return NextResponse.json({ error: "Некоректні дані замовлення." }, { status: 400 });
    }

    const botToken = getTelegramBotToken();
    const chatId = getTelegramChatId();
    const botUsername = getTelegramBotUsername();
    const trustedItems = (payload.items ?? []).map((item) => {
      const productId = typeof item.id === "string" && item.id.trim() ? item.id : item.name;
      const product = getCatalogProductById(productId);
      const unitPrice = product?.price ?? 0;
      return {
        id: product?.id ?? productId,
        name: product?.name ?? item.name,
        qty: item.qty,
        price: unitPrice,
      };
    });

    const trustedTotal = trustedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const normalizedPayload = {
      ...payload,
      total: trustedTotal,
      items: trustedItems,
      message: payload.message,
    };
    const orderText = buildOrderText(normalizedPayload);
    const client = createSupabaseServerClient();
    const orderId = crypto.randomUUID();

    if (client) {
      const { error } = await client.from("orders").insert({
        id: orderId,
        customer_name: normalizedPayload.customerName ?? null,
        customer_surname: normalizedPayload.customerSurname ?? null,
        customer_phone: normalizedPayload.customerPhone ?? null,
        delivery_type: normalizedPayload.deliveryType ?? "pickup",
        region: normalizedPayload.region ?? null,
        district: normalizedPayload.district ?? null,
        city: normalizedPayload.city ?? null,
        street: normalizedPayload.street ?? null,
        warehouse: normalizedPayload.warehouse ?? null,
        notes: normalizedPayload.notes ?? null,
        total: Number(normalizedPayload.total ?? 0),
        items: normalizedPayload.items ?? [],
        message: normalizedPayload.message ?? null,
        status: "new",
        created_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Supabase insert failed: ${error.message}`);
      }
    }

    if (!botToken || !chatId) {
      const telegramUrl = buildTelegramLink(botUsername, orderText);

      if (telegramUrl) {
        return NextResponse.json({ success: true, telegramUrl, fallback: true, orderId });
      }

      return NextResponse.json(
        {
          error: "Telegram-сповіщення не налаштовані. Додайте TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID і TELEGRAM_BOT_USERNAME.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: orderText,
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      return NextResponse.json(
        {
          error: data.description || "Не вдалося надіслати замовлення в Telegram.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    logSuspiciousRequest({
      path: request.nextUrl.pathname,
      ip: getClientIpForLogs(request),
      reason: "checkout_error",
      message,
    });

    return NextResponse.json(
      {
        error: "Не вдалося обробити замовлення.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
    },
  });
}
