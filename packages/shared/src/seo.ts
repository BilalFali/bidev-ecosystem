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
    description: "Flutter developer and mobile app engineer. Author of bidev.dev.",
    sameAs: [
      "https://twitter.com/bidev97",
      "https://github.com/BilalFali",
    ],
    knowsAbout: ["Flutter", "Dart", "Firebase", "Mobile Development", "Clean Architecture"],
  };
}

export function organizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BiDev",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://twitter.com/bidev97",
      "https://github.com/BilalFali",
      "https://youtube.com/@bidev97",
      "https://linkedin.com/in/falibilal",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteUrl}/contact`,
    },
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

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function jobPostingJsonLd(opts: {
  url: string;
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType: string;
  companyName: string;
  companyLogo?: string;
  location?: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: opts.title,
    description: opts.description,
    url: opts.url,
    datePosted: opts.datePosted,
    ...(opts.validThrough ? { validThrough: opts.validThrough } : {}),
    employmentType: opts.employmentType.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: opts.companyName,
      ...(opts.companyLogo ? { logo: opts.companyLogo } : {}),
    },
    ...(opts.remote
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Anywhere" } }
      : {}),
    ...(opts.location
      ? { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: opts.location } } }
      : {}),
    ...(opts.salaryMin || opts.salaryMax
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: opts.salaryCurrency ?? "USD",
            value: {
              "@type": "QuantitativeValue",
              ...(opts.salaryMin ? { minValue: opts.salaryMin } : {}),
              ...(opts.salaryMax ? { maxValue: opts.salaryMax } : {}),
              unitText: "YEAR",
            },
          },
        }
      : {}),
  };
}

export function productJsonLd(opts: {
  url: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  currency?: string;
  category: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  sellerName?: string;
  sellerUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.image ? { image: { "@type": "ImageObject", url: opts.image, width: 1200, height: 630 } } : {}),
    category: opts.category,
    offers: {
      "@type": "Offer",
      price: opts.price.toFixed(2),
      priceCurrency: opts.currency ?? "USD",
      availability: `https://schema.org/${opts.availability ?? "InStock"}`,
      url: opts.url,
      ...(opts.sellerName
        ? { seller: { "@type": "Organization", name: opts.sellerName, ...(opts.sellerUrl ? { url: opts.sellerUrl } : {}) } }
        : {}),
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
