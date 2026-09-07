import type { Metadata } from "next";
import type { TechArticle } from "./articles";

const SITE_URL  = "https://tech.bidev.dev";
const SITE_NAME = "BiDev Tech";

function truncateDesc(text: string, max = 155): string {
  if (!text || text.length <= max) return text;
  return text.slice(0, max - 1).replace(/[,.:;!?\s]+$/, "") + "…";
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url         = `${SITE_URL}${opts.path}`;
  const image       = opts.image ?? `${SITE_URL}/og.png`;
  const description = truncateDesc(opts.description);
  return {
    title: opts.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: opts.title,
      description,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description,
      images: [image],
    },
  };
}

export function articleMetadata(article: TechArticle): Metadata {
  const image       = article.coverUrl ?? `${SITE_URL}/og.png`;
  const description = truncateDesc(article.dek || article.excerpt);
  const url         = `${SITE_URL}/${article.categorySlug ?? "article"}/${article.slug}`;
  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    keywords: article.tags,
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      tags: article.tags,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [image],
    },
  };
}

export const SITE_CONFIG = { SITE_URL, SITE_NAME };
