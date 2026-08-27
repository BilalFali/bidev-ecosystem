import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/utils";

interface Props {
  article: Article;
  /** Eagerly load the image — pass true for above-the-fold cards */
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: Props) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-bg-card hover:border-accent/30 hover:bg-bg-elevated transition-all overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-bg-elevated flex items-center justify-center overflow-hidden">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <Sparkles className="w-9 h-9 opacity-10 group-hover:opacity-20 transition-opacity" strokeWidth={1.5} />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 p-5 flex-1">
        {/* Primary tag */}
        {article.tags[0] && (
          <span className="self-start text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">
            {article.tags[0]}
          </span>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 flex-1">
          {article.summary}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-ink-faint mt-auto pt-1">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span>·</span>
          <span>{article.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
