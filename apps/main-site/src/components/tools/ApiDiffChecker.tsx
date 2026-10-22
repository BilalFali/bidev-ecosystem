"use client";

import { useCallback, useState } from "react";
import { GitCompare, PlusCircle, MinusCircle, PencilLine, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { diffJson, type DiffEntry } from "@/lib/api-diff";

const EXAMPLE_BEFORE = `{
  "id": 1,
  "name": "Bilal Fali",
  "status": "active",
  "roles": ["admin"]
}`;

const EXAMPLE_AFTER = `{
  "id": 1,
  "name": "Bilal Fali",
  "status": "ACTIVE",
  "roles": ["admin", "editor"],
  "email": "bilal@bidev.dev"
}`;

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

function stringifyValue(value: unknown): string {
  if (value === undefined) return "undefined";
  return typeof value === "string" ? value : JSON.stringify(value);
}

const KIND_META: Record<DiffEntry["kind"], { icon: typeof PlusCircle; label: string; className: string }> = {
  added: { icon: PlusCircle, label: "Added", className: "text-green-400 border-green-500/25 bg-green-500/10" },
  removed: { icon: MinusCircle, label: "Removed", className: "text-red-400 border-red-500/25 bg-red-500/10" },
  changed: { icon: PencilLine, label: "Changed", className: "text-amber-400 border-amber-500/25 bg-amber-500/10" },
};

export function ApiDiffChecker() {
  const [before, setBefore] = useState(EXAMPLE_BEFORE);
  const [after, setAfter] = useState(EXAMPLE_AFTER);
  const [diff, setDiff] = useState<DiffEntry[] | null>(null);
  const [error, setError] = useState("");

  const compare = useCallback(() => {
    setError("");
    try {
      const a = JSON.parse(before);
      const b = JSON.parse(after);
      setDiff(diffJson(a, b));
    } catch (e) {
      setError((e as Error).message);
      setDiff(null);
    }
  }, [before, after]);

  const handleUpload = async (file: File, which: "before" | "after") => {
    const text = await readFileAsText(file);
    if (which === "before") setBefore(text);
    else setAfter(text);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-ink-faint mb-3">
          <a href="/tools" className="hover:text-accent transition-colors">Tools</a>
          <span>/</span>
          <span className="text-ink-muted">API Response Diff Checker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">API Response Diff Checker</h1>
        <p className="text-ink-muted max-w-2xl">
          Compare two JSON payloads and see exactly what was added, removed, or changed — ignores
          key order, handles nested objects and arrays.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">Before</span>
            <label className="text-xs text-accent hover:text-accent-hover cursor-pointer transition-colors">
              Upload
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "before")}
              />
            </label>
          </div>
          <textarea
            value={before}
            onChange={(e) => setBefore(e.target.value)}
            spellCheck={false}
            className="h-80 p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink focus:outline-none focus:border-accent resize-none leading-relaxed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">After</span>
            <label className="text-xs text-accent hover:text-accent-hover cursor-pointer transition-colors">
              Upload
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "after")}
              />
            </label>
          </div>
          <textarea
            value={after}
            onChange={(e) => setAfter(e.target.value)}
            spellCheck={false}
            className="h-80 p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink focus:outline-none focus:border-accent resize-none leading-relaxed"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={compare} size="md" prompt>Compare</Button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-2xl mx-auto">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {diff && (
        <div className="mt-8 flex flex-col gap-2 max-w-3xl mx-auto">
          {diff.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              No differences found.
            </div>
          ) : (
            diff.map((entry, i) => {
              const meta = KIND_META[entry.kind];
              return (
                <div key={i} className={`flex items-start gap-2 px-4 py-2.5 rounded-lg border text-sm ${meta.className}`}>
                  <meta.icon className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono font-semibold">{entry.path || "(root)"}</span>
                    <span className="text-ink-faint"> — {meta.label}</span>
                    {entry.kind === "changed" && (
                      <div className="mt-1 font-mono text-xs">
                        <span className="text-red-400">- {stringifyValue(entry.before)}</span>
                        <br />
                        <span className="text-green-400">+ {stringifyValue(entry.after)}</span>
                      </div>
                    )}
                    {entry.kind === "added" && (
                      <div className="mt-1 font-mono text-xs text-green-400">+ {stringifyValue(entry.after)}</div>
                    )}
                    {entry.kind === "removed" && (
                      <div className="mt-1 font-mono text-xs text-red-400">- {stringifyValue(entry.before)}</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {!diff && !error && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-10 text-ink-faint">
          <GitCompare className="w-9 h-9" strokeWidth={1.5} />
          <p className="text-sm">Paste or upload two JSON payloads, then click Compare</p>
        </div>
      )}
    </div>
  );
}
