"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag as TagIcon } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import type { Tag } from "@/lib/types/database";

export default function TagsPage() {
  const [tags,      setTags]      = useState<Tag[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [name,      setName]      = useState("");
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => { fetchTags(); }, []);

  async function fetchTags() {
    setLoading(true);
    const res = await fetch("/api/tags");
    const data = await res.json();
    setTags(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) { const { error: msg } = await res.json(); setError(msg); setSaving(false); return; }
    setName(""); setShowModal(false); setSaving(false);
    fetchTags();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tag?")) return;
    await fetch("/api/tags", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setTags(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Tags"
        description={`${tags.length} tag${tags.length !== 1 ? "s" : ""}`}
        actions={
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus className="w-3.5 h-3.5" />New Tag
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : tags.length === 0 ? (
        <div className="py-16 text-center">
          <TagIcon className="w-8 h-8 text-ink-faint mx-auto mb-3" />
          <p className="text-sm text-ink-muted">No tags yet.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {tags.map(tag => (
            <div key={tag.id} className="group flex items-center gap-2 bg-bg-elevated border border-border rounded-xl px-4 py-3 hover:border-border-strong transition-colors">
              <TagIcon className="w-3.5 h-3.5 text-ink-muted shrink-0" />
              <div>
                <p className="text-sm font-medium text-ink">{tag.name}</p>
                <p className="text-xs text-ink-faint">{formatDate(tag.created_at)}</p>
              </div>
              <button
                onClick={() => handleDelete(tag.id)}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-500/10 text-ink-muted hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Tag" size="sm">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Input label="Tag name" value={name} onChange={e => setName(e.target.value)} placeholder="flutter" required />
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
