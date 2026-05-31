import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About Bilal Fali — Flutter Mobile App Developer from M'sila, Algeria. Master's in Computer Science. 5+ years experience building cross-platform apps.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row items-start gap-10 mb-14">
        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-accent/20 to-violet-500/20 border border-accent/30 flex-shrink-0 flex items-center justify-center text-4xl">
          👨‍💻
        </div>
        <div>
          <h1 className="text-4xl font-bold text-ink mb-2">Bilal Fali</h1>
          <p className="text-accent font-medium mb-1">Flutter Mobile App Developer</p>
          <p className="text-ink-muted text-sm">M'sila, Algeria · Available worldwide</p>
          <div className="flex gap-3 mt-4">
            {[
              { label:"GitHub",   href:"https://github.com/BilalFali" },
              { label:"LinkedIn", href:"https://linkedin.com/in/falibilal" },
              { label:"YouTube",  href:"https://youtube.com/@bidev97" },
              { label:"Email",    href:"mailto:bilalfali60@gmail.com" },
            ].map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg border border-border bg-bg-card text-ink-muted hover:border-accent/40 hover:text-accent transition-colors">{s.label}</a>)}
          </div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2>About me</h2>
        <p>
          I'm a Flutter Mobile App Developer with a Master's degree in Computer Science from the University of M'sila.
          I specialize in building production-ready cross-platform mobile applications for Android and iOS using Flutter and Dart.
        </p>
        <p>
          At DevGate Company, I've shipped 7+ apps serving over 100,000 active users — from ride-hailing platforms
          with real-time GPS tracking to e-commerce apps with integrated payment processing.
        </p>
        <h2>What I care about</h2>
        <ul>
          <li><strong>Clean code</strong> — Clean Architecture, SOLID principles, testable code</li>
          <li><strong>Performance</strong> — Apps that load fast and feel native</li>
          <li><strong>User experience</strong> — Smooth animations, intuitive flows</li>
          <li><strong>Reliability</strong> — Apps that don't crash in production</li>
        </ul>
        <h2>When I'm not coding</h2>
        <p>
          I write technical articles on <a href="https://bidev.site">bidev.site</a> to share what I learn
          with the Flutter community, and build free developer tools at the same site.
        </p>
      </div>

      <div className="mt-10 flex gap-4">
        <Link href="/contact" className="px-6 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors">Work together</Link>
        <Link href="/projects" className="px-6 py-2.5 rounded-lg border border-border bg-bg-card text-sm text-ink hover:border-border-strong transition-colors">See my work</Link>
      </div>
    </div>
  );
}
