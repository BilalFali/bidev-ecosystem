import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { breadcrumbJsonLd, jobPostingJsonLd } from "@bidev/shared";
import { getAllJobs, getJobBySlug } from "@/lib/jobs";
import { formatDate } from "@/lib/utils";
import { AdSlot } from "@bidev/ui";

const { SITE_URL } = SITE_CONFIG;

export const revalidate = 60;

export async function generateStaticParams() {
  const jobs = await getAllJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return pageMetadata({ title: "Job not found", description: "This job listing is no longer available.", path: `/jobs/${slug}` });

  return pageMetadata({
    title: `${job.title} at ${job.company}`,
    description: job.description.slice(0, 155),
    path: `/jobs/${slug}`,
  });
}

function salaryLabel(job: { salary_min: number | null; salary_max: number | null; salary_currency: string | null }) {
  if (!job.salary_min && !job.salary_max) return null;
  const currency = job.salary_currency ?? "USD";
  if (job.salary_min && job.salary_max) return `${currency} ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()} / year`;
  return `${currency} ${(job.salary_min ?? job.salary_max)!.toLocaleString()}+ / year`;
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const salary = salaryLabel(job);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Jobs", url: `${SITE_URL}/jobs` },
    { name: job.title, url: `${SITE_URL}/jobs/${slug}` },
  ]);

  const jobLd = jobPostingJsonLd({
    url: `${SITE_URL}/jobs/${slug}`,
    title: job.title,
    description: job.description,
    datePosted: job.posted_at ?? job.created_at,
    validThrough: job.expires_at ?? undefined,
    employmentType: job.employment_type,
    companyName: job.company,
    companyLogo: job.company_logo_url ?? undefined,
    location: job.location ?? undefined,
    remote: job.remote === "remote",
    salaryMin: job.salary_min ?? undefined,
    salaryMax: job.salary_max ?? undefined,
    salaryCurrency: job.salary_currency ?? undefined,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobLd) }} />

      <nav className="text-xs text-ink-faint mb-5">
        <Link href="/jobs" className="hover:text-ink-muted transition-colors">Jobs</Link> / {job.title}
      </nav>

      <div className="flex items-start gap-4 mb-6">
        {job.company_logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={job.company_logo_url} alt={job.company} className="w-14 h-14 rounded-xl object-cover border border-border shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-bg-elevated border border-border flex items-center justify-center text-ink-faint font-bold text-lg shrink-0">
            {job.company.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-snug">{job.title}</h1>
          <p className="text-ink-muted">{job.company}{job.location ? ` · ${job.location}` : ""}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs px-2.5 py-1 rounded-full bg-bg-elevated border border-border text-ink-faint capitalize">{job.remote}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-bg-elevated border border-border text-ink-faint capitalize">{job.employment_type.replace("-", " ")}</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-bg-elevated border border-border text-ink-faint">{job.category}</span>
        {salary && <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">{salary}</span>}
        {job.posted_at && <span className="text-xs text-ink-faint">Posted {formatDate(job.posted_at)}</span>}
      </div>

      <AdSlot type="banner" className="mb-8" />

      <div className="text-ink-muted leading-relaxed whitespace-pre-wrap mb-10">{job.description}</div>

      <div className="p-6 rounded-xl border border-accent/25 bg-accent/5 text-center">
        <p className="text-sm text-ink-muted mb-4">Interested in this role?</p>
        {job.apply_url ? (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-6 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Apply Now →
          </a>
        ) : job.apply_email ? (
          <a
            href={`mailto:${job.apply_email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
            className="inline-flex px-6 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Apply via Email →
          </a>
        ) : null}
      </div>

      <AdSlot type="in-article" className="mt-12" />
    </div>
  );
}
