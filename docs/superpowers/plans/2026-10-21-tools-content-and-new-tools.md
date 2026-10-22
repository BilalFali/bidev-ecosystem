# bidev.dev/tools: Rich Content + 5 New Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix AdSense's "Low value content" rejection by giving every tool page on bidev.dev/tools substantive written content (400-600 words: why/how/example/FAQ/related), and extend the site's Flutter/Dart differentiation with 5 new client-side tools.

**Architecture:** `apps/main-site` is a Next.js 15 App Router site. Each tool already follows a fixed page template (`metadata` → `ToolPageSeo` → tool widget → `RelatedTools` → `ToolContent`), with a shared content data file (`src/lib/tool-content.ts`) rendered by `src/components/tools/ToolContent.tsx`, and a shared tool registry (`src/lib/tools.ts`) driving the `/tools` index and the sitemap. We extend the content data model to support ordered lists, code blocks, and FAQ entries (currently only plain paragraphs), then populate it for all 15 tools. For the 5 new tools, unlike the existing 10 (which keep logic inline in the `"use client"` component), we extract the pure parsing/generation logic into standalone files under `src/lib/` so it can be unit-tested with the project's existing `node:test` convention (see `apps/main-site/tests/*.test.mjs`), and import that logic into a thin UI component matching the existing visual/interaction pattern (see `src/components/tools/JsonToDart.tsx` as the reference template).

**Tech Stack:** Next.js 15 (App Router) / React 19 / TypeScript, Tailwind CSS with the project's custom token classes (`bg-bg-card`, `text-ink`, `text-accent`, etc.), `lucide-react` icons, Node's built-in `node:test` + `assert/strict` for logic tests (run via `node --experimental-strip-types --test tests/<name>.test.mjs` from `apps/main-site/`), `yaml` (new dependency, added in Task 6) for pubspec parsing.

**Spec:** user-provided spec pasted into this conversation on 2026-10-21 (not saved as a separate file — reproduced in full in the conversation history); this plan implements it in full, with the scoping decisions below.

## Global Constraints

