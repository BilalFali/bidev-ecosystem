import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/articles";
import { formatDate } from "@/lib/utils";
import { AdSlot } from "@bidev/ui";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

export const revalidate = 60;

const TOOLS = [
  { href: "/tools/qr-generator",      icon: "⬛", title: "QR Generator",         desc: "Any URL or text, instant QR code."         },
  { href: "/tools/json-formatter",    icon: "{ }", title: "JSON Formatter",       desc: "Validate and pretty-print JSON."           },
  { href: "/tools/password-generator",icon: "🔐", title: "Password Generator",   desc: "Secure passwords via Web Crypto API."      },
  { href: "/tools/base64",            icon: "🔡", title: "Base64 Encode/Decode", desc: "Encode or decode Base64 in-browser."       },
  { href: "/tools/uuid-generator",    icon: "🆔", title: "UUID Generator",       desc: "RFC-4122 compliant UUIDs, one click."      },
];

const TOPICS = [
  { label: "Flutter",   href: "/flutter",            color: "from-cyan-500/10 to-cyan-500/5",   border: "border-cyan-500/25",   dot: "bg-cyan-400"   },
  { label: "Firebase",  href: "/blog?tag=Firebase",  color: "from-orange-500/10 to-orange-500/5", border: "border-orange-500/25", dot: "bg-orange-400" },
  { label: "AI Tools",  href: "/ai-tools",           color: "from-violet-500/10 to-violet-500/5", border: "border-violet-500/25", dot: "bg-violet-400" },
  { label: "Dev Tools", href: "/tools",              color: "from-green-500/10 to-green-500/5",   border: "border-green-500/25",  dot: "bg-green-400"  },
];

const CODE_SNIPPET = `// Flutter BLoC pattern
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(AuthInitial()) {
    on<LoginRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final user = await _repo.login(
          event.email,
          event.password,
        );
        emit(AuthSuccess(user));
      } catch (e) {
        emit(AuthFailure(e.toString()));
      }
    });
  }
}`;

