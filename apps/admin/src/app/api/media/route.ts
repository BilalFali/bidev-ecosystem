import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getD1 } from "@/lib/d1";

export async function GET(_req: NextRequest) {
  const auth = await createClient();
  const { data: { user }, error } = await auth.auth.getUser();
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getD1("DB");
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const result = await db.from("media").select("*").order("created_at", { ascending: false });
  if (result.error) return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  return NextResponse.json({ files: result.data ?? [] });
}
