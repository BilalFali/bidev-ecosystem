import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Flutter mobile apps built by Bilal Fali — VTC platforms, e-commerce, tracking, and productivity apps on Google Play and App Store.",
};

const PROJECTS = [
  {
    name: "WegoFleet – Driver",
    desc: "Professional ride-hailing app for drivers. Real-time GPS tracking, trip management, earnings dashboard. Built with Flutter + Firebase + Socket.IO.",
    tags: ["Flutter", "Firebase", "Socket.IO", "Google Maps"],
    users: "30K+", platform: "Android & iOS", year: "2023",
    highlights: ["Real-time location tracking", "Google Sign-In auth", "Firebase push notifications", "Stripe payments"],
  },
  {
    name: "WegoFleet – Client",
    desc: "Passenger app for the WegoFleet platform. Book rides, track driver in real-time, manage payment methods.",
    tags: ["Flutter", "Firebase", "GetX", "Google Maps"],
    users: "20K+", platform: "Android & iOS", year: "2023",
    highlights: ["Live driver tracking", "In-app chat", "Trip history", "Rating system"],
  },
  {
    name: "PrivateLoc",
    desc: "Real-time location sharing for private groups. Share your location securely with family, friends, or teams.",
    tags: ["Flutter", "Firebase Realtime DB", "Bloc"],
    users: "15K+", platform: "Android", year: "2022",
    highlights: ["End-to-end encrypted sharing", "Background location", "Geo-fencing alerts"],
  },
  {
    name: "Ta7ssil",
    desc: "Payment collection and debt management app for Algerian market. Track what you owe and what you're owed.",
    tags: ["Flutter", "Supabase", "Riverpod"],
    users: "10K+", platform: "Android & iOS", year: "2023",
    highlights: ["Offline-first architecture", "PDF invoice export", "SMS reminders"],
  },
  {
    name: "Afnek",
    desc: "Service marketplace connecting clients with local service providers in Algeria.",
    tags: ["Flutter", "Firebase", "Provider"],
    users: "25K+", platform: "Android & iOS", year: "2022",
    highlights: ["Bidding system", "Secure messaging", "Review system", "Admin panel"],
  },
  {
    name: "RiseCart",
    desc: "Full e-commerce platform with vendor management, order tracking, and payment integration.",
    tags: ["Flutter", "Firebase", "Stripe", "GetX"],
    users: "5K+", platform: "Android & iOS", year: "2024",
    highlights: ["Multi-vendor support", "Stripe checkout", "Real-time order tracking"],
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-widest text-accent mb-3">Portfolio</p>
        <h1 className="text-4xl font-bold text-ink mb-3">Projects</h1>
        <p className="text-ink-muted max-w-lg">7+ Flutter apps published on Google Play and App Store, serving 100K+ active users combined.</p>
      </div>

      <div className="grid gap-6">
        {PROJECTS.map(p => (
          <div key={p.name} className="p-6 sm:p-8 rounded-xl border border-border bg-bg-card hover:border-border-strong transition-all">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-ink">{p.name}</h2>
                <div className="flex items-center gap-3 text-xs text-ink-faint mt-1">
                  <span>{p.platform}</span><span>·</span><span>{p.year}</span>
                  <span>·</span><span className="text-accent">{p.users} users</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-ink-muted mb-4 leading-relaxed">{p.desc}</p>
            <ul className="flex flex-col gap-1 mb-5">
              {p.highlights.map(h => (
                <li key={h} className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />{h}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {p.tags.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-bg-elevated border border-border text-ink-faint">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
