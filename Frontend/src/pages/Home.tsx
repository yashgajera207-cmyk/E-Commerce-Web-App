import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroBanner from "../components/home/HeroBanner";
import PerksStrip from "../components/home/PerksStrip";
import CategoryGrid from "../components/home/CategoryGrid";
import PromoBannerGrid from "../components/home/PromoBannerGrid";
import DealsOfTheDay from "../components/home/DealsOfTheDay";
import ProductRail from "../components/home/ProductRail";
import TopBrands from "../components/home/TopBrands";

import AppDownloadBanner from "../components/home/AppDownloadBanner";
import { trendingProducts as fallbackTrending, newArrivals as fallbackNew, dealsOfTheDay as fallbackDeals } from "../data/products";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";

export default function Home() {
  const { addToCart, toggleWishlist } = useCart();
  const [deals, setDeals] = useState<Product[]>(fallbackDeals);
  const [trending, setTrending] = useState<Product[]>(fallbackTrending);
  const [newProducts, setNewProducts] = useState<Product[]>(fallbackNew);

  useEffect(() => {
    fetch("http://localhost:5000/api/home")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          const fetchedDeals = data.products.filter((p: any) => p.section === "deal");
          const fetchedTrending = data.products.filter((p: any) => p.section === "trending");
          const fetchedNew = data.products.filter((p: any) => p.section === "new");

          if (fetchedDeals.length > 0) setDeals(fetchedDeals);
          if (fetchedTrending.length > 0) setTrending(fetchedTrending);
          if (fetchedNew.length > 0) setNewProducts(fetchedNew);
        }
      })
      .catch((err) => console.error("Failed to load products from API:", err));
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleWishlist = (product: Product) => {
    toggleWishlist(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f7]">
      <Header />

      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex flex-col gap-8">
        <HeroBanner />
        <PerksStrip />
        <CategoryGrid />
        <PromoBannerGrid />

        <DealsOfTheDay products={deals} onAddToCart={handleAddToCart} onWishlist={handleWishlist} />

        <ProductRail
          title="Trending Now"
          subtitle="Most loved by shoppers this week"
          products={trending}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
        />

        <TopBrands />

        <ProductRail
          title="New Arrivals"
          subtitle="Freshly added, just for you"
          products={newProducts}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
        />

        <AppDownloadBanner />
      </main>

      <Footer />
    </div>
  );
}