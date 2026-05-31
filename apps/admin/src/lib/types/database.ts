export type ArticleStatus = "draft" | "published" | "archived";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_url: string | null;
  cover_alt: string | null;
  status: ArticleStatus;
  author_id: string;
  category_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  reading_time: number | null;
  views: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ArticleWithRelations extends Article {
  category_name: string | null;
  category_slug: string | null;
  tags: Pick<Tag, "id" | "name" | "slug">[];
}

export interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  bucket: string;
  size: number;
  mime_type: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  uploaded_by: string;
  created_at: string;
}

export interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_url: string;
  cover_alt: string;
  status: ArticleStatus;
  category_id: string;
  tag_ids: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  featured: boolean;
}

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalMedia: number;
  recentArticles: ArticleWithRelations[];
}
