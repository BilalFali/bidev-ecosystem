import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-ink-muted">
          © {new Date().getFullYear()} Bilal Fali · Flutter Developer
        </p>
        <div className="flex gap-5">
          {[
            { label: "bidev.site", href: "https://bidev.site" },
            { label: "GitHub",    href: "https://github.com/BilalFali" },
            { label: "LinkedIn",  href: "https://linkedin.com/in/falibilal" },
            { label: "YouTube",   href: "https://youtube.com/@bidev97" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="text-sm text-ink-faint hover:text-ink-muted transition-colors">{s.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