export default async function HomePage() {
  const allArticles = await getAllArticles();
  const featured    = allArticles[0];
  const recent      = allArticles.slice(1, 7);

  return (
    <div className="flex flex-col gap-28 py-16 overflow-hidden">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-accent/6 blur-[120px]" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-xs font-medium mb-7">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Flutter · Firebase · AI · Dev Tools
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight mb-6">
              Build{" "}
              <span className="text-gradient-accent">better apps</span>
              {" "}with every article
            </h1>

            <p className="text-lg text-ink-muted max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              In-depth Flutter tutorials, Firebase guides, and AI tools for developers
              who care about quality code and shipping fast.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/blog"
                className="px-7 py-3 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-all shadow-[0_0_30px_rgba(34,211,238,0.18)] hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]"
              >
                Read the blog →
              </Link>
              <Link
                href="/tools"
                className="px-7 py-3 rounded-xl border border-border bg-bg-card text-ink font-semibold text-sm hover:border-border-strong transition-all"
              >
                Free dev tools
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 mt-10">
              {[
                { v: `${allArticles.length}+`, l: "Articles" },
                { v: "5+",  l: "Years Flutter" },
                { v: "7+",  l: "Apps Published" },
                { v: "5",   l: "Free Tools" },
              ].map(s => (
                <div key={s.l} className="flex flex-col">
                  <span className="text-2xl font-bold text-gradient-accent">{s.v}</span>
                  <span className="text-xs text-ink-faint uppercase tracking-wide">{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: code window */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none shrink-0">
            <div className="rounded-xl border border-border bg-bg-card overflow-hidden shadow-2xl">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-elevated">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-ink-faint font-mono">auth_bloc.dart</span>
              </div>
              {/* Code */}
              <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto text-ink-muted">
                <code>{CODE_SNIPPET.split("\n").map((line, i) => {
                  const keyword = /^(\/\/|class|extends|on|try|catch|final|emit|async|await|return)/.test(line.trim());
                  return (
                    <span key={i} className="block">
                      <span className="select-none text-ink-faint/40 mr-4 text-[10px] w-4 inline-block text-right">{i + 1}</span>
                      <span className={keyword ? "text-accent/90" : "text-ink-muted"}>{line}</span>
                    </span>
                  );
                })}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── AD ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full -mt-10">
        <AdSlot type="banner" />
      </div>

      {/* ── FEATURED ARTICLE ──────────────────────────────────── */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-5">Featured article</p>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid md:grid-cols-5 gap-0 rounded-2xl border border-border bg-bg-card overflow-hidden hover:border-accent/30 transition-all duration-300"
          >
            {/* Cover */}
            <div className="md:col-span-2 h-52 md:h-auto bg-bg-elevated flex items-center justify-center relative overflow-hidden">
              {featured.image ? (
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                  <span className="text-5xl opacity-30">✦</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="md:col-span-3 flex flex-col gap-4 p-7 justify-between">
              <div className="flex flex-wrap gap-2">
                {featured.tags.slice(0, 3).map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                    {t}
                  </span>
                ))}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-ink group-hover:text-accent transition-colors leading-snug mb-3">
                  {featured.title}
                </h2>
                <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">{featured.summary}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-ink-faint">
                  <span className="font-medium text-ink-muted">{featured.author}</span>
                  <span>·</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span>·</span>
                  <span>{featured.readingTime} min read</span>
                </div>
                <span className="text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Read article →
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── TOPICS ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-5">Browse by topic</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TOPICS.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className={`group flex items-center gap-3 p-4 rounded-xl border ${t.border} bg-gradient-to-br ${t.color} hover:scale-[1.02] transition-all duration-200`}
            >
              <span className={`w-2 h-2 rounded-full ${t.dot} shrink-0`} />
              <span className="font-semibold text-sm text-ink group-hover:text-accent transition-colors">
                {t.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── RECENT ARTICLES ───────────────────────────────────── */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">Fresh content</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink">Latest Articles</h2>
            </div>
            <Link href="/blog" className="text-sm text-ink-muted hover:text-accent transition-colors hidden sm:block">
              View all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-xl border border-border bg-bg-card hover:border-accent/30 hover:bg-bg-elevated overflow-hidden transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="h-40 bg-bg-elevated relative overflow-hidden shrink-0">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-bg-elevated to-bg-card flex items-center justify-center">
                      <span className="text-3xl opacity-20">✦</span>
                    </div>
                  )}
                  {/* Tag overlay */}
                  {post.tags[0] && (
                    <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full bg-bg/80 backdrop-blur-sm text-accent border border-accent/20">
                      {post.tags[0]}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 p-5 flex-1">
                  <h3 className="font-semibold text-ink group-hover:text-accent transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 flex-1">{post.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-ink-faint mt-1 pt-3 border-t border-border">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>·</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/blog" className="text-sm text-accent hover:underline">View all articles →</Link>
          </div>
        </section>
      )}

      {/* ── AD ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full -mt-10">
        <AdSlot type="in-article" />
      </div>

      {/* ── TOOLS ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">Free · No sign-up</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">Developer Tools</h2>
          </div>
          <Link href="/tools" className="text-sm text-ink-muted hover:text-accent transition-colors hidden sm:block">
            All tools →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
            >
              <span className="text-2xl mt-0.5 shrink-0">{tool.icon}</span>
              <div className="min-w-0">
                <h3 className="font-semibold text-ink group-hover:text-accent transition-colors text-sm">
                  {tool.title}
                </h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full" id="newsletter">
        <div className="relative overflow-hidden rounded-2xl border border-accent/20 p-10 text-center">
          {/* Gradient bg */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/8 via-bg-card to-violet-500/5" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.06),transparent_70%)]" />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-xs font-medium mb-5">
            ✦ Weekly dev digest
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">Stay ahead of the curve</h2>
          <p className="text-ink-muted mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Flutter tutorials, Firebase tips, and the best AI tools for developers —
            delivered every week. No spam, ever.
          </p>
          <NewsletterForm />
          <p className="text-xs text-ink-faint mt-4">Join 1,000+ developers. Unsubscribe anytime.</p>
        </div>
      </section>

    </div>
  );
}
