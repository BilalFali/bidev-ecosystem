"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Blog",      href: "/blog" },
  { label: "Snippets",  href: "/snippets" },
  { label: "Tools",     href: "/tools" },
  { label: "Resources", href: "/resources" },
  { label: "Flutter",   href: "/flutter" },
  { label: "About",     href: "/about" },
];

export function Header() {
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [mounted,   setMounted]   = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) => {
    if (!mounted) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass border-b border-border" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-ink">
              bi<span className="text-accent">dev</span>.site
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-accent bg-accent/10"
                    : "text-ink-muted hover:text-ink hover:bg-bg-elevated"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/tools"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors"
            >
              Free Tools
            </Link>

            <button
              className="md:hidden p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-elevated transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span className="block w-5 h-0.5 bg-current mb-1.5 transition-transform" />
              <span className={`block w-5 h-0.5 bg-current mb-1.5 transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className="block w-5 h-0.5 bg-current transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-bg-secondary">
          <nav className="flex flex-col p-4 gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-accent bg-accent/10"
                    : "text-ink-muted hover:text-ink hover:bg-bg-elevated"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/tools"
              className="mt-2 px-4 py-3 rounded-lg bg-accent text-bg text-sm font-semibold text-center hover:bg-accent-hover transition-colors"
            >
              Explore Free Tools
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
