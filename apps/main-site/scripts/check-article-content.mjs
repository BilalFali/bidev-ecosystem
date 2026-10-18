// Guard against the failure modes docs/editorial/real-content-policy.md and
// Phase 5 of the editorial brief call out, before a draft gets published.
// Usage from a publish script:
//   import { checkArticleContent } from "./check-article-content.mjs";
//   const problems = checkArticleContent(article.content);
//   if (problems.length) { console.error(problems.join("\n")); process.exit(1); }

const UNCONFIRMED_EXPERIENCE_CLAIMS = [
  /\bin my experience\b/i,
  /\bi tested\b/i,
  /\bin my production app\b/i,
  /\bwhen i (was )?built\b/i,
  /\bi built\b/i,
  /\bi almost built\b/i,
];

const GENERIC_AI_OPENINGS = [
  /in today'?s (rapidly evolving|fast-evolving)/i,
  /in this comprehensive guide/i,
  /let'?s dive into/i,
  /flutter is a powerful and versatile framework/i,
  /whether you'?re a beginner or an experienced developer/i,
  /in conclusion, it is important to note/i,
  /has never been more important/i,
];

const UNSOURCED_SUPERLATIVES = [
  /\b\d+(-|\s*to\s*)\d+x\b.{0,20}(productivity|faster|gap)/i,
];

const EM_DASH = /—/;

/**
 * Returns a list of human-readable problems found in HTML/plain article
 * content. An empty array means the content passed every check here —
 * it does NOT mean the article satisfies the full editorial quality gate
 * in docs/editorial/article-workflow.md, which also needs a human read.
 */
export function checkArticleContent(content) {
  const problems = [];
  const text = content.replace(/<[^>]*>/g, " ");

  for (const re of UNCONFIRMED_EXPERIENCE_CLAIMS) {
    if (re.test(text)) {
      problems.push(
        `Found a first-person experience claim matching ${re}. Per real-content-policy.md, ` +
        `this is only allowed when the owner has confirmed this specific experience for this article.`,
      );
    }
  }

  for (const re of GENERIC_AI_OPENINGS) {
    if (re.test(text)) {
      problems.push(`Found a banned generic opening/closing phrase matching ${re}.`);
    }
  }

  for (const re of UNSOURCED_SUPERLATIVES) {
    if (re.test(text)) {
      problems.push(`Found an unsourced productivity/speed superlative matching ${re}. Needs a named source or removal.`);
    }
  }

  if (EM_DASH.test(text)) {
    problems.push("Found an em dash (—). Use a period, comma, or parentheses instead.");
  }

  return problems;
}
