// Slug -> Tailwind text-color utility for the category eyebrow/label.
// Mirrors the cat.* palette defined in tailwind.config.ts (kept in sync
// manually since Tailwind needs literal class names, not computed ones).
// Category color is the actual identity mark here — it replaces a single
// monotone accent used for every category eyebrow alike.
const CATEGORY_TEXT_CLASS: Record<string, string> = {
  ai: "text-cat-ai",
  mobile: "text-cat-mobile",
  hardware: "text-cat-hardware",
  software: "text-cat-software",
  bigtech: "text-cat-bigtech",
  data: "text-cat-data",
  security: "text-cat-security",
  business: "text-cat-business",
  gaming: "text-cat-gaming",
  "future-tech-science": "text-cat-future-tech-science",
};

const FALLBACK_TEXT_CLASS = "text-ink-muted";

export function getCategoryTextClass(slug: string | null | undefined): string {
  if (!slug) return FALLBACK_TEXT_CLASS;
  return CATEGORY_TEXT_CLASS[slug] ?? FALLBACK_TEXT_CLASS;
}

// Raw hex for contexts that can't use a Tailwind class (an inline dot marker
// on a photo overlay, an SVG fill). Keep in sync with tailwind.config.ts's
// cat.* palette.
const CATEGORY_HEX: Record<string, string> = {
  ai: "#6B4FA0",
  mobile: "#B8456B",
  hardware: "#55606B",
  software: "#8C6D1F",
  bigtech: "#2E5A8C",
  data: "#0F6E5C",
  security: "#B0231C",
  business: "#A05A2C",
  gaming: "#2F7D4F",
  "future-tech-science": "#3F7C82",
};

const FALLBACK_HEX = "#4A453C";

export function getCategoryHex(slug: string | null | undefined): string {
  if (!slug) return FALLBACK_HEX;
  return CATEGORY_HEX[slug] ?? FALLBACK_HEX;
}
