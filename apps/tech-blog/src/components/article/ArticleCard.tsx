import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { TechArticle } from "@/lib/articles";
import { formatTimestamp } from "@/lib/time";
import { BreakingBadge } from "@/components/ui/BreakingBadge";
import { getCategoryTextClass, getCategoryHex } from "@/lib/category-colors";

interface Props {
  article: TechArticle;
  size?: "dominant" | "standard" | "compact";
  priority?: boolean;
}

function articleHref(article: TechArticle) {
  return `/${article.categorySlug ?? "article"}/${article.slug}`;
}

export function ArticleCard({ article, size = "standard", priority = false }: Props) {
  if (size === "compact") {
    return (
      <Link
        href={articleHref(article)}
        className="group flex items-start gap-3 py-3 border-b border-border last:border-0"
      >
        {article.coverUrl && (
          <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-paper-sunken">
            <Image src={article.coverUrl} alt={article.coverAlt ?? article.title} fill sizes="64px" className="object-cover" />
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0">
          {article.category && (
            <span className={`text-xs font-medium ${getCategoryTextClass(article.categorySlug)}`}>
              {article.category}
            </span>
          )}
          <h3 className="text-sm font-medium text-ink group-hover:text-accent transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>
          <span className="text-xs text-ink-faint">{formatTimestamp(article.publishedAt)}</span>
        </div>
      </Link>
    );
  }

  if (size === "dominant") {
    // Magazine-cover treatment: the headline sits directly on the image with
    // a gradient scrim, rather than stacked in a text block below it — this
    // is the one section on the homepage allowed to look different from the
    // repeated eyebrow+title pattern everywhere else.
    return (
      <Link href={articleHref(article)} className="group relative flex flex-col">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-paper-sunken overflow-hidden">
          {article.coverUrl ? (
            <Image
              src={article.coverUrl}
              alt={article.coverAlt ?? article.title}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-ink-faint" strokeWidth={1.5} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-8">
            <div className="flex items-center gap-3">
              {article.breaking && <BreakingBadge />}
              {article.category && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-paper-raised">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: getCategoryHex(article.categorySlug) }}
                    aria-hidden="true"
                  />
                  {article.category}
                </span>
              )}
            </div>
            <h2 className="font-display font-medium text-[clamp(1.75rem,1.4rem+1.6vw,2.75rem)] leading-[1.1] text-paper-raised">
              {article.title}
            </h2>
            {article.dek && (
              <p className="text-paper-raised/80 text-base sm:text-lg leading-relaxed max-w-2xl">{article.dek}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-paper-raised/70">
              <span>{formatTimestamp(article.publishedAt)}</span>
              <span>{article.readingTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // standard
  return (
    <Link href={articleHref(article)} className="group flex flex-col gap-3">
      <div className="relative w-full aspect-[4/3] bg-paper-sunken overflow-hidden">
        {article.coverUrl ? (
          <Image
            src={article.coverUrl}
            alt={article.coverAlt ?? article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-6 h-6 text-ink-faint" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        {article.category && (
          <span className={`text-xs font-medium ${getCategoryTextClass(article.categorySlug)}`}>
            {article.category}
          </span>
        )}
        <h3 className="font-display font-medium text-lg leading-snug text-ink group-hover:text-accent transition-colors line-clamp-3">
          {article.title}
        </h3>
        <span className="text-xs text-ink-faint">{formatTimestamp(article.publishedAt)}</span>
      </div>
    </Link>
  );
}
