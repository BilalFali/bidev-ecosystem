import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSnippetBySlug, SNIPPETS } from "@/lib/snippets";
import { pageMetadata } from "@/lib/seo";
import { SnippetView } from "@/components/snippets/SnippetView";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return SNIPPETS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const snippet = getSnippetBySlug(slug);
  if (!snippet) return {};
  return pageMetadata({
    title: `${snippet.title} – Flutter Dart Snippet`,
    description: snippet.description,
    path: `/snippets/${snippet.slug}`,
  });
}

export default async function SnippetPage({ params }: Props) {
  const { slug } = await params;
  const snippet = getSnippetBySlug(slug);
  if (!snippet) notFound();

  const related = SNIPPETS.filter(
    (s) => s.slug !== slug && (s.category === snippet.category || s.tags.some((t) => snippet.tags.includes(t)))
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-ink-faint mb-8">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href="/snippets" className="hover:text-accent transition-colors">Snippets</Link>
        <span>/</span>
        <span className="text-ink-muted">{snippet.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Link
            href={`/snippets?category=${encodeURIComponent(snippet.category)}`}
            className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
          >
            {snippet.category}
          </Link>
          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${
            snippet.difficulty === "beginner" ? "text-green-400 bg-green-400/10 border-green-400/20"
            : snippet.difficulty === "intermediate" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
            : "text-red-400 bg-red-400/10 border-red-400/20"
          }`}>
            {snippet.difficulty}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">{snippet.title}</h1>
        <p className="text-ink-muted leading-relaxed">{snippet.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {snippet.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Code */}
      <SnippetView code={snippet.code} language={snippet.language} />

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-bold text-ink mb-4">Related Snippets</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/snippets/${r.slug}`}
                className="group p-4 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all"
              >
                <h3 className="font-medium text-ink group-hover:text-accent transition-colors text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-ink-faint line-clamp-2">{r.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-border">
        <Link href="/snippets" className="text-sm text-accent hover:text-accent-hover transition-colors">
          ← Back to all snippets
        </Link>
      </div>
    </div>
  );
}
