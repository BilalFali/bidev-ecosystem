import { test } from "node:test";
import assert from "node:assert/strict";
import { topTags } from "../src/lib/topics.ts";

test("counts each tag once per article", () => {
  const result = topTags([{ tags: ["a", "a", "b"] }, { tags: ["a"] }]);
  assert.deepEqual(result, [{ tag: "a", count: 2 }, { tag: "b", count: 1 }]);
});

test("ties sort alphabetically", () => {
  const result = topTags([{ tags: ["z"] }, { tags: ["m"] }]);
  assert.deepEqual(result.map((r) => r.tag), ["m", "z"]);
});

test("respects the limit", () => {
  const result = topTags([{ tags: ["a", "b", "c", "d"] }], 2);
  assert.equal(result.length, 2);
});

test("empty input and articles without tags give an empty list", () => {
  assert.deepEqual(topTags([]), []);
  assert.deepEqual(topTags([{ tags: [] }]), []);
});
