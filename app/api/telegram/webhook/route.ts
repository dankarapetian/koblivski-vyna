import { NextRequest, NextResponse } from "next/server";
import { TELEGRAM_WEBHOOK_SECRET } from "@/lib/env";

export async function POST(request: NextRequest) {
  const expectedSecret = TELEGRAM_WEBHOOK_SECRET?.trim();
  const providedSecret = request.headers.get("x-telegram-bot-api-secret-token")?.trim();

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return new NextResponse("Bad Request", { status: 400 });
    }

    return NextResponse.json({ ok: true, received: true });
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Telegram webhook endpoint is ready" });
}
