import Link from "next/link";

const LINKS = {
  Platform: [
    { label: "Articles",       href: "/blog" },
    { label: "Snippets",       href: "/snippets" },
    { label: "Tools",          href: "/tools" },
    { label: "Resources",      href: "/resources" },
    { label: "Interview Prep", href: "/flutter-interview-questions" },
    { label: "Jobs",           href: "/jobs" },
    { label: "Flutter",        href: "/flutter" },
  ],
  Community: [
    { label: "About",          href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms",          href: "/terms" },
    { label: "Portfolio",      href: "https://portfolio.bidev.site" },
  ],
  Social: [
    { label: "GitHub",    href: "https://github.com/BilalFali" },
    { label: "YouTube",   href: "https://youtube.com/@bidev97" },
    { label: "LinkedIn",  href: "https://linkedin.com/in/falibilal" },
    { label: "RSS Feed",  href: "/feed.xml" },
    { label: "Sitemap",   href: "/sitemap.xml" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="text-base font-semibold tracking-tight">
              Bi<span className="text-accent-light">dev</span>
            </Link>
            <p className="text-sm text-ink-faint leading-relaxed max-w-[200px]">
              Empowering the next generation of Flutter developers with high-performance tools and developer-first content.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
                {section}
              </h3>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-ink-muted hover:text-ink transition-colors"
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint">
          <p>© {new Date().getFullYear()} Bidev. Built for developers.</p>
          <p className="font-mono text-[11px]">Flutter Ecosystem · Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
