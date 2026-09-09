import { useEffect, useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { dealsOfTheDay } from "../../data/products";
import type { Product } from "../../types";

interface DealsOfTheDayProps {
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  products?: Product[];
}

function useCountdown(hours = 6) {
  const [remaining, setRemaining] = useState(hours * 3600);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : hours * 3600));
    }, 1000);
    return () => clearInterval(id);
  }, [hours]);

  const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function DealsOfTheDay({ onAddToCart, onWishlist, products = dealsOfTheDay }: DealsOfTheDayProps) {
  const timeLeft = useCountdown();

  return (
    <section className="bg-white rounded-md shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-medium text-gray-900">Deals of the Day</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-brand-blue">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">{timeLeft}</span>
          </div>
          <button
            onClick={() => { }}
            className="flex items-center gap-0.5 text-brand-blue text-sm font-semibold hover:underline"
          >
            VIEW ALL
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((product, idx) => (
          <div
            key={product.id}
            className={`
              px-3 py-4
              ${idx % 5 !== 4 ? "sm:border-r border-gray-100" : ""}
              ${idx % 2 !== 1 ? "border-r sm:border-r-0 border-gray-100" : ""}
              border-b sm:border-b-0 border-gray-100
            `}
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
            />
          </div>
        ))}
      </div>
    </section>
  );
}