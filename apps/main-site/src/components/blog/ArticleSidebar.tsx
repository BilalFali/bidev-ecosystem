import { TableOfContents } from "@/components/blog/TableOfContents";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { AdSlot } from "@bidev/ui";
import type { TocHeading } from "@/lib/toc";

export function ArticleSidebar({ headings }: { headings: TocHeading[] }) {
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col gap-6 lg:sticky lg:top-24 self-start">
      <TableOfContents headings={headings} />
      <div className="rounded-xl border border-border bg-bg-card p-4">
        <p className="font-mono text-xs text-teal mb-2">// newsletter</p>
        <h2 className="text-sm font-semibold text-ink mb-1">New Flutter articles by email</h2>
        <p className="text-xs text-ink-muted mb-3 leading-relaxed">New articles and tools, straight to your inbox.</p>
        <div className="[&_form]:flex-col [&_form]:items-stretch">
          <NewsletterForm />
        </div>
      </div>
      <AdSlot type="sidebar" />
    </aside>
  );
}
