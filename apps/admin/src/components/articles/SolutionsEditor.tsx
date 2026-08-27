"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { TroubleshootingSolution } from "@/lib/types/database";

interface SolutionsEditorProps {
  value: TroubleshootingSolution[];
  onChange: (value: TroubleshootingSolution[]) => void;
}

export function SolutionsEditor({ value, onChange }: SolutionsEditorProps) {
  function updateSolution(index: number, patch: Partial<TroubleshootingSolution>) {
    onChange(value.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function removeSolution(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addSolution() {
    onChange([...value, { title: `Solution ${value.length + 1}`, content: "" }]);
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((sol, i) => (
        <div key={i} className="p-4 rounded-xl border border-border bg-bg-card flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              value={sol.title}
              onChange={(e) => updateSolution(i, { title: e.target.value })}
              placeholder={`Solution ${i + 1}`}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeSolution(i)}
              className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
              aria-label="Remove solution"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <Textarea
            value={sol.content}
            onChange={(e) => updateSolution(i, { content: e.target.value })}
            placeholder="Steps for this solution…"
            rows={4}
          />
        </div>
      ))}

      <Button type="button" variant="secondary" size="sm" onClick={addSolution}>
        <Plus className="w-3.5 h-3.5" />
        Add Solution
      </Button>
    </div>
  );
}
