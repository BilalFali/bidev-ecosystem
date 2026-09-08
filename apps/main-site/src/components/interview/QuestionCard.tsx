import Link from "next/link";
import type { InterviewQuestion } from "@/lib/interview-questions";
import { DifficultyBadge } from "./DifficultyBadge";

export function QuestionCard({ question }: { question: InterviewQuestion }) {
  return (
    <Link
      href={`/flutter-interview-questions/${question.slug}`}
      className="group flex flex-col gap-3 p-5 rounded-lg border-l-2 border-y border-r border-border hover:border-l-accent bg-bg-card transition-colors"
    >
      <div className="flex items-center gap-2">
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="text-xs text-ink-faint">{question.category}</span>
      </div>
      <h3 className="font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
        {question.question}
      </h3>
      <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">{question.shortAnswer}</p>
    </Link>
  );
}
