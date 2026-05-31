import type { Metadata } from "next";
import type { Post } from "@bidev/shared";

const SITE_URL  = "https://bidev.site";
const SITE_NAME = "bidev.site";
const AUTHOR    = "Bilal Fali";

export function postMetadata(post: Post): Metadata {
  const image = post.image ?? `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}`;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    keywords: post.tags,
    authors: [{ name: post.author ?? AUTHOR }],
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.title,
      description: post.summary,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author ?? AUTHOR],
      tags: post.tags,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [image],
    },
  };
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url   = `${SITE_URL}${opts.path}`;
  const image = opts.image ?? `${SITE_URL}/api/og?title=${encodeURIComponent(opts.title)}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: opts.title,
      description: opts.description,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: [image] },
  };
}

export const SITE_CONFIG = { SITE_URL, SITE_NAME, AUTHOR };
