"use client";

import { useState } from "react";
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/react";
import { Check, Copy } from "lucide-react";

export function CodeBlockComponent({ node, updateAttributes, extension }: NodeViewProps) {
  const [copied, setCopied] = useState(false);
  const language: string = node.attrs.language ?? "plaintext";
  const languages: string[] = ["plaintext", ...extension.options.lowlight.listLanguages()].sort();

  async function handleCopy() {
    await navigator.clipboard.writeText(node.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <div className="code-block-header" contentEditable={false}>
        <select
          value={language}
          onChange={(e) => updateAttributes({ language: e.target.value })}
          className="code-block-lang-select"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <button type="button" onClick={handleCopy} className="code-block-copy-btn">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
