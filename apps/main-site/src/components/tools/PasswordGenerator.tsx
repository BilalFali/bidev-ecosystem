"use client";

import { useState, useCallback } from "react";
import { AdSlot } from "@bidev/ui";

const CHARS = {
  upper:   "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower:   "abcdefghijklmnopqrstuvwxyz",
  digits:  "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

type Key = keyof typeof CHARS;

function score(pw: string) {
  let s = 0;
  if (pw.length >= 8)            s++;
  if (pw.length >= 14)           s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[a-z]/.test(pw))         s++;
  if (/\d/.test(pw))            s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const n = Math.min(4, Math.floor((s / 6) * 5));
  return { n, label: ["Very Weak","Weak","Fair","Strong","Very Strong"][n], color: ["#ef4444","#f97316","#eab308","#22c55e","#16a34a"][n] };
}

function gen(len: number, opts: Record<Key, boolean>) {
  let pool = ""; const req: string[] = [];
  (Object.keys(opts) as Key[]).forEach(k => {
    if (!opts[k]) return;
    pool += CHARS[k];
    req.push(CHARS[k][Math.floor(Math.random() * CHARS[k].length)]);
  });
  if (!pool) return "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  const chars = Array.from(arr, n => pool[n % pool.length]);
  req.forEach(c => { chars[Math.floor(Math.random() * len)] = c; });
  return chars.join("");
}

export function PasswordGenerator() {
  const [len,      setLen]      = useState(16);
  const [opts,     setOpts]     = useState<Record<Key,boolean>>({ upper:true, lower:true, digits:true, symbols:false });
  const [pws,      setPws]      = useState<string[]>([]);
  const [copiedI,  setCopiedI]  = useState<number|null>(null);
  const active = Object.values(opts).filter(Boolean).length;

  const generate = useCallback(() => {
    setPws(Array.from({length:5}, () => gen(len, opts)));
  }, [len, opts]);

  const toggle = (k: Key, v: boolean) => {
    const next = {...opts, [k]:v};
    if (!Object.values(next).some(Boolean)) return;
    setOpts(next);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <nav className="text-xs text-ink-faint mb-5">
        <a href="/tools" className="hover:text-ink-muted transition-colors">Tools</a> / Password Generator
      </nav>
      <h1 className="text-3xl font-bold text-ink mb-2">Password Generator</h1>
      <p className="text-ink-muted mb-8">Cryptographically secure passwords via Web Crypto API — nothing leaves your browser.</p>

      <AdSlot type="banner" className="mb-8" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="flex flex-col gap-5 p-6 rounded-xl border border-border bg-bg-card">
          <h2 className="font-bold text-ink">Settings</h2>

          {/* Length */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-sm text-ink">Length</span>
              <span className="text-sm font-mono font-bold text-accent">{len}</span>
            </div>
            <input type="range" min={6} max={64} value={len} onChange={e => setLen(+e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer" />
            <div className="flex justify-between text-xs text-ink-faint"><span>6</span><span>64</span></div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-ink">Character types</span>
            {(Object.keys(CHARS) as Key[]).map(k => {
              const labels: Record<Key,string> = { upper:"Uppercase (A–Z)", lower:"Lowercase (a–z)", digits:"Numbers (0–9)", symbols:"Symbols (!@#$…)" };
              const isLast = opts[k] && active === 1;
              return (
                <button
                  key={k}
                  onClick={() => toggle(k, !opts[k])}
                  disabled={isLast}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                    opts[k] ? "bg-accent/10 border-accent/30 text-accent" : "bg-bg-elevated border-border text-ink-muted hover:border-border-strong"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {labels[k]}
                  <span className={`w-4 h-4 rounded border flex items-center justify-center ${opts[k] ? "bg-accent border-accent" : "border-border"}`}>
                    {opts[k] && <span className="text-bg text-[10px]">✓</span>}
                  </span>
                </button>
              );
            })}
          </div>

          <button onClick={generate} className="w-full py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors">
            Generate Passwords
          </button>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-3">
          {pws.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 rounded-xl border border-border bg-bg-card min-h-[300px]">
              <span className="text-4xl opacity-20">🔐</span>
              <p className="text-sm text-ink-faint">Click "Generate Passwords"</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-bold text-ink">Generated Passwords</h2>
                <button onClick={generate} className="text-xs text-accent hover:text-accent-hover transition-colors">Regenerate ↺</button>
              </div>
              {pws.map((pw, i) => {
                const s = score(pw);
                return (
                  <div key={i} className="p-4 rounded-xl border border-border bg-bg-card flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-sm text-ink break-all">{pw}</span>
                      <button
                        onClick={async () => { await navigator.clipboard.writeText(pw); setCopiedI(i); setTimeout(()=>setCopiedI(null),2000); }}
                        className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-border bg-bg-elevated text-xs text-ink hover:border-border-strong transition-colors"
                      >{copiedI === i ? "Copied!" : "Copy"}</button>
                    </div>
                    {/* Strength bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        {Array.from({length:5}, (_,j) => (
                          <div key={j} className="flex-1 h-1 rounded-full transition-colors"
                            style={{ background: j <= s.n ? s.color : "#1e1e1e" }} />
                        ))}
                      </div>
                      <span className="text-xs text-ink-faint whitespace-nowrap">{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <AdSlot type="sidebar" className="mt-2" />
        </div>
      </div>
    </div>
  );
}
