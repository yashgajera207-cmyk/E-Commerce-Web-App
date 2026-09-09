import type { ElementType } from "react";
import { Smartphone, Headphones, Shirt, Sofa, Sparkles, Dumbbell, Store, Gamepad2 } from "lucide-react";
import { categories } from "../../data/products";

const icons: Record<string, ElementType> = {
  smartphone: Smartphone,
  headphones: Headphones,
  shirt: Shirt,
  sofa: Sofa,
  sparkles: Sparkles,
  dumbbell: Dumbbell,
  store: Store,
  "gamepad-2": Gamepad2,
};

export default function CategoryGrid() {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar px-4 sm:px-6 py-4 gap-6 sm:gap-8">
        {categories.map((c) => {
          const Icon = icons[c.icon];
          return (
            <button
              key={c.id}
              className="group flex flex-col items-center gap-2 shrink-0 cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700" strokeWidth={1.5} />
              </div>
              <span className="text-[13px] sm:text-sm font-medium text-gray-800 text-center leading-tight whitespace-nowrap">
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}