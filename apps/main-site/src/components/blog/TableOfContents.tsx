"use client";

import { useEffect, useState } from "react";

interface Heading { id: string; text: string; level: number }

function extractHeadings(content: string): Heading[] {
  const re = /^(#{2,3})\s+(.+)$/gm;
  const out: Heading[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const text = m[2].trim();
    const id   = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    out.push({ id, text, level: m[1].length });
  }
  return out;
}

export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el!));
    return () => obs.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className="p-4 rounded-xl border border-border bg-bg-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint mb-4">On this page</p>
      <nav className="flex flex-col gap-1">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`text-xs py-1 leading-snug transition-colors border-l-2 pl-3 ${
              h.level === 3 ? "pl-5" : ""
            } ${
              active === h.id
                ? "text-accent border-accent"
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
