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
