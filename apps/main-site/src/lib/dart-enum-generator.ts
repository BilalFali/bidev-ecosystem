export interface DartEnumOptions {
  name: string;
  fromString: boolean;
  toJson: boolean;
}

function parseValues(input: string): string[] {
  const trimmedInput = input.trim();
  let raw: string[];

  if (trimmedInput.startsWith("[")) {
    const parsed = JSON.parse(trimmedInput);
    if (!Array.isArray(parsed) || !parsed.every((v) => typeof v === "string")) {
      throw new Error("A pasted JSON array must contain only strings.");
    }
    raw = parsed;
  } else {
    raw = trimmedInput.split(/\r?\n|,/);
  }

  const trimmed = raw.map((v) => v.trim()).filter((v) => v.length > 0);

  // Drop exact-duplicate raw values (the same label entered twice) — this is
  // distinct from two *different* labels colliding on the same sanitized
  // identifier, which disambiguateIdentifier() below handles by suffixing
  // rather than discarding, since those are genuinely different values.
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const v of trimmed) {
    if (!seen.has(v)) {
      seen.add(v);
      deduped.push(v);
    }
  }
  return deduped;
}

function sanitizeIdentifier(raw: string): string {
  const words = raw.match(/[A-Za-z0-9]+/g) ?? ["value"];
  const first = words[0].toLowerCase();
  const rest = words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  let id = first + rest.join("");
  if (/^[0-9]/.test(id)) id = "v" + id;
  return id;
}

function disambiguateIdentifier(base: string, used: Set<string>): string {
  if (!used.has(base)) return base;
  let i = 2;
  while (used.has(`${base}${i}`)) i++;
  return `${base}${i}`;
}

function escapeDartString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export function generateDartEnum(input: string, opts: DartEnumOptions): string {
  const values = parseValues(input);
  const used = new Set<string>();
  const members = values.map((label) => {
    const id = disambiguateIdentifier(sanitizeIdentifier(label), used);
    used.add(id);
    return { id, label };
  });

  const name = opts.name || "MyEnum";
  const lines: string[] = [];

  lines.push(`enum ${name} {`);
  for (const m of members) {
    lines.push(`  ${m.id}('${escapeDartString(m.label)}'),`);
  }
  lines.push(`  ;`);
  lines.push(``);
  lines.push(`  const ${name}(this.label);`);
  lines.push(`  final String label;`);

  if (opts.fromString) {
    lines.push(``);
    lines.push(`  static ${name} fromString(String value) =>`);
    lines.push(`      values.firstWhere((e) => e.label == value, orElse: () => throw ArgumentError('Unknown ${name}: $value'));`);
  }

  if (opts.toJson) {
    lines.push(``);
    lines.push(`  String toJson() => label;`);
  }

  lines.push(`}`);
  return lines.join("\n");
}
