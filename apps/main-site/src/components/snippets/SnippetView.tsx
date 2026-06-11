"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  code: string;
  language: string;
}

export function SnippetView({ code, language }: Props) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lines = code.split("\n");

  return (
    <div className="relative rounded-xl border border-border bg-bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-elevated">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          </div>
          <span className="text-xs text-ink-faint ml-1">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`text-xs px-3 py-1 rounded-md border transition-all ${
            copied
              ? "bg-green-500/15 border-green-500/30 text-green-400"
              : "bg-bg-card border-border text-ink-muted hover:text-ink hover:border-border-strong"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>

      {/* Code with line numbers */}
      <div className="overflow-auto max-h-[600px]">
        <pre ref={preRef} className="text-sm font-mono leading-relaxed p-0">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="hover:bg-white/[0.02] group">
                  <td className="select-none w-12 text-right pr-4 py-0 pl-4 text-ink-faint text-xs leading-6 border-r border-border/30 group-hover:text-ink-muted transition-colors">
                    {i + 1}
                  </td>
                  <td className="py-0 pl-4 pr-4 leading-6 text-ink">
                    {line || " "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </pre>
      </div>
    </div>
  );
}
