import Link from "next/link";
import type { Category } from "@/lib/categories";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          <div>
            <span className="font-display text-lg font-semibold text-ink">
              BiDev <span className="text-accent">Tech</span>
            </span>
            <p className="text-sm text-ink-muted mt-2 max-w-xs">
              A technology magazine covering AI, hardware, big tech, security, and the future of computing.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-faint mb-3">Categories</p>
            <div className="flex flex-col gap-2">
              {categories.map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} className="text-sm text-ink-muted hover:text-ink transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-faint mb-3">BiDev</p>
            <div className="flex flex-col gap-2">
              <a href="https://bidev.dev" className="text-sm text-ink-muted hover:text-ink transition-colors">bidev.dev</a>
              <Link href="/about" className="text-sm text-ink-muted hover:text-ink transition-colors">About</Link>
              <Link href="/privacy-policy" className="text-sm text-ink-muted hover:text-ink transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-border text-xs text-ink-faint">
          © {new Date().getFullYear()} BiDev Tech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
