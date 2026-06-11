import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

// ── GET /api/comments?slug=xxx ────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ comments: [] });

  const { data, error } = await (supabase as any)
    .from("comments")
    .select("id, author_name, content, created_at")
    .eq("article_slug", slug)
    .eq("approved", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("comments GET error:", error);
    return NextResponse.json({ comments: [] });
  }

  return NextResponse.json({ comments: data ?? [] }, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
  });
}

// ── POST /api/comments ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      slug?: string;
      author_name?: string;
      author_email?: string;
      content?: string;
    };

    const { slug, author_name, author_email, content } = body;

    if (!slug || !author_name?.trim() || !content?.trim()) {
      return NextResponse.json({ ok: false, error: "Name and comment are required." }, { status: 400 });
    }
    if (author_name.trim().length > 80) {
      return NextResponse.json({ ok: false, error: "Name too long." }, { status: 400 });
    }
    if (content.trim().length > 2000) {
      return NextResponse.json({ ok: false, error: "Comment too long (max 2000 chars)." }, { status: 400 });
    }
    if (author_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author_email)) {
      return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ ok: false, error: "Service unavailable." }, { status: 503 });

    // Read auto-approve setting (default true if table/key missing)
    const { data: settingRow } = await (supabase as any)
      .from("site_settings")
      .select("value")
      .eq("key", "auto_approve_comments")
      .single();
    const autoApprove = settingRow ? settingRow.value !== "false" : true;

    const { error } = await (supabase as any)
      .from("comments")
      .insert({
        article_slug: slug,
        author_name:  author_name.trim(),
        author_email: author_email?.trim() || null,
        content:      content.trim(),
        approved:     autoApprove,
      });

    if (error) {
      console.error("comments POST error:", error);
      return NextResponse.json({ ok: false, error: "Failed to save comment." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, approved: autoApprove });
  } catch {
    return NextResponse.json({ ok: false, error: "Unexpected error." }, { status: 500 });
  }
}
