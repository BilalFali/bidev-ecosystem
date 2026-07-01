"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CoverImageUpload } from "@/components/ui/CoverImageUpload";
import { slugify } from "@/lib/utils";
import type { Product, ProductFormData } from "@/lib/types/database";

const EMPTY: ProductFormData = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  category: "flutter-starter-kit",
  cover_url: "",
  price: "",
  original_price: "",
  price_github: "",
  purchase_url: "",
  badge: "",
  tags: "",
  features: "",
  whats_included: "",
  requirements: "",
  status: "draft",
  sort_order: "0",
};

function toFormData(p: Product): ProductFormData {
  return {
    title: p.title,
    slug: p.slug,
    short_description: p.short_description,
    description: p.description,
    category: p.category,
    cover_url: p.cover_url ?? "",
    price: p.price.toString(),
    original_price: p.original_price?.toString() ?? "",
    price_github: p.price_github?.toString() ?? "",
    purchase_url: p.purchase_url ?? "",
    badge: p.badge ?? "",
    tags: p.tags.join(", "),
    features: p.features.join("\n"),
    whats_included: p.whats_included.join("\n"),
    requirements: p.requirements.join("\n"),
    status: p.status,
    sort_order: p.sort_order.toString(),
  };
}

function splitLines(value: string): string[] {
  return value.split("\n").map((l) => l.trim()).filter(Boolean);
}

function splitTags(value: string): string[] {
  return value.split(",").map((t) => t.trim()).filter(Boolean);
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isNew = !product;
  const [form, setForm] = useState<ProductFormData>(product ? toFormData(product) : EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    update("title", value);
    if (isNew && (!form.slug || form.slug === slugify(form.title))) {
      update("slug", slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
      price: parseFloat(form.price) || 0,
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      price_github: form.price_github ? parseFloat(form.price_github) : null,
      purchase_url: form.purchase_url.trim() || null,
      badge: form.badge || null,
      cover_url: form.cover_url.trim() || null,
      tags: splitTags(form.tags),
      features: splitLines(form.features),
      whats_included: splitLines(form.whats_included),
      requirements: splitLines(form.requirements),
      sort_order: parseInt(form.sort_order) || 0,
    };

    const res = await fetch(
      isNew ? "/api/products" : `/api/products/${product!.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg ?? "Something went wrong.");
      setSaving(false);
      return;
    }

    const saved = await res.json();
    setSaving(false);
    router.push(isNew ? `/products/${saved.id}/edit` : "/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Title + Slug */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Flutter E-Commerce Starter Kit"
          required
        />
        <Input
          label="Slug"
          value={form.slug}
          onChange={(e) => update("slug", slugify(e.target.value))}
          placeholder="flutter-ecommerce-starter-kit"
          required
        />
      </div>

      {/* Category + Status + Badge */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => update("category", e.target.value as ProductFormData["category"])}
          options={[
            { value: "flutter-starter-kit", label: "🚀 Flutter Starter Kit" },
            { value: "ui-kit",              label: "🎨 UI Kit" },
            { value: "ebook",               label: "📚 Ebook" },
          ]}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => update("status", e.target.value as ProductFormData["status"])}
          options={[
            { value: "draft",     label: "Draft" },
            { value: "published", label: "Published" },
          ]}
        />
        <Select
          label="Badge"
          value={form.badge}
          onChange={(e) => update("badge", e.target.value)}
          options={[
            { value: "",           label: "None" },
            { value: "new",        label: "New" },
            { value: "bestseller", label: "Bestseller" },
            { value: "updated",    label: "Updated" },
          ]}
        />
      </div>

      {/* Short description */}
      <Textarea
        label="Short Description"
        value={form.short_description}
        onChange={(e) => update("short_description", e.target.value)}
        placeholder="One-sentence summary shown on cards and in metadata."
        rows={2}
        required
      />

      {/* Full description */}
      <Textarea
        label="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        placeholder="Full product description…"
        rows={6}
      />

      {/* Cover image upload */}
      <CoverImageUpload
        value={form.cover_url}
        onChange={(url) => update("cover_url", url)}
        bucket="covers"
        productTitle={form.title}
        productCategory={form.category}
      />

      {/* Pricing */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Input
          label="Price (USD)"
          type="number"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
          placeholder="49"
          required
        />
        <Input
          label="Original Price"
          type="number"
          value={form.original_price}
          onChange={(e) => update("original_price", e.target.value)}
          placeholder="79 (optional)"
        />
        <Input
          label="GitHub Access Price"
          type="number"
          value={form.price_github}
          onChange={(e) => update("price_github", e.target.value)}
          placeholder="99 (optional)"
          hint="Leave blank to auto-calculate as 1.5× price"
        />
      </div>

      {/* Purchase URL */}
      <Input
        label="Purchase URL"
        value={form.purchase_url}
        onChange={(e) => update("purchase_url", e.target.value)}
        placeholder="https://gumroad.com/… (Gumroad, Stripe, etc.)"
        hint="External checkout link. Leave blank to show 'Coming soon'."
      />

      {/* Tags */}
      <Input
        label="Tags"
        value={form.tags}
        onChange={(e) => update("tags", e.target.value)}
        placeholder="Flutter, Firebase, Riverpod, Clean Architecture"
        hint="Comma-separated"
      />

      {/* Features */}
      <Textarea
        label="Features"
        value={form.features}
        onChange={(e) => update("features", e.target.value)}
        placeholder={"Clean Architecture\nRiverpod state management\nFirebase Auth\n…"}
        rows={5}
        hint="One feature per line"
      />

      {/* What's Included */}
      <Textarea
        label="What's Included"
        value={form.whats_included}
        onChange={(e) => update("whats_included", e.target.value)}
        placeholder={"Full Flutter source code\nFirebase setup guide\n…"}
        rows={4}
        hint="One item per line"
      />

      {/* Requirements */}
      <Textarea
        label="Requirements"
        value={form.requirements}
        onChange={(e) => update("requirements", e.target.value)}
        placeholder={"Flutter 3.x\nDart 3.x\nFirebase project\n…"}
        rows={3}
        hint="One requirement per line"
      />

      {/* Sort order */}
      <Input
        label="Sort Order"
        type="number"
        value={form.sort_order}
        onChange={(e) => update("sort_order", e.target.value)}
        placeholder="0"
        hint="Lower number = shown first"
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={saving}>
          {isNew ? "Create Product" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
