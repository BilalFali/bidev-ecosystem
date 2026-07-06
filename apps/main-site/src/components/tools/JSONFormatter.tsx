"use client";

import { useState, useCallback } from "react";
import { AdSlot } from "@bidev/ui";

type Status = "idle" | "valid" | "invalid";

function parse(raw: string): { status: Status; out: string; error: string | null; keys: number; depth: number } {
  if (!raw.trim()) return { status: "idle", out: "", error: null, keys: 0, depth: 0 };
  try {
    const parsed = JSON.parse(raw);
    const count = (o: unknown): number =>
      typeof o !== "object" || !o ? 0 : Array.isArray(o)
        ? (o as unknown[]).reduce((a: number, v) => a + count(v), 0)
        : Object.values(o as Record<string, unknown>).reduce((a: number, v) => a + 1 + count(v), 0);
    const depth = (o: unknown, d = 0): number =>
      typeof o !== "object" || !o ? d : Math.max(...(Array.isArray(o) ? (o as unknown[]) : Object.values(o as Record<string,unknown>)).map(v => depth(v, d+1)));
    return { status: "valid", out: JSON.stringify(parsed, null, 2), error: null, keys: count(parsed), depth: depth(parsed) };
  } catch (e) {
    return { status: "invalid", out: raw, error: (e as Error).message, keys: 0, depth: 0 };
  }
}

const SAMPLE = `{"name":"bidev","version":"1.0","tools":["qr","json","password"],"meta":{"author":"Bilal Fali","site":"https://bidev.dev"}}`;

export function JSONFormatter() {
  const [input,   setInput]   = useState("");
  const [result,  setResult]  = useState(parse(""));
  const [output,  setOutput]  = useState("");
  const [mini,    setMini]    = useState(false);
  const [copied,  setCopied]  = useState(false);

  const process = useCallback((raw: string) => {
    const r = parse(raw); setResult(r);
    setOutput(r.status === "valid" ? r.out : raw); setMini(false);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <nav className="text-xs text-ink-faint mb-5">
        <a href="/tools" className="hover:text-ink-muted transition-colors">Tools</a> / JSON Formatter
      </nav>
      <h1 className="text-3xl font-bold text-ink mb-2">JSON Formatter & Validator</h1>
      <p className="text-ink-muted mb-8">Paste JSON to format, validate, or minify — 100% client-side.</p>

      <AdSlot type="banner" className="mb-8" />

      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
            result.status === "valid"   ? "bg-green-500/10 text-green-400 border-green-500/25" :
            result.status === "invalid" ? "bg-red-500/10 text-red-400 border-red-500/25" :
            "bg-bg-elevated text-ink-muted border-border"
          }`}>
            {result.status === "valid" ? "✓ Valid JSON" : result.status === "invalid" ? "✗ Invalid JSON" : "Paste JSON below"}
          </span>
          {result.status === "valid" && (
            <>
              <span className="text-xs text-ink-faint">{result.keys} keys</span>
              <span className="text-xs text-ink-faint">depth {result.depth}</span>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setInput(SAMPLE); process(SAMPLE); }} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-xs text-ink-muted hover:border-border-strong transition-colors">Sample</button>
          <button onClick={() => { setInput(""); setOutput(""); setResult(parse("")); }} className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-xs text-ink-muted hover:border-border-strong transition-colors">Clear</button>
        </div>
      </div>

      {result.error && (
        <div className="flex items-start gap-2 p-3 mb-4 rounded-lg border border-red-500/25 bg-red-500/8 text-red-400 text-xs">
          <span>⚠</span><span className="font-mono">{result.error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">Input</span>
            <button onClick={() => process(input)} className="text-xs text-accent hover:text-accent-hover transition-colors">Format ↵</button>
          </div>
          <textarea
            value={input} onChange={(e) => { setInput(e.target.value); process(e.target.value); }}
            placeholder={`Paste your JSON here…\n\n{ "key": "value" }`}
            spellCheck={false}
            className={`w-full h-96 p-4 rounded-xl border bg-bg-card text-ink font-mono text-sm resize-y focus:outline-none focus:border-accent transition-colors leading-relaxed ${
              result.status === "invalid" ? "border-red-500/40" : "border-border"
            }`}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">Output</span>
              {mini && <span className="text-xs px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">minified</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { if (result.status !== "valid") return; const m = JSON.stringify(JSON.parse(input)); setOutput(m); setMini(true); }}
                disabled={result.status !== "valid"}
                className="text-xs text-ink-muted hover:text-ink disabled:opacity-30 transition-colors"
              >Minify</button>
              <button
                onClick={async () => { await navigator.clipboard.writeText(output||input); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                disabled={result.status === "idle"}
                className="text-xs text-accent hover:text-accent-hover disabled:opacity-30 transition-colors"
              >{copied ? "Copied!" : "Copy"}</button>
            </div>
          </div>
          <textarea
            value={output} readOnly spellCheck={false}
            placeholder="Formatted output appears here…"
            className={`w-full h-96 p-4 rounded-xl border bg-bg-card text-ink font-mono text-sm resize-y focus:outline-none transition-colors leading-relaxed ${
              result.status === "valid" ? "border-green-500/30" : "border-border"
            }`}
          />
        </div>
      </div>

      <AdSlot type="in-article" className="mt-8" />
    </div>
  );
}
