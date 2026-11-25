import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Join product titles
  const orderRows = (orders ?? []) as unknown as Array<{ product_id: string; [key: string]: unknown }>;
  const productIds = [...new Set(orderRows.map((o) => o.product_id))];
  let productMap: Record<string, { title: string; category: string }> = {};

  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, title, category")
      .in("id", productIds);

    const productRows = (products ?? []) as unknown as Array<{ id: string; title: string; category: string }>;
    productMap = Object.fromEntries(
      productRows.map((p) => [p.id, { title: p.title, category: p.category }])
    );
  }

  const enriched = orderRows.map((o) => ({
    ...o,
    product_title:    productMap[o.product_id]?.title,
    product_category: productMap[o.product_id]?.category,
  }));

  return NextResponse.json(enriched);
}
