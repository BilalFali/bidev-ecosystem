export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface InterviewQuestion {
  slug: string;
  question: string;
  category: string;
  tags: string[];
  difficulty: Difficulty;
  shortAnswer: string;
  explanation: string;
  codeExample?: { language: "dart" | "yaml" | "bash"; code: string };
  commonMistakes?: string[];
  interviewTips?: string[];
  relatedSlugs?: string[];
  relatedArticleSlugs?: string[];
  relatedToolSlugs?: string[];
}

export interface InterviewCategory {
  name: string;
  slug: string;
  icon: string;
}

export const INTERVIEW_CATEGORIES: InterviewCategory[] = [
  { name: "Flutter Fundamentals", slug: "fundamentals", icon: "🧩" },
  { name: "Flutter Widgets", slug: "widgets", icon: "🧱" },
  { name: "Dart Questions", slug: "dart", icon: "🎯" },
  { name: "State Management", slug: "state-management", icon: "⚡" },
  { name: "Async Programming", slug: "async-programming", icon: "⏱️" },
  { name: "Navigation & Routing", slug: "navigation", icon: "🧭" },
  { name: "Flutter Performance", slug: "performance", icon: "🚀" },
  { name: "Testing", slug: "testing", icon: "🧪" },
  { name: "Firebase Integration", slug: "firebase", icon: "🔥" },
  { name: "Architecture", slug: "architecture", icon: "🏗️" },
  { name: "Advanced Flutter", slug: "advanced-flutter", icon: "🧠" },
];

