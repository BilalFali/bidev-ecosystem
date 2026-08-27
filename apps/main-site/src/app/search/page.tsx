import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { getAllArticles } from "@/lib/articles";
import { TOOLS } from "@/lib/tools";
import { SNIPPETS } from "@/lib/snippets";
import { INTERVIEW_QUESTIONS } from "@/lib/interview-questions";
import { RESOURCES } from "@/lib/resources";
import { SearchClient, type SearchItem } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Search",
    description: "Search Flutter articles, tools, snippets, interview questions, and resources on BiDev.",
    path: "/search",
  }),
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const articles = await getAllArticles();

  const items: SearchItem[] = [
    ...articles.map((a) => ({
      type: "Article" as const,
      title: a.title,
      description: a.summary,
      category: a.category ?? "Article",
      href: `/blog/${a.slug}`,
    })),
    ...TOOLS.map((t) => ({
      type: "Tool" as const,
      title: t.title,
      description: t.description,
      category: t.tags[0] ?? "Tool",
      href: t.href,
    })),
    ...SNIPPETS.map((s) => ({
      type: "Snippet" as const,
      title: s.title,
      description: s.description,
      category: s.category,
      href: `/snippets/${s.slug}`,
    })),
    ...INTERVIEW_QUESTIONS.map((q) => ({
      type: "Question" as const,
      title: q.question,
      description: q.shortAnswer,
      category: q.category,
      href: `/flutter-interview-questions/${q.slug}`,
    })),
    ...RESOURCES.map((r) => ({
      type: "Resource" as const,
      title: r.title,
      description: r.description,
      category: r.category,
      href: r.url,
      external: true,
    })),
  ];

  return (
    <Suspense>
      <SearchClient items={items} />
    </Suspense>
  );
}
