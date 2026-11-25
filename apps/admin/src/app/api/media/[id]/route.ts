import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getD1 } from "@/lib/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface MediaR2Bucket { delete(key: string): Promise<void>; }

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await createClient();
  const { data: { user }, error } = await auth.auth.getUser();
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = getD1("DB");
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  const found = await db.from("media").select("*").eq("id", id).maybeSingle();
  if (found.error) return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  if (!found.data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = String(found.data.url);
  const match = url.match(/\/(covers|media)\/([^/?#]+)$/);
  if (match) {
    try {
      const bucket = getCloudflareContext({ async: false }).env.MEDIA as unknown as MediaR2Bucket | undefined;
      await bucket?.delete(`${match[1]}/${match[2]}`);
    } catch (deleteError) {
      console.error("[media delete] R2 delete error:", deleteError);
    }
  }
  const deleted = await db.from("media").delete().eq("id", id);
  if (deleted.error) return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  return NextResponse.json({ success: true });
}
