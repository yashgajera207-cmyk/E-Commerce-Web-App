/**
 * ShopZone to Sanity CMS Seeding Script
 * Run: node seed-sanity.mjs <projectId> <token>
 */

import { createClient } from "@sanity/client";
import { shopzoneHeroBanners, shopzoneCategories, shopzoneDeals } from "./src/sanity/lib/fallbackData.js";

const projectId = process.argv[2] || process.env.SANITY_PROJECT_ID;
const token = process.argv[3] || process.env.SANITY_API_TOKEN;
const dataset = process.env.SANITY_DATASET || "production";

if (!projectId || !token) {
  console.log("Usage: node seed-sanity.mjs <PROJECT_ID> <WRITE_TOKEN>");
  console.log("Tip: You can create a Write token from https://sanity.io/manage");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function seed() {
  console.log("Uploading Categories to Sanity...");
  for (let i = 0; i < shopzoneCategories.length; i++) {
    const cat = shopzoneCategories[i];
    await client.createOrReplace({
      _id: `category-${cat.id}`,
      _type: "category",
      name: cat.name,
      slug: { _type: "slug", current: cat.id },
      icon: cat.icon,
      order: i,
    });
  }

  console.log("Uploading Hero Banners to Sanity...");
  for (let i = 0; i < shopzoneHeroBanners.length; i++) {
    const b = shopzoneHeroBanners[i];
    await client.createOrReplace({
      _id: b._id,
      _type: "heroBanner",
      title: b.title,
      eyebrow: b.eyebrow,
      subtitle: b.subtitle,
      priceText: b.priceText,
      extraBadge: b.extraBadge,
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl,
      order: i,
    });
  }

  console.log("Uploading Deal Products to Sanity...");
  for (const deal of shopzoneDeals) {
    await client.createOrReplace({
      _id: `prod-${deal.id}`,
      _type: "product",
      title: deal.name,
      slug: { _type: "slug", current: deal.id },
      description: deal.description,
      price: deal.price,
      mrp: deal.mrp,
      discountPercent: deal.discount,
      rating: deal.rating,
      ratingCount: deal.ratingCount,
      imageUrl: deal.image,
      brand: deal.brand,
      section: "deal",
      isAssured: deal.isAssured,
    });
  }

  console.log("🎉 Sanity CMS Seeded successfully with all ShopZone data!");
}

seed().catch(err => console.error("Seeding failed:", err.message));
