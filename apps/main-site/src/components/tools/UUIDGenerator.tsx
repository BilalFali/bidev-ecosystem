"use client";

import { useState } from "react";
import { AdSlot } from "@bidev/ui";

function genUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function UUIDGenerator() {
  const [count,    setCount]    = useState(5);
  const [uuids,    setUuids]    = useState<string[]>([]);
  const [copiedI,  setCopiedI]  = useState<number|null>(null);
  const [copiedAll,setCopiedAll]= useState(false);
  const [upper,    setUpper]    = useState(false);

  const generate = () => setUuids(Array.from({length: count}, () => upper ? genUUID().toUpperCase() : genUUID()));

  const copyOne = async (uuid: string, i: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedI(i); setTimeout(()=>setCopiedI(null),2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true); setTimeout(()=>setCopiedAll(false),2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <nav className="text-xs text-ink-faint mb-5">
        <a href="/tools" className="hover:text-ink-muted transition-colors">Tools</a> / UUID Generator
      </nav>
      <h1 className="text-3xl font-bold text-ink mb-2">UUID Generator</h1>
      <p className="text-ink-muted mb-8">Generate RFC-4122 v4 UUIDs using <code className="text-accent bg-accent/10 px-1 rounded text-sm">crypto.randomUUID()</code></p>

      <AdSlot type="banner" className="mb-8" />

      <div className="flex flex-col gap-5 p-6 rounded-xl border border-border bg-bg-card">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-ink-muted">Count</label>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={20} value={count} onChange={e => setCount(+e.target.value)}
                className="w-32 accent-cyan-400 cursor-pointer" />
              <span className="font-mono font-bold text-accent w-6">{count}</span>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className={`w-9 h-5 rounded-full border transition-colors ${upper ? "bg-accent border-accent" : "bg-bg-elevated border-border"}`}
              onClick={() => setUpper(u => !u)}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white m-0.5 transition-transform ${upper ? "translate-x-4" : ""}`} />
            </div>
            <span className="text-sm text-ink-muted">Uppercase</span>
          </label>
          <button onClick={generate}
            className="ml-auto px-6 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors">
            Generate
          </button>
        </div>

        {uuids.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-ink-faint">{uuids.length} UUID{uuids.length > 1 ? "s" : ""} generated</span>
              <button onClick={copyAll} className="text-xs text-accent hover:text-accent-hover transition-colors">
                {copiedAll ? "Copied all!" : "Copy all"}
              </button>
            </div>
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-border bg-bg-elevated hover:border-border-strong transition-colors group">
                <span className="font-mono text-sm text-ink tracking-wider">{uuid}</span>
                <button onClick={() => copyOne(uuid, i)}
                  className="text-xs text-ink-faint group-hover:text-accent transition-colors whitespace-nowrap">
                  {copiedI === i ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdSlot type="in-article" className="mt-8" />
    </div>
  );
}
