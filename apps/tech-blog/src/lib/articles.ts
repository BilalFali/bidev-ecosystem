import { getSupabaseClient } from "./supabase";

export interface TechArticle {
  id: string;
  title: string;
  slug: string;
  dek: string;
  content: string;
  excerpt: string;
  coverUrl?: string;
  coverAlt?: string;
  category?: string;
  categorySlug?: string;
  section?: string;
  sectionSlug?: string;
  contentType?: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
  breaking: boolean;
}

const ARTICLE_COLUMNS =
  "id,title,slug,dek,content,excerpt,cover_url,cover_alt,category_name,category_slug," +
  "section_name,section_slug,content_type,tags,reading_time,featured,breaking,created_at,updated_at,published_at";

type DbRow = {
  id: string;
  title: string;
  slug: string;
  dek: string | null;
  content: string;
  excerpt: string | null;
  cover_url: string | null;
  cover_alt: string | null;
  category_name: string | null;
  category_slug: string | null;
  section_name: string | null;
  section_slug: string | null;
  content_type: string | null;
  tags: { id: string; name: string; slug: string }[] | null;
  reading_time: number | null;
  featured: boolean | null;
  breaking: boolean | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

function dbRowToArticle(a: DbRow): TechArticle {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    dek: a.dek ?? "",
    content: a.content,
    excerpt: a.excerpt ?? a.dek ?? "",
    coverUrl: a.cover_url ?? undefined,
    coverAlt: a.cover_alt ?? undefined,
    category: a.category_name ?? undefined,
    categorySlug: a.category_slug ?? undefined,
    section: a.section_name ?? undefined,
    sectionSlug: a.section_slug ?? undefined,
    contentType: a.content_type ?? undefined,
    tags: (a.tags ?? []).map((t) => t.name),
    author: "BiDev Tech",
    publishedAt: a.published_at ?? a.created_at,
    updatedAt: a.updated_at,
    readingTime: a.reading_time ?? 4,
    featured: a.featured ?? false,
    breaking: a.breaking ?? false,
  };
}

// No fabricated placeholder articles — an empty result is the honest state
// until real stories are published via the admin.
export async function getAllArticles(): Promise<TechArticle[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("techblog_articles_with_relations")
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return (data as DbRow[]).map(dbRowToArticle);
}

export async function getArticleBySlug(slug: string): Promise<TechArticle | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("techblog_articles_with_relations")
    .select(ARTICLE_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) return null;
  return dbRowToArticle(data as DbRow);
}

export async function getArticlesByCategorySlug(categorySlug: string): Promise<TechArticle[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.categorySlug === categorySlug);
}

export async function getFeaturedArticles(limit = 6): Promise<TechArticle[]> {
  const all = await getAllArticles();
  const featured = all.filter((a) => a.featured);
  const rest = all.filter((a) => !a.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getBreakingArticle(): Promise<TechArticle | null> {
  const all = await getAllArticles();
  return all.find((a) => a.breaking) ?? null;
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const all = await getAllArticles();
  return all.map((a) => a.slug);
}
