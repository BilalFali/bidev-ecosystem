// A Map, not an object literal: tags like "constructor" must not hit Object.prototype.
export const TAG_TOOL_MAP: ReadonlyMap<string, string> = new Map([
  ["authentication", "jwt-decoder"],
  ["api", "json-to-dart"],
  ["dart", "dart-data-class-generator"],
  ["ui", "color-generator"],
  ["widgets", "color-generator"],
]);

export function toolSlugForTags(tags: string[]): string | null {
  for (const tag of tags) {
    const slug = TAG_TOOL_MAP.get(tag.toLowerCase());
    if (slug) return slug;
  }
  return null;
}
