"use client";

import { Textarea } from "@/components/ui/Textarea";
import { TagInput } from "@/components/ui/TagInput";
import { Select } from "@/components/ui/Select";
import { ListEditor } from "@/components/editor/ListEditor";
import { SolutionsEditor } from "./SolutionsEditor";
import type { ArticleFormData, TroubleshootingDifficulty } from "@/lib/types/database";

const DIFFICULTIES: TroubleshootingDifficulty[] = ["Beginner", "Intermediate", "Advanced"];

interface TroubleshootingFieldsProps {
  form: ArticleFormData;
  onChange: <K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) => void;
}

export function TroubleshootingFields({ form, onChange }: TroubleshootingFieldsProps) {
  return (
    <div className="flex flex-col gap-6 p-5 rounded-xl border border-border bg-bg-secondary">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Troubleshooting Details</p>

      <Textarea
        label="Problem"
        value={form.problem}
        onChange={(e) => onChange("problem", e.target.value)}
        placeholder="What is happening? A short, direct description of the problem."
        rows={2}
      />

      <Textarea
        label="Error Message"
        value={form.error_message}
        onChange={(e) => onChange("error_message", e.target.value)}
        placeholder="Paste the exact error message or stack trace…"
        rows={3}
      />

      <ListEditor
        label="Symptoms"
        value={form.symptoms}
        onChange={(v) => onChange("symptoms", v)}
        placeholder="Add a symptom — press Enter for a new line…"
      />

      <ListEditor
        label="Causes"
        value={form.causes}
        onChange={(v) => onChange("causes", v)}
        placeholder="Add a likely cause — press Enter for a new line…"
      />

      <Textarea
        label="Quick Fix"
        value={form.quick_fix}
        onChange={(e) => onChange("quick_fix", e.target.value)}
        placeholder="Optional — the fastest fix, if there's a single obvious one."
        rows={2}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Solutions</label>
        <SolutionsEditor value={form.solutions} onChange={(v) => onChange("solutions", v)} />
      </div>

      <ListEditor
        label="Verification Steps"
        value={form.verification_steps}
        onChange={(v) => onChange("verification_steps", v)}
        placeholder="Add a verification step — press Enter for a new line…"
      />

      <ListEditor
        label="Common Mistakes"
        value={form.common_mistakes}
        onChange={(v) => onChange("common_mistakes", v)}
        placeholder="Add a common mistake — press Enter for a new line…"
      />

      <TagInput
        label="Affected Platforms"
        tags={form.affected_platforms}
        onChange={(v) => onChange("affected_platforms", v)}
        placeholder="android, ios, web…"
      />

      <TagInput
        label="Technologies"
        tags={form.technologies}
        onChange={(v) => onChange("technologies", v)}
        placeholder="flutter, dart, firebase, dio…"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Difficulty</label>
        <Select
          value={form.difficulty}
          onChange={(e) => onChange("difficulty", e.target.value as TroubleshootingDifficulty | "")}
          options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
          placeholder="Not set"
        />
      </div>

      <TagInput
        label="Related Problems (article slugs)"
        tags={form.related_problems}
        onChange={(v) => onChange("related_problems", v)}
        placeholder="existing-article-slug…"
      />

      <TagInput
        label="Related Guides (article slugs)"
        tags={form.related_guides}
        onChange={(v) => onChange("related_guides", v)}
        placeholder="existing-article-slug…"
      />
    </div>
  );
}
