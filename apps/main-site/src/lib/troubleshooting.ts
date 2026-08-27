import type { LucideIcon } from "lucide-react";
import { Puzzle, Smartphone, Apple, Flame, Target, Wifi, Hammer, Gauge } from "lucide-react";
import { getAllArticles, type Article } from "./articles";

export interface TroubleshootingCategory {
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export const TROUBLESHOOTING_CATEGORIES: TroubleshootingCategory[] = [
  { slug: "flutter",        name: "Flutter",        icon: Puzzle,     description: "Widget errors, layout overflows, lifecycle and async-state problems." },
  { slug: "android",        name: "Android",        icon: Smartphone, description: "Gradle, Android Manifest, SDK, and Kotlin/Java build problems." },
  { slug: "ios",            name: "iOS",             icon: Apple,      description: "CocoaPods, Xcode, signing, and provisioning problems." },
  { slug: "firebase",       name: "Firebase",       icon: Flame,      description: "Auth, Firestore, Cloud Messaging, and configuration errors." },
  { slug: "dart",           name: "Dart",           icon: Target,     description: "Null safety, type errors, and async/await problems." },
  { slug: "networking",     name: "Networking",     icon: Wifi,       description: "HTTP errors, timeouts, SSL, and JSON parsing problems." },
  { slug: "build-release",  name: "Build & Release", icon: Hammer,     description: "Release-only failures, R8/ProGuard, and signing problems." },
  { slug: "performance",    name: "Performance",    icon: Gauge,      description: "Slow apps, jank, excessive rebuilds, and memory problems." },
];

export function getTroubleshootingCategoryBySlug(slug: string): TroubleshootingCategory | undefined {
  return TROUBLESHOOTING_CATEGORIES.find((c) => c.slug === slug);
}

export async function getAllTroubleshootingArticles(): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.isTroubleshooting);
}

export async function getTroubleshootingArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const all = await getAllTroubleshootingArticles();
  return all.filter((a) => a.troubleshootingCategorySlug === categorySlug);
}

export async function getFeaturedTroubleshooting(limit = 6): Promise<Article[]> {
  const all = await getAllTroubleshootingArticles();
  const featured = all.filter((a) => a.featured);
  const rest = all.filter((a) => !a.featured);
  return [...featured, ...rest].slice(0, limit);
}
