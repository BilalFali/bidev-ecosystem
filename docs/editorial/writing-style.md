# BiDev writing style

Confirmed directly by the owner (2026-10-11), not inferred from the existing
article corpus. The earlier draft of this file explained why the existing
corpus (`supabase-vs-firebase-flutter`, the local-storage article, and the
two oldest MDX articles) couldn't be trusted as a style baseline: they
contain a fabricated personal project ("RecallAI") and generic AI patterns.
That finding stands. This file now states the real rules directly, in his
own words, translated into the working language of the articles (English).

## 1. Tone and voice

Write like a Flutter developer with real practical experience, explaining
a technical topic to another developer, clearly and directly.

- Clear, practical, no unnecessary complexity.
- Friendly and professional, never stiff or overly formal.
- Focused on solving real problems, not reciting theoretical definitions.
- Direct about a solution's actual strengths and weaknesses.
- Confident when the information is solid, explicit about uncertainty when
  it isn't.

Use first person only for real experience and real opinions. Never invent
a personal experience or imply a technology was personally used when it
wasn't. No marketing language, no describing every technology as amazing,
revolutionary, or the best.

## 2. Openings

Start with the actual problem the developer is facing, the question they
want answered, or the technical decision they need to make.

By the end of the opening, the reader should know: what problem this
article addresses, why it matters to them, and what they get out of
reading it. Skip generic preambles and long throat-clearing definitions the
reader doesn't need to follow the rest of the piece.

Never open with: "in today's fast-evolving tech world," "in this
comprehensive guide," "let's dive into," "building apps has never been more
important." Get into the subject immediately, with only the context that's
actually necessary.

## 3. Explaining technical concepts and code

Explain *why* a solution is used, not just the steps to implement it.

For Flutter and Dart articles, prefer:

- Practical, realistic examples.
- Clean, well-organized, understandable code.
- An explanation of the important technical decisions.
- Common mistakes and how to avoid them.
- Comparing alternatives when the comparison is actually useful.
- The limits of the approach and when it's not the right fit.

Never include code purely to make the article look technical. Every example
needs a clear purpose, and the APIs and versions used need to be correct.
Don't just show code; point out what matters in it, why that approach was
chosen, and what a developer should watch for when applying it to a real
project.

Use common English technical terms as-is; don't force an awkward
translation on terms developers already know in their original form (this
applies to the Arabic-language conversation around this project; the
articles themselves are in English).

## 4. Length and structure

No fixed length. The topic decides how much explanation it needs. A
complete article that delivers real value beats a longer one padded to hit
a word count.

Use clear headings describing each section's actual content, relatively
short paragraphs, lists when they genuinely help, code examples when
needed, comparison tables when they help a reader decide, and internal
links to related articles only when they add something.

Structure follows the article's type, not one fixed template:

- **Tutorial** — practical steps to build or implement something.
- **Troubleshooting** — the problem, likely causes, diagnostic steps,
  fixes.
- **Comparison** — a fair comparison of options, real strengths and
  weaknesses, and when each one fits.
- **Architecture** — the architectural decisions, alternatives, costs, and
  constraints.
- **Technical explainer** — simplify the concept and explain how it works,
  with the examples that actually fit.

Don't force one template onto every article, and don't add sections purely
for SEO.

## 5. What makes an article original instead of AI-generated filler

Every article needs a real reason to exist. It should never just rephrase
official docs or re-aggregate what's already published elsewhere. Focus on:

- Practical app-development knowledge.
- Technical analysis that helps a developer make a better decision.
- Useful, working implementation examples.
- The trade-offs between solutions.
- Real mistakes and how to diagnose them, only when there's confirmed
  information behind them.
- Personal opinions, only when they're actually his.
- Where a solution does and doesn't fit.

**Non-negotiable rules:**

1. Never invent personal experiences, projects, bugs, test results, or
   performance measurements.
2. Never attribute an opinion to him that he hasn't actually given.
3. If a personal experience would genuinely strengthen the article, ask
   specific questions before writing that part, rather than inventing it.
4. With no personal experience available, write a useful technical article
   from reliable sources and clear analysis, without claiming he
   personally tried the solution.
5. Verify anything version-sensitive (Flutter, Dart, packages, APIs)
   against a live source.
6. Keep documented fact, analysis, and recommendation distinct.
7. Never add deliberate typos or invented anecdotes to fake a human voice.
8. No generic filler phrases, repeated boilerplate conclusions, or
   artificial keyword stuffing.
9. Don't repeat the same information across the intro, body, and
   conclusion.
10. Never let SEO outrank the reader's actual benefit from the article.

The goal: BiDev as a technical publication that gives developers real
knowledge, not a site publishing similar-sounding articles just to grow a
page count or chase traffic and ad revenue. A reader should feel the
article was written to help them understand a problem or make a decision,
and that it was worth their time, whether they arrived from Google or a
direct link.

## Resolved

- **The two already-published articles with the fabricated "RecallAI"
  anecdote** (`supabase-vs-firebase-flutter` and the local-storage article):
  decided 2026-10-11, leave them as published. They predate this policy and
  are not touched by it retroactively. They are still not a style or
  content reference for any future article.

## Still open

- **Real experience to draw on**: whether there's a specific bug,
  architecture decision, or trade-off from one of the real shipped apps
  (Afnek, Privateloc, the RiseCart family, Ta7ssil, Turtle, Wegofleet) worth
  referencing in a future article. Not required up front; per rule 3 above,
  this gets asked for per-article, only when it would genuinely strengthen
  that specific piece.
