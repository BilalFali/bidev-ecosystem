import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Download, Github, BookOpen } from "lucide-react";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { breadcrumbJsonLd, productJsonLd, faqJsonLd } from "@bidev/shared";
import {
  getAllProducts,
  getProductBySlug,
  getProductImages,
  getProductFaqs,
  getRelatedProducts,
  CATEGORY_LABELS,
  formatPrice,
} from "@/lib/products";
import { AdSlot } from "@bidev/ui";
import { ProductGallery } from "./ProductGallery";
import { FaqAccordion } from "./FaqAccordion";

const { SITE_URL } = SITE_CONFIG;

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return pageMetadata({
      title: "Product not found",
      description: "This product is no longer available.",
      path: `/products/${slug}`,
    });
  }
  return pageMetadata({
    title: product.title,
    description: product.short_description || product.description.slice(0, 155),
    path: `/products/${slug}`,
    image: product.cover_url ?? undefined,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [images, faqs, related] = await Promise.all([
    getProductImages(product.id),
    getProductFaqs(product.id),
    getRelatedProducts(product.id, product.category, 3),
  ]);

  const isCodeProduct = product.category !== "ebook";

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Products", url: `${SITE_URL}/products` },
    { name: CATEGORY_LABELS[product.category], url: `${SITE_URL}/products?category=${product.category}` },
    { name: product.title, url: `${SITE_URL}/products/${slug}` },
  ]);

  const productLd = productJsonLd({
    url: `${SITE_URL}/products/${slug}`,
    name: product.title,
    description: product.short_description || product.description.slice(0, 300),
    image: product.cover_url ?? undefined,
    price: product.price,
    category: CATEGORY_LABELS[product.category],
    sellerName: "Bidev",
    sellerUrl: SITE_URL,
  });

  const faqLd = faqs.length > 0
    ? faqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))
    : null;

  const BADGE_STYLES: Record<string, string> = {
    new:        "bg-accent/10 text-accent border border-accent/20",
    bestseller: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    updated:    "bg-green-500/10 text-green-400 border border-green-500/20",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      {/* Breadcrumb */}
      <nav className="text-xs text-ink-faint mb-6 flex flex-wrap items-center gap-1.5">
        <Link href="/products" className="hover:text-ink-muted transition-colors">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-ink-muted transition-colors">
          {CATEGORY_LABELS[product.category]}
        </Link>
        <span>/</span>
        <span className="text-ink-muted">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 xl:gap-14">
        {/* Left column */}
        <div className="flex flex-col gap-10">
          {/* Gallery */}
          {(product.cover_url || images.length > 0) && (
            <ProductGallery cover={product.cover_url} images={images} title={product.title} />
          )}

          {/* Description */}
          {product.description && (
            <section>
              <h2 className="text-base font-semibold text-ink mb-3">Description</h2>
              <div className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">
                {product.description}
              </div>
            </section>
          )}

          {/* Features */}
          {product.features.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-ink mb-3">Features</h2>
              <ul className="flex flex-col gap-2">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm text-ink-muted">{feat}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What's Included */}
          {product.whats_included.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-ink mb-3">What&apos;s Included</h2>
              <ul className="flex flex-col gap-2">
                {product.whats_included.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-accent text-sm shrink-0">✦</span>
                    <span className="text-sm text-ink-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {product.requirements.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-ink mb-3">Requirements</h2>
              <ul className="flex flex-col gap-2">
                {product.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-ink-faint text-sm shrink-0">→</span>
                    <span className="text-sm text-ink-muted">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQ */}
          {faqs.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-ink mb-3">FAQ</h2>
              <FaqAccordion faqs={faqs} />
            </section>
          )}

          <AdSlot type="in-article" />
        </div>

        {/* Right column — purchase sidebar */}
        <div className="flex flex-col gap-5">
          <div className="sticky top-20 flex flex-col gap-5">
            {/* Product header */}
            <div className="p-5 rounded-xl border border-border bg-bg-card">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  {CATEGORY_LABELS[product.category]}
                </p>
                {product.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold capitalize ${BADGE_STYLES[product.badge]}`}>
                    {product.badge}
                  </span>
                )}
              </div>
              <h1 className="text-lg font-bold text-ink leading-snug mb-2">{product.title}</h1>
              <p className="text-sm text-ink-muted leading-relaxed">{product.short_description}</p>

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-bg-elevated border border-border text-ink-faint">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery options */}
            {isCodeProduct ? (
              <div className="flex flex-col gap-3">
                {/* Standard — ZIP */}
                <div className="p-5 rounded-xl border border-border bg-bg-card flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-ink-faint" />
                      <span className="text-sm font-semibold text-ink">Standard</span>
                    </div>
                    <span className="text-base font-bold text-ink">{formatPrice(product.price)}</span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {[
                      "Instant ZIP download",
                      "Current version",
                      "Full source code",
                      "Commercial use",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-ink-muted">
                        <Check className="w-3 h-3 text-ink-faint shrink-0" />
                        {item}
                      </li>
                    ))}
                    {[
                      "No future updates",
                      "No GitHub access",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-ink-faint">
                        <span className="w-3 h-3 shrink-0 text-center leading-none">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {product.purchase_url ? (
                    <a
                      href={product.purchase_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-ink hover:bg-bg-elevated transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Buy ZIP — {formatPrice(product.price)}
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-ink-faint cursor-not-allowed"
                    >
                      Coming soon
                    </button>
                  )}
                </div>

                {/* Recommended — GitHub */}
                <div className="p-5 rounded-xl border border-accent/40 bg-accent/5 flex flex-col gap-3 relative">
                  <span className="absolute -top-2.5 left-4 text-[11px] px-2 py-0.5 rounded-full bg-accent text-bg font-semibold">
                    Recommended
                  </span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-accent" />
                      <span className="text-sm font-semibold text-ink">Private GitHub Access</span>
                    </div>
                    <span className="text-base font-bold text-ink">
                      {formatPrice(product.price_github ?? product.price * 1.5)}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {[
                      "Private GitHub repository access",
                      "Lifetime updates",
                      "Full git history",
                      "Release notes",
                      "Documentation",
                      "Priority support",
                      "Commercial use",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-ink-muted">
                        <Check className="w-3 h-3 text-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {product.purchase_url ? (
                    <a
                      href={product.purchase_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Get GitHub Access
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent/50 text-bg text-sm font-semibold cursor-not-allowed"
                    >
                      Coming soon
                    </button>
                  )}
                  <p className="text-[11px] text-ink-faint text-center leading-relaxed">
                    After purchase you&apos;ll be asked for your GitHub username. Repository access is granted within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              /* Ebook — PDF */
              <div className="p-5 rounded-xl border border-border bg-bg-card flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-ink">PDF Download</span>
                  </div>
                  <span className="text-base font-bold text-ink">{formatPrice(product.price)}</span>
                </div>
                {product.original_price && product.original_price > product.price && (
                  <p className="text-xs text-ink-faint">
                    Regular price: <span className="line-through">{formatPrice(product.original_price)}</span>
                  </p>
                )}
                <ul className="flex flex-col gap-1.5">
                  {[
                    "High-quality PDF",
                    "Instant download",
                    "Lifetime access",
                    "No DRM",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-ink-muted">
                      <Check className="w-3 h-3 text-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-xs text-ink-faint">
                    <span className="w-3 h-3 shrink-0 text-center leading-none">✕</span>
                    Commercial redistribution not allowed
                  </li>
                </ul>
                {product.purchase_url ? (
                  <a
                    href={product.purchase_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Buy PDF — {formatPrice(product.price)}
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent/50 text-bg text-sm font-semibold cursor-not-allowed"
                  >
                    Coming soon
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16 pt-10 border-t border-border">
          <h2 className="text-lg font-semibold text-ink mb-6">
            More {CATEGORY_LABELS[product.category]}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/products/${rel.slug}`}
                className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
              >
                {rel.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rel.cover_url}
                    alt={rel.title}
                    className="w-14 h-14 rounded-lg object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-bg-elevated border border-border flex items-center justify-center text-xl shrink-0">
                    {rel.category === "flutter-starter-kit" ? "🚀" : rel.category === "ui-kit" ? "🎨" : "📚"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink group-hover:text-accent transition-colors leading-snug">
                    {rel.title}
                  </p>
                  <p className="text-xs text-ink-muted mt-1 line-clamp-2">{rel.short_description}</p>
                  <p className="text-xs font-semibold text-accent mt-2">{formatPrice(rel.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
