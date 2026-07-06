"use client";

import { useState, useCallback } from "react";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface FieldDef {
  originalKey: string;
  dartKey: string;
  dartType: string;
  nullable: boolean;
}

interface ClassDef {
  name: string;
  fields: FieldDef[];
}

interface GenOpts {
  rootName: string;
  suffix: string;        // "" or "Model"
  nullSafety: boolean;
  copyWith: boolean;
  equatable: boolean;
  annotations: "none" | "json_serializable" | "freezed";
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toUpperCase());
}

function toCamelCase(str: string): string {
  const p = toPascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

const SIMPLE = new Set(["String", "int", "double", "bool", "dynamic"]);

function isSimple(t: string) {
  return SIMPLE.has(t);
}

function singularize(key: string): string {
  if (key.endsWith("ies")) return key.slice(0, -3) + "y";
  if (key.endsWith("ses") || key.endsWith("xes") || key.endsWith("zes")) return key.slice(0, -2);
  if (key.endsWith("s") && key.length > 3) return key.slice(0, -1);
  return key + "Item";
}

// ──────────────────────────────────────────────
// Core inference
// ──────────────────────────────────────────────
function inferType(
  value: unknown,
  key: string,
  classes: Map<string, ClassDef>,
  opts: GenOpts
): { dartType: string; nullable: boolean } {
  if (value === null || value === undefined) {
    return { dartType: "dynamic", nullable: true };
  }
  if (typeof value === "string") return { dartType: "String", nullable: false };
  if (typeof value === "boolean") return { dartType: "bool", nullable: false };
  if (typeof value === "number") {
    return { dartType: Number.isInteger(value) ? "int" : "double", nullable: false };
  }
  if (Array.isArray(value)) {
    const first = value.find((v) => v !== null && v !== undefined);
    if (first === undefined) return { dartType: "List<dynamic>", nullable: false };
    const itemKey = singularize(key);
    const inner = inferType(first, itemKey, classes, opts);
    return { dartType: `List<${inner.dartType}>`, nullable: false };
  }
  if (typeof value === "object") {
    const className = toPascalCase(key) + opts.suffix;
    buildClass(value as Record<string, unknown>, className, classes, opts);
    return { dartType: className, nullable: false };
  }
  return { dartType: "dynamic", nullable: false };
}

function buildClass(
  obj: Record<string, unknown>,
  className: string,
  classes: Map<string, ClassDef>,
  opts: GenOpts
): void {
  if (classes.has(className)) return;
  const fields: FieldDef[] = [];
  classes.set(className, { name: className, fields }); // register early to prevent loops

  for (const [key, value] of Object.entries(obj)) {
    const { dartType, nullable } = inferType(value, key, classes, opts);
    fields.push({
      originalKey: key,
      dartKey: toCamelCase(key),
      dartType,
      nullable: nullable || value === null,
    });
  }
}

// ──────────────────────────────────────────────
// Code generation
// ──────────────────────────────────────────────
function fromJsonExpr(f: FieldDef, opts: GenOpts): string {
  const k = f.originalKey;
  const t = f.dartType;
  const ns = opts.nullSafety;
  const nullable = f.nullable;

  if (t === "String") return `json['${k}'] as String${nullable && ns ? "?" : ""}`;
  if (t === "int")    return `json['${k}'] as int${nullable && ns ? "?" : ""}`;
  if (t === "bool")   return `json['${k}'] as bool${nullable && ns ? "?" : ""}`;
  if (t === "double") {
    const cast = nullable && ns ? `(json['${k}'] as num?)?.toDouble()` : `(json['${k}'] as num).toDouble()`;
    return cast;
  }
  if (t === "dynamic") return `json['${k}']`;

  if (t.startsWith("List<")) {
    const inner = t.slice(5, -1);
    const itemExpr = isSimple(inner)
      ? `e as ${inner}`
      : `${inner}.fromJson(e as Map<String, dynamic>)`;
    if (nullable && ns) {
      return `json['${k}'] == null ? null : (json['${k}'] as List).map((e) => ${itemExpr}).toList()`;
    }
    if (inner === "dynamic") return `(json['${k}'] as List<dynamic>)`;
    return `(json['${k}'] as List).map((e) => ${itemExpr}).toList()`;
  }

  // Nested object
  if (nullable && ns) {
    return `json['${k}'] == null ? null : ${t}.fromJson(json['${k}'] as Map<String, dynamic>)`;
  }
  return `${t}.fromJson(json['${k}'] as Map<String, dynamic>)`;
}

function toJsonExpr(f: FieldDef): string {
  const k = f.dartKey;
  const t = f.dartType;
  if (isSimple(t)) return k;
  if (t.startsWith("List<")) {
    const inner = t.slice(5, -1);
    if (isSimple(inner) || inner === "dynamic") return k;
    return f.nullable ? `${k}?.map((e) => e.toJson()).toList()` : `${k}.map((e) => e.toJson()).toList()`;
  }
  return f.nullable ? `${k}?.toJson()` : `${k}.toJson()`;
}

function genClass(classDef: ClassDef, opts: GenOpts): string {
  const { name, fields } = classDef;
  const L: string[] = [];

  // Freezed special case
  if (opts.annotations === "freezed") {
    L.push(`@freezed`);
    L.push(`class ${name} with _\$${name} {`);
    L.push(`  const factory ${name}({`);
    for (const f of fields) {
      const ft = opts.nullSafety
        ? f.nullable ? `${f.dartType}?` : f.dartType
        : f.dartType;
      const req = opts.nullSafety && !f.nullable ? `    required ${ft} ${f.dartKey},` : `    ${ft}? ${f.dartKey},`;
      L.push(req);
    }
    L.push(`  }) = _${name};`);
    L.push(``);
    L.push(`  factory ${name}.fromJson(Map<String, dynamic> json) => _\$${name}FromJson(json);`);
    L.push(`}`);
    return L.join("\n");
  }

  if (opts.annotations === "json_serializable") L.push(`@JsonSerializable()`);

  L.push(`class ${name}${opts.equatable ? " extends Equatable" : ""} {`);

  // Fields
  for (const f of fields) {
    const ft = opts.nullSafety ? (f.nullable ? `${f.dartType}?` : f.dartType) : f.dartType;
    L.push(`  final ${ft} ${f.dartKey};`);
  }
  L.push(``);

  // Constructor
  L.push(`  const ${name}({`);
  for (const f of fields) {
    if (opts.nullSafety && !f.nullable) {
      L.push(`    required this.${f.dartKey},`);
    } else {
      L.push(`    this.${f.dartKey},`);
    }
  }
  L.push(`  });`);
  L.push(``);

  // fromJson
  if (opts.annotations === "json_serializable") {
    L.push(`  factory ${name}.fromJson(Map<String, dynamic> json) => _\$${name}FromJson(json);`);
  } else {
    L.push(`  factory ${name}.fromJson(Map<String, dynamic> json) {`);
    L.push(`    return ${name}(`);
    for (const f of fields) {
      L.push(`      ${f.dartKey}: ${fromJsonExpr(f, opts)},`);
    }
    L.push(`    );`);
    L.push(`  }`);
  }
  L.push(``);

  // toJson
  if (opts.annotations === "json_serializable") {
    L.push(`  Map<String, dynamic> toJson() => _\$${name}ToJson(this);`);
  } else {
    L.push(`  Map<String, dynamic> toJson() {`);
    L.push(`    return {`);
    for (const f of fields) {
      L.push(`      '${f.originalKey}': ${toJsonExpr(f)},`);
    }
    L.push(`    };`);
    L.push(`  }`);
  }

  // copyWith
  if (opts.copyWith) {
    L.push(``);
    L.push(`  ${name} copyWith({`);
    for (const f of fields) {
      const ft = opts.nullSafety ? `${f.dartType}?` : f.dartType;
      L.push(`    ${ft} ${f.dartKey},`);
    }
    L.push(`  }) {`);
    L.push(`    return ${name}(`);
    for (const f of fields) {
      L.push(`      ${f.dartKey}: ${f.dartKey} ?? this.${f.dartKey},`);
    }
    L.push(`    );`);
    L.push(`  }`);
  }

  // Equatable
  if (opts.equatable) {
    L.push(``);
    L.push(`  @override`);
    L.push(`  List<Object?> get props => [${fields.map((f) => f.dartKey).join(", ")}];`);
  }

  L.push(`}`);
  return L.join("\n");
}

function generate(jsonStr: string, opts: GenOpts): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Invalid JSON — ${(e as Error).message}`);
  }

  if (Array.isArray(parsed)) {
    if (parsed.length === 0 || typeof parsed[0] !== "object" || parsed[0] === null) {
      throw new Error("Root must be a JSON object {}. Wrap arrays in an object.");
    }
    parsed = parsed[0];
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Root value must be a JSON object {}.");
  }

  const classes = new Map<string, ClassDef>();
  buildClass(parsed as Record<string, unknown>, opts.rootName + opts.suffix, classes, opts);

  const parts: string[] = [];

  // Imports
  if (opts.annotations === "json_serializable") {
    parts.push(`import 'package:json_annotation/json_annotation.dart';\n\npart '${opts.rootName.toLowerCase()}.g.dart';`);
  } else if (opts.annotations === "freezed") {
    parts.push(`import 'package:freezed_annotation/freezed_annotation.dart';\n\npart '${opts.rootName.toLowerCase()}.freezed.dart';\npart '${opts.rootName.toLowerCase()}.g.dart';`);
  }
  if (opts.equatable && opts.annotations !== "freezed") {
    parts.push(`import 'package:equatable/equatable.dart';`);
  }

  // Leaf classes first, root last
  const rootName = opts.rootName + opts.suffix;
  const ordered = [
    ...Array.from(classes.values()).filter((c) => c.name !== rootName),
    ...(classes.has(rootName) ? [classes.get(rootName)!] : []),
  ];

  for (const cls of ordered) {
    parts.push(genClass(cls, opts));
  }

  return parts.join("\n\n");
}

// ──────────────────────────────────────────────
// React Component
// ──────────────────────────────────────────────
const EXAMPLE_JSON = `{
  "id": 1,
  "name": "Bilal Fali",
  "email": "bilal@bidev.dev",
  "is_active": true,
  "score": 98.5,
  "tags": ["flutter", "dart", "mobile"],
  "address": {
    "street": "123 Dev Lane",
    "city": "Algiers",
    "country": "Algeria",
    "zip_code": "16000"
  },
  "recent_posts": [
    {
      "id": 101,
      "title": "Clean Architecture in Flutter",
      "published_at": "2026-01-15"
    }
  ]
}`;

export function JsonToDart() {
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [rootName, setRootName] = useState("User");
  const [suffix, setSuffix] = useState("Model");
  const [nullSafety, setNullSafety] = useState(true);
  const [copyWith, setCopyWith] = useState(true);
  const [equatable, setEquatable] = useState(false);
  const [annotations, setAnnotations] = useState<GenOpts["annotations"]>("none");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => {
    setError("");
    try {
      const code = generate(input, { rootName: rootName || "MyModel", suffix, nullSafety, copyWith, equatable, annotations });
      setOutput(code);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, rootName, suffix, nullSafety, copyWith, equatable, annotations]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-ink-faint mb-3">
          <a href="/tools" className="hover:text-accent transition-colors">Tools</a>
          <span>/</span>
          <span className="text-ink-muted">JSON to Dart</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">JSON to Dart Converter</h1>
        <p className="text-ink-muted max-w-2xl">
          Convert JSON to Dart model classes instantly. Generates{" "}
          <code className="text-accent text-sm">fromJson</code>,{" "}
          <code className="text-accent text-sm">toJson</code>,{" "}
          <code className="text-accent text-sm">copyWith</code> — supports null safety, Equatable, json_serializable &amp; Freezed.
        </p>
      </div>

      {/* Options bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-border bg-bg-elevated mb-6">
        {/* Class name */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-ink-faint whitespace-nowrap">Class name</label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
            placeholder="User"
            className="w-28 px-2.5 py-1.5 rounded-lg bg-bg-card border border-border text-sm text-ink focus:outline-none focus:border-accent"
          />
        </div>

        {/* Suffix */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-ink-faint">Suffix</label>
          <select
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-bg-card border border-border text-sm text-ink focus:outline-none focus:border-accent"
          >
            <option value="Model">Model</option>
            <option value="">None</option>
            <option value="Dto">Dto</option>
            <option value="Entity">Entity</option>
          </select>
        </div>

        {/* Annotations */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-ink-faint">Annotations</label>
          <select
            value={annotations}
            onChange={(e) => setAnnotations(e.target.value as GenOpts["annotations"])}
            className="px-2.5 py-1.5 rounded-lg bg-bg-card border border-border text-sm text-ink focus:outline-none focus:border-accent"
          >
            <option value="none">Plain Dart</option>
            <option value="json_serializable">json_serializable</option>
            <option value="freezed">Freezed</option>
          </select>
        </div>

        {/* Toggles */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <ToggleSwitch value={nullSafety} onChange={setNullSafety} />
          <span className="text-sm text-ink-muted">Null Safety</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <ToggleSwitch value={copyWith} onChange={setCopyWith} />
          <span className="text-sm text-ink-muted">copyWith</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <ToggleSwitch value={equatable} onChange={setEquatable} />
          <span className="text-sm text-ink-muted">Equatable</span>
        </label>

        <button
          onClick={run}
          className="ml-auto px-5 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          Convert →
        </button>
      </div>

      {/* Editor split */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
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
              <span className="shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">Dart Output</span>
            {output && (
              <button
                onClick={handleCopy}
                className={`text-xs transition-colors ${copied ? "text-green-400" : "text-accent hover:text-accent-hover"}`}
              >
                {copied ? "✓ Copied!" : "Copy all"}
              </button>
            )}
          </div>
          {output ? (
            <pre className="h-[480px] p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink overflow-auto leading-relaxed whitespace-pre">
              <DartHighlight code={output} />
            </pre>
          ) : (
            <div className="h-[480px] flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-card text-ink-faint gap-3">
              <span className="text-4xl">🎯</span>
              <p className="text-sm">Paste JSON and click Convert</p>
              <button
                onClick={() => { setInput(EXAMPLE_JSON); setTimeout(run, 0); }}
                className="text-xs text-accent hover:underline"
              >
                Try the example →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="mt-12 grid sm:grid-cols-3 gap-4">
        {[
          { icon: "⚡", title: "Instant conversion", desc: "Handles nested objects, arrays, null values, and multiple classes in one click." },
          { icon: "🛡️", title: "Null-safe output", desc: "Generated code is fully compatible with Dart's sound null safety introduced in Dart 2.12." },
          { icon: "📦", title: "Multiple patterns", desc: "Plain Dart, json_serializable for codegen, or Freezed for immutable value types." },
        ].map((c) => (
          <div key={c.title} className="p-5 rounded-xl border border-border bg-bg-card">
            <div className="text-2xl mb-2">{c.icon}</div>
            <h3 className="font-semibold text-ink mb-1">{c.title}</h3>
            <p className="text-sm text-ink-muted">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple toggle
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

// Minimal Dart syntax highlight (token coloring via spans)
function DartHighlight({ code }: { code: string }) {
  const KEYWORDS = new Set([
    "class", "extends", "implements", "with", "const", "final", "required",
    "return", "factory", "null", "true", "false", "import", "part", "this",
    "override", "abstract", "void", "int", "double", "String", "bool", "List",
    "Map", "dynamic", "Object", "get", "set", "async", "await", "if", "else",
  ]);

  const tokens = code.split(/(\b\w+\b|'[^']*'|"[^"]*"|\/\/[^\n]*|\n|[{}();,@?])/);

  return (
    <>
      {tokens.map((tok, i) => {
        if (tok.startsWith("//")) return <span key={i} style={{ color: "#6b7a99" }}>{tok}</span>;
        if (tok.startsWith("'") || tok.startsWith('"')) return <span key={i} style={{ color: "#a3e635" }}>{tok}</span>;
        if (KEYWORDS.has(tok)) return <span key={i} style={{ color: "#38bdf8" }}>{tok}</span>;
        if (/^[A-Z][a-zA-Z0-9]*$/.test(tok)) return <span key={i} style={{ color: "#f472b6" }}>{tok}</span>;
        if (tok === "@") return <span key={i} style={{ color: "#fb923c" }}>{tok}</span>;
        return <span key={i}>{tok}</span>;
      })}
    </>
  );
}
