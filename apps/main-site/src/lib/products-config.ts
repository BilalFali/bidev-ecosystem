// Client-safe types and constants for the Products module.
// No server-only imports — safe to use in "use client" components.

import type { LucideIcon } from "lucide-react";
import { Rocket, Palette, BookOpen } from "lucide-react";

export type ProductCategory = "flutter-starter-kit" | "ui-kit" | "ebook";
export type ProductBadge    = "new" | "bestseller" | "updated" | null;
export type ProductStatus   = "draft" | "published";

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
  purchase_url: string | null;        // legacy
  purchase_url_zip: string | null;
  purchase_url_github: string | null;
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
  "ui-kit":              "UI Kits",
  "ebook":               "Ebooks",
};

export const CATEGORY_ICONS: Record<ProductCategory, LucideIcon> = {
  "flutter-starter-kit": Rocket,
  "ui-kit":              Palette,
  "ebook":               BookOpen,
};

export function formatPrice(price: number): string {
  return price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;
}
