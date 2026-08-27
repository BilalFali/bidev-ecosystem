// One-off seed: creates the 8 troubleshooting_categories rows and 6 flagship
// troubleshooting articles. Run once, after applying
// supabase/migrations/010_troubleshooting.sql.
//
//   npx tsx scripts/seed-troubleshooting.ts
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

const CATEGORIES = [
  { name: "Flutter", slug: "flutter", icon: "puzzle", sort_order: 1, description: "Widget errors, layout overflows, lifecycle and async-state problems.", seo_title: "Flutter Troubleshooting", meta_description: "Fix common Flutter widget, layout, and lifecycle errors." },
  { name: "Android", slug: "android", icon: "smartphone", sort_order: 2, description: "Gradle, Android Manifest, SDK, and Kotlin/Java build problems.", seo_title: "Android Flutter Troubleshooting", meta_description: "Fix Flutter Android build and Gradle errors." },
  { name: "iOS", slug: "ios", icon: "apple", sort_order: 3, description: "CocoaPods, Xcode, signing, and provisioning problems.", seo_title: "iOS Flutter Troubleshooting", meta_description: "Fix Flutter iOS build, CocoaPods, and Xcode errors." },
  { name: "Firebase", slug: "firebase", icon: "flame", sort_order: 4, description: "Auth, Firestore, Cloud Messaging, and configuration errors.", seo_title: "Firebase Flutter Troubleshooting", meta_description: "Fix Firebase errors in Flutter apps." },
  { name: "Dart", slug: "dart", icon: "target", sort_order: 5, description: "Null safety, type errors, and async/await problems.", seo_title: "Dart Troubleshooting", meta_description: "Fix Dart null safety and type errors." },
  { name: "Networking", slug: "networking", icon: "wifi", sort_order: 6, description: "HTTP errors, timeouts, SSL, and JSON parsing problems.", seo_title: "Flutter Networking Troubleshooting", meta_description: "Fix Flutter HTTP, Dio, and networking errors." },
  { name: "Build & Release", slug: "build-release", icon: "hammer", sort_order: 7, description: "Release-only failures, R8/ProGuard, and signing problems.", seo_title: "Flutter Build & Release Troubleshooting", meta_description: "Fix Flutter release build failures." },
  { name: "Performance", slug: "performance", icon: "gauge", sort_order: 8, description: "Slow apps, jank, excessive rebuilds, and memory problems.", seo_title: "Flutter Performance Troubleshooting", meta_description: "Fix slow Flutter apps and jank." },
];

