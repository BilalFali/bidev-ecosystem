export type DiffKind = "added" | "removed" | "changed";

export interface DiffEntry {
  path: string;
  kind: DiffKind;
  before?: unknown;
  after?: unknown;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function joinKey(path: string, key: string): string {
  return path ? `${path}.${key}` : key;
}

function diffValue(path: string, a: unknown, b: unknown, out: DiffEntry[]): void {
  if (Array.isArray(a) && Array.isArray(b)) {
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const itemPath = `${path}[${i}]`;
      if (i >= a.length) {
        out.push({ path: itemPath, kind: "added", after: b[i] });
      } else if (i >= b.length) {
        out.push({ path: itemPath, kind: "removed", before: a[i] });
      } else {
        diffValue(itemPath, a[i], b[i], out);
      }
    }
    return;
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
      const keyPath = joinKey(path, key);
      if (!(key in a)) {
        out.push({ path: keyPath, kind: "added", after: b[key] });
      } else if (!(key in b)) {
        out.push({ path: keyPath, kind: "removed", before: a[key] });
      } else {
        diffValue(keyPath, a[key], b[key], out);
      }
    }
    return;
  }

  if (!Object.is(a, b)) {
    out.push({ path, kind: "changed", before: a, after: b });
  }
}

export function diffJson(a: unknown, b: unknown): DiffEntry[] {
  const out: DiffEntry[] = [];
  diffValue("", a, b, out);
  return out;
}
