"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Code } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Conversion helpers ──────────────────────────────────────────────────────

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function arrayToListHtml(items: string[]): string {
  if (items.length === 0) return "<ul><li><p></p></li></ul>";
  return `<ul>${items.map((t) => `<li><p>${escHtml(t)}</p></li>`).join("")}</ul>`;
}

export function listHtmlToArray(html: string): string[] {
  const matches = html.match(/<li[^>]*>([\s\S]*?)<\/li>/g) ?? [];
  return matches
    .map((li) =>
      li
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim()
    )
    .filter(Boolean);
}

// ── Component ───────────────────────────────────────────────────────────────

interface ListEditorProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  minHeight?: number;
}

export function ListEditor({
  value,
  onChange,
  placeholder = "Add items — press Enter for a new line…",
  label,
  hint,
  minHeight = 130,
}: ListEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading:         false,
        codeBlock:       false,
        blockquote:      false,
        horizontalRule:  false,
        orderedList:     false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: arrayToListHtml(value),
    immediatelyRender: false,
    onCreate({ editor }) {
      if (!editor.isActive("bulletList")) {
        editor.chain().focus().toggleBulletList().run();
      }
    },
    onUpdate({ editor }) {
      onChange(listHtmlToArray(editor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = arrayToListHtml(value);
    if (editor.getHTML() !== current) {
      editor.commands.setContent(current, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!editor) return null;

  const count = value.length;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-ink-muted">{label}</label>
          <span className="text-[11px] text-ink-faint">
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>
      )}

      <div className="border border-border rounded-xl overflow-hidden bg-bg-card">
        {/* Compact toolbar */}
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-bg-secondary">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint mr-2">
            ● List
          </span>
          {[
            {
              label: "Bold",
              icon: Bold,
              action: () => editor.chain().focus().toggleBold().run(),
              active: editor.isActive("bold"),
            },
            {
              label: "Code",
              icon: Code,
              action: () => editor.chain().focus().toggleCode().run(),
              active: editor.isActive("code"),
            },
          ].map(({ label: l, icon: Icon, action, active }) => (
            <button
              key={l}
              type="button"
              title={l}
              onClick={action}
              className={cn(
                "p-1.5 rounded transition-colors",
                active
                  ? "bg-accent/20 text-accent"
                  : "text-ink-muted hover:text-ink hover:bg-bg-elevated"
              )}
            >
              <Icon className="w-3 h-3" />
            </button>
          ))}
          <span className="ml-auto text-[10px] text-ink-faint">
            ↵ new item
          </span>
        </div>

        <EditorContent
          editor={editor}
          className="list-editor px-4 py-3"
          style={{ minHeight }}
        />
      </div>

      {hint && <p className="text-[11px] text-ink-faint">{hint}</p>}
    </div>
  );
}
