import { test } from "node:test";
import assert from "node:assert/strict";
import { validatePubspec } from "../src/lib/pubspec-validator.ts";

test("a duplicate key alongside genuinely broken YAML never throws", () => {
  assert.doesNotThrow(() => {
    const issues = validatePubspec("name: a\nname: b\nfoo: [unclosed\n");
    assert.ok(issues.some((i) => i.severity === "error"));
  });
});

test("a top-level duplicate key (e.g. two dependencies: blocks) is named by section, not silently merged", () => {
  const yaml = `
name: my_app
dependencies:
  http: ^1.0.0
dependencies:
  path: ^1.0.0
`;
  const issues = validatePubspec(yaml);
  const dup = issues.find((i) => i.severity === "warning" && /dependencies/.test(i.message));
  assert.ok(dup, "expected a warning naming the duplicated \"dependencies\" key");
  assert.match(dup.message, /top level/i);
});

test("every duplicate key is reported, not just the first", () => {
  const yaml = `
name: my_app
dependencies:
  http: ^1.0.0
  http: ^2.0.0
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_test:
    sdk: flutter
`;
  const issues = validatePubspec(yaml);
  const warnings = issues.filter((i) => i.severity === "warning" && /declared more than once|duplicated/i.test(i.message));
  assert.ok(warnings.some((w) => /http/.test(w.message)));
  assert.ok(warnings.some((w) => /flutter_test/.test(w.message)));
});

test("a same-section duplicate key names the enclosing section", () => {
  const yaml = `
name: my_app
dependencies:
  http: ^1.0.0
  http: ^2.0.0
`;
  const issues = validatePubspec(yaml);
  const dup = issues.find((i) => i.severity === "warning" && /http/.test(i.message));
  assert.ok(dup);
  assert.match(dup.message, /dependencies/);
});
