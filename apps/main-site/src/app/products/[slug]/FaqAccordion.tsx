"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProductFaq } from "@/lib/products-config";

export function FaqAccordion({ faqs }: { faqs: ProductFaq[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (faqs.length === 0) return null;

  return (
    <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        return (
          <div key={faq.id}>
            <button
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-elevated transition-colors gap-4"
            >
              <span className="text-sm font-medium text-ink">{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-ink-faint shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-sm text-ink-muted leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
