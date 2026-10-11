import { test } from "node:test";
import assert from "node:assert/strict";
import { addHeadingIds, extractMarkdownHeadings } from "../src/lib/toc.ts";

test("adds ids to h2 and h3 and lists them", () => {
  const { html, headings } = addHeadingIds("<h2>Start it</h2><p>x</p><h3>Sub part</h3>");
  assert.equal(html, '<h2 id="start-it">Start it</h2><p>x</p><h3 id="sub-part">Sub part</h3>');
  assert.deepEqual(headings, [
    { id: "start-it", text: "Start it", level: 2 },
    { id: "sub-part", text: "Sub part", level: 3 },
  ]);
});

test("duplicate headings get unique ids", () => {
  const { html, headings } = addHeadingIds("<h2>FAQ</h2><h2>FAQ</h2>");
  assert.deepEqual(headings.map((h) => h.id), ["faq", "faq-2"]);
  assert.equal(html, '<h2 id="faq">FAQ</h2><h2 id="faq-2">FAQ</h2>');
});

test("strips inline tags and decodes entities", () => {
  const { headings } = addHeadingIds("<h2>Use <code>dart mcp-server</code> &amp; more</h2>");
  assert.equal(headings[0].text, "Use dart mcp-server & more");
  assert.equal(headings[0].id, "use-dart-mcp-server-more");
});

test("keeps an existing id and lists it", () => {
  const { html, headings } = addHeadingIds('<h2 id="custom">Hello</h2>');
  assert.equal(html, '<h2 id="custom">Hello</h2>');
  assert.equal(headings[0].id, "custom");
});

test("a repeated existing id is made unique", () => {
  const { html, headings } = addHeadingIds('<h2 id="a">One</h2><h2 id="a">Two</h2>');
  assert.deepEqual(headings.map((h) => h.id), ["a", "a-2"]);
  assert.equal(html, '<h2 id="a">One</h2><h2 id="a-2">Two</h2>');
});

test("non-ASCII heading falls back to section-N", () => {
  const { headings } = addHeadingIds("<h2>مرحبا</h2><h2>أهلا</h2>");
  assert.deepEqual(headings.map((h) => h.id), ["section-1", "section-2"]);
});

test("empty headings are skipped and left untouched", () => {
  const input = "<h2> </h2>";
  const { html, headings } = addHeadingIds(input);
  assert.equal(html, input);
  assert.deepEqual(headings, []);
});

test("h1 and h4 are ignored", () => {
  const { headings } = addHeadingIds("<h1>A</h1><h4>B</h4>");
  assert.deepEqual(headings, []);
});

test("other attributes are preserved", () => {
  const { html } = addHeadingIds('<h2 class="x">Hi</h2>');
  assert.equal(html, '<h2 class="x" id="hi">Hi</h2>');
});

test("multi-line heading text works", () => {
  const { headings } = addHeadingIds("<h2>\n  Two\n  lines\n</h2>");
  assert.equal(headings[0].text, "Two lines");
});

test("escaped heading markup inside code is not matched", () => {
  const { headings } = addHeadingIds("<pre><code>&lt;h2&gt;Nope&lt;/h2&gt;</code></pre>");
  assert.deepEqual(headings, []);
});

test("markdown: ignores fenced code, dedupes like github-slugger", () => {
  const md = "## Intro\n\n```md\n## Not a heading\n```\n\n### Setup\n\n## Intro\n";
  assert.deepEqual(extractMarkdownHeadings(md), [
    { id: "intro", text: "Intro", level: 2 },
    { id: "setup", text: "Setup", level: 3 },
    { id: "intro-1", text: "Intro", level: 2 },
  ]);
});
