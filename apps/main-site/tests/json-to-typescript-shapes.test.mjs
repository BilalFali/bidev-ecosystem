import { test } from "node:test";
import assert from "node:assert/strict";
import { generateTypeScript } from "../src/lib/json-to-typescript.ts";

test("merges differing-shape elements of an object array instead of dropping fields", () => {
  const out = generateTypeScript('{"items": [{"a": 1}, {"b": "x"}]}', { rootName: "Root", useType: false });
  assert.match(out, /a\??: number;/);
  assert.match(out, /b\??: string;/);
});

test("two nested objects under different parent keys that collide on the same derived type name keep their own distinct shapes", () => {
  // Both "home.address" and "work.address" singularize/PascalCase to the
  // same type name "Address", but have genuinely different shapes.
  const out = generateTypeScript(
    '{"home": {"address": {"city": "a"}}, "work": {"address": {"city": "b", "floor": 3}}}',
    { rootName: "Root", useType: false }
  );
  assert.match(out, /city: string;/);
  assert.match(out, /floor: number;/);
  const typeBlockCount = (out.match(/^(interface|type) \w+/gm) ?? []).length;
  assert.ok(typeBlockCount >= 4, `expected root + home + work + two distinct address types, got:\n${out}`);
});

test("a nested key matching the root type name does not self-reference the root type", () => {
  const out = generateTypeScript('{"user": {"id": 1}}', { rootName: "User", useType: false });
  // The nested "user" object must get its own real definition with its own
  // fields, not collapse into "user: User" pointing back at the root type.
  assert.doesNotMatch(out, /user: User;/);
  assert.match(out, /id: number;/);
});

test("keys that aren't valid TypeScript identifiers are quoted", () => {
  const out = generateTypeScript('{"first-name": "a", "ok key": 1}', { rootName: "Root", useType: false });
  assert.match(out, /"first-name"\??: string;/);
  assert.match(out, /"ok key"\??: number;/);
});
