import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { getSupabaseClient } from "@/lib/supabase";
import { SNIPPETS } from "@/lib/snippets";
import { TOOLS } from "@/lib/tools";
import { INTERVIEW_QUESTIONS, getAllFilterKeys } from "@/lib/interview-questions";
import { getAllJobs } from "@/lib/jobs";
import { getAllProducts } from "@/lib/products";
import { PACKAGES } from "@/lib/packages";

export const revalidate = 3600;

const BASE = "https://bidev.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/blog`,                        lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/tools`,                       lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/snippets`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/resources`,                   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/flutter`,                     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/ai-tools`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/about`,                       lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`,                     lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${BASE}/privacy-policy`,              lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,                       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/flutter-interview-questions`, lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/jobs`,                        lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/products`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/packages`,                    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/products?category=flutter-starter-kit`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/products?category=ui-kit`,    lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/products?category=ebook`,     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
  ];

  const [jobs, products] = await Promise.all([getAllJobs(), getAllProducts()]);
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url:             `${BASE}/products/${p.slug}`,
    lastModified:    p.updated_at,
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  const jobPages: MetadataRoute.Sitemap = jobs.map((j) => ({
    url:             `${BASE}/jobs/${j.slug}`,
    lastModified:    j.updated_at,
    changeFrequency: "daily" as const,
    priority:        0.6,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url:             `${BASE}${t.href}`,
    lastModified:    now,
    changeFrequency: "monthly" as const,
    priority:        t.popular ? 0.9 : 0.7,
  }));

  const interviewFilterPages: MetadataRoute.Sitemap = getAllFilterKeys().map((key) => ({
    url:             `${BASE}/flutter-interview-questions/${key}`,
    lastModified:    now,
    changeFrequency: "weekly" as const,
    priority:        0.7,
  }));

  const interviewQuestionPages: MetadataRoute.Sitemap = INTERVIEW_QUESTIONS.map((q) => ({
    url:             `${BASE}/flutter-interview-questions/${q.slug}`,
    lastModified:    now,
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

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

  const snippetPages: MetadataRoute.Sitemap = SNIPPETS.map((s) => ({
    url:             `${BASE}/snippets/${s.slug}`,
    lastModified:    now,
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  const packagePages: MetadataRoute.Sitemap = PACKAGES.map((p) => ({
    url:             `${BASE}/packages#${p.name}`,
    lastModified:    now,
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...packagePages,
    ...toolPages,
    ...interviewFilterPages,
    ...interviewQuestionPages,
    ...jobPages,
    ...snippetPages,
    ...mdxPosts,
    ...dbPosts,
  ];
}
