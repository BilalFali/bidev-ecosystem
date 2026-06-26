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

export type JobRemoteType = "remote" | "hybrid" | "onsite";
export type JobEmploymentType = "full-time" | "part-time" | "contract" | "internship";
export type JobStatus = "draft" | "published" | "closed";

export interface Job {
  id: string;
  title: string;
  slug: string;
  company: string;
  company_logo_url: string | null;
  location: string | null;
  remote: JobRemoteType;
  employment_type: JobEmploymentType;
  category: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  description: string;
  apply_url: string | null;
  apply_email: string | null;
  status: JobStatus;
  posted_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobFormData {
  title: string;
  slug: string;
  company: string;
  company_logo_url: string;
  location: string;
  remote: JobRemoteType;
  employment_type: JobEmploymentType;
  category: string;
  salary_min: string;
  salary_max: string;
  salary_currency: string;
  description: string;
  apply_url: string;
  apply_email: string;
  status: JobStatus;
  expires_at: string;
}

// ─── Products ────────────────────────────────────────────────────────────────

export type ProductCategory = "flutter-starter-kit" | "ui-kit" | "ebook";
export type ProductBadge = "new" | "bestseller" | "updated" | null;
export type ProductStatus = "draft" | "published";

export interface Product {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category: ProductCategory;
  cover_url: string | null;
  price: number;
  original_price: number | null;
  price_github: number | null;
  purchase_url: string | null;
  badge: ProductBadge;
  tags: string[];
  features: string[];
  whats_included: string[];
  requirements: string[];
  status: ProductStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category: ProductCategory;
  cover_url: string;
  price: string;
  original_price: string;
  price_github: string;
  purchase_url: string;
  badge: string;
  tags: string;
  features: string;
  whats_included: string;
  requirements: string;
  status: ProductStatus;
  sort_order: string;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type DeliveryType = "zip" | "github" | "pdf";
export type OrderStatus = "pending" | "completed" | "refunded";

export interface Order {
  id: string;
  customer_email: string;
  customer_name: string | null;
  product_id: string;
  delivery_type: DeliveryType;
  amount: number;
  status: OrderStatus;
  github_username: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithProduct extends Order {
  product_title?: string;
  product_category?: string;
}

// ─── GitHub Access Requests ───────────────────────────────────────────────────

export type GithubAccessStatus = "pending" | "invited" | "granted";

export interface GithubAccessRequest {
  id: string;
  order_id: string;
  customer_email: string;
  product_id: string;
  product_title: string;
  github_username: string;
  status: GithubAccessStatus;
  invited_at: string | null;
  granted_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalMedia: number;
  recentArticles: ArticleWithRelations[];
}
