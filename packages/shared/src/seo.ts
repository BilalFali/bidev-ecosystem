export interface SeoConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  twitterHandle?: string;
  locale?: string;
}

export function buildTitle(pageTitle: string, siteName: string): string {
  if (!pageTitle) return siteName;
  return `${pageTitle} – ${siteName}`;
}

export function buildCanonical(siteUrl: string, path: string): string {
  const base = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const p    = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function buildOGImageUrl(siteUrl: string, title: string): string {
  return `${siteUrl}/api/og?title=${encodeURIComponent(title)}`;
}

export function articleJsonLd(opts: {
  url: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  image?: string;
  siteName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt ?? opts.publishedAt,
    author: { "@type": "Person", name: opts.authorName },
    publisher: {
      "@type": "Organization",
      name: opts.siteName,
      logo: { "@type": "ImageObject", url: `${opts.url}/icon.png` },
    },
    ...(opts.image ? { image: opts.image } : {}),
  };
}

export function websiteJsonLd(siteUrl: string, siteName: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: siteName,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
