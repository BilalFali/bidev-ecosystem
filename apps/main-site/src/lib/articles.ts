import { getAllPosts, getPostBySlug } from "./mdx";
import { getSupabaseClient } from "./supabase";
import type { Post } from "@bidev/shared";

export interface TroubleshootingSolution {
  title: string;
  content: string;
}

export interface TroubleshootingFields {
  isTroubleshooting: boolean;
  troubleshootingCategory?: string;
  troubleshootingCategorySlug?: string;
  errorMessage?: string;
  problem?: string;
  symptoms?: string[];
  causes?: string[];
  quickFix?: string;
  solutions?: TroubleshootingSolution[];
  verificationSteps?: string[];
  commonMistakes?: string[];
  affectedPlatforms?: string[];
  technologies?: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  relatedProblems?: string[];
  relatedGuides?: string[];
}

export type Article = Post & { source: "mdx" | "db"; featured?: boolean } & TroubleshootingFields;

const ARTICLE_COLUMNS =
  "id,title,slug,content,excerpt,cover_url,status,published_at,created_at,updated_at,reading_time,tags,featured," +
  "category_name,category_slug,is_troubleshooting,troubleshooting_category_name,troubleshooting_category_slug," +
  "error_message,problem,symptoms,causes,quick_fix,solutions,verification_steps,common_mistakes," +
  "affected_platforms,technologies,difficulty,related_problems,related_guides";

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
  featured: boolean | null;
  category_name: string | null;
  category_slug: string | null;
  is_troubleshooting: boolean | null;
  troubleshooting_category_name: string | null;
  troubleshooting_category_slug: string | null;
  error_message: string | null;
  problem: string | null;
  symptoms: string[] | null;
  causes: string[] | null;
  quick_fix: string | null;
  solutions: TroubleshootingSolution[] | null;
  verification_steps: string[] | null;
  common_mistakes: string[] | null;
  affected_platforms: string[] | null;
  technologies: string[] | null;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | null;
  related_problems: string[] | null;
  related_guides: string[] | null;
};

function dbRowToArticle(a: DbRow): Article {
  const rawTags = a.tags ?? [];
  const tags = rawTags.map((t) => t.name);

  return {
    slug:         a.slug,
    title:        a.title,
    summary:      a.excerpt ?? "",
    publishedAt:  a.published_at ?? a.created_at,
    updatedAt:    a.updated_at,
    image:        a.cover_url ?? undefined,
    tags,
    author:       "Bilal Fali",
    readingTime:  a.reading_time ?? 5,
    draft:        false,
    content:      a.content,
    source:       "db",
    category:     a.category_name ?? undefined,
    categorySlug: a.category_slug ?? undefined,
    featured:     a.featured ?? false,

    isTroubleshooting:           a.is_troubleshooting ?? false,
    troubleshootingCategory:     a.troubleshooting_category_name ?? undefined,
    troubleshootingCategorySlug: a.troubleshooting_category_slug ?? undefined,
    errorMessage:                a.error_message ?? undefined,
    problem:                     a.problem ?? undefined,
    symptoms:                    a.symptoms ?? undefined,
    causes:                      a.causes ?? undefined,
    quickFix:                    a.quick_fix ?? undefined,
    solutions:                   a.solutions ?? undefined,
    verificationSteps:           a.verification_steps ?? undefined,
    commonMistakes:              a.common_mistakes ?? undefined,
    affectedPlatforms:           a.affected_platforms ?? undefined,
    technologies:                a.technologies ?? undefined,
    difficulty:                  a.difficulty ?? undefined,
    relatedProblems:             a.related_problems ?? undefined,
    relatedGuides:               a.related_guides ?? undefined,
  };
}

export async function getAllArticles(): Promise<Article[]> {
  const mdxPosts: Article[] = getAllPosts().map((p) => ({ ...p, source: "mdx" as const, isTroubleshooting: false }));

  const supabase = getSupabaseClient();
  if (!supabase) return mdxPosts;

  const { data, error } = await supabase
    .from("articles_with_relations")
    .select(ARTICLE_COLUMNS)
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
      .select(ARTICLE_COLUMNS)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (data) return dbRowToArticle(data as DbRow);
  }

  // Fall back to MDX
  const mdx = getPostBySlug(slug);
  if (mdx) return { ...mdx, source: "mdx", isTroubleshooting: false };

  return null;
}

export async function getArticlesByCategorySlug(categorySlug: string): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.categorySlug === categorySlug);
}

/** Regular blog articles only — excludes troubleshooting entries, which live under /troubleshooting instead. */
export async function getAllBlogArticles(): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => !a.isTroubleshooting);
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
