"use client";

import { useMemo, useState } from "react";
import { AdSlot } from "@bidev/ui";

const QUICK_PATTERNS = [
  { label: "Email", pattern: "[\\w.+-]+@[\\w-]+\\.[\\w.-]+" },
  { label: "URL", pattern: "https?:\\/\\/[\\w.-]+(?:\\.[a-z]{2,})+[\\w\\-._~:/?#[\\]@!$&'()*+,;=]*" },
  { label: "Phone", pattern: "\\+?\\d{1,3}[\\s-]?\\(?\\d{2,4}\\)?[\\s-]?\\d{3,4}[\\s-]?\\d{3,4}" },
];

const FLAGS: { key: "g" | "i" | "m" | "s"; label: string }[] = [
  { key: "g", label: "Global" },
  { key: "i", label: "Ignore case" },
  { key: "m", label: "Multiline" },
  { key: "s", label: "Dot-all" },
];

interface MatchInfo {
  text: string;
  index: number;
  groups: string[];
}

function buildHighlighted(testString: string, matches: MatchInfo[]): { key: string; text: string; isMatch: boolean }[] {
  if (matches.length === 0) return [{ key: "0", text: testString, isMatch: false }];
  const parts: { key: string; text: string; isMatch: boolean }[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.index > cursor) parts.push({ key: `pre-${i}`, text: testString.slice(cursor, m.index), isMatch: false });
    parts.push({ key: `match-${i}`, text: m.text, isMatch: true });
    cursor = m.index + m.text.length;
  });
  if (cursor < testString.length) parts.push({ key: "tail", text: testString.slice(cursor), isMatch: false });
  return parts;
}

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<Set<string>>(new Set(["g"]));
  const [testString, setTestString] = useState("Contact us at hello@bidev.dev or visit https://bidev.dev");

  function toggleFlag(flag: string) {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  }

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [] as MatchInfo[], error: "" };
    try {
      const regex = new RegExp(pattern, Array.from(flags).join(""));
      const found: MatchInfo[] = [];
      if (flags.has("g")) {
        for (const m of testString.matchAll(regex)) {
          found.push({ text: m[0], index: m.index ?? 0, groups: m.slice(1) as string[] });
        }
      } else {
        const m = regex.exec(testString);
        if (m) found.push({ text: m[0], index: m.index, groups: m.slice(1) as string[] });
      }
      return { matches: found, error: "" };
    } catch (e) {
      return { matches: [] as MatchInfo[], error: e instanceof Error ? e.message : "Invalid regular expression." };
    }
  }, [pattern, flags, testString]);

  const highlighted = useMemo(() => buildHighlighted(testString, matches), [testString, matches]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <nav className="text-xs text-ink-faint mb-5">
        <a href="/tools" className="hover:text-ink-muted transition-colors">Tools</a> / Regex Tester
      </nav>
      <h1 className="text-3xl font-bold text-ink mb-2">Regex Tester</h1>
      <p className="text-ink-muted mb-8">Test regular expressions live against sample text.</p>

      <AdSlot type="banner" className="mb-8" />

      <div className="flex flex-col gap-5 p-6 rounded-xl border border-border bg-bg-card">
        <div>
          <label className="text-xs text-ink-muted mb-1.5 block">Pattern</label>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-bg-elevated border border-border focus-within:border-accent transition-colors">
            <span className="text-ink-faint font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="[\\w.+-]+@[\\w-]+\\.[\\w.-]+"
              className="flex-1 bg-transparent text-sm font-mono text-ink placeholder:text-ink-faint outline-none"
            />
            <span className="text-ink-faint font-mono">/{Array.from(flags).join("")}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {FLAGS.map((f) => (
            <label key={f.key} className="flex items-center gap-2 cursor-pointer select-none text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={flags.has(f.key)}
                onChange={() => toggleFlag(f.key)}
                className="accent-cyan-400"
              />
              {f.label} ({f.key})
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-ink-faint self-center">Quick patterns:</span>
          {QUICK_PATTERNS.map((q) => (
            <button
              key={q.label}
              onClick={() => setPattern(q.pattern)}
              className="text-xs px-3 py-1 rounded-full border border-border bg-bg-elevated text-ink-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              {q.label}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs text-ink-muted mb-1.5 block">Test string</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            rows={5}
            className="w-full px-3 py-2.5 rounded-lg bg-bg-elevated border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors text-sm font-mono resize-y"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
        )}

        {!error && pattern && (
          <>
            <div>
              <p className="text-xs text-ink-faint mb-2">
                {matches.length} match{matches.length === 1 ? "" : "es"}
              </p>
              <div className="px-3 py-2.5 rounded-lg bg-bg-elevated border border-border text-sm font-mono whitespace-pre-wrap break-words">
                {highlighted.map((part) =>
                  part.isMatch ? (
                    <mark key={part.key} className="bg-accent/25 text-accent rounded px-0.5">{part.text}</mark>
                  ) : (
                    <span key={part.key} className="text-ink-muted">{part.text}</span>
                  )
                )}
              </div>
            </div>

            {matches.length > 0 && (
              <div className="flex flex-col gap-2">
                {matches.map((m, i) => (
                  <div key={i} className="px-4 py-2.5 rounded-lg border border-border bg-bg-elevated text-sm">
                    <span className="text-ink-faint">Match {i + 1}:</span>{" "}
                    <span className="font-mono text-ink">{m.text}</span>
                    {m.groups.length > 0 && (
                      <span className="text-ink-faint">
                        {" "}— groups: <span className="font-mono text-ink-muted">{m.groups.join(", ") || "(none)"}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AdSlot type="in-article" className="mt-8" />
    </div>
  );
}
