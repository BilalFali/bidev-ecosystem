import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
  description: "Bilal Fali's work experience as a Flutter developer — DevGate, Codex, and freelance projects.",
};

const EXP = [
  {
    company: "DevGate Company", role: "Flutter Developer", period: "Feb 2022 – Present",
    current: true,
    achievements: [
      "Built and shipped 5+ production Flutter apps (Android & iOS)",
      "Developed WegoFleet — a VTC platform serving 30K+ drivers and passengers",
      "Implemented real-time GPS tracking using Socket.IO and Firebase",
      "Integrated payment gateways (Stripe), Google Maps, and Firebase Auth",
      "Reduced app loading time by 40% through performance optimization",
      "Successfully published all apps to Google Play Store and Apple App Store",
    ],
  },
  {
    company: "Codex Company", role: "Flutter Developer", period: "Oct 2021 – Feb 2022",
    current: false,
    achievements: [
      "Developed 3 client mobile applications from scratch",
      "Implemented real-time features using Firebase Realtime Database",
      "Integrated Google Sign-In and secure authentication flows",
      "Delivered projects on time within agreed scope",
    ],
  },
];

const EDU = [
  { school: "University of M'sila", degree: "Master's in Computer Science", period: "2019 – 2021" },
  { school: "University of M'sila", degree: "Bachelor's in Computer Science", period: "2016 – 2019" },
];

const SKILLS = {
  "Mobile":     ["Flutter", "Dart", "Android SDK", "iOS"],
  "Backend":    ["Firebase", "Supabase", "REST APIs", "GraphQL", "Socket.IO"],
  "State Mgmt":["GetX", "Bloc/Cubit", "Provider", "Riverpod"],
  "Tools":      ["Git", "GitHub", "Android Studio", "VS Code", "Postman", "Figma"],
  "Payments":   ["Stripe", "Payment gateway integration"],
  "Maps":       ["Google Maps Flutter", "Geolocator", "Real-time tracking"],
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-widest text-accent mb-3">Background</p>
        <h1 className="text-4xl font-bold text-ink mb-3">Experience</h1>
      </div>

      {/* Work */}
      <section className="mb-14">
        <h2 className="text-lg font-bold text-ink mb-6">Work Experience</h2>
        <div className="flex flex-col gap-6">
          {EXP.map(e => (
            <div key={e.company} className="relative pl-6 border-l-2 border-border">
              {e.current && <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" />}
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-ink">{e.role}</h3>
                  <p className="text-sm text-accent">{e.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  {e.current && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/25">Current</span>}
                  <span className="text-xs text-ink-faint">{e.period}</span>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5">
                {e.achievements.map(a => (
                  <li key={a} className="flex items-start gap-2 text-sm text-ink-muted">
                    <span className="text-accent mt-0.5 flex-shrink-0">→</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-14">
        <h2 className="text-lg font-bold text-ink mb-6">Education</h2>
        <div className="flex flex-col gap-4">
          {EDU.map(e => (
            <div key={e.degree} className="flex justify-between items-start p-5 rounded-xl border border-border bg-bg-card">
              <div>
                <h3 className="font-semibold text-ink">{e.degree}</h3>
                <p className="text-sm text-ink-muted">{e.school}</p>
              </div>
              <span className="text-xs text-ink-faint">{e.period}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-lg font-bold text-ink mb-6">Skills</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(SKILLS).map(([cat, items]) => (
            <div key={cat} className="p-5 rounded-xl border border-border bg-bg-card">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">{cat}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map(s => <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-bg-elevated border border-border text-ink-muted">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
