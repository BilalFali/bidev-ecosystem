import { softwareApplicationJsonLd } from "@bidev/shared";
import { SITE_CONFIG } from "@/lib/seo";

export function ToolPageSeo({ name, description, path }: { name: string; description: string; path: string }) {
  const { SITE_URL } = SITE_CONFIG;
  const jsonLd = softwareApplicationJsonLd({
    url: `${SITE_URL}${path}`,
    siteUrl: SITE_URL,
    name,
    description,
  });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
