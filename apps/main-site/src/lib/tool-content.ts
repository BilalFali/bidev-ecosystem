export type ToolContentBlock =
  | { kind: "p"; text: string }
  | { kind: "steps"; items: string[] }
  | { kind: "code"; lang: string; label?: string; code: string }
  | { kind: "faq"; items: { q: string; a: string }[] };

export interface ToolContentSection {
  heading: string;
  blocks: ToolContentBlock[];
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
        blocks: [
          { kind: "p", text: "Every Flutter app that talks to an API ends up writing the same boilerplate: a class per response shape, a fromJson factory that reads each key, a toJson that writes it back, and usually a copyWith for state updates. Doing this by hand for a payload with fifteen fields is slow and it's exactly the kind of work where a typo in a key name fails silently at runtime instead of at compile time, usually as a null-check crash several screens away from where the mistake was made." },
          { kind: "p", text: "This tool parses the JSON you paste in, infers a Dart type for each field (String, int, double, bool, nested objects, and typed lists), and generates a null-safe class with fromJson, toJson, and copyWith already written. If a value is a nested object, it generates a class for that too, so a response with an address or a list of posts comes out as fully-typed nested models, not a pile of dynamic maps." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Paste a sample JSON response into the input panel — ideally one with every field populated, not a partial example.",
            "Set the root class name and, optionally, a suffix like Model, Dto, or Entity.",
            "Pick an output style: plain Dart, json_serializable, or Freezed.",
            "Toggle null safety, copyWith, and Equatable to match your project's conventions.",
            "Click Convert, then copy the generated classes straight into your project.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "json", label: "Input", code: `{\n  "id": 1,\n  "name": "Bilal Fali",\n  "is_active": true\n}` },
          { kind: "code", lang: "dart", label: "Generated Dart (plain output)", code: `class UserModel {\n  final int id;\n  final String name;\n  final bool isActive;\n\n  const UserModel({\n    required this.id,\n    required this.name,\n    required this.isActive,\n  });\n\n  factory UserModel.fromJson(Map<String, dynamic> json) {\n    return UserModel(\n      id: json['id'] as int,\n      name: json['name'] as String,\n      isActive: json['is_active'] as bool,\n    );\n  }\n}` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Does my JSON leave the browser?", a: "No. Parsing, type inference, and code generation all run client-side in JavaScript. Nothing you paste in is sent to a server or logged anywhere." },
            { q: "What happens if a field is null in my sample?", a: "The tool has no way to know a null field's real type, so it falls back to dynamic for that field. Paste a sample where every field actually has a value to get a precise type, then double-check the generated field against your API's real schema." },
            { q: "Should I pick Freezed, json_serializable, or plain Dart?", a: "Match whatever your project already uses for models. Plain Dart has zero dependencies and is fine for a small app or a quick prototype; json_serializable and Freezed both rely on build_runner codegen, so mixing their generated classes with hand-written ones in the same project tends to cause confusion rather than save time. Freezed additionally gives you union types and pattern matching if your models need that." },
            { q: "Does it handle nested objects and lists of objects?", a: "Yes — a nested object becomes its own generated class named after its key, and a list of objects becomes a typed List<T> of that class rather than List<dynamic>, so you get full type safety even through several levels of nesting." },
            { q: "What's the difference between this and the Dart Data Class Generator?", a: "This tool generates fromJson/toJson for API serialization; the Dart Data Class Generator produces an immutable value class with copyWith and equality but no serialization. Use this one whenever the data is coming from or going to JSON." },
          ] },
        ],
      },
    ],
  },

  "qr-generator": {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "Typing a long deep link or a TestFlight URL into a phone by hand is slow and error-prone, and most real-world QR use cases (a link on a poster, a WiFi password, a business card) are a one-off — not worth installing a native app for. This generates a standard QR code from whatever text you give it, whether that's a URL, a plain message, an email address, or a phone number, entirely in your browser." },
          { kind: "p", text: "For email and phone, the tool wraps your input in the mailto: and tel: URI schemes respectively, so scanning the code opens a compose window or a dialer directly instead of just showing raw text." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Pick a content type: URL, Text, Email, or Phone.",
            "Enter your content — the QR code regenerates automatically as you type, after a short debounce.",
            "Download the result as a PNG, or copy the image straight to your clipboard.",
            "Scan it with any phone's camera or QR reader to verify it before sharing it further.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "text", label: "What gets encoded for each type", code: `URL:    https://bidev.dev\nText:   Any plain string you type\nEmail:  mailto:hello@example.com\nPhone:  tel:+12345678900` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Does my text get sent anywhere to generate the code?", a: "No. The QR code is rendered entirely client-side using the qrcode npm package — nothing you type is sent to a server." },
            { q: "Why does the QR code look different if I change the error correction setting?", a: "This tool fixes error correction at level M, which balances code density against resilience — the code stays scannable even if roughly 15% of it is damaged or obscured." },
            { q: "Is there a limit to how much text I can encode?", a: "Very long input produces a denser, harder-to-scan code rather than failing outright. For reliable scanning, keep URLs and text reasonably short — a shortened URL scans more reliably than a long one packed with query parameters." },
            { q: "Can I generate a WiFi-sharing QR code?", a: "Not as a dedicated mode — this tool only ships URL, Text, Email, and Phone types. You can still paste a WiFi network string into the Text field manually if you already know the exact scheme your device expects." },
            { q: "Can I use this to deep-link into a specific screen of my Flutter app?", a: "Yes — put your app's deep link (e.g. myapp://product/42 or a universal/app link URL) into the URL field. Scanning the resulting code opens that link the same way tapping it in a browser or message would, assuming your app has the corresponding route registered." },
            { q: "Why does my download button say 'qr-bidev.png' instead of letting me name the file?", a: "The filename is fixed to keep the download one click with no extra prompt. Rename the file after downloading if you need a different name for your own records." },
          ] },
        ],
      },
    ],
  },

  "json-formatter": {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "API responses logged to a terminal come back as one unreadable line. Config files hand-edited by someone else lose their formatting. A webhook payload from a third-party service arrives minified with no whitespace at all. This exists for exactly those moments, when you need to actually read the structure of a piece of JSON — not just look at a wall of characters — or confirm it's valid before you paste it somewhere that will reject it silently." },
          { kind: "p", text: "Paste JSON and it gets pretty-printed with consistent two-space indentation, or minified down to a single line if you need to paste it somewhere space-constrained, like an environment variable or a curl command. If the JSON is invalid, the error message tells you what broke instead of leaving you to scan the whole payload by eye." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Paste JSON into the input panel — formatting happens automatically as you type.",
            "Check the status badge: valid JSON shows a key and nesting-depth count, invalid JSON shows the parser's error message.",
            "Use Minify to collapse the formatted output to a single line, or leave it pretty-printed.",
            "Copy the result, or hit Clear and start over with the Sample button for a quick example.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "json", label: "Minified in", code: `{"name":"bidev","tools":["qr","json"]}` },
          { kind: "code", lang: "json", label: "Formatted out", code: `{\n  "name": "bidev",\n  "tools": [\n    "qr",\n    "json"\n  ]\n}` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Does this validate against a schema?", a: "No — it only checks that the text is syntactically valid JSON, not that it matches a particular shape or set of required fields." },
            { q: "How does it report where the error is?", a: "It surfaces the underlying JavaScript JSON parser's own error message, which typically names the position or nearby token where parsing failed, rather than re-implementing its own error locator." },
            { q: "Minify vs. format — when should I use which?", a: "Format when you're reading or debugging a payload by eye; minify when you need the smallest possible representation to paste into a space-constrained field like an environment variable." },
            { q: "Is there a size limit?", a: "No hard limit is enforced, but very large payloads (megabytes of JSON) will be slower to parse and format in the browser than a dedicated desktop tool." },
            { q: "What do the key count and depth numbers next to Valid JSON mean?", a: "Key count is the total number of object keys across the whole structure, and depth is how many levels of nesting the deepest branch reaches — both are a quick sanity check that a payload looks like you expect before you build code around it." },
            { q: "Can I use this to compare two JSON payloads?", a: "Not directly — this tool is for formatting and validating one payload at a time. For comparing two API responses field by field, pair it with the API Response Diff Checker on this site." },
          ] },
        ],
      },
    ],
  },

  "password-generator": {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "Reusing the same password, or using one generated by a tool that isn't actually cryptographically random, is how accounts get compromised in bulk. This generator uses the Web Crypto API's crypto.getRandomValues() rather than Math.random(). That distinction matters: Math.random() is a fast, predictable pseudorandom generator meant for things like shuffling a list or picking an animation delay, not for anything security-sensitive, since its output can in some cases be predicted or reconstructed from enough samples. Web Crypto's generator is designed for cryptographic use — the same class of randomness source used to generate session tokens and encryption keys — which is what an actual password needs." },
          { kind: "p", text: "Generation happens entirely in your browser — nothing you generate here is sent to a server, logged, or stored anywhere. Five candidates are generated per click precisely so you aren't anchored to the first result; scan the strength bars and pick the one that fits your target site's requirements." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Set the length with the slider, from 6 to 64 characters.",
            "Toggle uppercase, lowercase, numbers, and symbols independently — at least one must stay on.",
            "Click Generate passwords to produce five options at once.",
            "Check the strength bar under each one, then copy the one you want.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "text", label: "16 characters, all character types on", code: `K4$mPz9!qLw#2Tdx` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Is this actually cryptographically secure?", a: "Yes — it draws its randomness from crypto.getRandomValues(), the same browser API used for generating session tokens and cryptographic keys, not from Math.random()." },
            { q: "Are generated passwords stored or logged anywhere?", a: "No. Everything happens in memory in your browser tab and disappears when you navigate away or close it." },
            { q: "Why does a longer simple password sometimes score higher than a shorter complex one?", a: "Brute-force resistance scales with the total number of possible combinations, which grows fastest with length. A 20-character password using only lowercase letters has a far larger combination space than an 8-character password using every character type." },
            { q: "What's the maximum length supported?", a: "64 characters, set via the length slider." },
            { q: "Why does it refuse to turn off my last remaining character type?", a: "At least one character type must stay enabled, or there's no pool of characters left to draw from — the toggle for your only remaining active type is disabled until you turn another one on first." },
            { q: "Can I require at least one of each selected character type in every password?", a: "Yes — the generator guarantees at least one character from every enabled type is present in each result, then fills the remaining length randomly from the combined pool, so a password with symbols enabled is never missing one just by chance." },
          ] },
        ],
      },
    ],
  },

  base64: {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "Base64 is not encryption and doesn't hide anything from anyone who bothers to decode it; it's a way to represent binary data as plain text so it survives being passed through systems that only handle text safely, like embedding an image in a data URL, or putting a token in an HTTP header. Anyone can decode a Base64 string in one line of code, in any language." },
          { kind: "p", text: "In Flutter/Dart work, this shows up when decoding a JWT's payload (the middle segment of a JWT is Base64Url-encoded JSON), reading a data: URL you copied out of a network request, or checking what's actually inside a Basic Auth header before committing to debugging further down the stack." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Pick Encode or Decode from the mode toggle.",
            "Type or paste your text — the output updates live as you type.",
            "Use Swap to flip the mode and move the current output into the input.",
            "Copy the result once it looks right.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "text", label: "Encode", code: `Input:  Bilal é 日本語\nOutput: QmlsYWwgw6kg5pel5pys6Kqe` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Is Base64 secure or encrypted?", a: "No — it's an encoding, not encryption. Anyone can reverse it instantly with one line of code in any language. Never rely on it to keep data secret." },
            { q: "Why does the encoded output sometimes end in = characters?", a: "Base64 encodes data in 4-character blocks representing 3 bytes at a time; when the input length isn't a multiple of 3, = padding fills out the final block." },
            { q: "Does this handle non-ASCII/Unicode text correctly?", a: "Yes — it encodes the UTF-8 byte representation of your text, so accented characters and non-Latin scripts round-trip correctly rather than getting mangled." },
            { q: "Where does Base64 show up in JWTs specifically?", a: "A JWT's header and payload segments are both Base64Url-encoded JSON — the JWT Decoder tool on this site uses the same underlying encoding to read them." },
            { q: "What's the difference between Base64 and Base64Url?", a: "Base64Url is a URL-safe variant that replaces the + and / characters (which have special meaning in URLs and file paths) with - and _, and typically omits the trailing = padding. This tool implements standard Base64; if you're decoding something Base64Url-encoded like a JWT segment, swap those characters back first." },
            { q: "Why would I ever need to manually decode a Basic Auth header?", a: "An HTTP Basic Auth header is the literal string username:password encoded as Base64 — pasting the header value in here instantly shows you what credentials a request is actually sending, which is useful when debugging why an API call is being rejected as unauthorized." },
          ] },
        ],
      },
    ],
  },

  "uuid-generator": {
    sections: [
      {
        heading: "What a v4 UUID actually is",
        blocks: [
          { kind: "p", text: "A UUID (universally unique identifier) is a 128-bit value formatted as 32 hex digits in five groups, like 550e8400-e29b-41d4-a716-446655440000. Version 4 means it's generated almost entirely from random bits rather than derived from a timestamp or a hardware address, which is why two v4 UUIDs colliding is astronomically unlikely even generated on completely unrelated machines with no coordination." },
        ],
      },
      {
        heading: "Why you'd reach for one",
        blocks: [
          { kind: "p", text: "Primary keys for database rows where you don't want a predictable, guessable, sequential integer ID exposed in a URL. Idempotency keys for API requests, so a retried request doesn't create a duplicate. Temporary file names, test fixture IDs, or any place you need a unique identifier without a central authority handing them out. This tool generates them in bulk and copies to clipboard in one click, either one at a time or the whole batch." },
        ],
      },
    ],
  },

  "jwt-decoder": {
    sections: [
      {
        heading: "What gets decoded, and what doesn't",
        blocks: [
          { kind: "p", text: "A JWT has three Base64Url-encoded segments separated by dots: a header, a payload, and a signature. This tool decodes the header and payload back into readable JSON so you can inspect the claims (expiry, subject, custom fields) directly. It does not, and cannot, verify the signature, since that requires the secret or public key the token was signed with, which never leaves your auth server." },
        ],
      },
      {
        heading: "A decoded token is not a verified token",
        blocks: [
          { kind: "p", text: "This is worth stating plainly: anyone can decode a JWT and read its contents, including an attacker holding a token they didn't legitimately receive. Decoding tells you what a token claims; it says nothing about whether those claims are trustworthy. Verification always has to happen server-side, against the actual signing key, before you trust anything in the payload." },
        ],
      },
      {
        heading: "Common debugging use",
        blocks: [
          { kind: "p", text: "Checking why a token is being rejected as expired (the exp claim is a Unix timestamp, easy to misread), confirming which claims your auth provider actually included, or comparing a token issued in dev against one from production when something behaves differently between environments." },
        ],
      },
    ],
  },

  "regex-tester": {
    sections: [
      {
        heading: "Live matching against real sample text",
        blocks: [
          { kind: "p", text: "Write a pattern and test text side by side, and matches highlight as you type, along with capture groups broken out individually. This matters because regex is notoriously easy to get subtly wrong, a pattern that matches your one example input can fail on the next one, and the only reliable way to catch that is testing against real, varied sample strings, not just staring at the pattern." },
        ],
      },
      {
        heading: "Flags and what they change",
        blocks: [
          { kind: "p", text: "Toggle the common flags, global (match all occurrences instead of stopping at the first), case-insensitive, and multiline (so ^ and $ match the start/end of each line instead of the whole string), and see the match set update immediately. Dart's RegExp class supports the same core syntax as JavaScript's, so a pattern validated here generally carries straight over into Dart code." },
        ],
      },
    ],
  },

  "color-generator": {
    sections: [
      {
        heading: "One seed color, a full palette",
        blocks: [
          { kind: "p", text: "Material 3 builds an app's entire color scheme, primary, secondary, surface, error, and their variants, from a single seed color, rather than requiring you to pick every shade by hand. This tool lets you preview what Flutter's ColorScheme.fromSeed() actually produces from a given hex color before you commit to it in code." },
        ],
      },
      {
        heading: "Copy the exact Flutter snippet",
        blocks: [
          { kind: "p", text: "Pick a seed color and copy a ready-to-use ColorScheme.fromSeed(seedColor: Color(0xFF...)) line straight into your ThemeData. No manual hex-to-Color conversion, no guessing whether the derived tones will actually look right together, since you're previewing the same algorithm Flutter uses internally." },
        ],
      },
    ],
  },

  "dart-data-class-generator": {
    sections: [
      {
        heading: "What makes a Dart class properly immutable",
        blocks: [
          { kind: "p", text: "An immutable data class needs more than final fields. It needs a copyWith method so you can produce a modified copy without mutating the original (essential for state management patterns like Bloc or Riverpod, where state objects should never be mutated in place), a working == operator and hashCode so two instances with the same field values are treated as equal instead of only being equal by reference, and a readable toString for debugging. Writing all of that correctly by hand, especially the equality check across every field, is tedious and easy to get subtly wrong." },
        ],
      },
      {
        heading: "What this generates from your JSON",
        blocks: [
          { kind: "p", text: "Paste a JSON sample and it produces a Dart class with typed final fields inferred from the JSON's actual values, a constructor, copyWith, a value-based == and hashCode covering every field, and toString. No fromJson/toJson serialization is included, since this tool is specifically for the immutable-class shape itself; pair it with the JSON to Dart converter if you also need serialization." },
        ],
      },
    ],
  },
};
