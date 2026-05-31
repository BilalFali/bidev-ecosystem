import type { Metadata } from "next";
import { ContactForm } from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Bilal Fali for Flutter freelance projects, app development, and collaborations.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-accent mb-3">Let's talk</p>
        <h1 className="text-4xl font-bold text-ink mb-3">Get in Touch</h1>
        <p className="text-ink-muted">
          I'm currently available for freelance Flutter projects. Response within 24 hours.
        </p>
      </div>

      <ContactForm />

      <div className="mt-12 pt-8 border-t border-border grid sm:grid-cols-3 gap-6">
        {[
          { label:"Response time", val:"< 24 hours" },
          { label:"Email",         val:"bilalfali60@gmail.com" },
          { label:"Availability",  val:"Open to projects" },
        ].map(i => (
          <div key={i.label}>
            <p className="text-xs text-ink-faint mb-1">{i.label}</p>
            <p className="text-sm text-ink font-medium">{i.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
