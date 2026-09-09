// Central mock data source. In a real full-stack build this file is
// replaced by API calls (e.g. src/services/productService.ts -> /api/products).

import type { Category, HeroSlide, Perk, Product, PromoBanner, CartItem } from "../types";

export const categories: Category[] = [
  { id: "mobiles", name: "Mobiles", icon: "smartphone" },
  { id: "electronics", name: "Electronics", icon: "headphones" },
  { id: "fashion", name: "Fashion", icon: "shirt" },
  { id: "home-kitchen", name: "Home & Kitchen", icon: "sofa" },
  { id: "beauty", name: "Beauty", icon: "sparkles" },
  { id: "sports", name: "Sports", icon: "dumbbell" },
  { id: "stores", name: "Stores", icon: "store" },
  { id: "toys", name: "Toys", icon: "gamepad-2" },
];

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    eyebrow: "Big Savings on Top Brands",
    title: "Up to 70% Off",
    subtitle: "On headphones, wearables & smart gadgets",
    cta: "Shop Now",
    theme: "dark",
  },
  {
    id: 2,
    eyebrow: "New Season Arrivals",
    title: "Fresh Styles Just In",
    subtitle: "Upgrade your wardrobe for less",
    cta: "Explore",
    theme: "light",
  },
];

export const perks: Perk[] = [
  { id: 1, icon: "badge-percent", label: "Great Prices", sub: "Best price guaranteed" },
  { id: 2, icon: "truck", label: "Fast Delivery", sub: "Get it in 1-2 days" },
  { id: 3, icon: "rotate-ccw", label: "Easy Returns", sub: "7 day return policy" },
  { id: 4, icon: "shield-check", label: "100% Secure", sub: "Safe & trusted payments" },
];

export const dealsOfTheDay: Product[] = [
  { id: "d1", name: "boAt Airdopes 141", image: "🎧", price: 1299, mrp: 2490, discount: 47, rating: 4.2, ratingCount: 128453 },
  { id: "d2", name: "Noise ColorFit Pulse 2", image: "⌚", price: 1299, mrp: 2999, discount: 57, rating: 4.1, ratingCount: 34521 },
  { id: "d3", name: "Sony WH-CH520", image: "🎧", price: 1999, mrp: 3990, discount: 49, rating: 4.4, ratingCount: 6721 },
  { id: "d4", name: "Realme TechLife T100", image: "🎧", price: 1299, mrp: 2499, discount: 47, rating: 4.0, ratingCount: 2145 },
  { id: "d5", name: "pTron Bassbuds Duo", image: "🎧", price: 699, mrp: 1499, discount: 53, rating: 3.9, ratingCount: 8934 },
];

export const topBrands: string[] = ["SAMSUNG", "boAt", "Nike", "PHILIPS", "LG", "Sony"];

export const promoBanners: PromoBanner[] = [
  {
    id: "promo-1",
    title: "Fashion Sale",
    subtitle: "Up to 70% off",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
    bgColor: "#fef3f2",
  },
  {
    id: "promo-2",
    title: "Home & Kitchen",
    subtitle: "Starting ₹149",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400",
    bgColor: "#f0f9f4",
  },
  {
    id: "promo-3",
    title: "Mobiles",
    subtitle: "Exchange offers",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    bgColor: "#f0f5ff",
  },
  {
    id: "promo-4",
    title: "Beauty",
    subtitle: "Min 40% off",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
    bgColor: "#fdf4ff",
  },
];

export const trendingProducts: Product[] = [
  { id: "t1", name: "Noise ColorFit Pro 4 Smartwatch", image: "⌚", price: 1799, mrp: 5999, discount: 70, rating: 4.1, ratingCount: 34521 },
  { id: "t2", name: "Levi's Men Slim Fit Jeans", image: "👖", price: 1399, mrp: 2999, discount: 53, rating: 4.3, ratingCount: 8934 },
  { id: "t3", name: "Milton Thermosteel Bottle 1L", image: "🍶", price: 599, mrp: 999, discount: 40, rating: 4.5, ratingCount: 12045 },
  { id: "t4", name: "Sony WH-CH520 Wireless Headphones", image: "🎧", price: 2990, mrp: 4990, discount: 40, rating: 4.4, ratingCount: 6721 },
  { id: "t5", name: "Boldfit Yoga Mat 6mm", image: "🧘", price: 499, mrp: 1299, discount: 62, rating: 4.2, ratingCount: 3456 },
];

export const newArrivals: Product[] = [
  { id: "n1", name: "OnePlus Nord CE 4 Lite 5G", image: "📱", price: 18999, mrp: 21999, discount: 14, rating: 4.3, ratingCount: 2103 },
  { id: "n2", name: "H&M Regular Fit Cotton T-Shirt", image: "👕", price: 799, mrp: 1299, discount: 38, rating: 4.0, ratingCount: 567 },
  { id: "n3", name: "Ergonomic Study Chair", image: "🪑", price: 5499, mrp: 8999, discount: 39, rating: 4.1, ratingCount: 342 },
  { id: "n4", name: "Mamaearth Vitamin C Face Serum 30ml", image: "🧴", price: 449, mrp: 699, discount: 36, rating: 4.4, ratingCount: 891 },
  { id: "n5", name: "boAt Rockerz 255 Pro+ Neckband", image: "🎧", price: 999, mrp: 2490, discount: 60, rating: 4.2, ratingCount: 4521 },
];

export const cartItems: CartItem[] = [
  {
    product: { id: "d1", name: "boAt Airdopes 141", image: "🎧", price: 1299, mrp: 2490, discount: 47, rating: 4.2, ratingCount: 128453 },
    quantity: 1,
  },
  {
    product: { id: "t2", name: "Levi's Men Slim Fit Jeans", image: "👖", price: 1399, mrp: 2999, discount: 53, rating: 4.3, ratingCount: 8934 },
    quantity: 2,
  },
  {
    product: { id: "n3", name: "Ergonomic Study Chair", image: "🪑", price: 5499, mrp: 8999, discount: 39, rating: 4.1, ratingCount: 342 },
    quantity: 1,
  },
];