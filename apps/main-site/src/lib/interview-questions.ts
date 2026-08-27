import { getSupabaseClient } from "./supabase";
import {
  type Difficulty,
  type InterviewQuestion,
  type InterviewCategory,
  INTERVIEW_CATEGORIES,
  DIFFICULTIES,
  FALLBACK_QUESTIONS,
} from "./interview-questions-data";

export type { Difficulty, InterviewQuestion, InterviewCategory };
export { INTERVIEW_CATEGORIES, DIFFICULTIES, FALLBACK_QUESTIONS };


export function getCategoryBySlug(slug: string): InterviewCategory | undefined {
  return INTERVIEW_CATEGORIES.find((c) => c.slug === slug);
}

type DbRow = {
  slug: string;
  question: string;
  category: string;
  tags: string[] | null;
  difficulty: Difficulty;
  short_answer: string;
  explanation: string;
  code_language: "dart" | "yaml" | "bash" | null;
  code_example: string | null;
  common_mistakes: string[] | null;
  interview_tips: string[] | null;
  related_slugs: string[] | null;
  related_article_slugs: string[] | null;
  related_tool_slugs: string[] | null;
};

function dbRowToQuestion(r: DbRow): InterviewQuestion {
  return {
    slug: r.slug,
    question: r.question,
    category: r.category,
    tags: r.tags ?? [],
    difficulty: r.difficulty,
    shortAnswer: r.short_answer,
    explanation: r.explanation,
    codeExample: r.code_language && r.code_example ? { language: r.code_language, code: r.code_example } : undefined,
    commonMistakes: r.common_mistakes ?? undefined,
    interviewTips: r.interview_tips ?? undefined,
    relatedSlugs: r.related_slugs ?? undefined,
    relatedArticleSlugs: r.related_article_slugs ?? undefined,
    relatedToolSlugs: r.related_tool_slugs ?? undefined,
  };
}

const DB_COLUMNS =
  "slug,question,category,tags,difficulty,short_answer,explanation,code_language,code_example,common_mistakes,interview_tips,related_slugs,related_article_slugs,related_tool_slugs";

export async function getAllInterviewQuestions(): Promise<InterviewQuestion[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return FALLBACK_QUESTIONS;

  const { data, error } = await supabase
    .from("interview_questions")
    .select(DB_COLUMNS)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) return FALLBACK_QUESTIONS;
  return (data as DbRow[]).map(dbRowToQuestion);
}

export async function getInterviewQuestionBySlug(slug: string): Promise<InterviewQuestion | undefined> {
  const all = await getAllInterviewQuestions();
  return all.find((q) => q.slug === slug);
}

export async function getAllInterviewQuestionSlugs(): Promise<string[]> {
  const all = await getAllInterviewQuestions();
  return all.map((q) => q.slug);
}

export async function getAllTagSlugs(): Promise<string[]> {
  const all = await getAllInterviewQuestions();
  return Array.from(new Set(all.flatMap((q) => q.tags))).sort();
}

export async function getAllFilterKeys(): Promise<string[]> {
  return Array.from(
    new Set([
      ...DIFFICULTIES.map((d) => d.toLowerCase()),
      ...INTERVIEW_CATEGORIES.map((c) => c.slug),
      ...(await getAllTagSlugs()),
    ])
  );
}

export interface FilterResult {
  type: "difficulty" | "category" | "tag";
  label: string;
  questions: InterviewQuestion[];
}

export async function resolveFilter(key: string): Promise<FilterResult | null> {
  const all = await getAllInterviewQuestions();

  const difficulty = DIFFICULTIES.find((d) => d.toLowerCase() === key);
  if (difficulty) {
    return {
      type: "difficulty",
      label: difficulty,
      questions: all.filter((q) => q.difficulty === difficulty),
    };
  }
  const category = getCategoryBySlug(key);
  if (category) {
    return {
      type: "category",
      label: category.name,
      questions: all.filter((q) => q.category === category.name),
    };
  }
  const tagSlugs = Array.from(new Set(all.flatMap((q) => q.tags)));
  if (tagSlugs.includes(key)) {
    return {
      type: "tag",
      label: key,
      questions: all.filter((q) => q.tags.includes(key)),
    };
  }
  return null;
}

export async function resolveRelatedQuestions(slug: string): Promise<InterviewQuestion[]> {
  const all = await getAllInterviewQuestions();
  const q = all.find((x) => x.slug === slug);
  if (!q?.relatedSlugs) return [];
  return q.relatedSlugs
    .map((s) => all.find((x) => x.slug === s))
    .filter((x): x is InterviewQuestion => Boolean(x));
}
