import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@bidev/ui";
import { TOOLS } from "@/lib/tools";
import { ToolCard } from "@/components/tools/ToolCard";

export const metadata: Metadata = pageMetadata({
  title: "Free Developer Tools – JSON to Dart, QR, UUID & More",
  description: "Free online tools for developers: JSON to Dart converter, QR code generator, JSON formatter, password generator, Base64 encoder, UUID generator, and more.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">100% Free · Client-Side · No Sign-Up</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">Developer Tools</h1>
        <p className="text-ink-muted max-w-xl">
          Fast, privacy-friendly tools that run entirely in your browser. No data is ever sent to a server.
        </p>
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
        <Link
          href="/contact"
          className="inline-flex px-6 py-2.5 rounded-lg bg-bg-elevated border border-border text-sm text-ink hover:border-border-strong transition-colors"
        >
          Suggest a Tool →
        </Link>
      </div>
    </div>
  );
}
