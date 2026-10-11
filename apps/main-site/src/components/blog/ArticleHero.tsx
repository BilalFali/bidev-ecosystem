import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { ShareButtons } from "@/components/blog/ShareButtons";
import type { Article } from "@/lib/articles";

export function ArticleHero({ post, postUrl }: { post: Article; postUrl: string }) {
  return (
    <header className="max-w-[1200px] mx-auto mb-10 pb-8 border-b border-border">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-faint mb-6 min-w-0">
        <Link href="/" className="hover:text-ink-muted transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className="hover:text-ink-muted transition-colors">Blog</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink-muted truncate">{post.title}</span>
      </nav>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className="font-mono text-[11px] px-2.5 py-1 rounded bg-accent/10 text-accent-light border border-accent/20 hover:bg-accent/20 transition-colors"
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4 leading-[1.1] max-w-4xl">
        {post.title}
      </h1>
      {post.summary && (
        <p className="text-lg text-ink-muted leading-relaxed max-w-3xl mb-6">{post.summary}</p>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pt-5 border-t border-border/60">
        <div className="flex items-center gap-3">
          <Image src="/profile.png" alt="" width={44} height={44} className="rounded-full border border-border object-cover" />
          <div className="text-sm">
            <p className="font-semibold text-ink">{post.author ?? "Bilal Fali"}</p>
            <div className="flex items-center divide-x divide-border text-ink-faint">
              <time dateTime={post.publishedAt} className="pr-3">{formatDate(post.publishedAt)}</time>
              <span className="pl-3">{post.readingTime} min read</span>
            </div>
          </div>
        </div>
        <ShareButtons url={postUrl} title={post.title} />
      </div>
    </header>
  );
}
