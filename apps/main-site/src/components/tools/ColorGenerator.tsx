"use client";

import { useMemo, useState } from "react";
import { AdSlot } from "@bidev/ui";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

const SWATCH_LIGHTNESS = [90, 75, 60, 45, 30, 15];

export function ColorGenerator() {
  const [seed, setSeed] = useState("#0175C2");
  const [copied, setCopied] = useState(false);

  const swatches = useMemo(() => {
    const [h, s] = hexToHsl(seed);
    return SWATCH_LIGHTNESS.map((l) => ({ l, hex: hslToHex(h, s, l) }));
  }, [seed]);

  const snippet = `ColorScheme.fromSeed(seedColor: Color(0xFF${seed.replace("#", "").toUpperCase()}))`;

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <nav className="text-xs text-ink-faint mb-5">
        <a href="/tools" className="hover:text-ink-muted transition-colors">Tools</a> / Color Generator
      </nav>
      <h1 className="text-3xl font-bold text-ink mb-2">Color Generator</h1>
      <p className="text-ink-muted mb-8">
        Pick a seed color, preview tints &amp; shades, and copy a ready-to-use Flutter snippet.
      </p>

      <AdSlot type="banner" className="mb-8" />

      <div className="flex flex-col gap-5 p-6 rounded-xl border border-border bg-bg-card">
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={seed}
            onChange={(e) => setSeed(e.target.value.toUpperCase())}
            className="w-14 h-14 rounded-lg border border-border cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value.toUpperCase())}
            className="flex-1 px-3 py-2.5 rounded-lg bg-bg-elevated border border-border text-ink font-mono text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <p className="text-xs text-ink-muted mb-2">Tints &amp; shades (for reference)</p>
          <div className="grid grid-cols-6 gap-2">
            {swatches.map((sw) => (
              <div key={sw.l} className="flex flex-col gap-1.5 items-center">
                <div className="w-full h-12 rounded-lg border border-border" style={{ backgroundColor: sw.hex }} />
                <span className="text-[10px] font-mono text-ink-faint">{sw.hex}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-ink-muted mb-2">Flutter code</p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-bg-elevated border border-border">
            <code className="flex-1 text-sm font-mono text-accent overflow-x-auto whitespace-nowrap">{snippet}</code>
            <button onClick={copySnippet} className="text-xs text-accent hover:text-accent-hover transition-colors shrink-0">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-ink-faint mt-2">
            Pass this into <code className="text-ink-muted">ThemeData(colorScheme: ...)</code> — Flutter generates the full
            tonal palette for you. This tool shows a quick visual preview only, not Material&apos;s exact algorithm.
          </p>
        </div>
      </div>

      <AdSlot type="in-article" className="mt-8" />
    </div>
  );
}
