import { getAllPosts, getPostBySlug } from "./mdx";
import { getSupabaseClient } from "./supabase";
import type { Post } from "@bidev/shared";

export type Article = Post & { source: "mdx" | "db" };

type DbRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  reading_time: number | null;
  tags: { id: string; name: string; slug: string }[] | null;
};

function dbRowToArticle(a: DbRow): Article {
  const rawTags = a.tags ?? [];
  const tags = rawTags.map((t) => t.name);

  return {
    slug:        a.slug,
    title:       a.title,
    summary:     a.excerpt ?? "",
    publishedAt: a.published_at ?? a.created_at,
    updatedAt:   a.updated_at,
    image:       a.cover_url ?? undefined,
    tags,
    author:      "Bilal Fali",
    readingTime: a.reading_time ?? 5,
    draft:       false,
    content:     a.content,
    source:      "db",
  };
}

export async function getAllArticles(): Promise<Article[]> {
  const mdxPosts: Article[] = getAllPosts().map((p) => ({ ...p, source: "mdx" as const }));

  const supabase = getSupabaseClient();
  if (!supabase) return mdxPosts;

  const { data, error } = await supabase
    .from("articles_with_relations")
    .select("id,title,slug,content,excerpt,cover_url,status,published_at,created_at,updated_at,reading_time,tags")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return mdxPosts;

  const dbArticles = (data as DbRow[]).map(dbRowToArticle);

  // DB version wins if both sources have the same slug
  const dbSlugs = new Set(dbArticles.map((a) => a.slug));
  const filteredMdx = mdxPosts.filter((p) => !dbSlugs.has(p.slug));

  return [...filteredMdx, ...dbArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = getSupabaseClient();

  // Try DB first (has the uploaded cover)
  if (supabase) {
    const { data } = await supabase
      .from("articles_with_relations")
      .select("id,title,slug,content,excerpt,cover_url,status,published_at,created_at,updated_at,reading_time,tags")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (data) return dbRowToArticle(data as DbRow);
  }

  // Fall back to MDX
  const mdx = getPostBySlug(slug);
  if (mdx) return { ...mdx, source: "mdx" };

  return null;
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const mdxSlugs = getAllPosts().map((p) => p.slug);

  const supabase = getSupabaseClient();
  if (!supabase) return mdxSlugs;

  const { data } = await supabase
    .from("articles")
    .select("slug")
    .eq("status", "published");

  const dbSlugs = (data ?? []).map((r: { slug: string }) => r.slug);

  return [...new Set([...mdxSlugs, ...dbSlugs])];
}
