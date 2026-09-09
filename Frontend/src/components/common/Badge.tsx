import type { ReactNode } from "react";
import type { BadgeTone } from "../../types";

const tones: Record<BadgeTone, string> = {
  red: "bg-brand-red text-white",
  orange: "bg-brand-orange text-white",
  green: "bg-brand-green text-white",
  navy: "bg-brand-navy text-white",
  gray: "bg-gray-100 text-gray-700",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export default function Badge({ children, tone = "orange", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
