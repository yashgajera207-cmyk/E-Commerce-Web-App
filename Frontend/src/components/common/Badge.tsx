import { type ReactNode } from "react";
import type { BadgeTone } from "../../types";

const tones: Record<BadgeTone, string> = {
  red: "bg-red-50 text-red-700 border border-red-200",
  orange: "bg-[#fb641b] text-white",
  green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  navy: "bg-[#172337] text-white",
  gray: "bg-gray-100 text-gray-700 border border-gray-200",
  blue: "bg-blue-50 text-[#2874f0] border border-blue-200",
  yellow: "bg-[#ffe500] text-black font-bold",
  purple: "bg-purple-50 text-purple-700 border border-purple-200",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
}

export default function Badge({ children, tone = "orange", dot = false, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-sm tracking-wide ${tones[tone]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
