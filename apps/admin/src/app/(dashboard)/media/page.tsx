"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatBytes, formatDate } from "@/lib/utils";
import { uploadFile, validateImageFile } from "@/lib/upload";
import { createClient } from "@/lib/supabase/client";
import type { MediaFile } from "@/lib/types/database";

export default function MediaPage() {
  const [files,     setFiles]     = useState<MediaFile[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied,    setCopied]    = useState<string | null>(null);
  const [dragging,  setDragging]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchMedia(); }, []);

  async function fetchMedia() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    setFiles((data ?? []) as MediaFile[]);
    setLoading(false);
  }

  async function handleUpload(file: File) {
    const err = validateImageFile(file);
    if (err) { alert(err); return; }
    setUploading(true);
    try {
      await uploadFile(file, "media");
      await fetchMedia();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this file?")) return;
    const supabase = createClient();
    await supabase.from("media").delete().eq("id", id);
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Media Library"
        description={`${files.length} file${files.length !== 1 ? "s" : ""}`}
        actions={
          <Button size="sm" onClick={() => inputRef.current?.click()} loading={uploading}>
            <Upload className="w-3.5 h-3.5" />
            Upload
          </Button>
        }
      />

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault(); setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleUpload(f);
        }}
        className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-border"
        }`}
      >
        <ImageIcon className="w-8 h-8 text-ink-faint mx-auto mb-2" />
        <p className="text-sm text-ink-muted">Drag & drop images here, or <button onClick={() => inputRef.current?.click()} className="text-accent hover:underline">browse</button></p>
        <p className="text-xs text-ink-faint mt-1">JPEG, PNG, WebP, GIF, AVIF · max 8 MB</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : files.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-ink-muted">No media files yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {files.map(file => (
            <div key={file.id} className="group relative bg-bg-elevated border border-border rounded-xl overflow-hidden">
              <div className="aspect-square relative bg-bg-card">
                <Image
                  src={file.url}
                  alt={file.alt ?? file.original_name}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="p-2">
                <p className="text-xs text-ink truncate" title={file.original_name}>{file.original_name}</p>
                <p className="text-xs text-ink-faint">{formatBytes(file.size)} · {formatDate(file.created_at)}</p>
              </div>
              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyUrl(file.url)}
                  className="p-2 rounded-lg bg-bg-elevated hover:bg-bg-card text-ink transition-colors"
                  title="Copy URL"
                >
                  {copied === file.url ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
