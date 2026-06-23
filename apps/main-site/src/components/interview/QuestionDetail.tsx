import Link from "next/link";
import type { InterviewQuestion } from "@/lib/interview-questions";
import { DifficultyBadge } from "./DifficultyBadge";
import { QuestionCard } from "./QuestionCard";
import { RelatedTools } from "@/components/tools/RelatedTools";
import type { Tool } from "@/lib/tools";

interface RelatedArticle {
  slug: string;
  title: string;
}

export function QuestionDetail({
  question,
  relatedQuestions,
  relatedArticles,
  relatedTools,
}: {
  question: InterviewQuestion;
  relatedQuestions: InterviewQuestion[];
  relatedArticles: RelatedArticle[];
  relatedTools: Tool[];
}) {
  const paragraphs = question.explanation.split("\n\n");

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-center gap-2 mb-4">
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="text-xs text-ink-faint">{question.category}</span>
      </div>

      <h1 className="text-3xl font-bold text-ink mb-6 leading-snug">{question.question}</h1>

      <div className="p-5 rounded-xl border border-accent/25 bg-accent/5 mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Short Answer</p>
        <p className="text-ink leading-relaxed">{question.shortAnswer}</p>
      </div>

      <div className="flex flex-col gap-4 text-ink-muted leading-relaxed mb-8">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {question.codeExample && (
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint mb-2">Code Example</p>
          <pre className="px-4 py-3 rounded-xl bg-bg-card border border-border text-xs font-mono text-ink-muted overflow-x-auto whitespace-pre">
            {question.codeExample.code}
          </pre>
        </div>
      )}

      {question.commonMistakes && question.commonMistakes.length > 0 && (
        <div className="mb-8 p-5 rounded-xl border border-red-500/20 bg-red-500/5">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">Common Mistakes</p>
          <ul className="flex flex-col gap-2">
            {question.commonMistakes.map((m, i) => (
              <li key={i} className="text-sm text-ink-muted leading-relaxed flex gap-2">
                <span className="text-red-400 shrink-0">×</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {question.interviewTips && question.interviewTips.length > 0 && (
        <div className="mb-8 p-5 rounded-xl border border-accent/20 bg-accent/5">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Interview Tips</p>
          <ul className="flex flex-col gap-2">
            {question.interviewTips.map((t, i) => (
              <li key={i} className="text-sm text-ink-muted leading-relaxed flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedArticles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-ink mb-3">Related Articles</h2>
          <div className="flex flex-col gap-2">
            {relatedArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="text-sm text-accent hover:underline"
              >
                {a.title} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedQuestions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-ink mb-6">Related Questions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedQuestions.map((q) => (
              <QuestionCard key={q.slug} question={q} />
            ))}
          </div>
        </div>
      )}

      <RelatedTools tools={relatedTools} />
    </article>
  );
}
