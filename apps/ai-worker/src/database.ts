import { createClient } from "@supabase/supabase-js";
import type { GeneratedArticle } from "./types.js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var is missing");
  return createClient(url, key, { auth: { persistSession: false } });
}

async function resolveTagIds(supabase: ReturnType<typeof createClient>, tagNames: string[]): Promise<string[]> {
  const ids: string[] = [];

  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    if (!slug) continue;

    // upsert so duplicate runs are idempotent
    const { data, error } = await (supabase as any)
      .from("tags")
      .upsert({ name, slug }, { onConflict: "slug", ignoreDuplicates: false })
      .select("id")
      .single();

    if (!error && data?.id) ids.push(data.id as string);
  }

  return ids;
}

export async function slugExists(slug: string): Promise<boolean> {
  const supabase = getSupabase();
  const { count } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("slug", slug);
  return (count ?? 0) > 0;
}

export async function saveDraft(article: GeneratedArticle): Promise<string> {
  const supabase   = getSupabase();
  const authorId   = process.env.ADMIN_USER_ID;
  if (!authorId) throw new Error("ADMIN_USER_ID env var is missing");

  const tagIds = await resolveTagIds(supabase, article.suggested_tags);

  const { data: saved, error } = await supabase
    .from("articles")
    .insert({
      title:           article.title,
      slug:            article.slug,
      content:         article.content,
      excerpt:         article.excerpt,
      status:          "draft",
      author_id:       authorId,
      seo_title:       article.seo_title,
      seo_description: article.seo_description,
      seo_keywords:    article.seo_keywords,
      reading_time:    article.reading_time,
      featured:        false,
    })
    .select("id")
    .single();

  if (error || !saved) throw new Error(`DB insert failed: ${error?.message ?? "no data returned"}`);

  if (tagIds.length) {
    await supabase.from("article_tags").insert(
      tagIds.map((tag_id) => ({ article_id: saved.id, tag_id })),
    );
  }

  return saved.id as string;
}
