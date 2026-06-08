import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

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

    // ── 3. Upload to Supabase Storage ─────────────────────────
    const ext      = MIME_TO_EXT[mimeType] ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes    = new Uint8Array(await file.arrayBuffer());

    const service = createServiceClient();

    const { error: uploadError } = await service.storage
      .from(bucket)
      .upload(filename, bytes, { contentType: mimeType, upsert: false });

    if (uploadError) {
      console.error("[upload] storage error:", uploadError.message);

      const msg = uploadError.message.toLowerCase();
      if (msg.includes("bucket not found") || msg.includes("not found")) {
        return NextResponse.json(
          { error: `Bucket "${bucket}" not found — create it in Supabase → Storage.` },
          { status: 500 }
        );
      }

      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = service.storage.from(bucket).getPublicUrl(filename);

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
