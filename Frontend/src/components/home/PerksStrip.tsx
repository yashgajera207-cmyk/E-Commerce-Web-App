import type { ElementType } from "react";
import { BadgePercent, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { perks } from "../../data/products";

const icons: Record<string, ElementType> = {
  "badge-percent": BadgePercent,
  truck: Truck,
  "rotate-ccw": RotateCcw,
  "shield-check": ShieldCheck,
};

// Subtle per-item accent so the strip doesn't read as one repeated block
const accents = [
  "bg-blue-50 text-brand-blue",
  "bg-amber-50 text-amber-600",
  "bg-emerald-50 text-emerald-600",
  "bg-violet-50 text-violet-600",
];

export default function PerksStrip() {
  return (
    <section className="bg-white rounded-2xl shadow-sm px-2 py-2 sm:px-4 sm:py-2 grid grid-cols-2 sm:grid-cols-4 divide-y divide-gray-100 sm:divide-y-0 sm:divide-x">
      {perks.map((p, i) => {
        const Icon = icons[p.icon];
        return (
          <div
            key={p.id}
            className="flex items-center gap-3 px-4 py-3.5 group cursor-default transition-colors hover:bg-gray-50 rounded-xl"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${accents[i % accents.length]}`}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{p.label}</p>
              <p className="text-xs text-gray-500 truncate">{p.sub}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}