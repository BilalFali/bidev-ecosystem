"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link as LinkIcon,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus,
  AlignLeft, AlignCenter, AlignRight, Image as ImageIcon,
  Highlighter, Table as TableIcon, Undo, Redo,
  CodeSquare, Unlink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/upload";
import { useRef, useState } from "react";

interface MenuBarProps {
  editor: Editor;
}

function ToolBtn({
  onClick, active = false, title, disabled = false, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        active
          ? "bg-accent/20 text-accent"
          : "text-ink-muted hover:text-ink hover:bg-bg-elevated"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-border mx-0.5 self-center shrink-0" />;
}

export function MenuBar({ editor }: MenuBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [linkUrl,   setLinkUrl]   = useState("");
  const [showLink,  setShowLink]  = useState(false);

  function setLink() {
    if (!linkUrl) return;
    editor.chain().focus().extendMarkToUrl(linkUrl).run();
    setShowLink(false);
    setLinkUrl("");
  }

  function handleLinkBtn() {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      const prev = editor.getAttributes("link").href as string | undefined;
      setLinkUrl(prev ?? "https://");
      setShowLink(true);
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const result = await uploadFile(file, "media");
      editor.chain().focus().setImage({ src: result.url, alt: file.name }).run();
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function insertTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  const iconSize = "w-3.5 h-3.5";

  return (
    <div className="sticky top-0 z-10 bg-bg-secondary border-b border-border">
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2">
        {/* Undo / Redo */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className={iconSize} />
        </ToolBtn>
        <Divider />

        {/* Headings */}
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
          <Heading1 className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <Heading3 className={iconSize} />
        </ToolBtn>
        <Divider />

        {/* Inline marks */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
          <Bold className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
          <Italic className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
          <UnderlineIcon className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
          <Code className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
          <Highlighter className={iconSize} />
        </ToolBtn>
        <Divider />

        {/* Link */}
        <ToolBtn onClick={handleLinkBtn} active={editor.isActive("link")} title={editor.isActive("link") ? "Remove link" : "Add link"}>
          {editor.isActive("link") ? <Unlink className={iconSize} /> : <LinkIcon className={iconSize} />}
        </ToolBtn>
        <Divider />

        {/* Alignment */}
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
          <AlignLeft className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
          <AlignCenter className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
          <AlignRight className={iconSize} />
        </ToolBtn>
        <Divider />

        {/* Lists */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
          <List className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
          <ListOrdered className={iconSize} />
        </ToolBtn>
        <Divider />

        {/* Blocks */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
          <Quote className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
          <CodeSquare className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          <Minus className={iconSize} />
        </ToolBtn>
        <ToolBtn onClick={insertTable} title="Insert table">
          <TableIcon className={iconSize} />
        </ToolBtn>
        <Divider />

        {/* Image upload */}
        <ToolBtn onClick={() => fileInputRef.current?.click()} disabled={uploading} title="Insert image">
          {uploading
            ? <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
            : <ImageIcon className={iconSize} />
          }
        </ToolBtn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }}
        />
      </div>

      {/* Link input bar */}
      {showLink && (
        <div className="flex items-center gap-2 px-3 py-2 border-t border-border bg-bg-card">
          <LinkIcon className="w-3.5 h-3.5 text-ink-muted shrink-0" />
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") setLink(); if (e.key === "Escape") setShowLink(false); }}
            placeholder="https://example.com"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
          />
          <button onClick={setLink} className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">Apply</button>
          <button onClick={() => setShowLink(false)} className="text-xs text-ink-muted hover:text-ink transition-colors">Cancel</button>
        </div>
      )}
    </div>
  );
}
