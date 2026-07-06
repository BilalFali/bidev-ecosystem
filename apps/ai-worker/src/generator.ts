import Anthropic from "@anthropic-ai/sdk";
import type { SheetRow, GeneratedArticle } from "./types.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function extractJson(text: string): string {
  // Strip markdown code fences if present
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  // Find first { ... } block
  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);

  throw new Error("No JSON object found in AI response");
}

export async function generateArticle(row: SheetRow): Promise<GeneratedArticle> {
  const titleHint    = row.titleHint ? `\nPreferred title direction: "${row.titleHint}"` : "";
  const categoryHint = row.category  ? `\nCategory: ${row.category}`                    : "";

  const prompt = `You are a senior Flutter developer and technical writer for bidev.dev — a blog for Flutter and mobile developers.

Write a comprehensive, SEO-optimised article on this topic: "${row.keyword}"${titleHint}${categoryHint}

Audience: Flutter/Dart developers, intermediate to advanced level.

CONTENT REQUIREMENTS:
- Minimum 1500 words of substantive content
- Real, working Dart/Flutter code examples with comments
- Logical structure using h2 and h3 headings
- Practical tips, gotchas, and best practices
- Code blocks for every concept that benefits from one

OUTPUT FORMAT:
Return ONLY a single valid JSON object — no prose before or after, no markdown fences.

{
  "title": "Compelling title, 50-60 chars, includes primary keyword",
  "slug": "url-friendly-slug-matching-title",
  "excerpt": "≤155 chars. Hooks the reader and includes the primary keyword.",
  "content": "Complete article as HTML. Use <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <a href=\\"...\\">, and <pre><code class=\\"language-dart\\">...</code></pre> for Dart/Flutter code. No <html>, <head>, or <body> wrappers.",
  "seo_title": "Title tag, ≤60 chars",
  "seo_description": "Meta description, ≤155 chars, includes primary keyword",
  "seo_keywords": ["primary keyword", "secondary keyword", "keyword3", "keyword4", "keyword5"],
  "reading_time": 7,
  "suggested_tags": ["Flutter", "Dart", "tag3"]
}`;

  const message = await client.messages.create({
    model:      "claude-opus-4-8",
    max_tokens: 8192,
    messages:   [{ role: "user", content: prompt }],
  });

  const rawText = message.content[0].type === "text" ? message.content[0].text : "";

  let parsed: GeneratedArticle;
  try {
    parsed = JSON.parse(extractJson(rawText)) as GeneratedArticle;
  } catch {
    throw new Error(`Failed to parse AI JSON response: ${rawText.slice(0, 200)}`);
  }

  // Fallbacks and sanity checks
  if (!parsed.slug)            parsed.slug            = slugify(parsed.title);
  if (!parsed.seo_title)       parsed.seo_title       = parsed.title.slice(0, 60);
  if (!parsed.seo_description) parsed.seo_description = parsed.excerpt.slice(0, 155);
  if (!Array.isArray(parsed.seo_keywords))   parsed.seo_keywords   = [];
  if (!Array.isArray(parsed.suggested_tags)) parsed.suggested_tags = [];

  // Clamp reading time to a sane range
  parsed.reading_time = Math.max(1, Math.min(60, parsed.reading_time ?? 5));

  return parsed;
}
