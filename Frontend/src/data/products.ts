// Central mock data source. In a real full-stack build this file is
// replaced by API calls (e.g. src/services/productService.ts -> /api/products).
// Products use Unsplash images for realistic product display.

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
  {
    id: "d1", name: "boAt Airdopes 141", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&auto=format&fit=crop&q=80", price: 1299, mrp: 2490, discount: 47,
    rating: 4.2, ratingCount: 128453, category: "electronics", brand: "boAt",
    description: "Truly wireless earbuds with 42H playtime, IWP technology, and BEAST™ mode.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Connectivity", value: "Bluetooth 5.0" },
      { key: "Playtime", value: "42 Hours (earbuds + case)" },
      { key: "Driver Size", value: "6mm" },
      { key: "Weight", value: "4.3g per earbud" },
      { key: "Water Resistance", value: "IPX4" },
    ],
  },
  {
    id: "d2", name: "Noise ColorFit Pulse 2 Max", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80", price: 1299, mrp: 2999, discount: 57,
    rating: 4.1, ratingCount: 34521, category: "electronics", brand: "Noise",
    description: "Smart fitness watch with 1.72\" display, SpO2 monitor, and 10-day battery.",
    inStock: true, deliveryDate: "2 days",
    specifications: [
      { key: "Display", value: "1.72\" TFT" },
      { key: "Battery Life", value: "Up to 10 days" },
      { key: "Water Resistance", value: "IP68" },
      { key: "Sensors", value: "Heart Rate, SpO2" },
      { key: "Compatible OS", value: "Android & iOS" },
    ],
  },
  {
    id: "d3", name: "Sony WH-CH520", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80", price: 1999, mrp: 3990, discount: 49,
    rating: 4.4, ratingCount: 6721, category: "electronics", brand: "Sony",
    description: "Wireless headphones with 50H battery, multipoint connection, and foldable design.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Driver Size", value: "30mm" },
      { key: "Battery Life", value: "50 Hours" },
      { key: "Connectivity", value: "Bluetooth 5.2" },
      { key: "Weight", value: "147g" },
      { key: "Frequency Response", value: "20Hz – 20,000Hz" },
    ],
  },
  {
    id: "d4", name: "Samsung Galaxy Buds FE", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80", price: 2499, mrp: 4999, discount: 50,
    rating: 4.0, ratingCount: 2145, category: "electronics", brand: "Realme",
    inStock: true, deliveryDate: "3 days",
    specifications: [
      { key: "Driver Size", value: "40mm" },
      { key: "Battery Life", value: "35 Hours" },
      { key: "Connectivity", value: "Bluetooth 5.0" },
    ],
  },
  {
    id: "d5", name: "pTron Bassbuds Duo Pro", image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&auto=format&fit=crop&q=80", price: 699, mrp: 1499, discount: 53,
    rating: 3.9, ratingCount: 8934, category: "electronics", brand: "pTron",
    inStock: true, deliveryDate: "2 days",
    specifications: [
      { key: "Playtime", value: "18 Hours total" },
      { key: "Connectivity", value: "Bluetooth 5.1" },
      { key: "Water Resistance", value: "IPX4" },
    ],
  },
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
  {
    id: "t1", name: "Noise ColorFit Pro 4 Smartwatch", image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&auto=format&fit=crop&q=80", price: 1799, mrp: 5999, discount: 70,
    rating: 4.1, ratingCount: 34521, category: "electronics", brand: "Noise",
    description: "Premium smartwatch with AMOLED display, 100+ sports modes, and 7-day battery.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Display", value: "1.78\" AMOLED" },
      { key: "Battery", value: "7 days" },
      { key: "Water Resistance", value: "IP68" },
      { key: "Sports Modes", value: "100+" },
    ],
  },
  {
    id: "t2", name: "Levi's Men Slim Fit Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&auto=format&fit=crop&q=80", price: 1399, mrp: 2999, discount: 53,
    rating: 4.3, ratingCount: 8934, category: "fashion", brand: "Levi's",
    description: "Classic slim fit jeans in premium stretch denim. Comfortable all-day wear.",
    inStock: true, deliveryDate: "2 days",
    specifications: [
      { key: "Material", value: "98% Cotton, 2% Elastane" },
      { key: "Fit Type", value: "Slim Fit" },
      { key: "Wash Care", value: "Machine Wash" },
      { key: "Closure", value: "Button & Zip" },
    ],
  },
  {
    id: "t3", name: "Milton Thermosteel Bottle 1L", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80", price: 599, mrp: 999, discount: 40,
    rating: 4.5, ratingCount: 12045, category: "home-kitchen", brand: "Milton",
    description: "Double-wall insulated bottle. Keeps hot 18h, cold 24h. BPA-free steel.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Capacity", value: "1 Litre" },
      { key: "Material", value: "18/8 Stainless Steel" },
      { key: "Hot Retention", value: "18 Hours" },
      { key: "Cold Retention", value: "24 Hours" },
    ],
  },
  {
    id: "t4", name: "Sony WH-CH520 Wireless Headphones", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80", price: 2990, mrp: 4990, discount: 40,
    rating: 4.4, ratingCount: 6721, category: "electronics", brand: "Sony",
    description: "50H battery, multipoint connection. Lightweight foldable over-ear headphones.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Driver Size", value: "30mm" },
      { key: "Battery Life", value: "50 Hours" },
      { key: "Connectivity", value: "Bluetooth 5.2" },
    ],
  },
  {
    id: "t5", name: "Boldfit Yoga Mat 6mm", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80", price: 499, mrp: 1299, discount: 62,
    rating: 4.2, ratingCount: 3456, category: "sports", brand: "Boldfit",
    description: "Anti-slip TPE yoga mat. 6mm thick with carry strap. Perfect for all yoga styles.",
    inStock: true, deliveryDate: "2 days",
    specifications: [
      { key: "Material", value: "TPE (Non-toxic)" },
      { key: "Thickness", value: "6mm" },
      { key: "Dimensions", value: "183cm × 61cm" },
      { key: "Weight", value: "900g" },
    ],
  },
];

