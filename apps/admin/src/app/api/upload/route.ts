import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file   = formData.get("file") as File | null;
  const bucket = (formData.get("bucket") as string | null) ?? "media";

  if (!file)                         return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  if (file.size > MAX_SIZE)          return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 400 });

  const ext      = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer   = Buffer.from(await file.arrayBuffer());

  const service = createServiceClient();
  const { error: uploadError } = await service.storage
    .from(bucket)
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = service.storage.from(bucket).getPublicUrl(filename);

  // Record in media table
  await supabase.from("media").insert({
    filename,
    original_name: file.name,
    url: publicUrl,
    bucket,
    size: file.size,
    mime_type: file.type,
    uploaded_by: user.id,
  });

  return NextResponse.json({
    url: publicUrl,
    filename,
    size: file.size,
    mime_type: file.type,
  });
}
