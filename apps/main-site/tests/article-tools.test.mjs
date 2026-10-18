import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { toolSlugForTags, TAG_TOOL_MAP } from "../src/lib/article-tools.ts";

test("first matching tag in article order wins", () => {
  assert.equal(toolSlugForTags(["flutter", "authentication", "api"]), "jwt-decoder");
});

test("matching is case-insensitive", () => {
  assert.equal(toolSlugForTags(["API"]), "json-to-dart");
});

test("no match and empty tags give null", () => {
  assert.equal(toolSlugForTags(["flutter", "riverpod"]), null);
  assert.equal(toolSlugForTags([]), null);
});

test("object-property names never match", () => {
  assert.equal(toolSlugForTags(["constructor", "toString", "__proto__", "hasOwnProperty"]), null);
});

test("every mapped tool slug exists in tools.ts", () => {
  const source = readFileSync(new URL("../src/lib/tools.ts", import.meta.url), "utf8");
  for (const slug of TAG_TOOL_MAP.values()) {
    assert.ok(source.includes(`slug: "${slug}"`), `tools.ts has no tool with slug ${slug}`);
  }
});
