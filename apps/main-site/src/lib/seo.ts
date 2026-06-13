import type { Metadata } from "next";
import type { Post } from "@bidev/shared";

const SITE_URL  = "https://bidev.site";
const SITE_NAME = "bidev.site";
const AUTHOR    = "Bilal Fali";

function truncateDesc(text: string, max = 155): string {
  if (!text || text.length <= max) return text;
  return text.slice(0, max - 1).replace(/[,.:;!?\s]+$/, "") + "…";
}

export function postMetadata(post: Post): Metadata {
  const image       = post.image ?? `${SITE_URL}/og.png`;
  const description = truncateDesc(post.summary);
  return {
    title: post.title,
    description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    keywords: post.tags,
    authors: [{ name: post.author ?? AUTHOR, url: `${SITE_URL}/about` }],
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime:  post.updatedAt ?? post.publishedAt,
      authors: [post.author ?? AUTHOR],
      tags: post.tags,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
      creator: "@bidev97",
      site: "@bidev97",
    },
  };
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
      creator: "@bidev97",
      site: "@bidev97",
    },
  };
}

export const SITE_CONFIG = { SITE_URL, SITE_NAME, AUTHOR };
