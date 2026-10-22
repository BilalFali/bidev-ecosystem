import { test } from "node:test";
import assert from "node:assert/strict";
import { validateArbFiles } from "../src/lib/arb-validator.ts";

const base = { locale: "en", content: JSON.stringify({
  "@@locale": "en",
  greeting: "Hello {name}",
  itemCount: "{count, plural, one{1 item} other{{count} items}}",
}) };

test("flags a key missing from a locale", () => {
  const fr = { locale: "fr", content: JSON.stringify({ "@@locale": "fr" }) };
  const issues = validateArbFiles(base, [fr]);
  assert.ok(issues.some((i) => i.locale === "fr" && i.key === "greeting" && i.type === "missing-key"));
});

test("flags a key present only in a translated locale", () => {
  const fr = { locale: "fr", content: JSON.stringify({ "@@locale": "fr", greeting: "Bonjour {name}", itemCount: "x", extra: "y" }) };
  const issues = validateArbFiles(base, [fr]);
  assert.ok(issues.some((i) => i.locale === "fr" && i.key === "extra" && i.type === "extra-key"));
});

test("flags a placeholder name mismatch", () => {
  const fr = { locale: "fr", content: JSON.stringify({ "@@locale": "fr", greeting: "Bonjour {prenom}", itemCount: "{count, plural, one{1} other{{count}}}" }) };
  const issues = validateArbFiles(base, [fr]);
  assert.ok(issues.some((i) => i.locale === "fr" && i.key === "greeting" && i.type === "placeholder-mismatch"));
});

test("extracts the plural/select variable name correctly and does not false-flag it", () => {
  const fr = { locale: "fr", content: JSON.stringify({ "@@locale": "fr", greeting: "Bonjour {name}", itemCount: "{count, plural, one{un} other{{count} articles}}" }) };
  const issues = validateArbFiles(base, [fr]);
  assert.ok(!issues.some((i) => i.key === "itemCount"));
});

test("identical files produce no issues", () => {
  const fr = { locale: "fr", content: base.content.replace('"en"', '"fr"') };
  assert.deepEqual(validateArbFiles(base, [fr]), []);
});
