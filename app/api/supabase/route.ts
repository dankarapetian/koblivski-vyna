import { NextResponse } from "next/server";
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from "@/lib/env";

export async function GET() {
  const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceRoleKey = SUPABASE_SERVICE_ROLE_KEY?.trim();

  const hasUrl = Boolean(supabaseUrl);
  const hasAnonKey = Boolean(anonKey);
  const hasServiceRoleKey = Boolean(serviceRoleKey);
  const configured = hasUrl && hasAnonKey && hasServiceRoleKey;

  return NextResponse.json({
    ok: configured,
    configured,
    hasUrl,
    hasAnonKey,
    hasServiceRoleKey,
    projectName: supabaseUrl ? supabaseUrl.replace(/https?:\/\//, "").split(".")[0] : null,
  });
}
