import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Breadcrumb from "../components/common/Breadcrumb";
import EmptyState from "../components/common/EmptyState";
import ProductCard from "../components/product/ProductCard";
import ProductFilters from "../components/product/ProductFilters";
import ProductSort from "../components/product/ProductSort";
import { allProducts, categories } from "../data/products";
import type { SearchFilters, Product } from "../types";
import { useCart } from "../context/CartContext";

export default function ProductListingPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { addToCart, toggleWishlist } = useCart();
  const [filters, setFilters] = useState<SearchFilters>({});
  
  // Electronics/appliances default to signature Flipkart list view, fashion/others to grid
  const isTechCategory = categoryId === "electronics" || categoryId === "appliances" || categoryId === "mobiles";
  const [view, setView] = useState<"grid" | "list">(isTechCategory ? "list" : "grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setView(isTechCategory ? "list" : "grid");
  }, [categoryId, isTechCategory]);

  const category = categories.find((c) => c.id === categoryId);
  const rawProducts = useMemo(
    () => allProducts.filter((p) => !categoryId || p.category === categoryId),
    [categoryId]
  );

  const brands = useMemo(
    () => [...new Set(rawProducts.map((p) => p.brand).filter(Boolean) as string[])],
    [rawProducts]
  );

  const maxPrice = useMemo(
    () => Math.ceil(Math.max(...rawProducts.map((p) => p.price), 0) / 1000) * 1000,
    [rawProducts]
  );

  const filtered: Product[] = useMemo(() => {
    let list = [...rawProducts];

    if (filters.priceMin !== undefined) list = list.filter((p) => p.price >= filters.priceMin!);
    if (filters.priceMax !== undefined) list = list.filter((p) => p.price <= filters.priceMax!);
    if (filters.brands && filters.brands.length > 0)
      list = list.filter((p) => p.brand && filters.brands!.includes(p.brand));
    if (filters.rating !== undefined) list = list.filter((p) => (p.rating || 0) >= filters.rating!);

    switch (filters.sortBy) {
      case "price_asc": list.sort((a, b) => a.price - b.price); break;
      case "price_desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }

    return list;
  }, [rawProducts, filters]);

  const handleReset = () => setFilters({});

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Header />

      <main className="max-w-[1440px] mx-auto w-full px-2.5 sm:px-4 py-3 sm:py-5 flex-1">
        {/* Breadcrumb */}
        <Breadcrumb
          items={category ? [{ label: category.name }] : [{ label: "All Products" }]}
          className="mb-3 sm:mb-4"
        />

        {/* Page Title & Mobile Filters button */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              {category ? category.name : "All Products"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing 1 – {filtered.length} products
            </p>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 bg-white border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-4 sm:gap-5 items-start">
          {/* Sidebar Filters (Desktop 280px) */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-20">
            <ProductFilters
              brands={brands}
              filters={filters}
              onChange={setFilters}
              onReset={handleReset}
              maxPrice={maxPrice}
            />
          </aside>

          {/* Main Products Container */}
          <div className="flex-1 min-w-0">
            {/* Sort Tab Bar + View toggle */}
            <div className="bg-white rounded-lg border border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3 mb-3 sm:mb-4 flex items-center justify-between gap-2 sm:gap-4 shadow-xs">
              <ProductSort
                value={filters.sortBy}
                onChange={(sortBy) => setFilters((f) => ({ ...f, sortBy }))}
                count={filtered.length}
              />
              
              {/* View Switcher */}
              <div className="flex items-center gap-1 border border-gray-200 rounded p-1 shrink-0">
                <button
                  onClick={() => setView("grid")}
                  title="Grid View"
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    view === "grid" ? "bg-[#2874f0] text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  title="List View"
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    view === "list" ? "bg-[#2874f0] text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Product List/Grid Canvas */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-lg shadow-xs border border-gray-100">
                <EmptyState
                  emoji="🔍"
                  title="No products found"
                  description="Try adjusting your filters to find what you're looking for."
                  actionLabel="Clear Filters"
                  onAction={handleReset}
                />
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3"
                    : "flex flex-col gap-3"
                }
              >
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={view}
                    onAddToCart={addToCart}
                    onWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <span className="font-bold text-gray-900">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <ProductFilters
                brands={brands}
                filters={filters}
                onChange={(f) => setFilters(f)}
                onReset={() => {
                  handleReset();
                  setMobileFiltersOpen(false);
                }}
                maxPrice={maxPrice}
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#2874f0] text-white font-bold py-3 rounded-lg cursor-pointer"
              >
                Apply Filters ({filtered.length} results)
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