const ARTICLES = [
  {
    title: "Flutter Gradle Build Failed: Common Causes and Fixes",
    slug: "flutter-gradle-build-failed",
    category_slug: "android",
    tags: ["flutter", "android", "gradle", "build"],
    error_message: "Execution failed for task ':app:compileDebugJavaWithJavac'.",
    problem: "Running `flutter build apk`, `flutter build appbundle`, or launching on an Android device fails during the Gradle build phase, often with a message like `Execution failed for task ':app:...'` or `Build failed with an exception.`",
    symptoms: [
      "Build fails during the Android Gradle build phase, not during Dart compilation",
      "Terminal shows `FAILURE: Build failed with an exception.`",
      "Error may reference a specific Gradle task, a missing dependency, or a version conflict",
    ],
    causes: [
      "Android Gradle Plugin (AGP) version is incompatible with the installed Gradle version",
      "compileSdk or minSdk in android/app/build.gradle is set lower than what a plugin requires",
      "Java/JDK version installed doesn't match what AGP expects (AGP 8+ requires JDK 17)",
      "A stale or corrupted Gradle cache from a previous Flutter/AGP upgrade",
      "Conflicting dependency versions pulled in by two different plugins",
    ],
    quick_fix: "Run `flutter clean`, delete the android/.gradle and ~/.gradle/caches directories, then rebuild. This resolves a large share of Gradle failures caused by stale cache state.",
    solutions: [
      { title: "1. Read the actual error above the 'FAILURE' banner", content: "Gradle's final 'Execution failed for task' line is a summary — the real cause is printed above it. Scroll up in the terminal, or run with `flutter build apk --verbose` for the full log, and look for the first red error rather than the last line." },
      { title: "2. Clear Gradle and Flutter build caches", content: "flutter clean\ncd android\n./gradlew clean\ncd ..\nflutter pub get\n\nThen rebuild. This clears stale compiled classes and dependency caches that commonly cause failures after upgrading Flutter, a plugin, or Android Studio." },
      { title: "3. Check AGP / Gradle / Java version compatibility", content: "Check the Android Gradle Plugin version in android/settings.gradle and the Gradle version in android/gradle/wrapper/gradle-wrapper.properties. As of AGP 8.x, JDK 17 is required. Run `java -version` and `flutter doctor -v` to confirm which JDK Flutter is using." },
      { title: "4. Check compileSdk and minSdk", content: "If the error mentions a plugin requiring a higher compileSdk, update `android { compileSdk = <value> }` in android/app/build.gradle to the version that plugin's documentation specifies." },
    ],
    verification_steps: [
      "Run flutter clean && flutter pub get",
      "Run flutter build apk (or flutter run) again and confirm it completes without the Gradle failure",
      "If it still fails, run with --verbose and confirm the actual root-cause line (not the summary) is resolved",
    ],
    common_mistakes: [
      "Only reading the last 'FAILURE' line instead of scrolling up to the actual error",
      "Upgrading the Android Gradle Plugin without checking the required Gradle and JDK versions",
      "Clearing the wrong cache (e.g. pub cache) when the problem is Gradle-specific",
    ],
    affected_platforms: ["android"],
    difficulty: "Intermediate",
    seo_title: "Flutter Gradle Build Failed: Causes and Fixes",
    meta_description: "Diagnose and fix Flutter Gradle build failures — AGP/Gradle/JDK version mismatches, stale caches, and dependency conflicts.",
    related_problems: ["flutter-app-works-debug-but-fails-release"],
    related_guides: [],
  },
  {
    title: "Flutter RenderFlex Overflowed by Pixels: How to Fix It",
    slug: "flutter-renderflex-overflowed-by-pixels",
    category_slug: "flutter",
    tags: ["flutter", "widgets", "ui"],
    error_message: "A RenderFlex overflowed by 42 pixels on the right.",
    problem: "A Row, Column, or other Flex-based widget renders content that doesn't fit within the space available to it, and Flutter shows a yellow-and-black striped overflow warning in debug mode.",
    symptoms: [
      "Yellow/black diagonal-striped overflow indicator appears in the UI",
      "Console prints 'A RenderFlex overflowed by X pixels on the [right/bottom]'",
      "Layout looks fine on one screen size but overflows on smaller ones",
    ],
    causes: [
      "A Row's children collectively need more horizontal space than the Row has available",
      "A Column's children need more vertical space than is available",
      "Text with a long string and no wrapping/constraint applied",
      "A widget given a fixed width/height that doesn't shrink for smaller screens",
      "Missing Expanded/Flexible around a child that should share space instead of taking its natural size",
    ],
    quick_fix: "Wrap the specific child that's too large in Expanded (if it should grow to fill space) or Flexible (if it should shrink but not necessarily fill), or wrap the whole Row/Column in a SingleChildScrollView if the content is meant to scroll.",
    solutions: [
      { title: "1. Use Expanded for children that should share available space", content: "Row(\n  children: [\n    Expanded(child: Text('This text will wrap instead of overflowing')),\n    Icon(Icons.star),\n  ],\n)\n\nExpanded forces its child to fill the remaining space, and works with Text to enable wrapping instead of overflowing." },
      { title: "2. Use Flexible when the child should shrink but not fill", content: "Flexible(\n  child: Text('...', overflow: TextOverflow.ellipsis),\n)\n\nUnlike Expanded, Flexible lets its child be smaller than the available space — useful when you don't want to force-stretch a widget." },
      { title: "3. Wrap in SingleChildScrollView if the content is genuinely too big", content: "If the content is meant to be fully visible but doesn't fit on smaller screens, wrap the Row or Column in a SingleChildScrollView with the appropriate scrollDirection." },
      { title: "4. Use Wrap instead of Row when items should flow to the next line", content: "Wrap(\n  children: [ /* chips, tags, buttons */ ],\n)\n\nWrap automatically moves children to a new line when they don't fit — often the correct fix for a Row of variable-width items." },
    ],
    verification_steps: [
      "Hot reload and confirm the yellow/black overflow stripes are gone",
      "Resize the app window or test on a smaller device/emulator to confirm the layout holds at smaller widths",
      "Check that text truncates or wraps as intended rather than being clipped unexpectedly",
    ],
    common_mistakes: [
      "Wrapping in Expanded when Flexible was actually needed, causing over-stretching",
      "Fixing the overflow only on one screen size without testing smaller devices",
      "Using a fixed width/height instead of a relative constraint that adapts to screen size",
    ],
    affected_platforms: ["android", "ios", "web"],
    difficulty: "Beginner",
    seo_title: "Flutter RenderFlex Overflowed by Pixels: How to Fix It",
    meta_description: "Fix the 'RenderFlex overflowed by pixels' warning in Flutter using Expanded, Flexible, Wrap, or SingleChildScrollView.",
    related_problems: ["flutter-setstate-called-after-dispose"],
    related_guides: [],
  },
  {
    title: "Firebase Messaging Not Working in Flutter",
    slug: "firebase-messaging-not-working-flutter",
    category_slug: "firebase",
    tags: ["flutter", "firebase", "fcm", "push-notifications"],
    error_message: "",
    problem: "Push notifications sent via Firebase Cloud Messaging (FCM) aren't being received on an Android or iOS device running a Flutter app, even though the send appears to succeed from the Firebase Console or backend.",
    symptoms: [
      "Notification sent successfully from Firebase Console/Admin SDK, but never appears on the device",
      "App receives notifications in the foreground but not when backgrounded or terminated (or vice versa)",
      "Works on Android but not iOS, or vice versa",
    ],
    causes: [
      "google-services.json (Android) or GoogleService-Info.plist (iOS) is missing, outdated, or linked to the wrong Firebase project",
      "On iOS, no valid APNs authentication key/certificate is configured in the Firebase Console — FCM relies on Apple's push service for delivery",
      "Notification permission was never requested/granted on iOS (or Android 13+, which also requires runtime permission)",
      "The FCM device token wasn't retrieved or wasn't sent to the backend triggering the notification",
      "No foreground message handler registered — FCM does not automatically display a system notification while the app is in the foreground",
      "Missing or incorrectly registered background message handler (must be a top-level or static function)",
    ],
    quick_fix: "Confirm the device actually has a valid FCM token and that notification permission was granted — these are the two most common root causes.",
    solutions: [
      { title: "1. Verify configuration and permissions (Android)", content: "Confirm google-services.json in android/app matches the Firebase project you're sending from, and request notification permission at runtime on Android 13+:\n\nfinal status = await FirebaseMessaging.instance.requestPermission();\nprint(status.authorizationStatus);" },
      { title: "2. Verify APNs setup (iOS)", content: "In the Firebase Console under Project Settings > Cloud Messaging, confirm an APNs Authentication Key (or certificate) is uploaded — without it, FCM cannot deliver to iOS devices at all. Also confirm Push Notifications capability is enabled in Xcode's Signing & Capabilities." },
      { title: "3. Request permission and check the token", content: "final settings = await FirebaseMessaging.instance.requestPermission(\n  alert: true, badge: true, sound: true,\n);\nfinal token = await FirebaseMessaging.instance.getToken();\nprint('FCM token: \\$token');\n\nIf getToken() returns null or throws, the app isn't registered with FCM/APNs correctly yet." },
      { title: "4. Handle foreground messages explicitly", content: "FCM does not show a system notification while your app is in the foreground:\n\nFirebaseMessaging.onMessage.listen((RemoteMessage message) {\n  // show your own in-app notification/snackbar here\n});" },
      { title: "5. Register a top-level background handler", content: "@pragma('vm:entry-point')\nFuture<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {\n  await Firebase.initializeApp();\n}\n\nvoid main() {\n  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);\n  runApp(MyApp());\n}" },
    ],
    verification_steps: [
      "Print and confirm a non-null FCM token on the target device",
      "Send a test message directly to that token from the Firebase Console",
      "Test all three app states separately: foreground, backgrounded, and terminated",
      "On iOS, test on a physical device — APNs does not deliver remote push to the Simulator",
    ],
    common_mistakes: [
      "Testing push notifications on the iOS Simulator, which cannot receive real remote push",
      "Assuming a successful 'send' in the Firebase Console means delivery succeeded",
      "Forgetting foreground messages need a manually-built UI, unlike background/terminated notifications",
    ],
    affected_platforms: ["android", "ios"],
    difficulty: "Intermediate",
    seo_title: "Firebase Messaging Not Working in Flutter: Complete Fix",
    meta_description: "Fix Firebase Cloud Messaging not working in Flutter — Android permissions, iOS APNs setup, foreground handling, and background handlers.",
    related_problems: [],
    related_guides: ["firebase-push-notifications-flutter"],
  },
  {
    title: "Flutter CocoaPods Error: Common Causes and Fixes",
    slug: "flutter-cocoapods-error",
    category_slug: "ios",
    tags: ["flutter", "ios", "cocoapods", "xcode"],
    error_message: "[!] CocoaPods could not find compatible versions for pod ...",
    problem: "Running flutter build ios, flutter run on an iOS device/simulator, or pod install inside the ios/ directory fails with a CocoaPods dependency error.",
    symptoms: [
      "Build fails during the 'Running pod install' step of a Flutter iOS build",
      "Terminal shows [!] CocoaPods could not find compatible versions... or a similar resolution failure",
      "Error may reference a specific pod, a deployment target mismatch, or a stale Podfile.lock",
    ],
    causes: [
      "CocoaPods itself is outdated relative to what the installed pods require",
      "Two plugins/pods require incompatible versions of a shared dependency",
      "The Podfile's platform :ios deployment target is lower than what a plugin requires",
      "A stale Podfile.lock or Pods/ directory from before a Flutter/plugin upgrade",
      "Xcode command line tools path is misconfigured, so CocoaPods can't find the right Xcode version",
    ],
    quick_fix: "From the ios/ directory, run `pod deintegrate && pod install` to fully reset CocoaPods' state — this resolves the majority of dependency-resolution errors caused by stale lock files.",
    solutions: [
      { title: "1. Update CocoaPods", content: "sudo gem install cocoapods\npod repo update\n\nAn outdated CocoaPods version is a common source of resolution errors with newer plugins." },
      { title: "2. Clean and reinstall pods", content: "cd ios\npod deintegrate\nrm -rf Pods Podfile.lock\npod install\ncd ..\n\nThis removes all cached pod state and re-resolves dependencies from scratch." },
      { title: "3. Raise the deployment target in the Podfile", content: "Open ios/Podfile and check the platform line:\n\nplatform :ios, '13.0'\n\nIf a plugin requires a higher iOS deployment target, raise it here and in Xcode's Runner target settings." },
      { title: "4. Read the actual conflicting pod names in the error", content: "CocoaPods' resolution error lists exactly which pods conflict and why. Check each conflicting plugin's pubspec.yaml version against its changelog — one plugin often needs to be upgraded or downgraded to align with the others." },
    ],
    verification_steps: [
      "Run flutter clean, then flutter build ios (or flutter run) again",
      "Confirm pod install completes without errors and generates a fresh Podfile.lock",
      "Open ios/Runner.xcworkspace (not .xcodeproj) in Xcode and confirm it builds",
    ],
    common_mistakes: [
      "Opening Runner.xcodeproj instead of Runner.xcworkspace after CocoaPods is involved",
      "Deleting Podfile.lock without running pod install afterward",
      "Ignoring the deployment target requirement stated in a plugin's own documentation",
    ],
    affected_platforms: ["ios"],
    difficulty: "Intermediate",
    seo_title: "Flutter CocoaPods Error: How to Fix It",
    meta_description: "Fix common Flutter CocoaPods errors on iOS — dependency conflicts, outdated CocoaPods, and deployment target mismatches.",
    related_problems: [],
    related_guides: [],
  },
  {
    title: "Flutter App Works in Debug but Fails in Release",
    slug: "flutter-app-works-debug-but-fails-release",
    category_slug: "build-release",
    tags: ["flutter", "android", "ios", "release", "r8"],
    error_message: "",
    problem: "The app runs correctly with flutter run (debug mode) but crashes, behaves incorrectly, or fails to build entirely in release mode (flutter build apk --release, flutter build ipa, or flutter run --release).",
    symptoms: [
      "App works perfectly via flutter run but crashes immediately in a release build",
      "A feature depending on reflection or dynamic class names stops working only in release",
      "Release build succeeds but a network call, Firebase feature, or plugin fails at runtime",
    ],
    causes: [
      "R8/ProGuard (Android's code shrinker, enabled by default in release builds) removes or renames a class accessed via reflection",
      "Environment-specific configuration (API keys, base URLs) that differs between debug and release builds",
      "Firebase or other native SDK configuration files not correctly included in the release build variant",
      "Code that branches on kDebugMode/kReleaseMode and was never tested in the release path",
      "Signing configuration issues specific to release builds",
    ],
    quick_fix: "Run flutter run --release locally so you can see the actual crash log, instead of debugging blind from user reports.",
    solutions: [
      { title: "1. Reproduce locally with flutter run --release", content: "flutter run --release\n\nThis gives you a live, attached release build with crash output in the terminal — far faster than reasoning from a report with no logs." },
      { title: "2. Check for R8/ProGuard-related crashes", content: "If the crash mentions a ClassNotFoundException or a missing method only in release, a plugin relying on reflection was stripped. Add a -keep rule for the affected class in android/app/proguard-rules.pro, following that plugin's documented ProGuard rules." },
      { title: "3. Diff debug vs release configuration", content: "Check for code branching on kDebugMode/kReleaseMode, different .env/build-flavor files, and confirm the same Firebase config files and API endpoints are used in both build variants." },
      { title: "4. Check native crash logs, not just Flutter's", content: "For Android, run adb logcat while the release build is running to see native-level exceptions. For iOS, use Xcode's device console or Instruments." },
    ],
    verification_steps: [
      "Confirm the release build now runs the previously-failing path successfully via flutter run --release",
      "Test on a real device, not just an emulator",
      "If a ProGuard/R8 keep rule was added, confirm app size didn't unexpectedly balloon",
    ],
    common_mistakes: [
      "Debugging only from crash reports without ever running flutter run --release locally",
      "Disabling code shrinking entirely instead of adding a targeted keep rule",
      "Assuming a release-only crash is a Flutter bug rather than checking native logs first",
    ],
    affected_platforms: ["android", "ios"],
    difficulty: "Advanced",
    seo_title: "Flutter App Works in Debug but Fails in Release: How to Fix It",
    meta_description: "Diagnose Flutter apps that work in debug but crash in release — R8/ProGuard, config differences, and debugging release builds locally.",
    related_problems: ["flutter-gradle-build-failed"],
    related_guides: [],
  },
  {
    title: "Flutter setState Called After Dispose: How to Fix It",
    slug: "flutter-setstate-called-after-dispose",
    category_slug: "flutter",
    tags: ["flutter", "state-management", "async"],
    error_message: "setState() called after dispose(): _MyWidgetState#a1b2c3(lifecycle state: defunct, not mounted)",
    problem: "An asynchronous operation (a network call, a Future, a Timer, a stream callback) completes and calls setState() after the widget that started it has already been removed from the widget tree.",
    symptoms: [
      "Console exception: 'setState() called after dispose()'",
      "Happens intermittently — usually when a user navigates away before an async operation finishes",
      "More common on slower network connections where the async gap is longer",
    ],
    causes: [
      "An async function awaits a network call, then calls setState() without checking whether the widget is still mounted",
      "A Timer or AnimationController keeps running after the widget is disposed because it was never cancelled in dispose()",
      "A StreamSubscription's callback fires after the widget is gone because the subscription was never cancelled",
      "The user navigated back or the widget was removed from the tree while a Future was still pending",
    ],
    quick_fix: "Check `if (!mounted) return;` immediately after every await and before every setState() call inside an async method.",
    solutions: [
      { title: "1. Guard setState with a mounted check", content: "Future<void> _loadData() async {\n  final result = await fetchData();\n  if (!mounted) return; // widget may have been disposed while awaiting\n  setState(() {\n    _data = result;\n  });\n}" },
      { title: "2. Cancel timers and subscriptions in dispose()", content: "class _MyWidgetState extends State<MyWidget> {\n  StreamSubscription? _subscription;\n  Timer? _timer;\n\n  @override\n  void dispose() {\n    _subscription?.cancel();\n    _timer?.cancel();\n    super.dispose();\n  }\n}" },
      { title: "3. Re-check mounted after an await before using BuildContext", content: "Future<void> _submit() async {\n  await someAsyncCall();\n  if (!context.mounted) return; // Flutter 3.7+ exposes context.mounted directly\n  Navigator.of(context).pop();\n}" },
    ],
    verification_steps: [
      "Trigger the async operation, then quickly navigate away before it completes, and confirm no exception is thrown",
      "Run in debug mode and watch the console during rapid navigation to confirm the warning no longer appears",
      "Confirm timers/subscriptions are actually being cancelled",
    ],
    common_mistakes: [
      "Checking mounted before the await instead of after it — the widget can be disposed during the await itself",
      "Relying only on the mounted check without cancelling Timers/StreamSubscriptions",
      "Mixing up StatefulWidget's mounted property and context.mounted inconsistently",
    ],
    affected_platforms: ["android", "ios", "web"],
    difficulty: "Beginner",
    seo_title: "Flutter setState Called After Dispose: How to Fix It",
    meta_description: "Fix the 'setState() called after dispose()' error in Flutter using mounted checks and proper cleanup of timers and subscriptions.",
    related_problems: ["flutter-renderflex-overflowed-by-pixels"],
    related_guides: [],
  },
];