- All new/changed tool logic runs 100% client-side — no `fetch`, no server actions, nothing leaves the browser. Every new component is a `"use client"` component exactly like the existing 10.
- Reuse the existing page template exactly: `pageMetadata()` for SEO meta, `<ToolPageSeo>` for JSON-LD + analytics, `<RelatedTools>` for cross-links, `<ToolContent slug="...">` for written content. Do not invent a new layout shape.
- Match the existing dark-theme Tailwind token classes used by `ToolCard.tsx` / `JsonToDart.tsx` (`bg-bg-card`, `border-border`, `text-ink`, `text-ink-muted`, `text-ink-faint`, `text-accent`) — never introduce default Tailwind colors (`text-gray-500`, etc.).
- Content voice matches the existing `tool-content.ts` entries: practical, specific, no generic AI-tutorial tone, no fabricated personal anecdotes (the editorial no-fabrication rule in `apps/main-site/CLAUDE.md` applies in spirit even though it's scoped to blog articles).
- Target 400-600 words of real written content per tool page (all written content combined: why-use-it prose + FAQ answers + step list text; code block contents don't count toward the word target).
- "Related tools" links are tool→tool only, via the existing `TOOLS[].related` array and `resolveRelatedTools()` — the agent researching this found no clearly-relevant existing blog article to link to from these specific tools' topics (most blog content lives in Supabase and wasn't queryable), so inventing article links is out of scope. State this explicitly in the final summary to the user as a scoping decision, not an oversight.
- "ARB Localization Validator" gets a visible "new" badge on its `ToolCard`, distinct from the existing `popular` pill.
- The sitemap (`src/app/sitemap.ts`) already generates tool URLs dynamically from `TOOLS` — no sitemap code change is needed; adding entries to `TOOLS` is sufficient. State in the final summary that a rebuild/redeploy is the only manual step needed to pick up the new routes live.

## Review Focus

- **ARB plural/select placeholders**: a message like `"{count, plural, one{...} other{...}}"` must have its placeholder name (`count`) extracted correctly, not just flat `{name}` style placeholders — otherwise every pluralized string falsely reports as a placeholder mismatch. Covered in Task 4's tests.
- **pubspec version constraint edge cases**: `any`, git/path dependency maps (`{git: {...}}`, `{path: ...}`), and hosted-with-version maps are all valid non-string dependency values in real pubspec.yaml files — flagging them as "malformed version constraint" would be a false positive that erodes trust in the tool. Covered in Task 5's tests.
- **API diff key-order and type-change handling**: reordering keys in an object must NOT produce a diff (common false positive for naive diff implementations), but a value changing type (e.g. `"1"` string vs `1` number) must be reported as changed, not silently treated as equal via loose comparison. Covered in Task 6's tests.
- **JSON→TS inference on sparse/mixed samples**: a field that's `null` in the sample must become optional+nullable in the output rather than crashing or silently defaulting to `any` with no explanation; an array with mixed primitive types must degrade to a union or `unknown[]` rather than picking only the first element's type silently. Covered in Task 3's tests.
- **Dart enum identifier sanitization collisions**: two distinct input values that sanitize to the same Dart identifier (e.g. `"2nd Place"` and `"2nd-place"` both naively becoming `secondPlace`) must not silently produce a duplicate enum member — the generator must disambiguate them. Covered in Task 7's tests.

---

## Task 1: Extend the tool-content data model for lists, code blocks, and FAQs

**Files:**
- Modify: `apps/main-site/src/lib/tool-content.ts`
- Modify: `apps/main-site/src/components/tools/ToolContent.tsx`

**Interfaces:**
- Produces: `ToolContentBlock` union type and the new `ToolContentSection.blocks: ToolContentBlock[]` shape, which every later content task (Tasks 2, 3's content, and Tasks 4-8's content) writes against. Specifically:
```ts
export type ToolContentBlock =
  | { kind: "p"; text: string }
  | { kind: "steps"; items: string[] }
  | { kind: "code"; lang: string; label?: string; code: string }
  | { kind: "faq"; items: { q: string; a: string }[] };

export interface ToolContentSection {
  heading: string;
  blocks: ToolContentBlock[];
}

export interface ToolContent {
  sections: ToolContentSection[];
}
```
  This replaces the current `body: string[]` field entirely — there is no backward-compatible shim, since every existing `TOOL_CONTENT` entry gets rewritten in Task 2 anyway.

- [ ] **Step 1: Update the types and migrate the existing 10 entries' shape in `tool-content.ts`**

Replace `ToolContentSection { heading; body: string[] }` with the `blocks`-based shape above. For this step, mechanically convert every existing entry's `body: [...]` paragraphs into `blocks: [{ kind: "p", text: ... }, ...]` with no content changes yet (content enrichment happens in Task 2) — this step is purely a type/shape migration so the build stays green before content work starts.

- [ ] **Step 2: Update `ToolContent.tsx` to render all four block kinds**

Signature stays `ToolContent({ slug }: { slug: string })`. For each `section.blocks`, render: `p` as `<p className="text-ink-muted leading-relaxed mb-3 last:mb-0">`; `steps` as an `<ol className="list-decimal list-inside space-y-1.5 text-ink-muted">` of `<li>`; `code` as `<pre className="p-4 rounded-xl border border-border bg-bg-card text-sm font-mono text-ink overflow-auto"><code>{block.code}</code></pre>` (optionally prefixed by `block.label` as a small caption, no syntax highlighting — out of scope); `faq` as a list of `<h3 className="text-base font-semibold text-ink mt-4 mb-1.5">{item.q}</h3><p className="text-ink-muted leading-relaxed mb-3">{item.a}</p>`.

- [ ] **Step 3: Verify the build**

Run: `cd apps/main-site && npx tsc --noEmit`
Expected: no type errors referencing `tool-content.ts` or `ToolContent.tsx`.

- [ ] **Step 4: Commit**

```bash
git add apps/main-site/src/lib/tool-content.ts apps/main-site/src/components/tools/ToolContent.tsx
git commit -m "feat(main-site): support lists, code blocks, and FAQs in tool page content"
```

---

## Task 2: Enrich content for the first 5 existing tools (json-to-dart, qr-generator, json-formatter, password-generator, base64)

**Files:**
- Modify: `apps/main-site/src/lib/tool-content.ts`

**Interfaces:**
- Consumes: `ToolContentBlock`/`ToolContentSection` from Task 1.

- [ ] **Step 1: Rewrite the `"json-to-dart"` entry**

Keep its existing accurate technical claims (type inference from a single sample, Freezed/json_serializable output, the dynamic-fallback-on-null limitation) but restructure into: a "Why use this tool" section (2-3 `p` blocks, real scenario: pasting an API response vs. hand-writing a model and mistyping a nullable field), a "How it works" section (one `steps` block, 3-5 items matching the widget's actual options — paste JSON, pick class name/suffix, pick annotation style, Convert, copy), a "Example" section (one `code` block showing a small JSON input and the resulting generated class — pull the shape from `JsonToDart.tsx`'s `EXAMPLE_JSON`/`generate()` so the example is accurate), and a "FAQ" section (one `faq` block, 3-4 Q&As covering: does data leave the browser (no), what happens with a null field in the sample (falls back to `dynamic`), Freezed vs json_serializable vs plain Dart — which to pick, does it handle nested arrays of objects). Target 450-600 words across all text content.

- [ ] **Step 2: Rewrite the `"qr-generator"` entry**

Same structure (Why / How it works / Example / FAQ). "Example" section can be a `code` block showing the `mailto:`/`tel:` scheme strings rather than generated code, since this tool has no code output. FAQ covers: does my text get sent anywhere to generate the code (no, client-side via the `qrcode` package), what's the max input length before scannability suffers, can I generate a WiFi QR code (yes, via the standard `WIFI:` scheme — only if accurate to what the widget supports; otherwise answer honestly that it's not built in).

- [ ] **Step 3: Rewrite the `"json-formatter"` entry**

Same structure. Example section shows a minified JSON string before, pretty-printed after. FAQ covers: does it validate against a schema (no, only syntax), how does it report error location, minify vs format — when to use which, is there a size limit.

- [ ] **Step 4: Rewrite the `"password-generator"` entry**

Same structure, keeping the accurate `crypto.getRandomValues()` vs `Math.random()` distinction already in the current entry. FAQ covers: is this actually cryptographically secure (yes, explain why), are generated passwords stored or logged anywhere (no), why does a longer simple password sometimes outscore a shorter complex one, what's the maximum length supported.

- [ ] **Step 5: Rewrite the `"base64"` entry**

Same structure, keeping the accurate "encoding is not encryption" point. FAQ covers: is Base64 secure/encrypted (no — reiterate clearly), why does the output have `=` padding at the end sometimes, does this handle non-ASCII/Unicode text correctly, where does Base64 show up in JWTs specifically (links the concept to the JWT decoder tool).

- [ ] **Step 6: Verify word counts**

Run (from `apps/main-site`): `node -e "const {TOOL_CONTENT}=require('./src/lib/tool-content.ts'); for (const slug of ['json-to-dart','qr-generator','json-formatter','password-generator','base64']) { const c=TOOL_CONTENT[slug]; const words=c.sections.flatMap(s=>s.blocks).flatMap(b=>b.kind==='p'?[b.text]:b.kind==='steps'?b.items:b.kind==='faq'?b.items.flatMap(i=>[i.q,i.a]):[]).join(' ').split(/\s+/).length; console.log(slug, words); }"`

