export type TechArticleStatus = "draft" | "published" | "archived";

export interface TechCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  seo_title: string | null;
  meta_description: string | null;
  active: boolean;
  created_at: string;
}

export interface TechSection {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface TechTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

// The format facet, per TAXONOMY.md §4 — fixed list, not an editable table.
export const TECH_CONTENT_TYPES = [
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

export interface TechArticle {
  id: string;
  title: string;
  slug: string;
  dek: string | null;
  content: string;
  excerpt: string | null;
  cover_url: string | null;
  cover_alt: string | null;
  status: TechArticleStatus;
  author_id: string | null;
  category_id: string | null;
  section_id: string | null;
  content_type: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  reading_time: number | null;
  views: number;
  featured: boolean;
  breaking: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface TechArticleWithRelations extends TechArticle {
  category_name: string | null;
  category_slug: string | null;
  section_name: string | null;
  section_slug: string | null;
  tags: Pick<TechTag, "id" | "name" | "slug">[];
}

export interface TechArticleFormData {
  title: string;
  slug: string;
  dek: string;
  content: string;
  excerpt: string;
  cover_url: string;
  cover_alt: string;
  status: TechArticleStatus;
  category_id: string;
  section_id: string;
  content_type: string;
  tag_ids: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  featured: boolean;
  breaking: boolean;
}
