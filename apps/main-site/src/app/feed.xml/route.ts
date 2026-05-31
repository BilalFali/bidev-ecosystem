import { getAllPosts } from "@/lib/mdx";

const BASE = "https://bidev.site";
const SITE = "bidev.site";

export async function GET() {
  const posts = getAllPosts().slice(0, 20);

  const items = posts.map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <description><![CDATA[${p.summary}]]></description>
      <link>${BASE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      ${p.tags.map((t) => `<category>${t}</category>`).join("")}
      <author>bilalfali60@gmail.com (${p.author ?? "Bilal Fali"})</author>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE} – Flutter &amp; Dev Tools Blog</title>
    <link>${BASE}</link>
    <description>Flutter tutorials, mobile dev guides, and free developer tools.</description>
    <language>en-us</language>
    <managingEditor>bilalfali60@gmail.com (Bilal Fali)</managingEditor>
    <webMaster>bilalfali60@gmail.com (Bilal Fali)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
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
