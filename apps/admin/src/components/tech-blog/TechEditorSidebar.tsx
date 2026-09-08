"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Globe, Lock, Trash2 } from "lucide-react";
import { CoverUpload } from "@/components/media/CoverUpload";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { TagInput } from "@/components/ui/TagInput";
import { Toggle } from "@/components/ui/Toggle";
import { StatusBadge } from "@/components/ui/Badge";
import {
  TECH_CONTENT_TYPES,
  type TechArticleFormData, type TechCategory, type TechSection, type TechTag,
} from "@/lib/types/techblog-database";

interface TechEditorSidebarProps {
  form: TechArticleFormData;
  onChange: <K extends keyof TechArticleFormData>(key: K, value: TechArticleFormData[K]) => void;
  categories: TechCategory[];
  sections: TechSection[];
  tags: TechTag[];
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

export function TechEditorSidebar({ form, onChange, categories, sections, tags, isNew, onDelete }: TechEditorSidebarProps) {
  const catOptions = categories.map(c => ({ value: c.id, label: c.name }));

  const sectionOptions = useMemo(
    () => sections.filter(s => s.category_id === form.category_id).map(s => ({ value: s.id, label: s.name })),
    [sections, form.category_id]
  );

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

  function handleCategoryChange(categoryId: string) {
    onChange("category_id", categoryId);
    // A section only makes sense within its own category — drop it on category change.
    onChange("section_id", "");
  }

  return (
    <aside className="w-72 shrink-0 flex flex-col border-l border-border bg-bg-secondary overflow-y-auto">
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
          description="Pin to featured/hero slots"
        />
        <Toggle
          checked={form.breaking}
          onChange={v => onChange("breaking", v)}
          label="Breaking"
          description="Shows the breaking-news badge and takes the lead hero slot"
        />
      </SidebarSection>

      <SidebarSection title="URL Slug">
        <Input
          value={form.slug}
          onChange={e => onChange("slug", e.target.value)}
          placeholder="my-article-slug"
          hint="Auto-generated from title"
        />
      </SidebarSection>

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

      {/* Category / Section / Content Type — TAXONOMY.md's three independent facets */}
      <SidebarSection title="Category">
        <Select
          value={form.category_id}
          onChange={e => handleCategoryChange(e.target.value)}
          options={catOptions}
          placeholder="Uncategorised"
        />
      </SidebarSection>

      <SidebarSection title="Section">
        <Select
          value={form.section_id}
          onChange={e => onChange("section_id", e.target.value)}
          options={sectionOptions}
          placeholder={form.category_id ? "No section" : "Choose a category first"}
          disabled={!form.category_id}
        />
      </SidebarSection>

      <SidebarSection title="Content Type">
        <Select
          value={form.content_type}
          onChange={e => onChange("content_type", e.target.value)}
          options={TECH_CONTENT_TYPES.map(t => ({ value: t.value, label: t.label }))}
          placeholder="Not set"
        />
      </SidebarSection>

      <SidebarSection title="Tags">
        <TagInput
          tags={selectedTagNames}
          onChange={handleTagChange}
          suggestions={tagSuggestions}
          placeholder="Add tag…"
        />
      </SidebarSection>

      <SidebarSection title="Excerpt" defaultOpen={false}>
        <Textarea
          value={form.excerpt}
          onChange={e => onChange("excerpt", e.target.value)}
          placeholder="Short summary shown in previews…"
          rows={3}
          counter={{ current: form.excerpt.length, max: 300 }}
        />
      </SidebarSection>

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
