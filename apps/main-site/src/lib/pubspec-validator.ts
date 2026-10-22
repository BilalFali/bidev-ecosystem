import { parse } from "yaml";

export interface PubspecIssue {
  severity: "error" | "warning";
  message: string;
}

// A permissive grammar covering the pubspec version-constraint shapes that
// show up in real projects: exact ("1.2.3"), caret ("^1.2.3"), a range
// ("'>=1.0.0 <2.0.0'"), or the bare keyword "any". Anything else is reported.
const VERSION_RE = /^\^?\d+\.\d+\.\d+(?:[+-][\w.]+)?$/;
const RANGE_RE = /^(>=|<=|>|<)\s*\d+\.\d+\.\d+(?:[+-][\w.]+)?$/;

function isValidVersionConstraint(value: string): boolean {
  if (value === "any") return true;
  const trimmed = value.trim();
  if (VERSION_RE.test(trimmed)) return true;
  // A space-separated range like ">=1.0.0 <2.0.0"
  return trimmed.split(/\s+/).every((part) => RANGE_RE.test(part));
}

function checkDependencySection(
  deps: Record<string, unknown>,
  issues: PubspecIssue[]
): void {
  for (const [name, value] of Object.entries(deps)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "object") continue; // git/path/hosted-with-version maps — not a plain version string
    if (typeof value === "string") {
      if (!isValidVersionConstraint(value)) {
        issues.push({
          severity: "error",
          message: `Dependency "${name}" has a malformed version constraint: "${value}".`,
        });
      }
      continue;
    }
    issues.push({
      severity: "error",
      message: `Dependency "${name}" has an unrecognized value.`,
    });
  }
}

// A literal duplicate key within one YAML mapping (e.g. two "flutter_test:"
// entries under dependencies) is a common copy-paste mistake, not a reason
// to reject the whole file — the yaml package's default parser throws on it,
// so we re-parse permissively and report it as a named warning instead.
function duplicateKeyWarning(yamlStr: string, error: unknown): PubspecIssue | null {
  const e = error as { code?: string; linePos?: { line: number; col: number }[] };
  if (e.code !== "DUPLICATE_KEY" || !e.linePos?.[0]) return null;
  const line = yamlStr.split("\n")[e.linePos[0].line - 1] ?? "";
  const match = line.match(/^\s*([\w.-]+):/);
  const name = match ? match[1] : "a key";
  return { severity: "warning", message: `Dependency "${name}" is declared more than once in the same section.` };
}

export function validatePubspec(yamlStr: string): PubspecIssue[] {
  let doc: unknown;
  try {
    doc = parse(yamlStr);
  } catch (e) {
    const dupWarning = duplicateKeyWarning(yamlStr, e);
    if (dupWarning) {
      doc = parse(yamlStr, { uniqueKeys: false });
      const issues = validateParsedDoc(doc);
      issues.unshift(dupWarning);
      return issues;
    }
    return [{ severity: "error", message: `Invalid YAML: ${(e as Error).message}` }];
  }

  return validateParsedDoc(doc);
}

function validateParsedDoc(doc: unknown): PubspecIssue[] {
  if (typeof doc !== "object" || doc === null) {
    return [{ severity: "error", message: "pubspec.yaml must be a YAML mapping (key: value pairs)." }];
  }

  const obj = doc as Record<string, unknown>;
  const issues: PubspecIssue[] = [];

  if (typeof obj.name !== "string" || obj.name.trim() === "") {
    issues.push({ severity: "error", message: "Missing or invalid \"name\" field — every pubspec.yaml needs a package name." });
  }

  const dependencies = (obj.dependencies as Record<string, unknown>) ?? {};
  const devDependencies = (obj.dev_dependencies as Record<string, unknown>) ?? {};

  checkDependencySection(dependencies, issues);
  checkDependencySection(devDependencies, issues);

  for (const name of Object.keys(dependencies)) {
    if (name in devDependencies) {
      issues.push({
        severity: "warning",
        message: `Dependency "${name}" is listed in both dependencies and dev_dependencies.`,
      });
    }
  }

  return issues;
}
