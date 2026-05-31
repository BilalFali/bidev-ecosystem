"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Globe, EyeOff, Check } from "lucide-react";
import Link from "next/link";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { EditorSidebar } from "./EditorSidebar";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { slugify, estimateReadingTime } from "@/lib/utils";
import type { ArticleFormData, ArticleWithRelations, Category, Tag } from "@/lib/types/database";

const EMPTY_FORM: ArticleFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  cover_url: "",
  cover_alt: "",
  status: "draft",
  category_id: "",
  tag_ids: [],
  seo_title: "",
  seo_description: "",
  seo_keywords: [],
  featured: false,
};

interface ArticleEditorProps {
  article?: ArticleWithRelations;
  categories: Category[];
  tags: Tag[];
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function ArticleEditor({ article, categories, tags }: ArticleEditorProps) {
  const router = useRouter();
  const isNew  = !article;

  const [form,       setForm]       = useState<ArticleFormData>(() => ({
    ...EMPTY_FORM,
    ...(article ? {
      title:           article.title,
      slug:            article.slug,
      content:         article.content,
      excerpt:         article.excerpt ?? "",
      cover_url:       article.cover_url ?? "",
      cover_alt:       article.cover_alt ?? "",
      status:          article.status,
      category_id:     article.category_id ?? "",
      tag_ids:         article.tags.map(t => t.id),
      seo_title:       article.seo_title ?? "",
      seo_description: article.seo_description ?? "",
      seo_keywords:    article.seo_keywords ?? [],
      featured:        article.featured,
    } : {}),
  }));

  const [saveState,    setSaveState]    = useState<SaveState>("idle");
  const [error,        setError]        = useState<string | null>(null);
  const [showDelete,   setShowDelete]   = useState(false);
  const [slugLocked,   setSlugLocked]   = useState(!isNew);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setField<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm(prev => ({
      ...prev,
      title,
      slug: slugLocked ? prev.slug : slugify(title),
    }));
    if (!slugLocked) setSlugLocked(false);
  }

  // Auto-save after 3 s of inactivity
  useEffect(() => {
    if (isNew || saveState === "saving") return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      if (form.title) save("auto");
    }, 3000);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  async function save(mode: "manual" | "auto" | "publish" | "unpublish" = "manual") {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.slug.trim())  { setError("Slug is required."); return; }

    setError(null);
    setSaveState("saving");

    const payload = {
      ...form,
      reading_time: estimateReadingTime(form.content),
      status: mode === "publish"   ? "published"
            : mode === "unpublish" ? "draft"
            : form.status,
      published_at:
        mode === "publish" && form.status !== "published"
          ? new Date().toISOString()
          : article?.published_at ?? null,
    };

    try {
      const url = isNew ? "/api/articles" : `/api/articles/${article!.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "Save failed" }));
        throw new Error(msg);
      }

      const saved = await res.json();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);

      if (isNew) {
        router.replace(`/articles/${saved.id}/edit`);
      } else {
        setForm(prev => ({ ...prev, status: saved.status }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaveState("error");
    }
  }

  async function handleDelete() {
    try {
      await fetch(`/api/articles/${article!.id}`, { method: "DELETE" });
      router.push("/articles");
    } catch {
      setError("Delete failed.");
    }
  }

  const isPublished = form.status === "published";

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 h-14 border-b border-border bg-bg-secondary shrink-0">
        <Link href="/articles" className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4" />
          Articles
        </Link>

        <div className="w-px h-4 bg-border shrink-0" />

        <p className="text-sm text-ink-muted truncate flex-1">
          {form.title || "Untitled article"}
        </p>

        {/* Save state indicator */}
        {saveState === "saved" && (
          <span className="flex items-center gap-1 text-xs text-green-400 shrink-0">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
        {saveState === "saving" && (
          <span className="flex items-center gap-1 text-xs text-ink-muted shrink-0">
            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            Saving…
          </span>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={() => save("manual")} loading={saveState === "saving"}>
            <Save className="w-3.5 h-3.5" />
            Save
          </Button>
          {isPublished ? (
            <Button variant="ghost" size="sm" onClick={() => save("unpublish")}>
              <EyeOff className="w-3.5 h-3.5" />
              Unpublish
            </Button>
          ) : (
            <Button size="sm" onClick={() => save("publish")}>
              <Globe className="w-3.5 h-3.5" />
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-6 pt-4">
          <Alert type="error" message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Two-pane editor layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Main writing area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
            {/* Title */}
            <input
              value={form.title}
              onChange={handleTitleChange}
              onFocus={() => !isNew && setSlugLocked(true)}
              placeholder="Article title…"
              className="w-full bg-transparent text-3xl font-bold text-ink placeholder:text-ink-faint outline-none border-none resize-none"
            />

            {/* Editor */}
            <TipTapEditor
              content={form.content}
              onChange={html => setField("content", html)}
              placeholder="Start writing your article…"
            />
          </div>
        </div>

        {/* Settings sidebar */}
        <EditorSidebar
          form={form}
          onChange={setField}
          categories={categories}
          tags={tags}
          isNew={isNew}
          onDelete={() => setShowDelete(true)}
        />
      </div>

      {/* Delete confirmation modal */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Article" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Are you sure you want to delete <strong className="text-ink">&ldquo;{form.title}&rdquo;</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete permanently</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
