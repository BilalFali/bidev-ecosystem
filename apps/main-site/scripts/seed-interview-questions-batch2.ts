// One-off seed: adds 50 new interview questions across Flutter Widgets,
// Async Programming, Navigation & Routing, Testing, and deepens Dart/State
// Management/Architecture/Performance/Firebase. Inserted directly into the
// interview_questions table (DB is the source of truth; the static fallback
// array in interview-questions-data.ts is unchanged and only used when
// Supabase is unreachable).
//
//   npx tsx scripts/seed-interview-questions-batch2.ts
//
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

interface Q {
  slug: string;
  question: string;
  category: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  shortAnswer: string;
  explanation: string;
  codeLanguage?: "dart" | "yaml" | "bash";
  code?: string;
  commonMistakes?: string[];
  interviewTips?: string[];
  relatedSlugs?: string[];
  relatedArticleSlugs?: string[];
}

const QUESTIONS: Q[] = [
  // ── Flutter Widgets ──────────────────────────────────────────────────
  {
    slug: "keys-in-flutter",
    question: "What are Keys in Flutter and when do you need one?",
    category: "Flutter Widgets",
    tags: ["widgets", "keys"],
    difficulty: "Intermediate",
    shortAnswer: "A Key preserves a widget's state and identity across rebuilds; you need one whenever Flutter could otherwise confuse two widgets of the same type at the same position, e.g. when reordering a list.",
    explanation: "Flutter's diffing algorithm matches new widgets to old elements primarily by type and position in the tree. When widgets of the same type sit at the same index across a rebuild, Flutter assumes they're the same widget and just updates its properties, reusing the existing State object. This breaks down when a list of stateful widgets gets reordered, inserted into, or removed from — without a Key, Flutter matches by position, not identity, so state can appear to jump between items.\n\nA ValueKey, ObjectKey, or UniqueKey tells Flutter's reconciliation exactly which old element corresponds to which new widget, based on the key's value rather than position. GlobalKey goes further, letting you access a widget's State from anywhere and preserving it even if the widget moves to a completely different part of the tree.",
    codeLanguage: "dart",
    code: "ListView.builder(\n  itemCount: items.length,\n  itemBuilder: (context, index) {\n    final item = items[index];\n    return Dismissible(\n      key: ValueKey(item.id), // not index — id survives reordering\n      onDismissed: (_) => removeItem(item),\n      child: ListTile(title: Text(item.title)),\n    );\n  },\n)",
    commonMistakes: [
      "Using the list index as a Key instead of a stable identifier — this defeats the purpose since the index changes when items are reordered/removed.",
      "Adding GlobalKeys everywhere 'just in case' — they're more expensive and should be reserved for cases that actually need cross-tree state access.",
    ],
    interviewTips: ["Give the Dismissible/reorderable-list example specifically — it's the classic scenario where missing Keys cause visible bugs."],
    relatedSlugs: ["stateless-vs-stateful-widget"],
  },
  {
    slug: "inherited-widget-explained",
    question: "What is InheritedWidget and how does it enable state propagation?",
    category: "Flutter Widgets",
    tags: ["widgets", "inheritedwidget"],
    difficulty: "Advanced",
    shortAnswer: "InheritedWidget lets data be efficiently passed down the widget tree without manually threading it through every constructor, and it's the low-level mechanism Provider, Theme, and MediaQuery are all built on.",
    explanation: "A normal widget passes data to children only via constructor parameters, which gets unwieldy for data needed by many widgets at different depths (theme, locale, app-wide state). InheritedWidget solves this by making itself available to any descendant via context.dependOnInheritedWidgetOfExactType<T>() — the descendant registers as a dependent, and when the InheritedWidget rebuilds with different data, only the widgets that actually depend on it (not the whole subtree) rebuild.\n\nThe key method to override is updateShouldNotify(oldWidget), which decides whether dependents should rebuild — typically comparing the new and old data for equality. This selective-rebuild mechanism is exactly why Theme.of(context) or MediaQuery.of(context) are cheap to call in many widgets: only the ones whose relevant data actually changed re-render.",
    commonMistakes: [
      "Calling dependOnInheritedWidgetOfExactType outside build() without it working as expected — it should be called from build or didChangeDependencies.",
      "Assuming InheritedWidget rebuilds the entire subtree — it only rebuilds registered dependents.",
    ],
    interviewTips: ["Mention that Provider, Theme.of, and MediaQuery.of are all built on InheritedWidget — shows you understand the layering, not just the Provider package in isolation."],
    relatedSlugs: ["what-is-provider"],
  },
  {
    slug: "layoutbuilder-mediaquery-difference",
    question: "What's the difference between LayoutBuilder and MediaQuery for responsive design?",
    category: "Flutter Widgets",
    tags: ["widgets", "responsive"],
    difficulty: "Intermediate",
    shortAnswer: "MediaQuery gives you the entire screen/device's size and metrics; LayoutBuilder gives you the constraints of just the specific widget it wraps, which is what you actually want for responsive decisions inside nested widgets.",
    explanation: "MediaQuery.of(context).size returns the full screen dimensions, useful for app-wide decisions (tablet vs phone layout) but misleading inside a widget that isn't full-screen — a widget inside a 300px-wide side panel has no way to know that from MediaQuery, since it doesn't know about local layout constraints.\n\nLayoutBuilder instead gives you a BoxConstraints object representing exactly how much space the parent has given this specific widget, via its builder callback. This makes it the correct tool for building a widget that adapts to whatever space it's actually placed in, rather than assuming it occupies the full screen.",
    codeLanguage: "dart",
    code: "LayoutBuilder(\n  builder: (context, constraints) {\n    if (constraints.maxWidth < 600) {\n      return const MobileLayout();\n    }\n    return const TabletLayout();\n  },\n)",
    commonMistakes: [
      "Using MediaQuery.of(context).size.width to decide a widget's internal layout when the widget isn't actually full-width.",
      "Rebuilding on every MediaQuery change when only a specific dimension is needed — MediaQuery.of triggers a rebuild on any metric change (including keyboard insets) unless you select just the piece you need.",
    ],
  },
  {
    slug: "form-validation-flutter",
    question: "How do you implement form validation in Flutter?",
    category: "Flutter Widgets",
    tags: ["widgets", "forms"],
    difficulty: "Beginner",
    shortAnswer: "Wrap your fields in a Form widget with a GlobalKey<FormState>, give each TextFormField a validator function, and call formKey.currentState!.validate() to trigger all validators at once.",
    explanation: "The Form widget acts as a container that can validate, save, and reset all of its descendant FormFields (like TextFormField) together. You attach a GlobalKey<FormState> to the Form so you can imperatively call methods on it — most importantly validate(), which runs every field's validator callback and returns true only if all of them return null (no error).\n\nEach TextFormField's validator takes the current value and returns either an error string (shown under the field) or null (valid). onSaved callbacks let you collect all field values in one formKey.currentState!.save() call, convenient for building a data object from many fields at once.",
    codeLanguage: "dart",
    code: "final _formKey = GlobalKey<FormState>();\n\nForm(\n  key: _formKey,\n  child: Column(\n    children: [\n      TextFormField(\n        validator: (value) {\n          if (value == null || value.isEmpty) return 'Required';\n          if (!value.contains('@')) return 'Enter a valid email';\n          return null;\n        },\n      ),\n      ElevatedButton(\n        onPressed: () {\n          if (_formKey.currentState!.validate()) {\n            // all fields valid\n          }\n        },\n        child: const Text('Submit'),\n      ),\n    ],\n  ),\n)",
    commonMistakes: [
      "Forgetting to wrap fields in a Form widget — validator only runs when Form.validate() is called.",
      "Not calling setState() or using autovalidateMode when error messages should update live as the user types.",
    ],
  },
  {
    slug: "slivers-explained",
    question: "What are Slivers in Flutter and when would you use CustomScrollView?",
    category: "Flutter Widgets",
    tags: ["widgets", "slivers"],
    difficulty: "Advanced",
    shortAnswer: "Slivers are scrollable areas that can be composed together inside a CustomScrollView, letting you mix different scroll behaviors — like a collapsing app bar, a grid, and a list — into one continuous scrollable, which a single ListView or GridView can't do.",
    explanation: "A regular ListView or GridView owns its entire scrollable area — you can't easily mix a different kind of scrolling child (like a pinned header) inside it. CustomScrollView instead takes a list of slivers, each understanding how to lay itself out and paint within a shared scroll position: SliverAppBar (collapsing/pinned headers), SliverList, SliverGrid, SliverToBoxAdapter (wrapping a normal widget as a sliver).\n\nThis is the mechanism behind patterns like a large hero image that shrinks into a compact app bar as you scroll — SliverAppBar's flexibleSpace handles exactly that, something awkward or impossible to build cleanly with plain widgets and a single scroll controller.",
    codeLanguage: "dart",
    code: "CustomScrollView(\n  slivers: [\n    SliverAppBar(\n      expandedHeight: 200,\n      flexibleSpace: FlexibleSpaceBar(title: Text('Profile')),\n      pinned: true,\n    ),\n    SliverList(\n      delegate: SliverChildBuilderDelegate(\n        (context, index) => ListTile(title: Text('Item \\$index')),\n        childCount: 20,\n      ),\n    ),\n  ],\n)",
    commonMistakes: [
      "Trying to nest a ListView inside a CustomScrollView without wrapping it appropriately, causing 'unbounded height' errors.",
      "Reaching for CustomScrollView when a single ListView with a header widget would do — it adds complexity only worth it for genuinely mixed scroll behavior.",
    ],
    relatedSlugs: ["listview-builder-optimization"],
  },
  {
    slug: "widget-composition-vs-inheritance",
    question: "Why does Flutter favor composition over inheritance for building widgets?",
    category: "Flutter Widgets",
    tags: ["widgets", "architecture"],
    difficulty: "Intermediate",
    shortAnswer: "Flutter widgets are meant to be combined (composed) into new widgets rather than extended via subclassing, because composition keeps widgets small, reusable, and independently testable — Flutter's own framework widgets are built this way.",
    explanation: "You could subclass ElevatedButton and override its build method, but Flutter's own widgets are deliberately shallow and specific — a Container, for example, is itself just composed internally of Padding, DecoratedBox, and other primitives. The idiomatic pattern for a 'custom button with extra behavior' is to wrap or combine existing widgets into a new one, not extend a concrete widget class.\n\nThis matters practically: composed widgets can mix and match capabilities freely, while inheritance would force a rigid single-parent hierarchy. It also plays well with Flutter's rebuild model — small, focused widgets rebuild cheaply and independently.",
    commonMistakes: [
      "Subclassing StatelessWidget/StatefulWidget solely to extend framework widget behavior, when composing a new widget from existing ones would be idiomatic.",
      "Building a single giant widget class instead of splitting it into smaller composed pieces.",
    ],
    interviewTips: ["Reference that Container itself is a composed widget internally — a concrete example that shows real understanding, not just theory."],
    relatedSlugs: ["flutter-architecture-overview"],
  },
  {
    slug: "hero-animations-flutter",
    question: "How do Hero animations work in Flutter?",
    category: "Flutter Widgets",
    tags: ["widgets", "animations"],
    difficulty: "Intermediate",
    shortAnswer: "A Hero widget with a matching tag on two different screens tells Flutter to automatically animate that widget flying from its position on the first screen to its position on the second during a navigation transition.",
    explanation: "When you push a new route, Flutter searches both the outgoing and incoming page's widget trees for Hero widgets sharing the same tag. If it finds a matching pair, it removes both from their normal positions during the transition and animates a single widget moving and resizing between the two positions and sizes.\n\nThis is why Hero animations feel 'free' — you don't manually compute positions or sizes; Flutter's navigator handles the interpolation as part of the standard page-route transition. It works with any push/pop using a route supporting hero animations (like MaterialPageRoute) — custom transitions may need explicit hero support.",
    codeLanguage: "dart",
    code: "// Screen A\nHero(tag: 'product-1', child: Image.asset('cover.png'))\n\n// Screen B (pushed via Navigator)\nHero(tag: 'product-1', child: Image.asset('cover.png', width: 300))",
    commonMistakes: [
      "Using the same tag for multiple Hero widgets visible on the same screen — tags must be unique per screen or Flutter can't match them correctly.",
      "Expecting Hero to work across routes that don't support the standard page-transition animation.",
    ],
    relatedSlugs: ["flutter-animations-overview"],
  },

  // ── Async Programming ────────────────────────────────────────────────
  {
    slug: "streamcontroller-broadcast-vs-single-subscription",
    question: "What's the difference between a broadcast StreamController and a single-subscription one?",
    category: "Async Programming",
    tags: ["dart", "streams"],
    difficulty: "Intermediate",
    shortAnswer: "A single-subscription StreamController allows only one listener ever, and buffers events until that listener subscribes; a broadcast StreamController allows multiple simultaneous listeners but doesn't buffer events for listeners that subscribe late.",
    explanation: "By default, StreamController() creates a single-subscription stream — appropriate for a one-time file read or a single HTTP response stream. Calling .listen() a second time throws a StateError.\n\nStreamController.broadcast() supports any number of listeners, fitting use cases like a global event bus or a WebSocket connection multiple widgets observe. The tradeoff: broadcast streams don't buffer events — if a listener subscribes after an event was already emitted, it simply misses that event. Choosing the right controller type upfront matters, since converting between them later requires re-architecting how the stream is consumed.",
    codeLanguage: "dart",
    code: "// Single-subscription — one listener only\nfinal controller = StreamController<int>();\n\n// Broadcast — many listeners, no buffering\nfinal broadcastController = StreamController<int>.broadcast();",
    commonMistakes: [
      "Calling .listen() twice on a single-subscription stream and being surprised by the StateError.",
      "Assuming a broadcast stream replays past events to a newly-added listener — it doesn't.",
    ],
    relatedSlugs: ["future-vs-stream"],
  },
  {
    slug: "futurebuilder-common-pitfalls",
    question: "What are the common pitfalls of using FutureBuilder?",
    category: "Async Programming",
    tags: ["widgets", "futures"],
    difficulty: "Intermediate",
    shortAnswer: "The most common FutureBuilder bug is passing a new Future instance on every build (e.g. calling a function directly in the future: parameter), which re-triggers the loading state on every rebuild instead of just once.",
    explanation: "FutureBuilder re-runs its builder whenever the widget rebuilds, but only actually re-fetches if the future instance it's given is a different Future than last time. Writing future: fetchData() directly inside build() creates a brand-new Future object on every rebuild — even ones triggered by unrelated state changes — causing the UI to flash back to a loading spinner repeatedly.\n\nThe fix is to create the Future once (in initState, or a stored state variable) and pass that same stored reference into future: on every build. This is conceptually the same fix as a common useEffect dependency-array mistake in React.",
    codeLanguage: "dart",
    code: "class _MyWidgetState extends State<MyWidget> {\n  late final Future<Data> _future = fetchData(); // created once\n\n  @override\n  Widget build(BuildContext context) {\n    return FutureBuilder<Data>(\n      future: _future, // stable reference across rebuilds\n      builder: (context, snapshot) { /* ... */ return const SizedBox(); },\n    );\n  }\n}",
    commonMistakes: [
      "Calling the async function directly inside the future: parameter on every build.",
      "Not handling ConnectionState.none/waiting/done explicitly, leading to a flash of incorrect UI between states.",
    ],
    interviewTips: ["This is a commonly-asked 'gotcha' — mentioning the new-Future-per-build issue signals real hands-on debugging experience."],
    relatedSlugs: ["future-vs-stream"],
    relatedArticleSlugs: ["flutter-rest-api-dio-riverpod"],
  },
  {
    slug: "dart-completer-explained",
    question: "What is a Completer in Dart and when would you use one?",
    category: "Async Programming",
    tags: ["dart", "futures"],
    difficulty: "Advanced",
    shortAnswer: "A Completer lets you manually create and control a Future, resolving it later with .complete() or .completeError() — useful for wrapping callback-based APIs into a Future-based one.",
    explanation: "Normally you get a Future by calling an async function, but sometimes you need to bridge a callback-style API (a native plugin, an event listener) into Future-based code. Completer<T>() gives you a .future property you can return immediately, and separately, you call .complete(value) (or .completeError(error)) once, whenever the actual result becomes available.\n\nThis pattern is common when wrapping platform channel callbacks, converting a one-off Stream event into a Future, or adding a timeout race to an operation that doesn't natively support one.",
    codeLanguage: "dart",
    code: "Future<String> waitForCallback() {\n  final completer = Completer<String>();\n  someCallbackApi.onResult((result) {\n    completer.complete(result);\n  });\n  return completer.future;\n}",
    commonMistakes: [
      "Calling .complete() more than once on the same Completer — this throws a StateError, since a Future can only resolve once.",
      "Using a Completer when a plain async function would do.",
    ],
    relatedSlugs: ["dart-async-await"],
  },
  {
    slug: "dart-zones-explained",
    question: "What are Zones in Dart used for?",
    category: "Async Programming",
    tags: ["dart", "error-handling"],
    difficulty: "Advanced",
    shortAnswer: "A Zone is an execution context that lets you intercept and customize behaviors like error handling, print output, and timers for all code running within it — most commonly used to catch otherwise-uncaught async errors app-wide.",
    explanation: "Dart's runZonedGuarded() lets you run a block of code (typically your entire main()/runApp() call) inside a zone with a custom error handler, catching errors that would otherwise crash the app silently — particularly errors thrown in async callbacks that aren't wrapped in a try/catch, which a regular try/catch around runApp() wouldn't catch.\n\nThis is the standard pattern for wiring up crash reporting (Firebase Crashlytics, Sentry) so genuinely unhandled async errors still get reported instead of just appearing in the console or crashing silently in release mode.",
    codeLanguage: "dart",
    code: "void main() {\n  runZonedGuarded(() {\n    runApp(const MyApp());\n  }, (error, stackTrace) {\n    // report to Crashlytics/Sentry\n  });\n}",
    commonMistakes: [
      "Assuming a top-level try/catch around runApp() catches all async errors — it doesn't catch errors in callbacks scheduled after the initial synchronous call completes.",
      "Not also setting FlutterError.onError for framework-level errors — runZonedGuarded alone doesn't catch those; both are typically wired together.",
    ],
    interviewTips: ["Mention that runZonedGuarded + FlutterError.onError together is the standard 'catch everything for crash reporting' pattern."],
    relatedSlugs: ["flutter-memory-management"],
  },
  {
    slug: "timer-vs-future-delayed",
    question: "What's the difference between Timer and Future.delayed?",
    category: "Async Programming",
    tags: ["dart", "timers"],
    difficulty: "Beginner",
    shortAnswer: "Future.delayed runs a callback once after a delay and resolves; Timer can either fire once (Timer()) or repeatedly (Timer.periodic()), and importantly gives you a handle you can explicitly cancel.",
    explanation: "Future.delayed(duration, callback) is a one-shot delayed action expressed as a Future — convenient when you just need to await a pause or chain a delayed step into async code. It has no built-in way to cancel it once started.\n\nTimer(duration, callback) does the same one-shot job but returns a Timer object with a .cancel() method, which matters when the delayed action might need to be aborted (e.g. a debounce timer that should reset if the user types again). Timer.periodic(duration, callback) repeats indefinitely until cancelled — the standard tool for polling or a repeating countdown, and one that must be cancelled in dispose() to avoid leaking.",
    codeLanguage: "dart",
    code: "// One-shot, no cancellation needed\nFuture.delayed(const Duration(seconds: 2), () => print('done'));\n\n// Cancellable debounce timer\nTimer? _debounce;\nvoid onSearchChanged(String query) {\n  _debounce?.cancel();\n  _debounce = Timer(const Duration(milliseconds: 300), () => search(query));\n}",
    commonMistakes: [
      "Using Future.delayed for a debounce pattern where you need to cancel a pending call — only Timer can be cancelled.",
      "Forgetting to cancel a Timer.periodic in dispose(), leaking a repeating callback indefinitely.",
    ],
    relatedSlugs: ["flutter-memory-management"],
  },
  {
    slug: "async-generator-functions-dart",
    question: "What are async* generator functions in Dart?",
    category: "Async Programming",
    tags: ["dart", "streams"],
    difficulty: "Advanced",
    shortAnswer: "An async* function is a generator that returns a Stream instead of a Future, letting you yield multiple values over time using the same imperative, sequential-looking code style as a normal async function.",
    explanation: "A regular async function returns a single Future and uses return once. An async* function returns a Stream<T> and can yield a value any number of times, pausing between yields exactly like await pauses a Future — without needing to manually construct a StreamController and call .add() on it.\n\nThis is the cleanest way to write a Stream when values are naturally produced in a loop or sequence — for example, reading lines from a growing log file, or emitting incremental progress updates during a long computation.",
    codeLanguage: "dart",
    code: "Stream<int> countDown(int from) async* {\n  for (int i = from; i > 0; i--) {\n    await Future.delayed(const Duration(seconds: 1));\n    yield i;\n  }\n}\n\n// Usage\nawait for (final n in countDown(3)) {\n  print(n); // 3, 2, 1 — one per second\n}",
    commonMistakes: [
      "Reaching for a manual StreamController when an async* generator would express the same logic more simply.",
      "Forgetting yield* (yield-each) is needed to delegate to another Stream inside an async* function, versus plain yield for a single value.",
    ],
    relatedSlugs: ["future-vs-stream"],
  },

  // ── Navigation & Routing ─────────────────────────────────────────────
  {
    slug: "navigator-1-vs-navigator-2",
    question: "What's the difference between Navigator 1.0 and Navigator 2.0?",
    category: "Navigation & Routing",
    tags: ["navigation"],
    difficulty: "Advanced",
    shortAnswer: "Navigator 1.0 is imperative — you push/pop routes as commands; Navigator 2.0 is declarative — you describe the current stack of pages as a list derived from app state, which is what enables deep linking and browser back-button support to work correctly.",
    explanation: "With Navigator 1.0's Navigator.push()/Navigator.pop(), the navigation stack is built up imperatively as a side effect of your code running — there's no single source of truth describing 'what the stack currently looks like,' making browser URLs, deep links, and state restoration awkward since you'd need to manually replay a sequence of pushes to reach an arbitrary state.\n\nNavigator 2.0 introduces Router, RouterDelegate, and RouteInformationParser: you maintain your own app state, and the Navigator widget's pages list is derived from that state declaratively. This makes it possible to jump directly to a deep-linked state, since the pages list can be constructed for any given URL without replaying pushes.\n\nIn practice, most apps use go_router (built on Navigator 2.0) rather than the raw API directly, since it hides most of the boilerplate behind a simpler declarative route table.",
    commonMistakes: [
      "Believing Navigator 2.0 replaced Navigator 1.0 — the imperative push/pop API still works and is fine for apps that don't need deep linking/URL sync.",
      "Hand-rolling raw Navigator 2.0 for a simple app instead of reaching for go_router.",
    ],
    interviewTips: ["Mention go_router specifically — most real-world Flutter apps use it rather than raw Navigator 2.0."],
    relatedSlugs: ["go-router-basics"],
  },
  {
    slug: "go-router-basics",
    question: "How does go_router simplify navigation in Flutter?",
    category: "Navigation & Routing",
    tags: ["navigation", "go_router"],
    difficulty: "Intermediate",
    shortAnswer: "go_router lets you define your app's routes as a declarative table mapping URL paths to pages, handling deep linking, web URL sync, and nested/shell routes without writing raw Navigator 2.0 boilerplate.",
    explanation: "You define a GoRouter with a list of GoRoute entries, each specifying a path and a builder returning the page widget for that path — including path parameters (/users/:id) and query parameters, both accessible via state. Navigating is as simple as context.go('/users/5') or context.push('/settings'), and go_router keeps the browser URL in sync automatically on Flutter Web.\n\nIt also supports ShellRoute for persistent UI (like a bottom nav bar that stays while inner content changes) and redirect logic (e.g. redirecting to login if unauthenticated), both notoriously fiddly to implement correctly with raw Navigator 2.0.",
    codeLanguage: "dart",
    code: "final router = GoRouter(\n  routes: [\n    GoRoute(path: '/', builder: (context, state) => const HomeScreen()),\n    GoRoute(\n      path: '/users/:id',\n      builder: (context, state) {\n        final id = state.pathParameters['id']!;\n        return UserScreen(userId: id);\n      },\n    ),\n  ],\n);\n\n// Navigate\ncontext.go('/users/5');",
    commonMistakes: [
      "Mixing go_router navigation with raw Navigator.push in the same app inconsistently, causing confusing back-stack behavior.",
      "Not using redirect for auth guarding and instead manually checking auth state in every screen's initState.",
    ],
    relatedSlugs: ["navigator-1-vs-navigator-2"],
  },
  {
    slug: "named-routes-vs-materialpageroute",
    question: "Should you use named routes or MaterialPageRoute directly?",
    category: "Navigation & Routing",
    tags: ["navigation"],
    difficulty: "Beginner",
    shortAnswer: "Named routes work well for simple, static navigation with no arguments; MaterialPageRoute pushed directly is more flexible for passing complex objects — though most new apps reach for go_router instead of either.",
    explanation: "Navigator.pushNamed(context, '/details') looks up a route by string name in a table defined in MaterialApp(routes: {...}). It's concise, but passing data requires either a generic arguments object (losing compile-time type safety) or global state.\n\nNavigator.push(context, MaterialPageRoute(builder: (context) => DetailScreen(item: item))) passes strongly-typed data directly as a constructor parameter, safer and easier to refactor, at the cost of slightly more verbose call sites. For apps beyond a handful of screens, most teams now skip both in favor of go_router's typed path/query parameters.",
    commonMistakes: [
      "Passing complex objects through named routes' arguments as Object? and casting them unsafely in the destination screen.",
      "Registering every screen as a named route even when the app never needs deep linking or URL-based navigation.",
    ],
    relatedSlugs: ["go-router-basics"],
  },
  {
    slug: "deep-linking-flutter",
    question: "How does deep linking work in Flutter?",
    category: "Navigation & Routing",
    tags: ["navigation", "deep-linking"],
    difficulty: "Advanced",
    shortAnswer: "Deep linking means the OS can open your app directly to a specific screen from an external URL or link tap, requiring platform-level configuration (Android intent filters, iOS Universal Links) in addition to in-app routing logic mapping the incoming URL to the right screen.",
    explanation: "On Android, you declare an intent-filter in AndroidManifest.xml specifying the scheme/host your app should handle (either a custom scheme like myapp:// or, for Android App Links, https://yourdomain.com with domain verification via a hosted assetlinks.json file). On iOS, Universal Links require an associated domain entitlement plus a hosted apple-app-site-association file proving domain ownership — without it, iOS won't route the link to your app.\n\nOnce the OS hands the URL to your app, your routing layer (commonly go_router, which has built-in deep-link support) parses the incoming path and navigates to the corresponding screen — the in-app part is the easy half; platform-level domain verification is usually where deep linking actually breaks in practice.",
    commonMistakes: [
      "Testing only custom URL schemes and assuming https Universal Links/App Links will work the same way — they require separate domain verification setup.",
      "Forgetting to host the required verification file at the exact expected path on the domain, which silently breaks App Links/Universal Links.",
    ],
    interviewTips: ["Distinguish custom URL schemes (simpler, no domain verification) from Universal Links/App Links (require hosted verification files)."],
    relatedSlugs: ["go-router-basics"],
  },
  {
    slug: "nested-navigation-flutter",
    question: "How do you implement nested navigation in Flutter (e.g. a bottom nav bar with separate stacks per tab)?",
    category: "Navigation & Routing",
    tags: ["navigation"],
    difficulty: "Advanced",
    shortAnswer: "Give each tab its own Navigator with a unique key, so each tab maintains an independent back stack, and wrap it in an IndexedStack to preserve each tab's state when switching between them.",
    explanation: "A naive bottom-nav implementation swaps the body widget based on the selected index, resetting each tab's navigation state (and scroll position) every time you switch away and back. The fix: give each tab its own Navigator (each with a distinct GlobalKey<NavigatorState>), nested inside an IndexedStack (which keeps all tabs' widget trees alive, just hidden) — so switching tabs doesn't rebuild or reset them.\n\ngo_router's StatefulShellRoute is the modern, purpose-built solution for exactly this pattern, handling the multiple-Navigator-plus-IndexedStack wiring for you.",
    codeLanguage: "dart",
    code: "IndexedStack(\n  index: currentTabIndex,\n  children: [\n    Navigator(key: tab1NavigatorKey, onGenerateRoute: onGenerateRoute1),\n    Navigator(key: tab2NavigatorKey, onGenerateRoute: onGenerateRoute2),\n  ],\n)",
    commonMistakes: [
      "Using a plain Stack/conditional widget swap for bottom-nav tabs instead of IndexedStack, causing each tab's state and scroll position to reset on every switch.",
      "Sharing a single Navigator across all tabs, so pushing a screen in one tab affects the whole app's back button behavior instead of just that tab.",
    ],
    relatedSlugs: ["go-router-basics"],
  },
  {
    slug: "passing-data-back-with-pop",
    question: "How do you return data from a screen when popping it?",
    category: "Navigation & Routing",
    tags: ["navigation"],
    difficulty: "Beginner",
    shortAnswer: "Pass a value to Navigator.pop(context, value), and await the result of the original Navigator.push call — the awaited Future resolves with whatever value was passed to pop.",
    explanation: "Navigator.push returns a Future that doesn't resolve until the pushed route is popped. If you await that push call, and the pushed screen calls Navigator.pop(context, someValue) instead of just Navigator.pop(context), the awaited Future resolves with someValue — a clean, typed way to get a result back from a screen without callbacks or global state.",
    codeLanguage: "dart",
    code: "// Caller\nfinal result = await Navigator.push<String>(\n  context,\n  MaterialPageRoute(builder: (context) => const PickerScreen()),\n);\nif (result != null) print('Picked: \\$result');\n\n// PickerScreen\nNavigator.pop(context, 'selected-value');",
    commonMistakes: [
      "Forgetting to specify the generic type on Navigator.push<T>, causing the awaited result to be typed as dynamic/Object? unnecessarily.",
      "Not handling the null case when the user backs out without picking anything — pop() with no argument resolves the Future with null.",
    ],
  },
  {
    slug: "willpopscope-vs-popscope",
    question: "How do you intercept the back button in Flutter?",
    category: "Navigation & Routing",
    tags: ["navigation"],
    difficulty: "Intermediate",
    shortAnswer: "Wrap the screen in a PopScope widget (the modern replacement for the deprecated WillPopScope), setting canPop to false and handling the back attempt in the pop callback — commonly used for an 'unsaved changes' confirmation dialog.",
    explanation: "WillPopScope's onWillPop callback returned a Future<bool> deciding whether the pop should proceed — but it was deprecated because it didn't compose well with Navigator 2.0's declarative model and predictive back gestures on Android. PopScope replaces it: set canPop: false to prevent the default pop, and inspect the pop attempt in its callback, from which you can show a confirmation dialog and call Navigator.pop() manually if the user confirms.",
    codeLanguage: "dart",
    code: "PopScope(\n  canPop: false,\n  onPopInvokedWithResult: (didPop, result) async {\n    if (didPop) return;\n    final shouldPop = await showConfirmDialog(context);\n    if (shouldPop && context.mounted) Navigator.pop(context);\n  },\n  child: const EditScreen(),\n)",
    commonMistakes: [
      "Still using the deprecated WillPopScope in new code instead of PopScope.",
      "Setting canPop: false without ever actually popping programmatically afterward, permanently trapping the user on the screen.",
    ],
  },

  // ── Testing ──────────────────────────────────────────────────────────
  {
    slug: "flutter-widget-testing-basics",
    question: "How do you write a basic widget test in Flutter?",
    category: "Testing",
    tags: ["testing"],
    difficulty: "Beginner",
    shortAnswer: "Use testWidgets() with a WidgetTester, pump your widget with tester.pumpWidget(), then use finders (like find.text or find.byType) combined with matchers (like findsOneWidget) to assert on what's rendered.",
    explanation: "Widget tests run in a simulated environment (no real device needed) and are faster than full integration tests while still testing actual widget rendering and interaction, unlike pure unit tests. tester.pumpWidget(widget) builds the widget tree; tester.pump() advances a single frame (needed after state changes); tester.pumpAndSettle() repeatedly pumps until no more frames are scheduled, useful for animations to finish.\n\nfind.text('Login'), find.byType(ElevatedButton), and find.byKey(someKey) locate widgets, and expect(finder, findsOneWidget) (or findsNothing, findsNWidgets(n)) asserts on what's present.",
    codeLanguage: "dart",
    code: "testWidgets('shows error on empty submit', (tester) async {\n  await tester.pumpWidget(const MaterialApp(home: LoginScreen()));\n\n  await tester.tap(find.text('Submit'));\n  await tester.pump();\n\n  expect(find.text('Email is required'), findsOneWidget);\n});",
    commonMistakes: [
      "Forgetting to wrap the widget under test in a MaterialApp, causing errors about missing Directionality/Theme ancestors.",
      "Using tester.pump() when tester.pumpAndSettle() is needed (e.g. after a navigation transition or animation), leading to flaky assertions.",
    ],
  },
  {
    slug: "mocking-with-mocktail",
    question: "How do you mock dependencies in Flutter tests?",
    category: "Testing",
    tags: ["testing", "mocking"],
    difficulty: "Intermediate",
    shortAnswer: "Use the mocktail package (or mockito) to create a fake implementation of a class/interface, stub its methods with when().thenAnswer(), and inject the mock wherever the real dependency would normally be provided.",
    explanation: "For a class under test that depends on a repository or API client, you don't want your unit test making real network calls. mocktail lets you write class MockUserRepository extends Mock implements UserRepository {}, then stub specific method calls with when(() => mock.getUser(any())).thenAnswer((_) async => testUser).\n\nThe class under test then receives the mock via constructor injection — exactly why dependency injection matters for testability — and you can assert on how it was called with verify(() => mock.getUser('123')).called(1).",
    codeLanguage: "dart",
    code: "class MockUserRepository extends Mock implements UserRepository {}\n\nvoid main() {\n  late MockUserRepository mockRepo;\n\n  setUp(() {\n    mockRepo = MockUserRepository();\n  });\n\n  test('returns user from repository', () async {\n    when(() => mockRepo.getUser('1')).thenAnswer((_) async => User(id: '1', name: 'Ana'));\n\n    final result = await mockRepo.getUser('1');\n\n    expect(result.name, 'Ana');\n    verify(() => mockRepo.getUser('1')).called(1);\n  });\n}",
    commonMistakes: [
      "Testing a class that constructs its own dependencies internally instead of receiving them via constructor injection — this makes mocking impossible without refactoring.",
      "Forgetting to register a fallback value for custom argument types when using any() with mocktail, which throws at runtime.",
    ],
    relatedSlugs: ["dependency-injection-flutter"],
  },
  {
    slug: "golden-tests-flutter",
    question: "What are golden tests in Flutter?",
    category: "Testing",
    tags: ["testing"],
    difficulty: "Advanced",
    shortAnswer: "Golden tests render a widget and compare a screenshot of it pixel-for-pixel against a previously-approved reference image ('golden file'), catching unintended visual regressions that logic-based widget tests can't detect.",
    explanation: "A normal widget test checks things like 'does this text exist' — it says nothing about whether the widget actually looks right. matchesGoldenFile() in a widget test renders the widget, captures it as an image, and compares it byte-for-byte against a stored PNG. The first run generates the golden file (via flutter test --update-goldens); subsequent runs fail if rendering has changed, requiring a human to review whether the change was intentional or a real regression.\n\nGolden tests are sensitive to font rendering and platform differences, so teams typically run them in CI on a consistent environment to avoid false failures.",
    codeLanguage: "dart",
    code: "testWidgets('button matches golden', (tester) async {\n  await tester.pumpWidget(const MaterialApp(home: MyButton()));\n  await expectLater(\n    find.byType(MyButton),\n    matchesGoldenFile('goldens/my_button.png'),\n  );\n});",
    commonMistakes: [
      "Running golden tests locally on a different OS/font setup than CI, causing constant false failures from anti-aliasing differences.",
      "Blindly re-generating goldens without reviewing the visual diff first — this can silently accept a real regression.",
    ],
  },
  {
    slug: "integration-test-package",
    question: "What is the integration_test package used for?",
    category: "Testing",
    tags: ["testing"],
    difficulty: "Intermediate",
    shortAnswer: "integration_test runs your app as a whole on a real device or emulator, driving it through full user flows end-to-end — unlike widget tests, which run in a simulated environment without a real platform underneath.",
    explanation: "Widget tests are fast but don't exercise real platform channels, real plugins, or actual device behavior. integration_test (Flutter's official successor to flutter_driver) runs your actual compiled app on a real or emulated device, using the same WidgetTester API as widget tests but backed by real app and platform integration — so a test can genuinely tap through login, fetch data, and navigate multiple real screens.\n\nThese tests are slower and more brittle than widget tests, so most teams use a testing pyramid: many unit tests, a good number of widget tests, and a smaller set of integration tests covering only the most critical user flows.",
    commonMistakes: [
      "Trying to replace all widget tests with integration tests — they're much slower and better reserved for a handful of critical end-to-end flows.",
      "Not accounting for real network/animation timing, leading to flaky integration tests.",
    ],
    relatedSlugs: ["flutter-widget-testing-basics"],
  },
  {
    slug: "testing-riverpod-providers",
    question: "How do you test code that uses Riverpod providers?",
    category: "Testing",
    tags: ["testing", "riverpod"],
    difficulty: "Intermediate",
    shortAnswer: "Wrap the widget or logic under test in a ProviderScope with overrides — swapping real providers for test doubles via overrideWith or overrideWithValue — so tests never hit real network/database calls.",
    explanation: "Riverpod's ProviderScope accepts an overrides list, letting you replace any provider with a fake implementation just for that scope. For a repository provider: overrides: [userRepositoryProvider.overrideWithValue(mockRepo)]. For an AsyncNotifierProvider with its own async logic, overrideWith lets you substitute the whole provider's implementation.\n\nThis makes it possible to test a widget's behavior across loading/data/error states deterministically, by overriding a provider to immediately return each state, rather than depending on real timing from an actual async call.",
    codeLanguage: "dart",
    code: "testWidgets('shows user name when loaded', (tester) async {\n  await tester.pumpWidget(\n    ProviderScope(\n      overrides: [\n        userRepositoryProvider.overrideWithValue(MockUserRepository()),\n      ],\n      child: const MaterialApp(home: ProfileScreen()),\n    ),\n  );\n  await tester.pumpAndSettle();\n  expect(find.text('Ana'), findsOneWidget);\n});",
    commonMistakes: [
      "Using overrideWithValue for a provider whose behavior (not just its value) needs to change between tests — overrideWith gives a full replacement implementation.",
      "Forgetting that a fresh ProviderScope is needed per test to avoid state leaking between tests.",
    ],
    relatedSlugs: ["riverpod-vs-provider"],
    relatedArticleSlugs: ["flutter-state-management-provider-vs-riverpod-vs-bloc"],
  },
  {
    slug: "testing-bloc-cubit",
    question: "How do you unit test a Bloc or Cubit?",
    category: "Testing",
    tags: ["testing", "bloc"],
    difficulty: "Intermediate",
    shortAnswer: "Use the bloc_test package's blocTest() helper, which lets you set up a Bloc, feed it events (or call Cubit methods), and assert on the exact sequence of emitted states — without needing any widget tree at all.",
    explanation: "Because Blocs and Cubits are pure Dart classes with no Flutter dependency, they're naturally easy to unit test — no pumpWidget or WidgetTester needed. bloc_test's blocTest() reduces the boilerplate of the arrange-act-assert pattern: a build function creating the Bloc, an act function dispatching events, and an expect function returning the list of states you expect to be emitted, in order.",
    codeLanguage: "dart",
    code: "blocTest<CounterBloc, int>(\n  'emits [1] when Increment is added',\n  build: () => CounterBloc(),\n  act: (bloc) => bloc.add(Increment()),\n  expect: () => [1],\n);",
    commonMistakes: [
      "Testing Blocs by manually subscribing to the stream and asserting outside blocTest, reinventing what the helper already does more concisely.",
      "Forgetting that blocTest's expect checks the states emitted during act, not the full history including the initial state.",
    ],
    relatedSlugs: ["bloc-pattern-explained"],
  },
  {
    slug: "pump-vs-pumpandsettle",
    question: "What's the difference between tester.pump() and tester.pumpAndSettle()?",
    category: "Testing",
    tags: ["testing"],
    difficulty: "Beginner",
    shortAnswer: "pump() advances the clock by one frame (or a given duration); pumpAndSettle() repeatedly pumps frames until there are no more scheduled frames, which is more convenient but can hang or time out if something schedules frames indefinitely.",
    explanation: "After an action like tapping a button, Flutter doesn't rebuild synchronously — you need to pump() to process the resulting frame. For a single state update, one pump() is enough. For anything involving animation or a transition, you'd need many pumps to reach the final settled state — pumpAndSettle() automates that by looping pump() calls until no new frames are scheduled.\n\nThe catch: pumpAndSettle() will throw a timeout if something keeps scheduling frames indefinitely, such as an infinitely-repeating animation (a loading spinner) — in that case you must use explicit pump(duration) calls instead.",
    commonMistakes: [
      "Always reaching for pumpAndSettle() out of habit, then getting a confusing timeout on a screen with an infinite/repeating animation.",
      "Using a single pump() when a multi-step animation/transition genuinely needs multiple frames to reach its final state.",
    ],
    relatedSlugs: ["flutter-widget-testing-basics"],
  },
  {
    slug: "test-coverage-flutter",
    question: "How do you measure test coverage in a Flutter project?",
    category: "Testing",
    tags: ["testing"],
    difficulty: "Beginner",
    shortAnswer: "Run flutter test --coverage to generate a lcov.info file, then use a tool like genhtml (from lcov) or an editor extension to turn it into a readable report showing exactly which lines are covered.",
    explanation: "flutter test --coverage runs your whole test suite and outputs coverage/lcov.info in the standard lcov format, which most CI coverage tools (Codecov, Coveralls) and local viewers understand natively. To view it as an HTML report locally: genhtml coverage/lcov.info -o coverage/html, then open coverage/html/index.html.\n\nCoverage percentage is a useful signal but not a goal in itself — 100% line coverage doesn't guarantee correctness, so it's best used to find obviously-untested code paths rather than as a strict quality gate.",
    commonMistakes: [
      "Treating a high coverage percentage as proof of correctness rather than just 'this code executed during some test.'",
      "Not excluding generated files (*.g.dart, *.freezed.dart) from coverage reports, which skews the percentage misleadingly low.",
    ],
  },

  // ── Dart Questions (deepen) ──────────────────────────────────────────
  {
    slug: "dart-records",
    question: "What are Records in Dart and when would you use one?",
    category: "Dart Questions",
    tags: ["dart", "records"],
    difficulty: "Intermediate",
    shortAnswer: "A Record is a built-in, anonymous, immutable data structure that groups multiple values together — useful for returning multiple values from a function without declaring a dedicated class.",
    explanation: "Before Records (Dart 3), returning 'two values' from a function meant either creating a small class, using a List/Map (losing type safety), or a Tuple package. Records solve this natively: (int, String) parseEntry() => (200, 'OK'); returns a record you can destructure with pattern matching: final (code, message) = parseEntry();\n\nRecords also support named fields — ({int code, String message}) — for clarity when position alone isn't descriptive. Unlike classes, Records are structurally typed and compared by value, not identity, making them convenient for lightweight groupings that don't need custom behavior or identity semantics.",
    codeLanguage: "dart",
    code: "(double, double) minMax(List<double> values) {\n  return (values.reduce(min), values.reduce(max));\n}\n\nfinal (lowest, highest) = minMax([3, 1, 4, 1, 5]);\nprint('Range: \\$lowest to \\$highest');",
    commonMistakes: [
      "Reaching for a Record when a proper class with named, semantically meaningful fields and methods would communicate intent better.",
      "Forgetting Records are compared structurally by value, which is usually desired but can surprise if identity was expected.",
    ],
  },
  {
    slug: "dart-sealed-classes-pattern-matching",
    question: "What are sealed classes in Dart and how do they enable exhaustive pattern matching?",
    category: "Dart Questions",
    tags: ["dart", "pattern-matching"],
    difficulty: "Advanced",
    shortAnswer: "A sealed class restricts which classes can extend/implement it to only those defined in the same library, letting the compiler verify a switch statement handles every possible subtype — catching missing cases at compile time instead of runtime.",
    explanation: "Before sealed classes, an abstract class could be extended anywhere, so a switch over its subtypes could never be proven exhaustive by the compiler — you always needed a default case, even after covering every known subtype, because a new one could appear from an unrelated file.\n\nDeclaring sealed class Result<T> {} with subclasses Success<T> and Failure<T> in the same file tells the compiler that's the complete set. A switch (result) { Success(:final data) => ..., Failure(:final error) => ... } is then exhaustive — if a third subclass is added later and a case is missed, the compiler errors immediately instead of silently falling through at runtime. This is the modern Dart-native alternative to encoding a result-or-error union type, replacing patterns that previously needed the freezed package.",
    codeLanguage: "dart",
    code: "sealed class Result<T> {}\nclass Success<T> extends Result<T> { final T data; Success(this.data); }\nclass Failure<T> extends Result<T> { final String error; Failure(this.error); }\n\nString describe(Result<int> result) => switch (result) {\n  Success(:final data) => 'Got \\$data',\n  Failure(:final error) => 'Error: \\$error',\n}; // exhaustive — no default needed",
    commonMistakes: [
      "Adding a redundant default case to an already-exhaustive sealed-class switch, defeating the compiler's ability to catch a missed case later.",
      "Confusing sealed with abstract — sealed additionally restricts subclassing to the same library.",
    ],
    interviewTips: ["Mention this reduces the need for the freezed package's union-type codegen for simple cases."],
  },
  {
    slug: "dart-late-keyword",
    question: "What does the late keyword do in Dart, and what's a common mistake with it?",
    category: "Dart Questions",
    tags: ["dart", "null-safety"],
    difficulty: "Beginner",
    shortAnswer: "late tells the compiler a non-nullable variable will definitely be assigned before use, even though it can't verify that at compile time — deferring the null-safety check to runtime, where accessing it before assignment throws a LateInitializationError.",
    explanation: "Sound null safety normally requires the compiler to prove a non-nullable variable is initialized before use. Sometimes that's genuinely not knowable at compile time — e.g. a controller initialized in initState() rather than at declaration. late is an escape hatch: you promise the variable will be set before any read, and the compiler trusts you instead of proving it.\n\nThe common mistake is using late as a workaround to silence a null-safety error without actually guaranteeing initialization happens first — this converts a compile-time safety net into a runtime crash (LateInitializationError) if the assumption is wrong.",
    codeLanguage: "dart",
    code: "class _MyWidgetState extends State<MyWidget> {\n  late final AnimationController _controller;\n\n  @override\n  void initState() {\n    super.initState();\n    _controller = AnimationController(vsync: this); // set before any read\n  }\n}",
    commonMistakes: [
      "Using late to suppress a null-safety compiler error without verifying the initialization ordering actually holds.",
      "Using late for a value that's genuinely optional — it should be nullable (T?) instead.",
    ],
    relatedSlugs: ["dart-null-safety"],
  },
  {
    slug: "dart-factory-constructors",
    question: "What is a factory constructor in Dart and when would you use one?",
    category: "Dart Questions",
    tags: ["dart", "constructors"],
    difficulty: "Intermediate",
    shortAnswer: "A factory constructor can return an existing instance instead of always creating a new one, or return a subtype — useful for caching/singleton patterns and for fromJson constructors that might return different subclasses based on the data.",
    explanation: "A normal constructor always creates a new instance of exactly its own class. A factory constructor is a static-like method that must return some instance of the type (or a subtype), giving you control over instantiation — you could return a cached instance, look one up from a pool, or decide which of several subclasses to instantiate based on input.\n\nThe most common real-world use is a fromJson factory on a class hierarchy: factory Shape.fromJson(json) => switch (json['type']) { 'circle' => Circle.fromJson(json), ... } — something a regular constructor can't do, since it could never return a different subclass instance.",
    codeLanguage: "dart",
    code: "class Logger {\n  static final Map<String, Logger> _cache = {};\n\n  factory Logger(String name) {\n    return _cache.putIfAbsent(name, () => Logger._internal(name));\n  }\n\n  Logger._internal(this.name);\n  final String name;\n}",
    commonMistakes: [
      "Assuming factory constructors can access this like a normal constructor — they can't, since they might not even create a new instance.",
      "Overusing the singleton-via-factory pattern for things that would be simpler and more testable as an injected dependency.",
    ],
  },
  {
    slug: "dart-generics-explained",
    question: "How do generics work in Dart and why are they useful?",
    category: "Dart Questions",
    tags: ["dart", "generics"],
    difficulty: "Intermediate",
    shortAnswer: "Generics let a class or function be written once and work with any type, while still giving compile-time type safety — List<String> and List<int> are both Lists, but the compiler prevents mixing types into either.",
    explanation: "Without generics, a collection would either be locked to one specific type or typed as dynamic/Object (losing compile-time safety, requiring casts everywhere). class Box<T> { T value; Box(this.value); } lets Box<int> and Box<String> share one implementation while the compiler still enforces that a Box<int>'s value is always an int.\n\nGeneric bounds (class NumberBox<T extends num> {}) further restrict which types are valid, letting you call methods specific to that bound inside the generic class body.",
    codeLanguage: "dart",
    code: "class Repository<T> {\n  final List<T> _items = [];\n  void add(T item) => _items.add(item);\n  List<T> getAll() => List.unmodifiable(_items);\n}\n\nfinal userRepo = Repository<User>();\nuserRepo.add(User(name: 'Ana')); // type-checked at compile time",
    commonMistakes: [
      "Using dynamic instead of a proper generic type parameter, silently losing compile-time type checking.",
      "Not adding a bound (extends) when the generic type needs to support specific operations, then working around it with unsafe casts.",
    ],
  },

  // ── State Management (deepen) ────────────────────────────────────────
  {
    slug: "riverpod-code-generation",
    question: "What does Riverpod's code generation (@riverpod annotation) add over manually-declared providers?",
    category: "State Management",
    tags: ["riverpod"],
    difficulty: "Intermediate",
    shortAnswer: "The @riverpod annotation (via riverpod_generator) generates the provider boilerplate for you from a plain function or class, reducing verbosity and catching more mistakes at compile time, at the cost of needing a code-generation build step.",
    explanation: "Manually declaring final userProvider = FutureProvider<User>((ref) => fetchUser()); works fine, but as an app grows, choosing the right provider type for each case adds boilerplate. With @riverpod, you write a plain annotated function: @riverpod Future<User> user(UserRef ref) => fetchUser(); and the generator produces the correctly-typed provider automatically, inferring the right variant from your function's return type.\n\nThe practical gotcha: this requires running dart run build_runner watch --delete-conflicting-outputs during development so generated .g.dart files stay in sync — forgetting this leaves you editing a provider whose generated code is stale, causing confusing type errors unrelated to your actual change.",
    codeLanguage: "dart",
    code: "// user_provider.dart\npart 'user_provider.g.dart';\n\n@riverpod\nFuture<User> user(UserRef ref) async {\n  return ref.watch(userRepositoryProvider).getUser();\n}",
    commonMistakes: [
      "Forgetting to run build_runner in watch mode during development, then being confused by type errors referencing outdated generated code.",
      "Committing the generated .g.dart files inconsistently across a team without a deliberate decision.",
    ],
    interviewTips: ["Mentioning the build_runner watch-mode requirement specifically signals real hands-on usage."],
    relatedSlugs: ["riverpod-vs-provider"],
    relatedArticleSlugs: ["flutter-state-management-provider-vs-riverpod-vs-bloc"],
  },
  {
    slug: "bloc-vs-cubit",
    question: "What's the difference between Bloc and Cubit?",
    category: "State Management",
    tags: ["bloc"],
    difficulty: "Intermediate",
    shortAnswer: "Cubit is a simplified version of Bloc — you call methods directly to emit new states, instead of dispatching Events that get mapped to states — trading some of Bloc's structure and traceability for less boilerplate.",
    explanation: "A full Bloc requires defining Event classes and an on<Event>() handler mapping each event to emitted states — verbose, but it creates a clear, replayable log of exactly what triggered each state change. Cubit skips the Event layer entirely: you call a method like counterCubit.increment(), which directly calls emit(state + 1) inside its body.\n\nThe practical tradeoff: Cubit is faster to write and easier to understand for simple state, but you lose the explicit, named 'what caused this' record that Bloc's events provide — which matters more as business logic gets complex or when you want event-replay debugging.",
    codeLanguage: "dart",
    code: "class CounterCubit extends Cubit<int> {\n  CounterCubit() : super(0);\n  void increment() => emit(state + 1);\n}\n\n// Usage\ncontext.read<CounterCubit>().increment();",
    commonMistakes: [
      "Choosing Bloc for a trivial toggle/counter where Cubit's simplicity would suffice.",
      "Choosing Cubit for genuinely complex business logic where Bloc's explicit events would make the code far easier to trace and test.",
    ],
    relatedSlugs: ["bloc-pattern-explained"],
  },
  {
    slug: "getx-obx-reactivity-internals",
    question: "How does GetX's Obx widget know when to rebuild?",
    category: "State Management",
    tags: ["getx"],
    difficulty: "Advanced",
    shortAnswer: "Obx subscribes to any .obs observable read inside its builder function during the build — it tracks reads via a global tracking mechanism, rather than requiring you to explicitly declare which values it depends on.",
    explanation: "Unlike Provider's Consumer<T> (explicitly typed to one provider) or Riverpod's ref.watch() (explicitly registers a dependency per call), GetX's Obx(() => Text('\\${counter.value}')) figures out its dependencies implicitly: when the builder function runs, reading .value on any Rx/.obs variable registers that observable with the currently-building Obx instance, similar in spirit to how MobX or Vue's reactivity system works.\n\nIn practice, this means Obx only rebuilds when an observable it actually read last time changes — but it can't detect a dependency it didn't read on the previous build (e.g. a value only read inside a conditional branch that wasn't taken), a subtle source of 'why didn't this rebuild' bugs.",
    commonMistakes: [
      "Reading an observable conditionally inside Obx, then being surprised the widget doesn't rebuild when that branch wasn't taken during the last build.",
      "Nesting Obx widgets unnecessarily instead of one Obx wrapping the whole reactive section.",
    ],
    relatedSlugs: ["getx-state-management"],
  },
  {
    slug: "provider-proxyprovider",
    question: "What is ProxyProvider used for in the Provider package?",
    category: "State Management",
    tags: ["provider"],
    difficulty: "Advanced",
    shortAnswer: "ProxyProvider lets you create a provider whose value depends on one or more other providers above it — for example, building a repository that needs an already-provided API client.",
    explanation: "A plain Provider creates a value independently. ProxyProvider<ApiClient, UserRepository>((context, apiClient, previous) => UserRepository(apiClient)) instead builds its value from another provider's value, re-running the builder whenever the upstream ApiClient provider changes. This is how you express a dependency chain declaratively: AuthProvider → ApiClient → UserRepository, wired together via nested/MultiProvider ProxyProviders.\n\nThe previous parameter lets you reuse or dispose of the prior value manually if needed, which matters for resources that shouldn't be recreated on every rebuild unless their actual dependency changed.",
    codeLanguage: "dart",
    code: "MultiProvider(\n  providers: [\n    Provider<ApiClient>(create: (_) => ApiClient()),\n    ProxyProvider<ApiClient, UserRepository>(\n      update: (context, apiClient, previous) => UserRepository(apiClient),\n    ),\n  ],\n  child: const MyApp(),\n)",
    commonMistakes: [
      "Reaching for ProxyProvider chains when Riverpod's simpler ref.watch(otherProvider) would express the same dependency more directly.",
      "Not disposing a previous resource when it's replaced, if it holds something needing explicit cleanup.",
    ],
    relatedSlugs: ["what-is-provider"],
  },
  {
    slug: "choosing-state-management-solution",
    question: "How do you decide which state management solution to use in a new Flutter project?",
    category: "State Management",
    tags: ["architecture"],
    difficulty: "Intermediate",
    shortAnswer: "For most new apps, Riverpod is a safe default — for very small apps, setState alone is often enough; choose BLoC specifically when your team values strict, explicit event-driven architecture; avoid picking based on trend alone.",
    explanation: "There's no universally correct choice — it depends on team size, app complexity, and existing familiarity more than technical superiority. setState is genuinely correct for simple, localized UI state. Provider is reasonable for small-to-medium apps. Riverpod is the modern successor to Provider with compile-time safety and easier testing, a solid default for most new apps. BLoC suits teams that want the discipline of explicit events and strict unidirectional flow, often paying off in larger codebases. GetX offers the least ceremony but couples state, DI, and navigation together in ways that can hurt testability at scale.\n\nThe strong interview answer isn't 'X is best' — it's demonstrating you understand the tradeoffs and can justify a choice based on specific app/team constraints, not just familiarity or hype.",
    commonMistakes: [
      "Answering with a single 'best' option without acknowledging tradeoffs.",
      "Choosing a solution for a new project based purely on what's trending rather than actual team/app fit.",
    ],
    interviewTips: ["Structure your answer around concrete tradeoffs (team size, testability, learning curve) rather than a flat ranking."],
    relatedSlugs: ["riverpod-vs-provider", "bloc-pattern-explained"],
    relatedArticleSlugs: ["flutter-state-management-provider-vs-riverpod-vs-bloc", "riverpod-vs-bloc-2026"],
  },

  // ── Architecture (deepen) ────────────────────────────────────────────
  {
    slug: "solid-principles-flutter",
    question: "How do SOLID principles apply to Flutter development?",
    category: "Architecture",
    tags: ["architecture", "solid"],
    difficulty: "Advanced",
    shortAnswer: "SOLID principles apply the same way they do in any OOP codebase — widgets, repositories, and use cases are the concrete places you apply them: single-responsibility widgets, interfaces for repositories (dependency inversion), and small, focused classes over sprawling ones.",
    explanation: "Single Responsibility: a widget that fetches data, manages state, AND renders complex UI is doing too much — split it into a state-management layer and a purely presentational widget. Open/Closed: branching on if (type == 'card') else if (type == 'paypal') violates this; a strategy pattern lets you add a new type without modifying existing code. Liskov Substitution: a subclass of a widget or repository should be usable anywhere the base type is expected without breaking behavior. Interface Segregation: a repository interface with 15 methods when a consumer only needs 2 forces unnecessary coupling. Dependency Inversion: the most visible in Flutter's Clean Architecture — the domain layer defines a UserRepository abstract class, and the data layer implements it, so business logic doesn't depend on low-level details.",
    commonMistakes: [
      "Treating SOLID as Flutter-specific trivia rather than general OOP design principles that show up in Flutter's architecture patterns.",
      "Over-applying SOLID to a tiny app, adding abstractions for things that will realistically never have a second implementation.",
    ],
    relatedSlugs: ["clean-architecture-flutter", "dependency-injection-flutter"],
    relatedArticleSlugs: ["flutter-clean-architecture-2026"],
  },
  {
    slug: "mvvm-vs-clean-architecture",
    question: "How does MVVM compare to Clean Architecture in Flutter?",
    category: "Architecture",
    tags: ["architecture", "mvvm"],
    difficulty: "Advanced",
    shortAnswer: "MVVM (Model-View-ViewModel) is primarily about separating presentation logic from UI; Clean Architecture is a broader, layered approach that MVVM can actually live inside as the presentation layer's specific pattern.",
    explanation: "MVVM's core idea: the View (widget) is 'dumb' and only renders whatever state the ViewModel exposes, forwarding user actions to it — in Flutter, a ChangeNotifier or Riverpod Notifier commonly plays the ViewModel role. This solves presentation-layer concerns specifically: keeping business logic out of widgets.\n\nClean Architecture is a superset concern: it also dictates how the domain layer (entities, use cases) and data layer relate to presentation, via the dependency rule. A Flutter app using Clean Architecture typically implements its presentation layer using an MVVM-style ViewModel — the two aren't competitors; MVVM answers 'how does the UI talk to logic,' Clean Architecture answers the larger 'how are all layers organized.'",
    commonMistakes: [
      "Treating MVVM and Clean Architecture as mutually exclusive alternatives rather than complementary.",
      "Assuming MVVM requires a specific package — it's a pattern, implementable with ChangeNotifier, Riverpod, Bloc, or plain classes.",
    ],
    relatedSlugs: ["clean-architecture-flutter"],
  },
  {
    slug: "feature-first-vs-layer-first-structure",
    question: "Feature-first vs layer-first folder structure — which is better for a Flutter project?",
    category: "Architecture",
    tags: ["architecture"],
    difficulty: "Intermediate",
    shortAnswer: "Layer-first (grouping by technical layer) works fine for small apps; feature-first (grouping by feature, each containing its own presentation/domain/data) scales much better as an app grows, since related code stays together.",
    explanation: "A layer-first structure (lib/widgets/, lib/repositories/, lib/models/) means working on a single feature requires jumping between many top-level folders, and it gets harder to see what belongs together as the app grows.\n\nA feature-first structure (lib/features/auth/{presentation,domain,data}, lib/features/profile/{...}) keeps everything related to one feature co-located, making it easier to understand, test, and even delete a feature cleanly. Most teams combine both: feature-first at the top level, with each feature internally following Clean Architecture's layer separation.",
    commonMistakes: [
      "Sticking with pure layer-first as an app grows past a handful of screens, making navigation and onboarding progressively harder.",
      "Going fully feature-first without shared/core folders for genuinely cross-cutting code, causing duplication across features.",
    ],
    relatedSlugs: ["clean-architecture-flutter"],
  },
  {
    slug: "use-case-pattern-flutter",
    question: "What is a Use Case in Clean Architecture and is it always necessary?",
    category: "Architecture",
    tags: ["architecture"],
    difficulty: "Intermediate",
    shortAnswer: "A Use Case represents a single, specific business action, sitting in the domain layer and orchestrating one or more repository calls; it's most valuable when business logic is genuinely complex, and can be overkill for simple CRUD-style operations.",
    explanation: "A Use Case class typically exposes a single public method (often just call(), letting you invoke it like await loginUseCase(email, password)), containing business rules that don't belong in a widget or repository. It sits between presentation (which calls it) and data (repositories it calls), keeping business logic testable in complete isolation.\n\nFor an operation that's genuinely just 'call a repository method and return the result' with zero additional logic, wrapping it in a Use Case adds indirection without real benefit — some teams skip Use Cases for trivial passthrough operations.",
    codeLanguage: "dart",
    code: "class LoginUseCase {\n  final AuthRepository _repo;\n  const LoginUseCase(this._repo);\n\n  Future<Either<Failure, User>> call({required String email, required String password}) {\n    if (email.isEmpty) return Future.value(Left(ValidationFailure('Email required')));\n    return _repo.login(email: email, password: password);\n  }\n}",
    commonMistakes: [
      "Mechanically creating a Use Case for every single repository method even when it adds zero logic.",
      "Putting complex business logic directly in a Bloc/ViewModel instead of a Use Case when it warrants isolated unit testing.",
    ],
    relatedSlugs: ["clean-architecture-flutter"],
    relatedArticleSlugs: ["flutter-clean-architecture-2026"],
  },
  {
    slug: "dto-vs-entity-vs-model",
    question: "What's the difference between a DTO, a Model, and an Entity in Clean Architecture?",
    category: "Architecture",
    tags: ["architecture"],
    difficulty: "Advanced",
    shortAnswer: "An Entity is a pure business object living in the domain layer with no knowledge of JSON or databases; a Model (or DTO) lives in the data layer, knows how to (de)serialize from a specific data source, and gets converted into an Entity before crossing into the domain layer.",
    explanation: "Entities represent 'what the business cares about' — a User entity might just have id, name, email, with no fromJson/toJson, since the domain layer shouldn't know or care where data comes from. A Model lives in the data layer, mirrors the exact shape of an API response or database row, and knows how to serialize/deserialize that specific format.\n\nThe repository implementation converts a Model into an Entity (often via a toEntity() method) before returning it to domain/presentation layers — this is what lets you swap a REST API for GraphQL, or change a database schema, without rippling into business logic.",
    codeLanguage: "dart",
    code: "// Data layer\nclass UserModel {\n  final String id, name, email;\n  UserModel.fromJson(Map<String, dynamic> json)\n      : id = json['id'], name = json['name'], email = json['email'];\n\n  UserEntity toEntity() => UserEntity(id: id, name: name, email: email);\n}\n\n// Domain layer — no JSON knowledge at all\nclass UserEntity {\n  final String id, name, email;\n  const UserEntity({required this.id, required this.name, required this.email});\n}",
    commonMistakes: [
      "Passing Models directly up into domain/presentation layers instead of converting to Entities first, leaking data-layer concerns upward.",
      "Creating a separate Entity and identical Model for every project regardless of whether the API shape ever differs from the domain shape.",
    ],
    relatedSlugs: ["clean-architecture-flutter", "repository-pattern-flutter"],
  },

  // ── Flutter Performance (deepen) ─────────────────────────────────────
  {
    slug: "flutter-devtools-profiling",
    question: "How do you use Flutter DevTools to diagnose a performance problem?",
    category: "Flutter Performance",
    tags: ["performance", "devtools"],
    difficulty: "Intermediate",
    shortAnswer: "Run the app in profile mode (not debug), open the Performance/CPU Profiler view in DevTools, record a timeline while reproducing the janky interaction, and look for frames exceeding the 16ms (60fps) budget, then inspect which widget's build/layout/paint is taking too long.",
    explanation: "Debug mode includes extra assertions and disables optimizations, making its performance numbers unreliable — always profile in flutter run --profile, never debug mode. DevTools' Performance view shows a frame-by-frame timeline; frames above the 16ms line (for 60fps) are janky. Clicking a slow frame shows a flame chart breaking down exactly which build/layout/paint calls consumed the time.\n\nThe 'Track Widget Builds' and 'Track Layouts/Paints' options add markers showing which widgets rebuilt during a slow frame — often revealing a widget rebuilding far more often than expected.",
    commonMistakes: [
      "Profiling in debug mode and drawing performance conclusions from it — debug mode numbers don't reflect real release performance.",
      "Guessing at the cause of jank instead of actually recording a DevTools timeline.",
    ],
    interviewTips: ["Explicitly say 'profile mode, not debug mode' — this specific detail is a common interview differentiator."],
    relatedSlugs: ["avoid-unnecessary-rebuilds"],
  },
  {
    slug: "repaintboundary-usage",
    question: "What does RepaintBoundary do and when should you use it?",
    category: "Flutter Performance",
    tags: ["performance"],
    difficulty: "Advanced",
    shortAnswer: "RepaintBoundary isolates its child into a separate compositing layer, so repainting that subtree doesn't force everything around it to repaint too — useful for expensive-to-paint widgets that change independently, but overusing it wastes memory on unnecessary layers.",
    explanation: "Normally, when part of the widget tree needs to repaint, Flutter may need to repaint more of the tree around it. Wrapping an expensive or frequently-changing widget (like a complex CustomPainter animation) in RepaintBoundary gives it its own GPU-composited layer, isolating its repaints from siblings and ancestors — genuinely helpful when you have one 'hot' widget in an otherwise static area of the screen.\n\nThe tradeoff is memory: each RepaintBoundary layer costs GPU memory to maintain, so wrapping everything speculatively actually hurts performance rather than helping.",
    commonMistakes: [
      "Sprinkling RepaintBoundary throughout the tree speculatively without profiling first.",
      "Not realizing Flutter already inserts implicit RepaintBoundaries in some cases — manually adding one may be redundant.",
    ],
    relatedSlugs: ["const-widgets-flutter"],
  },
  {
    slug: "image-caching-precacheimage",
    question: "How does Flutter cache images, and what does precacheImage do?",
    category: "Flutter Performance",
    tags: ["performance", "images"],
    difficulty: "Intermediate",
    shortAnswer: "Flutter's ImageCache automatically caches decoded images in memory by default so repeated use of the same image doesn't re-decode it; precacheImage() lets you proactively load and decode an image into that cache before it's actually displayed, avoiding a visible pop-in.",
    explanation: "Image.network/Image.asset use an ImageProvider that resolves through Flutter's global ImageCache, keyed by the image's configuration. Once decoded, subsequent uses of the same image are instant, up to the cache's size limits, which you can tune for image-heavy apps.\n\nprecacheImage(imageProvider, context) triggers the decode-and-cache step ahead of time — commonly called during a splash/loading screen for images you know will be needed soon, so when the image actually needs to render, it appears instantly instead of showing a blank space while decoding.",
    codeLanguage: "dart",
    code: "@override\nvoid didChangeDependencies() {\n  super.didChangeDependencies();\n  precacheImage(const AssetImage('assets/next_screen_hero.png'), context);\n}",
    commonMistakes: [
      "Loading large, unresized images at full resolution — decoding at full resolution wastes memory even with caching; use cacheWidth/cacheHeight to decode at display size.",
      "Not accounting for the ImageCache's size limits when working with many large images, causing thrashing.",
    ],
  },
  {
    slug: "flutter-build-modes-explained",
    question: "What's the difference between Flutter's debug, profile, and release build modes?",
    category: "Flutter Performance",
    tags: ["performance", "build"],
    difficulty: "Beginner",
    shortAnswer: "Debug mode includes assertions, hot reload, and debugging info at the cost of performance; profile mode strips debug overhead but keeps enough tooling support to profile performance accurately; release mode is fully optimized and stripped for production.",
    explanation: "Debug mode (flutter run) enables hot reload, assertions, and service extensions for DevTools, all adding overhead — debug-mode performance is not representative of what users experience.\n\nProfile mode (flutter run --profile) disables most debug-only overhead while retaining just enough instrumentation for DevTools to profile timing accurately — the correct mode for any real performance measurement. Release mode is fully AOT-compiled and optimized with all debugging hooks stripped, matching exactly what end users get.",
    commonMistakes: [
      "Drawing performance conclusions from debug-mode runs, since debug mode is deliberately much slower than what users experience.",
      "Testing app size or startup time in debug mode instead of a release build.",
    ],
    relatedSlugs: ["flutter-devtools-profiling"],
  },

  // ── Firebase Integration (deepen) ────────────────────────────────────
  {
    slug: "firebase-security-rules-basics",
    question: "How do Firestore Security Rules work?",
    category: "Firebase Integration",
    tags: ["firebase", "firestore", "security"],
    difficulty: "Intermediate",
    shortAnswer: "Security Rules are a separate, declarative configuration that Firestore evaluates server-side on every read/write request, deciding whether to allow it based on the requesting user's auth state and the data being accessed — they're your only real line of defense since client-side checks can be bypassed.",
    explanation: "Rules are written in a rules-specific language and deployed separately from your app. A basic rule might be match /users/{userId} { allow read, write: if request.auth != null && request.auth.uid == userId; } — only the authenticated user matching the document's ID can read/write their own document.\n\nBecause rules run entirely server-side, they're the actual security boundary — any check done only in Flutter code can be bypassed by calling the Firestore API directly, so sensitive authorization logic must live in rules. Testing rules locally via the Firestore emulator before deploying is standard practice.",
    codeLanguage: "yaml",
    code: "rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /users/{userId} {\n      allow read, write: if request.auth != null && request.auth.uid == userId;\n    }\n  }\n}",
    commonMistakes: [
      "Relying on client-side checks alone (e.g. only hiding a delete button) instead of enforcing the restriction in Security Rules.",
      "Writing overly permissive rules during development and forgetting to tighten them before shipping.",
    ],
    interviewTips: ["Emphasize that rules are the real security boundary, not client-side code."],
    relatedSlugs: ["firestore-vs-realtime-database"],
  },
  {
    slug: "firebase-crashlytics-setup",
    question: "How do you set up Firebase Crashlytics to catch Flutter errors?",
    category: "Firebase Integration",
    tags: ["firebase", "crashlytics"],
    difficulty: "Intermediate",
    shortAnswer: "Wire both FlutterError.onError (for framework/widget-build errors) and PlatformDispatcher.instance.onError (for uncaught async errors) to record errors to Crashlytics, since neither alone catches every category of error.",
    explanation: "Flutter has two largely separate error channels: framework errors surface through FlutterError.onError, while errors in async code outside the framework's direct control need PlatformDispatcher.instance.onError (or the older runZonedGuarded pattern). Missing either means a whole category of production crashes never reaches Crashlytics.\n\nA complete setup overrides both in main(), before runApp().",
    codeLanguage: "dart",
    code: "void main() async {\n  WidgetsFlutterBinding.ensureInitialized();\n  await Firebase.initializeApp();\n\n  FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;\n\n  PlatformDispatcher.instance.onError = (error, stack) {\n    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);\n    return true;\n  };\n\n  runApp(const MyApp());\n}",
    commonMistakes: [
      "Wiring only FlutterError.onError and assuming all crashes are covered — uncaught async errors need PlatformDispatcher.onError separately.",
      "Testing Crashlytics setup only in debug mode — reporting typically needs a real/release-like build and can be delayed in delivery.",
    ],
    relatedSlugs: ["dart-zones-explained"],
  },
  {
    slug: "firebase-remote-config-vs-ab-testing",
    question: "How do Firebase Remote Config and A/B Testing work together?",
    category: "Firebase Integration",
    tags: ["firebase", "remote-config"],
    difficulty: "Advanced",
    shortAnswer: "Remote Config supplies the actual parameter values your app reads at runtime; Firebase A/B Testing sits on top of it, automatically assigning users to different Remote Config parameter variants and measuring which performs better against a chosen metric.",
    explanation: "Used alone, Remote Config just lets you change values without a release. A/B Testing builds an experiment on top: you define two or more variants of a Remote Config parameter, Firebase randomly assigns each user to a variant, and tracks a target metric tied to Analytics events, computing statistical significance automatically.\n\nThe practical setup: your app code only ever reads the Remote Config parameter normally — it has no awareness an experiment is running. Variant assignment and analysis happen entirely on Firebase's side, keeping app code identical regardless of whether a parameter is under active experimentation.",
    commonMistakes: [
      "Writing experiment-aware branching logic in the app instead of just reading the Remote Config value normally.",
      "Not setting Remote Config default values, so users see an undefined/fallback state before the first successful fetch.",
    ],
    relatedSlugs: ["firebase-remote-config"],
  },
];

async function main() {
  const rows = QUESTIONS.map((q) => ({
    slug: q.slug,
    question: q.question,
    category: q.category,
    tags: q.tags,
    difficulty: q.difficulty,
    short_answer: q.shortAnswer,
    explanation: q.explanation,
    code_language: q.codeLanguage ?? null,
    code_example: q.code ?? null,
    common_mistakes: q.commonMistakes ?? [],
    interview_tips: q.interviewTips ?? [],
    related_slugs: q.relatedSlugs ?? [],
    related_article_slugs: q.relatedArticleSlugs ?? [],
    related_tool_slugs: [],
    status: "published",
  }));

  const { data, error } = await supabase.from("interview_questions").upsert(rows, { onConflict: "slug" }).select("slug");

  if (error) {
    console.error("SEED FAILED:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${data?.length ?? 0} new interview questions.`);
}

main();
