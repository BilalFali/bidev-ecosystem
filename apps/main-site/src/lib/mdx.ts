import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { readingTime } from "@bidev/shared";
import type { Post, PostMeta } from "@bidev/shared";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function getPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title:       data.title       ?? "",
    summary:     data.summary     ?? "",
    publishedAt: data.publishedAt ?? new Date().toISOString(),
    updatedAt:   data.updatedAt,
    image:       data.image,
    tags:        data.tags        ?? [],
    author:      data.author      ?? "Bilal Fali",
    readingTime: readingTime(content),
    draft:       data.draft       ?? false,
    content,
  };
}

export function getAllPosts(opts?: { includeDrafts?: boolean }): Post[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Post => p !== null && (!p.draft || !!opts?.includeDrafts))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts: Record<string, number> = {};
  getAllPosts().forEach((p) =>
    p.tags.forEach((t) => { counts[t] = (counts[t] ?? 0) + 1; })
  );
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRelatedPosts(current: Post, limit = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}
