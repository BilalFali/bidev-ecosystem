import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { getSupabaseClient } from "@/lib/supabase";

export const revalidate = 3600;

const BASE = "https://bidev.site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/blog`,                        lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/tools`,                       lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/flutter`,                     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/ai-tools`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/about`,                       lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`,                     lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${BASE}/privacy-policy`,              lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,                       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/tools/qr-generator`,          lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools/json-formatter`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools/password-generator`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools/base64`,                lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/uuid-generator`,        lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // MDX posts
  const mdxPosts: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url:             `${BASE}/blog/${p.slug}`,
    lastModified:    p.updatedAt ?? p.publishedAt,
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  // Supabase articles
  const supabase = getSupabaseClient();
  let dbPosts: MetadataRoute.Sitemap = [];

  if (supabase) {
    const { data } = await supabase
      .from("articles")
      .select("slug, updated_at, published_at")
      .eq("status", "published") as {
        data: { slug: string; updated_at: string | null; published_at: string | null }[] | null;
        error: unknown;
      };

    const mdxSlugs = new Set(mdxPosts.map((p) => p.url));

    dbPosts = (data ?? [])
      .filter((a) => !mdxSlugs.has(`${BASE}/blog/${a.slug}`))
      .map((a) => ({
        url:             `${BASE}/blog/${a.slug}`,
        lastModified:    a.updated_at ?? a.published_at ?? now,
        changeFrequency: "monthly" as const,
        priority:        0.7,
      }));
  }

  return [...staticPages, ...mdxPosts, ...dbPosts];
}
