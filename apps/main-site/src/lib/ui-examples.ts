export interface UiExample {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  githubUrl: string;
  stars: number;
  license?: string;
}

export const UI_EXAMPLE_CATEGORIES = ["All", "Full App UI", "Widgets", "Collections"];

// Real, currently public open-source repos, verified individually before
// listing: star count, license, and the image URL all checked live, not
// pulled from a secondary "best of" list. Descriptions below are written
// for this site, not copied from each repo's own README.
export const UI_EXAMPLES: UiExample[] = [
  {
    slug: "best-flutter-ui-templates",
    title: "Best Flutter UI Templates",
    description: "A large, long-running collection of ready-made Flutter screens: onboarding animations, a hotel booking flow, a fitness app, a custom drawer, and a design-course layout. Good starting point if you want a working screen to adapt rather than build from a blank canvas.",
    category: "Collections",
    tags: ["ui-kit", "onboarding", "hotel-booking", "fitness"],
    image: "https://github.com/mitesh77/Best-Flutter-UI-Templates/raw/master/assets/introduction_animation.gif",
    githubUrl: "https://github.com/mitesh77/Best-Flutter-UI-Templates",
    stars: 22800,
  },
  {
    slug: "animated-bottom-navigation-bar",
    title: "Animated Bottom Navigation Bar",
    description: "A bottom navigation bar widget with a smooth tab-switch animation, published as the animated_bottom_navigation_bar package on pub.dev. Worth a look if Flutter's built-in BottomNavigationBar feels too static for what you're building.",
    category: "Widgets",
    tags: ["navigation", "animation", "pub-package"],
    image: "https://raw.githubusercontent.com/LanarsInc/animated-bottom-navigation-bar-flutter/master/doc/assets/animated-bottom-navigation-bar.gif",
    githubUrl: "https://github.com/LanarsInc/animated-bottom-navigation-bar-flutter",
    stars: 449,
    license: "BSD-2-Clause",
  },
  {
    slug: "hotel-booking-concept",
    title: "Hotel Booking Concept",
    description: "A promo-style hotel booking app implementing a Dribbble concept design on both iOS and Android. Useful as a reference for how to structure a search-to-booking flow with a polished, animation-heavy UI rather than a bare-bones form.",
    category: "Full App UI",
    tags: ["hotel-booking", "animation", "ios", "android"],
    image: "https://raw.githubusercontent.com/LanarsInc/hotel-booking-concept-flutter/master/preview_ios.gif",
    githubUrl: "https://github.com/LanarsInc/hotel-booking-concept-flutter",
    stars: 109,
    license: "BSD-2-Clause",
  },
  {
    slug: "free-flutter-banking-ui-kit",
    title: "Free Flutter Banking UI Kit",
    description: "A full set of banking-app screens: accounts overview, transfers, and transaction history. If you're building a fintech side project and don't want to design account-balance and transfer screens from scratch, this is a reasonable base to study.",
    category: "Full App UI",
    tags: ["banking", "fintech", "ui-kit"],
    image: "https://raw.githubusercontent.com/manishdayma/free_flutter_banking_ui_kits/main/screenshots/image1.jpg",
    githubUrl: "https://github.com/manishdayma/free_flutter_banking_ui_kits",
    stars: 66,
  },
  {
    slug: "doctor-appointment-app-ui",
    title: "Doctor Appointment App UI",
    description: "A scheduling app UI for booking and managing doctor appointments. The screen flow (browse doctors, pick a time slot, confirm) is a common pattern worth studying even outside healthcare, for any app built around booking a time slot.",
    category: "Full App UI",
    tags: ["booking", "healthcare", "mvvm"],
    image: "https://raw.githubusercontent.com/Hamad-Anwar/Doctor-Appointment-Application-UI/master/ui.png",
    githubUrl: "https://github.com/Hamad-Anwar/Doctor-Appointment-Application-UI",
    stars: 107,
    license: "MIT",
  },
  {
    slug: "flutter-weather-getx-mvvm",
    title: "Flutter Weather App (GetX + MVVM)",
    description: "A weather app pulling live data from a weather API, structured with GetX and an MVVM layering. A clear, small example of wiring a real external API into a Flutter app without a heavier state-management setup.",
    category: "Full App UI",
    tags: ["getx", "mvvm", "api", "weather"],
    image: "https://raw.githubusercontent.com/Hamad-Anwar/Flutter-Weather-With-APIs-GETX-MVVM/master/demo.png",
    githubUrl: "https://github.com/Hamad-Anwar/Flutter-Weather-With-APIs-GETX-MVVM",
    stars: 62,
    license: "MIT",
  },
  {
    slug: "direct-select",
    title: "Direct Select",
    description: "A selection widget that opens a full-screen modal of choices instead of a small dropdown, published as direct_select_flutter on pub.dev. A solid pick when a standard DropdownButton feels cramped on mobile.",
    category: "Widgets",
    tags: ["dropdown", "modal", "pub-package"],
    image: "https://raw.githubusercontent.com/LanarsInc/direct-select-flutter/master/example/direct-select-ios.gif",
    githubUrl: "https://github.com/LanarsInc/direct-select-flutter",
    stars: 834,
    license: "BSD-2-Clause",
  },
  {
    slug: "flutter-wallet-ui",
    title: "Flutter Wallet UI",
    description: "A digital-wallet app UI built as a design challenge: a home screen with balance and recent activity, plus an account overview page. A useful reference for laying out a card-and-balance style home screen.",
    category: "Full App UI",
    tags: ["wallet", "fintech", "ui-challenge"],
    image: "https://raw.githubusercontent.com/kalismeras61/flutter_wallet_ui/master/screens/homepage.png",
    githubUrl: "https://github.com/kalismeras61/flutter_wallet_ui",
    stars: 558,
    license: "BSD-2-Clause",
  },
];
