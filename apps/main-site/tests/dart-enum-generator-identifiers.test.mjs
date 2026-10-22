import { test } from "node:test";
import assert from "node:assert/strict";
import { generateDartEnum } from "../src/lib/dart-enum-generator.ts";

test("a value sanitizing to a Dart reserved word is disambiguated", () => {
  const out = generateDartEnum("New\nUsed", { name: "Condition", fromString: false, toJson: false });
  // "new" alone is a reserved word and can't be a member name.
  assert.doesNotMatch(out, /^\s{2}new\(/m);
  assert.match(out, /^\s{2}used\(/m);
});

test("a value colliding with the enum's own generated members (values/index/label) is disambiguated", () => {
  const out = generateDartEnum("Values\nLabel\nIndex", { name: "X", fromString: false, toJson: false });
  const members = [...out.matchAll(/^\s{2}(\w+)\(/gm)].map((m) => m[1]);
  assert.ok(!members.includes("values"), `"values" must not shadow the built-in enum member, got: ${members.join(", ")}`);
  assert.ok(!members.includes("label"), `"label" must not shadow the generated label field, got: ${members.join(", ")}`);
  assert.ok(!members.includes("index"), `"index" must not shadow the built-in enum member, got: ${members.join(", ")}`);
});

test("dollar signs and newlines in a label are escaped so the output stays valid Dart", () => {
  const out = generateDartEnum('["$5 plan"]', { name: "Plan", fromString: false, toJson: false });
  assert.match(out, /'\\\$5 plan'/);
});
