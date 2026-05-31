import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: "Flutter mobile app development services by Bilal Fali. Custom Android and iOS apps, Firebase integration, API development, and app store deployment.",
};

const SERVICES = [
  { icon: "📱", title: "Flutter App Development", price: "From $2,000", desc: "Full-featured cross-platform mobile apps for Android and iOS. From MVP to production-ready.", features: ["Custom UI/UX design", "State management (GetX/Bloc)", "REST API integration", "Push notifications", "App Store deployment"] },
  { icon: "🔥", title: "Firebase Integration", price: "From $500", desc: "Integrate Firebase services into your existing Flutter app or new project.", features: ["Authentication (Google, Email, Phone)", "Firestore real-time database", "Cloud Storage", "FCM push notifications", "Analytics & Crashlytics"] },
  { icon: "🗺️", title: "Maps & Location Apps", price: "From $1,500", desc: "Real-time location tracking, route navigation, and geofencing applications.", features: ["Google Maps integration", "Real-time tracking with Socket.IO", "Route optimization", "Geofencing alerts", "Background location"] },
  { icon: "🛒", title: "E-commerce Apps", price: "From $3,000", desc: "Complete shopping experiences with payment integration and admin dashboard.", features: ["Product catalog & search", "Stripe/payment gateway", "Order management", "Admin panel", "Push notification campaigns"] },
  { icon: "🔧", title: "App Maintenance & Optimization", price: "From $50/hr", desc: "Performance improvements, bug fixes, and feature additions for existing apps.", features: ["Bug fixing", "Performance profiling", "Dependency updates", "UI improvements", "Code review"] },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-widest text-accent mb-3">What I offer</p>
        <h1 className="text-4xl font-bold text-ink mb-3">Services</h1>
        <p className="text-ink-muted max-w-lg mx-auto">5+ years building Flutter apps. Fast delivery, clean code, full documentation.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-12">
        {SERVICES.map(s => (
          <div key={s.title} className="flex flex-col gap-4 p-6 rounded-xl border border-border bg-bg-card">
            <div className="flex items-start justify-between gap-3">
              <span className="text-3xl">{s.icon}</span>
              <span className="text-sm font-semibold text-accent">{s.price}</span>
            </div>
            <div>
              <h2 className="font-bold text-ink mb-1">{s.title}</h2>
              <p className="text-sm text-ink-muted">{s.desc}</p>
            </div>
            <ul className="flex flex-col gap-1.5 mt-auto">
              {s.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-ink-muted">
                  <span className="text-accent">✓</span>{f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-2xl border border-accent/20 bg-accent/5 text-center">
        <h2 className="text-xl font-bold text-ink mb-2">Ready to start?</h2>
        <p className="text-ink-muted mb-6">Tell me about your project and I'll get back within 24 hours.</p>
        <Link href="/contact" className="inline-flex px-8 py-3 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors">
          Get a Quote →
        </Link>
      </div>
    </div>
  );
}
