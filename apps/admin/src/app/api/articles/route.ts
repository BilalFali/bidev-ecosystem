import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  let query = supabase
    .from("articles_with_relations")
    .select("*")
    .order("updated_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { tag_ids, ...articleData } = body;

  const { data: article, error } = await supabase
    .from("articles")
    .insert({
      ...articleData,
      author_id:   user.id,
      category_id: articleData.category_id || null,
      cover_url:   articleData.cover_url   || null,
      cover_alt:   articleData.cover_alt   || null,
      excerpt:     articleData.excerpt     || null,
      seo_title:   articleData.seo_title   || null,
      seo_description: articleData.seo_description || null,
      troubleshooting_category_id: articleData.troubleshooting_category_id || null,
      difficulty:                  articleData.difficulty                  || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (tag_ids?.length) {
    await supabase.from("article_tags").insert(
      tag_ids.map((tag_id: string) => ({ article_id: article.id, tag_id }))
    );
  }

  return NextResponse.json(article, { status: 201 });
}
