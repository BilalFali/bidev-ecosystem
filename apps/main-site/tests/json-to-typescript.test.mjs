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
