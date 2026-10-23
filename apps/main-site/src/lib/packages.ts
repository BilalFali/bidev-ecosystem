// Add new packages here — they appear on /packages automatically.
// Stats (likes, pub_points, popularity) are fetched live from pub.dev at build time.

import type { LucideIcon } from "lucide-react";
import { Timer, Languages } from "lucide-react";

export interface FlutterPackage {
  name: string;           // pub.dev package name (exact)
  description: string;    // shown on card
  githubUrl: string;      // GitHub repo
  icon: LucideIcon;
  category: PackageCategory;
  tags: string[];
  featured?: boolean;
}

export type PackageCategory =
  | "UI Components"
  | "Animation"
  | "State Management"
  | "Utilities"
  | "Navigation"
  | "Networking";

export const PACKAGES: FlutterPackage[] = [
  {
    name: "flutter_timer_button",
    description: "A customizable Flutter button with a built-in countdown timer. Useful for OTP resend, rate-limiting actions, and timed confirmations.",
    githubUrl: "https://github.com/BilalFali/flutter_timer_button",
    icon: Timer,
    category: "UI Components",
    tags: ["Button", "Timer", "OTP", "UI"],
    featured: true,
  },
  {
    name: "arabic_dev_utils",
    description: "A toolkit for Arabic and RTL Flutter/Dart apps — text normalization, diacritic-insensitive search, digit conversion, direction detection, and Hijri calendar conversion.",
    githubUrl: "https://github.com/BilalFali/arabic_dev_utils",
    icon: Languages,
    category: "Utilities",
    tags: ["Arabic", "RTL", "i18n", "Hijri"],
  },
];

export const PACKAGE_CATEGORIES: PackageCategory[] = [
  "UI Components",
  "Animation",
  "State Management",
  "Utilities",
  "Navigation",
  "Networking",
];
