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
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "A UUID (universally unique identifier) is a 128-bit value formatted as 32 hex digits in five groups, like 550e8400-e29b-41d4-a716-446655440000. Version 4 means it's generated almost entirely from random bits rather than derived from a timestamp or a hardware address, which is why two v4 UUIDs colliding is astronomically unlikely even generated on completely unrelated machines with no coordination." },
          { kind: "p", text: "Reach for one as a primary key for database rows where you don't want a predictable, guessable, sequential integer ID exposed in a URL; as an idempotency key for API requests, so a retried request doesn't create a duplicate; or for temporary file names and test fixture IDs where you need a unique identifier without a central authority handing them out." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Set how many UUIDs you want with the count slider, from 1 to 20.",
            "Toggle Uppercase if your downstream system expects uppercase hex digits.",
            "Click Generate to produce the batch using crypto.randomUUID().",
            "Copy one individually, or use Copy all to grab the whole newline-separated batch at once.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "text", label: "A generated v4 UUID", code: `9c858f1e-3b2a-4f7d-8e4a-1d6c5b9a7f3e` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Are v4 UUIDs guaranteed unique?", a: "Not mathematically guaranteed, but the collision probability is astronomically low: with 122 random bits, you'd need to generate roughly a billion UUIDs per second for about 85 years before a 50% chance of a single collision." },
            { q: "Why not just use an auto-increment integer instead?", a: "A sequential integer leaks information — it tells anyone watching how many rows exist and lets them guess adjacent IDs. A UUID carries no such signal and can be generated client-side before a row is even inserted, which simplifies offline-first and distributed systems." },
            { q: "Is this safe to use for session tokens?", a: "Not by itself. A UUID is unique, not secret-strength unpredictable in the way a cryptographic session token needs to be, and it isn't signed or tied to an expiry. Use a dedicated signed token (like a JWT) for authentication; reserve UUIDs for identifiers that don't need to resist a determined guesser." },
            { q: "Does this tool work if crypto.randomUUID() isn't available?", a: "It falls back to a Math.random()-based polyfill in that case, which is extremely rare in any modern browser — crypto.randomUUID() has been supported broadly since 2022." },
            { q: "Why does every v4 UUID have a 4 in the same position?", a: "The version number (4) is encoded directly into the UUID's structure at a fixed position, and the variant bits in the following group are constrained to a small fixed set of values — that's why every v4 UUID has the pattern xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx, where x is fully random and y is restricted to 8, 9, a, or b." },
          ] },
        ],
      },
    ],
  },

  "jwt-decoder": {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "A JWT has three Base64Url-encoded segments separated by dots: a header, a payload, and a signature. This tool decodes the header and payload back into readable JSON so you can inspect the claims (expiry, subject, custom fields) directly, without writing a script just to peek inside a token your app just received." },
          { kind: "p", text: "Does this tool verify the signature? No — and it's worth stating plainly: it cannot, since verification requires the secret or public key the token was signed with, which never leaves your auth server. Anyone can decode a JWT and read its contents, including an attacker holding a token they didn't legitimately receive. Decoding tells you what a token claims; it says nothing about whether those claims are trustworthy. Verification always has to happen server-side, against the actual signing key, before you trust anything in the payload." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Paste the full JWT string (header.payload.signature) into the textarea.",
            "The header and payload decode automatically, with no button to click.",
            "Check the Algorithm, Expires, and Valid/Expired summary bar below the two JSON panels.",
            "Copy either decoded JSON block independently if you need to paste it elsewhere.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "json", label: "Decoded payload of a typical token", code: `{\n  "sub": "user_123",\n  "name": "Bilal Fali",\n  "iat": 1760000000,\n  "exp": 1760003600\n}` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Does this tool verify the signature?", a: "No. It only decodes the header and payload back into readable JSON — it never checks whether the signature is valid, because that requires the signing key, which this tool never has access to." },
            { q: "Can someone steal my token by pasting it here?", a: "Nothing you paste leaves your browser — decoding happens entirely client-side. That said, treat any token-handling tool, including this one, the way you'd treat any clipboard paste of a secret: avoid pasting production tokens into tools you don't control as a general habit." },
            { q: "Why does exp look like a strange number instead of a date?", a: "The exp (and iat) claims are Unix timestamps — seconds since January 1, 1970 — not human-readable dates. This tool converts exp into a readable date and an Expired/Valid badge automatically so you don't have to do that math yourself." },
            { q: "What's the difference between the header and the payload?", a: "The header describes how the token is signed (typically the alg and typ claims); the payload carries the actual claims about the subject — who it's for, when it expires, and any custom data your auth system attached." },
            { q: "Why does the Algorithm shown sometimes say HS256 or RS256?", a: "That value comes straight from the header's alg claim and names the signing algorithm the issuer used — HS256 is a shared-secret HMAC scheme, RS256 is RSA public/private key signing. Knowing which one your backend expects is often the first thing to check when signature verification fails server-side." },
          ] },
        ],
      },
    ],
  },

  "regex-tester": {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "Regex is notoriously easy to get subtly wrong — a pattern that matches your one example input can fail on the next one, and the only reliable way to catch that is testing against real, varied sample strings, not just staring at the pattern until it looks right. This tool writes a pattern and test text side by side, and matches highlight as you type, along with capture groups broken out individually below." },
          { kind: "p", text: "Dart's RegExp class supports the same core syntax as JavaScript's regular expressions, so a pattern validated here generally carries straight over into Dart code with no translation needed." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Type a pattern into the Pattern field, or click one of the quick-pattern presets (Email, URL, Phone).",
            "Toggle flags — Global, Ignore case, Multiline, Dot-all — to change matching behavior.",
            "Edit the test string and watch matches highlight live.",
            "Scroll the match list below to see each match's full text and any capture groups.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "text", label: "Pattern and sample input", code: `Pattern: [\\w.+-]+@[\\w-]+\\.[\\w.-]+\nFlags:   g, i\nInput:   Contact us at hello@bidev.dev or visit https://bidev.dev\nMatch:   hello@bidev.dev` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Does Dart's RegExp support everything tested here?", a: "Dart's RegExp is built on the same core engine family as JavaScript's and supports the same fundamental syntax — character classes, groups, lookaheads, quantifiers, and the flags this tool exposes — so a pattern validated here generally carries over directly." },
            { q: "Why do capture groups show separately from the full match?", a: "A capture group — the part of your pattern wrapped in parentheses — is often the piece you actually want to extract (like the domain out of an email match), so it's broken out from the full matched text to save you writing extra code to pull it out yourself." },
            { q: "What do the flags actually change?", a: "Global finds every match in the string instead of stopping at the first; Ignore case makes letter matching case-insensitive; Multiline makes ^ and $ match the start and end of each line rather than the whole string; Dot-all makes . also match newline characters." },
            { q: "Is there a way to test multiline input?", a: "Yes — the test string textarea accepts multiple lines directly, and the Multiline flag changes how ^ and $ behave against that multi-line text." },
            { q: "What are the quick-pattern presets for?", a: "Email, URL, and Phone are ready-made patterns for the three things developers test most often, so you can start from a working pattern and tweak it rather than writing one from scratch — click any preset to load it into the Pattern field." },
            { q: "Why does my pattern match nothing even though it looks right?", a: "The most common cause is a flag mismatch — forgetting Ignore case when your test text has different capitalization, or forgetting Global so you only ever see the first match. Check the error message area too: an invalid pattern (unbalanced parentheses, a bad escape) shows the regex engine's own syntax error instead of silently matching nothing." },
          ] },
        ],
      },
    ],
  },

  "color-generator": {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "Material 3 builds an app's entire color scheme — primary, secondary, surface, error, and their variants — from a single seed color, rather than requiring you to pick every shade by hand. This tool lets you preview tints and shades derived from a seed color and copy a ready-to-use Flutter snippet, instead of guessing hex values in an editor and rebuilding the app to see how they look." },
          { kind: "p", text: "Pick a seed color and copy a ColorScheme.fromSeed(seedColor: Color(0xFF...)) line straight into your ThemeData. No manual hex-to-Color conversion needed — just paste the snippet and Flutter generates the full tonal palette from it at runtime." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Pick a seed color with the color picker, or type a hex value directly.",
            "Review the six tint/shade swatches generated from that seed for a quick visual reference.",
            "Copy the generated ColorScheme.fromSeed(...) snippet.",
            "Paste it into your ThemeData(colorScheme: ...) in Flutter.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "dart", label: "Generated snippet for #0175C2", code: `ColorScheme.fromSeed(seedColor: Color(0xFF0175C2))` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "What is Material 3 seed-color theming?", a: "Material 3 derives an entire app's color roles (primary, secondary, tertiary, surface, error, and their container/variant pairs) algorithmically from one seed color, so changing a single hex value re-themes the whole app consistently instead of needing every shade picked by hand." },
            { q: "Does the preview exactly match ColorScheme.fromSeed() at runtime?", a: "No — this tool generates a simplified set of tint/shade swatches for a quick visual reference, not Material's exact tonal-palette algorithm. Treat the swatches as a preview, and trust the actual Color(0xFF...) snippet run through Flutter for the real result." },
            { q: "Can I pick a light or dark variant?", a: "Not directly in this tool — ColorScheme.fromSeed() itself takes a brightness parameter (Brightness.light or Brightness.dark) that you set when you use the generated snippet in your ThemeData." },
            { q: "How do I use the copied snippet in ThemeData?", a: "Pass it as the colorScheme argument: ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF0175C2))) — Flutter then derives every color role in the app from that one seed." },
            { q: "Why would I pick a different seed color than my logo's primary color?", a: "Material 3's algorithm is tuned for contrast and accessibility across light and dark themes, which doesn't always map cleanly from a brand color chosen for a static logo. It's common to pick a seed that's close to the brand color but adjusted slightly so the derived tonal palette reads well as both a light and a dark theme." },
            { q: "Can I use this for a non-Flutter project?", a: "The generated swatches are useful as a general color-palette preview for any project, but the copied snippet is Flutter-specific — for other frameworks you'd need to translate the same seed color through that framework's own color-scheme generator." },
          ] },
        ],
      },
    ],
  },

  "dart-data-class-generator": {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "An immutable data class needs more than final fields. It needs a copyWith method so you can produce a modified copy without mutating the original (essential for state management patterns like Bloc or Riverpod, where state objects should never be mutated in place), a working == operator and hashCode so two instances with the same field values are treated as equal instead of only being equal by reference, and a readable toString for debugging. Writing all of that correctly by hand, especially the equality check across every field, is tedious and easy to get subtly wrong — it's easy to forget a field in the equality check after adding it to the class." },
          { kind: "p", text: "Paste a JSON sample and this generates a Dart class with typed final fields inferred from the JSON's actual values, a constructor, copyWith, a value-based == and hashCode covering every field, and toString — all the plumbing an immutable value class needs, without the fromJson/toJson serialization." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Set the class name.",
            "Paste a JSON sample into the input panel.",
            "Click Generate to produce the class.",
            "Copy the result and paste it into your Dart project.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "json", label: "Input", code: `{ "id": 1, "name": "Bilal Fali", "isActive": true }` },
          { kind: "code", lang: "dart", label: "Generated class (excerpt)", code: `class User {\n  const User({\n    required this.id,\n    required this.name,\n    required this.isActive,\n  });\n\n  final int id;\n  final String name;\n  final bool isActive;\n\n  @override\n  bool operator ==(Object other) =>\n      identical(this, other) ||\n      other is User &&\n          other.id == id &&\n          other.name == name &&\n          other.isActive == isActive;\n}` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Why no fromJson/toJson?", a: "This tool is specifically for the immutable-class shape — constructor, copyWith, equality, toString — not JSON serialization. Pair it with the JSON to Dart Converter on this site if you also need fromJson/toJson for the same shape." },
            { q: "How does equality work across nested lists or maps?", a: "The generated == operator compares list and map fields with Dart's default == operator, which for List and Map is reference equality, not deep equality. Two instances holding separately-constructed lists with identical contents will not compare equal — if you need deep list/map equality, wrap those fields with a package like collection's ListEquality, or switch to Freezed." },
            { q: "Does copyWith let me set a field back to null?", a: "No — the generated copyWith uses the common field ?? this.field pattern, where passing null for an argument falls back to the existing value rather than clearing it. Setting a field to null specifically requires a different copyWith pattern (a sentinel value) that this tool doesn't generate." },
            { q: "When should I use this instead of Freezed?", a: "Use this when you want a plain, dependency-free immutable class with no code generation step. Reach for Freezed instead when you need deep equality for free, union types, or you're already running build_runner for other generated code in the project." },
            { q: "Does it handle nested objects?", a: "Yes — a nested object in your sample becomes its own generated class, named after its key, with the same copyWith/equality/toString treatment as the root class. The output lists every generated class, root last." },
          ] },
        ],
      },
    ],
  },

  "json-to-typescript": {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "Hand-writing a TypeScript interface for an API response has the same failure mode as writing one for Dart: it's slow for a payload with a dozen fields, and a typo in a key name or a wrong primitive type doesn't get caught until something downstream breaks. This tool parses the JSON you paste in, infers a TypeScript type for each field, and generates interface or type declarations with optional fields detected automatically." },
          { kind: "p", text: "A nested object in your sample becomes its own named type, and a typed array becomes T[] rather than any[], so the output is as close to what you'd write by hand as the sample data allows." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Paste a sample JSON response into the input panel — with every field populated, since a null sample can't reveal its real type.",
            "Set the root type name.",
            "Choose interface or type from the Output dropdown.",
            "Click Convert, then copy the generated declarations.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "json", label: "Input", code: `{ "id": 1, "name": "Bilal", "middleName": null }` },
          { kind: "code", lang: "typescript", label: "Generated interface", code: `interface User {\n  id: number;\n  name: string;\n  middleName?: null;\n}` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Does my JSON leave the browser?", a: "No — parsing and generation both run client-side in JavaScript, exactly like every other tool on this site." },
            { q: "Does this generate readonly fields?", a: "No, that's out of scope for this tool — every field is generated as a normal mutable property. Add readonly yourself afterward if your project's conventions require it." },
            { q: "interface vs. type — which should I pick?", a: "Both describe the same shape for a plain object and are interchangeable for this use case; pick whichever your codebase already uses. interface supports declaration merging and is the more common choice for object shapes representing API data; type is required if you ever need unions or mapped types layered on top." },
            { q: "How are optional and nullable fields distinguished?", a: "A field that's null in your sample gets a ? (optional) and a null member in its type, since a single sample can't tell you whether the field is sometimes absent, sometimes null, or both — marking it both covers either case safely." },
            { q: "Does it dedupe identical nested shapes into one type?", a: "No — each nested object gets its own type named after its key, even if two different keys happen to produce identically-shaped objects. Rename or merge types by hand afterward if you want to share one type across fields." },
            { q: "What happens with an array that mixes types, like numbers and strings?", a: "A mixed-type array falls back to unknown[] rather than guessing from only the first element, since picking one element's type would silently produce a type that's wrong for the rest of the array's contents." },
          ] },
        ],
      },
    ],
  },

  "arb-validator": {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "Flutter's own build-time tooling checks that each .arb file is valid JSON, but it doesn't flag cross-locale drift clearly: a translator adds a new string to app_fr.arb and forgets to add the matching key to app_en.arb (or vice versa), or renames a placeholder in one locale's message without updating the others — {username} becomes {userName} in French but stays {username} in English. flutter gen-l10n will often still generate code successfully in these cases, and the mismatch only surfaces later as a raw, unreplaced placeholder token showing up on screen in production, or a runtime error when a localization call is missing an argument the generated code expects." },
          { kind: "p", text: "This tool compares one or more translated .arb files against a base locale and reports exactly where they've drifted: keys missing from a locale, keys that exist only in a locale and not in the base, and — this is the part a quick visual diff tends to miss — placeholder names that don't match between locales, including inside ICU plural and select constructs." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Paste or upload your base locale's .arb file (the source of truth — typically your English strings).",
            "Paste or upload one or more other locale files to compare against it, each with its own locale code.",
            "Click Add another locale to check more than one translation at once.",
            "Click Validate — results are grouped by locale, each issue labeled Missing key, Extra key, or Placeholder mismatch.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "json", label: "Base (app_en.arb)", code: `{\n  "@@locale": "en",\n  "greeting": "Hello {name}",\n  "itemCount": "{count, plural, one{1 item} other{{count} items}}"\n}` },
          { kind: "code", lang: "json", label: "Translated (app_fr.arb) — with a renamed placeholder and an extra key", code: `{\n  "@@locale": "fr",\n  "greeting": "Bonjour {prenom}",\n  "itemCount": "{count, plural, one{un article} other{{count} articles}}",\n  "extraKey": "..."\n}` },
          { kind: "code", lang: "text", label: "Reported issues", code: `fr — greeting: Placeholder mismatch (missing: name; extra: prenom)\nfr — extraKey: Extra key` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Does this replace Flutter's build-time ARB validation?", a: "No — flutter gen-l10n checks that each file parses and that it can generate code from it, but it doesn't clearly surface cross-locale drift like a renamed placeholder or a key missing in just one translation. This tool is a targeted check for exactly that gap, run before you commit a translation update, not a replacement for the build step." },
            { q: "Does it support ICU plural and select syntax?", a: "Yes — this is the differentiator. It understands {count, plural, one{...} other{...}} and {value, select, ...} constructs structurally, so it extracts the actual placeholder variable (count, value) correctly instead of misreading a plural branch's literal text (like the French word un inside one{un}) as if it were a placeholder." },
            { q: "Does my translation data leave the browser?", a: "No — parsing and comparison both run entirely client-side in JavaScript. Nothing you paste or upload is sent to a server." },
            { q: "Can I validate more than two locales at once?", a: "Yes — click Add another locale to add as many comparison locales as you need; each gets its own textarea or file upload, and the results list groups issues by locale so you can see at a glance which translations have drifted." },
          ] },
        ],
      },
    ],
  },

  "pubspec-validator": {
    sections: [
      {
        heading: "Why use this tool",
        blocks: [
          { kind: "p", text: "A pubspec.yaml mistake — a typo'd version constraint, a bad indent, a dependency accidentally listed in both dependencies and dev_dependencies — often doesn't surface until flutter pub get fails with an error message that's harder to read than the mistake itself. Pasting the file here catches the same category of mistake instantly, with a plain-language message pointing at the actual dependency or field." },
          { kind: "p", text: "This runs pure static analysis on the YAML and its structure: no network call to pub.dev, no shelling out to the Flutter SDK, nothing that requires your project to even be checked out." },
        ],
      },
      {
        heading: "How it works",
        blocks: [
          { kind: "steps", items: [
            "Paste your pubspec.yaml content, or upload the file directly.",
            "Click Validate.",
            "Review the results — errors in red (YAML syntax, malformed version constraints, missing name), warnings in amber (duplicate dependencies).",
            "Fix the flagged lines in your actual pubspec.yaml and re-run to confirm.",
          ] },
        ],
      },
      {
        heading: "Example",
        blocks: [
          { kind: "code", lang: "yaml", label: "Malformed version constraint", code: `dependencies:\n  http: not-a-version` },
          { kind: "code", lang: "text", label: "Reported issue", code: `Dependency "http" has a malformed version constraint: "not-a-version".` },
        ],
      },
      {
        heading: "FAQ",
        blocks: [
          { kind: "faq", items: [
            { q: "Does this run flutter pub get or hit pub.dev?", a: "No — it's pure static analysis of the YAML you paste in. Nothing leaves your browser, and no network request is made to pub.dev or anywhere else." },
            { q: "What counts as a malformed version constraint?", a: "A plain string value that isn't an exact version (1.2.3), a caret constraint (^1.2.3), a range like '>=1.0.0 <2.0.0', or the literal any is flagged as an error naming the dependency." },
            { q: "Why doesn't it flag my git or path dependency?", a: "Git, path, and hosted-with-version dependencies are declared as YAML maps, not plain version strings — they're intentionally exempt from version-constraint checking, since a git: or path: map is a different, valid shape, not a malformed string." },
            { q: "Does it catch every possible pubspec mistake?", a: "No — it's a fast first-pass check for YAML syntax errors, obviously malformed version strings, and duplicate dependency keys, not a replacement for flutter pub get's own full validation (which also resolves the actual dependency graph against pub.dev)." },
            { q: "What happens with a literal duplicate key, like two 'http:' lines under dependencies?", a: "YAML itself rejects a literal duplicate key in the same mapping — most parsers throw rather than silently picking one. This tool catches that specific case and reports it as a named warning (which dependency, which section) instead of a generic syntax error, so you know exactly what to delete." },
            { q: "Will it flag a dependency that's missing a version constraint entirely?", a: "Not currently — a dependency with no version field at all (just a bare key with a null value, which pub treats as 'any') is left alone, since that's valid pubspec syntax, not a malformed constraint." },
          ] },
        ],
      },
    ],
  },
};
