import Link from "next/link";
import { Wrench } from "lucide-react";
import type { Article } from "@/lib/articles";

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function TroubleshootingCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col gap-2.5 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/30 hover:bg-bg-elevated transition-all"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
          <Wrench className="w-3 h-3" />
          {article.troubleshootingCategory ?? "Troubleshooting"}
        </span>
        {article.difficulty && (
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_STYLES[article.difficulty] ?? ""}`}>
            {article.difficulty}
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug line-clamp-2">
        {article.title}
      </h3>

      <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 flex-1">
        {article.problem ?? article.summary}
      </p>

      <div className="flex items-center gap-2 text-xs text-ink-faint mt-auto pt-1">
        <span>{article.readingTime} min read</span>
      </div>
    </Link>
  );
}
