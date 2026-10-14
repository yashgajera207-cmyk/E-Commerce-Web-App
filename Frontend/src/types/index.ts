// Shared domain types for the ShopZone storefront.
// Keeping these in one place means every component/page imports
// the same contract, instead of re-declaring shapes ad-hoc.

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface HeroSlide {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  theme: "dark" | "light";
}

export interface Perk {
  id: number;
  icon: string;
  label: string;
  sub: string;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  /** Emoji placeholder today; swap for an image URL once a real
   *  product-image pipeline / CDN is wired up. */
  image: string;
  price: number;
  mrp?: number;
  discount?: number;
  rating?: number;
  ratingCount?: number;
  category?: string;
  brand?: string;
  description?: string;
  specifications?: ProductSpec[];
  inStock?: boolean;
  deliveryDate?: string;
}

export type ButtonVariant = "primary" | "secondary" | "blue" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type BadgeTone = "red" | "orange" | "green" | "navy" | "gray" | "blue" | "yellow" | "purple";

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Work" | "Other";
  isDefault?: boolean;
}

export interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  brands?: string[];
  rating?: number;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "rating";
}