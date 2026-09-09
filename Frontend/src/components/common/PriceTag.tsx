const formatINR = (n: number): string => `₹${n.toLocaleString("en-IN")}`;

interface PriceTagProps {
  price: number;
  mrp?: number;
  discount?: number;
  size?: "md" | "lg";
}

/**
 * Shows current price, original MRP (struck through) and discount %.
 */
export default function PriceTag({ price, mrp, discount, size = "md" }: PriceTagProps) {
  const priceSize = size === "lg" ? "text-2xl" : "text-base";

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`font-bold text-gray-900 font-display ${priceSize}`}>
        {formatINR(price)}
      </span>
      {mrp && <span className="text-gray-400 text-sm line-through">{formatINR(mrp)}</span>}
      {discount && (
        <span className="text-brand-green text-sm font-semibold">{discount}% off</span>
      )}
    </div>
  );
}
