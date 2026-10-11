export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

function plainText(inner: string): string {
  return inner
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:amp|lt|gt|quot|#39);/g, (m) => ENTITIES[m])
    .replace(/\s+/g, " ")
    .trim();
}

function slugFrom(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

/** Adds a unique id to every h2/h3 in an HTML string and returns them for a table of contents. */
export function addHeadingIds(html: string): { html: string; headings: TocHeading[] } {
  const headings: TocHeading[] = [];
  const used = new Set<string>();
  let fallback = 0;

  const out = html.replace(
    /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (full: string, lvl: string, attrs: string | undefined, inner: string) => {
      const text = plainText(inner);
      if (!text) return full;

      const attrText = attrs ?? "";
      const existing = /\sid=(?:"([^"]*)"|'([^']*)')/i.exec(attrText);
      let base = existing ? (existing[1] ?? existing[2] ?? "") : slugFrom(text);
      if (!base) base = `section-${++fallback}`;

      let id = base;
      let n = 2;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);

      headings.push({ id, text, level: Number(lvl) as 2 | 3 });

      if (existing && id === base) return full;
      const cleaned = attrText.replace(/\sid=(?:"[^"]*"|'[^']*')/i, "");
      return `<h${lvl}${cleaned} id="${id}">${inner}</h${lvl}>`;
    },
  );

  return { html: out, headings };
}

/** Headings for MDX articles; ids mirror rehype-slug (github-slugger style, duplicates get -1, -2). */
export function extractMarkdownHeadings(md: string): TocHeading[] {
  const body = md.replace(/```[\s\S]*?```/g, "");
  const re = /^(#{2,3})\s+(.+)$/gm;
  const seen = new Map<string, number>();
  const out: TocHeading[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const text = m[2].trim();
    const base = slugFrom(text) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    out.push({ id: count === 0 ? base : `${base}-${count}`, text, level: m[1].length as 2 | 3 });
  }
  return out;
}
