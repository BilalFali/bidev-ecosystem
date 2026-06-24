import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { breadcrumbJsonLd } from "@bidev/shared";
import { getAllJobs } from "@/lib/jobs";
import { formatDate } from "@/lib/utils";
import { AdSlot } from "@bidev/ui";

const { SITE_URL } = SITE_CONFIG;

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Flutter & Dart Developer Jobs",
  description: "Find Flutter and Dart developer jobs — remote, hybrid, and onsite roles curated for the Bidev community.",
  path: "/jobs",
});

function salaryLabel(job: { salary_min: number | null; salary_max: number | null; salary_currency: string | null }) {
  if (!job.salary_min && !job.salary_max) return null;
  const currency = job.salary_currency ?? "USD";
  if (job.salary_min && job.salary_max) return `${currency} ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}`;
  return `${currency} ${(job.salary_min ?? job.salary_max)!.toLocaleString()}+`;
}

export default async function JobsPage() {
  const jobs = await getAllJobs();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Jobs", url: `${SITE_URL}/jobs` },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Job Board</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">Flutter &amp; Dart Jobs</h1>
        <p className="text-ink-muted max-w-xl">
          Remote, hybrid, and onsite roles for Flutter and Dart developers — curated for the Bidev community.
        </p>
      </div>

      <AdSlot type="banner" className="mb-10" />

      {jobs.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed border-border">
          <p className="text-ink-muted mb-2">No open positions right now.</p>
          <p className="text-sm text-ink-faint">
            Hiring a Flutter developer?{" "}
            <Link href="/contact" className="text-accent hover:underline">Get in touch</Link> to list a job.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => {
            const salary = salaryLabel(job);
            return (
              <Link
                key={job.slug}
                href={`/jobs/${job.slug}`}
                className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
              >
                {job.company_logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.company_logo_url} alt={job.company} className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-bg-elevated border border-border flex items-center justify-center text-ink-faint font-bold shrink-0">
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-ink group-hover:text-accent transition-colors">{job.title}</h2>
                  <p className="text-sm text-ink-muted">{job.company}{job.location ? ` · ${job.location}` : ""}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated border border-border text-ink-faint capitalize">{job.remote}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated border border-border text-ink-faint capitalize">{job.employment_type.replace("-", " ")}</span>
                    {salary && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">{salary}</span>}
                  </div>
                </div>
                {job.posted_at && (
                  <span className="text-xs text-ink-faint shrink-0">{formatDate(job.posted_at)}</span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <AdSlot type="in-article" className="mt-12" />
    </div>
  );
}
