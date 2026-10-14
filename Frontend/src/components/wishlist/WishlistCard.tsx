import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, ShieldCheck } from "lucide-react";
import type { Product } from "../../types";

interface WishlistCardProps {
  product: Product;
  onMoveToCart: (product: Product) => void;
  onRemove: (productId: string) => void;
}

export default function WishlistCard({ product, onMoveToCart, onRemove }: WishlistCardProps) {
  const { id, name, image, price, mrp, discount, rating, ratingCount, inStock } = product;

  const isUrl =
    image &&
    typeof image === "string" &&
    (image.startsWith("http") || image.startsWith("/") || image.startsWith("data:"));

  return (
    <div className="bg-white border-b border-gray-100 hover:bg-gray-50/50 transition-colors p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
      {/* Left section: Image + Details */}
      <div className="flex items-start gap-4 sm:gap-6 flex-1 min-w-0 w-full">
        {/* Product Image */}
        <Link
          to={`/product/${id}`}
          className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-white rounded-md border border-gray-100 p-2 flex items-center justify-center overflow-hidden group-hover:opacity-95"
        >
          {isUrl ? (
            <img
              src={image}
              alt={name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <span className="text-4xl">{image || "🛍️"}</span>
          )}
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
          <Link
            to={`/product/${id}`}
            className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#2874f0] transition-colors leading-relaxed"
          >
            {name}
          </Link>

          {/* Ratings & F-Assured */}
          <div className="flex items-center gap-2 flex-wrap">
            {rating && (
              <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                {rating} ★
              </span>
            )}
            {ratingCount && (
              <span className="text-gray-400 text-xs">
                ({ratingCount > 1000 ? `${(ratingCount / 1000).toFixed(1)}k` : ratingCount})
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[10px] font-bold italic text-[#2874f0] bg-blue-50 px-1.5 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3 text-[#2874f0]" />
              Assured
            </span>
          </div>

          {/* Pricing */}
          <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
            <span className="text-base sm:text-lg font-black text-gray-900">
              ₹{Number(price).toLocaleString("en-IN")}
            </span>
            {mrp && mrp > price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{Number(mrp).toLocaleString("en-IN")}
              </span>
            )}
            {discount && (
              <span className="text-xs font-bold text-[#388e3c]">{discount}% off</span>
            )}
          </div>

          {/* Stock / Delivery */}
          <div className="text-[11px] text-gray-500">
            {inStock !== false ? (
              <span className="text-[#388e3c] font-semibold">Free Delivery</span>
            ) : (
              <span className="text-red-500 font-medium">Currently out of stock</span>
            )}
            {product.deliveryDate && ` • Delivery by ${product.deliveryDate}`}
          </div>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <button
          onClick={() => onRemove(id)}
          title="Remove from Wishlist"
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onMoveToCart(product)}
          className="flex items-center gap-1.5 bg-[#ff9f00] hover:bg-[#f39700] text-white text-xs font-bold py-2.5 px-4 rounded-md shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Move to Cart</span>
        </button>
      </div>
    </div>
  );
}
