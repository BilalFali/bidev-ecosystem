"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, BubbleMenu, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { common, createLowlight } from "lowlight";
import dart from "highlight.js/lib/languages/dart";
import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, Code } from "lucide-react";
import { MenuBar } from "./MenuBar";
import { CodeBlockComponent } from "./CodeBlockComponent";
import { cn } from "@/lib/utils";

const lowlight = createLowlight(common);
lowlight.register("dart", dart);

const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },
});

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function TipTapEditor({ content, onChange, placeholder = "Start writing…", className }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Image.configure({ allowBase64: false, HTMLAttributes: { class: "rounded-lg border border-border max-w-full" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      CodeBlock.configure({ lowlight }),
      Highlight.configure({ multicolor: false }),
      Typography,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Color,
      TextStyle,
    ],
    content,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!editor) return null;

  const charCount = editor.storage.characterCount as { characters: () => number; words: () => number } | undefined;
  const chars  = charCount?.characters() ?? 0;
  const words  = charCount?.words() ?? 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className={cn("flex flex-col border border-border rounded-xl overflow-hidden bg-bg-card", className)}>
      <MenuBar editor={editor} />

      {/* Bubble menu on text selection */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="flex items-center gap-0.5 bg-bg-elevated border border-border rounded-lg shadow-xl px-1.5 py-1"
      >
        {[
          { label: "Bold",      icon: Bold,         action: () => editor.chain().focus().toggleBold().run(),      active: editor.isActive("bold") },
          { label: "Italic",    icon: Italic,       action: () => editor.chain().focus().toggleItalic().run(),    active: editor.isActive("italic") },
          { label: "Underline", icon: UnderlineIcon,action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline") },
          { label: "Code",      icon: Code,         action: () => editor.chain().focus().toggleCode().run(),      active: editor.isActive("code") },
          { label: "Link",      icon: LinkIcon,     action: () => {}, active: editor.isActive("link") },
        ].map(({ label, icon: Icon, action, active }) => (
          <button
            key={label}
            type="button"
            title={label}
            onClick={action}
            className={cn(
              "p-1.5 rounded transition-colors",
              active ? "bg-accent/20 text-accent" : "text-ink-muted hover:text-ink hover:bg-bg-card"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </BubbleMenu>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="flex-1 px-6 py-5 prose-editor overflow-y-auto"
      />

      {/* Footer stats */}
      <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-border bg-bg-secondary">
        <span className="text-xs text-ink-faint">{words} words</span>
        <span className="text-xs text-ink-faint">{chars} characters</span>
        <span className="text-xs text-ink-faint">{readingTime} min read</span>
      </div>
    </div>
  );
}
