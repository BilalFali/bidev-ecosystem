import { baseURL } from "@/app/resources";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/login/", "/api/"],
      },
    ],
    sitemap: `https://${baseURL}/sitemap.xml`,
  };
}
