"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Globe, Lock, Trash2 } from "lucide-react";
import { CoverUpload } from "@/components/media/CoverUpload";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { TagInput } from "@/components/ui/TagInput";
import { Toggle } from "@/components/ui/Toggle";
import { StatusBadge } from "@/components/ui/Badge";
import type { ArticleFormData, ArticleStatus, Category, Tag } from "@/lib/types/database";

interface EditorSidebarProps {
  form: ArticleFormData;
  onChange: <K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) => void;
  categories: Category[];
  tags: Tag[];
  isNew: boolean;
  onDelete?: () => void;
}

function SidebarSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </div>
  );
}

export function EditorSidebar({ form, onChange, categories, tags, isNew, onDelete }: EditorSidebarProps) {
  const catOptions = [
    ...categories.map(c => ({ value: c.id, label: c.name })),
  ];

  const tagSuggestions = tags.map(t => t.name);

  function handleTagChange(tagNames: string[]) {
    const ids = tagNames
      .map(name => tags.find(t => t.name === name)?.id)
      .filter(Boolean) as string[];
    onChange("tag_ids", ids);
  }

  const selectedTagNames = form.tag_ids
    .map(id => tags.find(t => t.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <aside className="w-72 shrink-0 flex flex-col border-l border-border bg-bg-secondary overflow-y-auto">
      {/* Publish section */}
      <SidebarSection title="Publish">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-muted">Status</span>
          <StatusBadge status={form.status} />
        </div>
        <div className="flex items-center gap-1.5 p-3 rounded-lg bg-bg-card border border-border">
          {form.status === "published"
            ? <Globe className="w-4 h-4 text-green-400 shrink-0" />
            : <Lock  className="w-4 h-4 text-ink-muted shrink-0" />
          }
          <span className="text-xs text-ink-muted flex-1">
            {form.status === "published" ? "Visible on site" : "Not visible on site"}
          </span>
        </div>
        <Toggle
          checked={form.featured}
          onChange={v => onChange("featured", v)}
          label="Featured article"
          description="Pin to featured slots"
        />
      </SidebarSection>

      {/* Slug */}
      <SidebarSection title="URL Slug">
        <Input
          value={form.slug}
          onChange={e => onChange("slug", e.target.value)}
          placeholder="my-article-slug"
          hint="Auto-generated from title"
        />
      </SidebarSection>

      {/* Cover image */}
      <SidebarSection title="Cover Image">
        <CoverUpload
          value={form.cover_url}
          onChange={url => onChange("cover_url", url)}
        />
        {form.cover_url && (
          <Input
            value={form.cover_alt}
            onChange={e => onChange("cover_alt", e.target.value)}
            placeholder="Describe the image…"
            label="Alt text"
          />
        )}
      </SidebarSection>

      {/* Category */}
      <SidebarSection title="Category">
        <Select
          value={form.category_id}
          onChange={e => onChange("category_id", e.target.value)}
          options={catOptions}
          placeholder="Uncategorised"
        />
      </SidebarSection>

      {/* Tags */}
      <SidebarSection title="Tags">
        <TagInput
          tags={selectedTagNames}
          onChange={handleTagChange}
          suggestions={tagSuggestions}
          placeholder="Add tag…"
        />
      </SidebarSection>

      {/* Excerpt */}
      <SidebarSection title="Excerpt" defaultOpen={false}>
        <Textarea
          value={form.excerpt}
          onChange={e => onChange("excerpt", e.target.value)}
          placeholder="Short summary shown in previews…"
          rows={3}
          counter={{ current: form.excerpt.length, max: 300 }}
        />
      </SidebarSection>

      {/* SEO */}
      <SidebarSection title="SEO" defaultOpen={false}>
        <Input
          label="SEO Title"
          value={form.seo_title}
          onChange={e => onChange("seo_title", e.target.value)}
          placeholder="Custom title for search engines"
          hint={`${form.seo_title.length}/60 · Leave blank to use article title`}
        />
        <Textarea
          label="Meta Description"
          value={form.seo_description}
          onChange={e => onChange("seo_description", e.target.value)}
          placeholder="Summary for search results…"
          rows={3}
          counter={{ current: form.seo_description.length, max: 160 }}
        />
        <TagInput
          label="Keywords"
          tags={form.seo_keywords}
          onChange={kw => onChange("seo_keywords", kw)}
          placeholder="Add keyword…"
        />
      </SidebarSection>

      {/* Danger zone */}
      {!isNew && onDelete && (
        <SidebarSection title="Danger Zone" defaultOpen={false}>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete this article
          </button>
        </SidebarSection>
      )}
    </aside>
  );
}
