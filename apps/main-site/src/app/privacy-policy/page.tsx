import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
export const metadata: Metadata = pageMetadata({ title: "Privacy Policy", description: "Privacy policy for bidev.dev.", path: "/privacy-policy" });
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-ink mb-2">Privacy Policy</h1>
      <p className="text-ink-faint text-sm mb-10">Last updated: May 2026</p>
      <div className="prose prose-invert max-w-none">
        <h2>Data Collection</h2>
        <p>bidev.dev does not collect personal data beyond standard server logs (IP address, browser type, pages visited). These logs are used solely for security and performance monitoring and are deleted after 30 days.</p>
        <h2>Developer Tools</h2>
        <p>All tools on bidev.dev (QR generator, JSON formatter, password generator, Base64, UUID) run entirely client-side in your browser. No input data is transmitted to our servers.</p>
        <h2>Cookies</h2>
        <p>We use no tracking cookies. If you subscribe to the newsletter we store your email address to send newsletters. You can unsubscribe at any time.</p>
        <h2>Advertising</h2>
        <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your visit. See Google's <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">privacy policy</a> for details.</p>
        <h2>Contact</h2>
        <p>For privacy questions: <a href="mailto:bilalfali60@gmail.com">bilalfali60@gmail.com</a></p>
      </div>
    </div>
  );
}
