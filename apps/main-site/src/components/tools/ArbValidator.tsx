"use client";

import { useCallback, useState } from "react";
import { Languages, AlertTriangle, XCircle, PlusCircle, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { validateArbFiles, type ArbIssue } from "@/lib/arb-validator";

const EXAMPLE_BASE = `{
  "@@locale": "en",
  "greeting": "Hello {name}",
  "itemCount": "{count, plural, one{1 item} other{{count} items}}"
}`;

const EXAMPLE_OTHER = `{
  "@@locale": "fr",
  "greeting": "Bonjour {prenom}",
  "itemCount": "{count, plural, one{un article} other{{count} articles}}",
  "extraKey": "Ce champ n'existe pas dans la locale de base"
}`;

interface OtherLocale {
  id: number;
  locale: string;
  content: string;
}

let nextId = 1;

function ISSUE_META(type: ArbIssue["type"]) {
  if (type === "missing-key") return { icon: XCircle, label: "Missing key", className: "text-red-400 border-red-500/25 bg-red-500/10" };
  if (type === "extra-key") return { icon: AlertTriangle, label: "Extra key", className: "text-amber-400 border-amber-500/25 bg-amber-500/10" };
  return { icon: AlertTriangle, label: "Placeholder mismatch", className: "text-amber-400 border-amber-500/25 bg-amber-500/10" };
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export function ArbValidator() {
  const [baseLocale, setBaseLocale] = useState("en");
  const [baseContent, setBaseContent] = useState(EXAMPLE_BASE);
  const [others, setOthers] = useState<OtherLocale[]>([{ id: nextId++, locale: "fr", content: EXAMPLE_OTHER }]);
  const [issues, setIssues] = useState<ArbIssue[] | null>(null);
  const [error, setError] = useState("");

  const addLocale = () => {
    setOthers((prev) => [...prev, { id: nextId++, locale: "", content: "" }]);
  };

  const removeLocale = (id: number) => {
    setOthers((prev) => prev.filter((o) => o.id !== id));
  };

  const updateLocale = (id: number, patch: Partial<OtherLocale>) => {
    setOthers((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const handleUpload = async (file: File, target: "base" | number) => {
    const text = await readFileAsText(file);
    if (target === "base") setBaseContent(text);
    else updateLocale(target, { content: text });
  };

  const validate = useCallback(() => {
    setError("");
    try {
      const result = validateArbFiles(
        { locale: baseLocale || "base", content: baseContent },
        others
          .filter((o) => o.content.trim())
          .map((o) => ({ locale: o.locale || "unknown", content: o.content }))
      );
      setIssues(result);
    } catch (e) {
      setError((e as Error).message);
      setIssues(null);
    }
  }, [baseLocale, baseContent, others]);

  const grouped = issues
    ? issues.reduce<Record<string, ArbIssue[]>>((acc, issue) => {
        (acc[issue.locale] ??= []).push(issue);
        return acc;
      }, {})
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-ink-faint mb-3">
          <a href="/tools" className="hover:text-accent transition-colors">Tools</a>
          <span>/</span>
          <span className="text-ink-muted">ARB Localization Validator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">ARB Localization Validator</h1>
        <p className="text-ink-muted max-w-2xl">
          Compare .arb localization files against a base locale — find missing keys, extra keys, and
          mismatched ICU placeholders, including <code className="text-accent text-sm">plural</code> and{" "}
          <code className="text-accent text-sm">select</code> variables.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Base locale */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">Base locale</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={baseLocale}
                onChange={(e) => setBaseLocale(e.target.value)}
                placeholder="en"
                className="w-16 px-2 py-1 rounded-md bg-bg-card border border-border text-xs font-mono text-ink focus:outline-none focus:border-accent"
              />
              <label className="text-xs text-accent hover:text-accent-hover cursor-pointer transition-colors">
                Upload
                <input
                  type="file"
                  accept=".arb,.json"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "base")}
                />
              </label>
            </div>
          </div>
          <textarea
            value={baseContent}
            onChange={(e) => setBaseContent(e.target.value)}
            spellCheck={false}
            placeholder='{"greeting": "Hello {name}"}'
            className="h-72 p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink focus:outline-none focus:border-accent resize-none leading-relaxed"
          />
        </div>

        {/* Other locales */}
        <div className="flex flex-col gap-4">
          {others.map((o) => (
            <div key={o.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">Compare locale</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={o.locale}
                    onChange={(e) => updateLocale(o.id, { locale: e.target.value })}
                    placeholder="fr"
                    className="w-16 px-2 py-1 rounded-md bg-bg-card border border-border text-xs font-mono text-ink focus:outline-none focus:border-accent"
                  />
                  <label className="text-xs text-accent hover:text-accent-hover cursor-pointer transition-colors">
                    Upload
                    <input
                      type="file"
                      accept=".arb,.json"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], o.id)}
                    />
                  </label>
                  <button onClick={() => removeLocale(o.id)} className="text-ink-faint hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={o.content}
                onChange={(e) => updateLocale(o.id, { content: e.target.value })}
                spellCheck={false}
                placeholder='{"greeting": "Bonjour {name}"}'
                className="h-32 p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink focus:outline-none focus:border-accent resize-none leading-relaxed"
              />
            </div>
          ))}
          <button
            onClick={addLocale}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border text-sm text-ink-muted hover:text-accent hover:border-accent/40 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Add another locale
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={validate} size="md" prompt>Validate</Button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-2xl mx-auto">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {grouped && (
        <div className="mt-8 flex flex-col gap-5 max-w-3xl mx-auto">
          {Object.keys(grouped).length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              No issues found — every locale matches the base locale's keys and placeholders.
            </div>
          ) : (
            Object.entries(grouped).map(([locale, localeIssues]) => (
              <div key={locale} className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-ink">{locale} — {localeIssues.length} issue{localeIssues.length === 1 ? "" : "s"}</h2>
                {localeIssues.map((issue, i) => {
                  const meta = ISSUE_META(issue.type);
                  return (
                    <div key={i} className={`flex items-start gap-2 px-4 py-2.5 rounded-lg border text-sm ${meta.className}`}>
                      <meta.icon className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono font-semibold">{issue.key}</span>
                        <span className="text-ink-faint"> — {meta.label}: </span>
                        <span>{issue.detail}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}

      {!grouped && !error && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-10 text-ink-faint">
          <Languages className="w-9 h-9" strokeWidth={1.5} />
          <p className="text-sm">Paste or upload your .arb files, then click Validate</p>
        </div>
      )}
    </div>
  );
}
