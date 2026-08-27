import Link from "next/link";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col gap-4 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
    >
      {tool.popular && (
        <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
          Popular
        </span>
      )}
      <tool.icon className="w-7 h-7 text-accent" strokeWidth={1.75} />
      <div className="flex flex-col gap-2 flex-1">
        <h2 className="font-bold text-ink group-hover:text-accent transition-colors">{tool.title}</h2>
        <p className="text-sm text-ink-muted leading-relaxed">{tool.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {tool.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
              {t}
            </span>
          ))}
        </div>
        <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
      </div>
    </Link>
  );
}
