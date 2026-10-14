import prisma from "../lib/prisma.js";

// ShopZone initial seed data for PostgreSQL
const INITIAL_CATEGORIES = [
  { name: "For You", slug: "for-you", icon: "sparkles" },
  { name: "Fashion", slug: "fashion", icon: "shirt" },
  { name: "Mobiles", slug: "mobiles", icon: "smartphone" },
  { name: "Electronics", slug: "electronics", icon: "headphones" },
  { name: "Beauty", slug: "beauty", icon: "smile" },
  { name: "Home", slug: "home", icon: "home" },
  { name: "Appliances", slug: "appliances", icon: "tv" },
  { name: "Toys, baby...", slug: "toys-baby", icon: "gamepad-2" },
  { name: "Food & Health", slug: "food-health", icon: "heart-pulse" },
  { name: "Auto Accessories", slug: "auto-accessories", icon: "car" },
  { name: "Sports & Fitness", slug: "sports-fitness", icon: "dumbbell" },
  { name: "Furniture", slug: "furniture", icon: "armchair" },
  { name: "Books", slug: "books", icon: "book-open" },
  { name: "2 Wheelers", slug: "2-wheelers", icon: "bike" },
];

const INITIAL_PRODUCTS = [
  // Deals of the day
  {
    name: "boAt Airdopes 141 Bluetooth Headset",
    description: "boAt Airdopes 141 with 42H Playtime, Beast Mode, ENx Tech, ASAP Charge Bluetooth Headset",
    price: 1299,
    mrp: 2490,
    discount: 47,
    rating: 4.2,
    ratingCount: 128453,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
    brand: "boAt",
    section: "deal",
    isAssured: true,
  },
  {
    name: "Noise ColorFit Pulse 2 Max Smartwatch",
    description: "Noise ColorFit Pulse 2 Max 1.85'' Display, Bluetooth Calling Smart Watch",
    price: 1299,
    mrp: 2999,
    discount: 57,
    rating: 4.1,
    ratingCount: 34521,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    brand: "Noise",
    section: "deal",
    isAssured: true,
  },
  {
    name: "Sony WH-CH520 Wireless Bluetooth Headphones",
    description: "Sony WH-CH520 with 50Hrs Playtime, DSEE, Multi-point Connection Wireless Headphones",
    price: 1999,
    mrp: 3990,
    discount: 49,
    rating: 4.4,
    ratingCount: 6721,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    brand: "Sony",
    section: "deal",
    isAssured: true,
  },
  {
    name: "Realme TechLife Buds T100",
    description: "realme TechLife Buds T100 with 28H Playtime, AI ENC for Calls Bluetooth Headset",
    price: 1299,
    mrp: 2499,
    discount: 47,
    rating: 4.0,
    ratingCount: 2145,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format&fit=crop&q=80",
    brand: "Realme",
    section: "deal",
    isAssured: true,
  },
  // Trending Now
  {
    name: "POCO X8 5G (Champagne Gold, 256 GB)",
    description: "POCO X8 5G with Snapdragon processor, 10000 mAh mega battery, 120Hz AMOLED display",
    price: 26999,
    mrp: 32999,
    discount: 18,
    rating: 4.5,
    ratingCount: 1420,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80",
    brand: "POCO",
    section: "trending",
    isAssured: true,
  },
  {
    name: "Mivi One 5G (Forest Green, 128 GB)",
    description: "Mivi One 5G Pure Android 16 with Snapdragon, 50MP Sony OIS Camera",
    price: 14999,
    mrp: 19999,
    discount: 25,
    rating: 4.3,
    ratingCount: 980,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80",
    brand: "MIVI",
    section: "trending",
    isAssured: true,
  },
  {
    name: "realme TechLife 32 Inch QLED Google TV",
    description: "realme TechLife 80 cm (32 inch) QLED HD Ready Smart Google TV with Dolby Audio",
    price: 10499,
    mrp: 18999,
    discount: 44,
    rating: 4.4,
    ratingCount: 5670,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=80",
    brand: "Realme",
    section: "trending",
    isAssured: true,
  },
  // New Arrivals
  {
    name: "OnePlus Nord CE 4 Lite 5G (Super Silver, 128 GB)",
    description: "OnePlus Nord CE 4 Lite 5G with 5500 mAh battery, 80W SUPERVOOC charging",
    price: 18999,
    mrp: 21999,
    discount: 14,
    rating: 4.3,
    ratingCount: 2103,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80",
    brand: "OnePlus",
    section: "new",
    isAssured: true,
  },
  {
    name: "H&M Regular Fit Cotton T-Shirt",
    description: "Men Regular Fit Round Neck Pure Cotton Casual T-Shirt",
    price: 799,
    mrp: 1299,
    discount: 38,
    rating: 4.0,
    ratingCount: 567,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    brand: "H&M",
    section: "new",
    isAssured: true,
  },
];

// Helper to ensure database is seeded with initial ShopZone data
export async function seedIfEmpty() {
  try {
    const catCount = await prisma.category.count();
    if (catCount === 0) {
      for (const cat of INITIAL_CATEGORIES) {
        await prisma.category.upsert({
          where: { name: cat.name },
          update: {},
          create: cat,
        });
      }
      console.log("[ShopZone Seed] Initial categories seeded.");
    }

    const prodCount = await prisma.product.count();
    if (prodCount === 0) {
      const allCats = await prisma.category.findMany();
      const defaultCat = allCats[0]?.id;

      for (const prod of INITIAL_PRODUCTS) {
        await prisma.product.create({
          data: {
            ...prod,
            categoryId: defaultCat,
          },
        });
      }
      console.log("[ShopZone Seed] Initial products seeded.");
    }
  } catch (error) {
    console.error("[ShopZone Seed Error]:", error.message);
  }
}

// GET HOME PAGE DATA
export async function getHomeData(req, res, next) {
  try {
    await seedIfEmpty();

    const [categories, deals, trending, newArrivals, offers] = await Promise.all([
      prisma.category.findMany({ orderBy: { id: "asc" } }),
      prisma.product.findMany({ where: { section: "deal" }, take: 10 }),
      prisma.product.findMany({ where: { section: "trending" }, take: 10 }),
      prisma.product.findMany({ where: { section: "new" }, take: 10 }),
      prisma.offer.findMany({ take: 5 }),
    ]);

    return res.json({
      categories,
      deals,
      trending,
      newArrivals,
      offers,
    });
  } catch (error) {
    next(error);
  }
}

// GET ALL PRODUCTS WITH FILTERING & SEARCH
export async function getProducts(req, res, next) {
  try {
    const { category, section, search, brand, minPrice, maxPrice } = req.query;

    const where = {};
    if (section) where.section = String(section);
    if (brand) where.brand = { contains: String(brand), mode: "insensitive" };
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
        { brand: { contains: String(search), mode: "insensitive" } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ products });
  } catch (error) {
    next(error);
  }
}

// GET CATEGORIES
export async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    return res.json({ categories });
  } catch (error) {
    next(error);
  }
}

// GET OFFERS
export async function getOffers(req, res, next) {
  try {
    const offers = await prisma.offer.findMany();
    return res.json({ offers });
  } catch (error) {
    next(error);
  }
}