export const newArrivals: Product[] = [
  {
    id: "n1", name: "OnePlus Nord CE 4 Lite 5G", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&auto=format&fit=crop&q=80", price: 18999, mrp: 21999, discount: 14,
    rating: 4.3, ratingCount: 2103, category: "mobiles", brand: "OnePlus",
    description: "5G smartphone with Snapdragon 695, 108MP camera, and 5500mAh battery.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Processor", value: "Snapdragon 695 5G" },
      { key: "RAM", value: "8GB" },
      { key: "Storage", value: "128GB" },
      { key: "Camera", value: "108MP + 2MP" },
      { key: "Battery", value: "5500mAh, 80W Fast Charge" },
      { key: "Display", value: "6.67\" FHD+ 120Hz" },
    ],
  },
  {
    id: "n2", name: "H&M Regular Fit Cotton T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop&q=80", price: 799, mrp: 1299, discount: 38,
    rating: 4.0, ratingCount: 567, category: "fashion", brand: "H&M",
    description: "Soft 100% cotton t-shirt. Relaxed regular fit with ribbed neckline.",
    inStock: true, deliveryDate: "3 days",
    specifications: [
      { key: "Material", value: "100% Cotton" },
      { key: "Fit Type", value: "Regular Fit" },
      { key: "Neck Type", value: "Round Neck" },
      { key: "Wash Care", value: "Machine Wash 40°C" },
    ],
  },
  {
    id: "n3", name: "Ergonomic Study Chair", image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&auto=format&fit=crop&q=80", price: 5499, mrp: 8999, discount: 39,
    rating: 4.1, ratingCount: 342, category: "home-kitchen", brand: "Green Soul",
    description: "High-back ergonomic chair with lumbar support, adjustable armrests, and mesh back.",
    inStock: true, deliveryDate: "4 days",
    specifications: [
      { key: "Material", value: "Mesh + Foam" },
      { key: "Max Load", value: "120kg" },
      { key: "Armrest", value: "3D Adjustable" },
      { key: "Lumbar Support", value: "Yes" },
      { key: "Height Adjustment", value: "Gas Lift" },
    ],
  },
  {
    id: "n4", name: "Mamaearth Vitamin C Face Serum 30ml", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80", price: 449, mrp: 699, discount: 36,
    rating: 4.4, ratingCount: 891, category: "beauty", brand: "Mamaearth",
    description: "Brightening serum with Vitamin C and turmeric. Reduces dark spots in 4 weeks.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Key Ingredients", value: "Vitamin C, Turmeric" },
      { key: "Volume", value: "30ml" },
      { key: "Skin Type", value: "All Skin Types" },
      { key: "Certifications", value: "Dermatologist Tested, PETA Certified" },
    ],
  },
  {
    id: "n5", name: "boAt Rockerz 255 Pro+ Neckband", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&auto=format&fit=crop&q=80", price: 999, mrp: 2490, discount: 60,
    rating: 4.2, ratingCount: 4521, category: "electronics", brand: "boAt",
    description: "Neckband earphones with 60H playtime, ASAP charge, and magnetic earbuds.",
    inStock: true, deliveryDate: "2 days",
    specifications: [
      { key: "Playtime", value: "60 Hours" },
      { key: "Connectivity", value: "Bluetooth 5.0" },
      { key: "Water Resistance", value: "IPX7" },
      { key: "Fast Charge", value: "ASAP Charge (10 min = 10H)" },
    ],
  },
];

