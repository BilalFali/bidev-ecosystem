import type { LucideIcon } from "lucide-react";
import { Puzzle, Zap, Flame, Building2, Database, Globe } from "lucide-react";

export interface LearnCategory {
  slug: string;
  name: string;
  icon: LucideIcon;
  intro: string;
  toolTags: string[];
  interviewCategories: string[];
}

// Only categories with real published article content behind them ship here —
// deliberately excludes Dart, Performance, and Troubleshooting until there's
// enough content to avoid a thin category page.
export const LEARN_CATEGORIES: LearnCategory[] = [
  {
    slug: "flutter",
    name: "Flutter",
    icon: Puzzle,
    intro:
      "Core Flutter development — widgets, platform APIs, and the day-to-day patterns you'll use building real apps. Start here if you're new to the framework or want to go deeper on the fundamentals.",
    toolTags: ["Flutter"],
    interviewCategories: ["Flutter Fundamentals", "Flutter Widgets"],
  },
  {
    slug: "state-management",
    name: "State Management",
    icon: Zap,
    intro:
      "Provider, Riverpod, BLoC, and GetX compared head-to-head, with guidance on which one actually fits your app instead of which one is trending.",
    toolTags: ["Flutter", "Dart"],
    interviewCategories: ["State Management"],
  },
  {
    slug: "firebase",
    name: "Firebase",
    icon: Flame,
    intro:
      "Wiring Firebase into a Flutter app the right way — authentication, push notifications, and the gotchas that don't show up until production.",
    toolTags: ["Flutter"],
    interviewCategories: ["Firebase Integration"],
  },
  {
    slug: "architecture",
    name: "Architecture",
    icon: Building2,
    intro:
      "Clean Architecture, folder structure, and dependency injection for Flutter apps that need to survive past the first release — not theory, actual production folder trees.",
    toolTags: ["Flutter", "Dart"],
    interviewCategories: ["Architecture"],
  },
  {
    slug: "data-storage",
    name: "Data & Storage",
    icon: Database,
    intro:
      "Local persistence in Flutter — SharedPreferences, Hive, Isar, Drift — and which one to actually pick in 2026 now that two of the big names have gone quiet.",
    toolTags: ["Flutter", "Dart"],
    interviewCategories: [],
  },
  {
    slug: "api-networking",
    name: "API & Networking",
    icon: Globe,
    intro:
      "REST APIs, Dio, and JSON in Flutter — building a networking layer that doesn't turn into a pile of try/catch blocks scattered across your screens.",
    toolTags: ["Flutter", "Dart"],
    interviewCategories: ["Async Programming"],
  },
];

export function getLearnCategoryBySlug(slug: string): LearnCategory | undefined {
  return LEARN_CATEGORIES.find((c) => c.slug === slug);
}
