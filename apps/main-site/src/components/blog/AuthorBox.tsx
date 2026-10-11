import Link from "next/link";
import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/site-links";

export function AuthorBox() {
  return (
    <section aria-labelledby="author-heading" className="rounded-xl border border-border bg-bg-card p-6 sm:p-8 flex flex-col sm:flex-row gap-5 sm:items-center">
      <Image src="/profile.png" alt="Bilal Fali" width={64} height={64} className="rounded-full border border-border object-cover shrink-0" />
      <div>
        <h2 id="author-heading" className="text-base font-semibold text-ink">Bilal Fali</h2>
        <p className="text-sm text-ink-muted mt-1 max-w-md leading-relaxed">
          Flutter developer. I build and ship Flutter apps and write down what I learn along the way.
        </p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <Link href="/about" className="text-accent-light hover:text-ink transition-colors">About</Link>
          {SOCIAL_LINKS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-accent-light transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
