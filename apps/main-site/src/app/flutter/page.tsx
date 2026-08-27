import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@bidev/ui";
import { Building2, Flame, Zap, Palette, Package, Rocket } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "Flutter Tutorials – Build Mobile Apps with Flutter & Dart",
  description: "Learn Flutter from scratch. Clean Architecture, Firebase, state management, animations, and production-ready patterns. Free tutorials by Bilal Fali.",
  path: "/flutter",
});

const TOPICS = [
  { icon: Building2, title: "Clean Architecture",  desc: "Domain, data & presentation layers" },
  { icon: Flame,      title: "Firebase",             desc: "Auth, Firestore, FCM, Storage" },
  { icon: Zap,        title: "State Management",    desc: "GetX, Bloc, Riverpod" },
  { icon: Palette,    title: "UI & Animations",    desc: "Custom widgets & transitions" },
  { icon: Package,    title: "Packages & Plugins",  desc: "Best Flutter pub.dev packages" },
  { icon: Rocket,     title: "App Store Deployment",desc: "Play Store & App Store guides" },
];

export default function FlutterPage() {
  const posts = getAllPosts().filter(p => p.tags.some(t => /flutter/i.test(t)));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="mb-14 text-center">
        <span className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/8 text-cyan-400 text-xs font-medium mb-5">
          Flutter · Dart · Mobile Development
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">
          Master Flutter <span className="text-gradient-accent">Development</span>
        </h1>
        <p className="text-ink-muted max-w-2xl mx-auto">
          Production-ready Flutter tutorials covering clean architecture, Firebase, state management,
          and real app patterns — written by a developer who ships apps used by 100K+ users.
        </p>
      </div>

      <AdSlot type="banner" className="mb-12" />

      {/* Topics grid */}
      <div className="mb-14">
        <h2 className="text-xl font-bold text-ink mb-6">Browse Topics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map(t => (
            <Link key={t.title} href={`/blog?tag=${encodeURIComponent(t.title)}`}
              className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/30 hover:bg-bg-elevated transition-all">
              <t.icon className="w-6 h-6 flex-shrink-0 text-accent" strokeWidth={1.75} />
              <div>
                <h3 className="font-semibold text-ink group-hover:text-accent transition-colors">{t.title}</h3>
                <p className="text-xs text-ink-muted mt-0.5">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Flutter articles */}
      <div>
        <h2 className="text-xl font-bold text-ink mb-6">Flutter Articles</h2>
        {posts.length === 0 ? (
          <div className="text-center py-16 text-ink-muted">
            <p>Flutter articles coming soon. <Link href="/blog" className="text-accent hover:underline">Browse all articles</Link></p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/30 transition-all">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink group-hover:text-accent transition-colors">{post.title}</h3>
                  <p className="text-sm text-ink-muted mt-1 line-clamp-1">{post.summary}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-faint flex-shrink-0">
                  <span>{formatDate(post.publishedAt, {month:"short"})}</span>
                  <span>·</span>
                  <span>{post.readingTime} min</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
