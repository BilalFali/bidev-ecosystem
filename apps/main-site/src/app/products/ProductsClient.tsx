"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/products";
import { CATEGORY_LABELS, formatPrice } from "@/lib/products";

const BADGE_STYLES: Record<string, string> = {
  new:        "bg-accent/10 text-accent border border-accent/20",
  bestseller: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  updated:    "bg-green-500/10 text-green-400 border border-green-500/20",
};

function deliveryLabel(category: ProductCategory) {
  if (category === "ebook") return "📄 PDF";
  return "📦 ZIP + 🥈 GitHub";
}

function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.original_price && product.original_price > product.price;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200 overflow-hidden"
    >
      {/* Cover */}
      <div className="relative w-full aspect-video bg-bg-elevated overflow-hidden">
        {product.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.cover_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20 select-none">
            {product.category === "flutter-starter-kit" ? "🚀" : product.category === "ui-kit" ? "🎨" : "📚"}
          </div>
        )}
        {product.badge && (
          <span className={`absolute top-2.5 right-2.5 text-[11px] px-2 py-0.5 rounded-full font-semibold capitalize ${BADGE_STYLES[product.badge]}`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint mb-1">
            {CATEGORY_LABELS[product.category]}
          </p>
          <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
            {product.title}
          </h3>
          <p className="text-xs text-ink-muted mt-1.5 leading-relaxed line-clamp-2">
            {product.short_description}
          </p>
        </div>

        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-bg-elevated border border-border text-ink-faint">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-ink">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-xs text-ink-faint line-through">{formatPrice(product.original_price!)}</span>
            )}
          </div>
          <span className="text-[11px] text-ink-faint">{deliveryLabel(product.category)}</span>
        </div>
      </div>
    </Link>
  );
}

const FILTERS = [
  { key: "all",                 label: "All" },
  { key: "flutter-starter-kit", label: "🚀 Starter Kits" },
  { key: "ui-kit",              label: "🎨 UI Kits" },
  { key: "ebook",               label: "📚 Ebooks" },
] as const;

export function ProductsClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const paramCat = searchParams.get("category") ?? "all";

  const [activeFilter, setActiveFilter] = useState<string>(
    FILTERS.some((f) => f.key === paramCat) ? paramCat : "all"
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category") ?? "all";
    if (FILTERS.some((f) => f.key === cat)) setActiveFilter(cat);
  }, [searchParams]);

  const filtered = products.filter((p) => {
    const matchesCat = activeFilter === "all" || p.category === activeFilter;
    const q = query.toLowerCase();
    const matchesQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesQ;
  });

  return (
    <section>
      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                activeFilter === f.key
                  ? "bg-accent/10 text-accent border border-accent/20 font-medium"
                  : "text-ink-muted hover:text-ink hover:bg-bg-elevated border border-transparent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="sm:ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border focus-within:border-accent transition-colors w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-ink-faint shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed border-border">
          <p className="text-ink-muted mb-2">No products found.</p>
          <button
            onClick={() => { setActiveFilter("all"); setQuery(""); }}
            className="text-sm text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
