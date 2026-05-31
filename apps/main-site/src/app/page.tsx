import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { AdSlot } from "@bidev/ui";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

const TOOLS = [
  { href: "/tools/qr-generator",     icon: "⬛", title: "QR Code Generator",     desc: "Generate QR codes for any URL, text, or contact." },
  { href: "/tools/json-formatter",   icon: "{ }", title: "JSON Formatter",          desc: "Validate and pretty-print JSON instantly." },
  { href: "/tools/password-generator",icon: "🔐", title: "Password Generator",     desc: "Secure passwords using the Web Crypto API." },
  { href: "/tools/base64",           icon: "🔡", title: "Base64 Encoder/Decoder", desc: "Encode or decode Base64 strings in your browser." },
  { href: "/tools/uuid-generator",   icon: "🆔", title: "UUID Generator",          desc: "Generate RFC-4122 compliant UUIDs instantly." },
];

const CATEGORIES = [
  { label: "Flutter",      href: "/flutter",  color: "border-cyan-500/30 bg-cyan-500/5",    icon: "📱" },
  { label: "AI Tools",     href: "/ai-tools", color: "border-violet-500/30 bg-violet-500/5",icon: "🤖" },
  { label: "Firebase",     href: "/blog?tag=Firebase",color: "border-orange-500/30 bg-orange-500/5",icon: "🔥" },
  { label: "Dev Tools",    href: "/tools",    color: "border-green-500/30 bg-green-500/5",  icon: "🛠️" },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4);

  return (
    <div className="flex flex-col gap-32 py-16 overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Glow */}
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="w-[600px] h-[300px] rounded-full bg-accent/8 blur-[100px] mt-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-xs font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          Free Developer Tools · Flutter Tutorials · AI Resources
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[1.08] tracking-tight mb-6">
          Learn Flutter,{" "}
          <span className="text-gradient-accent">Build Better Apps,</span>
          <br />
          Explore Dev Tools
        </h1>

        <p className="text-lg sm:text-xl text-ink-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          In-depth Flutter tutorials, production-ready guides, Firebase tips, and
          free browser tools for developers. No fluff, just code.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="px-8 py-3.5 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]"
          >
            Start Reading →
          </Link>
          <Link
            href="/tools"
            className="px-8 py-3.5 rounded-xl border border-border bg-bg-card text-ink font-semibold text-sm hover:border-border-strong hover:bg-bg-elevated transition-all"
          >
            Explore Free Tools
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6">
          {[
            { value: "5+",  label: "Years Flutter" },
            { value: "100K+", label: "App Users" },
            { value: "5",   label: "Free Tools" },
            { value: "7+",  label: "Apps Published" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-bold text-gradient-accent">{s.value}</span>
              <span className="text-xs text-ink-muted uppercase tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── AD BANNER ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-6">Browse by topic</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`flex items-center gap-3 p-5 rounded-xl border ${cat.color} hover:border-opacity-60 transition-all group`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-semibold text-sm text-ink group-hover:text-accent transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TOOLS ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Free · Client-side · No Sign-up</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">Developer Tools</h2>
          </div>
          <Link href="/tools" className="text-sm text-ink-muted hover:text-accent transition-colors hidden sm:block">
            All tools →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
            >
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <h3 className="font-semibold text-ink group-hover:text-accent transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-ink-muted mt-1 leading-relaxed">{tool.desc}</p>
              </div>
              <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                Open tool →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LATEST ARTICLES ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Fresh content</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">Latest Articles</h2>
          </div>
          <Link href="/blog" className="text-sm text-ink-muted hover:text-accent transition-colors hidden sm:block">
            All articles →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-ink-muted">No articles yet — check back soon.</p>
        ) : (
          <div className="grid gap-6">
            {/* Feature post */}
            {posts[0] && (
              <Link
                href={`/blog/${posts[0].slug}`}
                className="group grid sm:grid-cols-2 gap-6 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/30 transition-all"
              >
                <div className="flex flex-col gap-3 justify-between">
                  <div className="flex flex-wrap gap-2">
                    {posts[0].tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors leading-snug">
                    {posts[0].title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{posts[0].summary}</p>
                  <div className="flex items-center gap-3 text-xs text-ink-faint">
                    <span>{formatDate(posts[0].publishedAt)}</span>
                    <span>·</span>
                    <span>{posts[0].readingTime} min read</span>
                  </div>
                </div>
                <div className="rounded-lg bg-bg-elevated border border-border h-40 sm:h-auto flex items-center justify-center text-ink-faint text-sm">
                  Cover image
                </div>
              </Link>
            )}

            {/* Remaining posts */}
            <div className="grid sm:grid-cols-3 gap-4">
              {posts.slice(1).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-3 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/30 transition-all"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 1).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated text-ink-muted border border-border">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">{post.summary}</p>
                  <p className="text-xs text-ink-faint mt-auto">{formatDate(posts[0].publishedAt, { month: "short" })}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── IN-ARTICLE AD ────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="in-article" />
      </div>

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-bg-card to-bg-secondary p-10 text-center">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-violet-500/5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">Stay ahead of the curve</h2>
          <p className="text-ink-muted mb-8 max-w-md mx-auto">
            Get the latest Flutter tutorials, developer tools, and AI resources delivered weekly.
          </p>
          <NewsletterForm />
          <p className="text-xs text-ink-faint mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

    </div>
  );
}
