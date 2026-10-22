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
