export interface Tool {
  slug: string;
  href: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  popular: boolean;
  related?: string[];
}

export const TOOLS: Tool[] = [
  {
    slug: "json-to-dart",
    href: "/tools/json-to-dart",
    icon: "🎯",
    title: "JSON to Dart Converter",
    description: "Convert JSON to Dart model classes. Generates fromJson, toJson, copyWith with null safety. Supports Freezed & json_serializable.",
    tags: ["Flutter", "Dart"],
    popular: true,
    related: ["dart-data-class-generator", "color-generator"],
  },
  {
    slug: "qr-generator",
    href: "/tools/qr-generator",
    icon: "⬛",
    title: "QR Code Generator",
    description: "Generate QR codes for URLs, text, emails, and phone numbers instantly. Download as PNG.",
    tags: ["Generator", "Free"],
    popular: true,
    related: ["uuid-generator", "password-generator"],
  },
  {
    slug: "json-formatter",
    href: "/tools/json-formatter",
    icon: "{ }",
    title: "JSON Formatter & Validator",
    description: "Format, validate, and minify JSON. Real-time error detection with line numbers.",
    tags: ["Formatter", "Validator"],
    popular: false,
    related: ["json-to-dart", "regex-tester"],
  },
  {
    slug: "password-generator",
    href: "/tools/password-generator",
    icon: "🔐",
    title: "Password Generator",
    description: "Generate cryptographically secure passwords using the Web Crypto API. Strength indicator included.",
    tags: ["Security", "Generator"],
    popular: false,
    related: ["uuid-generator", "jwt-decoder"],
  },
  {
    slug: "base64",
    href: "/tools/base64",
    icon: "🔡",
    title: "Base64 Encoder / Decoder",
    description: "Encode any text or URL to Base64, or decode Base64 strings — fully client-side.",
    tags: ["Encoding", "Utility"],
    popular: false,
    related: ["jwt-decoder", "json-formatter"],
  },
  {
    slug: "uuid-generator",
    href: "/tools/uuid-generator",
    icon: "🆔",
    title: "UUID Generator",
    description: "Generate RFC-4122 compliant v4 UUIDs in bulk. Copy to clipboard in one click.",
    tags: ["Generator", "Utility"],
    popular: false,
    related: ["password-generator", "qr-generator"],
  },
  {
    slug: "jwt-decoder",
    href: "/tools/jwt-decoder",
    icon: "🔑",
    title: "JWT Decoder",
    description: "Decode JSON Web Tokens instantly. Inspect header, payload, and expiry — fully client-side, no signature verification.",
    tags: ["Security", "Decoder"],
    popular: true,
    related: ["base64", "regex-tester"],
  },
  {
    slug: "regex-tester",
    href: "/tools/regex-tester",
    icon: "🧪",
    title: "Regex Tester",
    description: "Test regular expressions against sample text with live match highlighting, groups, and flags.",
    tags: ["Regex", "Testing"],
    popular: false,
    related: ["json-formatter", "jwt-decoder"],
  },
  {
    slug: "color-generator",
    href: "/tools/color-generator",
    icon: "🎨",
    title: "Color Generator",
    description: "Pick a seed color and preview tints/shades. Copy a ready-to-use Flutter ColorScheme.fromSeed() snippet.",
    tags: ["Flutter", "Design"],
    popular: false,
    related: ["json-to-dart", "dart-data-class-generator"],
  },
  {
    slug: "dart-data-class-generator",
    href: "/tools/dart-data-class-generator",
    icon: "🧱",
    title: "Dart Data Class Generator",
    description: "Paste JSON and generate an immutable Dart data class with copyWith, toString, and equality — no JSON (de)serialization boilerplate.",
    tags: ["Flutter", "Dart"],
    popular: true,
    related: ["json-to-dart", "color-generator"],
  },
];

export function resolveRelatedTools(slug: string): Tool[] {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool?.related) return [];
  return tool.related
    .map((s) => TOOLS.find((t) => t.slug === s))
    .filter((t): t is Tool => Boolean(t));
}
