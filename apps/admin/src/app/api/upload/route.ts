import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface MediaR2Bucket {
  put(key: string, value: ArrayBuffer | Uint8Array, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  delete(key: string): Promise<void>;
}

declare global {
  interface CloudflareEnv {
    MEDIA?: MediaR2Bucket;
  }
}

const R2_PUBLIC_BASE_URL = "https://pub-eace516bff534771a23c8153d5db32e0.r2.dev";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/gif":  "gif",
  "image/avif": "avif",
};

export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth ───────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── 2. Parse ──────────────────────────────────────────────
    const formData = await req.formData();
    const file   = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string | null) ?? "media";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!["covers", "media"].includes(bucket)) {
      return NextResponse.json({ error: "Invalid bucket name" }, { status: 400 });
    }

    // Some browsers omit MIME — fall back to extension
    const mimeType = file.type || `image/${file.name.split(".").pop() ?? "jpeg"}`;

    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: "Invalid file type. Accepted: JPEG, PNG, WebP, GIF, AVIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 400 });
    }

    // ── 3. Upload to Cloudflare R2 ────────────────────────────
    const ext      = MIME_TO_EXT[mimeType] ?? "jpg";
    const filename = `${bucket}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes    = new Uint8Array(await file.arrayBuffer());
    let mediaBucket: MediaR2Bucket;
    try {
      mediaBucket = getCloudflareContext({ async: false }).env.MEDIA!;
    } catch {
      return NextResponse.json({ error: "R2 media storage is unavailable." }, { status: 503 });
    }
    if (!mediaBucket) {
      return NextResponse.json({ error: "R2 media storage is unavailable." }, { status: 503 });
    }
    await mediaBucket.put(filename, bytes, { httpMetadata: { contentType: mimeType } });
    const publicUrl = `${R2_PUBLIC_BASE_URL}/${filename}`;

    // ── 4. Record in media table (non-fatal) ──────────────────
    try {
      await supabase.from("media").insert({
        filename,
        original_name: file.name,
        url:           publicUrl,
        bucket,
        size:          file.size,
        mime_type:     mimeType,
        uploaded_by:   user.id,
      });
    } catch (mediaErr) {
      console.warn("[upload] media table insert failed (non-fatal):", mediaErr);
    }

    // ── 5. Return ─────────────────────────────────────────────
    return NextResponse.json({
      url:       publicUrl,
      filename,
      size:      file.size,
      mime_type: mimeType,
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload] unhandled error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
