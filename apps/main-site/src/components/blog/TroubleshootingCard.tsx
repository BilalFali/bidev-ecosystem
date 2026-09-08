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
      className="group flex flex-col rounded-lg border border-border bg-bg-card overflow-hidden hover:border-red-400/40 transition-colors"
    >
      {/* Console titlebar — this is genuinely an error/log, so it wears one */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-[#181113] border-b border-border">
        <span className="terminal-dot" style={{ background: "#f87171" }} />
        <span className="terminal-dot" style={{ background: "#fbbf24" }} />
        <span className="terminal-dot" style={{ background: "#4ade80" }} />
        <span className="ml-1.5 flex items-center gap-1 text-[11px] font-mono text-ink-faint truncate">
          <Wrench className="w-2.5 h-2.5 shrink-0" />
          {article.troubleshootingCategory ?? "troubleshooting"}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <p className="font-mono text-[11px] text-red-400/90 leading-snug line-clamp-2">
          {article.problem ?? article.summary}
        </p>

        <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-ink-faint mt-auto pt-1">
          {article.difficulty && (
            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_STYLES[article.difficulty] ?? ""}`}>
              {article.difficulty}
            </span>
          )}
          <span>{article.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
