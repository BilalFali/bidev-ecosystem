"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import type { Job, JobFormData } from "@/lib/types/database";

function jobToFormData(job: Job): JobFormData {
  return {
    title: job.title,
    slug: job.slug,
    company: job.company,
    company_logo_url: job.company_logo_url ?? "",
    location: job.location ?? "",
    remote: job.remote,
    employment_type: job.employment_type,
    category: job.category,
    salary_min: job.salary_min?.toString() ?? "",
    salary_max: job.salary_max?.toString() ?? "",
    salary_currency: job.salary_currency ?? "USD",
    description: job.description,
    apply_url: job.apply_url ?? "",
    apply_email: job.apply_email ?? "",
    status: job.status,
    expires_at: job.expires_at ? job.expires_at.slice(0, 10) : "",
  };
}

const EMPTY_FORM: JobFormData = {
  title: "",
  slug: "",
  company: "",
  company_logo_url: "",
  location: "",
  remote: "remote",
  employment_type: "full-time",
  category: "Flutter Development",
  salary_min: "",
  salary_max: "",
  salary_currency: "USD",
  description: "",
  apply_url: "",
  apply_email: "",
  status: "draft",
  expires_at: "",
};

export function JobForm({ job }: { job?: Job }) {
  const router = useRouter();
  const isNew = !job;
  const [form, setForm] = useState<JobFormData>(job ? jobToFormData(job) : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof JobFormData>(key: K, value: JobFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    update("title", value);
    if (isNew && (!form.slug || form.slug === slugify(form.title))) {
      update("slug", slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(isNew ? "/api/jobs" : `/api/jobs/${job!.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg ?? "Something went wrong.");
      setSaving(false);
      return;
    }

    const saved = await res.json();
    setSaving(false);
    router.push(isNew ? `/jobs/${saved.id}/edit` : "/jobs");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Job Title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Senior Flutter Developer" required />
        <Input label="Slug" value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} placeholder="senior-flutter-developer-acme" required />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Company" value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Acme Inc." required />
        <Input label="Company Logo URL" value={form.company_logo_url} onChange={(e) => update("company_logo_url", e.target.value)} placeholder="https://..." />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Input label="Location" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="San Francisco, CA" />
        <Select
          label="Remote"
          value={form.remote}
          onChange={(e) => update("remote", e.target.value as JobFormData["remote"])}
          options={[
            { value: "remote", label: "Remote" },
            { value: "hybrid", label: "Hybrid" },
            { value: "onsite", label: "Onsite" },
          ]}
        />
        <Select
          label="Employment Type"
          value={form.employment_type}
          onChange={(e) => update("employment_type", e.target.value as JobFormData["employment_type"])}
          options={[
            { value: "full-time", label: "Full-time" },
            { value: "part-time", label: "Part-time" },
            { value: "contract", label: "Contract" },
            { value: "internship", label: "Internship" },
          ]}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Input label="Category" value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Flutter Development" />
        <Input label="Salary Min" type="number" value={form.salary_min} onChange={(e) => update("salary_min", e.target.value)} placeholder="80000" />
        <Input label="Salary Max" type="number" value={form.salary_max} onChange={(e) => update("salary_max", e.target.value)} placeholder="120000" />
      </div>

      <Textarea
        label="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        placeholder="Role responsibilities, requirements, benefits..."
        rows={10}
        required
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Apply URL" value={form.apply_url} onChange={(e) => update("apply_url", e.target.value)} placeholder="https://company.com/apply" />
        <Input label="Apply Email" type="email" value={form.apply_email} onChange={(e) => update("apply_email", e.target.value)} placeholder="jobs@company.com" />
      </div>
      <p className="text-xs text-ink-faint -mt-3">Provide at least one — a URL or an email applicants can use.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => update("status", e.target.value as JobFormData["status"])}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "closed", label: "Closed" },
          ]}
        />
        <Input label="Expires" type="date" value={form.expires_at} onChange={(e) => update("expires_at", e.target.value)} hint="Optional — hides the listing after this date" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={saving}>{isNew ? "Create Job" : "Save Changes"}</Button>
      </div>
    </form>
  );
}
