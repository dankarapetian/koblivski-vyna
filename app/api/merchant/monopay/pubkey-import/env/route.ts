import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Інтеграція Monobank вимкнена. Замовлення оформлюються через Telegram.",
    },
    { status: 410 }
  );
}
