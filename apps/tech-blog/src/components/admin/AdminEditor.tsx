"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, ImageIcon, Undo, Redo, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { validateImageFile, uploadFile } from "@/lib/admin/upload";

interface AdminEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({ active, onClick, title, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "p-1.5 transition-colors",
        active ? "bg-accent-tint text-accent" : "text-ink-muted hover:text-ink hover:bg-paper-sunken"
      )}
    >
      {children}
    </button>
  );
}

export function AdminEditor({ content, onChange, placeholder = "Start writing…" }: AdminEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Uses TipTap's own setImage command rather than a raw ProseMirror
  // tr.insert — the Image node is a block-group node, and inserting it
  // via a raw transaction at an inline (mid-paragraph) position is invalid
  // content that ProseMirror silently rejects. setImage handles splitting
  // the surrounding block correctly.
  async function uploadAndInsertAt(file: File, pos?: number) {
    setUploadError(null);
    const validationError = validateImageFile(file);
    if (validationError) { setUploadError(validationError); return; }

    setUploading(true);
    try {
      const result = await uploadFile(file);
      const ed = editorRef.current;
      if (!ed) throw new Error("Editor not ready");
      const chain = ed.chain().focus();
      if (pos !== undefined) chain.setTextSelection(pos);
      chain.setImage({ src: result.url, alt: file.name }).run();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "max-w-full" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    immediatelyRender: false,
    onCreate({ editor }) {
      editorRef.current = editor;
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      // Drop an image file straight into the body, like a real editor.
      handleDrop(view, event, _slice, moved) {
        if (moved) return false;
        const file = event.dataTransfer?.files?.[0];
        if (!file || !file.type.startsWith("image/")) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        uploadAndInsertAt(file, coords?.pos);
        return true;
      },
      // Paste an image (e.g. a screenshot) straight into the body.
      handlePaste(_view, event) {
        const item = Array.from(event.clipboardData?.items ?? []).find(i => i.type.startsWith("image/"));
        const file = item?.getAsFile();
        if (!file) return false;
        event.preventDefault();
        uploadAndInsertAt(file);
        return true;
      },
    },
  });

  if (!editor) return null;
  editorRef.current = editor;

  const words = editor.state.doc.textContent.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  function addLink() {
    const url = window.prompt("URL");
    if (url) editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function handleImageUpload(file: File) {
    uploadAndInsertAt(file);
  }

  return (
    <div className="flex flex-col border border-border bg-paper-raised">
      <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-border">
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-3.5 h-3.5" /></ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-3.5 h-3.5" /></ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-3.5 h-3.5" /></ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton title="Link" active={editor.isActive("link")} onClick={addLink}><LinkIcon className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Insert image" onClick={() => fileInputRef.current?.click()}>
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }}
        />
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo className="w-3.5 h-3.5" /></ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo className="w-3.5 h-3.5" /></ToolbarButton>
      </div>

      {uploadError && <p className="px-4 py-1.5 text-xs text-red-600 border-b border-border bg-red-50">{uploadError}</p>}

      <EditorContent editor={editor} className="prose prose-neutral max-w-none px-6 py-5 min-h-[400px] focus:outline-none" />

      <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-border bg-paper-sunken">
        <span className="text-xs text-ink-faint">{words} words</span>
        <span className="text-xs text-ink-faint">{readingTime} min read</span>
      </div>
    </div>
  );
}
