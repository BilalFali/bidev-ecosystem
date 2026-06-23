import Link from "next/link";
import type { Tool } from "@/lib/tools";

export function RelatedTools({ tools, maxWidth = "max-w-3xl" }: { tools: Tool[]; maxWidth?: string }) {
  if (tools.length === 0) return null;
  return (
    <div className={`mx-auto ${maxWidth} px-4 sm:px-6 lg:px-8 pb-14`}>
      <h2 className="text-xl font-bold text-ink mb-6">Related Tools</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.href}
            className="group p-5 rounded-xl border border-border bg-bg-card hover:border-accent/30 hover:bg-bg-elevated transition-all"
          >
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tool.tags.slice(0, 1).map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug mb-2">
              {tool.title}
            </h3>
            <p className="text-xs text-ink-faint line-clamp-2">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
