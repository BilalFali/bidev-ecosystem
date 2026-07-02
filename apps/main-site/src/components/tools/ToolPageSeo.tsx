import { softwareApplicationJsonLd } from "@bidev/shared";
import { SITE_CONFIG } from "@/lib/seo";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

export function ToolPageSeo({ name, description, path }: { name: string; description: string; path: string }) {
  const { SITE_URL } = SITE_CONFIG;
  const jsonLd = softwareApplicationJsonLd({
    url: `${SITE_URL}${path}`,
    siteUrl: SITE_URL,
    name,
    description,
  });
  const slug = path.replace(/^\/tools\//, "");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageViewTracker type="tool" slug={slug} title={name} />
    </>
  );
}
