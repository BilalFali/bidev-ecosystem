"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SearchBox } from "@/components/ui/SearchBox";
import type { Category } from "@/lib/categories";

export function Header({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-6">
          <Link href="/" className="shrink-0">
            <span className="font-display text-xl font-semibold text-ink">
              BiDev <span className="text-accent">Tech</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="px-3 py-2 text-sm text-ink-muted hover:text-ink border-b-2 border-transparent hover:border-accent transition-colors whitespace-nowrap"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block ml-auto">
            <SearchBox />
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="lg:hidden ml-auto p-2 text-ink-muted hover:text-ink transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile category rail — always visible, not hidden behind the hamburger */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border border-border text-ink-muted hover:text-ink hover:border-border-strong transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-paper-raised px-4 py-4 flex flex-col gap-3">
          <SearchBox />
        </div>
      )}
    </header>
  );
}
