"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Menu, Home, Wrench, BookOpen, Code2 } from "lucide-react";
import { LogoMark } from "@/components/layout/LogoMark";
import { Button } from "@/components/ui/Button";

const NAV = [
  { label: "Articles", href: "/blog" },
  { label: "Learn", href: "/learn" },
  { label: "Troubleshooting", href: "/troubleshooting" },
  { label: "Tools", href: "/tools" },
  { label: "UI Examples", href: "/ui-examples" },
  { label: "AI", href: "/ai-tools" },
  { label: "Interview", href: "/flutter-interview-questions" },
];

const TABS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "Articles", href: "/blog", icon: BookOpen },
  { label: "Interview", href: "/flutter-interview-questions", icon: Code2 },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); setSearching(false); }, [pathname]);

  // Focus whichever input is actually visible (the other one is display:none).
  useEffect(() => {
    if (!searching) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    (desktop ? desktopSearchRef : mobileSearchRef).current?.focus();
  }, [searching]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearching(true);
      }
      if (e.key === "Escape") setSearching(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isActive = (href: string) => {
    if (!mounted) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearching(false);
      setQuery("");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled ? "glass border-b border-border" : "border-b border-border/30"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="BiDev home">
              <LogoMark />
              <span className="text-base font-semibold tracking-tight text-ink">BiDev</span>
            </Link>

            <nav aria-label="Main" className="hidden md:flex items-stretch gap-6 self-stretch flex-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center text-sm border-b-2 transition-colors ${
                    isActive(item.href)
                      ? "text-accent-light border-accent font-medium"
                      : "text-ink-muted border-transparent hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 ml-auto">
              {searching ? (
                <form onSubmit={handleSearch}>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border focus-within:border-accent transition-colors w-56">
                    <Search className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                    <input
                      ref={desktopSearchRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search everything…"
                      aria-label="Search"
                      className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
                    />
                    <button type="button" aria-label="Close search" onClick={() => { setSearching(false); setQuery(""); }}>
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
                  <span className="hidden lg:block text-xs">Search guides, tools, questions…</span>
                  <kbd className="hidden lg:block text-[10px] px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono">⌘K</kbd>
                </button>
              )}
              <Button href="/#newsletter" size="sm">Subscribe</Button>
            </div>

            <div className="flex items-center md:hidden ml-auto">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-elevated transition-colors"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {searching && (
            <div className="md:hidden pb-3">
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated border border-border focus-within:border-accent transition-colors">
                  <Search className="w-4 h-4 text-ink-faint shrink-0" />
                  <input
                    ref={mobileSearchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search guides, tools, questions…"
                    aria-label="Search"
                    className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-bg-card">
            <nav aria-label="Menu" className="flex flex-col p-3 gap-0.5">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive(item.href)
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

      <nav
        aria-label="Quick navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-border px-3 pb-[env(safe-area-inset-bottom)] flex items-center justify-around"
      >
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive(tab.href) ? "page" : undefined}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg font-mono text-[10px] transition-colors active:scale-95 motion-reduce:active:scale-100 ${
              isActive(tab.href) ? "text-accent-light" : "text-ink-muted hover:text-accent-light"
            }`}
          >
            <tab.icon className="w-5 h-5" strokeWidth={1.75} />
            {tab.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => { setSearching(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg font-mono text-[10px] text-ink-muted hover:text-accent-light transition-colors active:scale-95 motion-reduce:active:scale-100"
        >
          <Search className="w-5 h-5" strokeWidth={1.75} />
          Search
        </button>
      </nav>
    </>
  );
}
