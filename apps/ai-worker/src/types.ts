export interface SheetRow {
  rowIndex: number; // 1-based, including header offset
  keyword: string;
  titleHint: string;
  category: string;
  status: string;
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;       // ≤155 chars, used as meta description
  content: string;       // full HTML
  seo_title: string;     // ≤60 chars
  seo_description: string; // ≤155 chars
  seo_keywords: string[];
  reading_time: number;  // minutes
  suggested_tags: string[];
}
