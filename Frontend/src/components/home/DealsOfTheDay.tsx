import { useEffect, useState, useRef } from "react";
import { Clock, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
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
  return { h, m, s };
}

export default function DealsOfTheDay({ onAddToCart, onWishlist, products = dealsOfTheDay }: DealsOfTheDayProps) {
  const { h, m, s } = useCountdown();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-xs overflow-hidden border border-gray-100 flex flex-col md:flex-row relative group">
      {/* FLIPKART SIGNATURE LEFT PROMO BANNER (Desktop) */}
      <div className="hidden md:flex w-[230px] shrink-0 bg-gradient-to-b from-[#2874f0] via-[#1a62d0] to-[#0f4bb5] text-white p-6 flex-col justify-between items-center text-center relative overflow-hidden">
        {/* Background decorative ring */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>Top Deals</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight leading-tight">
            Deals of the Day
          </h2>

          {/* Countdown Clock */}
          <div className="pt-1 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1 text-white">
              <Clock className="w-4 h-4 text-yellow-300" />
              <div className="flex items-center gap-1 font-mono">
                <span className="bg-black/40 text-white text-xs font-black px-1.5 py-1 rounded">
                  {h}
                </span>
                <span className="text-yellow-300 font-bold">:</span>
                <span className="bg-black/40 text-white text-xs font-black px-1.5 py-1 rounded">
                  {m}
                </span>
                <span className="text-yellow-300 font-bold">:</span>
                <span className="bg-black/40 text-white text-xs font-black px-1.5 py-1 rounded">
                  {s}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-blue-100 font-medium">Time Remaining</span>
          </div>
        </div>

        {/* View All Button */}
        <div className="relative z-10 w-full pt-4">
          <Link
            to="/category/electronics"
            className="w-full inline-flex items-center justify-center gap-1 bg-white hover:bg-gray-100 text-[#2874f0] text-xs font-black py-2.5 px-4 rounded shadow-md transition-transform active:scale-95 uppercase tracking-wider"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* MOBILE HEADER (Visible on small screens) */}
      <div className="md:hidden flex items-center justify-between px-3.5 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold text-gray-900">Deals of the Day</h2>
          <div className="flex items-center gap-1 text-[11px] text-gray-600">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span className="bg-gray-900 text-white text-[10px] font-mono font-bold px-1 rounded">
              {h}:{m}:{s}
            </span>
          </div>
        </div>

        <Link
          to="/category/electronics"
          className="text-[#2874f0] text-xs font-bold flex items-center gap-0.5"
        >
          VIEW ALL <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* RIGHT: HORIZONTAL PRODUCT SCROLL RAIL */}
      <div className="flex-1 min-w-0 relative">
        {/* Navigation Arrow Left */}
        <button
          onClick={() => scroll("left")}
          aria-label="Previous Deals"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-white/95 hover:bg-white text-gray-800 rounded-r-md shadow-lg items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth divide-x divide-gray-100 h-full items-stretch py-2"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[170px] sm:w-[210px] shrink-0 p-3 flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onWishlist={onWishlist}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrow Right */}
        <button
          onClick={() => scroll("right")}
          aria-label="Next Deals"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-white/95 hover:bg-white text-gray-800 rounded-l-md shadow-lg items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer border border-gray-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}