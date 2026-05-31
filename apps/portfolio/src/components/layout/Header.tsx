"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "About",      href: "/about" },
  { label: "Projects",   href: "/projects" },
  { label: "Services",   href: "/services" },
  { label: "Experience", href: "/experience" },
  { label: "Contact",    href: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => { const h = () => setScrolled(window.scrollY > 12); window.addEventListener("scroll", h, {passive:true}); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "glass border-b border-border" : "border-b border-transparent"}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          <span className="text-ink">Bilal</span><span className="text-accent"> Fali</span>
        </Link>
        <nav className="hidden md:flex gap-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith(n.href) ? "text-accent bg-accent/10" : "text-ink-muted hover:text-ink hover:bg-bg-elevated"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="https://drive.google.com/file/d/1EwRJ_6Ns7tWK7AIOCP6MSJx3Qamc5_Xr" target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-border bg-bg-card text-sm font-medium text-ink hover:border-border-strong transition-colors">
            Resume ↗
          </a>
          <button className="md:hidden p-2 rounded-lg text-ink-muted hover:bg-bg-elevated" onClick={() => setOpen(!open)}>
            <span className="block w-5 h-0.5 bg-current mb-1" /><span className="block w-5 h-0.5 bg-current mb-1" /><span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-bg-secondary">
          <nav className="flex flex-col p-4 gap-1">
            {NAV.map(n => <Link key={n.href} href={n.href} className="px-4 py-3 rounded-lg text-sm text-ink-muted hover:text-ink hover:bg-bg-elevated transition-colors">{n.label}</Link>)}
          </nav>
        </div>
      )}
    </header>
  );
}
