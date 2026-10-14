import { groq } from "next-sanity";

// Query active hero banners
export const HERO_BANNERS_QUERY = groq`
  *[_type == "heroBanner"] | order(order asc) {
    _id,
    title,
    eyebrow,
    subtitle,
    priceText,
    extraBadge,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    linkUrl,
    order
  }
`;

// Query categories
export const CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    icon,
    "imageUrl": image.asset->url,
    order
  }
`;

// Query deals of the day
export const DEALS_QUERY = groq`
  *[_type == "product" && section == "deal"] | order(_createdAt desc) [0...10] {
    _id,
    title,
    "slug": slug.current,
    description,
    price,
    mrp,
    discountPercent,
    rating,
    ratingCount,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    brand,
    isAssured
  }
`;

// Query trending products
export const TRENDING_QUERY = groq`
  *[_type == "product" && section == "trending"] | order(_createdAt desc) [0...10] {
    _id,
    title,
    "slug": slug.current,
    description,
    price,
    mrp,
    discountPercent,
    rating,
    ratingCount,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    brand,
    isAssured
  }
`;
