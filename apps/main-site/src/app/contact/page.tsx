import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ui/ContactForm";

export const metadata: Metadata = pageMetadata({
  title: "Contact – bidev.site",
  description: "Get in touch with bidev.site for collaborations, freelance work, tool suggestions, or just to say hello.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-ink mb-3">Get in Touch</h1>
      <p className="text-ink-muted mb-10">Have a project, tool suggestion, or just want to connect? Drop a message.</p>

      <ContactForm />

      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-sm text-ink-muted mb-4">Or reach me directly:</p>
        <div className="flex flex-col gap-2">
          {[
            { label: "Email",    val: "bilalfali60@gmail.com",   href: "mailto:bilalfali60@gmail.com" },
            { label: "GitHub",   val: "github.com/BilalFali",     href: "https://github.com/BilalFali" },
            { label: "LinkedIn", val: "linkedin.com/in/falibilal", href: "https://linkedin.com/in/falibilal" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-accent transition-colors">
              <span className="w-20 text-ink-faint">{s.label}</span>
              <span className="text-ink-muted">{s.val}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
