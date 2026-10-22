import { test } from "node:test";
import assert from "node:assert/strict";
import { generatePassword, CHARS } from "../src/lib/password-generator.ts";

test("guarantees at least one character from every enabled type, every time", () => {
  const opts = { upper: true, lower: true, digits: true, symbols: true };
  for (let i = 0; i < 200; i++) {
    const pw = generatePassword(8, opts);
    assert.match(pw, /[A-Z]/, `missing uppercase in "${pw}"`);
    assert.match(pw, /[a-z]/, `missing lowercase in "${pw}"`);
    assert.match(pw, /\d/, `missing digit in "${pw}"`);
    assert.match(pw, /[^A-Za-z0-9]/, `missing symbol in "${pw}"`);
  }
});

test("only draws characters from enabled pools", () => {
  const pw = generatePassword(30, { upper: true, lower: false, digits: true, symbols: false });
  for (const c of pw) {
    assert.ok((CHARS.upper + CHARS.digits).includes(c), `unexpected character "${c}" in "${pw}"`);
  }
});

test("returns the requested length", () => {
  assert.equal(generatePassword(16, { upper: true, lower: true, digits: false, symbols: false }).length, 16);
});

test("returns empty string when no character type is enabled", () => {
  assert.equal(generatePassword(16, { upper: false, lower: false, digits: false, symbols: false }), "");
});
