import "server-only";
import { getSupabaseClient } from "./supabase";
export type {
  ProductCategory,
  ProductBadge,
  ProductStatus,
  Product,
  ProductImage,
  ProductFaq,
} from "./products-config";
export { CATEGORY_LABELS, CATEGORY_ICONS, formatPrice } from "./products-config";

import type { Product, ProductCategory, ProductImage, ProductFaq } from "./products-config";

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
