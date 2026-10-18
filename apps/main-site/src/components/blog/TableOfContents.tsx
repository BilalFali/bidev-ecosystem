"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/toc";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <div className="p-4 rounded-xl border border-border bg-bg-card">
      <p className="text-xs font-mono text-ink-faint mb-3">// on this page</p>
      <nav aria-label="On this page" className="flex flex-col gap-1">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`text-sm py-1 leading-snug transition-colors border-l-2 ${
              h.level === 3 ? "pl-5" : "pl-3"
            } ${
              active === h.id
                ? "text-accent-light border-accent bg-accent/5"
                : "text-ink-muted border-transparent hover:text-ink hover:border-border-strong"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
