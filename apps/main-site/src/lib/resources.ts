import type { LucideIcon } from "lucide-react";
import { BookOpen, Package, Zap, Video, MessageCircle, Wrench, Book, Folder } from "lucide-react";

export interface Resource {
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  badge?: string;
  free: boolean;
}

export const RESOURCE_CATEGORIES = [
  "All",
  "Official Docs",
  "Packages",
  "State Management",
  "YouTube & Courses",
  "Communities",
  "Tools",
  "Books",
];

export const RESOURCE_CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Official Docs":     BookOpen,
  "Packages":          Package,
  "State Management":  Zap,
  "YouTube & Courses": Video,
  "Communities":       MessageCircle,
  "Tools":             Wrench,
  "Books":             Book,
};

export const RESOURCE_CATEGORY_FALLBACK_ICON: LucideIcon = Folder;

export const RESOURCES: Resource[] = [
  // ── Official Docs ──────────────────────────────────────────────────────
  {
    title: "Flutter Documentation",
    description: "The official Flutter docs — widgets, cookbook, API reference, and migration guides.",
    url: "https://docs.flutter.dev",
    category: "Official Docs",
    tags: ["official", "reference"],
    badge: "Official",
    free: true,
  },
  {
    title: "Dart Language Tour",
    description: "Comprehensive guide to Dart syntax, null safety, async/await, and language features.",
    url: "https://dart.dev/language",
    category: "Official Docs",
    tags: ["dart", "official", "language"],
    badge: "Official",
    free: true,
  },
  {
    title: "pub.dev",
    description: "The official Dart and Flutter package repository. Search, compare, and evaluate packages.",
    url: "https://pub.dev",
    category: "Official Docs",
    tags: ["packages", "dart", "pub"],
    badge: "Official",
    free: true,
  },
  {
    title: "Flutter Widget of the Week",
    description: "Short YouTube videos explaining individual Flutter widgets. Great for discovering built-in widgets.",
    url: "https://www.youtube.com/playlist?list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG",
    category: "Official Docs",
    tags: ["video", "widgets", "official"],
    free: true,
  },
  // ── Packages ───────────────────────────────────────────────────────────
  {
    title: "flutter_bloc",
    description: "Most popular state management library implementing the BLoC pattern with Cubit support.",
    url: "https://pub.dev/packages/flutter_bloc",
    category: "Packages",
    tags: ["bloc", "state-management"],
    badge: "Top Pick",
    free: true,
  },
  {
    title: "riverpod",
    description: "Compile-safe, testable state management with code generation. Modern alternative to Provider.",
    url: "https://pub.dev/packages/riverpod",
    category: "Packages",
    tags: ["riverpod", "state-management"],
    free: true,
  },
  {
    title: "get",
    description: "All-in-one package: state management, navigation, dependency injection with minimal boilerplate.",
    url: "https://pub.dev/packages/get",
    category: "Packages",
    tags: ["getx", "state-management", "navigation"],
    free: true,
  },
  {
    title: "go_router",
    description: "Official Flutter navigation package — declarative routing with deep links and nested navigation.",
    url: "https://pub.dev/packages/go_router",
    category: "Packages",
    tags: ["navigation", "routing", "official"],
    badge: "Official",
    free: true,
  },
  {
    title: "dio",
    description: "Powerful HTTP client with interceptors, FormData, request cancellation, retry, and more.",
    url: "https://pub.dev/packages/dio",
    category: "Packages",
    tags: ["http", "networking"],
    badge: "Top Pick",
    free: true,
  },
  {
    title: "freezed",
    description: "Code generation for immutable classes — union types, pattern matching, copyWith, and serialization.",
    url: "https://pub.dev/packages/freezed",
    category: "Packages",
    tags: ["codegen", "immutable", "serialization"],
    free: true,
  },
  {
    title: "json_serializable",
    description: "Automatic fromJson/toJson generation. The standard for JSON serialization in Flutter.",
    url: "https://pub.dev/packages/json_serializable",
    category: "Packages",
    tags: ["json", "codegen", "serialization"],
    free: true,
  },
  {
    title: "hive",
    description: "Fast NoSQL database written in pure Dart. Great for offline-first apps and local caching.",
    url: "https://pub.dev/packages/hive",
    category: "Packages",
    tags: ["database", "local-storage", "offline"],
    free: true,
  },
  {
    title: "isar",
    description: "The successor to Hive. Extremely fast cross-platform NoSQL database with a powerful query engine.",
    url: "https://pub.dev/packages/isar",
    category: "Packages",
    tags: ["database", "local-storage"],
    badge: "Top Pick",
    free: true,
  },
  {
    title: "cached_network_image",
    description: "Load and cache network images with placeholder and error widgets. Essential for any image-heavy app.",
    url: "https://pub.dev/packages/cached_network_image",
    category: "Packages",
    tags: ["images", "performance", "caching"],
    free: true,
  },
  {
    title: "get_it",
    description: "Simple service locator for dependency injection — no BuildContext needed anywhere.",
    url: "https://pub.dev/packages/get_it",
    category: "Packages",
    tags: ["di", "dependency-injection"],
    free: true,
  },
  {
    title: "equatable",
    description: "Simplifies equality comparisons in Dart. Essential when using value-based BLoC states.",
    url: "https://pub.dev/packages/equatable",
    category: "Packages",
    tags: ["equality", "bloc"],
    free: true,
  },
  // ── State Management ───────────────────────────────────────────────────
  {
    title: "BLoC Library Docs",
    description: "Official documentation for flutter_bloc including tutorials, architecture, and migration guides.",
    url: "https://bloclibrary.dev",
    category: "State Management",
    tags: ["bloc", "docs"],
    free: true,
  },
  {
    title: "Riverpod Docs",
    description: "Official Riverpod documentation with migration guides, code examples, and best practices.",
    url: "https://riverpod.dev",
    category: "State Management",
    tags: ["riverpod", "docs"],
    free: true,
  },
  {
    title: "GetX Docs",
    description: "GetX documentation covering state management, navigation, dependency injection, and utilities.",
    url: "https://github.com/jonataslaw/getx",
    category: "State Management",
    tags: ["getx", "docs"],
    free: true,
  },
  // ── YouTube & Courses ──────────────────────────────────────────────────
  {
    title: "Reso Coder",
    description: "Clean Architecture, TDD, BLoC, and advanced Flutter patterns. The go-to channel for architecture.",
    url: "https://www.youtube.com/@ResoCoder",
    category: "YouTube & Courses",
    tags: ["youtube", "clean-architecture", "bloc"],
    badge: "Top Pick",
    free: true,
  },
  {
    title: "Flutter Explained",
    description: "Clear, concise Flutter tutorials covering widgets, state management, and deployment.",
    url: "https://www.youtube.com/@FlutterExplained",
    category: "YouTube & Courses",
    tags: ["youtube", "tutorials"],
    free: true,
  },
  {
    title: "Vandad Nahavandipoor",
    description: "Advanced Dart and Flutter patterns, algorithms, and deep-dives into framework internals.",
    url: "https://www.youtube.com/@vandadnp",
    category: "YouTube & Courses",
    tags: ["youtube", "advanced", "dart"],
    free: true,
  },
  {
    title: "The Boring Flutter Development Show",
    description: "Official Flutter team live-coding sessions. See how Flutter engineers solve real problems.",
    url: "https://www.youtube.com/playlist?list=PLjxrf2q8roU3ahJVrSgAnPjzkpGmL9Czl",
    category: "YouTube & Courses",
    tags: ["youtube", "official", "live-coding"],
    free: true,
  },
  {
    title: "App Brewery Flutter Bootcamp",
    description: "Comprehensive beginner-to-intermediate course. Best starting point for Flutter newcomers.",
    url: "https://www.udemy.com/course/flutter-bootcamp-with-dart",
    category: "YouTube & Courses",
    tags: ["udemy", "course", "beginner"],
    free: false,
  },
  // ── Communities ────────────────────────────────────────────────────────
  {
    title: "Flutter Community (Reddit)",
    description: "Active Reddit community with announcements, help, showcase posts, and discussions.",
    url: "https://www.reddit.com/r/FlutterDev",
    category: "Communities",
    tags: ["reddit", "community"],
    free: true,
  },
  {
    title: "Flutter Discord",
    description: "Official Flutter Discord server with channels for help, announcements, and job listings.",
    url: "https://discord.gg/flutter",
    category: "Communities",
    tags: ["discord", "community", "official"],
    badge: "Official",
    free: true,
  },
  {
    title: "Stack Overflow – Flutter",
    description: "The largest Q&A database for Flutter questions. Search before asking — answer is usually there.",
    url: "https://stackoverflow.com/questions/tagged/flutter",
    category: "Communities",
    tags: ["stackoverflow", "q&a"],
    free: true,
  },
  // ── Tools ──────────────────────────────────────────────────────────────
  {
    title: "DartPad",
    description: "Official online Dart/Flutter editor. Run code, share snippets, and test widgets in the browser.",
    url: "https://dartpad.dev",
    category: "Tools",
    tags: ["online-editor", "playground", "official"],
    badge: "Official",
    free: true,
  },
  {
    title: "FlutterFlow",
    description: "Low-code Flutter app builder. Exports clean Flutter code you can continue developing.",
    url: "https://flutterflow.io",
    category: "Tools",
    tags: ["low-code", "builder"],
    free: false,
  },
  {
    title: "Mason CLI",
    description: "Flutter template system for generating boilerplate code. Create and share custom bricks.",
    url: "https://pub.dev/packages/mason_cli",
    category: "Tools",
    tags: ["cli", "codegen", "templates"],
    free: true,
  },
  {
    title: "Flutter Gen",
    description: "Code generator for Flutter assets — no more string literals for images, fonts, and colors.",
    url: "https://pub.dev/packages/flutter_gen",
    category: "Tools",
    tags: ["codegen", "assets"],
    free: true,
  },
  // ── Books ──────────────────────────────────────────────────────────────
  {
    title: "Flutter Apprentice (raywenderlich)",
    description: "Step-by-step book for learning Flutter from beginner to intermediate. Updated for latest Flutter.",
    url: "https://www.kodeco.com/books/flutter-apprentice",
    category: "Books",
    tags: ["book", "beginner"],
    free: false,
  },
  {
    title: "Pragmatic Flutter",
    description: "Building cross-platform apps for Android, iOS, Web, and Desktop. Practical patterns and architectures.",
    url: "https://www.amazon.com/Pragmatic-Flutter-Building-Cross-Platform-Applications/dp/1484266021",
    category: "Books",
    tags: ["book", "intermediate"],
    free: false,
  },
];
