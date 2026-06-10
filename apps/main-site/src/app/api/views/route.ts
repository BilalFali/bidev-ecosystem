import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json() as { slug?: string };
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

    // Atomic increment — only counts articles that exist in the DB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.rpc as any)("increment_article_views", { article_slug: slug });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
