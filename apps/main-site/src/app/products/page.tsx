import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_CONFIG, breadcrumbJsonLd } from "@bidev/shared";
import { getAllProducts, CATEGORY_LABELS, type ProductCategory } from "@/lib/products";
import { ProductsClient } from "./ProductsClient";
import { AdSlot } from "@bidev/ui";

const { SITE_URL } = SITE_CONFIG;

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Premium Flutter Resources — Starter Kits, UI Kits & Ebooks",
  description:
    "Production-ready Flutter starter kits, beautiful UI kits, and practical ebooks to help developers build faster.",
  path: "/products",
});

const CATEGORIES: {
  key: ProductCategory;
  emoji: string;
  title: string;
  description: string;
  cta: string;
}[] = [
  {
    key: "flutter-starter-kit",
    emoji: "🚀",
    title: "Flutter Starter Kits",
    description:
      "Production-ready Flutter projects with Clean Architecture, Riverpod, Firebase, Authentication, Notifications, and best practices baked in.",
    cta: "View Starter Kits",
  },
  {
    key: "ui-kit",
    emoji: "🎨",
    title: "UI Kits",
    description:
      "Modern Flutter UI templates including authentication, onboarding, dashboards, profiles, settings, e-commerce, and reusable widgets.",
    cta: "Browse UI Kits",
  },
  {
    key: "ebook",
    emoji: "📚",
    title: "Ebooks",
    description:
      "Professional ebooks covering Flutter, Firebase, AI integration, Clean Architecture, Riverpod, performance optimization, and developer productivity.",
    cta: "Explore Ebooks",
  },
];

export default async function ProductsPage() {
  const products = await getAllProducts();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Products", url: `${SITE_URL}/products` },
  ]);

  const counts = products.reduce(
    (acc, p) => { acc[p.category] = (acc[p.category] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <div className="mb-14 max-w-2xl animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Products</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-5 leading-tight">
          Premium Flutter Resources
        </h1>
        <p className="text-ink-muted text-lg leading-relaxed mb-7">
          Production-ready Flutter starter kits, beautiful UI kits, and practical ebooks to help developers build faster.
        </p>
        <a
          href="#products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors"
        >
          Browse Products →
        </a>
      </div>

      {/* Category cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.key}
            href={`/products?category=${cat.key}`}
            className="group flex flex-col gap-4 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{cat.emoji}</span>
              {counts[cat.key] ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {counts[cat.key]} {counts[cat.key] === 1 ? "product" : "products"}
                </span>
              ) : null}
            </div>
            <div>
              <h2 className="font-semibold text-ink text-base mb-1.5 group-hover:text-accent transition-colors">
                {cat.title}
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed">{cat.description}</p>
            </div>
            <span className="text-sm text-accent font-medium mt-auto">{cat.cta} →</span>
          </Link>
        ))}
      </div>

      <AdSlot type="banner" className="mb-10" />

      {/* Product listing */}
      <div id="products" className="scroll-mt-20">
        <Suspense fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-bg-card overflow-hidden animate-pulse">
                <div className="aspect-video bg-bg-elevated" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-bg-elevated rounded w-1/3" />
                  <div className="h-4 bg-bg-elevated rounded w-3/4" />
                  <div className="h-3 bg-bg-elevated rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        }>
          <ProductsClient products={products} />
        </Suspense>
      </div>

      <AdSlot type="in-article" className="mt-14" />
    </div>
  );
}
