import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CategoryGrid from "../components/home/CategoryGrid";
import HeroBanner from "../components/home/HeroBanner";
import DealsOfTheDay from "../components/home/DealsOfTheDay";
import ProductRail from "../components/home/ProductRail";
import PerksStrip from "../components/home/PerksStrip";
import PromoBannerGrid from "../components/home/PromoBannerGrid";
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
        if (data.deals && data.deals.length > 0) setDeals(data.deals);
        if (data.trending && data.trending.length > 0) setTrending(data.trending);
        if (data.newArrivals && data.newArrivals.length > 0) setNewProducts(data.newArrivals);
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
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Header />
      <CategoryGrid />

      <main className="max-w-[1440px] mx-auto w-full px-2 sm:px-4 py-3 flex flex-col gap-4">
        <HeroBanner />

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

        <PerksStrip />
        <PromoBannerGrid />
        <AppDownloadBanner />
      </main>

      <Footer />
    </div>
  );
}