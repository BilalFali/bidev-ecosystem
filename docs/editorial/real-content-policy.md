# BiDev real-content policy

Mandatory for every article written for BiDev.dev from this point on,
including articles I draft as the editorial assistant. This policy does not
retroactively apply itself to already-published articles; see the open
question in `writing-style.md` about what to do with the two articles that
already violate it (`supabase-vs-firebase-flutter` and the local-storage
article's "RecallAI" anecdotes).

## 1. Never fabricate experience

Never invent, imply, or let phrasing suggest:

- Projects Bilal has built, beyond the real ones that already exist in this
  project (the portfolio's shipped apps, BiDev itself, BiKids) and only when
  he's confirmed the specific detail being used.
- Bugs encountered, tests run, benchmarks measured, or production results,
  unless he states them for this article.
- Personal opinions attributed to him that he hasn't actually given.
- Screenshots, code execution, or device testing that didn't happen.
- Having personally used a package or technology, when the claim is really
  "this is what the documentation says" or "this is the common recommendation."

Banned unless the specific claim is confirmed for that article:
"In my experience," "I tested," "In my production app," "I built," "When I
was building X." If a draft needs one of these to make its point and the
backing isn't confirmed, that's a gap, not a styling choice. Ask, or write
the sentence without the personal frame.

## 2. Separate facts, experience, and recommendations

Every substantive claim in a draft falls into exactly one of these, and the
draft should read as though the writer knows which is which, even without
visible labels in the final text:

1. **Verified technical fact** — checked against official docs or the
   source for this session, with a version/date if that matters.
2. **Confirmed personal experience** — Bilal said this happened, specifically,
   for this article.
3. **Reasoned analysis** — a conclusion drawn from (1) and (2), presented as
   reasoning, not asserted as fact.
4. **Recommendation** — what to do, flagged as a recommendation, not a fact.
5. **Unverified or unknown** — named as such, or left out. Never silently
   upgraded to fact because it would make smoother prose.

Version-sensitive claims (an SDK behavior, a package's current state, a
pricing figure, a deprecation) get checked against a live source during that
session, not recalled from training data. If a live source can't confirm it,
the draft says so or omits the figure, the same rule already in force from
the `tech-article-writing` skill.

## 3. Require original value

An article justifies its own existence, beyond restating documentation, by
including at least one of:

- A concrete developer problem, stated specifically enough that the reader
  recognizes it as theirs.
- A working example that actually runs, not a fragment with the hard part
  omitted.
- The reasoning behind a specific implementation decision, not just a
  description of what the code does.
- Trade-offs and limitations, stated plainly, including where the
  recommended approach is worse than an alternative.
- Common mistakes, specific enough to be a real mistake someone makes, not
  a generic "forgetting to handle errors."
- Debugging steps, in the order someone would actually try them.
- Alternatives, with the condition under which each one is the right call.
- A practical conclusion that gives the reader something to decide or do.

Not every article needs all of these. Forcing a "common mistakes" section
into a release-notes piece, for instance, is the padding this policy exists
to prevent.

## 4. No artificial humanization

Do not add typos, deliberately awkward phrasing, invented slang, or random
opinions to fake a human register. That's a different failure mode from
generic AI writing, and it reads as worse, not more authentic. Write
clearly and directly. The goal is a real technical publication, not evading
a detector.

## 5. What this replaces

The two existing articles with fabricated "RecallAI" anecdotes predate this
policy and are not an example of it working. They're flagged in
`writing-style.md` for a decision, not treated as precedent.
