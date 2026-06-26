"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil, Package } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import type { Product, ProductStatus } from "@/lib/types/database";

const STATUS_VARIANT: Record<ProductStatus, "success" | "warning"> = {
  published: "success",
  draft:     "warning",
};

const CATEGORY_LABEL: Record<string, string> = {
  "flutter-starter-kit": "🚀 Starter Kit",
  "ui-kit":              "🎨 UI Kit",
  "ebook":               "📚 Ebook",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Products"
        description={`${products.length} product${products.length !== 1 ? "s" : ""}`}
        actions={
          <Link href="/products/new">
            <Button size="sm"><Plus className="w-3.5 h-3.5" />New Product</Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="w-8 h-8 text-ink-faint mx-auto mb-3" />
          <p className="text-sm text-ink-muted">No products yet.</p>
        </div>
      ) : (
        <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-bg-card/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-ink">{product.title}</p>
                    <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{product.short_description}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-ink-muted">{CATEGORY_LABEL[product.category] ?? product.category}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-sm font-medium text-ink">${Number(product.price).toFixed(0)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={STATUS_VARIANT[product.status]} dot>{product.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-ink-muted">{formatDate(product.updated_at)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="p-1.5 rounded-md hover:bg-bg-card text-ink-muted hover:text-accent"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-ink-muted hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
