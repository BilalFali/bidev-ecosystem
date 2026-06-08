import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png":  "png",
    "image/webp": "webp",
    "image/gif":  "gif",
    "image/avif": "avif",
  };
  return map[mime] ?? "jpg";
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth check ────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse form data ───────────────────────────────────────
    const formData = await req.formData();
    const file   = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string | null) ?? "media";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Fallback: some browsers send empty MIME — derive from filename
    const mimeType = file.type || `image/${file.name.split(".").pop() ?? "jpeg"}`;

    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: "Invalid file type. Accepted: JPEG, PNG, WebP, GIF, AVIF" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 400 });
    }

    if (!["covers", "media"].includes(bucket)) {
      return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
    }

    // ── Upload to Supabase Storage ────────────────────────────
    const ext      = extFromMime(mimeType);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Use Uint8Array — works in both Node.js and Edge runtimes
    const bytes = new Uint8Array(await file.arrayBuffer());

    const service = createServiceClient();
    const { error: uploadError } = await service.storage
      .from(bucket)
      .upload(filename, bytes, { contentType: mimeType, upsert: false });

    if (uploadError) {
      console.error("[upload] Supabase storage error:", uploadError);

      // Surface actionable messages for common mistakes
      if (uploadError.message.includes("Bucket not found")) {
        return NextResponse.json(
          { error: `Storage bucket "${bucket}" not found. Create it in Supabase → Storage.` },
          { status: 500 }
        );
      }

      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = service.storage.from(bucket).getPublicUrl(filename);

    // ── Record in media table (non-fatal if it fails) ─────────
    await supabase.from("media").insert({
      filename,
      original_name: file.name,
      url:           publicUrl,
      bucket,
      size:          file.size,
      mime_type:     mimeType,
      uploaded_by:   user.id,
    }).throwOnError().catch((e: unknown) => {
      console.warn("[upload] Failed to record in media table:", e);
    });

    return NextResponse.json({
      url:       publicUrl,
      filename,
      size:      file.size,
      mime_type: mimeType,
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload] Unexpected error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
