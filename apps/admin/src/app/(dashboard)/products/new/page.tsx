import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ProductForm } from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader title="New Product" description="Create a new product listing" />
      <ProductForm />
    </div>
  );
}
