"use client";

import { useCallback, useState } from "react";
import { FileCog, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { validatePubspec, type PubspecIssue } from "@/lib/pubspec-validator";

const EXAMPLE = `name: my_app
description: A sample Flutter app.
version: 1.0.0+1
environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true
`;

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export function PubspecValidator() {
  const [input, setInput] = useState(EXAMPLE);
  const [issues, setIssues] = useState<PubspecIssue[] | null>(null);

  const validate = useCallback(() => {
    setIssues(validatePubspec(input));
  }, [input]);

  const handleUpload = async (file: File) => {
    setInput(await readFileAsText(file));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-ink-faint mb-3">
          <a href="/tools" className="hover:text-accent transition-colors">Tools</a>
          <span>/</span>
          <span className="text-ink-muted">pubspec.yaml Validator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">pubspec.yaml Validator</h1>
        <p className="text-ink-muted max-w-2xl">
          Paste or upload your pubspec.yaml to catch YAML syntax errors, malformed version constraints,
          and duplicate dependencies — entirely client-side.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">pubspec.yaml</span>
          <label className="text-xs text-accent hover:text-accent-hover cursor-pointer transition-colors">
            Upload file
            <input
              type="file"
              accept=".yaml,.yml"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder="name: my_app..."
          className="h-96 p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink focus:outline-none focus:border-accent resize-none leading-relaxed"
        />
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={validate} size="md" prompt>Validate</Button>
      </div>

      {issues && (
        <div className="mt-8 flex flex-col gap-2 max-w-3xl mx-auto">
          {issues.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              No issues found.
            </div>
          ) : (
            issues.map((issue, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 px-4 py-2.5 rounded-lg border text-sm ${
                  issue.severity === "error"
                    ? "text-red-400 border-red-500/25 bg-red-500/10"
                    : "text-amber-400 border-amber-500/25 bg-amber-500/10"
                }`}
              >
                {issue.severity === "error" ? (
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{issue.message}</span>
              </div>
            ))
          )}
        </div>
      )}

      {!issues && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-10 text-ink-faint">
          <FileCog className="w-9 h-9" strokeWidth={1.5} />
          <p className="text-sm">Paste or upload your pubspec.yaml, then click Validate</p>
        </div>
      )}
    </div>
  );
}
