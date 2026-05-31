import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@bidev/ui";

export const metadata: Metadata = pageMetadata({
  title: "AI Tools for Developers – Best AI Coding Tools 2026",
  description: "The best AI tools for software developers in 2026. Claude Code, GitHub Copilot, Cursor, and more — reviewed and compared.",
  path: "/ai-tools",
});

const AI_TOOLS = [
  { name: "Claude Code", by: "Anthropic", href: "https://claude.ai/code", tag: "Terminal AI", desc: "Full codebase AI assistant that runs in your terminal. Best for complex refactors and multi-file changes.", badge: "Top Pick" },
  { name: "GitHub Copilot", by: "GitHub / OpenAI", href: "https://github.com/features/copilot", tag: "IDE Plugin", desc: "AI pair programmer integrated into VS Code, JetBrains, and more. Best for line-by-line completions.", badge: "" },
  { name: "Cursor", by: "Anysphere", href: "https://cursor.sh", tag: "IDE", desc: "VS Code fork with deep AI integration. Cmd+K to edit, Cmd+L to chat. AI-native editor.", badge: "" },
  { name: "Vercel v0", by: "Vercel", href: "https://v0.dev", tag: "UI Generator", desc: "Generate React + Tailwind UI components from text prompts. Excellent for rapid prototyping.", badge: "" },
  { name: "Tabnine", by: "Tabnine", href: "https://tabnine.com", tag: "IDE Plugin", desc: "Privacy-focused AI completions that can run entirely on-device. Good for enterprise.", badge: "" },
  { name: "Codeium", by: "Exafunction", href: "https://codeium.com", tag: "Free", desc: "Free AI code completion with 70+ editor integrations. Great Copilot alternative.", badge: "Free" },
];

export default function AIToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/8 text-violet-400 text-xs font-medium mb-5">
          AI-Powered Development
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">
          Best <span className="text-gradient-accent">AI Tools</span> for Developers
        </h1>
        <p className="text-ink-muted max-w-2xl mx-auto">
          The AI tools actually worth using in 2026 — reviewed by a developer who uses them daily.
          Boost productivity by 2–5× without the hype.
        </p>
      </div>

      <AdSlot type="banner" className="mb-12" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {AI_TOOLS.map(tool => (
          <a key={tool.name} href={tool.href} target="_blank" rel="noopener noreferrer"
            className="group relative flex flex-col gap-3 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/30 hover:bg-bg-elevated transition-all">
            {tool.badge && (
              <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                {tool.badge}
              </span>
            )}
            <div className="flex flex-col gap-1">
              <h2 className="font-bold text-ink group-hover:text-accent transition-colors">{tool.name}</h2>
              <p className="text-xs text-ink-faint">by {tool.by}</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint self-start">{tool.tag}</span>
            <p className="text-sm text-ink-muted leading-relaxed">{tool.desc}</p>
            <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-auto">Visit →</span>
          </a>
        ))}
      </div>

      <AdSlot type="in-article" className="mb-12" />

      <div className="p-8 rounded-2xl border border-border bg-bg-card">
        <h2 className="text-xl font-bold text-ink mb-4">Read the full guide</h2>
        <p className="text-ink-muted mb-6">Deep-dive article covering Claude Code, Copilot, and when to use each.</p>
        <Link href="/blog/best-ai-tools-for-developers-2026"
          className="inline-flex px-6 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors">
          Read: Best AI Tools for Developers 2026 →
        </Link>
      </div>
    </div>
  );
}
