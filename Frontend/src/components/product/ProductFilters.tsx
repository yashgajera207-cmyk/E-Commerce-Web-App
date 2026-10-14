import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import type { SearchFilters } from "../../types";

interface ProductFiltersProps {
  brands: string[];
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onReset: () => void;
  maxPrice?: number;
}

export default function ProductFilters({
  brands,
  filters,
  onChange,
  onReset,
  maxPrice = 100000,
}: ProductFiltersProps) {
  const [sections, setSections] = useState({
    price: true,
    brand: true,
    rating: true,
  });

  const toggle = (section: keyof typeof sections) =>
    setSections((s) => ({ ...s, [section]: !s[section] }));

  const hasFilters =
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    (filters.brands && filters.brands.length > 0) ||
    filters.rating !== undefined;

  const toggleBrand = (brand: string) => {
    const current = filters.brands || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    onChange({ ...filters, brands: updated.length > 0 ? updated : undefined });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#2874f0]" />
          <span className="text-sm font-bold text-gray-900">Filters</span>
          {hasFilters && (
            <span className="text-[10px] bg-[#2874f0] text-white rounded-full px-1.5 py-0.5 font-bold">
              {
                [
                  filters.priceMin || filters.priceMax ? 1 : 0,
                  (filters.brands?.length || 0),
                  filters.rating ? 1 : 0,
                ].reduce((a, b) => a + b, 0)
              }
            </span>
          )}
        </div>
        {hasFilters && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs font-semibold text-[#2874f0] hover:underline cursor-pointer">
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggle("price")}
          className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-gray-800 hover:bg-gray-50 cursor-pointer"
        >
          <span>PRICE</span>
          {sections.price ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {sections.price && (
          <div className="px-4 pb-4 space-y-3">
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={500}
              value={filters.priceMax || maxPrice}
              onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) || undefined })}
              className="w-full accent-[#2874f0]"
            />
            <div className="flex gap-2">
              <div className="flex-1 text-center bg-gray-50 rounded border border-gray-200 px-2 py-1.5 text-xs font-semibold">
                ₹{(filters.priceMin || 0).toLocaleString("en-IN")}
              </div>
              <span className="self-center text-gray-400">–</span>
              <div className="flex-1 text-center bg-gray-50 rounded border border-gray-200 px-2 py-1.5 text-xs font-semibold">
                ₹{(filters.priceMax || maxPrice).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div className="border-b border-gray-100">
          <button
            onClick={() => toggle("brand")}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-gray-800 hover:bg-gray-50 cursor-pointer"
          >
            <span>BRAND</span>
            {sections.brand ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
          {sections.brand && (
            <div className="px-4 pb-4 space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={(filters.brands || []).includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="accent-[#2874f0] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-xs text-gray-700 group-hover:text-[#2874f0] transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Customer Ratings */}
      <div>
        <button
          onClick={() => toggle("rating")}
          className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-gray-800 hover:bg-gray-50 cursor-pointer"
        >
          <span>CUSTOMER RATINGS</span>
          {sections.rating ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {sections.rating && (
          <div className="px-4 pb-4 space-y-2">
            {[4, 3, 2].map((r) => (
              <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === r}
                  onChange={() => onChange({ ...filters, rating: filters.rating === r ? undefined : r })}
                  className="accent-[#2874f0] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-gray-700 group-hover:text-[#2874f0] transition-colors flex items-center gap-1">
                  {r}★ & above
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
