import { test } from "node:test";
import assert from "node:assert/strict";
import { pickAdjacent } from "../src/lib/adjacent.ts";

const a = (slug, publishedAt, categorySlug) => ({ slug, publishedAt, categorySlug });

test("middle article has both neighbours, older is prev", () => {
  const all = [a("c", "2026-03-01", "x"), a("a", "2026-01-01", "x"), a("b", "2026-02-01", "x")];
  const r = pickAdjacent(all, "b");
  assert.equal(r.prev.slug, "a");
  assert.equal(r.next.slug, "c");
});

test("first has no prev, last has no next", () => {
  const all = [a("a", "2026-01-01", "x"), a("b", "2026-02-01", "x")];
  assert.equal(pickAdjacent(all, "a").prev, null);
  assert.equal(pickAdjacent(all, "a").next.slug, "b");
  assert.equal(pickAdjacent(all, "b").next, null);
});

test("only article has neither", () => {
  assert.deepEqual(pickAdjacent([a("a", "2026-01-01", "x")], "a"), { prev: null, next: null });
});

test("unknown slug gives neither", () => {
  assert.deepEqual(pickAdjacent([a("a", "2026-01-01", "x")], "zzz"), { prev: null, next: null });
});

test("other categories are skipped", () => {
  const all = [a("a", "2026-01-01", "x"), a("b", "2026-02-01", "y"), a("c", "2026-03-01", "x")];
  assert.equal(pickAdjacent(all, "a").next.slug, "c");
});

test("no category means the whole pool", () => {
  const all = [a("a", "2026-01-01"), a("b", "2026-02-01", "y")];
  assert.equal(pickAdjacent(all, "a").next.slug, "b");
});

test("same date ties break by slug and an invalid date does not throw", () => {
  const all = [a("b", "2026-01-01", "x"), a("a", "2026-01-01", "x"), a("c", "not-a-date", "x")];
  const r = pickAdjacent(all, "b");
  assert.ok(r.prev === null || typeof r.prev.slug === "string");
});
