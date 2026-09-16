import { TOOL_CONTENT } from "@/lib/tool-content";

export function ToolContent({ slug }: { slug: string }) {
  const content = TOOL_CONTENT[slug];
  if (!content) return null;

  return (
    <div className="mt-16 pt-10 border-t border-border max-w-2xl">
      {content.sections.map((section) => (
        <section key={section.heading} className="mb-8 last:mb-0">
          <h2 className="text-lg font-semibold text-ink mb-3">{section.heading}</h2>
          {section.body.map((paragraph, i) => (
            <p key={i} className="text-sm text-ink-muted leading-relaxed mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
