import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { applyRateLimit, getClientIpForLogs, logSuspiciousRequest } from "@/lib/security";

export async function POST(request: NextRequest) {
  const rateLimit = applyRateLimit(request, { limit: 5, windowMs: 60_000 });

  if (!rateLimit.allowed) {
    logSuspiciousRequest({
      path: request.nextUrl.pathname,
      ip: getClientIpForLogs(request),
      reason: "order_rate_limit_exceeded",
      retryAfter: rateLimit.retryAfter,
    });

    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }

  try {
    const payload = await request.json();
    const client = createSupabaseServerClient();

    if (!client) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    }

    const orderPayload = {
      id: typeof payload?.id === "string" ? payload.id : crypto.randomUUID(),
      customer_name: typeof payload?.customerName === "string" ? payload.customerName : null,
      customer_surname: typeof payload?.customerSurname === "string" ? payload.customerSurname : null,
      customer_phone: typeof payload?.customerPhone === "string" ? payload.customerPhone : null,
      delivery_type: typeof payload?.deliveryType === "string" ? payload.deliveryType : "pickup",
      region: typeof payload?.region === "string" ? payload.region : null,
      district: typeof payload?.district === "string" ? payload.district : null,
      city: typeof payload?.city === "string" ? payload.city : null,
      street: typeof payload?.street === "string" ? payload.street : null,
      warehouse: typeof payload?.warehouse === "string" ? payload.warehouse : null,
      notes: typeof payload?.notes === "string" ? payload.notes : null,
      total: typeof payload?.total === "number" ? payload.total : 0,
      items: Array.isArray(payload?.items) ? payload.items : [],
      message: typeof payload?.message === "string" ? payload.message : null,
      status: "new",
      created_at: new Date().toISOString(),
    };

    const { error } = await client.from("orders").insert(orderPayload);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, orderId: orderPayload.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logSuspiciousRequest({
      path: request.nextUrl.pathname,
      ip: getClientIpForLogs(request),
      reason: "order_insert_failed",
      message,
    });

    return NextResponse.json({ error: "Failed to store order." }, { status: 500 });
  }
}
