---
name: tech-article-writing
description: Use whenever writing or drafting an article, news post, review, comparison, guide, or any published content for tech.bidev.dev / BiDev Tech. Governs data sourcing (real, current, verified — never invented) and writing voice (human, not AI-sounding), plus SEO keyword and structure rules.
---

# Tech Article Writing Skill

This skill applies to every piece of content written for BiDev Tech, regardless of Content Type (News, Review, Comparison, Guide, Explainer, Data Story, etc. — see `TAXONOMY.md`).

## 1. Data must be real, current, and verified — never invented

- Before writing any number, price, spec, version, release date, or market-share figure: **search for it**. Do not pull it from memory. Training data goes stale; prices and versions change constantly.
- If a live source can't confirm a figure, either omit it, or clearly frame it as an estimate/approximation with its source ("analysts estimate," "as of the last reported quarter") — never state an unverified number as fact.
- Every statistic gets a real, named source (a company's own announcement, a named research firm, a named publication) — never "studies show" or "reports suggest" with nothing behind it.
- For comparisons and reviews: pull actual current specs/pricing at the time of writing, not recalled specs from an earlier model or an earlier year.
- For fast-moving categories (AI models, phone/laptop lineups, GPU pricing) re-verify even things that feel "obviously known" — the current flagship model changes every few months.
- Never fabricate a quote, a user review, an anecdote, or a statistic to fill space. If real data isn't available, write a shorter, honest piece instead of padding with invented specifics.

## 2. Write like a human, not like an AI

Avoid the tells that make content read as AI-generated. Specifically:

**Never use:**
- Em dashes (—). Use a period, comma, or parentheses instead.
- Stock AI transitions: "moreover," "furthermore," "in today's fast-paced world," "in the ever-evolving landscape of," "it's worth noting that," "when it comes to X."
- The "it's not just X, it's Y" construction, or its close cousins ("this isn't just a phone, it's a statement").
- Triplet padding — three adjectives or three examples in a row purely for rhythm ("fast, reliable, and efficient").
- Meta-commentary about the writing itself ("in this article, we will explore...", "let's dive in," "to summarize," "in conclusion").
- Excessive hedging or a neutral-to-a-fault tone on things that deserve a real opinion. If the product is mediocre, say so.
- Self-grading checklists, disclaimers about being an AI, or explaining word-count targets in the draft itself.

**Do:**
- Vary sentence length on purpose — short, blunt sentences next to longer ones. Uniform medium-length sentences are an AI tell.
- Use contractions (it's, doesn't, won't) — formal AI writing over-avoids them.
- Take a clear, direct position instead of listing "pros and cons" with no verdict. A reader wants to know what *you'd* actually buy or do.
- Reference specific, real details (an actual benchmark number, an actual price, an actual release date) instead of vague superlatives ("blazing fast," "game-changing").
- Where relevant and true, use a real production anecdote or specific first-hand framing rather than a generic hypothetical example.
- Keep paragraphs short. Long, evenly-structured paragraphs read as generated; real editorial writing breaks rhythm.
- Cut anything that doesn't earn its place. No padding to hit a word count.

## 3. SEO — keywords and structure

- **Primary keyword**: identify the one phrase a reader would actually search (e.g. "iPhone 18 vs Galaxy S26," not "smartphone comparison article"). It belongs in the H1/title, the first 100 words, one subheading, and the meta description.
- **Secondary/related keywords**: 3–6 natural variations and related terms (synonyms, "people also ask" phrasing) worked into subheadings and body copy — never stuffed unnaturally.
- **Title**: specific and front-loaded with the keyword, under ~60 characters where possible. Avoid clickbait that the article doesn't deliver on.
- **Meta description**: one or two sentences, under ~155 characters, states the actual answer/value, includes the primary keyword.
- **Headers (H2/H3)**: structured around real sub-questions a reader has (matches search intent), not generic labels like "Overview" or "Conclusion."
- **First paragraph**: answers the core question immediately. Don't bury the lede waiting to "build up" to the point — that's a search-ranking and reader-retention problem, not just style.
- **Internal links**: link to 2–4 related BiDev Tech pieces per `TAXONOMY.md`'s story-cluster model (news → explainer → data → comparison) and to the relevant Category/Section/Entity hub pages.
- **Assign taxonomy fields explicitly** at the top of the draft (see `TAXONOMY.md`): Category, Section, Content Type, Tags (from the maintained list only), Entities.
- Match content depth to intent: a Buying Guide or Comparison needs real spec tables and a clear verdict (high commercial intent, thin content gets penalized); a breaking News post can be short and fast.

## 4. Output format

Follow the project's existing content conventions:
- Deliver in Markdown, or Tiptap-compatible JSON/HTML when that's the target system.
- SEO metadata (title tag, meta description, primary/secondary keywords, Category/Section/Content Type/Tags/Entities) goes in a clearly separated block at the top (HTML comment block for Tiptap HTML output) — never rendered as visible body content.
- No em dashes anywhere in the output, including the metadata block.

## 5. Before publishing, self-check

- Every specific number/spec/date was verified via a live search this session, not recalled from memory.
- No em dashes anywhere.
- No AI transition phrases from the "never use" list.
- Sentence lengths vary; at least one short, punchy sentence per few paragraphs.
- There's an actual opinion/verdict, not just a balanced list.
- Primary keyword appears in title, first paragraph, one subheading, and meta description.
- Category, Section, Content Type, Tags, and Entities are all assigned per `TAXONOMY.md`.