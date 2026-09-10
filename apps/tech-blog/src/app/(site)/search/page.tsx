import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { getAllArticles } from "@/lib/articles";
import { SearchResults } from "@/components/search/SearchResults";

export const revalidate = 300;

export const metadata: Metadata = {
  ...pageMetadata({ title: "Search", description: "Search BiDev Tech.", path: "/search" }),
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const articles = await getAllArticles();
  return (
    <Suspense>
      <SearchResults articles={articles} />
    </Suspense>
  );
}
