import Link from "next/link";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/utils";
import { AdSlot } from "@bidev/ui";
import { ErrorMessageBlock } from "./ErrorMessageBlock";
import { ProseContent } from "./ProseContent";
import { ShareButtons } from "./ShareButtons";
import { Comments } from "./Comments";
import { BuyMeCoffee } from "@/components/BuyMeCoffee";

interface RelatedLink {
  slug: string;
  title: string;
}

export function TroubleshootingArticle({
  post,
  postUrl,
  relatedProblems,
  relatedGuides,
}: {
  post: Article;
  postUrl: string;
  relatedProblems: RelatedLink[];
  relatedGuides: RelatedLink[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex gap-12">
        <article className="flex-1 min-w-0 max-w-3xl">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-faint mb-8 flex-wrap">
            <Link href="/" className="hover:text-ink-muted transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/troubleshooting" className="hover:text-ink-muted transition-colors">Troubleshooting</Link>
            {post.troubleshootingCategorySlug && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/troubleshooting/${post.troubleshootingCategorySlug}`} className="hover:text-ink-muted transition-colors">
                  {post.troubleshootingCategory}
                </Link>
              </>
            )}
            <span aria-hidden="true">/</span>
            <span className="text-ink-muted truncate">{post.title}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-5 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-ink-muted mb-6">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
            {post.difficulty && (
              <>
                <span>·</span>
                <span>{post.difficulty}</span>
              </>
            )}
          </div>

          {/* Short direct answer */}
          {post.summary && (
            <p className="text-lg text-ink leading-relaxed mb-6">{post.summary}</p>
          )}

          {/* Error message */}
          {post.errorMessage && <ErrorMessageBlock message={post.errorMessage} />}

          {/* Affected platforms / technologies */}
          {((post.affectedPlatforms?.length ?? 0) > 0 || (post.technologies?.length ?? 0) > 0) && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.affectedPlatforms?.map((p) => (
                <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-bg-card border border-border text-ink-muted capitalize">{p}</span>
              ))}
              {post.technologies?.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent capitalize">{t}</span>
              ))}
            </div>
          )}

          <AdSlot type="banner" className="mb-10" />

          {/* Problem */}
          {post.problem && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-ink mb-3">The Problem</h2>
              <p className="text-ink-muted leading-relaxed">{post.problem}</p>
            </section>
          )}

          {/* Symptoms */}
          {post.symptoms && post.symptoms.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-ink mb-3">Symptoms</h2>
              <ul className="flex flex-col gap-2">
                {post.symptoms.map((s, i) => (
                  <li key={i} className="text-sm text-ink-muted leading-relaxed flex gap-2">
                    <span className="text-ink-faint shrink-0">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Causes */}
          {post.causes && post.causes.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-ink mb-3">Why This Happens</h2>
              <ul className="flex flex-col gap-2">
                {post.causes.map((c, i) => (
                  <li key={i} className="text-sm text-ink-muted leading-relaxed flex gap-2">
                    <span className="text-ink-faint shrink-0">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Quick fix */}
          {post.quickFix && (
            <section className="mb-8 p-5 rounded-xl border border-accent/25 bg-accent/5">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Quick Fix</p>
              <p className="text-ink leading-relaxed">{post.quickFix}</p>
            </section>
          )}

          {/* Full content (rich text — code blocks, commands, etc. authored in the admin editor) */}
          {post.content && (
            <ProseContent>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </ProseContent>
          )}

          {/* Solutions */}
          {post.solutions && post.solutions.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-ink mb-4">How to Fix It</h2>
              <div className="flex flex-col gap-6">
                {post.solutions.map((sol, i) => (
                  <div key={i}>
                    <h3 className="text-base font-semibold text-ink mb-2">
                      {sol.title || `Solution ${i + 1}`}
                    </h3>
                    <div className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">{sol.content}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <AdSlot type="in-article" className="my-10" />

          {/* Common mistakes */}
          {post.commonMistakes && post.commonMistakes.length > 0 && (
            <section className="mb-8 p-5 rounded-xl border border-red-500/20 bg-red-500/5">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">Common Mistakes</p>
              <ul className="flex flex-col gap-2">
                {post.commonMistakes.map((m, i) => (
                  <li key={i} className="text-sm text-ink-muted leading-relaxed flex gap-2">
                    <span className="text-red-400 shrink-0">×</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Verification steps */}
          {post.verificationSteps && post.verificationSteps.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-ink mb-3">How to Verify the Fix</h2>
              <ol className="flex flex-col gap-2">
                {post.verificationSteps.map((s, i) => (
                  <li key={i} className="text-sm text-ink-muted leading-relaxed flex gap-3">
                    <span className="text-accent shrink-0 font-semibold">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-border">
            <ShareButtons url={postUrl} title={post.title} />
          </div>

          {/* Related problems */}
          {relatedProblems.length > 0 && (
            <section className="mt-8 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-ink mb-4">Related Problems</h2>
              <div className="flex flex-col gap-2">
                {relatedProblems.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="text-sm text-accent hover:underline">
                    {r.title} →
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold text-ink mb-4">Related Flutter Guides</h2>
              <div className="flex flex-col gap-2">
                {relatedGuides.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="text-sm text-accent hover:underline">
                    {r.title} →
                  </Link>
                ))}
              </div>
            </section>
          )}

          <BuyMeCoffee variant="banner" />

          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-base font-semibold text-ink mb-6">Comments</h2>
            <Comments slug={post.slug} />
          </div>
        </article>

        <aside className="hidden xl:flex flex-col gap-6 w-64 flex-shrink-0">
          <div className="sticky top-24 flex flex-col gap-6">
            <AdSlot type="sidebar" />
          </div>
        </aside>
      </div>
    </div>
  );
}
