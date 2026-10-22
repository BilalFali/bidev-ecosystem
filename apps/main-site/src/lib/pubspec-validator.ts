import { parseDocument } from "yaml";

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
// entries under dependencies, or two top-level "dependencies:" blocks) is a
// common copy-paste mistake, not a reason to reject the whole file. The line
// above a DUPLICATE_KEY error's position is always the duplicated key itself
// (confirmed against the yaml package's error format), so we read the key
// name from there and the enclosing section from the nearest preceding
// less-indented line.
function findEnclosingSection(lines: string[], duplicateLineIndex: number): string {
  const dupLine = lines[duplicateLineIndex] ?? "";
  const dupIndent = dupLine.match(/^(\s*)/)?.[1].length ?? 0;
  if (dupIndent === 0) return "the top level of the file";
  for (let i = duplicateLineIndex - 1; i >= 0; i--) {
    const line = lines[i];
    if (!line.trim()) continue;
    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
    if (indent < dupIndent) {
      const match = line.match(/^\s*([\w.-]+):/);
      return match ? `the "${match[1]}:" section` : "the top level of the file";
    }
  }
  return "the top level of the file";
}

function duplicateKeyWarning(lines: string[], error: { linePos?: { line: number; col: number }[] }): PubspecIssue | null {
  const lineIndex = (error.linePos?.[0]?.line ?? 0) - 1;
  if (lineIndex < 0) return null;
  const line = lines[lineIndex] ?? "";
  const match = line.match(/^\s*([\w.-]+):/);
  const name = match ? match[1] : "a key";
  const section = findEnclosingSection(lines, lineIndex);
  return { severity: "warning", message: `Key "${name}" is declared more than once in ${section}.` };
}

export function validatePubspec(yamlStr: string): PubspecIssue[] {
  const doc = parseDocument(yamlStr);
  const duplicateKeyErrors = doc.errors.filter((e) => e.code === "DUPLICATE_KEY");
  const otherErrors = doc.errors.filter((e) => e.code !== "DUPLICATE_KEY");

  if (otherErrors.length > 0) {
    return [{ severity: "error", message: `Invalid YAML: ${otherErrors[0].message}` }];
  }

  const lines = yamlStr.split("\n");
  const issues = validateParsedDoc(doc.toJS());
  for (const e of duplicateKeyErrors) {
    const warning = duplicateKeyWarning(lines, e);
    if (warning) issues.unshift(warning);
  }
  return issues;
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
