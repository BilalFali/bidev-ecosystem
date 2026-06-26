import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ProductForm } from "@/components/products/ProductForm";
import type { Product } from "@/lib/types/database";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  const product = data as unknown as Product;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader title="Edit Product" description={product.title} />
      <ProductForm product={product} />
    </div>
  );
}
