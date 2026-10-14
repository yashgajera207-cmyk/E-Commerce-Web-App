import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const BRANDS = [
  { name: "Apple", logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100&auto=format&fit=crop&q=80", link: "/category/mobiles" },
  { name: "Samsung", logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&auto=format&fit=crop&q=80", link: "/category/mobiles" },
  { name: "Nike", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80", link: "/category/fashion" },
  { name: "Sony", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80", link: "/category/electronics" },
  { name: "boAt", logo: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&auto=format&fit=crop&q=80", link: "/category/electronics" },
  { name: "Adidas", logo: "https://images.unsplash.com/photo-1556048219-bb6978360b84?w=100&auto=format&fit=crop&q=80", link: "/category/sports" },
  { name: "LG", logo: "https://images.unsplash.com/photo-1631567091196-6a8440cf9a08?w=100&auto=format&fit=crop&q=80", link: "/category/appliances" },
  { name: "Levi's", logo: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&auto=format&fit=crop&q=80", link: "/category/fashion" },
];

export default function TopBrands() {
  return (
    <section className="bg-white rounded-xl sm:rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-5 pt-3.5 sm:pt-4 pb-2.5 sm:pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-base sm:text-xl font-extrabold text-gray-900">Top Brands</h2>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Shop from India's most loved brands</p>
        </div>
        <Link
          to="/category/all"
          className="flex items-center gap-0.5 text-[#2874f0] text-xs sm:text-sm font-bold hover:underline shrink-0"
        >
          VIEW ALL <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-0">
        {BRANDS.map((brand, idx) => (
          <Link
            key={brand.name}
            to={brand.link}
            className={`flex flex-col items-center gap-2 p-3 sm:p-4 hover:bg-gray-50 transition-colors group ${
              idx < BRANDS.length - 1 ? "border-r border-gray-100" : ""
            }`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#2874f0]/30 transition-colors shadow-xs">
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-700 group-hover:text-[#2874f0] transition-colors text-center">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}