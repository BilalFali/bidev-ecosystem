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
  siteUrl: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  authorUrl?: string;
  image?: string;
  siteName: string;
  wordCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt ?? opts.publishedAt,
    author: {
      "@type": "Person",
      name: opts.authorName,
      url: opts.authorUrl ?? opts.siteUrl + "/about",
    },
    publisher: {
      "@type": "Organization",
      name: opts.siteName,
      url: opts.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${opts.siteUrl}/icon.png`,
        width: 512,
        height: 512,
      },
    },
    image: opts.image
      ? { "@type": "ImageObject", url: opts.image, width: 1200, height: 630 }
      : { "@type": "ImageObject", url: `${opts.siteUrl}/og.png`, width: 1200, height: 630 },
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
  };
}

export function websiteJsonLd(siteUrl: string, siteName: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: siteName,
    description,
    publisher: {
      "@type": "Person",
      name: "Bilal Fali",
      url: `${siteUrl}/about`,
      sameAs: [
        "https://twitter.com/bidev97",
        "https://github.com/BilalFali",
      ],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function personJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bilal Fali",
    url: `${siteUrl}/about`,
    image: `${siteUrl}/profile.png`,
    jobTitle: "Flutter Developer",
    description: "Flutter developer and mobile app engineer. Author of bidev.site.",
    sameAs: [
      "https://twitter.com/bidev97",
      "https://github.com/BilalFali",
    ],
    knowsAbout: ["Flutter", "Dart", "Firebase", "Mobile Development", "Clean Architecture"],
  };
}

export function softwareApplicationJsonLd(opts: {
  url: string;
  siteUrl: string;
  name: string;
  description: string;
  applicationCategory?: string;
  operatingSystem?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: opts.applicationCategory ?? "DeveloperApplication",
    operatingSystem: opts.operatingSystem ?? "Any (runs in browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
