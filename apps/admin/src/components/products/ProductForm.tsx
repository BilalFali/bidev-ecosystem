"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CoverImageUpload } from "@/components/ui/CoverImageUpload";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { ListEditor } from "@/components/editor/ListEditor";
import { slugify } from "@/lib/utils";
import type { Product, ProductFormData } from "@/lib/types/database";

const EMPTY: ProductFormData = {
  title:               "",
  slug:                "",
  short_description:   "",
  description:         "",
  category:            "flutter-starter-kit",
  cover_url:           "",
  price:               "",
  original_price:      "",
  price_github:        "",
  purchase_url_zip:    "",
  purchase_url_github: "",
  badge:               "",
  tags:                "",
  features:            [],
  whats_included:      [],
  requirements:        "",
  status:              "draft",
  sort_order:          "0",
};

function toFormData(p: Product): ProductFormData {
  return {
    title:             p.title,
    slug:              p.slug,
    short_description: p.short_description,
    description:       p.description,
    category:          p.category,
    cover_url:           p.cover_url ?? "",
    price:               p.price.toString(),
    original_price:      p.original_price?.toString() ?? "",
    price_github:        p.price_github?.toString() ?? "",
    purchase_url_zip:    p.purchase_url_zip ?? p.purchase_url ?? "",
    purchase_url_github: p.purchase_url_github ?? "",
    badge:               p.badge ?? "",
    tags:              p.tags.join(", "),
    features:          p.features,
    whats_included:    p.whats_included,
    requirements:      p.requirements.join("\n"),
    status:            p.status,
    sort_order:        p.sort_order.toString(),
  };
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isNew  = !product;
  const [form, setForm]   = useState<ProductFormData>(product ? toFormData(product) : EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

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
      slug:           form.slug.trim() || slugify(form.title),
      price:          parseFloat(form.price) || 0,
      original_price: form.original_price  ? parseFloat(form.original_price)  : null,
      price_github:   form.price_github    ? parseFloat(form.price_github)    : null,
      purchase_url_zip:    form.purchase_url_zip.trim()    || null,
      purchase_url_github: form.purchase_url_github.trim() || null,
      badge:          form.badge           || null,
      cover_url:      form.cover_url.trim() || null,
      tags:           form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      // features & whats_included are already string[]
      requirements:   form.requirements.split("\n").map((l) => l.trim()).filter(Boolean),
      sort_order:     parseInt(form.sort_order) || 0,
    };

    const res = await fetch(
      isNew ? "/api/products" : `/api/products/${product!.id}`,
      {
        method:  isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* ── Identity ──────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Flutter Firebase Kit"
          required
        />
        <Input
          label="Slug"
          value={form.slug}
          onChange={(e) => update("slug", slugify(e.target.value))}
          placeholder="flutter-firebase-kit"
          required
        />
      </div>

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

      {/* ── Cover image ───────────────────────────────────────────────── */}
      <CoverImageUpload
        value={form.cover_url}
        onChange={(url) => update("cover_url", url)}
        bucket="covers"
        productTitle={form.title}
        productCategory={form.category}
      />

      {/* ── Short description ─────────────────────────────────────────── */}
      <Textarea
        label="Short Description"
        value={form.short_description}
        onChange={(e) => update("short_description", e.target.value)}
        placeholder="Production-ready Flutter starter kit with Firebase Auth, Firestore, and Clean Architecture — ship your app in days."
        rows={2}
        hint="1 sentence shown on cards and in metadata (~120 chars)"
        required
      />

      {/* ── Description (rich text) ───────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-muted">Description</label>
        <TipTapEditor
          content={form.description}
          onChange={(html) => update("description", html)}
          placeholder="Full product overview — supports headings, bold, lists, links…"
          className="min-h-[280px]"
        />
        <p className="text-[11px] text-ink-faint">
          Full overview shown on the product detail page. Supports rich formatting.
        </p>
      </div>

      {/* ── Features (list editor) ────────────────────────────────────── */}
      <ListEditor
        label="Features"
        value={form.features}
        onChange={(arr) => update("features", arr)}
        placeholder="Firebase Authentication (Email, Google, Apple)…"
        hint="Each bullet = one feature. Press Enter to add a new one."
        minHeight={160}
      />

      {/* ── What's Included (list editor) ────────────────────────────── */}
      <ListEditor
        label="What's Included"
        value={form.whats_included}
        onChange={(arr) => update("whats_included", arr)}
        placeholder="Full Flutter source code…"
        hint="Each bullet = one included item."
        minHeight={130}
      />

      {/* ── Requirements (textarea) ───────────────────────────────────── */}
      <Textarea
        label="Requirements"
        value={form.requirements}
        onChange={(e) => update("requirements", e.target.value)}
        placeholder={"Flutter 3.x\nDart 3.x\nFirebase project\nXcode 15+ (iOS)"}
        rows={4}
        hint="One requirement per line"
      />

      {/* ── Tags + pricing ───────────────────────────────────────────── */}
      <Input
        label="Tags"
        value={form.tags}
        onChange={(e) => update("tags", e.target.value)}
        placeholder="Flutter, Firebase, Riverpod, Clean Architecture"
        hint="Comma-separated"
      />

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
          placeholder="79"
          hint="Optional — shows strikethrough"
        />
        <Input
          label="GitHub Access Price"
          type="number"
          value={form.price_github}
          onChange={(e) => update("price_github", e.target.value)}
          placeholder="99"
          hint="Blank → auto 1.5× price"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="📦 ZIP Purchase URL"
          value={form.purchase_url_zip}
          onChange={(e) => update("purchase_url_zip", e.target.value)}
          placeholder="https://payhip.com/b/… (ZIP)"
          hint="Standard option. Blank → 'Coming soon'."
        />
        <Input
          label="🥈 GitHub Access Purchase URL"
          value={form.purchase_url_github}
          onChange={(e) => update("purchase_url_github", e.target.value)}
          placeholder="https://payhip.com/b/… (GitHub)"
          hint="Recommended option. Blank → 'Coming soon'."
        />
      </div>

      <Input
        label="Sort Order"
        type="number"
        value={form.sort_order}
        onChange={(e) => update("sort_order", e.target.value)}
        placeholder="0"
        hint="Lower = shown first"
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={saving}>
          {isNew ? "Create Product" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