// All products combined (useful for category pages)
export const allProducts: Product[] = [
  ...dealsOfTheDay,
  ...trendingProducts,
  ...newArrivals,
  // Additional products per category
  {
    id: "m1", name: "Samsung Galaxy M35 5G", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80", price: 19999, mrp: 25999, discount: 23,
    rating: 4.2, ratingCount: 5673, category: "mobiles", brand: "Samsung",
    description: "5G phone with 50MP camera, 6000mAh battery, and vapor cooling.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Processor", value: "Exynos 1380" },
      { key: "RAM", value: "8GB" },
      { key: "Storage", value: "256GB" },
      { key: "Camera", value: "50MP + 8MP + 2MP" },
      { key: "Battery", value: "6000mAh, 25W Fast Charge" },
    ],
  },
  {
    id: "m2", name: "Redmi 13C 5G", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&auto=format&fit=crop&q=80", price: 10999, mrp: 13999, discount: 21,
    rating: 4.1, ratingCount: 12341, category: "mobiles", brand: "Xiaomi",
    description: "Budget 5G phone with Dimensity 6100+, 50MP AI camera.",
    inStock: true, deliveryDate: "2 days",
    specifications: [
      { key: "Processor", value: "MediaTek Dimensity 6100+" },
      { key: "RAM", value: "4GB/6GB" },
      { key: "Storage", value: "128GB" },
      { key: "Camera", value: "50MP + 2MP" },
      { key: "Battery", value: "5000mAh" },
    ],
  },
  {
    id: "f1", name: "Nike Air Max 270", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80", price: 8995, mrp: 11995, discount: 25,
    rating: 4.6, ratingCount: 2341, category: "fashion", brand: "Nike",
    description: "Iconic Air Max unit in the heel. Lightweight mesh upper for breathability.",
    inStock: true, deliveryDate: "3 days",
    specifications: [
      { key: "Material", value: "Mesh + Synthetic" },
      { key: "Sole", value: "Rubber" },
      { key: "Closure", value: "Lace-up" },
      { key: "Technology", value: "Air Max 270 Cushioning" },
    ],
  },
  {
    id: "f2", name: "Zara Women's Floral Midi Dress", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80", price: 2999, mrp: 4999, discount: 40,
    rating: 4.3, ratingCount: 876, category: "fashion", brand: "Zara",
    description: "Flowy floral midi dress with v-neckline and adjustable straps.",
    inStock: true, deliveryDate: "4 days",
    specifications: [
      { key: "Material", value: "Viscose" },
      { key: "Length", value: "Midi" },
      { key: "Neckline", value: "V-Neck" },
      { key: "Wash Care", value: "Hand Wash" },
    ],
  },
  {
    id: "hk1", name: "Prestige IRIS 750 W Mixer Grinder", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=80", price: 2499, mrp: 3999, discount: 37,
    rating: 4.4, ratingCount: 23456, category: "home-kitchen", brand: "Prestige",
    description: "750W motor, 3 stainless steel jars, 5-year warranty. Liquidize, grind, chutney.",
    inStock: true, deliveryDate: "2 days",
    specifications: [
      { key: "Motor", value: "750W" },
      { key: "Jars", value: "3 (1.5L + 1L + 0.4L)" },
      { key: "Speed Settings", value: "3 + Pulse" },
      { key: "Warranty", value: "5 Years Motor, 2 Years Product" },
    ],
  },
  {
    id: "b1", name: "Lakme Absolute Argan Oil Serum Foundation", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=80", price: 549, mrp: 899, discount: 38,
    rating: 4.3, ratingCount: 4512, category: "beauty", brand: "Lakme",
    description: "Buildable coverage foundation enriched with argan oil. SPF 35. 25 shades.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "SPF", value: "35" },
      { key: "Finish", value: "Natural / Satin" },
      { key: "Volume", value: "30ml" },
      { key: "Skin Type", value: "Normal to Dry" },
    ],
  },
  {
    id: "s1", name: "Nivia Pro Knit Football", image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&auto=format&fit=crop&q=80", price: 599, mrp: 999, discount: 40,
    rating: 4.2, ratingCount: 1234, category: "sports", brand: "Nivia",
    description: "Size 5 football with machine-stitched panels and butyl bladder.",
    inStock: true, deliveryDate: "2 days",
    specifications: [
      { key: "Size", value: "5 (Standard)" },
      { key: "Material", value: "PU Outer, Butyl Bladder" },
      { key: "Stitching", value: "Machine Stitched" },
      { key: "Panels", value: "32" },
    ],
  },
];

