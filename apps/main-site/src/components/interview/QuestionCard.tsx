import Link from "next/link";
import type { InterviewQuestion } from "@/lib/interview-questions";
import { DifficultyBadge } from "./DifficultyBadge";

export function QuestionCard({ question }: { question: InterviewQuestion }) {
  return (
    <Link
      href={`/flutter-interview-questions/${question.slug}`}
      className="group flex flex-col gap-3 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
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
