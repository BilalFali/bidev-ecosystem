import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { TechArticle } from "@/lib/articles";
import { formatTimestamp } from "@/lib/time";
import { BreakingBadge } from "@/components/ui/BreakingBadge";

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
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{article.category}</span>
          )}
          <h3 className="text-sm font-medium text-ink group-hover:text-accent transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>
          <time dateTime={article.publishedAt} className="font-mono text-[11px] text-ink-faint">
            {formatTimestamp(article.publishedAt)}
          </time>
        </div>
      </Link>
    );
  }

  if (size === "dominant") {
    return (
      <Link href={articleHref(article)} className="group flex flex-col gap-4">
        <div className="relative w-full aspect-[16/9] bg-paper-sunken overflow-hidden">
          {article.coverUrl ? (
            <Image
              src={article.coverUrl}
              alt={article.coverAlt ?? article.title}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-ink-faint" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {article.breaking && <BreakingBadge />}
            {article.category && (
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">{article.category}</span>
            )}
          </div>
          <h2 className="font-display font-medium text-[clamp(1.75rem,1.4rem+1.6vw,2.75rem)] leading-[1.1] text-ink group-hover:text-accent transition-colors">
            {article.title}
          </h2>
          {article.dek && <p className="text-ink-muted text-lg leading-relaxed max-w-2xl">{article.dek}</p>}
          <time dateTime={article.publishedAt} className="font-mono text-xs text-ink-faint">
            {formatTimestamp(article.publishedAt)} · {article.readingTime} min read
          </time>
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
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-6 h-6 text-ink-faint" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        {article.category && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{article.category}</span>
        )}
        <h3 className="font-display font-medium text-lg leading-snug text-ink group-hover:text-accent transition-colors line-clamp-3">
          {article.title}
        </h3>
        <time dateTime={article.publishedAt} className="font-mono text-[11px] text-ink-faint">
          {formatTimestamp(article.publishedAt)}
        </time>
      </div>
    </Link>
  );
}
