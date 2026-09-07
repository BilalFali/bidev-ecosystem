"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import type { TechArticle } from "@/lib/articles";
import { ArticleCard } from "@/components/article/ArticleCard";

export function SearchResults({ articles }: { articles: TechArticle[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.dek.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [articles, query]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl text-ink mb-6">Search</h1>
      <div className="flex items-center gap-2 px-4 py-3 bg-paper-sunken border border-border focus-within:border-accent transition-colors mb-8">
        <SearchIcon className="w-4 h-4 text-ink-faint shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stories…"
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
        />
      </div>

      {query.trim() === "" ? (
        <p className="text-sm text-ink-faint">Start typing to search BiDev Tech.</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-ink-faint">No results for &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-8">
          {results.map((a) => (
            <ArticleCard key={a.slug} article={a} size="standard" />
          ))}
        </div>
      )}
    </div>
  );
}
