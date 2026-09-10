"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/admin/Button";
import { Input } from "@/components/admin/Input";
import { Textarea } from "@/components/admin/Textarea";
import type { AdminCategory } from "@/lib/admin/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    setCategories(await res.json());
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    const res = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description: desc }) });
    if (!res.ok) { const { error: msg } = await res.json(); setError(msg); setSaving(false); return; }
    setName(""); setDesc(""); setShowForm(false); setSaving(false);
    fetchCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Articles in it will become uncategorised.")) return;
    await fetch("/api/admin/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setCategories(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AdminHeader
        title="Categories"
        description={`${categories.length} categories — the fixed taxonomy from TAXONOMY.md`}
        actions={<Button size="sm" onClick={() => setShowForm(v => !v)}><Plus className="w-3.5 h-3.5" />New Category</Button>}
      />

      {showForm && (
        <form onSubmit={handleCreate} className="border border-border bg-paper-raised p-4 mb-5 space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Robotics" required />
          <Textarea label="Description" value={desc} onChange={e => setDesc(e.target.value)} rows={2} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Create</Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink-muted py-8 text-center">Loading…</p>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center"><FolderOpen className="w-8 h-8 text-ink-faint mx-auto mb-3" /><p className="text-sm text-ink-muted">No categories yet.</p></div>
      ) : (
        <div className="border border-border bg-paper-raised divide-y divide-border">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between px-4 py-3 hover:bg-paper-sunken transition-colors group">
              <div>
                <p className="text-sm font-medium text-ink">{cat.name}</p>
                <code className="text-xs text-ink-faint font-mono">{cat.slug}</code>
              </div>
              <button onClick={() => handleDelete(cat.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 text-ink-muted hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
