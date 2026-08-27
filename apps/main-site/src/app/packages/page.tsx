import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Github, Star, Award, TrendingUp, Package } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PACKAGES, PACKAGE_CATEGORIES, type FlutterPackage } from "@/lib/packages";
import { breadcrumbJsonLd } from "@bidev/shared";
import { SITE_CONFIG } from "@/lib/seo";

export const revalidate = 3600; // re-fetch pub.dev stats every hour

export const metadata: Metadata = pageMetadata({
  title: "Flutter Packages – Open Source by BiDev",
  description: `${PACKAGES.length} open-source Flutter package${PACKAGES.length !== 1 ? "s" : ""} built and maintained by Bilal Fali. Free to use in personal and commercial projects.`,
  path: "/packages",
});

// ----- pub.dev API types -----
interface PubScore {
  likeCount: number;
  pubPoints: number;
  popularityScore: number; // 0–1
}

interface PubPackage {
  latest: { version: string; pubspec: { description: string } };
}

async function fetchPubStats(name: string): Promise<{ version: string; likes: number; pubPoints: number; popularity: number } | null> {
  try {
    const [pkgRes, scoreRes] = await Promise.all([
      fetch(`https://pub.dev/api/packages/${name}`, { next: { revalidate: 3600 } }),
      fetch(`https://pub.dev/api/packages/${name}/score`, { next: { revalidate: 3600 } }),
    ]);

    if (!pkgRes.ok || !scoreRes.ok) return null;

    const pkg: PubPackage = await pkgRes.json();
    const score: PubScore  = await scoreRes.json();

    return {
      version:    pkg.latest.version,
      likes:      score.likeCount,
      pubPoints:  score.pubPoints,
      popularity: Math.round(score.popularityScore * 100),
    };
  } catch {
    return null;
  }
}

// ----- Component -----
function PackageCard({
  pkg,
  stats,
}: {
  pkg: FlutterPackage;
  stats: Awaited<ReturnType<typeof fetchPubStats>>;
}) {
  return (
    <div className="relative bg-bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 hover:border-border-strong transition-colors group">
      {pkg.featured && (
        <span className="absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
          Featured
        </span>
      )}

      {/* Header */}
      <div className="flex items-start gap-4">
        <pkg.icon className="w-7 h-7 text-accent shrink-0" strokeWidth={1.75} />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-ink font-mono leading-tight">
            {pkg.name}
          </h2>
          {stats?.version && (
            <span className="text-xs text-ink-faint">v{stats.version}</span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-ink-muted leading-relaxed flex-1">{pkg.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[11px] px-2 py-0.5 rounded border border-accent/25 bg-accent/8 text-accent font-medium">
          {pkg.category}
        </span>
        {pkg.tags.map((t) => (
          <span key={t} className="text-[11px] px-2 py-0.5 rounded border border-border bg-bg-elevated text-ink-faint">
            {t}
          </span>
        ))}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-border">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-sm font-bold text-ink tabular-nums">{stats.likes}</span>
            </div>
            <span className="text-[10px] text-ink-faint uppercase tracking-wide">Likes</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-accent">
              <Award className="w-3.5 h-3.5" />
              <span className="text-sm font-bold text-ink tabular-nums">{stats.pubPoints}</span>
            </div>
            <span className="text-[10px] text-ink-faint uppercase tracking-wide">Pub Points</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-sm font-bold text-ink tabular-nums">{stats.popularity}%</span>
            </div>
            <span className="text-[10px] text-ink-faint uppercase tracking-wide">Popularity</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={`https://pub.dev/packages/${pkg.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          <Package className="w-3.5 h-3.5" />
          pub.dev
        </a>
        {pkg.githubUrl && (
          <a
            href={pkg.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-bg-elevated text-sm font-medium text-ink hover:bg-bg-card transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}

export default async function PackagesPage() {
  const { SITE_URL } = SITE_CONFIG;

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Packages", url: `${SITE_URL}/packages` },
  ]);

  // Fetch pub.dev stats for all packages in parallel
  const statsResults = await Promise.all(PACKAGES.map((p) => fetchPubStats(p.name)));
  const statsMap = Object.fromEntries(PACKAGES.map((p, i) => [p.name, statsResults[i]]));

  const totalLikes = statsResults.reduce((s, r) => s + (r?.likes ?? 0), 0);

  const byCategory = PACKAGE_CATEGORIES.reduce<Record<string, typeof PACKAGES>>(
    (acc, cat) => {
      const items = PACKAGES.filter((p) => p.category === cat);
      if (items.length) acc[cat] = items;
      return acc;
    },
    {}
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Header */}
      <div className="mb-12">
        <span className="inline-block px-3 py-1 rounded-full border border-accent/30 bg-accent/8 text-accent text-xs font-medium mb-5">
          Open Source · Free to Use
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">
          Flutter <span className="text-accent">Packages</span>
        </h1>
        <p className="text-ink-muted max-w-2xl text-lg">
          Open-source Flutter packages built and maintained by Bilal Fali.
          Published on pub.dev, free to use in any project.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink-faint">
          <span className="flex items-center gap-1.5">
            <Package className="w-4 h-4" />
            {PACKAGES.length} package{PACKAGES.length !== 1 ? "s" : ""}
          </span>
          {totalLikes > 0 && (
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              {totalLikes} total likes
            </span>
          )}
          <a
            href="https://pub.dev/publishers/bidev.dev/packages"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-accent hover:underline"
          >
            View on pub.dev <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Packages grid — all packages or by category */}
      {Object.keys(byCategory).length <= 1 ? (
        // Single category or all in one grid
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} stats={statsMap[pkg.name]} />
          ))}
        </div>
      ) : (
        // Multiple categories — group by category
        <div className="space-y-12">
          {Object.entries(byCategory).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="text-lg font-bold text-ink mb-5 flex items-center gap-3">
                {cat}
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
                  {items.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((pkg) => (
                  <PackageCard key={pkg.name} pkg={pkg} stats={statsMap[pkg.name]} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 p-8 rounded-2xl border border-border bg-bg-card text-center">
        <p className="text-ink-muted text-sm mb-4">
          Have a suggestion or found a bug? All packages are open-source.
        </p>
        <a
          href="https://github.com/BilalFali"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-bg-elevated text-sm font-medium text-ink hover:bg-bg-card transition-colors"
        >
          <Github className="w-4 h-4" />
          Open an issue on GitHub
        </a>
      </div>
    </div>
  );
}
