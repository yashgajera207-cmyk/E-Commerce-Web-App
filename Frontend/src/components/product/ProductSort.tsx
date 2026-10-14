import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { SearchFilters } from "../../types";

const SORT_OPTIONS: { label: string; value: NonNullable<SearchFilters["sortBy"]> }[] = [
  { label: "Relevance", value: "relevance" },
  { label: "Popularity", value: "rating" },
  { label: "Price -- Low to High", value: "price_asc" },
  { label: "Price -- High to Low", value: "price_desc" },
];

interface ProductSortProps {
  value: SearchFilters["sortBy"];
  onChange: (sort: SearchFilters["sortBy"]) => void;
  count?: number;
}

export default function ProductSort({ value = "relevance", onChange, count }: ProductSortProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0];

  return (
    <div className="flex items-center justify-between gap-4 flex-1 min-w-0">
      {/* Desktop Flipkart Tab Bar */}
      <div className="hidden md:flex items-center gap-4 text-xs">
        <span className="font-bold text-gray-900">Sort By</span>
        <div className="flex items-center gap-3">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = (value || "relevance") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`pb-1 border-b-2 font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "text-[#2874f0] border-[#2874f0] font-bold"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Count */}
      {count !== undefined && (
        <p className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-gray-800">{count}</span> results
        </p>
      )}

      {/* Mobile Dropdown */}
      <div ref={ref} className="relative md:hidden ml-auto shrink-0">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 hover:border-[#2874f0] transition-colors cursor-pointer"
        >
          <span className="text-gray-500 font-normal">Sort:</span>
          <span className="text-gray-900">{current.label}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-40">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                  (value || "relevance") === opt.value
                    ? "text-[#2874f0] font-bold bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
