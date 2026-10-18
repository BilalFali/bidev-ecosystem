import { Button } from "@/components/ui/Button";
import type { Tool } from "@/lib/tools";

export function RelatedToolBanner({ tool }: { tool: Tool }) {
  return (
    <div className="rounded-xl border border-accent/30 bg-gradient-to-r from-bg-card to-bg-elevated p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <tool.icon className="w-8 h-8 text-accent shrink-0 mt-0.5" strokeWidth={1.75} />
        <div>
          <p className="font-mono text-xs text-teal mb-1">// related tool</p>
          <h3 className="text-base font-semibold text-ink">{tool.title}</h3>
          <p className="text-sm text-ink-muted mt-1 max-w-xl">{tool.description}</p>
        </div>
      </div>
      <Button href={tool.href} size="md" className="shrink-0">Open tool</Button>
    </div>
  );
}
