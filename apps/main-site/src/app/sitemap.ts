import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

const BASE = "https://bidev.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                       lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/blog`,             lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/tools`,            lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/flutter`,          lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/ai-tools`,         lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/about`,            lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`,          lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${BASE}/privacy-policy`,   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,            lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/tools/qr-generator`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools/json-formatter`,    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools/password-generator`,lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools/base64`,            lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/uuid-generator`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const posts = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.updatedAt ?? p.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...posts];
}
