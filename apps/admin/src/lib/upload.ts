const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

export type UploadBucket = "covers" | "media";

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mime_type: string;
}

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, WebP, GIF and AVIF images are accepted.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File size must be under 8 MB.";
  }
  return null;
}

export async function uploadFile(
  file: File,
  bucket: UploadBucket = "media"
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(error ?? "Upload failed");
  }

  return res.json() as Promise<UploadResult>;
}
