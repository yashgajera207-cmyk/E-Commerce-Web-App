import { ChevronRight } from "lucide-react";
import { topBrands } from "../../data/products";

export default function TopBrands() {
  return (
    <section className="bg-white rounded-md shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-3 border-b border-gray-100">
        <h2 className="text-xl sm:text-2xl font-medium text-gray-900">Top Brands</h2>
        <button
          onClick={() => {}}
          className="flex items-center gap-0.5 text-brand-blue text-sm font-semibold hover:underline"
        >
          VIEW ALL
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6">
        {topBrands.map((brand, idx) => (
          <div
            key={brand}
            className={`
              h-20 flex items-center justify-center px-2
              font-display font-bold text-gray-700 text-sm tracking-wide text-center
              hover:bg-gray-50 transition-colors cursor-pointer
              ${idx % 6 !== 5 ? "sm:border-r border-gray-100" : ""}
              ${idx % 3 !== 2 ? "border-r sm:border-r-0 border-gray-100" : ""}
              border-b border-gray-100
            `}
          >
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
}