import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@bidev/shared";
import {
  INTERVIEW_CATEGORIES,
  DIFFICULTIES,
  getAllInterviewQuestions,
  getAllTagSlugs,
} from "@/lib/interview-questions";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { AdSlot } from "@bidev/ui";

const { SITE_URL } = SITE_CONFIG;

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Flutter Interview Questions & Answers (2026)",
  description:
    "Prepare for Flutter developer interviews with curated questions, explanations, code examples, and best practices.",
  path: "/flutter-interview-questions",
});

export default async function InterviewQuestionsHub() {
  const allQuestions = await getAllInterviewQuestions();
  const featured = allQuestions.slice(0, 8);
  const tags = (await getAllTagSlugs()).slice(0, 12);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Flutter Interview Questions", url: `${SITE_URL}/flutter-interview-questions` },
  ]);

  const faq = faqJsonLd(
    featured.map((q) => ({ question: q.question, answer: q.shortAnswer }))
  );

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
          Interview Preparation
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-5 leading-tight">
          Flutter Interview <span className="text-gradient-accent">Questions & Answers</span> (2026)
        </h1>
        <p className="text-ink-muted max-w-2xl mx-auto mb-8 text-lg">
          Prepare for Flutter developer interviews with curated questions, explanations, code examples,
          and best practices.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {DIFFICULTIES.map((d) => (
            <Link
              key={d}
              href={`/flutter-interview-questions/${d.toLowerCase()}`}
              className="text-sm px-4 py-2 rounded-full border border-border bg-bg-card text-ink-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              {d}
            </Link>
          ))}
        </div>
        <p className="text-sm text-ink-faint">
          {allQuestions.length}+ questions across {INTERVIEW_CATEGORIES.length} categories
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <h2 className="text-lg font-semibold text-ink mb-8">Browse by Category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTERVIEW_CATEGORIES.map((cat) => {
            const count = allQuestions.filter((q) => q.category === cat.name).length;
            return (
              <Link
                key={cat.slug}
                href={`/flutter-interview-questions/${cat.slug}`}
                className="group flex flex-col gap-2 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
              >
                <cat.icon className="w-6 h-6 text-accent" strokeWidth={1.75} />
                <h3 className="font-semibold text-ink group-hover:text-accent transition-colors text-sm">{cat.name}</h3>
                <p className="text-xs text-ink-faint">{count} questions</p>
              </Link>
            );
          })}
        </div>

        {tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="text-xs text-ink-faint self-center">Browse by topic:</span>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/flutter-interview-questions/${tag}`}
                className="text-xs px-3 py-1 rounded-full border border-border bg-bg-elevated text-ink-muted hover:text-accent hover:border-accent/40 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── FEATURED QUESTIONS ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <h2 className="text-lg font-semibold text-ink mb-8">Featured Questions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((q) => (
            <QuestionCard key={q.slug} question={q} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="in-article" />
      </div>

      {/* ── ECOSYSTEM INTEGRATION ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="p-8 rounded-2xl border border-border bg-bg-card text-center">
          <h2 className="text-xl font-bold text-ink mb-2">Learn → Practice → Build → Ship</h2>
          <p className="text-sm text-ink-muted mb-6 max-w-xl mx-auto">
            Pair these questions with hands-on tools and in-depth articles to actually retain what you study.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/tools" className="px-5 py-2.5 rounded-lg bg-bg-elevated border border-border text-sm text-ink hover:border-border-strong transition-colors">
              Practice with Tools →
            </Link>
            <Link href="/blog" className="px-5 py-2.5 rounded-lg bg-bg-elevated border border-border text-sm text-ink hover:border-border-strong transition-colors">
              Read In-Depth Articles →
            </Link>
            <Link href="/snippets" className="px-5 py-2.5 rounded-lg bg-bg-elevated border border-border text-sm text-ink hover:border-border-strong transition-colors">
              Browse Code Snippets →
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 w-full py-16 text-center">
        <h2 className="text-2xl font-bold text-ink mb-3">Get weekly Flutter interview questions</h2>
        <p className="text-ink-muted mb-6">
          Get weekly Flutter interview questions and developer resources. No spam.
        </p>
        <NewsletterForm />
      </section>
    </div>
  );
}
