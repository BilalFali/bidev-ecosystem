import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Ctx { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase
    .from("articles_with_relations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { tag_ids, ...articleData } = body;

  const { data: article, error } = await supabase
    .from("articles")
    .update({
      ...articleData,
      category_id:     articleData.category_id     || null,
      cover_url:       articleData.cover_url       || null,
      cover_alt:       articleData.cover_alt       || null,
      excerpt:         articleData.excerpt         || null,
      seo_title:       articleData.seo_title       || null,
      seo_description: articleData.seo_description || null,
      troubleshooting_category_id: articleData.troubleshooting_category_id || null,
      difficulty:                  articleData.difficulty                  || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Replace tags
  await supabase.from("article_tags").delete().eq("article_id", id);
  if (tag_ids?.length) {
    await supabase.from("article_tags").insert(
      tag_ids.map((tag_id: string) => ({ article_id: id, tag_id }))
    );
  }

  return NextResponse.json(article);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
