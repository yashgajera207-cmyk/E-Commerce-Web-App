import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";
import type { Product } from "../../types";

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  viewAllLink?: string;
  accentColor?: string;
}

export default function ProductRail({
  title,
  subtitle,
  products,
  onAddToCart,
  onWishlist,
  viewAllLink = "/category/all",
  accentColor = "#2874f0",
}: ProductRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="bg-white rounded-xl sm:rounded-2xl shadow-xs overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-5 pt-3.5 sm:pt-4 pb-2.5 sm:pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base sm:text-xl font-extrabold text-gray-900">{title}</h2>
          {subtitle && <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {/* Desktop scroll arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <Link
            to={viewAllLink}
            className="flex items-center gap-0.5 text-xs sm:text-sm font-bold hover:underline shrink-0"
            style={{ color: accentColor }}
          >
            VIEW ALL
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>

      {/* Scrollable product row */}
      <div
        ref={scrollRef}
        className="flex gap-0 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {products.map((product, idx) => (
          <div
            key={product.id}
            className={`w-[44vw] sm:w-[190px] lg:w-[210px] shrink-0 p-2 sm:px-3 sm:py-4 ${
              idx !== products.length - 1 ? "border-r border-gray-100" : ""
            }`}
          >
            <ProductCard product={product} onAddToCart={onAddToCart} onWishlist={onWishlist} />
          </div>
        ))}
        {/* See all card */}
        <Link
          to={viewAllLink}
          className="w-[44vw] sm:w-[140px] shrink-0 flex flex-col items-center justify-center gap-2 p-4 border-l border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer text-center"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-[#2874f0]" />
          </div>
          <span className="text-xs font-bold text-[#2874f0]">See All</span>
        </Link>
      </div>
    </section>
  );
}