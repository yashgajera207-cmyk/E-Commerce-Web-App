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
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type BadgeTone = "red" | "orange" | "green" | "navy" | "gray";

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