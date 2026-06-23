import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@bidev/shared";
import {
  resolveFilter,
  getQuestionBySlug,
  resolveRelatedQuestions,
  getAllFilterKeys,
  INTERVIEW_QUESTIONS,
} from "@/lib/interview-questions";
import { getAllArticles } from "@/lib/articles";
import { TOOLS } from "@/lib/tools";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { QuestionDetail } from "@/components/interview/QuestionDetail";
import { AdSlot } from "@bidev/ui";

const { SITE_URL } = SITE_CONFIG;

export function generateStaticParams() {
  const keys = getAllFilterKeys();
  const questionSlugs = INTERVIEW_QUESTIONS.map((q) => q.slug);
  return [...keys, ...questionSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const filter = resolveFilter(slug);
  if (filter) {
    return pageMetadata({
      title: `${filter.label} Flutter Interview Questions`,
      description: `${filter.questions.length} ${filter.label.toLowerCase()} Flutter interview questions with explanations, code examples, and best practices.`,
      path: `/flutter-interview-questions/${slug}`,
    });
  }

  const question = getQuestionBySlug(slug);
  if (question) {
    return pageMetadata({
      title: question.question,
      description: question.shortAnswer,
      path: `/flutter-interview-questions/${slug}`,
    });
  }

  return pageMetadata({
    title: "Flutter Interview Questions",
    description: "Flutter interview questions and answers.",
    path: `/flutter-interview-questions/${slug}`,
  });
}

export default async function InterviewFilterOrQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const filter = resolveFilter(slug);
  if (filter) {
    const breadcrumb = breadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Flutter Interview Questions", url: `${SITE_URL}/flutter-interview-questions` },
      { name: filter.label, url: `${SITE_URL}/flutter-interview-questions/${slug}` },
    ]);
    const faq = faqJsonLd(filter.questions.map((q) => ({ question: q.question, answer: q.shortAnswer })));

    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

        <nav className="text-xs text-ink-faint mb-5">
          <Link href="/flutter-interview-questions" className="hover:text-ink-muted transition-colors">
            Flutter Interview Questions
          </Link>{" "}
          / {filter.label}
        </nav>
        <h1 className="text-3xl font-bold text-ink mb-2">{filter.label} Flutter Interview Questions</h1>
        <p className="text-ink-muted mb-8">{filter.questions.length} questions</p>

        <AdSlot type="banner" className="mb-8" />

        {filter.questions.length === 0 ? (
          <p className="text-ink-faint">No questions found for this filter yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filter.questions.map((q) => (
              <QuestionCard key={q.slug} question={q} />
            ))}
          </div>
        )}

        <AdSlot type="in-article" className="mt-12" />
      </div>
    );
  }

  const question = getQuestionBySlug(slug);
  if (!question) notFound();

  const relatedQuestions = resolveRelatedQuestions(slug);
  const relatedTools = (question.relatedToolSlugs ?? [])
    .map((s) => TOOLS.find((t) => t.slug === s))
    .filter((t): t is (typeof TOOLS)[number] => Boolean(t));

  const allArticles = await getAllArticles();
  const relatedArticles = (question.relatedArticleSlugs ?? [])
    .map((s) => allArticles.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => ({ slug: a.slug, title: a.title }));

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Flutter Interview Questions", url: `${SITE_URL}/flutter-interview-questions` },
    { name: question.category, url: `${SITE_URL}/flutter-interview-questions/${slug}` },
  ]);
  const faq = faqJsonLd([{ question: question.question, answer: question.shortAnswer }]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <QuestionDetail
        question={question}
        relatedQuestions={relatedQuestions}
        relatedArticles={relatedArticles}
        relatedTools={relatedTools}
      />
    </>
  );
}
