import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Shirt,
  Smartphone,
  Laptop,
  Sparkles,
  Lamp,
  Tv,
  Gamepad2,
  HeartPulse,
  Car,
  Dumbbell,
  Armchair,
  BookOpen,
  Bike,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  icon: any;
  color?: string;
}

const SHOPZONE_CATEGORIES: CategoryItem[] = [
  { id: "for-you", name: "For You", icon: ShoppingBag, color: "text-amber-500" },
  { id: "fashion", name: "Fashion", icon: Shirt, color: "text-blue-500" },
  { id: "mobiles", name: "Mobiles", icon: Smartphone, color: "text-indigo-500" },
  { id: "electronics", name: "Electronics", icon: Laptop, color: "text-cyan-600" },
  { id: "beauty", name: "Beauty", icon: Sparkles, color: "text-pink-500" },
  { id: "home-kitchen", name: "Home", icon: Lamp, color: "text-amber-600" },
  { id: "appliances", name: "Appliances", icon: Tv, color: "text-purple-600" },
  { id: "toys", name: "Toys, baby", icon: Gamepad2, color: "text-emerald-500" },
  { id: "food", name: "Food & Health", icon: HeartPulse, color: "text-rose-500" },
  { id: "auto", name: "Auto Acc.", icon: Car, color: "text-sky-600" },
  { id: "sports", name: "Sports", icon: Dumbbell, color: "text-lime-600" },
  { id: "furniture", name: "Furniture", icon: Armchair, color: "text-orange-500" },
  { id: "books", name: "Books", icon: BookOpen, color: "text-teal-600" },
  { id: "two-wheelers", name: "2 Wheelers", icon: Bike, color: "text-violet-600" },
];

export default function CategoryGrid() {
  const [selectedId, setSelectedId] = useState("for-you");
  const navigate = useNavigate();

  return (
    <section className="bg-white border-b border-gray-200/80 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-6 flex items-center overflow-x-auto no-scrollbar gap-2 sm:gap-6 py-1.5 sm:py-2 scroll-smooth">
        {SHOPZONE_CATEGORIES.map((item) => {
          const IconComponent = item.icon;
          const isSelected = selectedId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedId(item.id);
                navigate(`/category/${item.id}`);
              }}
              className="group flex flex-col items-center gap-1 sm:gap-1.5 shrink-0 px-1.5 sm:px-2 py-1 sm:py-1.5 cursor-pointer relative transition-all duration-150"
            >
              {/* Category Circle Icon */}
              <div
                className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
                  isSelected
                    ? "bg-blue-50/90 ring-2 ring-[#2874f0]/30"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <IconComponent
                  className={`w-5 h-5 sm:w-7 sm:h-7 transition-colors ${
                    isSelected ? "text-[#2874f0]" : "text-gray-700 group-hover:text-gray-900"
                  }`}
                  strokeWidth={1.75}
                />
              </div>

              {/* Category Label */}
              <span
                className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? "text-[#2874f0] font-bold"
                    : "text-gray-800 group-hover:text-[#2874f0]"
                }`}
              >
                {item.name}
              </span>

              {/* Active Tab Underline */}
              {isSelected && (
                <span className="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-[2.5px] sm:h-[3px] bg-[#2874f0] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}