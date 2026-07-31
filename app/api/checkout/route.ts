import { NextRequest, NextResponse } from "next/server";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_USERNAME, TELEGRAM_CHAT_ID } from "@/lib/env";
import { applyRateLimit, getClientIpForLogs, logSuspiciousRequest } from "@/lib/security";

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
      lines.push(`• ${item.name} × ${item.qty} — ${item.price * item.qty} грн`);
    });
  }

  lines.push("", `Загальна сума: ${payload.total ?? 0} грн`, "");

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
    const botToken = TELEGRAM_BOT_TOKEN?.trim();
    const chatId = TELEGRAM_CHAT_ID?.trim();
    const botUsername = TELEGRAM_BOT_USERNAME?.trim();
    const orderText = buildOrderText(payload);

    if (!botToken || !chatId) {
      const telegramUrl = buildTelegramLink(botUsername, orderText);

      if (telegramUrl) {
        return NextResponse.json({ success: true, telegramUrl, fallback: true });
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

    return NextResponse.json({ success: true });
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
