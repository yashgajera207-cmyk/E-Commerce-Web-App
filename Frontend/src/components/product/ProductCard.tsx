import { Heart } from "lucide-react";
import Badge from "../common/Badge";
import PriceTag from "../common/PriceTag";
import Button from "../common/Button";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
}

/**
 * Compact product card used in Deals of the Day, related products, etc.
 */
export default function ProductCard({ product, onAddToCart, onWishlist }: ProductCardProps) {
  const { name, image, price, mrp, discount } = product;

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-4 flex flex-col">
      {discount && (
        <Badge tone="red" className="absolute top-3 left-3">
          {discount}% OFF
        </Badge>
      )}
      <button
        onClick={() => onWishlist?.(product)}
        aria-label="Add to wishlist"
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-400 hover:text-brand-red cursor-pointer"
      >
        <Heart className="w-4 h-4" />
      </button>

      <div className="h-32 flex items-center justify-center text-6xl mb-3">{image}</div>

      <p className="text-sm font-medium text-gray-800 clamp-2 mb-2 min-h-[2.5rem]">{name}</p>

      <PriceTag price={price} mrp={mrp} />

      <Button
        variant="secondary"
        size="sm"
        className="mt-3 w-full"
        onClick={() => onAddToCart?.(product)}
      >
        Add to Cart
      </Button>
    </div>
  );
}
