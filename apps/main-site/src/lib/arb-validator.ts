export interface ArbFile {
  locale: string;
  content: string;
}

export interface ArbIssue {
  locale: string;
  key: string;
  type: "missing-key" | "extra-key" | "placeholder-mismatch";
  detail: string;
}

function parseArb(file: ArbFile): Record<string, unknown> {
  try {
    return JSON.parse(file.content) as Record<string, unknown>;
  } catch (e) {
    throw new Error(`Invalid JSON in locale "${file.locale}" — ${(e as Error).message}`);
  }
}

function messageKeys(obj: Record<string, unknown>): string[] {
  return Object.keys(obj).filter((k) => !k.startsWith("@"));
}

// ICU message arguments look like {name}, or {name, plural, one{...} other{...}},
// or {name, select, ...}. A plural/select branch's body (the text inside
// one{...}/other{...}/=0{...}) is literal text that may itself contain nested
// placeholders — it is not a placeholder itself, even when that literal text
// happens to be a single bare word that looks like "{identifier}" (e.g. the
// French plural branch one{un}). This walks the message structurally instead
// of regex-matching every "{identifier" occurrence, so branch bodies are
// never mistaken for placeholders.
function extractPlaceholders(message: string): Set<string> {
  const names = new Set<string>();
  const n = message.length;
  let i = 0;

  const isIdentStart = (c: string) => /[A-Za-z_]/.test(c);
  const isIdentPart = (c: string) => /[A-Za-z0-9_]/.test(c);
  const skipWs = () => {
    while (i < n && /\s/.test(message[i])) i++;
  };
  const readIdent = (): string => {
    const start = i;
    while (i < n && isIdentPart(message[i])) i++;
    return message.slice(start, i);
  };

  function consumeToMatchingClose(): void {
    let depth = 1;
    while (i < n && depth > 0) {
      if (message[i] === "{") depth++;
      else if (message[i] === "}") depth--;
      i++;
    }
  }

  // message[i] === "{"; consumes through this argument's matching "}".
  function parseArgument(): void {
    i++; // consume "{"
    skipWs();
    const id = isIdentStart(message[i] ?? "") ? readIdent() : "";
    skipWs();
    if (id) names.add(id);

    if (message[i] === "}") {
      i++;
      return;
    }
    if (message[i] === ",") {
      i++;
      skipWs();
      readIdent(); // keyword: plural / select / selectordinal / number / date / time
      skipWs();
      if (message[i] === ",") {
        i++; // comma before branch selectors (plural/select) or an offset clause
        parseBranchesUntilClose();
        return;
      }
      consumeToMatchingClose();
      return;
    }
    consumeToMatchingClose();
  }

  // Parses "selector{body}" pairs (one{...} other{...} =0{...} ...) until the
  // enclosing plural/select argument's own closing "}" is consumed.
  function parseBranchesUntilClose(): void {
    while (i < n) {
      skipWs();
      if (i >= n) return;
      if (message[i] === "}") {
        i++;
        return;
      }
      while (i < n && message[i] !== "{" && message[i] !== "}" && !/\s/.test(message[i])) i++;
      skipWs();
      if (message[i] === "{") {
        i++; // consume the branch body's opening "{"
        parseBranchBody();
      }
    }
  }

  // Parses literal text plus any nested {...} arguments inside one branch
  // body, until that body's own matching "}".
  function parseBranchBody(): void {
    while (i < n) {
      if (message[i] === "{") {
        parseArgument();
      } else if (message[i] === "}") {
        i++;
        return;
      } else {
        i++;
      }
    }
  }

  while (i < n) {
    if (message[i] === "{") parseArgument();
    else i++;
  }

  return names;
}

function diffPlaceholders(baseNames: Set<string>, otherNames: Set<string>): string | null {
  const missing = [...baseNames].filter((n) => !otherNames.has(n));
  const extra = [...otherNames].filter((n) => !baseNames.has(n));
  if (missing.length === 0 && extra.length === 0) return null;
  const parts: string[] = [];
  if (missing.length > 0) parts.push(`missing: ${missing.join(", ")}`);
  if (extra.length > 0) parts.push(`extra: ${extra.join(", ")}`);
  return parts.join("; ");
}

export function validateArbFiles(base: ArbFile, others: ArbFile[]): ArbIssue[] {
  const baseObj = parseArb(base);
  const baseKeys = new Set(messageKeys(baseObj));
  const issues: ArbIssue[] = [];

  for (const other of others) {
    const otherObj = parseArb(other);
    const otherKeys = new Set(messageKeys(otherObj));

    for (const key of baseKeys) {
      if (!otherKeys.has(key)) {
        issues.push({
          locale: other.locale,
          key,
          type: "missing-key",
          detail: `"${key}" exists in the base locale "${base.locale}" but is missing from "${other.locale}".`,
        });
        continue;
      }

      const baseMessage = String(baseObj[key]);
      const otherMessage = String(otherObj[key]);
      const mismatch = diffPlaceholders(extractPlaceholders(baseMessage), extractPlaceholders(otherMessage));
      if (mismatch) {
        issues.push({
          locale: other.locale,
          key,
          type: "placeholder-mismatch",
          detail: `Placeholder names differ between "${base.locale}" and "${other.locale}" (${mismatch}).`,
        });
      }
    }

    for (const key of otherKeys) {
      if (!baseKeys.has(key)) {
        issues.push({
          locale: other.locale,
          key,
          type: "extra-key",
          detail: `"${key}" exists in "${other.locale}" but not in the base locale "${base.locale}".`,
        });
      }
    }
  }

  return issues;
}
