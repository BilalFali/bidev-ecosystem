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
  const productIds = [...new Set((orders ?? []).map((o) => o.product_id))];
  let productMap: Record<string, { title: string; category: string }> = {};

  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, title, category")
      .in("id", productIds);

    productMap = Object.fromEntries(
      (products ?? []).map((p) => [p.id, { title: p.title, category: p.category }])
    );
  }

  const enriched = (orders ?? []).map((o) => ({
    ...o,
    product_title:    productMap[o.product_id]?.title,
    product_category: productMap[o.product_id]?.category,
  }));

  return NextResponse.json(enriched);
}
