import { NextResponse } from "next/server";


type NovaPoshtaPayload = {
  apiKey: string;
  modelName: string;
  calledMethod: string;
  methodProperties: Record<string, string>;
};

const NOVA_POSHTA_API_URL = "https://api.novaposhta.ua/v2.0/json/";

async function callNovaPoshta(payload: NovaPoshtaPayload) {
  const response = await fetch(NOVA_POSHTA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return response.json();
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    action?: string;
    areaRef?: string;
    cityRef?: string;
  };

  const action = body.action ?? "areas";
  const apiKey = process.env.NOVA_POSHTA_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json({ success: false, error: "missing_api_key", data: [] });
  }

  try {
    const payload: NovaPoshtaPayload = {
      apiKey,
      modelName: "Address",
      calledMethod: "getAreas",
      methodProperties: {},
    };

    if (action === "cities") {
      payload.calledMethod = "getCities";
      payload.methodProperties = { AreaRef: body.areaRef ?? "" };
    }

    if (action === "warehouses") {
      payload.calledMethod = "getWarehouses";
      payload.methodProperties = { CityRef: body.cityRef ?? "" };
    }

    const result = await callNovaPoshta(payload);

    if (result?.success) {
      return NextResponse.json({ success: true, data: result.data ?? [] });
    }

    return NextResponse.json({ success: false, error: "api_error", data: [] });
  } catch {
    return NextResponse.json({ success: false, error: "request_failed", data: [] });
  }
}
