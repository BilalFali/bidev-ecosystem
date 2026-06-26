import { getSupabaseClient } from "./supabase";

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

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductFaq {
  id: string;
  product_id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "flutter-starter-kit": "Flutter Starter Kits",
  "ui-kit": "UI Kits",
  "ebook": "Ebooks",
};

export const CATEGORY_EMOJI: Record<ProductCategory, string> = {
  "flutter-starter-kit": "🚀",
  "ui-kit": "🎨",
  "ebook": "📚",
};

export async function getAllProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllProducts error:", error);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data as Product;
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  return (data ?? []) as ProductImage[];
}

export async function getProductFaqs(productId: string): Promise<ProductFaq[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("product_faqs")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  return (data ?? []) as ProductFaq[];
}

export async function getRelatedProducts(
  productId: string,
  category: ProductCategory,
  limit = 3
): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("products")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", productId)
    .order("sort_order", { ascending: true })
    .limit(limit);

  return (data ?? []) as Product[];
}

export function formatPrice(price: number): string {
  return price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;
}
