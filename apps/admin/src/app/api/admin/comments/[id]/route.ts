import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Params { params: Promise<{ id: string }> }

// PATCH /api/admin/comments/:id  →  approve
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { error } = await (supabase as any)
      .from("comments")
      .update({ approved: true })
      .eq("id", id);
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// DELETE /api/admin/comments/:id  →  delete
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { error } = await (supabase as any)
      .from("comments")
      .delete()
      .eq("id", id);
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
