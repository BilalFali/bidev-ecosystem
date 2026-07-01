"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Sparkles, RefreshCw } from "lucide-react";
import { Spinner } from "./Spinner";
import { generateCover } from "@/lib/generateCover";

const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  "flutter-starter-kit": { label: "Flutter Starter Kit", emoji: "🚀" },
  "ui-kit":              { label: "UI Kit",              emoji: "🎨" },
  "ebook":               { label: "Ebook",               emoji: "📚" },
};

interface CoverImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: "covers" | "media";
  productTitle?: string;
  productCategory?: string;
}

export function CoverImageUpload({
  value,
  onChange,
  bucket = "covers",
  productTitle = "",
  productCategory = "flutter-starter-kit",
}: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [promptTitle, setPromptTitle] = useState(productTitle);
  const [generating, setGenerating] = useState(false);

  // ── Upload a File blob ──────────────────────────────────────────────────────
  async function uploadBlob(file: File | Blob, name = "cover.png") {
    setError(null);
    setUploading(true);
    const form = new FormData();
    form.append("file", file instanceof File ? file : new File([file], name, { type: "image/png" }));
    form.append("bucket", bucket);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) { setError(json.error ?? "Upload failed"); return; }
    onChange(json.url);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadBlob(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadBlob(file);
  }

  // ── AI / canvas generation ──────────────────────────────────────────────────
  async function handleGenerate() {
    if (!promptTitle.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const meta = CATEGORY_META[productCategory] ?? CATEGORY_META["flutter-starter-kit"];
      const blob = await generateCover({
        title:    promptTitle.trim(),
        category: meta.label,
        emoji:    meta.emoji,
      });
      await uploadBlob(blob, `cover-${Date.now()}.png`);
      setShowGenerate(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-ink-muted">Cover Image</label>

      {value ? (
        /* ── Preview ──────────────────────────────────────────────────────── */
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-bg-elevated group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
              onClick={() => { setPromptTitle(productTitle); setShowGenerate(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
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
        /* ── Empty state ─────────────────────────────────────────────────── */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-border bg-bg-elevated flex flex-col items-center justify-center gap-4"
        >
          {uploading || generating ? (
            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" />
              <p className="text-xs text-ink-faint">{generating ? "Generating cover…" : "Uploading…"}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-border flex items-center justify-center group-hover:border-accent/40 transition-colors">
                    <ImageIcon className="w-4.5 h-4.5 text-ink-faint" />
                  </div>
                  <span className="text-xs font-medium text-ink-muted group-hover:text-ink transition-colors">Upload image</span>
                  <span className="text-[11px] text-ink-faint">PNG, JPG, WebP · 8 MB</span>
                </button>

                <span className="text-xs text-ink-faint">or</span>

                {/* Generate button */}
                <button
                  type="button"
                  onClick={() => { setPromptTitle(productTitle); setShowGenerate(true); }}
                  className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl border border-accent/30 bg-accent/5 hover:border-accent/60 hover:bg-accent/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-accent" />
                  </div>
                  <span className="text-xs font-medium text-accent">Generate cover</span>
                  <span className="text-[11px] text-accent/60">From product title</span>
                </button>
              </div>

              <p className="text-[11px] text-ink-faint">Drag &amp; drop an image anywhere here</p>
            </>
          )}
        </div>
      )}

      {/* ── Generate panel ─────────────────────────────────────────────────── */}
      {showGenerate && (
        <div className="p-4 rounded-xl border border-accent/25 bg-accent/5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-ink">Generate Cover</span>
            </div>
            <button
              type="button"
              onClick={() => setShowGenerate(false)}
              className="p-1 rounded-md hover:bg-bg-elevated text-ink-faint hover:text-ink transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-ink-faint">Product title shown on the cover</label>
            <input
              value={promptTitle}
              onChange={(e) => setPromptTitle(e.target.value)}
              placeholder="Flutter Firebase Kit"
              className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-border text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent transition-colors"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleGenerate())}
            />
            <p className="text-[11px] text-ink-faint">
              A 1200×630 branded cover will be generated and uploaded automatically.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !promptTitle.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <><Spinner size="sm" /><span>Generating…</span></>
            ) : (
              <><Sparkles className="w-4 h-4" /><span>Generate &amp; Upload</span></>
            )}
          </button>
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
