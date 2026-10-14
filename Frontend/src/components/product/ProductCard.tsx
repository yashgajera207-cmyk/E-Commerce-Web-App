import { Heart, Star, ShoppingCart, ShieldCheck } from "lucide-react";
import type { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  variant?: "grid" | "list";
}

export default function ProductCard({
  product,
  onAddToCart,
  onWishlist,
  variant = "grid",
}: ProductCardProps) {
  const { name, image, price, mrp, discount, rating, ratingCount, brand, specifications, deliveryDate } = product;
  const { isInWishlist, toggleWishlist } = useCart();
  const navigate = useNavigate();

  const wishlisted = isInWishlist(product.id);

  const isUrl =
    image &&
    typeof image === "string" &&
    (image.startsWith("http") || image.startsWith("/") || image.startsWith("data:"));

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    onWishlist?.(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  // FLIPKART SIGNATURE HORIZONTAL SPECIFICATION CARD (List View)
  if (variant === "list") {
    return (
      <div
        onClick={handleCardClick}
        className="group relative bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 cursor-pointer"
      >
        {/* Left: Product Image */}
        <div className="relative w-full sm:w-48 h-44 sm:h-48 shrink-0 flex items-center justify-center p-2 bg-white rounded-md">
          <button
            onClick={handleWishlistClick}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-1 right-1 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-xs border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>

          {isUrl ? (
            <img
              src={image}
              alt={name}
              className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <span className="text-6xl">{image || "🛍️"}</span>
          )}
        </div>

        {/* Middle: Title, Rating & Flipkart Bullet Specifications */}
        <div className="flex-1 min-w-0 space-y-2">
          {brand && (
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {brand}
            </p>
          )}

          <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#2874f0] transition-colors leading-snug">
            {name}
          </h3>

          {/* Rating badge */}
          {rating && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-xs font-bold px-1.5 py-0.5 rounded">
                <span>{rating}</span>
                <Star className="w-3 h-3 fill-white text-white" />
              </span>
              {ratingCount && (
                <span className="text-gray-500 text-xs font-medium">
                  {ratingCount.toLocaleString("en-IN")} Ratings & Reviews
                </span>
              )}
            </div>
          )}

          {/* Flipkart Specification Bullet Points */}
          <ul className="text-xs text-gray-600 space-y-1 pt-1 list-disc list-inside">
            {specifications && specifications.length > 0 ? (
              specifications.slice(0, 5).map((spec, i) => (
                <li key={i} className="truncate">
                  <strong className="text-gray-700 font-semibold">{spec.key}:</strong>{" "}
                  {spec.value}
                </li>
              ))
            ) : (
              <>
                <li>1 Year Manufacturer Warranty for Device</li>
                <li>6 Months In-Box Accessories Warranty</li>
                <li>Original Genuine Sealed Pack with Invoice</li>
              </>
            )}
          </ul>
        </div>

        {/* Right: Pricing, Flipkart Assured & Add to Cart */}
        <div className="sm:w-56 shrink-0 flex flex-col justify-between sm:border-l sm:border-gray-100 sm:pl-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                ₹{Number(price).toLocaleString("en-IN")}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold italic text-[#2874f0] bg-blue-50 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 text-[#2874f0]" />
                Assured
              </span>
            </div>

            <div className="flex items-baseline gap-2 text-xs">
              {mrp && mrp > price && (
                <span className="text-gray-400 line-through">
                  ₹{Number(mrp).toLocaleString("en-IN")}
                </span>
              )}
              {discount && (
                <span className="font-bold text-[#388e3c]">
                  {discount}% off
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-600 font-medium pt-1">
              <span className="text-[#388e3c] font-bold">Free delivery</span>
              {deliveryDate && ` by ${deliveryDate}`}
            </p>
            <p className="text-[10px] text-[#388e3c] font-semibold">
              Bank Offer 5% Cashback
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="mt-4 w-full bg-[#ff9f00] hover:bg-[#f39700] text-white text-xs font-bold py-2.5 px-4 rounded shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    );
  }

  // STANDARD FLIPKART GRID CARD (Grid View)
  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-200 p-3 sm:p-4 flex flex-col justify-between h-full cursor-pointer"
    >
      {/* Top row: Discount badge & Wishlist button */}
      <div className="flex items-center justify-between z-10 w-full mb-1.5">
        {discount ? (
          <span className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded shadow-2xs">
            {discount}% OFF
          </span>
        ) : (
          <div />
        )}

        <button
          onClick={handleWishlistClick}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white shadow-xs border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              wishlisted ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>
      </div>

      {/* Product Image Area */}
      <div className="h-36 sm:h-44 w-full flex items-center justify-center overflow-hidden mb-2 p-2 bg-white rounded-md">
        {isUrl ? (
          <img
            src={image}
            alt={name}
            className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
            loading="lazy"
          />
        ) : (
          <span className="text-5xl select-none transform group-hover:scale-105 transition-transform">
            {image || "🛍️"}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1 flex-1">
        {/* Rating Pill & F-Assured */}
        <div className="flex items-center gap-2">
          {rating && (
            <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
              <span>{rating}</span>
              <Star className="w-2.5 h-2.5 fill-white text-white" />
            </span>
          )}
          {ratingCount && (
            <span className="text-gray-400 text-[10px] truncate">
              ({ratingCount > 1000 ? `${(ratingCount / 1000).toFixed(1)}k` : ratingCount})
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-[#2874f0] transition-colors min-h-[2rem]">
          {name}
        </h3>

        {/* Pricing */}
        <div className="flex flex-wrap items-baseline gap-1.5 mt-auto pt-1">
          <span className="text-sm sm:text-base font-black text-gray-900">
            ₹{Number(price).toLocaleString("en-IN")}
          </span>
          {mrp && mrp > price && (
            <span className="text-[11px] text-gray-400 line-through">
              ₹{Number(mrp).toLocaleString("en-IN")}
            </span>
          )}
          {discount && (
            <span className="text-[10px] font-bold text-[#388e3c]">
              {discount}% off
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart?.(product);
        }}
        className="mt-2.5 w-full bg-[#ff9f00] hover:bg-[#f39700] text-white text-xs font-bold py-2 px-3 rounded shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}