(If `require` can't load the `.ts` file directly in this Node version, write a tiny equivalent check as a scratch `.mjs` script using `node --experimental-strip-types` instead — the point is only to print a word count per slug.)

Expected: each slug logs a count; note in the final task's summary any slug under 400.

- [ ] **Step 7: Commit**

```bash
git add apps/main-site/src/lib/tool-content.ts
git commit -m "content(main-site): enrich json-to-dart, qr-generator, json-formatter, password-generator, base64 tool pages"
```

---

## Task 3: Enrich content for the remaining 5 existing tools (uuid-generator, jwt-decoder, regex-tester, color-generator, dart-data-class-generator)

**Files:**
- Modify: `apps/main-site/src/lib/tool-content.ts`

**Interfaces:**
- Consumes: same as Task 2.

- [ ] **Step 1: Rewrite the `"uuid-generator"` entry** (Why / How it works / Example / FAQ, 400-600 words). FAQ covers: are v4 UUIDs guaranteed unique (no, astronomically unlikely collision, explain the math briefly), why not just use an auto-increment integer, is this safe to use for session tokens (answer honestly: UUIDs aren't secret-strength random for session-token purposes the way a signed token is — don't overclaim).

- [ ] **Step 2: Rewrite the `"jwt-decoder"` entry**, keeping the existing accurate "decode only, no verification" framing front and center, including as its own FAQ answer. FAQ covers: does this verify the signature (no — restate plainly), can someone steal my token by pasting it here (no, nothing leaves the browser, but still don't paste production secrets into any third-party tool as a general habit), why does `exp` look like a weird number (Unix timestamp explanation), what's the difference between the header and payload.

- [ ] **Step 3: Rewrite the `"regex-tester"` entry**. FAQ covers: does Dart's `RegExp` support everything tested here (mostly yes, core JS-compatible syntax — note any known gaps if accurate, otherwise say "generally carries over directly"), why do capture groups show as separate from the full match, what do the flags actually change, is there a way to test multiline input.

- [ ] **Step 4: Rewrite the `"color-generator"` entry**. FAQ covers: what is Material 3 seed-color theming, does the preview exactly match `ColorScheme.fromSeed()` at runtime, can I pick a light/dark variant, how do I use the copied snippet in `ThemeData`.

- [ ] **Step 5: Rewrite the `"dart-data-class-generator"` entry**, keeping the existing accurate "no fromJson/toJson, pair with JSON to Dart" distinction. FAQ covers: why no serialization methods (by design — explain the division of labor with the JSON to Dart tool), how does equality work across nested lists, does `copyWith` let me set a field back to null, when should I use this instead of Freezed.

- [ ] **Step 6: Verify word counts** (same approach as Task 2 Step 6, for these 5 slugs).

- [ ] **Step 7: Commit**

```bash
git add apps/main-site/src/lib/tool-content.ts
git commit -m "content(main-site): enrich uuid-generator, jwt-decoder, regex-tester, color-generator, dart-data-class-generator tool pages"
```

---

## Task 4: JSON to TypeScript tool

**Files:**
- Create: `apps/main-site/src/lib/json-to-typescript.ts`
- Create: `apps/main-site/src/components/tools/JsonToTypeScript.tsx`
- Create: `apps/main-site/src/app/tools/json-to-typescript/page.tsx`
- Modify: `apps/main-site/src/lib/tools.ts` (add registry entry)
- Modify: `apps/main-site/src/lib/tool-content.ts` (add `"json-to-typescript"` entry)
- Test: `apps/main-site/tests/json-to-typescript.test.mjs`

**Interfaces:**
- Produces:
```ts
export interface JsonToTsOptions {
  rootName: string;
  useType: boolean; // true => `type X = {...}`, false => `interface X {...}`
}
export function generateTypeScript(jsonStr: string, opts: JsonToTsOptions): string
```
  Throws `Error` with a human-readable message on invalid JSON or a non-object root, matching the existing `generate()` pattern in `JsonToDart.tsx`.
- Consumes: `Tool` interface and `TOOLS` array from `src/lib/tools.ts` (Task 8 will add the `isNew` field, but this task's own `TOOLS` entry just omits it / uses `popular: false`); `pageMetadata` from `src/lib/seo.ts`; `ToolPageSeo`, `RelatedTools`, `ToolContent` components as used by every other tool page (see `src/app/tools/json-to-dart/page.tsx` for the exact composition).

- [ ] **Step 1: Write failing tests for `generateTypeScript`**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { generateTypeScript } from "../src/lib/json-to-typescript.ts";

test("generates an interface with required fields", () => {
  const out = generateTypeScript('{"id": 1, "name": "x"}', { rootName: "User", useType: false });
  assert.match(out, /interface User \{/);
  assert.match(out, /id: number;/);
  assert.match(out, /name: string;/);
});

test("marks null-valued fields optional and nullable", () => {
  const out = generateTypeScript('{"middleName": null}', { rootName: "User", useType: false });
  assert.match(out, /middleName\?: .*null/);
});

test("empty array becomes unknown[]", () => {
  const out = generateTypeScript('{"tags": []}', { rootName: "User", useType: false });
  assert.match(out, /tags: unknown\[\];/);
});

test("uses `type` instead of `interface` when useType is true", () => {
  const out = generateTypeScript('{"id": 1}', { rootName: "User", useType: true });
  assert.match(out, /type User = \{/);
});

test("throws on invalid JSON", () => {
  assert.throws(() => generateTypeScript("{not json", { rootName: "User", useType: false }));
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `cd apps/main-site && node --experimental-strip-types --test tests/json-to-typescript.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `generateTypeScript` in `json-to-typescript.ts`**

Follow the same recursive-inference shape as `inferType`/`buildClass` in `JsonToDart.tsx`: parse JSON, walk the object graph building one named type per nested object (PascalCase from the key), emit `number`/`string`/`boolean` for primitives, `X[]` for arrays of a uniform inferred type, `unknown[]` for empty or mixed-type arrays, and `T | null` with the field marked `?` when the sample value is `null`. Emit leaf types before the root type, same ordering approach as `generate()` in `JsonToDart.tsx`.

- [ ] **Step 4: Run tests, verify they pass**

Run: `cd apps/main-site && node --experimental-strip-types --test tests/json-to-typescript.test.mjs`
Expected: PASS, all 5 tests.

- [ ] **Step 5: Build the `JsonToTypeScript` component**

`"use client"` component modeled directly on `JsonToDart.tsx`'s structure (breadcrumb, header, options bar with a root-name input and an interface/type toggle, split input/output editor, copy-to-clipboard, a "Load example" JSON sample, 3 info cards). No Dart-specific syntax highlighting needed — reuse a plain `<pre>` or a minimal TS-flavored token highlighter if trivial, otherwise plain monospace output is acceptable (do not over-engineer this).

- [ ] **Step 6: Wire up the page and registry**

In `tools.ts`, add:
```ts
{
  slug: "json-to-typescript",
  href: "/tools/json-to-typescript",
  icon: /* pick an unused lucide-react icon, e.g. FileCode2 */,
  title: "JSON to TypeScript Converter",
  description: "Convert JSON to TypeScript interfaces or type aliases, with optional-field detection from null values.",
  tags: ["TypeScript", "Generator"],
  popular: false,
  related: ["json-formatter", "json-to-dart"],
}
```
Create `src/app/tools/json-to-typescript/page.tsx` following the exact composition of `src/app/tools/json-to-dart/page.tsx` (metadata via `pageMetadata({ title, description, path: "/tools/json-to-typescript" })`, `ToolPageSeo`, `JsonToTypeScript`, `RelatedTools`, `ToolContent slug="json-to-typescript"`).

- [ ] **Step 7: Add the `tool-content.ts` entry for `"json-to-typescript"`**

Same Why/How/Example/FAQ structure as Task 2, 400-600 words. FAQ covers: does this handle `readonly` fields (no, out of scope — say so), `interface` vs `type` — when the tool recommends which, how optional/nullable fields are distinguished, does it dedupe identical nested shapes into one type (be honest about the actual behavior per Step 3's implementation).

- [ ] **Step 8: Manual verification**

Run: `cd apps/main-site && npx tsc --noEmit && npm run dev` then open `/tools/json-to-typescript` in a browser, paste a nested JSON sample, confirm output and copy button work, confirm the page's written content renders below the widget.

- [ ] **Step 9: Commit**

```bash
git add apps/main-site/src/lib/json-to-typescript.ts apps/main-site/src/components/tools/JsonToTypeScript.tsx apps/main-site/src/app/tools/json-to-typescript apps/main-site/src/lib/tools.ts apps/main-site/src/lib/tool-content.ts apps/main-site/tests/json-to-typescript.test.mjs
git commit -m "feat(main-site): add JSON to TypeScript converter tool"
```

---

## Task 5: ARB Localization Validator (the key differentiator tool)

**Files:**
- Create: `apps/main-site/src/lib/arb-validator.ts`
- Create: `apps/main-site/src/components/tools/ArbValidator.tsx`
- Create: `apps/main-site/src/app/tools/arb-validator/page.tsx`
- Modify: `apps/main-site/src/lib/tools.ts`
- Modify: `apps/main-site/src/lib/tool-content.ts`
- Test: `apps/main-site/tests/arb-validator.test.mjs`

**Interfaces:**
- Produces:
```ts
export interface ArbFile { locale: string; content: string; }
export interface ArbIssue {
  locale: string;
  key: string;
  type: "missing-key" | "extra-key" | "placeholder-mismatch";
  detail: string;
}
export function validateArbFiles(base: ArbFile, others: ArbFile[]): ArbIssue[]
```
  `base` is the locale treated as the source of truth. Throws on invalid JSON in any file, with the offending `locale` named in the error message.
- Consumes: same page-template pieces as Task 4.

- [ ] **Step 1: Write failing tests covering the Review Focus plural/select case**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateArbFiles } from "../src/lib/arb-validator.ts";

const base = { locale: "en", content: JSON.stringify({
  "@@locale": "en",
  greeting: "Hello {name}",
  itemCount: "{count, plural, one{1 item} other{{count} items}}",
}) };

test("flags a key missing from a locale", () => {
  const fr = { locale: "fr", content: JSON.stringify({ "@@locale": "fr" }) };
  const issues = validateArbFiles(base, [fr]);
  assert.ok(issues.some((i) => i.locale === "fr" && i.key === "greeting" && i.type === "missing-key"));
});

test("flags a key present only in a translated locale", () => {
  const fr = { locale: "fr", content: JSON.stringify({ "@@locale": "fr", greeting: "Bonjour {name}", itemCount: "x", extra: "y" }) };
  const issues = validateArbFiles(base, [fr]);
  assert.ok(issues.some((i) => i.locale === "fr" && i.key === "extra" && i.type === "extra-key"));
});

test("flags a placeholder name mismatch", () => {
  const fr = { locale: "fr", content: JSON.stringify({ "@@locale": "fr", greeting: "Bonjour {prenom}", itemCount: "{count, plural, one{1} other{{count}}}" }) };
  const issues = validateArbFiles(base, [fr]);
  assert.ok(issues.some((i) => i.locale === "fr" && i.key === "greeting" && i.type === "placeholder-mismatch"));
});

test("extracts the plural/select variable name correctly and does not false-flag it", () => {
  const fr = { locale: "fr", content: JSON.stringify({ "@@locale": "fr", greeting: "Bonjour {name}", itemCount: "{count, plural, one{un} other{{count} articles}}" }) };
  const issues = validateArbFiles(base, [fr]);
  assert.ok(!issues.some((i) => i.key === "itemCount"));
});

test("identical files produce no issues", () => {
  const fr = { locale: "fr", content: base.content.replace('"en"', '"fr"') };
  assert.deepEqual(validateArbFiles(base, [fr]), []);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `cd apps/main-site && node --experimental-strip-types --test tests/arb-validator.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `validateArbFiles` in `arb-validator.ts`**

Parse each file as JSON (`JSON.parse`). Message keys are every top-level key not starting with `@` (metadata keys like `@greeting` or `@@locale` are skipped for presence/extra checks). For each message key in `base`, check it exists in each `other`; for each message key in each `other` not in `base`, flag `extra-key`. For placeholder comparison on keys present in both: extract placeholder/variable names from the message string with a function that matches both plain `{name}` tokens and the leading identifier inside ICU `{identifier, plural, ...}` / `{identifier, select, ...}` constructs (the identifier immediately after `{` and before the first `,` or `}`), dedupe, and compare the resulting name sets between base and other — a mismatched set is `placeholder-mismatch` with `detail` listing which names are missing/extra.

- [ ] **Step 4: Run tests, verify they pass**

Run: `cd apps/main-site && node --experimental-strip-types --test tests/arb-validator.test.mjs`
Expected: PASS, all 5 tests.

- [ ] **Step 5: Build the `ArbValidator` component**

`"use client"` component with: a base-locale textarea/file-upload, a dynamic list of "other locale" textareas/uploads (add/remove row, each with its own locale-code input), a "Validate" action, and a results list grouped by locale showing each `ArbIssue` with an icon by `type` (missing/extra/mismatch) and `detail` text. Support both paste and file upload (use `<input type="file" accept=".arb,.json" multiple>` reading via `FileReader`, consistent with "upload or paste" in the spec). Follow the visual conventions of `JsonToDart.tsx` (breadcrumb, header, card-bordered panels, `text-ink`/`text-accent` tokens).

- [ ] **Step 6: Wire up the page and registry**

Add to `tools.ts`:
```ts
{
  slug: "arb-validator",
  href: "/tools/arb-validator",
  icon: /* e.g. Languages */,
  title: "ARB Localization Validator",
  description: "Compare .arb localization files against a base locale — find missing keys, extra keys, and mismatched ICU placeholders.",
  tags: ["Flutter", "i18n"],
  popular: false,
  related: ["json-to-dart", "pubspec-validator"],
}
```
(The `related` entry to `pubspec-validator` is forward-looking to Task 6 — fine since `resolveRelatedTools` just filters missing slugs out until that task lands; it resolves correctly once Task 6 is merged.)
Create `src/app/tools/arb-validator/page.tsx` following the standard composition.

- [ ] **Step 7: Add the `tool-content.ts` entry for `"arb-validator"`**

Give this one the fullest treatment per the spec ("give it extra care") — still 400-600 words but make sure the "Why use this tool" section names a concrete real scenario (a translator adds a new string to `app_fr.arb` but forgets the English source, or renames a placeholder in one locale without updating others, and the app crashes or shows a raw placeholder token in production). FAQ covers: does this replace Flutter's build-time ARB validation (no — explain it catches cross-locale drift that `flutter gen-l10n` doesn't surface as clearly), does it support ICU plural/select syntax (yes — state plainly, this is the differentiator), does my translation data leave the browser (no), can I validate more than two locales at once (yes, describe the multi-file UI).

- [ ] **Step 8: Manual verification**

Run: `cd apps/main-site && npx tsc --noEmit && npm run dev`, open `/tools/arb-validator`, paste a base `app_en.arb` and a deliberately-broken `app_fr.arb` (missing key + mismatched placeholder), confirm both issue types surface correctly.

- [ ] **Step 9: Commit**

```bash
git add apps/main-site/src/lib/arb-validator.ts apps/main-site/src/components/tools/ArbValidator.tsx apps/main-site/src/app/tools/arb-validator apps/main-site/src/lib/tools.ts apps/main-site/src/lib/tool-content.ts apps/main-site/tests/arb-validator.test.mjs
git commit -m "feat(main-site): add ARB localization validator tool"
```

---

## Task 6: pubspec.yaml Validator

**Files:**
- Create: `apps/main-site/src/lib/pubspec-validator.ts`
- Create: `apps/main-site/src/components/tools/PubspecValidator.tsx`
- Create: `apps/main-site/src/app/tools/pubspec-validator/page.tsx`
- Modify: `apps/main-site/src/lib/tools.ts`
- Modify: `apps/main-site/src/lib/tool-content.ts`
- Modify: `apps/main-site/package.json` (add `yaml` dependency)
- Test: `apps/main-site/tests/pubspec-validator.test.mjs`

**Interfaces:**
- Produces:
```ts
export interface PubspecIssue { severity: "error" | "warning"; message: string; }
export function validatePubspec(yamlStr: string): PubspecIssue[]
```
  Never throws for malformed YAML — a YAML parse failure is itself reported as one `error`-severity `PubspecIssue`, since the UI always expects a list back.
- Consumes: `parse` from the `yaml` npm package (Step 1 of this task adds it).

- [ ] **Step 1: Add the `yaml` dependency**

Run: `cd apps/main-site && npm install yaml`
Expected: `package.json`/`package-lock.json` (or the monorepo's lockfile) updated with a pinned `yaml` version.

- [ ] **Step 2: Write failing tests covering the Review Focus version-constraint edge cases**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { validatePubspec } from "../src/lib/pubspec-validator.ts";

const VALID = `
name: my_app
description: A sample app.
version: 1.0.0+1
environment:
  sdk: '>=3.0.0 <4.0.0'
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  some_git_pkg:
    git:
      url: https://example.com/pkg.git
dev_dependencies:
  flutter_test:
    sdk: flutter
`;

test("a well-formed pubspec produces no issues", () => {
  assert.deepEqual(validatePubspec(VALID), []);
});

test("invalid YAML syntax is reported as an error, not thrown", () => {
  const issues = validatePubspec("name: my_app\n  bad indent: :::");
  assert.ok(issues.some((i) => i.severity === "error"));
});

test("missing name field is an error", () => {
  const issues = validatePubspec("description: no name here\n");
  assert.ok(issues.some((i) => i.severity === "error" && /name/i.test(i.message)));
});

test("a bad version constraint string is flagged", () => {
  const issues = validatePubspec(VALID.replace("http: ^1.2.0", "http: not-a-version"));
  assert.ok(issues.some((i) => /http/.test(i.message)));
});

test("git, path, and 'any' dependency shapes are NOT false-flagged as malformed", () => {
  const withPathAndAny = VALID + "  local_pkg:\n    path: ../local_pkg\n  anything_goes: any\n";
  const issues = validatePubspec(withPathAndAny);
  assert.ok(!issues.some((i) => /local_pkg|anything_goes/.test(i.message)));
});

test("a dependency duplicated in both dependencies and dev_dependencies is a warning", () => {
  const dup = VALID + "  flutter_test:\n    sdk: flutter\n"; // also already in dev_dependencies
  const issues = validatePubspec(dup);
  assert.ok(issues.some((i) => i.severity === "warning" && /flutter_test/.test(i.message)));
});
```

- [ ] **Step 3: Run tests, verify they fail**

Run: `cd apps/main-site && node --experimental-strip-types --test tests/pubspec-validator.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `validatePubspec`**

Wrap `yaml`'s `parse()` in try/catch — on throw, return `[{ severity: "error", message: "Invalid YAML: " + e.message }]`. On success: error if `name` is missing or not a string; warning if any dependency uses the `flutter` SDK (i.e. an entry shaped `{ sdk: "flutter" }`) but the top-level `flutter:` section is absent; for each entry in `dependencies`/`dev_dependencies`, skip validation (no false "malformed version" flag) when the value is a map (git/path/hosted-with-version maps) or the literal string `"any"`; when the value is a plain string, validate it against a permissive constraint grammar covering caret (`^1.2.3`), range (`>=1.0.0 <2.0.0`), exact, and `any` — anything else is an `error` naming the dependency; a key present in both `dependencies` and `dev_dependencies` is a `warning` naming the dependency.

- [ ] **Step 5: Run tests, verify they pass**

Run: `cd apps/main-site && node --experimental-strip-types --test tests/pubspec-validator.test.mjs`
Expected: PASS, all 6 tests.

- [ ] **Step 6: Build the `PubspecValidator` component, wire up page + registry**

Same shape as prior tasks: paste/upload textarea, "Validate" button, results list grouped by severity (error in red, warning in amber) matching the existing `AlertTriangle` styling already used in `JsonToDart.tsx`. Registry entry:
```ts
{
  slug: "pubspec-validator",
  href: "/tools/pubspec-validator",
  icon: /* e.g. FileCog */,
  title: "pubspec.yaml Validator",
  description: "Validate pubspec.yaml syntax and catch malformed version constraints, missing flutter: sections, and duplicate dependencies.",
  tags: ["Flutter", "Config"],
  popular: false,
  related: ["arb-validator", "dart-enum-generator"],
}
```
Create `src/app/tools/pubspec-validator/page.tsx` with the standard composition.

- [ ] **Step 7: Add the `tool-content.ts` entry for `"pubspec-validator"`**

FAQ covers: does this run `flutter pub get` or hit pub.dev (no — pure static analysis, nothing leaves the browser), what counts as a malformed version constraint, why doesn't it flag my git/path dependency (explain those are intentionally exempt), does it catch every possible pubspec mistake (be honest: no, it's a fast first-pass check, not a replacement for `flutter pub get`'s own validation).

- [ ] **Step 8: Manual verification**

Run: `cd apps/main-site && npx tsc --noEmit && npm run dev`, open `/tools/pubspec-validator`, paste the `VALID` fixture from Step 2 and confirm zero issues, then paste a version with a typo'd constraint and confirm it's flagged.

- [ ] **Step 9: Commit**

```bash
git add apps/main-site/src/lib/pubspec-validator.ts apps/main-site/src/components/tools/PubspecValidator.tsx apps/main-site/src/app/tools/pubspec-validator apps/main-site/src/lib/tools.ts apps/main-site/src/lib/tool-content.ts apps/main-site/tests/pubspec-validator.test.mjs apps/main-site/package.json apps/main-site/package-lock.json
git commit -m "feat(main-site): add pubspec.yaml validator tool"
```

---

## Task 7: API Response Diff Checker

**Files:**
- Create: `apps/main-site/src/lib/api-diff.ts`
- Create: `apps/main-site/src/components/tools/ApiDiffChecker.tsx`
- Create: `apps/main-site/src/app/tools/api-diff-checker/page.tsx`
- Modify: `apps/main-site/src/lib/tools.ts`
- Modify: `apps/main-site/src/lib/tool-content.ts`
- Test: `apps/main-site/tests/api-diff.test.mjs`

**Interfaces:**
- Produces:
```ts
export type DiffKind = "added" | "removed" | "changed";
export interface DiffEntry { path: string; kind: DiffKind; before?: unknown; after?: unknown; }
export function diffJson(a: unknown, b: unknown): DiffEntry[]
```
  Only differing paths are returned (no `"unchanged"` entries — the UI only needs to render what changed). `path` uses dot notation with bracketed indices, e.g. `user.addresses[0].city`.

- [ ] **Step 1: Write failing tests covering the Review Focus key-order and type-change cases**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { diffJson } from "../src/lib/api-diff.ts";

test("reordered keys produce no diff", () => {
  assert.deepEqual(diffJson({ a: 1, b: 2 }, { b: 2, a: 1 }), []);
});

test("added and removed keys are reported", () => {
  const d = diffJson({ a: 1 }, { b: 2 });
  assert.ok(d.some((e) => e.path === "a" && e.kind === "removed"));
  assert.ok(d.some((e) => e.path === "b" && e.kind === "added"));
});

test("a type change (string vs number) is reported as changed, not equal", () => {
  const d = diffJson({ id: "1" }, { id: 1 });
  assert.deepEqual(d, [{ path: "id", kind: "changed", before: "1", after: 1 }]);
});

test("nested array element changes use an indexed path", () => {
  const d = diffJson({ users: [{ name: "a" }] }, { users: [{ name: "b" }] });
  assert.ok(d.some((e) => e.path === "users[0].name" && e.kind === "changed"));
});

test("identical nested structures produce no diff regardless of key order", () => {
  const a = { user: { id: 1, name: "x" } };
  const b = { user: { name: "x", id: 1 } };
  assert.deepEqual(diffJson(a, b), []);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `cd apps/main-site && node --experimental-strip-types --test tests/api-diff.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `diffJson`**

Recursive walk: if both values are plain objects, union their keys, recurse per key with path extended by `.key`, emitting `added`/`removed` for keys present on only one side; if both are arrays, walk by index up to the longer length with path extended by `[i]`, same added/removed/recurse logic; otherwise (primitives, or type mismatch, or one side is an object/array and the other isn't) compare with `Object.is`/strict equality — if unequal, emit one `changed` entry with `before`/`after` at the current path and do not recurse further into it.

- [ ] **Step 4: Run tests, verify they pass**

Run: `cd apps/main-site && node --experimental-strip-types --test tests/api-diff.test.mjs`
Expected: PASS, all 5 tests.

- [ ] **Step 5: Build the `ApiDiffChecker` component, wire up page + registry**

Two side-by-side paste/upload panels ("Before" / "After" JSON), a "Compare" button, and a results list grouped by `kind` with color coding (added=green, removed=red, changed=amber) showing `path`, and for `changed` entries both `before`/`after` values stringified. Registry entry:
```ts
{
  slug: "api-diff-checker",
  href: "/tools/api-diff-checker",
  icon: /* e.g. GitCompare */,
  title: "API Response Diff Checker",
  description: "Compare two JSON payloads and see exactly what was added, removed, or changed — ignores key order, handles nested objects and arrays.",
  tags: ["API", "Utility"],
  popular: false,
  related: ["json-formatter", "json-to-typescript"],
}
```
Create `src/app/tools/api-diff-checker/page.tsx` with the standard composition.

- [ ] **Step 6: Add the `tool-content.ts` entry for `"api-diff-checker"`**

Real scenario for "Why use this tool": comparing a staging vs. production API response to find an unexpected field rename or type change before it breaks a Dart model's `fromJson`. FAQ covers: does key order matter (no, explicitly state this is intentional), how are changed array items reported, does it diff arrays by index or by some identity/key match (be honest about the actual Step 3 behavior — by index), is there a size limit.

- [ ] **Step 7: Manual verification**

Run: `cd apps/main-site && npx tsc --noEmit && npm run dev`, open `/tools/api-diff-checker`, paste two slightly different JSON payloads, confirm added/removed/changed render correctly and reordering keys in one side doesn't produce noise.

- [ ] **Step 8: Commit**

```bash
git add apps/main-site/src/lib/api-diff.ts apps/main-site/src/components/tools/ApiDiffChecker.tsx apps/main-site/src/app/tools/api-diff-checker apps/main-site/src/lib/tools.ts apps/main-site/src/lib/tool-content.ts apps/main-site/tests/api-diff.test.mjs
git commit -m "feat(main-site): add API response diff checker tool"
```

---

## Task 8: Dart Enum Generator, plus final site-wide wiring

**Files:**
- Create: `apps/main-site/src/lib/dart-enum-generator.ts`
- Create: `apps/main-site/src/components/tools/DartEnumGenerator.tsx`
- Create: `apps/main-site/src/app/tools/dart-enum-generator/page.tsx`
- Modify: `apps/main-site/src/lib/tools.ts` (add this entry; add `isNew` field to `Tool` interface; mark `arb-validator` `isNew: true`; add cross-links from the 5 new tools into relevant existing tools' `related` arrays)
- Modify: `apps/main-site/src/components/tools/ToolCard.tsx` (render "new" badge)
- Modify: `apps/main-site/src/lib/tool-content.ts`
- Test: `apps/main-site/tests/dart-enum-generator.test.mjs`

**Interfaces:**
- Produces:
```ts
export interface DartEnumOptions { name: string; fromString: boolean; toJson: boolean; }
export function generateDartEnum(input: string, opts: DartEnumOptions): string
```
  `input` accepts either newline- or comma-separated values, or a pasted JSON string array (detect: if `input.trim()` starts with `[`, `JSON.parse` it and require every element be a string, else split on `/\r?\n|,/`). Trims, drops empty entries, dedupes by sanitized identifier (see Step 1's collision test).

- [ ] **Step 1: Write failing tests covering the Review Focus identifier-collision case**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { generateDartEnum } from "../src/lib/dart-enum-generator.ts";

test("generates an enhanced enum from a newline list", () => {
  const out = generateDartEnum("Active\nInactive\nPending", { name: "Status", fromString: false, toJson: false });
  assert.match(out, /enum Status \{/);
  assert.match(out, /active\(/);
  assert.match(out, /inactive\(/);
  assert.match(out, /pending\(/);
});

test("parses a comma-separated list", () => {
  const out = generateDartEnum("Red, Green, Blue", { name: "Color", fromString: false, toJson: false });
  assert.match(out, /red\(/);
  assert.match(out, /blue\(/);
});

test("parses a pasted JSON string array", () => {
  const out = generateDartEnum('["one", "two"]', { name: "Num", fromString: false, toJson: false });
  assert.match(out, /one\(/);
  assert.match(out, /two\(/);
});

test("sanitizes invalid identifiers and disambiguates collisions", () => {
  const out = generateDartEnum("2nd Place\n2nd-place", { name: "Rank", fromString: false, toJson: false });
  const members = [...out.matchAll(/^\s{2}(\w+)\(/gm)].map((m) => m[1]);
  assert.equal(new Set(members).size, members.length); // no duplicate member names
  for (const m of members) assert.doesNotMatch(m, /^[0-9]/);
});

test("includes fromString/toJson only when requested", () => {
  const withHelpers = generateDartEnum("A\nB", { name: "X", fromString: true, toJson: true });
  assert.match(withHelpers, /fromString/);
  assert.match(withHelpers, /toJson/);
  const without = generateDartEnum("A\nB", { name: "X", fromString: false, toJson: false });
  assert.doesNotMatch(without, /fromString/);
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `cd apps/main-site && node --experimental-strip-types --test tests/dart-enum-generator.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `generateDartEnum`**

Parse input per the detection rule above into a raw string list; for each, lowerCamelCase-sanitize into a Dart identifier (strip non-alphanumerics, camel-case on word boundaries, if the result starts with a digit prefix with `v`); on a collision with an already-used member name, append `2`, `3`, ... until unique. Emit a Dart 3 enhanced enum: `enum {Name} { member1('Raw Label 1'), member2('Raw Label 2'); const {Name}(this.label); final String label;` plus, when `fromString` is true, a `static {Name} fromString(String value) => values.firstWhere((e) => e.label == value, orElse: () => throw ArgumentError('Unknown {Name}: $value'));`, and when `toJson` is true, a `String toJson() => label;` method.

- [ ] **Step 4: Run tests, verify they pass**

Run: `cd apps/main-site && node --experimental-strip-types --test tests/dart-enum-generator.test.mjs`
Expected: PASS, all 5 tests.

- [ ] **Step 5: Build the `DartEnumGenerator` component, wire up page + registry**

Textarea for the value list, a name input, two toggles (fromString/toJson) matching `ToggleSwitch` from `JsonToDart.tsx`, generate + copy, output panel. Registry entry:
```ts
{
  slug: "dart-enum-generator",
  href: "/tools/dart-enum-generator",
  icon: /* e.g. ListOrdered */,
  title: "Dart Enum Generator",
  description: "Generate a Dart 3 enhanced enum from a list of values, with optional fromString and toJson helpers.",
  tags: ["Flutter", "Dart", "Generator"],
  popular: false,
  related: ["dart-data-class-generator", "pubspec-validator"],
}
```
Create `src/app/tools/dart-enum-generator/page.tsx` with the standard composition.

- [ ] **Step 6: Add the `tool-content.ts` entry for `"dart-enum-generator"`**

FAQ covers: why enhanced enums instead of a plain `enum {a, b, c}` (explain the label/fromString/toJson value), what happens with duplicate or messy input values (state the sanitization/collision behavior honestly), can I paste a JSON array directly (yes), does this handle values with special characters.

- [ ] **Step 7: Add the `isNew` field and badge, and finish cross-linking**

In `tools.ts`: add `isNew?: boolean` to the `Tool` interface; set `isNew: true` on the `arb-validator` entry only. In `ToolCard.tsx`: render a small `"new"` badge (visually distinct from the existing `popular` pill — different color/token, e.g. `bg-accent/15 text-accent`) when `tool.isNew` is true, positioned next to or in place of the `popular` pill slot. Also, in `tools.ts`, append the new tools into relevant existing tools' `related` arrays so the linking is bidirectional: add `"json-to-typescript"` to `json-formatter`'s `related`, add `"arb-validator"` to `json-to-dart`'s `related`, add `"pubspec-validator"` to `dart-data-class-generator`'s `related`, add `"api-diff-checker"` to `json-formatter`'s `related` (alongside json-to-typescript), add `"dart-enum-generator"` to `dart-data-class-generator`'s `related`.

- [ ] **Step 8: Full-repo verification**

Run, from `apps/main-site`:
- `npx tsc --noEmit`
- `node --experimental-strip-types --test tests/*.test.mjs`
- `npm run build`

Expected: type-check clean, all tests (existing 3 + new 5) pass, production build succeeds with 5 new routes listed in the build output.

- [ ] **Step 9: Manual verification**

Run: `npm run dev`, then: open `/tools`, confirm all 15 cards render, confirm the ARB validator card shows the "new" badge and the three `popular: true` tools still show their pill; open `/tools/dart-enum-generator` and exercise it end-to-end; spot-check 2-3 of the enriched existing tool pages (e.g. `/tools/json-to-dart`, `/tools/jwt-decoder`) to confirm the new list/code/FAQ blocks render correctly below the widget.

- [ ] **Step 10: Commit**

```bash
git add apps/main-site/src/lib/dart-enum-generator.ts apps/main-site/src/components/tools/DartEnumGenerator.tsx apps/main-site/src/app/tools/dart-enum-generator apps/main-site/src/lib/tools.ts apps/main-site/src/components/tools/ToolCard.tsx apps/main-site/src/lib/tool-content.ts apps/main-site/tests/dart-enum-generator.test.mjs
git commit -m "feat(main-site): add Dart enum generator, new-tool badge, and finish cross-linking the tools index"
```
