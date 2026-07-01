"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Spinner } from "./Spinner";

interface CoverImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: "covers" | "media";
}

export function CoverImageUpload({ value, onChange, bucket = "covers" }: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("bucket", bucket);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(json.error ?? "Upload failed");
      return;
    }
    onChange(json.url);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-ink-muted">Cover Image</label>

      {value ? (
        /* Preview */
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-bg-elevated group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-xs font-medium text-ink hover:border-accent transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-bg/70 flex items-center justify-center">
              <Spinner size="md" />
            </div>
          )}
        </div>
      ) : (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="relative w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-accent/50 bg-bg-elevated flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group"
        >
          {uploading ? (
            <Spinner size="md" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center group-hover:border-accent/40 transition-colors">
                <ImageIcon className="w-5 h-5 text-ink-faint" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-ink">Click or drag to upload</p>
                <p className="text-xs text-ink-faint mt-0.5">PNG, JPG, WebP — max 8 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
