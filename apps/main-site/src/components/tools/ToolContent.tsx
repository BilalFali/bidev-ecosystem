import { TOOL_CONTENT } from "@/lib/tool-content";

export function ToolContent({ slug }: { slug: string }) {
  const content = TOOL_CONTENT[slug];
  if (!content) return null;

  return (
    <div className="mt-16 pt-10 border-t border-border max-w-2xl mx-auto">
      <p className="font-mono text-xs text-ink-faint uppercase tracking-wide mb-8">// more about this tool</p>
      {content.sections.map((section) => (
        <section key={section.heading} className="mb-10 last:mb-0">
          <h2 className="text-xl font-bold text-ink mb-3">{section.heading}</h2>
          {section.blocks.map((block, i) => {
            if (block.kind === "p") {
              return (
                <p key={i} className="text-ink-muted leading-relaxed mb-3 last:mb-0">
                  {block.text}
                </p>
              );
            }
            if (block.kind === "steps") {
              return (
                <ol key={i} className="list-decimal list-inside space-y-1.5 text-ink-muted mb-3 last:mb-0">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ol>
              );
            }
            if (block.kind === "code") {
              return (
                <div key={i} className="mb-3 last:mb-0">
                  {block.label && <p className="text-xs text-ink-faint mb-1.5">{block.label}</p>}
                  <pre className="p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink overflow-auto">
                    <code>{block.code}</code>
                  </pre>
                </div>
              );
            }
            return (
              <div key={i} className="mb-3 last:mb-0">
                {block.items.map((item, j) => (
                  <div key={j}>
                    <h3 className="text-base font-semibold text-ink mt-4 mb-1.5">{item.q}</h3>
                    <p className="text-ink-muted leading-relaxed mb-3">{item.a}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
