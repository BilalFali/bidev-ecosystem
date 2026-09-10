export type AdminArticleStatus = "draft" | "published" | "archived";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface AdminSection {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface AdminTag {
  id: string;
  name: string;
  slug: string;
}

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

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  dek: string | null;
  content: string;
  excerpt: string | null;
  cover_url: string | null;
  cover_alt: string | null;
  status: AdminArticleStatus;
  category_id: string | null;
  section_id: string | null;
  content_type: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  reading_time: number | null;
  featured: boolean;
  breaking: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface AdminArticleWithRelations extends AdminArticle {
  category_name: string | null;
  category_slug: string | null;
  section_name: string | null;
  section_slug: string | null;
  tags: Pick<AdminTag, "id" | "name" | "slug">[];
}

export interface AdminArticleFormData {
  title: string;
  slug: string;
  dek: string;
  content: string;
  excerpt: string;
  cover_url: string;
  cover_alt: string;
  status: AdminArticleStatus;
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
