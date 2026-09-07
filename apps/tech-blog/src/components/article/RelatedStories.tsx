import type { TechArticle } from "@/lib/articles";
import { ArticleCard } from "./ArticleCard";

export function RelatedStories({ articles }: { articles: TechArticle[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="font-display text-xl text-ink mb-6">Related Stories</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} size="standard" />
        ))}
      </div>
    </section>
  );
}