async function main() {
  const { data: cats, error: catErr } = await supabase
    .from("troubleshooting_categories")
    .upsert(CATEGORIES, { onConflict: "slug" })
    .select("id,slug");

  if (catErr) {
    console.error("CATEGORY SEED FAILED:", catErr.message);
    process.exit(1);
  }
  console.log(`Seeded ${cats?.length ?? 0} troubleshooting categories.`);

  const catBySlug = Object.fromEntries((cats ?? []).map((c) => [c.slug, c.id]));

  const { data: existingArticle } = await supabase.from("articles").select("author_id").limit(1).single();
  const authorId = existingArticle?.author_id;
  if (!authorId) {
    console.error("Could not find an existing author_id to attribute seed articles to.");
    process.exit(1);
  }

  const rows = ARTICLES.map((a) => ({
    title: a.title,
    slug: a.slug,
    content: "",
    excerpt: a.problem,
    status: "draft",
    author_id: authorId,
    is_troubleshooting: true,
    troubleshooting_category_id: catBySlug[a.category_slug] ?? null,
    error_message: a.error_message || null,
    problem: a.problem,
    symptoms: a.symptoms,
    causes: a.causes,
    quick_fix: a.quick_fix,
    solutions: a.solutions,
    verification_steps: a.verification_steps,
    common_mistakes: a.common_mistakes,
    affected_platforms: a.affected_platforms,
    technologies: a.tags,
    difficulty: a.difficulty,
    related_problems: a.related_problems,
    related_guides: a.related_guides,
    seo_title: a.seo_title,
    seo_description: a.meta_description,
    seo_keywords: a.tags,
    reading_time: 4,
  }));

  const { data, error } = await supabase.from("articles").upsert(rows, { onConflict: "slug" }).select("id,slug");

  if (error) {
    console.error("ARTICLE SEED FAILED:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${data?.length ?? 0} troubleshooting articles (status: draft).`);

  // Link tags via the existing tags/article_tags many-to-many system
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const allTagNames = Array.from(new Set(ARTICLES.flatMap((a) => a.tags)));
  const { data: tagRows, error: tagErr } = await supabase
    .from("tags")
    .upsert(allTagNames.map((name) => ({ name, slug: slugify(name) })), { onConflict: "slug" })
    .select("id,name");

  if (tagErr) {
    console.error("TAG SEED FAILED:", tagErr.message);
    return;
  }

  const tagIdByName = Object.fromEntries((tagRows ?? []).map((t) => [t.name, t.id]));
  const articleIdBySlug = Object.fromEntries((data ?? []).map((a) => [a.slug, a.id]));

  for (const a of ARTICLES) {
    const articleId = articleIdBySlug[a.slug];
    if (!articleId) continue;
    await supabase.from("article_tags").delete().eq("article_id", articleId);
    const links = a.tags.map((name) => ({ article_id: articleId, tag_id: tagIdByName[name] })).filter((l) => l.tag_id);
    if (links.length > 0) await supabase.from("article_tags").insert(links);
  }

  console.log(`Linked ${allTagNames.length} tags to seeded articles.`);
}

main();
