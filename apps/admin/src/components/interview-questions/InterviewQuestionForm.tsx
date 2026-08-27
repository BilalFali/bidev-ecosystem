"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import { INTERVIEW_CATEGORIES } from "@/lib/types/database";
import type { InterviewQuestion, InterviewQuestionFormData } from "@/lib/types/database";

function questionToFormData(q: InterviewQuestion): InterviewQuestionFormData {
  return {
    slug: q.slug,
    question: q.question,
    category: q.category,
    tags: q.tags.join(", "),
    difficulty: q.difficulty,
    short_answer: q.short_answer,
    explanation: q.explanation,
    code_language: q.code_language ?? "",
    code_example: q.code_example ?? "",
    common_mistakes: (q.common_mistakes ?? []).join("\n"),
    interview_tips: (q.interview_tips ?? []).join("\n"),
    related_slugs: (q.related_slugs ?? []).join(", "),
    related_article_slugs: (q.related_article_slugs ?? []).join(", "),
    related_tool_slugs: (q.related_tool_slugs ?? []).join(", "),
    status: q.status,
  };
}

const EMPTY_FORM: InterviewQuestionFormData = {
  slug: "",
  question: "",
  category: INTERVIEW_CATEGORIES[0],
  tags: "",
  difficulty: "Beginner",
  short_answer: "",
  explanation: "",
  code_language: "",
  code_example: "",
  common_mistakes: "",
  interview_tips: "",
  related_slugs: "",
  related_article_slugs: "",
  related_tool_slugs: "",
  status: "draft",
};

export function InterviewQuestionForm({ question }: { question?: InterviewQuestion }) {
  const router = useRouter();
  const isNew = !question;
  const [form, setForm] = useState<InterviewQuestionFormData>(question ? questionToFormData(question) : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof InterviewQuestionFormData>(key: K, value: InterviewQuestionFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleQuestionChange(value: string) {
    update("question", value);
    if (isNew && (!form.slug || form.slug === slugify(form.question))) {
      update("slug", slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      tags:                   form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      common_mistakes:        form.common_mistakes.split("\n").map((l) => l.trim()).filter(Boolean),
      interview_tips:         form.interview_tips.split("\n").map((l) => l.trim()).filter(Boolean),
      related_slugs:          form.related_slugs.split(",").map((s) => s.trim()).filter(Boolean),
      related_article_slugs:  form.related_article_slugs.split(",").map((s) => s.trim()).filter(Boolean),
      related_tool_slugs:     form.related_tool_slugs.split(",").map((s) => s.trim()).filter(Boolean),
    };

    const res = await fetch(isNew ? "/api/interview-questions" : `/api/interview-questions/${question!.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg ?? "Something went wrong.");
      setSaving(false);
      return;
    }

    const saved = await res.json();
    setSaving(false);
    router.push(isNew ? `/interview-questions/${saved.id}/edit` : "/interview-questions");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

      <Input
        label="Question"
        value={form.question}
        onChange={(e) => handleQuestionChange(e.target.value)}
        placeholder="What is the difference between StatelessWidget and StatefulWidget?"
        required
      />
      <Input
        label="Slug"
        value={form.slug}
        onChange={(e) => update("slug", slugify(e.target.value))}
        placeholder="stateless-vs-stateful-widget"
        required
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          options={INTERVIEW_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <Select
          label="Difficulty"
          value={form.difficulty}
          onChange={(e) => update("difficulty", e.target.value as InterviewQuestionFormData["difficulty"])}
          options={[
            { value: "Beginner", label: "Beginner" },
            { value: "Intermediate", label: "Intermediate" },
            { value: "Advanced", label: "Advanced" },
          ]}
        />
      </div>

      <Input
        label="Tags"
        value={form.tags}
        onChange={(e) => update("tags", e.target.value)}
        placeholder="widgets, basics"
        hint="Comma-separated"
      />

      <Textarea
        label="Short Answer"
        value={form.short_answer}
        onChange={(e) => update("short_answer", e.target.value)}
        placeholder="One or two sentences — shown as the highlighted summary and used for FAQ schema."
        rows={3}
        required
      />

      <Textarea
        label="Explanation"
        value={form.explanation}
        onChange={(e) => update("explanation", e.target.value)}
        placeholder="Full explanation. Separate paragraphs with a blank line."
        rows={10}
        required
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="Code Language"
          value={form.code_language}
          onChange={(e) => update("code_language", e.target.value)}
          options={[
            { value: "", label: "None" },
            { value: "dart", label: "Dart" },
            { value: "yaml", label: "YAML" },
            { value: "bash", label: "Bash" },
          ]}
        />
      </div>
      {form.code_language && (
        <Textarea
          label="Code Example"
          value={form.code_example}
          onChange={(e) => update("code_example", e.target.value)}
          placeholder="class Counter extends StatefulWidget { ... }"
          rows={8}
          className="font-mono text-xs"
        />
      )}

      <Textarea
        label="Common Mistakes"
        value={form.common_mistakes}
        onChange={(e) => update("common_mistakes", e.target.value)}
        placeholder="One mistake per line"
        rows={4}
        hint="One per line — optional"
      />

      <Textarea
        label="Interview Tips"
        value={form.interview_tips}
        onChange={(e) => update("interview_tips", e.target.value)}
        placeholder="One tip per line"
        rows={3}
        hint="One per line — optional"
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <Input
          label="Related Question Slugs"
          value={form.related_slugs}
          onChange={(e) => update("related_slugs", e.target.value)}
          placeholder="dart-async-await, future-vs-stream"
          hint="Comma-separated"
        />
        <Input
          label="Related Article Slugs"
          value={form.related_article_slugs}
          onChange={(e) => update("related_article_slugs", e.target.value)}
          placeholder="flutter-clean-architecture-2026"
          hint="Comma-separated"
        />
        <Input
          label="Related Tool Slugs"
          value={form.related_tool_slugs}
          onChange={(e) => update("related_tool_slugs", e.target.value)}
          placeholder="json-to-dart"
          hint="Comma-separated"
        />
      </div>

      <Select
        label="Status"
        value={form.status}
        onChange={(e) => update("status", e.target.value as InterviewQuestionFormData["status"])}
        options={[
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
        ]}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={saving}>{isNew ? "Create Question" : "Save Changes"}</Button>
      </div>
    </form>
  );
}
