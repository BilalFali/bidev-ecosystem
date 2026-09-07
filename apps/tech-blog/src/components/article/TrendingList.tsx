import Link from "next/link";
import type { TechArticle } from "@/lib/articles";

export function TrendingList({ articles }: { articles: TechArticle[] }) {
  if (articles.length === 0) {
    return <p className="text-sm text-ink-faint py-6">No trending stories yet.</p>;
  }
  return (
    <ol className="flex flex-col">
      {articles.map((a, i) => (
        <li key={a.slug} className="border-b border-border last:border-0">
          <Link
            href={`/${a.categorySlug ?? "article"}/${a.slug}`}
            className="group flex items-baseline gap-4 py-3"
          >
            <span className="font-display text-2xl text-border-strong group-hover:text-accent transition-colors shrink-0 w-6">
              {i + 1}
            </span>
            <h3 className="text-sm font-medium text-ink group-hover:text-accent transition-colors leading-snug">
              {a.title}
            </h3>
          </Link>
        </li>
      ))}
    </ol>
  );
}
