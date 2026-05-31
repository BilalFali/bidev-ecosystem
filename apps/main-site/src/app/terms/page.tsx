import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
export const metadata: Metadata = pageMetadata({ title: "Terms of Service", description: "Terms of service for bidev.site.", path: "/terms" });
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-ink mb-2">Terms of Service</h1>
      <p className="text-ink-faint text-sm mb-10">Last updated: May 2026</p>
      <div className="prose prose-invert max-w-none">
        <h2>Use of the Site</h2>
        <p>bidev.site provides educational content, developer tools, and resources free of charge. You may use these for personal and commercial projects. You may not reproduce or republish our articles without attribution.</p>
        <h2>Developer Tools</h2>
        <p>Tools are provided "as is" without warranty. All tools run client-side. We are not responsible for data generated or any losses arising from use of the tools.</p>
        <h2>Content</h2>
        <p>Article content is the intellectual property of bidev.site / Bilal Fali. Code snippets in articles may be used freely in your projects.</p>
        <h2>Changes</h2>
        <p>We may update these terms at any time. Continued use of the site constitutes acceptance of updated terms.</p>
        <h2>Contact</h2>
        <p>Questions: <a href="mailto:bilalfali60@gmail.com">bilalfali60@gmail.com</a></p>
      </div>
    </div>
  );
}