export const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ── Flutter Fundamentals ──────────────────────────────────────────────
  {
    slug: "what-is-flutter",
    question: "What is Flutter?",
    category: "Flutter Fundamentals",
    tags: ["basics"],
    difficulty: "Beginner",
    shortAnswer:
      "Flutter is Google's open-source UI toolkit for building natively compiled apps for mobile, web, and desktop from a single Dart codebase.",
    explanation:
      "Flutter renders its own widgets directly to a canvas via the Skia (and newer Impeller) graphics engine, instead of wrapping native platform widgets. This means a Flutter app looks and behaves identically across platforms, and isn't limited by the native widget set. The trade-off is that Flutter ships its own rendering engine with the app, which makes apps slightly larger but gives full control over every pixel and consistent 60/120fps performance.\n\nFlutter apps are written in Dart, compiled ahead-of-time (AOT) to native ARM/x64 machine code for release builds, which is why performance is close to native. During development, Dart's just-in-time (JIT) compiler powers hot reload, letting you see UI changes in under a second without restarting the app.",
    commonMistakes: [
      "Saying Flutter \"wraps native widgets\" — it doesn't; it paints everything itself.",
      "Confusing Flutter (the UI toolkit) with Dart (the language) as if they're the same thing.",
    ],
    interviewTips: [
      "Mention the rendering engine (Skia/Impeller) — it shows you understand why Flutter looks consistent across platforms.",
      "Be ready to contrast this with React Native, which bridges to native widgets.",
    ],
    relatedSlugs: ["stateless-vs-stateful-widget", "flutter-architecture-overview"],
  },
  {
    slug: "stateless-vs-stateful-widget",
    question: "What is the difference between StatelessWidget and StatefulWidget?",
    category: "Flutter Fundamentals",
    tags: ["widgets", "basics"],
    difficulty: "Beginner",
    shortAnswer:
      "A StatelessWidget is immutable and rebuilds only when its parent rebuilds; a StatefulWidget holds mutable state via a separate State object and can rebuild itself whenever that state changes.",
    explanation:
      "A StatelessWidget describes part of the UI that depends only on the configuration passed into it and the BuildContext. Once built, it never changes on its own — it's recreated wholesale whenever its parent rebuilds it with new data.\n\nA StatefulWidget is split into two classes: the widget itself (immutable, just configuration) and a State object that Flutter keeps alive across rebuilds. Calling setState() inside the State object marks it dirty and schedules a rebuild of just that subtree, without needing the parent to rebuild.",
    codeExample: {
      language: "dart",
      code: `class Counter extends StatefulWidget {
  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  void _increment() => setState(() => _count++);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: _increment,
      child: Text('Count: $_count'),
    );
  }
}`,
    },
    commonMistakes: [
      "Calling setState() after the widget has been disposed (always guard with `mounted` checks in async callbacks).",
      "Putting state in a StatelessWidget by mutating a field directly — it won't trigger a rebuild.",
    ],
    interviewTips: [
      "Explain *why* the split exists: the State object survives widget rebuilds, which is how Flutter preserves things like scroll position and animation controllers.",
    ],
    relatedSlugs: ["flutter-widget-lifecycle", "avoid-unnecessary-rebuilds"],
  },
  {
    slug: "flutter-widget-lifecycle",
    question: "Explain the widget lifecycle in Flutter.",
    category: "Flutter Fundamentals",
    tags: ["widgets", "lifecycle"],
    difficulty: "Intermediate",
    shortAnswer:
      "A StatefulWidget's State goes through createState → initState → didChangeDependencies → build (repeated) → didUpdateWidget (on parent rebuild) → deactivate → dispose.",
    explanation:
      "createState() is called once when the framework first creates the State object. initState() runs once, right after, and is where you set up controllers, subscriptions, or one-time initialization — note that BuildContext and inherited widgets aren't fully available yet, so don't use them here for anything that depends on InheritedWidget data.\n\ndidChangeDependencies() runs after initState() and again whenever an InheritedWidget the State depends on changes. build() is called every time the framework needs to re-render — it can run many times and must be fast and side-effect-free. If the parent rebuilds with a new widget instance for the same State, didUpdateWidget(oldWidget) runs so you can react to changed configuration. Finally, deactivate() runs when the State is removed from the tree (it may be reinserted elsewhere, e.g. with GlobalKey), and dispose() runs when it's permanently removed — this is where you cancel subscriptions and dispose controllers.",
    commonMistakes: [
      "Doing expensive work inside build() instead of initState() or a memoized value.",
      "Forgetting to dispose() AnimationControllers, StreamSubscriptions, or TextEditingControllers, causing memory leaks.",
    ],
    interviewTips: [
      "Naming the exact order (initState → didChangeDependencies → build → didUpdateWidget → dispose) signals real hands-on experience, not just memorized definitions.",
    ],
    relatedSlugs: ["stateless-vs-stateful-widget", "flutter-memory-management"],
  },
  {
    slug: "flutter-architecture-overview",
    question: "Describe Flutter's architecture — how does a widget end up as pixels on screen?",
    category: "Flutter Fundamentals",
    tags: ["rendering"],
    difficulty: "Intermediate",
    shortAnswer:
      "Flutter has three parallel trees — Widget, Element, and RenderObject — where widgets are immutable configuration, elements are the mutable instances that manage the tree, and render objects handle layout, painting, and hit-testing.",
    explanation:
      "The Widget tree you write in build() methods is just a lightweight, immutable description of UI — widgets are cheap to create and thrown away on every rebuild. Flutter uses that description to update a parallel Element tree, which is long-lived and knows how to diff the new widget configuration against the old one (this is the reconciliation step, similar in spirit to React's virtual DOM diffing).\n\nEach Element that needs to draw something is backed by a RenderObject, which performs the actual layout (sizing and positioning) and painting (turning itself into drawing commands). Those drawing commands are handed to the engine (Skia or Impeller), which rasterizes them into pixels via the GPU. This three-tree split is why Flutter can skip expensive work: if a widget's configuration hasn't meaningfully changed, the element can reuse its existing render object instead of creating a new one.",
    interviewTips: [
      "If asked to go deeper, mention that `const` constructors let Flutter skip rebuilding a widget entirely because it can prove the instance is identical.",
    ],
    relatedSlugs: ["what-is-flutter", "const-widgets-flutter"],
  },

  // ── Dart Questions ──────────────────────────────────────────────────
  {
    slug: "dart-null-safety",
    question: "What is null safety in Dart?",
    category: "Dart Questions",
    tags: ["null-safety"],
    difficulty: "Beginner",
    shortAnswer:
      "Sound null safety means the compiler distinguishes nullable (`String?`) from non-nullable (`String`) types and guarantees, at compile time, that a non-nullable variable can never hold null.",
    explanation:
      "Before null safety, any variable could be null, which made NullPointerException-style crashes (\"Null check operator used on a null value\" in Dart) one of the most common runtime errors. With sound null safety, every type is non-nullable by default; you opt into nullability explicitly with a `?` suffix.\n\nThe compiler then enforces this everywhere: you must either check for null, provide a default with `??`, or assert non-null with `!` (the null assertion operator) before using a nullable value where a non-nullable one is expected. Because the guarantee is sound (not just a lint), the Dart compiler can also use this information to generate more optimized code.",
    codeExample: {
      language: "dart",
      code: `String? maybeName;          // nullable
String name = maybeName ?? 'Guest';   // default with ??
String forced = maybeName!;           // asserts non-null (throws if null)

void greet(String name) => print('Hello, \$name');
// greet(maybeName); // compile error: String? isn't String`,
    },
    commonMistakes: [
      "Overusing the `!` null-assertion operator to silence the compiler instead of actually handling the null case — this just moves the crash to runtime.",
      "Marking everything nullable \"to be safe\" instead of modeling which fields are genuinely optional.",
    ],
    interviewTips: [
      "Distinguish sound null safety from a linter warning — Dart's guarantee is enforced by the type system itself, including across libraries.",
    ],
    relatedSlugs: ["dart-async-await", "dart-data-class-generator"],
    relatedToolSlugs: ["json-to-dart", "dart-data-class-generator"],
  },
  {
    slug: "future-vs-stream",
    question: "What is the difference between Future and Stream in Dart?",
    category: "Dart Questions",
    tags: ["futures", "streams"],
    difficulty: "Intermediate",
    shortAnswer:
      "A Future represents a single asynchronous value that completes once; a Stream represents a sequence of asynchronous values delivered over time, and can emit zero, one, or many events.",
    explanation:
      "A Future is like a promise of one value (or error) at some point in the future — a network request that returns one JSON response is a Future. You consume it with `await` or `.then()`.\n\nA Stream is for ongoing data — user input events, WebSocket messages, or a Firestore document that keeps updating. You consume it with `await for` inside an async function, or by calling `.listen()` to register a callback for each event. Streams can be single-subscription (only one listener ever, used for things like file reads) or broadcast (multiple simultaneous listeners, used for things like a click-event bus).",
    codeExample: {
      language: "dart",
      code: `Future<String> fetchUser() async {
  final response = await http.get(Uri.parse('/api/user'));
  return response.body; // resolves once
}

Stream<int> countdown() async* {
  for (int i = 3; i > 0; i--) {
    await Future.delayed(const Duration(seconds: 1));
    yield i; // emits multiple times
  }
}`,
    },
    commonMistakes: [
      "Trying to `await` a Stream directly instead of using `await for` or `.listen()`.",
      "Forgetting to cancel a StreamSubscription in `dispose()`, leaking the listener.",
    ],
    relatedSlugs: ["dart-async-await", "flutter-memory-management"],
  },
  {
    slug: "dart-async-await",
    question: "How does async/await work in Dart?",
    category: "Dart Questions",
    tags: ["async-await"],
    difficulty: "Beginner",
    shortAnswer:
      "`async` marks a function as returning a Future and lets you use `await` inside it; `await` pauses execution of that function (without blocking the thread) until the awaited Future completes.",
    explanation:
      "Dart is single-threaded for your app code (it uses an event loop, not OS threads, for concurrency). When you `await` a Future, Dart doesn't block the thread — it suspends the current async function and lets the event loop keep processing other work (like UI rendering) until the awaited value is ready, then resumes exactly where it left off.\n\nAn `async` function always returns a Future, even if you don't explicitly wrap the return value — `Future<int> getCount() async { return 5; }` returns a `Future<int>` that completes with 5. Errors thrown inside an async function become a failed Future, which you catch with try/catch around the `await`, same as synchronous code.",
    codeExample: {
      language: "dart",
      code: `Future<void> loadProfile() async {
  try {
    final user = await fetchUser();
    print(user);
  } catch (e) {
    print('Failed to load: \$e');
  }
}`,
    },
    commonMistakes: [
      "Marking a function `async` but forgetting to `await` a Future inside it — the function returns before the work finishes.",
      "Thinking `await` blocks the UI thread — it doesn't; it yields control back to the event loop.",
    ],
    relatedSlugs: ["future-vs-stream", "dart-null-safety"],
  },
  {
    slug: "dart-extensions",
    question: "What are extension methods in Dart?",
    category: "Dart Questions",
    tags: ["extensions"],
    difficulty: "Intermediate",
    shortAnswer:
      "Extension methods let you add new functionality to an existing type — including types you don't own, like String or int — without modifying its source or subclassing it.",
    explanation:
      "Normally, to add a method to a class you either edit its source or create a subclass. Extensions sidestep both: you declare `extension <Name> on <Type> { ... }` and any method or getter inside becomes callable on instances of that type, as if it were built in.\n\nExtensions are resolved statically at compile time based on the declared type of the variable, not its runtime type, and they only apply where the extension is imported and visible — there's no global mutation of the type happening.",
    codeExample: {
      language: "dart",
      code: `extension StringCasingExtension on String {
  String capitalize() =>
      isEmpty ? this : '\${this[0].toUpperCase()}\${substring(1)}';
}

void main() {
  print('flutter'.capitalize()); // "Flutter"
}`,
    },
    commonMistakes: [
      "Assuming extension methods are dynamically dispatched like normal instance methods — they're resolved by static type.",
      "Defining two extensions with conflicting method names on the same type and being surprised by ambiguity errors.",
    ],
    relatedSlugs: ["dart-mixins"],
  },
  {
    slug: "dart-mixins",
    question: "What are mixins in Dart and when would you use one?",
    category: "Dart Questions",
    tags: ["mixins"],
    difficulty: "Intermediate",
    shortAnswer:
      "A mixin lets a class reuse a chunk of behavior from multiple sources without using multiple inheritance — you declare it with `mixin` and apply it with `with`.",
    explanation:
      "Dart classes can only extend one superclass, but a class can mix in several mixins, each contributing methods and fields. This is useful for cross-cutting behavior that doesn't fit a single inheritance hierarchy — for example, a `Validatable` mixin that adds validation logic to several unrelated form-field classes.\n\nYou can restrict which classes are allowed to use a mixin with the `on` clause (e.g. `mixin Flying on Animal`), which lets the mixin call methods it assumes the host class provides. Unlike a regular class, a mixin generally can't have its own constructor.",
    codeExample: {
      language: "dart",
      code: `mixin Loggable {
  void log(String message) => print('[LOG] \$message');
}

class ApiClient with Loggable {
  void fetch() {
    log('Fetching data...');
  }
}`,
    },
    commonMistakes: [
      "Confusing mixins with abstract classes — a mixin can't be instantiated directly with `new`/a constructor call.",
      "Overusing mixins for things that would be clearer as plain composition (passing in a dependency instead of mixing in behavior).",
    ],
    relatedSlugs: ["dart-extensions"],
  },

  // ── State Management ─────────────────────────────────────────────────
  {
    slug: "what-is-provider",
    question: "What is the Provider package and how does it work?",
    category: "State Management",
    tags: ["provider"],
    difficulty: "Beginner",
    shortAnswer:
      "Provider is a wrapper around Flutter's InheritedWidget that makes it easy to expose and listen to a piece of state from anywhere below it in the widget tree, and to rebuild only the widgets that actually depend on it.",
    explanation:
      "You wrap part of your widget tree in a `ChangeNotifierProvider` (or similar provider type), supplying a `ChangeNotifier` subclass that holds your state and calls `notifyListeners()` whenever it changes. Descendant widgets read that state with `context.watch<T>()` (rebuilds on change), `context.read<T>()` (reads once, doesn't rebuild — typically used inside callbacks), or the `Consumer<T>` widget for fine-grained rebuild scoping.\n\nProvider's main value over raw InheritedWidget is dependency lookup and disposal handled for you, plus a clear, idiomatic API that the Flutter team itself recommended for years as the default state management approach for small-to-medium apps.",
    commonMistakes: [
      "Calling `context.watch<T>()` inside a callback (like `onPressed`) instead of `context.read<T>()` — watch should only be used during build.",
      "Putting business logic directly in widgets instead of in the ChangeNotifier.",
    ],
    relatedSlugs: ["riverpod-vs-provider", "bloc-pattern-explained"],
  },
  {
    slug: "riverpod-vs-provider",
    question: "How does Riverpod differ from Provider?",
    category: "State Management",
    tags: ["riverpod", "provider"],
    difficulty: "Intermediate",
    shortAnswer:
      "Riverpod is a redesign by the same author as Provider that removes the dependency on BuildContext and the widget tree, catching errors at compile time instead of runtime, and making providers globally accessible and easily testable.",
    explanation:
      "Provider relies on InheritedWidget, which means lookups can fail at runtime if you call `context.watch<T>()` above the provider in the tree, or if the type is wrong — these show up as runtime exceptions. Riverpod declares providers as plain top-level (or class) objects, completely decoupled from BuildContext, so the compiler can catch a missing or mistyped provider before you even run the app.\n\nRiverpod also makes providers easy to override for testing (e.g. swapping a real repository provider for a mock one in a test's `ProviderScope`), supports automatic disposal of state that's no longer being listened to (`autoDispose`), and has first-class support for async state via `FutureProvider`/`StreamProvider` with built-in loading/error/data states.",
    commonMistakes: [
      "Assuming Riverpod is just \"Provider 2.0\" with the same mental model — its decoupling from BuildContext changes how you structure dependencies.",
      "Not using `autoDispose` where appropriate, leading to providers that never get cleaned up.",
    ],
    interviewTips: [
      "Mention that Riverpod is a separate package (not part of Flutter SDK), unlike some assume.",
    ],
    relatedSlugs: ["what-is-provider", "bloc-pattern-explained"],
  },
  {
    slug: "bloc-pattern-explained",
    question: "What is the BLoC pattern in Flutter?",
    category: "State Management",
    tags: ["bloc"],
    difficulty: "Intermediate",
    shortAnswer:
      "BLoC (Business Logic Component) separates UI from business logic by having the UI dispatch Events into a Bloc, which processes them and emits new States that the UI rebuilds from — all communication happens through a strict, unidirectional stream of Events and States.",
    explanation:
      "A widget never mutates state directly. Instead, it sends an Event (e.g. `IncrementPressed()`) into a Bloc using `context.read<CounterBloc>().add(IncrementPressed())`. The Bloc's internal logic maps that event to a new State (e.g. `CounterState(count: count + 1)`) and emits it. The UI listens via `BlocBuilder` (rebuild on state changes) or `BlocListener` (side effects like navigation/snackbars without rebuilding), so the data flow is always Event → Bloc → State → UI, never the reverse.\n\nThis strict separation makes business logic fully testable without any widget tree at all — you can unit test a Bloc by feeding it events and asserting on the emitted states, with no Flutter dependency in the test.",
    commonMistakes: [
      "Putting Flutter-specific code (like `BuildContext`) inside a Bloc — it should be pure Dart, completely UI-agnostic.",
      "Confusing `BlocBuilder` (for rebuilding UI) with `BlocListener` (for one-off side effects) and using the wrong one.",
    ],
    relatedSlugs: ["riverpod-vs-provider", "clean-architecture-flutter"],
  },
  {
    slug: "getx-state-management",
    question: "What is GetX and what does it offer for state management?",
    category: "State Management",
    tags: ["getx"],
    difficulty: "Beginner",
    shortAnswer:
      "GetX is an all-in-one Flutter package combining reactive state management, dependency injection, and route navigation, designed to minimize boilerplate with a small, simple API.",
    explanation:
      "For state, GetX offers two main styles: wrapping a value in `.obs` to make it observable and rebuilding with `Obx(() => Text('\${counter.value}'))`, or using `GetBuilder` for a more manual, controller-based update model. For dependency injection, `Get.put()`/`Get.find()` register and retrieve controllers without needing a wrapping widget like Provider requires. For navigation, `Get.to()` lets you push routes without a BuildContext at all.\n\nThe trade-off developers debate is that GetX's convenience (especially context-free navigation and DI) comes at the cost of being a large, opinionated, all-in-one dependency rather than composable single-purpose packages — some teams prefer combining a focused state package (Riverpod/Bloc) with a separate router (go_router) instead.",
    commonMistakes: [
      "Treating GetX's context-free APIs as universally good practice without understanding the testability/coupling trade-offs.",
    ],
    relatedSlugs: ["what-is-provider", "riverpod-vs-provider"],
  },

  // ── Flutter Performance ───────────────────────────────────────────────
  {
    slug: "const-widgets-flutter",
    question: "Why should you use const widgets in Flutter?",
    category: "Flutter Performance",
    tags: ["const"],
    difficulty: "Beginner",
    shortAnswer:
      "A `const` widget is created once at compile time and reused across rebuilds — Flutter can skip rebuilding it entirely because it knows the instance can never change.",
    explanation:
      "When a widget's constructor and all its arguments are compile-time constants, marking it `const` tells Dart to create exactly one instance, shared everywhere it's used. During a rebuild, Flutter compares the new widget instance to the old one; if they're `==` (which `const` instances are, by identity), it skips rebuilding that subtree entirely instead of diffing it.\n\nThis matters most for static decoration — icons, dividers, fixed-text labels — nested deep inside frequently-rebuilding parents. It costs nothing to add and the Dart analyzer (`prefer_const_constructors` lint) will even suggest it for you.",
    codeExample: {
      language: "dart",
      code: `// Rebuilt fresh every time the parent rebuilds:
Icon(Icons.star, color: Colors.amber)

// Created once, reused forever:
const Icon(Icons.star, color: Colors.amber)`,
    },
    commonMistakes: [
      "Not marking a widget `const` just because it \"looks dynamic\" when its actual arguments are all compile-time constants.",
      "Wrapping a `const`-eligible subtree in a non-const parent and assuming the optimization still applies — the analyzer will flag if it doesn't propagate.",
    ],
    relatedSlugs: ["avoid-unnecessary-rebuilds", "flutter-architecture-overview"],
  },
  {
    slug: "avoid-unnecessary-rebuilds",
    question: "How do you avoid unnecessary widget rebuilds in Flutter?",
    category: "Flutter Performance",
    tags: ["rebuilds"],
    difficulty: "Intermediate",
    shortAnswer:
      "Scope state narrowly (so only the widgets that depend on it rebuild), use `const` constructors wherever possible, and split large build methods into smaller widgets so a change in one part doesn't force the whole tree to re-render.",
    explanation:
      "The single biggest cause of unnecessary rebuilds is calling `setState()` (or having a `Provider`/`Riverpod` watcher) high up in a large widget tree, which forces everything below it to rebuild even if only a small piece actually changed visually. The fix is to push state down: extract the part of the UI that actually changes into its own small widget, and keep state management scoped to just that subtree.\n\nFor Provider/Riverpod specifically, prefer `Selector`/`Consumer` (or `ref.watch(provider.select(...))` in Riverpod) to listen to only the specific field you need, rather than the whole object. Also use `const` constructors aggressively, and avoid creating new closures or objects inline inside `build()` (e.g. a new `BoxDecoration` every build) since that defeats Flutter's ability to detect \"nothing changed.\"",
    commonMistakes: [
      "Wrapping the entire `Scaffold` in a `Consumer`/`Obx` instead of just the small widget that needs the data.",
      "Creating new callback closures or styling objects inline on every build instead of hoisting them out.",
    ],
    relatedSlugs: ["const-widgets-flutter", "listview-builder-optimization"],
  },
  {
    slug: "listview-builder-optimization",
    question: "How do you optimize long lists in Flutter?",
    category: "Flutter Performance",
    tags: ["listview"],
    difficulty: "Intermediate",
    shortAnswer:
      "Use `ListView.builder` (or `SliverList`) instead of building all items eagerly, always provide `key`s for items that can reorder, and avoid expensive work inside the `itemBuilder`.",
    explanation:
      "`ListView(children: [...])` builds every item immediately, even ones far off-screen — fine for a handful of items, disastrous for hundreds. `ListView.builder` instead lazily builds only the items that are visible (plus a small cache window), calling your `itemBuilder` on demand as the user scrolls.\n\nBeyond that: give list items stable `Key`s (e.g. `ValueKey(item.id)`) so Flutter can correctly match elements when the list reorders, instead of rebuilding everything from scratch. Avoid doing image decoding, JSON parsing, or other expensive work directly inside `itemBuilder` — precompute it before passing data into the list. For extremely long or complex lists, consider `ListView.separated` for dividers without manual index math, or slivers for mixed scrollable content.",
    codeExample: {
      language: "dart",
      code: `ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    final item = items[index];
    return ListTile(
      key: ValueKey(item.id),
      title: Text(item.title),
    );
  },
)`,
    },
    commonMistakes: [
      "Using `ListView(children: items.map(...).toList())` for a long or unbounded list.",
      "Missing `key`s on reorderable list items, causing visual glitches or wrong-item animations.",
    ],
    relatedSlugs: ["avoid-unnecessary-rebuilds", "flutter-memory-management"],
  },
  {
    slug: "flutter-memory-management",
    question: "How does Flutter manage memory, and how do you avoid leaks?",
    category: "Flutter Performance",
    tags: ["memory"],
    difficulty: "Advanced",
    shortAnswer:
      "Dart uses automatic garbage collection, so you don't free memory manually — leaks in Flutter almost always come from long-lived objects (controllers, streams, listeners) holding references that prevent disposed widgets' resources from being collected.",
    explanation:
      "The Dart VM's generational garbage collector reclaims objects with no remaining references, so typical \"manual memory management\" bugs (like double-free) don't apply. What does cause real leaks in Flutter apps is forgetting to release long-lived resources tied to a widget's lifetime: an `AnimationController`, `TextEditingController`, `ScrollController`, or `StreamSubscription` started in `initState()` but never released in `dispose()` keeps running (and keeps its callbacks alive) even after the widget is gone.\n\nA second common source is global/static state (singletons, global event buses) holding a reference to a callback or object tied to a specific screen — the screen is popped, but the global reference keeps it (and everything it references) alive. Use Flutter DevTools' memory view to take heap snapshots and look for unexpectedly retained widget/controller instances after navigating away.",
    commonMistakes: [
      "Subscribing to a Stream or animation in `initState()` without a matching `cancel()`/`dispose()`.",
      "Registering a callback on a global singleton from a screen, then never unregistering it when the screen closes.",
    ],
    interviewTips: [
      "Mention Flutter DevTools' memory snapshot/diff tooling specifically — it shows you've actually debugged a leak, not just read about the concept.",
    ],
    relatedSlugs: ["flutter-widget-lifecycle", "dart-isolates"],
  },

  // ── Firebase Integration ──────────────────────────────────────────────
  {
    slug: "firebase-auth-flutter",
    question: "How do you implement Firebase Authentication in Flutter?",
    category: "Firebase Integration",
    tags: ["authentication"],
    difficulty: "Beginner",
    shortAnswer:
      "Add the `firebase_auth` package, initialize Firebase in `main()`, then use `FirebaseAuth.instance` to sign users in (email/password, Google, etc.) and listen to `authStateChanges()` to react to login/logout across the app.",
    explanation:
      "After running `flutterfire configure` (which wires up your platform-specific Firebase config files) and calling `Firebase.initializeApp()` before `runApp()`, authentication itself is mostly calling methods on `FirebaseAuth.instance`: `createUserWithEmailAndPassword()`, `signInWithEmailAndPassword()`, or a provider-specific sign-in (e.g. Google Sign-In, which gets an OAuth credential and passes it to `signInWithCredential()`).\n\nThe key architectural piece is `FirebaseAuth.instance.authStateChanges()`, a Stream that emits the current `User?` (null when signed out) immediately and on every login/logout. Wrapping your app's root in a `StreamBuilder` on this stream is the standard way to route between a login screen and the main app reactively, without manually tracking auth state yourself.",
    codeExample: {
      language: "dart",
      code: `StreamBuilder<User?>(
  stream: FirebaseAuth.instance.authStateChanges(),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const SplashScreen();
    }
    return snapshot.hasData ? const HomeScreen() : const LoginScreen();
  },
)`,
    },
    commonMistakes: [
      "Calling `Firebase.initializeApp()` after `runApp()` instead of before, causing a race condition on startup.",
      "Manually polling `FirebaseAuth.instance.currentUser` instead of listening to `authStateChanges()`.",
    ],
    relatedSlugs: ["firestore-vs-realtime-database", "fcm-push-notifications"],
  },
  {
    slug: "firestore-vs-realtime-database",
    question: "What's the difference between Firestore and the Realtime Database?",
    category: "Firebase Integration",
    tags: ["firestore"],
    difficulty: "Intermediate",
    shortAnswer:
      "Firestore is a newer, document/collection-based database with richer querying, automatic multi-region scaling, and better offline support; the Realtime Database is a simpler single JSON tree, cheaper for very high-frequency small writes but with weaker querying.",
    explanation:
      "Firestore organizes data into documents (JSON-like objects) grouped into collections, and supports compound queries, indexing, and pagination natively. It scales horizontally across regions automatically and its offline persistence layer is more robust — queries work offline and sync seamlessly when reconnected.\n\nThe Realtime Database stores everything as one large JSON tree. It's historically been favored for use cases needing extremely low-latency, high-frequency updates (like live cursor positions or presence systems) because its WebSocket-based sync can be marginally faster for tiny, frequent writes, and its pricing model (bandwidth-based) can be cheaper at that specific workload shape. For most new apps, Google now recommends Firestore by default unless you have that specific high-frequency-small-write profile.",
    commonMistakes: [
      "Assuming Realtime Database is deprecated — it isn't, it's just recommended for narrower use cases now.",
      "Trying to run Firestore-style compound queries against the Realtime Database's flatter query model.",
    ],
    relatedSlugs: ["firebase-auth-flutter", "firebase-remote-config"],
  },
  {
    slug: "fcm-push-notifications",
    question: "How do push notifications work with Firebase Cloud Messaging in Flutter?",
    category: "Firebase Integration",
    tags: ["push-notifications"],
    difficulty: "Intermediate",
    shortAnswer:
      "The app registers with FCM to get a unique device token, your backend (or Firebase console) sends a message to that token via the FCM API, and the `firebase_messaging` package delivers it to the app in foreground, background, or terminated states via different handlers.",
    explanation:
      "Each app install gets a device token from `FirebaseMessaging.instance.getToken()`, which you send to your backend so it knows where to deliver messages for that user. When a message arrives, how it's handled depends on app state: in the foreground, `FirebaseMessaging.onMessage` fires and you typically show your own in-app notification UI (FCM doesn't auto-display foreground notifications). In the background or terminated, the OS shows the system notification automatically for \"notification\" payloads, and tapping it triggers `FirebaseMessaging.onMessageOpenedApp` (from background) or a check on `getInitialMessage()` (from terminated) so you can navigate to the right screen.\n\nOn iOS specifically, you also need to request notification permission explicitly (`requestPermission()`) and configure APNs certificates/keys in the Firebase console — FCM relies on Apple's push service under the hood for iOS delivery.",
    commonMistakes: [
      "Forgetting that foreground messages don't show a system notification automatically — you must build that UI yourself.",
      "Not registering a top-level (non-class) background message handler, which iOS/Android background isolates require.",
    ],
    relatedSlugs: ["firebase-auth-flutter"],
    relatedArticleSlugs: ["firebase-push-notifications-flutter"],
  },
  {
    slug: "firebase-remote-config",
    question: "What is Firebase Remote Config used for?",
    category: "Firebase Integration",
    tags: ["remote-config"],
    difficulty: "Advanced",
    shortAnswer:
      "Remote Config lets you change app behavior and appearance — feature flags, A/B test variants, default values — without shipping a new app release, by fetching key/value parameters from the Firebase backend at runtime.",
    explanation:
      "You define parameters (and optional conditions, like \"users on Android\" or \"in experiment group B\") in the Firebase console, fetch them in-app via `FirebaseRemoteConfig.instance.fetchAndActivate()`, and read values with typed getters (`getBool`, `getString`, etc.) that fall back to in-app defaults if the fetch hasn't completed yet — so the app always has a sane value even offline or on first launch.\n\nCommon uses: gradually rolling out a feature to a percentage of users (a feature flag), running A/B tests by tying parameter values to experiment groups, or changing copy/pricing without an app store release. It pairs naturally with Firebase Analytics and A/B Testing for measuring the impact of different configurations.",
    commonMistakes: [
      "Treating Remote Config as a real-time push mechanism — it's pull-based; you choose when to fetch (e.g. on app start), it doesn't push changes instantly.",
      "Not setting in-app default values, leaving the app in an undefined state before the first successful fetch.",
    ],
    relatedSlugs: ["firestore-vs-realtime-database"],
  },

  // ── Architecture ──────────────────────────────────────────────────────
  {
    slug: "clean-architecture-flutter",
    question: "What is Clean Architecture and how does it apply to Flutter?",
    category: "Architecture",
    tags: ["clean-architecture"],
    difficulty: "Intermediate",
    shortAnswer:
      "Clean Architecture separates an app into independent layers — typically presentation, domain, and data — where inner layers (business logic) never depend on outer layers (UI, frameworks, databases), so business rules can be tested and reused independently of Flutter itself.",
    explanation:
      "In a typical Flutter implementation: the presentation layer holds widgets and state management (Bloc/Riverpod/Provider), the domain layer holds pure-Dart entities and use cases (business rules with zero Flutter or package imports), and the data layer holds repositories and data sources (API clients, local databases) that implement interfaces defined in the domain layer.\n\nThe dependency rule flows inward: presentation depends on domain, data depends on domain, but domain depends on nothing Flutter-specific. This is enforced via the Dependency Inversion Principle — the domain layer defines a `UserRepository` interface (abstract class), and the data layer provides the concrete implementation, which gets injected at the outer edges (often via Provider/Riverpod or a DI container like `get_it`). The payoff is that you can unit test use cases with zero widgets, mock the repository easily, and swap a REST data source for GraphQL without touching business logic.",
    commonMistakes: [
      "Over-engineering tiny apps with the full three-layer structure when a simpler approach would do — Clean Architecture's value shows up as the app and team grow.",
      "Letting domain-layer code import Flutter packages (like `material.dart`), which breaks the whole point of the separation.",
    ],
    interviewTips: [
      "Be ready to explain the Dependency Inversion Principle specifically — it's the mechanism that makes the layering actually work, not just a folder structure.",
    ],
    relatedSlugs: ["repository-pattern-flutter", "dependency-injection-flutter"],
    relatedArticleSlugs: ["flutter-clean-architecture-2026"],
  },
  {
    slug: "repository-pattern-flutter",
    question: "What is the Repository pattern?",
    category: "Architecture",
    tags: ["repository-pattern"],
    difficulty: "Intermediate",
    shortAnswer:
      "The Repository pattern puts a single abstraction in front of however data is actually fetched or stored — network, local cache, database — so the rest of the app talks to one consistent interface and doesn't care where the data comes from.",
    explanation:
      "Instead of widgets or use cases calling an HTTP client directly, they depend on a repository interface like `abstract class UserRepository { Future<User> getUser(String id); }`. The concrete implementation decides internally whether to hit the network, read a local cache, or merge both (e.g. return cached data immediately, then refresh from network) — that decision is invisible to everything calling the repository.\n\nThis gives you two big wins: you can swap the underlying data source (REST today, GraphQL tomorrow, or add an offline cache) without touching any calling code, and you can substitute a fake/mock repository in tests so business logic tests never make real network calls.",
    codeExample: {
      language: "dart",
      code: `abstract class UserRepository {
  Future<User> getUser(String id);
}

class UserRepositoryImpl implements UserRepository {
  UserRepositoryImpl(this._api, this._cache);
  final ApiClient _api;
  final LocalCache _cache;

  @override
  Future<User> getUser(String id) async {
    final cached = _cache.getUser(id);
    if (cached != null) return cached;
    final user = await _api.fetchUser(id);
    _cache.saveUser(user);
    return user;
  }
}`,
    },
    commonMistakes: [
      "Creating a repository that just forwards every call to one data source with no added logic — at that point it's not adding value over calling the data source directly.",
      "Leaking data-source-specific types (like an HTTP response model) out through the repository interface instead of returning domain entities.",
    ],
    relatedSlugs: ["clean-architecture-flutter", "dependency-injection-flutter"],
  },
  {
    slug: "dependency-injection-flutter",
    question: "What is Dependency Injection and how is it used in Flutter?",
    category: "Architecture",
    tags: ["dependency-injection"],
    difficulty: "Advanced",
    shortAnswer:
      "Dependency Injection means a class receives its dependencies from the outside (via constructor or a container) instead of creating them itself, which decouples classes from concrete implementations and makes them easy to test with substitutes.",
    explanation:
      "Without DI, a class might do `final repo = UserRepositoryImpl();` directly inside itself — now it's permanently coupled to that exact implementation and can't be tested without hitting a real API. With DI, the class instead declares `UserRepository repo` as a constructor parameter, and something else (a parent widget, a DI container, or a provider) decides which concrete implementation to hand it.\n\nIn Flutter, this is commonly done via Provider/Riverpod (providers are themselves a form of DI — they supply object instances to the widget tree) or a dedicated service locator like `get_it`, where you register implementations once (often at app startup) and retrieve them anywhere with `GetIt.instance<UserRepository>()`. The key benefit in tests: you register a fake implementation in the container before the test runs, and every class that depends on that interface transparently gets the fake instead of the real thing.",
    commonMistakes: [
      "Confusing a service locator (`get_it`) with true dependency injection — a service locator still has classes reaching out to grab their dependencies, just from a registry instead of constructing them; constructor injection is the stricter form.",
      "Registering dependencies in a way that creates circular dependencies between services.",
    ],
    relatedSlugs: ["clean-architecture-flutter", "repository-pattern-flutter"],
  },

  // ── Advanced Flutter ──────────────────────────────────────────────────
  {
    slug: "dart-isolates",
    question: "What are isolates in Dart and when do you need them?",
    category: "Advanced Flutter",
    tags: ["isolates"],
    difficulty: "Advanced",
    shortAnswer:
      "An isolate is Dart's unit of concurrency — a separate memory heap and event loop running independently, with no shared mutable state — used to run CPU-heavy work in parallel without blocking the UI thread.",
    explanation:
      "Dart's main isolate runs your UI and event loop; `await`ing a network call doesn't block it because I/O is non-blocking, but genuinely CPU-bound work (parsing a huge JSON file, image processing, heavy computation) does block it, causing dropped frames and jank, because there's no thread for it to yield to.\n\nIsolates solve this by running that work on a separate isolate with its own memory — communication happens only via message-passing (ports), never shared memory, which is why Dart doesn't need locks/mutexes for isolate-to-isolate communication. The easy way to spin one up for a single task is `compute()` from Flutter, which runs a top-level function on a new isolate and returns its result as a Future. For longer-lived background work, you manage an `Isolate` and `ReceivePort` directly.",
    codeExample: {
      language: "dart",
      code: `// Runs on a separate isolate, doesn't block the UI thread
final result = await compute(parseHeavyJson, rawJsonString);

List<Item> parseHeavyJson(String raw) {
  final data = jsonDecode(raw) as List;
  return data.map((e) => Item.fromJson(e)).toList();
}`,
    },
    commonMistakes: [
      "Using isolates for I/O-bound work (network calls) that already doesn't block the main isolate — isolates only help with CPU-bound work.",
      "Passing non-message-safe objects (like a class holding a `BuildContext`) across the isolate boundary.",
    ],
    interviewTips: [
      "Mention `compute()` by name — it's the practical, most-used entry point and shows real usage, not just textbook knowledge.",
    ],
    relatedSlugs: ["flutter-memory-management", "platform-channels-flutter"],
  },
  {
    slug: "flutter-animations-overview",
    question: "What are the main ways to build animations in Flutter?",
    category: "Advanced Flutter",
    tags: ["animations"],
    difficulty: "Intermediate",
    shortAnswer:
      "Implicit animations (the `Animated*` widgets, like `AnimatedContainer`) animate a property change automatically with minimal code; explicit animations give full control via an `AnimationController` and `Tween`, for anything beyond a simple property tween.",
    explanation:
      "Implicit animations are the fast path: wrap a value in `AnimatedContainer`, `AnimatedOpacity`, etc., change the target value (e.g. a new `color` or `width`), and Flutter animates the transition automatically over the given `duration` — no controller needed. This covers most simple \"animate this property when it changes\" cases.\n\nExplicit animations give you precise control: you create an `AnimationController` (which drives a value over time, typically 0 to 1), wrap it in a `Tween` to map that range onto the actual values you want (e.g. a color or a rotation), and rebuild via `AnimatedBuilder` whenever the controller ticks. This is necessary for coordinating multiple animations, repeating/reversing animations, responding to gestures mid-animation, or anything an implicit widget doesn't expose a parameter for. There's also the newer declarative animation API for Flutter's animated transitions between routes/widgets, but controller-based explicit animation remains the foundation for complex custom motion.",
    codeExample: {
      language: "dart",
      code: `class _FadeInState extends State<FadeIn> with SingleTickerProviderStateMixin {
  late final _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 400),
  )..forward();
  late final _opacity = CurvedAnimation(parent: _controller, curve: Curves.easeIn);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) =>
      FadeTransition(opacity: _opacity, child: widget.child);
}`,
    },
    commonMistakes: [
      "Forgetting to `dispose()` an `AnimationController`, leaking the ticker.",
      "Reaching for explicit `AnimationController` setup when an `Animated*` implicit widget would do the job in two lines.",
    ],
    relatedSlugs: ["custom-painter-flutter", "flutter-memory-management"],
  },
  {
    slug: "custom-painter-flutter",
    question: "What is CustomPainter used for?",
    category: "Advanced Flutter",
    tags: ["custom-painter"],
    difficulty: "Advanced",
    shortAnswer:
      "CustomPainter lets you draw directly onto a canvas with low-level drawing primitives (paths, arcs, text, gradients) for visuals that no combination of standard widgets can produce — charts, custom shapes, signature pads.",
    explanation:
      "You subclass `CustomPainter`, implement `paint(Canvas canvas, Size size)` with direct drawing calls (`canvas.drawPath`, `canvas.drawCircle`, `canvas.drawLine`, etc.), and implement `shouldRepaint(oldDelegate)` to tell Flutter whether it needs to repaint when something changes — returning `false` when nothing relevant changed avoids wasted repaints. You attach it to the tree via a `CustomPaint` widget, optionally giving it a `size` and a `child` to paint over/under.\n\nThis is the right tool when you need pixel-level control that widgets can't express — a custom progress ring, a chart, a hand-drawn signature capture, or a complex clipped/gradient shape. For most \"slightly custom\" visuals, reach for `ClipPath`, `ShaderMask`, or `DecoratedBox` first; CustomPainter is for when those genuinely aren't enough.",
    codeExample: {
      language: "dart",
      code: `class RingPainter extends CustomPainter {
  RingPainter(this.progress);
  final double progress; // 0.0 - 1.0

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8;
    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    canvas.drawArc(rect, -1.57, progress * 6.28, false, paint);
  }

  @override
  bool shouldRepaint(RingPainter old) => old.progress != progress;
}`,
    },
    commonMistakes: [
      "Always returning `true` from `shouldRepaint`, forcing a repaint on every frame regardless of whether anything changed.",
      "Doing expensive computation inside `paint()` instead of precomputing it before passing data to the painter.",
    ],
    relatedSlugs: ["flutter-animations-overview"],
  },
  {
    slug: "platform-channels-flutter",
    question: "What are platform channels and why are they needed?",
    category: "Advanced Flutter",
    tags: ["platform-channels"],
    difficulty: "Advanced",
    shortAnswer:
      "Platform channels are Flutter's message-passing bridge to native platform code (Kotlin/Java on Android, Swift/Objective-C on iOS) — used whenever you need a platform API or native SDK that has no Dart equivalent.",
    explanation:
      "Flutter's Dart code doesn't run inside the native platform's runtime, so it can't call native APIs directly. A `MethodChannel` lets Dart invoke a named method with arguments and asynchronously receive a result, while the native side registers a handler for that channel name and method. Communication is serialized through a standard message codec (supporting primitives, lists, maps), so both sides need to agree on the channel name and method names as a contract.\n\nThis is needed for things with no existing Flutter package: a proprietary native SDK, a platform-specific API not yet wrapped by a plugin, or custom native UI embedding (via `PlatformView`). In practice, most apps never write raw platform channel code directly — they consume a plugin package that already wraps this for a specific capability (camera, Bluetooth, etc.) — but understanding the mechanism matters once you need a capability no plugin covers yet, or you're building a plugin yourself.",
    codeExample: {
      language: "dart",
      code: `const channel = MethodChannel('com.bidev.app/battery');

Future<int> getBatteryLevel() async {
  final level = await channel.invokeMethod<int>('getBatteryLevel');
  return level ?? -1;
}`,
    },
    commonMistakes: [
      "Assuming platform channel calls are synchronous — they're always asynchronous (a Future on the Dart side).",
      "Mismatching the channel name or method name string between Dart and native code, causing a silent `MissingPluginException`.",
    ],
    relatedSlugs: ["dart-isolates"],
  },
];

