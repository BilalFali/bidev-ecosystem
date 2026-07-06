import { getAllArticles } from "@/lib/articles";

const BASE = "https://bidev.dev";
const SITE = "bidev.dev";

export const revalidate = 3600;

export async function GET() {
  // getAllArticles merges MDX + Supabase DB, DB wins on slug conflict
  const articles = (await getAllArticles()).slice(0, 30);

  const items = articles.map((p) => {
    const content = p.summary ?? "";
    const image   = p.image ? `<enclosure url="${p.image}" type="image/jpeg"/>` : "";
    return `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <description><![CDATA[${content}]]></description>
      <link>${BASE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      ${p.tags.map((t) => `<category><![CDATA[${t}]]></category>`).join("")}
      <author>bilalfali60@gmail.com (${p.author ?? "Bilal Fali"})</author>
      ${image}
    </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE} – Flutter &amp; Dev Tools Blog</title>
    <link>${BASE}</link>
    <description>Flutter tutorials, mobile dev guides, and free developer tools by Bilal Fali.</description>
    <language>en-us</language>
    <managingEditor>bilalfali60@gmail.com (Bilal Fali)</managingEditor>
    <webMaster>bilalfali60@gmail.com (Bilal Fali)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${BASE}/og.png</url>
      <title>${SITE}</title>
      <link>${BASE}</link>
    </image>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
