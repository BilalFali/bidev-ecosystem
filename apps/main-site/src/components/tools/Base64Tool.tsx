"use client";

import { useState } from "react";
import { AdSlot } from "@bidev/ui";

type Mode = "encode" | "decode";

function encode(str: string) {
  try { return btoa(unescape(encodeURIComponent(str))); }
  catch { return "Error: invalid input"; }
}

function decode(str: string) {
  try { return decodeURIComponent(escape(atob(str.trim()))); }
  catch { return "Error: invalid Base64 string"; }
}

export function Base64Tool() {
  const [mode,    setMode]    = useState<Mode>("encode");
  const [input,   setInput]   = useState("");
  const [copied,  setCopied]  = useState(false);

  const output = input.trim() ? (mode === "encode" ? encode(input) : decode(input)) : "";

  const swap = () => {
    setMode(m => m === "encode" ? "decode" : "encode");
    setInput(output);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <nav className="text-xs text-ink-faint mb-5">
        <a href="/tools" className="hover:text-ink-muted transition-colors">Tools</a> / Base64
      </nav>
      <h1 className="text-3xl font-bold text-ink mb-2">Base64 Encoder / Decoder</h1>
      <p className="text-ink-muted mb-8">Encode or decode Base64 strings — client-side, nothing sent to any server.</p>

      <AdSlot type="banner" className="mb-8" />

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-bg-card border border-border rounded-lg max-w-xs mb-6">
        {(["encode","decode"] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-md text-sm font-medium capitalize transition-colors ${mode === m ? "bg-accent text-bg" : "text-ink-muted hover:text-ink"}`}>
            {m}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">{mode === "encode" ? "Plain Text" : "Base64"}</span>
            <button onClick={() => setInput("")} className="text-xs text-ink-faint hover:text-ink-muted transition-colors">Clear</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode…" : "Paste Base64 to decode…"}
            spellCheck={false}
            className="w-full h-72 p-4 rounded-xl border border-border bg-bg-card text-ink font-mono text-sm resize-y focus:outline-none focus:border-accent transition-colors leading-relaxed" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">{mode === "encode" ? "Base64 Output" : "Decoded Text"}</span>
            <div className="flex gap-3">
              <button onClick={swap} className="text-xs text-accent hover:text-accent-hover transition-colors">⇄ Swap</button>
              <button onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                disabled={!output} className="text-xs text-accent hover:text-accent-hover disabled:opacity-30 transition-colors">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <textarea value={output} readOnly spellCheck={false}
            placeholder="Output appears here…"
            className={`w-full h-72 p-4 rounded-xl border bg-bg-card text-ink font-mono text-sm resize-y leading-relaxed ${output.startsWith("Error") ? "border-red-500/40 text-red-400" : "border-border"}`} />
        </div>
      </div>
      <AdSlot type="in-article" className="mt-8" />
    </div>
  );
}
