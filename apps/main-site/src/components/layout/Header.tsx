"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Menu } from "lucide-react";

const NAV = [
  { label: "Articles", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "Resources", href: "/resources" },
  { label: "Snippets", href: "/snippets" },
  { label: "Interview Prep", href: "/flutter-interview-questions" },
  { label: "Jobs", href: "/jobs" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); setSearching(false); }, [pathname]);

  useEffect(() => {
    if (searching) searchRef.current?.focus();
  }, [searching]);

  const isActive = (href: string) => {
    if (!mounted) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog?q=${encodeURIComponent(query.trim())}`);
      setSearching(false);
      setQuery("");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${scrolled ? "glass border-b border-border" : "border-b border-border/30"
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-base font-semibold tracking-tight text-ink">
              Bi<span className="text-accent-light">dev</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive(item.href)
                  ? "text-ink bg-bg-elevated font-medium"
                  : "text-ink-muted hover:text-ink hover:bg-bg-elevated"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search (desktop) */}
          <div className="hidden md:flex items-center ml-auto">
            {searching ? (
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border focus-within:border-accent transition-colors w-56">
                  <Search className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search articles…"
                    className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
                  />
                  <button type="button" onClick={() => { setSearching(false); setQuery(""); }}>
                    <X className="w-3.5 h-3.5 text-ink-faint hover:text-ink transition-colors" />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setSearching(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-ink-faint text-sm hover:text-ink hover:border-border-strong transition-all"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden lg:block text-xs">Search articles, topics…</span>
                <kbd className="hidden lg:block text-[10px] px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono">⌘K</kbd>
              </button>
            )}
          </div>

          {/* Mobile: search + hamburger */}
          <div className="flex items-center gap-2 md:hidden ml-auto">
            <button
              onClick={() => setSearching(!searching)}
              className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-elevated transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-elevated transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searching && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated border border-border focus-within:border-accent transition-colors">
                <Search className="w-4 h-4 text-ink-faint shrink-0" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, topics…"
                  className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-bg-card">
          <nav className="flex flex-col p-3 gap-0.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive(item.href)
                  ? "text-ink bg-bg-elevated font-medium"
                  : "text-ink-muted hover:text-ink hover:bg-bg-elevated"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
