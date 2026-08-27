"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";

export interface SearchItem {
  type: "Article" | "Tool" | "Snippet" | "Question" | "Resource";
  title: string;
  description: string;
  category: string;
  href: string;
  external?: boolean;
}

const TYPE_STYLES: Record<SearchItem["type"], string> = {
  Article: "bg-accent/10 text-accent border-accent/20",
  Tool: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Snippet: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Question: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Resource: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

export function SearchClient({ items }: { items: SearchItem[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 60);
  }, [items, query]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-3xl font-bold text-ink mb-6">Search</h1>

      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-card border border-border focus-within:border-accent transition-colors mb-8">
        <SearchIcon className="w-4 h-4 text-ink-faint shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, tools, snippets, interview questions, resources…"
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
        />
      </div>

      {query.trim() === "" ? (
        <p className="text-sm text-ink-faint">Start typing to search across the whole site.</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-ink-faint">No results for &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-ink-faint">{results.length} result{results.length === 1 ? "" : "s"}</p>
          {results.map((item, i) => (
            <Link
              key={`${item.type}-${item.href}-${i}`}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-1.5 p-4 rounded-xl border border-border bg-bg-card hover:border-accent/30 hover:bg-bg-elevated transition-all"
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${TYPE_STYLES[item.type]}`}>
                  {item.type}
                </span>
                <span className="text-xs text-ink-faint">{item.category}</span>
              </div>
              <h2 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
                {item.title}
              </h2>
              <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">{item.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
