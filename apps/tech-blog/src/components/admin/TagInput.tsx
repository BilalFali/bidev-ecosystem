"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  suggestions?: string[];
}

export function TagInput({ tags, onChange, placeholder = "Add tag…", label, suggestions = [] }: TagInputProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = suggestions
    .filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s))
    .slice(0, 5);

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInput("");
  }
  function removeTag(tag: string) {
    onChange(tags.filter(t => t !== tag));
  }
  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) { e.preventDefault(); addTag(input); }
    if (e.key === "Backspace" && !input && tags.length) removeTag(tags[tags.length - 1]);
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-ink-muted">{label}</label>}
      <div
        className={cn(
          "flex flex-wrap gap-1.5 bg-paper-raised border px-3 py-2 min-h-[40px] cursor-text",
          focused ? "ring-1 ring-accent/50 border-accent/50" : "border-border"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 bg-accent-tint text-accent border border-accent/20 px-2 py-0.5 text-xs font-medium">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-accent-hover"><X className="w-3 h-3" /></button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (input.trim()) addTag(input); }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
        />
      </div>
      {focused && input && filtered.length > 0 && (
        <div className="bg-paper-raised border border-border overflow-hidden">
          {filtered.map(s => (
            <button key={s} type="button" onMouseDown={() => addTag(s)} className="w-full text-left px-3 py-2 text-sm text-ink hover:bg-paper-sunken transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-ink-faint">Press Enter or comma to add</p>
    </div>
  );
}
