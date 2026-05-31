"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import type { Category } from "@/lib/types/database";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [name,       setName]       = useState("");
  const [desc,       setDesc]       = useState("");
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc }),
    });
    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg);
      setSaving(false);
      return;
    }
    setName(""); setDesc(""); setShowModal(false);
    setSaving(false);
    fetchCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Articles in it will become uncategorised.")) return;
    await fetch("/api/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setCategories(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Categories"
        description={`${categories.length} categor${categories.length !== 1 ? "ies" : "y"}`}
        actions={
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus className="w-3.5 h-3.5" />New Category
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center">
          <FolderOpen className="w-8 h-8 text-ink-faint mx-auto mb-3" />
          <p className="text-sm text-ink-muted">No categories yet.</p>
        </div>
      ) : (
        <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Slug</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-bg-card/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-ink">{cat.name}</p>
                    {cat.description && <p className="text-xs text-ink-muted mt-0.5 truncate max-w-xs">{cat.description}</p>}
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <code className="text-xs text-ink-muted font-mono">{cat.slug}</code>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-ink-muted">{formatDate(cat.created_at)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-500/10 text-ink-muted hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Category" size="sm">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Flutter" required />
          <Textarea label="Description" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Optional description" rows={2} />
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
