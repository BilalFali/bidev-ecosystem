import Link from "next/link";

const STACK = ["Flutter", "Dart", "Firebase", "Supabase", "GetX", "Bloc", "REST APIs", "Google Maps", "Stripe", "Git"];

const APPS = [
  { name: "WegoFleet",  desc: "VTC ride-hailing platform",   users: "30K+", store: "both" },
  { name: "PrivateLoc", desc: "Real-time location sharing",  users: "15K+", store: "android" },
  { name: "Ta7ssil",    desc: "Payment collection app",      users: "10K+", store: "both" },
  { name: "Afnek",      desc: "Service marketplace",         users: "25K+", store: "both" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="relative">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-accent/5 rounded-full blur-[80px] -z-10" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/8 text-green-400 text-xs font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Available for freelance projects
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-ink leading-[1.05] mb-6">
          Bilal Fali
          <br />
          <span className="text-gradient-accent">Flutter Developer</span>
        </h1>
        <p className="text-xl text-ink-muted max-w-xl leading-relaxed mb-10">
          I build cross-platform mobile apps with Flutter that scale to hundreds of thousands of users.
          Based in Algeria, working worldwide.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/projects" className="px-8 py-3.5 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-all shadow-[0_0_30px_rgba(129,140,248,0.2)]">
            View Projects →
          </Link>
          <Link href="/contact" className="px-8 py-3.5 rounded-xl border border-border bg-bg-card text-ink font-semibold text-sm hover:border-border-strong hover:bg-bg-elevated transition-all">
            Hire Me
          </Link>
          <a href="https://drive.google.com/file/d/1EwRJ_6Ns7tWK7AIOCP6MSJx3Qamc5_Xr" target="_blank" rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl text-ink-muted text-sm hover:text-ink transition-colors">
            Download CV ↗
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap gap-x-12 gap-y-6">
          {[["5+","Years Flutter"],["100K+","App Users"],["7+","Apps Published"],["2","App Stores"]].map(([v,l]) => (
            <div key={l} className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-gradient-accent">{v}</span>
              <span className="text-xs text-ink-muted">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 border-t border-border">
        <p className="text-xs uppercase tracking-widest text-ink-faint mb-6">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {STACK.map(t => (
            <span key={t} className="px-4 py-2 rounded-lg border border-border bg-bg-card text-sm text-ink-muted hover:border-accent/40 hover:text-accent transition-colors">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Apps */}
      <section className="py-16 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent mb-2">Featured Work</p>
            <h2 className="text-2xl font-bold text-ink">Apps I've Shipped</h2>
          </div>
          <Link href="/projects" className="text-sm text-ink-muted hover:text-accent transition-colors">All projects →</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {APPS.map(app => (
            <Link key={app.name} href="/projects"
              className="group p-6 rounded-xl border border-border bg-bg-card hover:border-accent/30 hover:bg-bg-elevated transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-ink group-hover:text-accent transition-colors">{app.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">{app.users} users</span>
              </div>
              <p className="text-sm text-ink-muted">{app.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border mb-8">
        <div className="p-8 rounded-2xl border border-accent/20 bg-gradient-to-br from-bg-card to-bg-secondary text-center">
          <h2 className="text-2xl font-bold text-ink mb-3">Have a project in mind?</h2>
          <p className="text-ink-muted mb-6">I'm currently accepting freelance projects. Let's build something great.</p>
          <Link href="/contact" className="inline-flex px-8 py-3.5 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors">
            Start a Conversation →
          </Link>
        </div>
      </section>
    </div>
  );
}
