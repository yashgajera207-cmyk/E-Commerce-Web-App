import { Star } from "lucide-react";

interface RatingProps {
  value?: number;
  count?: number;
  size?: "sm" | "md";
}

/**
 * Star rating display, e.g. ★ 4.3 (1,547)
 */
export default function Rating({ value = 0, count, size = "sm" }: RatingProps) {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={`flex items-center gap-1 ${textSize}`}>
      <span className="flex items-center gap-0.5 bg-brand-green text-white px-1.5 py-0.5 rounded font-semibold text-[11px]">
        {value.toFixed(1)}
        <Star className={`${starSize} fill-white`} />
      </span>
      {count !== undefined && (
        <span className="text-gray-500">({count.toLocaleString("en-IN")})</span>
      )}
    </div>
  );
}
