import Link from "next/link";
import type { Post } from "@bidev/shared";
import { formatDate } from "@/lib/utils";

export function RelatedPosts({ posts }: { posts: Post[] }) {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-ink mb-6">Related Articles</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group p-5 rounded-xl border border-border bg-bg-card hover:border-accent/30 hover:bg-bg-elevated transition-all"
          >
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 1).map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug mb-2">
              {post.title}
            </h3>
            <p className="text-xs text-ink-faint">{formatDate(post.publishedAt, { month: "short" })}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
