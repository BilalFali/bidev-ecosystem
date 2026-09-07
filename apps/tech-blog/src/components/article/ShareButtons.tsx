"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const items = [
    { label: "Share on X", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { label: "Share on LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <div className="flex items-center gap-3">
      {items.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="p-2 text-ink-muted hover:text-ink transition-colors"
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
      <button onClick={copyLink} aria-label="Copy link" className="p-2 text-ink-muted hover:text-ink transition-colors">
        {copied ? <Check className="w-4 h-4 text-data" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
