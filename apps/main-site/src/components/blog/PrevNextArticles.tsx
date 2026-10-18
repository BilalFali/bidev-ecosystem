import Link from "next/link";

interface Neighbour {
  slug: string;
  title: string;
  summary: string;
}

export function PrevNextArticles({ prev, next }: { prev: Neighbour | null; next: Neighbour | null }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="More articles" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className="group block p-5 rounded-xl border border-border bg-bg-card hover:border-accent/50 transition-colors">
          <p className="font-mono text-[11px] text-ink-faint group-hover:text-accent-light mb-1 transition-colors">← previous article</p>
          <h3 className="text-base font-semibold text-ink mb-2">{prev.title}</h3>
          <p className="text-sm text-ink-muted line-clamp-2">{prev.summary}</p>
        </Link>
      ) : (
        <div className="hidden md:block" />
      )}
      {next && (
        <Link href={`/blog/${next.slug}`} className="group block p-5 rounded-xl border border-border bg-bg-card hover:border-accent/50 transition-colors md:text-right">
          <p className="font-mono text-[11px] text-ink-faint group-hover:text-accent-light mb-1 transition-colors">next article →</p>
          <h3 className="text-base font-semibold text-ink mb-2">{next.title}</h3>
          <p className="text-sm text-ink-muted line-clamp-2">{next.summary}</p>
        </Link>
      )}
    </nav>
  );
}
