import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@bidev/ui";
import { TOOLS } from "@/lib/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = pageMetadata({
  title: "Free Developer Tools – JSON to Dart, QR, UUID & More",
  description: "Free online tools for developers: JSON to Dart converter, QR code generator, JSON formatter, password generator, Base64 encoder, UUID generator, and more.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">Developer Tools</h1>
        <p className="text-ink-muted max-w-xl mb-4">
          Fast, privacy-friendly tools that run entirely in your browser. Free, no sign-up, and nothing you type is ever sent to a server.
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-mono text-ink-faint">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          runs client-side, nothing leaves your browser
        </div>
      </div>

      <AdSlot type="banner" className="mb-10" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <AdSlot type="in-article" className="mt-12" />

      <div className="mt-16 p-8 rounded-2xl border border-border bg-bg-card text-center">
        <h2 className="text-xl font-bold text-ink mb-2">More tools coming</h2>
        <p className="text-sm text-ink-muted mb-6">
          Suggest a tool you need — we build for the developer community.
        </p>
        <Button href="/contact" variant="secondary" size="md">Suggest a tool</Button>
      </div>
    </div>
  );
}
