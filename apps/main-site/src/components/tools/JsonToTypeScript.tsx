"use client";

import { useState, useCallback } from "react";
import { FileCode2, Zap, ShieldCheck, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generateTypeScript, type JsonToTsOptions } from "@/lib/json-to-typescript";

const EXAMPLE_JSON = `{
  "id": 1,
  "name": "Bilal Fali",
  "email": "bilal@bidev.dev",
  "isActive": true,
  "score": 98.5,
  "tags": ["flutter", "dart", "mobile"],
  "middleName": null,
  "address": {
    "street": "123 Dev Lane",
    "city": "Algiers"
  }
}`;

export function JsonToTypeScript() {
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [rootName, setRootName] = useState("User");
  const [useType, setUseType] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => {
    setError("");
    try {
      const opts: JsonToTsOptions = { rootName: rootName || "Root", useType };
      setOutput(generateTypeScript(input, opts));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, rootName, useType]);

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
          <span className="text-ink-muted">JSON to TypeScript</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">JSON to TypeScript Converter</h1>
        <p className="text-ink-muted max-w-2xl">
          Convert JSON to TypeScript <code className="text-accent text-sm">interface</code> or{" "}
          <code className="text-accent text-sm">type</code> declarations instantly — optional fields
          detected automatically from null values.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-border bg-bg-elevated mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-ink-faint whitespace-nowrap">Root name</label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
            placeholder="User"
            className="w-28 px-2.5 py-1.5 rounded-lg bg-bg-card border border-border text-sm text-ink focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-ink-faint">Output</label>
          <select
            value={useType ? "type" : "interface"}
            onChange={(e) => setUseType(e.target.value === "type")}
            className="px-2.5 py-1.5 rounded-lg bg-bg-card border border-border text-sm text-ink focus:outline-none focus:border-accent"
          >
            <option value="interface">interface</option>
            <option value="type">type</option>
          </select>
        </div>

        <Button onClick={run} size="md" prompt className="ml-auto">Convert</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">JSON Input</span>
            <button
              onClick={() => { setInput(EXAMPLE_JSON); setError(""); }}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
            >
              Load example
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder='{"name": "value", ...}'
            className="h-[480px] p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink focus:outline-none focus:border-accent resize-none leading-relaxed"
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
            <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">TypeScript Output</span>
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
            <pre className="h-[480px] p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink overflow-auto leading-relaxed whitespace-pre">
              {output}
            </pre>
          ) : (
            <div className="h-[480px] flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-card text-ink-faint gap-3">
              <FileCode2 className="w-9 h-9" strokeWidth={1.5} />
              <p className="text-sm">Paste JSON and click Convert</p>
              <button
                onClick={() => { setInput(EXAMPLE_JSON); setTimeout(run, 0); }}
                className="text-xs text-accent hover:underline"
              >
                Try the example
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-4">
        {[
          { icon: Zap, title: "Instant conversion", desc: "Handles nested objects, arrays, and null values in one click." },
          { icon: FileCode2, title: "interface or type", desc: "Switch between interface and type alias output to match your codebase's style." },
          { icon: ShieldCheck, title: "Optional-field detection", desc: "A null value in your sample marks the field optional and nullable in the output." },
        ].map((c) => (
          <div key={c.title} className="p-5 rounded-xl border border-border bg-bg-card">
            <div className="mb-2"><c.icon className="w-6 h-6 text-accent" strokeWidth={1.75} /></div>
            <h3 className="font-semibold text-ink mb-1">{c.title}</h3>
            <p className="text-sm text-ink-muted">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
