export interface ToolContentSection {
  heading: string;
  body: string[];
}

export interface ToolContent {
  sections: ToolContentSection[];
}

// Real, substantive explanatory content for each tool page — every claim
// here is accurate to what the widget actually does (verified against its
// implementation), not padding written to hit a word count. This exists
// because a page that's only an interactive widget with no written content
// reads as thin/low-value content to search engines and ad reviewers.
export const TOOL_CONTENT: Record<string, ToolContent> = {
  "json-to-dart": {
    sections: [
      {
        heading: "Why convert JSON to Dart by hand",
        body: [
          "Every Flutter app that talks to an API ends up writing the same boilerplate: a class per response shape, a fromJson factory that reads each key, a toJson that writes it back, and usually a copyWith for state updates. Doing this by hand for a payload with fifteen fields is slow and it's exactly the kind of work where a typo in a key name fails silently at runtime instead of at compile time.",
          "This tool parses the JSON you paste in, infers a Dart type for each field (String, int, double, bool, nested objects, and typed lists), and generates a null-safe class with fromJson, toJson, and copyWith already written. If a value is a nested object, it generates a class for that too.",
        ],
      },
      {
        heading: "Freezed and json_serializable output",
        body: [
          "Pick the output style that matches how your project is already structured. The plain Dart output works with zero dependencies, which is fine for a small app or a quick prototype. If you're already using Freezed or json_serializable for code generation, switch to that output format instead, since mixing manually-written model classes with generated ones in the same project usually causes more confusion than it saves.",
        ],
      },
      {
        heading: "What it won't get right",
        body: [
          "Type inference from a single JSON sample has a real limitation: if a field is null in your sample, there's no way to know its real type, so it falls back to dynamic. Always paste a JSON sample where every field is actually populated, and double-check the output against your API's real response before shipping it.",
        ],
      },
    ],
  },

  "qr-generator": {
    sections: [
      {
        heading: "What this generates",
        body: [
          "This creates a standard QR code from whatever text you give it, whether that's a URL, a plain message, an email address (using the mailto: scheme so scanning it opens a compose window), or a phone number (using tel:). The QR code itself is generated entirely in your browser and downloads as a PNG.",
        ],
      },
      {
        heading: "Common uses for Flutter developers",
        body: [
          "Testing a deep link without typing a long URL into your phone, sharing a TestFlight or internal APK download link at a standup, or putting a QR code in a README so a teammate can scan it and open your app straight into a specific screen. It's also useful outside of development: printing a QR code for a business card, a WiFi password, or a link on a poster.",
        ],
      },
    ],
  },

  "json-formatter": {
    sections: [
      {
        heading: "Format, validate, and minify",
        body: [
          "Paste JSON and it gets pretty-printed with consistent indentation, or minified down to a single line if you need to paste it somewhere space-constrained (an environment variable, a config field, a curl command). If the JSON is invalid, it points out the error with a line number instead of leaving you to scan the whole payload manually.",
        ],
      },
      {
        heading: "When you actually need this",
        body: [
          "API responses logged to a terminal come back as one unreadable line. Config files hand-edited by someone else lose their formatting. A webhook payload from a third-party service arrives minified. This exists for exactly those moments, when you need to actually read the structure of a piece of JSON, not just look at it.",
        ],
      },
    ],
  },

  "password-generator": {
    sections: [
      {
        heading: "How the randomness works",
        body: [
          "This uses the Web Crypto API's crypto.getRandomValues() rather than Math.random(). That distinction matters: Math.random() is a fast, predictable pseudorandom generator meant for things like shuffling a list or picking an animation delay, not for anything security-sensitive, since its output can in some cases be predicted. Web Crypto's generator is designed for cryptographic use, which is what an actual password needs.",
        ],
      },
      {
        heading: "Choosing length and character sets",
        body: [
          "Toggle uppercase, lowercase, numbers, and symbols independently, and set the length. The strength indicator gives you a rough read on how resistant the result is to brute-force guessing, based on the size of the character pool and the length you picked. Longer beats more complex: a 20-character password using only lowercase letters is still harder to brute-force than an 8-character password using every character type.",
        ],
      },
      {
        heading: "What stays on your device",
        body: [
          "Generation happens entirely in your browser. Nothing you generate here is sent to a server, logged, or stored anywhere. That's true of every tool on this page, but it's worth saying explicitly for a password generator specifically.",
        ],
      },
    ],
  },

  base64: {
    sections: [
      {
        heading: "Encoding vs. encryption",
        body: [
          "Base64 is not encryption and doesn't hide anything from anyone who bothers to decode it; it's a way to represent binary data as plain text so it survives being passed through systems that only handle text safely, like embedding an image in a data URL, or putting a token in an HTTP header. Anyone can decode a Base64 string in one line of code, in any language.",
        ],
      },
      {
        heading: "Where this shows up in Flutter/Dart work",
        body: [
          "Decoding a JWT's payload (the middle segment of a JWT is Base64Url-encoded JSON), reading a data: URL you copied out of a network request, or checking what's actually inside a Basic Auth header before you commit to debugging further down the stack. Encode and decode both happen instantly, entirely client-side.",
        ],
      },
    ],
  },

  "uuid-generator": {
    sections: [
      {
        heading: "What a v4 UUID actually is",
        body: [
          "A UUID (universally unique identifier) is a 128-bit value formatted as 32 hex digits in five groups, like 550e8400-e29b-41d4-a716-446655440000. Version 4 means it's generated almost entirely from random bits rather than derived from a timestamp or a hardware address, which is why two v4 UUIDs colliding is astronomically unlikely even generated on completely unrelated machines with no coordination.",
        ],
      },
      {
        heading: "Why you'd reach for one",
        body: [
          "Primary keys for database rows where you don't want a predictable, guessable, sequential integer ID exposed in a URL. Idempotency keys for API requests, so a retried request doesn't create a duplicate. Temporary file names, test fixture IDs, or any place you need a unique identifier without a central authority handing them out. This tool generates them in bulk and copies to clipboard in one click, either one at a time or the whole batch.",
        ],
      },
    ],
  },

  "jwt-decoder": {
    sections: [
      {
        heading: "What gets decoded, and what doesn't",
        body: [
          "A JWT has three Base64Url-encoded segments separated by dots: a header, a payload, and a signature. This tool decodes the header and payload back into readable JSON so you can inspect the claims (expiry, subject, custom fields) directly. It does not, and cannot, verify the signature, since that requires the secret or public key the token was signed with, which never leaves your auth server.",
        ],
      },
      {
        heading: "A decoded token is not a verified token",
        body: [
          "This is worth stating plainly: anyone can decode a JWT and read its contents, including an attacker holding a token they didn't legitimately receive. Decoding tells you what a token claims; it says nothing about whether those claims are trustworthy. Verification always has to happen server-side, against the actual signing key, before you trust anything in the payload.",
        ],
      },
      {
        heading: "Common debugging use",
        body: [
          "Checking why a token is being rejected as expired (the exp claim is a Unix timestamp, easy to misread), confirming which claims your auth provider actually included, or comparing a token issued in dev against one from production when something behaves differently between environments.",
        ],
      },
    ],
  },

  "regex-tester": {
    sections: [
      {
        heading: "Live matching against real sample text",
        body: [
          "Write a pattern and test text side by side, and matches highlight as you type, along with capture groups broken out individually. This matters because regex is notoriously easy to get subtly wrong, a pattern that matches your one example input can fail on the next one, and the only reliable way to catch that is testing against real, varied sample strings, not just staring at the pattern.",
        ],
      },
      {
        heading: "Flags and what they change",
        body: [
          "Toggle the common flags, global (match all occurrences instead of stopping at the first), case-insensitive, and multiline (so ^ and $ match the start/end of each line instead of the whole string), and see the match set update immediately. Dart's RegExp class supports the same core syntax as JavaScript's, so a pattern validated here generally carries straight over into Dart code.",
        ],
      },
    ],
  },

  "color-generator": {
    sections: [
      {
        heading: "One seed color, a full palette",
        body: [
          "Material 3 builds an app's entire color scheme, primary, secondary, surface, error, and their variants, from a single seed color, rather than requiring you to pick every shade by hand. This tool lets you preview what Flutter's ColorScheme.fromSeed() actually produces from a given hex color before you commit to it in code.",
        ],
      },
      {
        heading: "Copy the exact Flutter snippet",
        body: [
          "Pick a seed color and copy a ready-to-use ColorScheme.fromSeed(seedColor: Color(0xFF...)) line straight into your ThemeData. No manual hex-to-Color conversion, no guessing whether the derived tones will actually look right together, since you're previewing the same algorithm Flutter uses internally.",
        ],
      },
    ],
  },

  "dart-data-class-generator": {
    sections: [
      {
        heading: "What makes a Dart class properly immutable",
        body: [
          "An immutable data class needs more than final fields. It needs a copyWith method so you can produce a modified copy without mutating the original (essential for state management patterns like Bloc or Riverpod, where state objects should never be mutated in place), a working == operator and hashCode so two instances with the same field values are treated as equal instead of only being equal by reference, and a readable toString for debugging. Writing all of that correctly by hand, especially the equality check across every field, is tedious and easy to get subtly wrong.",
        ],
      },
      {
        heading: "What this generates from your JSON",
        body: [
          "Paste a JSON sample and it produces a Dart class with typed final fields inferred from the JSON's actual values, a constructor, copyWith, a value-based == and hashCode covering every field, and toString. No fromJson/toJson serialization is included, since this tool is specifically for the immutable-class shape itself; pair it with the JSON to Dart converter if you also need serialization.",
        ],
      },
    ],
  },
};
