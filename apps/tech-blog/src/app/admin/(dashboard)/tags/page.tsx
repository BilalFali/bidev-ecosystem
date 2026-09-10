"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag as TagIcon } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/admin/Button";
import { Input } from "@/components/admin/Input";
import type { AdminTag } from "@/lib/admin/types";

export default function AdminTagsPage() {
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchTags(); }, []);

  async function fetchTags() {
    setLoading(true);
    const res = await fetch("/api/admin/tags");
    setTags(await res.json());
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    const res = await fetch("/api/admin/tags", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    if (!res.ok) { const { error: msg } = await res.json(); setError(msg); setSaving(false); return; }
    setName(""); setShowForm(false); setSaving(false);
    fetchTags();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tag?")) return;
    await fetch("/api/admin/tags", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setTags(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AdminHeader
        title="Tags"
        description={`${tags.length} tags — keep this list curated, per TAXONOMY.md §5`}
        actions={<Button size="sm" onClick={() => setShowForm(v => !v)}><Plus className="w-3.5 h-3.5" />New Tag</Button>}
      />

      {showForm && (
        <form onSubmit={handleCreate} className="border border-border bg-paper-raised p-4 mb-5 space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Input label="Tag name" value={name} onChange={e => setName(e.target.value)} placeholder="LLM" required />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Create</Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink-muted py-8 text-center">Loading…</p>
      ) : tags.length === 0 ? (
        <div className="py-16 text-center"><TagIcon className="w-8 h-8 text-ink-faint mx-auto mb-3" /><p className="text-sm text-ink-muted">No tags yet.</p></div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {tags.map(tag => (
            <div key={tag.id} className="group flex items-center gap-2 bg-paper-raised border border-border px-3 py-2">
              <TagIcon className="w-3.5 h-3.5 text-ink-muted" />
              <span className="text-sm text-ink">{tag.name}</span>
              <button onClick={() => handleDelete(tag.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-red-50 text-ink-muted hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
