// One-off seed: copies the static FALLBACK_QUESTIONS array into the
// interview_questions table. Run once, after applying
// supabase/migrations/009_interview_questions.sql.
//
//   npx tsx scripts/seed-interview-questions.ts
//
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { FALLBACK_QUESTIONS } from "../src/lib/interview-questions-data";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const rows = FALLBACK_QUESTIONS.map((q) => ({
    slug: q.slug,
    question: q.question,
    category: q.category,
    tags: q.tags,
    difficulty: q.difficulty,
    short_answer: q.shortAnswer,
    explanation: q.explanation,
    code_language: q.codeExample?.language ?? null,
    code_example: q.codeExample?.code ?? null,
    common_mistakes: q.commonMistakes ?? [],
    interview_tips: q.interviewTips ?? [],
    related_slugs: q.relatedSlugs ?? [],
    related_article_slugs: q.relatedArticleSlugs ?? [],
    related_tool_slugs: q.relatedToolSlugs ?? [],
    status: "published",
  }));

  const { data, error } = await supabase.from("interview_questions").upsert(rows, { onConflict: "slug" }).select("slug");

  if (error) {
    console.error("SEED FAILED:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${data?.length ?? 0} interview questions.`);
}

main();
