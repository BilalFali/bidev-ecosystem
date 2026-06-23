import type { Difficulty } from "@/lib/interview-questions";

const STYLES: Record<Difficulty, string> = {
  Beginner: "bg-green-500/15 text-green-400 border-green-500/25",
  Intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Advanced: "bg-red-500/15 text-red-400 border-red-500/25",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STYLES[difficulty]}`}>
      {difficulty}
    </span>
  );
}
