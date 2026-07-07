// Add new packages here — they appear on /packages automatically.
// Stats (likes, pub_points, popularity) are fetched live from pub.dev at build time.

export interface FlutterPackage {
  name: string;           // pub.dev package name (exact)
  description: string;    // shown on card
  githubUrl: string;      // GitHub repo
  icon: string;           // emoji
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
    icon: "⏱️",
    category: "UI Components",
    tags: ["Button", "Timer", "OTP", "UI"],
    featured: true,
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
