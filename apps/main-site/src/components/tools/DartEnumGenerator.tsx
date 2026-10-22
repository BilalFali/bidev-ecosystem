"use client";

import { useState, useCallback } from "react";
import { ListOrdered, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generateDartEnum } from "@/lib/dart-enum-generator";

const EXAMPLE = `Active
Inactive
Pending
Archived`;

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-9 h-5 rounded-full transition-colors ${value ? "bg-accent" : "bg-bg-elevated border border-border"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-4" : ""}`}
      />
    </button>
  );
}

export function DartEnumGenerator() {
  const [input, setInput] = useState(EXAMPLE);
  const [name, setName] = useState("Status");
  const [fromString, setFromString] = useState(true);
  const [toJson, setToJson] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => {
    setError("");
    try {
      setOutput(generateDartEnum(input, { name: name || "MyEnum", fromString, toJson }));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, name, fromString, toJson]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-ink-faint mb-3">
          <a href="/tools" className="hover:text-accent transition-colors">Tools</a>
          <span>/</span>
          <span className="text-ink-muted">Dart Enum Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">Dart Enum Generator</h1>
        <p className="text-ink-muted max-w-2xl">
          Generate a Dart 3 enhanced enum from a list of values, with optional{" "}
          <code className="text-accent text-sm">fromString</code> and{" "}
          <code className="text-accent text-sm">toJson</code> helpers.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-border bg-bg-elevated mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-ink-faint whitespace-nowrap">Enum name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
            placeholder="Status"
            className="w-28 px-2.5 py-1.5 rounded-lg bg-bg-card border border-border text-sm text-ink focus:outline-none focus:border-accent"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <ToggleSwitch value={fromString} onChange={setFromString} />
          <span className="text-sm text-ink-muted">fromString</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <ToggleSwitch value={toJson} onChange={setToJson} />
          <span className="text-sm text-ink-muted">toJson</span>
        </label>

        <Button onClick={run} size="md" prompt className="ml-auto">Generate</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">Values (one per line, or comma-separated)</span>
            <button
              onClick={() => { setInput(EXAMPLE); setError(""); }}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
            >
              Load example
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={"Active\nInactive\nPending"}
            className="h-96 p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink focus:outline-none focus:border-accent resize-none leading-relaxed"
          />
          {error && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">Dart Output</span>
            {output && (
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1 text-xs transition-colors ${copied ? "text-green-400" : "text-accent hover:text-accent-hover"}`}
              >
                {copied && <Check className="w-3 h-3" strokeWidth={2.5} />}
                {copied ? "Copied!" : "Copy all"}
              </button>
            )}
          </div>
          {output ? (
            <pre className="h-96 p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink overflow-auto leading-relaxed whitespace-pre">
              {output}
            </pre>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-card text-ink-faint gap-3">
              <ListOrdered className="w-9 h-9" strokeWidth={1.5} />
              <p className="text-sm">Enter values and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
