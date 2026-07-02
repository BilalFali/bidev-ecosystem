import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { type, slug, title } = await req.json() as {
      type?: string;
      slug?: string;
      title?: string;
    };

    if (!type || !slug || typeof type !== "string" || typeof slug !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ ok: false }, { status: 503 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.rpc as any)("upsert_page_view", {
      p_type:  type,
      p_slug:  slug,
      p_title: title ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
