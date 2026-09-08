import Link from "next/link";
import type { Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-3 p-5 rounded-lg border border-border bg-bg-card hover:border-accent/40 transition-colors"
    >
      <div className="flex items-start justify-between">
        <span className="flex items-center justify-center w-10 h-10 rounded-md bg-accent/10 border border-accent/20">
          <tool.icon className="w-5 h-5 text-accent" strokeWidth={1.75} />
        </span>
        {tool.popular && (
          <span className="text-[10px] font-mono px-1.5 py-1 rounded bg-signal-muted text-signal border border-signal/25">
            popular
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        <h2 className="font-semibold text-ink group-hover:text-accent transition-colors">{tool.title}</h2>
        <p className="text-sm text-ink-muted leading-relaxed">{tool.description}</p>
      </div>
      <div className="flex gap-1.5">
        {tool.tags.map((t) => (
          <span key={t} className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
