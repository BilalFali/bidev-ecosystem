"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateImageFile, uploadFile } from "@/lib/upload";

interface CoverUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function CoverUpload({ value, onChange }: CoverUploadProps) {
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    setError(null);
    const validationError = validateImageFile(file);
    if (validationError) { setError(validationError); return; }

    setUploading(true);
    try {
      const result = await uploadFile(file, "covers");
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  if (value) {
    return (
      <div className="space-y-2">
        <div className="relative rounded-lg overflow-hidden border border-border aspect-video bg-bg-card">
          <Image src={value} alt="Cover" fill className="object-cover" sizes="320px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-ink-muted hover:text-ink transition-colors"
        >
          Replace image
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
          dragging
            ? "border-accent bg-accent/5"
            : "border-border hover:border-border-strong bg-bg-card hover:bg-bg-elevated"
        )}
      >
        {uploading ? (
          <>
            <span className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
            <p className="text-xs text-ink-muted">Uploading…</p>
          </>
        ) : (
          <>
            <span className="w-9 h-9 rounded-lg bg-bg-elevated border border-border flex items-center justify-center">
              {dragging ? <Upload className="w-4 h-4 text-accent" /> : <ImageIcon className="w-4 h-4 text-ink-muted" />}
            </span>
            <div className="text-center">
              <p className="text-xs font-medium text-ink">Drop image here</p>
              <p className="text-xs text-ink-muted">or click to browse · max 8 MB</p>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
    </div>
  );
}
