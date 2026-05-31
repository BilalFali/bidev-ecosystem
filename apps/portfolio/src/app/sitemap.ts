import { MetadataRoute } from "next";
const BASE = "https://portfolio.bidev.site";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  return [
    { url: BASE,                    lastModified: now, priority: 1.0 },
    { url: `${BASE}/about`,         lastModified: now, priority: 0.9 },
    { url: `${BASE}/projects`,      lastModified: now, priority: 0.9 },
    { url: `${BASE}/services`,      lastModified: now, priority: 0.8 },
    { url: `${BASE}/experience`,    lastModified: now, priority: 0.7 },
    { url: `${BASE}/contact`,       lastModified: now, priority: 0.6 },
  ];
}
