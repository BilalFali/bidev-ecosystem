"use client";

import { useState } from "react";
import { AdSlot } from "@bidev/ui";

interface FieldDef {
  dartKey: string;
  dartType: string;
}

interface ClassDef {
  name: string;
  fields: FieldDef[];
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toUpperCase());
}

function toCamelCase(str: string): string {
  const p = toPascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function singularize(key: string): string {
  if (key.endsWith("ies")) return key.slice(0, -3) + "y";
  if (key.endsWith("ses") || key.endsWith("xes") || key.endsWith("zes")) return key.slice(0, -2);
  if (key.endsWith("s") && key.length > 3) return key.slice(0, -1);
  return key + "Item";
}

function inferType(value: unknown, key: string, classes: Map<string, ClassDef>, suffix: string): string {
  if (value === null || value === undefined) return "dynamic";
  if (typeof value === "string") return "String";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") return Number.isInteger(value) ? "int" : "double";
  if (Array.isArray(value)) {
    const first = value.find((v) => v !== null && v !== undefined);
    if (first === undefined) return "List<dynamic>";
    return `List<${inferType(first, singularize(key), classes, suffix)}>`;
  }
  if (typeof value === "object") {
    const className = toPascalCase(key) + suffix;
    buildClass(value as Record<string, unknown>, className, classes, suffix);
    return className;
  }
  return "dynamic";
}

function buildClass(obj: Record<string, unknown>, className: string, classes: Map<string, ClassDef>, suffix: string): void {
  if (classes.has(className)) return;
  const fields: FieldDef[] = [];
  classes.set(className, { name: className, fields });
  for (const [key, value] of Object.entries(obj)) {
    fields.push({ dartKey: toCamelCase(key), dartType: inferType(value, key, classes, suffix) });
  }
}

function generateClass(cls: ClassDef): string {
  const { name, fields } = cls;
  const ctorParams = fields.map((f) => `    required this.${f.dartKey},`).join("\n");
  const fieldDecls = fields.map((f) => `  final ${f.dartType} ${f.dartKey};`).join("\n");
  const copyWithParams = fields.map((f) => `${f.dartType}? ${f.dartKey}`).join(", ");
  const copyWithBody = fields.map((f) => `      ${f.dartKey}: ${f.dartKey} ?? this.${f.dartKey},`).join("\n");
  const toStringFields = fields.map((f) => `${f.dartKey}: $${f.dartKey}`).join(", ");
  const equalityChecks = fields.map((f) => `other.${f.dartKey} == ${f.dartKey}`).join(" &&\n          ");
  const hashFields = fields.map((f) => `${f.dartKey}.hashCode`).join(" ^ ");

  return `class ${name} {
  const ${name}({
${ctorParams}
  });

${fieldDecls}

  ${name} copyWith({
    ${copyWithParams},
  }) {
    return ${name}(
${copyWithBody}
    );
  }

  @override
  String toString() => '${name}(${toStringFields})';

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ${name} &&
          ${equalityChecks};

  @override
  int get hashCode => ${hashFields};
}`;
}

function generate(json: string, rootName: string): string {
  const parsed = JSON.parse(json);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Top-level JSON must be an object, e.g. { \"name\": \"...\" }.");
  }
  const classes = new Map<string, ClassDef>();
  const rootClassName = toPascalCase(rootName);
  buildClass(parsed, rootClassName, classes, "");
  return Array.from(classes.values()).reverse().map(generateClass).join("\n\n");
}

const SAMPLE = `{
  "id": 1,
  "name": "Bilal Fali",
  "isActive": true,
  "address": { "city": "Casablanca", "zip": "20000" },
  "tags": ["flutter", "dart"]
}`;

export function DartDataClassGenerator() {
  const [input, setInput] = useState(SAMPLE);
  const [rootName, setRootName] = useState("User");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    try {
      setOutput(generate(input, rootName || "Root"));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON.");
      setOutput("");
    }
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <nav className="text-xs text-ink-faint mb-5">
        <a href="/tools" className="hover:text-ink-muted transition-colors">Tools</a> / Dart Data Class Generator
      </nav>
      <h1 className="text-3xl font-bold text-ink mb-2">Dart Data Class Generator</h1>
      <p className="text-ink-muted mb-2">
        Paste JSON to generate an immutable Dart data class — constructor, copyWith, toString, and equality.
      </p>
      <p className="text-xs text-ink-faint mb-8">
        No fromJson/toJson here — for JSON (de)serialization, use the{" "}
        <a href="/tools/json-to-dart" className="text-accent hover:underline">JSON to Dart Converter</a> instead.
      </p>

      <AdSlot type="banner" className="mb-8" />

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <label className="text-xs text-ink-muted shrink-0">Class name</label>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-ink text-sm font-mono focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors text-sm font-mono resize-y"
          />
          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors self-start"
          >
            Generate
          </button>
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">Generated Dart</span>
            <button onClick={copy} disabled={!output} className="text-xs text-accent hover:text-accent-hover transition-colors disabled:opacity-40">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="flex-1 min-h-[22rem] px-4 py-3 rounded-xl bg-bg-card border border-border text-xs font-mono text-ink-muted overflow-auto whitespace-pre">
            {output || "// Click \"Generate\" to see the Dart class"}
          </pre>
        </div>
      </div>

      <AdSlot type="in-article" className="mt-8" />
    </div>
  );
}
