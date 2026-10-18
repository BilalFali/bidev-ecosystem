# BiDev article workflow

How every new BiDev article gets researched, drafted, and approved from
this point on. Supersedes the informal process used earlier in this
session (research facts, write, self-check for em dashes, publish directly
to the database). The difference here: a planning step before drafting,
an explicit approval gate before publishing, and the real-content-policy
checks built into the process instead of left to a final self-review.

## Before writing: collect this

For every proposed article, write out (doesn't need to be long):

- **Proposed title**
- **Target reader** — who specifically, and why they're searching for this
- **Specific problem being solved** — not "explain X," but the actual
  situation someone is in
- **Search intent** — what they'd type, and what answer satisfies it
- **Primary sources** — official docs, changelogs, source code; checked
  live this session, not recalled
- **Relevant existing BiDev articles** — for internal links and to avoid
  duplicating one already published
- **Bilal's relevant experience, if any** — only what he's actually
  confirmed, named specifically (see the questions step below)
- **Original contribution** — which of the real-content-policy's "original
  value" items this article will actually use
- **Missing information** — anything the draft needs that isn't yet known
- **Claims that need verification** — version numbers, specific behavior,
  pricing, anything that goes stale

## When to ask, and what to ask

Ask 3 to 5 focused questions only when personal context would make the
article materially better or is required by the real-content-policy (for
example, the topic is naturally framed around "here's what I'd do," or an
early draft wants to say "in my experience"). Good questions are specific:

- Have you implemented this approach in a real project? Which one?
- What problem were you actually trying to solve when you hit this?
- What alternative did you consider, and why didn't you use it?
- What went wrong, or surprised you, when you did this?
- What would you do differently now?

Don't ask when the topic is accurately covered by documentation and
technical reasoning alone (a release-notes piece, an API reference
explainer, a "how this protocol works" piece). If Bilal has no relevant
experience to offer, the article ships as a technical tutorial or analysis,
not a fake case study wearing a tutorial's structure.

## Writing the draft

1. Research the topic against live sources.
2. Identify the reader's actual problem (from the collection step above).
3. Outline around solving that problem, not around a generic template.
4. Identify what's still missing, facts or personal context.
5. Ask Bilal the specific questions from the step above, if any are needed.
6. Draft in the documented style — currently thin and unverified, see
   `writing-style.md`; until that's filled in from real samples, default to
   the direct, blunt-sentence register and the rules already enforced by
   the `tech-article-writing` skill (no em dashes, no stock AI transitions,
   real opinion, varied sentence length).
7. Verify every code sample, API name, version number, and factual claim
   against a live source.
8. Run the editorial quality gate below.
9. Check internal links (real BiDev articles, real tool pages) and external
   sources (official docs, not secondary blog posts repeating docs).
10. Present the draft for approval. Do not publish without it.

## Editorial quality gate

Before presenting a draft, check it against every one of these. A "no" on
any of them means the draft isn't ready, not that it ships with a caveat:

- Does it solve the specific problem it set out to solve?
- Is every technical claim accurate, or explicitly qualified as
  unverified/estimated?
- Is any personal experience in it fabricated, or stated more confidently
  than Bilal actually confirmed?
- Is the code correct, current, and actually relevant to the point being
  made (not a generic unrelated snippet)?
- Does it add something beyond a documentation summary (see
  real-content-policy's "original value" list)?
- Does it explain trade-offs, rather than pushing one option as simply
  correct?
- Does it sound consistent with the writing-style file, once that file has
  real content to check against?
- Is there a paragraph, section, or sentence that could be deleted without
  losing anything? Delete it.
- Where a claim needs outside verification (a figure, a changelog item, a
  behavior claim), is the source there?
- Would this article deserve to exist if its target keyword didn't, or
  does it only exist to rank?

If a draft fails because facts or experience are missing, say exactly what's
missing. Don't fill the gap with an invented detail to make the gate pass.

## Publishing

Nothing gets published, and no production content or database record gets
changed, without Bilal's explicit go-ahead on that specific draft. This
matches how articles have actually been handled so far in this project
(every batch published this session was shown and confirmed first); this
workflow makes that gate explicit instead of implicit.
