"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  url:   string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const enc = encodeURIComponent;

  const links = [
    {
      label: "Share on X",
      icon:  <Twitter className="w-4 h-4" />,
      href:  `https://x.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
    },
    {
      label: "Share on LinkedIn",
      icon:  <Linkedin className="w-4 h-4" />,
      href:  `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
  ];

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs text-ink-faint uppercase tracking-wider">Share</span>

      {links.map(({ label, icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-ink-muted hover:border-accent/40 hover:text-accent text-xs transition-colors"
        >
          {icon}
          <span className="hidden sm:inline">{label.replace("Share on ", "")}</span>
        </a>
      ))}

      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-ink-muted hover:border-accent/40 hover:text-accent text-xs transition-colors"
      >
        {copied
          ? <><Check className="w-4 h-4 text-green-400" /><span className="hidden sm:inline text-green-400">Copied!</span></>
          : <><Link2 className="w-4 h-4" /><span className="hidden sm:inline">Copy link</span></>
        }
      </button>
    </div>
  );
}
