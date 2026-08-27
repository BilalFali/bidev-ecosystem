"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy } from "lucide-react";

export function ErrorMessageBlock({ message }: { message: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-xl border border-red-500/25 bg-red-500/5 overflow-hidden mb-8">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-red-500/20 bg-red-500/10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          Error
        </div>
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-all ${
            copied
              ? "bg-green-500/15 border-green-500/30 text-green-400"
              : "bg-bg-card border-border text-ink-muted hover:text-ink hover:border-border-strong"
          }`}
          aria-label="Copy error message"
        >
          {copied ? <Check className="w-3 h-3" strokeWidth={2.5} /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-3 text-sm font-mono text-ink overflow-x-auto whitespace-pre-wrap break-words select-text">
        {message}
      </pre>
    </div>
  );
}
