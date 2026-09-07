import type { TechArticle } from "@/lib/articles";
import { ArticleCard } from "./ArticleCard";

export function NewsList({ articles }: { articles: TechArticle[] }) {
  if (articles.length === 0) {
    return <p className="text-sm text-ink-faint py-6">No stories yet.</p>;
  }
  return (
    <div className="flex flex-col">
      {articles.map((a) => (
        <ArticleCard key={a.slug} article={a} size="compact" />
      ))}
    </div>
  );
}
