import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getAllCategories } from "@/lib/categories";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </div>
  );
}
