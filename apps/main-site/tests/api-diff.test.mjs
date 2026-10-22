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
