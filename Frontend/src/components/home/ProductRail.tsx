import { ChevronRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import type { Product } from "../../types";

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
}

export default function ProductRail({
  title,
  subtitle,
  products,
  onAddToCart,
  onWishlist,
}: ProductRailProps) {
  return (
    <section className="bg-white rounded-md shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-medium text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={() => {}}
          className="flex items-center gap-0.5 text-brand-blue text-sm font-semibold hover:underline shrink-0"
        >
          VIEW ALL
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-0 overflow-x-auto scrollbar-hide">
        {products.map((product, idx) => (
          <div
            key={product.id}
            className={`w-[45%] sm:w-[220px] shrink-0 px-3 py-4 ${
              idx !== products.length - 1 ? "border-r border-gray-100" : ""
            }`}
          >
            <ProductCard product={product} onAddToCart={onAddToCart} onWishlist={onWishlist} />
          </div>
        ))}
      </div>
    </section>
  );
}