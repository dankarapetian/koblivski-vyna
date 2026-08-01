import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASSWORD } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const password = request.nextUrl.searchParams.get("password")?.trim();

  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD.trim()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = createSupabaseServerClient();

  if (!client) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { data, error } = await client.from("orders").select("*").order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data || [] });
}
