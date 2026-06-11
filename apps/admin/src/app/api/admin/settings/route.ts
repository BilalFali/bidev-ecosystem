import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/settings?keys=key1,key2
export async function GET(req: NextRequest) {
  const keys = req.nextUrl.searchParams.get("keys")?.split(",").filter(Boolean) ?? [];
  try {
    const supabase = await createClient();
    const { data } = await (supabase as any)
      .from("site_settings")
      .select("key, value")
      .in("key", keys.length ? keys : ["auto_approve_comments"]);

    const result: Record<string, string> = {};
    for (const row of data ?? []) result[row.key] = row.value;
    return NextResponse.json({ ok: true, settings: result });
  } catch {
    return NextResponse.json({ ok: false, settings: {} }, { status: 500 });
  }
}

// PATCH /api/admin/settings  body: { key: string, value: string }
export async function PATCH(req: NextRequest) {
  try {
    const { key, value } = await req.json() as { key: string; value: string };
    if (!key || value === undefined) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const supabase = await createClient();
    const { error } = await (supabase as any)
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
