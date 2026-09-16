import { Package } from "lucide-react";
import { getAllProducts, formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

// Promotes a real, published product (never a placeholder) at the end of
// high-traffic tutorial/troubleshooting content — the highest-leverage
// passive-income lever available right now, since the product/checkout
// system already exists and just needs traffic pointed at it.
export async function ProductPromoBanner({ className }: Props) {
  const products = await getAllProducts();
  const product = products[0];
  if (!product) return null;

  return (
    <div
      className={cn(
        "mt-12 rounded-2xl border border-accent/20 bg-accent/5 px-6 py-7",
        "flex flex-col sm:flex-row items-start sm:items-center gap-5",
        className
      )}
    >
      <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
        <Package className="w-6 h-6 text-accent" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink mb-1">Skip the boilerplate</p>
        <p className="text-sm text-ink-muted leading-relaxed">{product.short_description}</p>
      </div>

      <Button href={`/products/${product.slug}`} prompt className="shrink-0">
        Get {product.title} — {formatPrice(product.price)}
      </Button>
    </div>
  );
}
