// The format facet, independent of Category — per TAXONOMY.md §4.
// Kept as a plain constant (not a DB table): the 14 formats are fixed,
// unlike Categories/Sections which are editorially maintained rows.
export const CONTENT_TYPES = [
  { value: "news",         label: "News" },
  { value: "analysis",     label: "Analysis" },
  { value: "explainer",    label: "Explainer" },
  { value: "how-it-works", label: "How It Works" },
  { value: "guide",        label: "Guide" },
  { value: "buying-guide", label: "Buying Guide" },
  { value: "review",       label: "Review" },
  { value: "comparison",   label: "Comparison" },
  { value: "data-story",   label: "Data Story" },
  { value: "report",       label: "Report" },
  { value: "deep-dive",    label: "Deep Dive" },
  { value: "opinion",      label: "Opinion" },
  { value: "timeline",     label: "Timeline" },
  { value: "interview",    label: "Interview" },
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number]["value"];

export function contentTypeLabel(value: string | null | undefined): string | undefined {
  return CONTENT_TYPES.find((c) => c.value === value)?.label;
}
