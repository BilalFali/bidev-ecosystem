import Link from "next/link";
import { BuyMeCoffee } from "@/components/BuyMeCoffee";
import { LogoMark } from "@/components/layout/LogoMark";
import { SOCIAL_LINKS, PORTFOLIO_URL } from "@/lib/site-links";

const LINKS = {
  Platform: [
    { label: "Articles",       href: "/blog" },
    { label: "Topics",         href: "/topics" },
    { label: "Snippets",       href: "/snippets" },
    { label: "Tools",          href: "/tools" },
    { label: "UI Examples",    href: "/ui-examples" },
    { label: "AI Tools",       href: "/ai-tools" },
    { label: "Resources",      href: "/resources" },
    { label: "Interview Prep", href: "/flutter-interview-questions" },
    { label: "Jobs",           href: "/jobs" },
    { label: "Products",       href: "/products" },
    { label: "Packages",       href: "/packages" },
    { label: "Flutter",        href: "/flutter" },
  ],
  Community: [
    { label: "About",          href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms",          href: "/terms" },
    { label: "Portfolio",      href: PORTFOLIO_URL },
  ],
  Social: [
    ...SOCIAL_LINKS,
    { label: "RSS Feed", href: "/feed.xml" },
    { label: "Sitemap",  href: "/sitemap.xml" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-ink">
              <LogoMark size="sm" />
              BiDev
            </Link>
            <p className="text-sm text-ink-faint leading-relaxed max-w-[240px]">
              Flutter tutorials, fixes for real errors, and free developer tools.
            </p>
            <BuyMeCoffee variant="footer" />
          </div>

          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-3">
              <h3 className="text-xs font-mono text-ink-faint">{`// ${section.toLowerCase()}`}</h3>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-ink-muted hover:text-accent-light transition-colors"
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border text-xs text-ink-faint">
          <p>&copy; {new Date().getFullYear()} BiDev. Built for Flutter developers.</p>
        </div>
      </div>
    </footer>
  );
}
