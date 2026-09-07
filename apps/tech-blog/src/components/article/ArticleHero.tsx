import Image from "next/image";
import type { TechArticle } from "@/lib/articles";
import { AuthorMeta } from "./AuthorMeta";

export function ArticleHero({ article }: { article: TechArticle }) {
  return (
    <header className="flex flex-col gap-5 mb-8">
      {article.category && (
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">{article.category}</span>
      )}
      <h1 className="font-display font-medium text-[clamp(2rem,1.6rem+2vw,3.5rem)] leading-[1.08] text-ink">
        {article.title}
      </h1>
      {article.dek && (
        <p className="text-[clamp(1.0625rem,0.98rem+0.4vw,1.25rem)] text-ink-muted leading-relaxed max-w-measure">
          {article.dek}
        </p>
      )}
      <AuthorMeta
        author={article.author}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        readingTime={article.readingTime}
      />
      {article.coverUrl && (
        <div className="relative w-full aspect-[16/9] bg-paper-sunken mt-2">
          <Image
            src={article.coverUrl}
            alt={article.coverAlt ?? article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
            priority
          />
        </div>
      )}
    </header>
  );
}
