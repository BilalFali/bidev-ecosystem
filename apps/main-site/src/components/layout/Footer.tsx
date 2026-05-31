import Link from "next/link";

const LINKS = {
  Platform: [
    { label: "Blog",      href: "/blog" },
    { label: "Tools",     href: "/tools" },
    { label: "Flutter",   href: "/flutter" },
    { label: "AI Tools",  href: "/ai-tools" },
  ],
  Tools: [
    { label: "QR Code Generator",     href: "/tools/qr-generator" },
    { label: "JSON Formatter",         href: "/tools/json-formatter" },
    { label: "Password Generator",     href: "/tools/password-generator" },
    { label: "Base64 Encoder",         href: "/tools/base64" },
    { label: "UUID Generator",         href: "/tools/uuid-generator" },
  ],
  Company: [
    { label: "About",           href: "/about" },
    { label: "Contact",         href: "/contact" },
    { label: "Privacy Policy",  href: "/privacy-policy" },
    { label: "Terms of Service",href: "/terms" },
    { label: "Portfolio",       href: "https://portfolio.bidev.site" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="text-xl font-bold">
              bi<span className="text-accent">dev</span>.site
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed">
              Learn Flutter, build better apps, and explore free developer tools.
            </p>
            <div className="flex gap-3">
              {[
                { label: "GitHub",   href: "https://github.com/BilalFali" },
                { label: "YouTube",  href: "https://youtube.com/@bidev97" },
                { label: "LinkedIn", href: "https://linkedin.com/in/falibilal" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ink-faint hover:text-ink-muted transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
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
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-faint">
          <p>© {new Date().getFullYear()} bidev.site · Built by Bilal Fali</p>
          <div className="flex gap-4">
            <Link href="/feed.xml" className="hover:text-ink-muted transition-colors">RSS Feed</Link>
            <Link href="/sitemap.xml" className="hover:text-ink-muted transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
