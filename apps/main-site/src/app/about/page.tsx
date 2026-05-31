import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About – bidev.site",
  description: "Learn about bidev.site — a platform for Flutter developers, mobile dev tutorials, and free developer tools built by Bilal Fali.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-ink mb-6">About <span className="text-accent">bidev.site</span></h1>
      <div className="prose prose-invert max-w-none">
        <p>
          <strong>bidev.site</strong> is a developer platform focused on Flutter, mobile development,
          and practical developer tools. Built by <strong>Bilal Fali</strong> — a Flutter developer
          from Algeria with 5+ years building cross-platform apps used by 100K+ users.
        </p>
        <h2>What you'll find here</h2>
        <ul>
          <li><strong>Flutter tutorials</strong> — Clean Architecture, Firebase, state management, deployment</li>
          <li><strong>Free developer tools</strong> — QR generator, JSON formatter, password generator, and more</li>
          <li><strong>AI tools guide</strong> — Practical coverage of Claude Code, Copilot, Cursor</li>
          <li><strong>Mobile dev articles</strong> — Gradle fixes, Firebase push notifications, app store guides</li>
        </ul>
        <h2>The developer</h2>
        <p>
          Bilal Fali is a Flutter Mobile App Developer currently working at DevGate Company. He has
          published 7+ cross-platform apps on the Google Play Store and Apple App Store, serving over
          100,000 active users. He writes here to share what he learns while building real products.
        </p>
        <h2>Contact & socials</h2>
        <p>
          Reach out on <a href="https://github.com/BilalFali" target="_blank" rel="noopener noreferrer">GitHub</a>,{" "}
          <a href="https://linkedin.com/in/falibilal" target="_blank" rel="noopener noreferrer">LinkedIn</a>, or{" "}
          <a href="https://youtube.com/@bidev97" target="_blank" rel="noopener noreferrer">YouTube</a>.
          For business enquiries: <a href="mailto:bilalfali60@gmail.com">bilalfali60@gmail.com</a>
        </p>
      </div>
      <div className="mt-10 flex gap-4">
        <Link href="/blog" className="px-6 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors">Read the Blog</Link>
        <Link href="https://portfolio.bidev.site" className="px-6 py-2.5 rounded-lg border border-border bg-bg-card text-sm text-ink hover:border-border-strong transition-colors">Portfolio →</Link>
      </div>
    </div>
  );
}