// ---- Additional products (appended to allProducts) ----
allProducts.push(
  {
    id: "m3", name: "Realme Narzo 70 Pro 5G", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&auto=format&fit=crop&q=80",
    price: 16999, mrp: 21999, discount: 22,
    rating: 4.0, ratingCount: 3421, category: "mobiles", brand: "Realme",
    description: "5G smartphone with Sony IMX890 OIS camera, 67W SUPERVOOC charging, and 5000mAh battery.",
    inStock: true, deliveryDate: "2 days",
    specifications: [
      { key: "Processor", value: "Dimensity 7050" },
      { key: "Camera", value: "50MP Sony IMX890 OIS" },
      { key: "Battery", value: "5000mAh, 67W charging" },
    ],
  },
  {
    id: "f3", name: "Allen Solly Men's Formal Shirt", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&auto=format&fit=crop&q=80",
    price: 1199, mrp: 1799, discount: 33,
    rating: 4.2, ratingCount: 5231, category: "fashion", brand: "Allen Solly",
    description: "Premium cotton formal shirt with wrinkle-resistant finish. Perfect for office and occasions.",
    inStock: true, deliveryDate: "3 days",
    specifications: [
      { key: "Material", value: "100% Cotton" },
      { key: "Fit", value: "Regular Fit" },
      { key: "Sleeve", value: "Full Sleeve" },
    ],
  },
  {
    id: "f4", name: "Nike Air Force 1 '07", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
    price: 7995, mrp: 9995, discount: 20,
    rating: 4.7, ratingCount: 15671, category: "fashion", brand: "Nike",
    description: "The classic Nike Air Force 1 with crisp leather upper and Air cushioning.",
    inStock: true, deliveryDate: "3 days",
    specifications: [
      { key: "Material", value: "Leather" },
      { key: "Sole", value: "Rubber" },
      { key: "Closure", value: "Lace-up" },
    ],
  },
  {
    id: "hk2", name: "Borosil Vision Glass Set of 6", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop&q=80",
    price: 399, mrp: 699, discount: 42,
    rating: 4.5, ratingCount: 8761, category: "home-kitchen", brand: "Borosil",
    description: "Borosilicate glass drinking set. Microwave safe, dishwasher safe, temperature resistant.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Set", value: "6 glasses × 310ml" },
      { key: "Material", value: "Borosilicate glass" },
      { key: "Microwave Safe", value: "Yes" },
    ],
  },
  {
    id: "b2", name: "L'Oreal Revitalift Pure Hyaluronic Acid Serum", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&auto=format&fit=crop&q=80",
    price: 699, mrp: 1299, discount: 46,
    rating: 4.4, ratingCount: 3892, category: "beauty", brand: "L'Oreal Paris",
    description: "Anti-aging serum with 1.5% concentrated hyaluronic acid. Fills fine lines in 1 week.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Key Ingredient", value: "1.5% Pure Hyaluronic Acid" },
      { key: "Volume", value: "30ml" },
      { key: "Skin Type", value: "All skin types" },
    ],
  },
  {
    id: "s2", name: "Adidas Men Running Shoes", image: "https://images.unsplash.com/photo-1556048219-bb6978360b84?w=400&auto=format&fit=crop&q=80",
    price: 3499, mrp: 5999, discount: 41,
    rating: 4.4, ratingCount: 7654, category: "sports", brand: "Adidas",
    description: "Lightweight running shoes with Bounce cushioning, breathable mesh upper, and rubber outsole.",
    inStock: true, deliveryDate: "3 days",
    specifications: [
      { key: "Upper Material", value: "Mesh" },
      { key: "Sole", value: "Rubber" },
      { key: "Cushioning", value: "Bounce Technology" },
    ],
  },
  {
    id: "ap1", name: "LG 1.5 Ton 5 Star Inverter AC", image: "https://images.unsplash.com/photo-1631567091196-6a8440cf9a08?w=400&auto=format&fit=crop&q=80",
    price: 36990, mrp: 52990, discount: 30,
    rating: 4.3, ratingCount: 4512, category: "appliances", brand: "LG",
    description: "5-star inverter AC with dual inverter compressor, HD filter, and auto cleaning.",
    inStock: true, deliveryDate: "5 days",
    specifications: [
      { key: "Capacity", value: "1.5 Ton" },
      { key: "Star Rating", value: "5 Star" },
      { key: "Warranty", value: "1 Year Product, 10 Year Compressor" },
    ],
  },
  {
    id: "ap2", name: "Samsung 253L Double Door Refrigerator", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&auto=format&fit=crop&q=80",
    price: 23990, mrp: 32990, discount: 27,
    rating: 4.4, ratingCount: 6832, category: "appliances", brand: "Samsung",
    description: "Double door refrigerator with twin cooling plus, digital inverter, and all-around cooling.",
    inStock: true, deliveryDate: "5 days",
    specifications: [
      { key: "Capacity", value: "253L" },
      { key: "Star Rating", value: "3 Star" },
      { key: "Compressor", value: "Digital Inverter" },
    ],
  },
  {
    id: "t6", name: "Apple iPhone 15 128GB", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80",
    price: 69999, mrp: 79900, discount: 12,
    rating: 4.7, ratingCount: 45231, category: "mobiles", brand: "Apple",
    description: "iPhone 15 with A16 Bionic chip, 48MP camera system, Dynamic Island, and USB-C connector.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Chip", value: "A16 Bionic" },
      { key: "Camera", value: "48MP + 12MP" },
      { key: "Battery", value: "3877mAh" },
      { key: "Display", value: "6.1\" Super Retina XDR" },
      { key: "Storage", value: "128GB" },
    ],
  },
  {
    id: "bk1", name: "Atomic Habits - James Clear", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80",
    price: 299, mrp: 499, discount: 40,
    rating: 4.8, ratingCount: 94532, category: "books", brand: "Penguin Random House",
    description: "The #1 New York Times bestseller. Learn how tiny changes can deliver remarkable results.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Author", value: "James Clear" },
      { key: "Pages", value: "320" },
      { key: "Language", value: "English" },
    ],
  },
  {
    id: "bk2", name: "The Psychology of Money", image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&auto=format&fit=crop&q=80",
    price: 249, mrp: 399, discount: 37,
    rating: 4.7, ratingCount: 67821, category: "books", brand: "Jaico Publishing",
    description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel.",
    inStock: true, deliveryDate: "Tomorrow",
    specifications: [
      { key: "Author", value: "Morgan Housel" },
      { key: "Pages", value: "256" },
    ],
  },
  {
    id: "fu1", name: "Wakefit Orthopedic Memory Foam Mattress", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=80",
    price: 8999, mrp: 15999, discount: 43,
    rating: 4.5, ratingCount: 15231, category: "furniture", brand: "Wakefit",
    description: "3-layer orthopedic foam mattress with memory foam top. 10-year warranty and 100-night trial.",
    inStock: true, deliveryDate: "7 days",
    specifications: [
      { key: "Size", value: "Queen (60\"×78\")" },
      { key: "Thickness", value: "8 Inches" },
      { key: "Warranty", value: "10 Years" },
    ],
  },
  {
    id: "to1", name: "LEGO Classic Creative Brick Box", image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&auto=format&fit=crop&q=80",
    price: 1999, mrp: 3499, discount: 42,
    rating: 4.7, ratingCount: 23412, category: "toys", brand: "LEGO",
    description: "Classic creative brick box with 484 bricks and 16 fun colors. Perfect for ages 4+.",
    inStock: true, deliveryDate: "2 days",
    specifications: [
      { key: "Age Group", value: "4+ Years" },
      { key: "Pieces", value: "484" },
    ],
  },
);

export const cartItems: CartItem[] = [
  {
    product: { id: "d1", name: "boAt Airdopes 141", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&auto=format&fit=crop&q=80", price: 1299, mrp: 2490, discount: 47, rating: 4.2, ratingCount: 128453 },
    quantity: 1,
  },
  {
    product: { id: "t2", name: "Levi's Men Slim Fit Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&auto=format&fit=crop&q=80", price: 1399, mrp: 2999, discount: 53, rating: 4.3, ratingCount: 8934 },
    quantity: 2,
  },
  {
    product: { id: "n3", name: "Ergonomic Study Chair", image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&auto=format&fit=crop&q=80", price: 5499, mrp: 8999, discount: 39, rating: 4.1, ratingCount: 342 },
    quantity: 1,
  },
];

// Helper: get products by category
export const getProductsByCategory = (categoryId: string): Product[] => {
  return allProducts.filter((p) => p.category === categoryId);
};