export function getCategoryBySlug(slug: string): InterviewCategory | undefined {
  return INTERVIEW_CATEGORIES.find((c) => c.slug === slug);
}

export function getQuestionBySlug(slug: string): InterviewQuestion | undefined {
  return INTERVIEW_QUESTIONS.find((q) => q.slug === slug);
}

export function getAllTagSlugs(): string[] {
  return Array.from(new Set(INTERVIEW_QUESTIONS.flatMap((q) => q.tags))).sort();
}

export function getAllFilterKeys(): string[] {
  return Array.from(
    new Set([
      ...DIFFICULTIES.map((d) => d.toLowerCase()),
      ...INTERVIEW_CATEGORIES.map((c) => c.slug),
      ...getAllTagSlugs(),
    ])
  );
}

export interface FilterResult {
  type: "difficulty" | "category" | "tag";
  label: string;
  questions: InterviewQuestion[];
}

export function resolveFilter(key: string): FilterResult | null {
  const difficulty = DIFFICULTIES.find((d) => d.toLowerCase() === key);
  if (difficulty) {
    return {
      type: "difficulty",
      label: difficulty,
      questions: INTERVIEW_QUESTIONS.filter((q) => q.difficulty === difficulty),
    };
  }
  const category = getCategoryBySlug(key);
  if (category) {
    return {
      type: "category",
      label: category.name,
      questions: INTERVIEW_QUESTIONS.filter((q) => q.category === category.name),
    };
  }
  if (getAllTagSlugs().includes(key)) {
    return {
      type: "tag",
      label: key,
      questions: INTERVIEW_QUESTIONS.filter((q) => q.tags.includes(key)),
    };
  }
  return null;
}

export function resolveRelatedQuestions(slug: string): InterviewQuestion[] {
  const q = getQuestionBySlug(slug);
  if (!q?.relatedSlugs) return [];
  return q.relatedSlugs
    .map((s) => getQuestionBySlug(s))
    .filter((x): x is InterviewQuestion => Boolean(x));
}
