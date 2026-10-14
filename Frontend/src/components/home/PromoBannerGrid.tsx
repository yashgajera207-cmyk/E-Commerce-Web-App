import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  discount?: string;
  bgGradient: string;
  textColor: string;
  image: string;
  link: string;
  badge?: string;
}

const PROMO_BANNERS: PromoBanner[] = [
  {
    id: "p1",
    title: "Fashion Sale",
    subtitle: "Trendy styles & big savings",
    discount: "Up to 70% off",
    bgGradient: "from-pink-50 to-rose-100",
    textColor: "text-rose-900",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&auto=format&fit=crop&q=80",
    link: "/category/fashion",
    badge: "FASHION",
  },
  {
    id: "p2",
    title: "Home Essentials",
    subtitle: "Upgrade your living space",
    discount: "Starting ₹149",
    bgGradient: "from-emerald-50 to-teal-100",
    textColor: "text-teal-900",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80",
    link: "/category/home-kitchen",
    badge: "HOME",
  },
  {
    id: "p3",
    title: "Best Mobiles",
    subtitle: "Latest 5G smartphones",
    discount: "Exchange offers",
    bgGradient: "from-blue-50 to-indigo-100",
    textColor: "text-indigo-900",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80",
    link: "/category/mobiles",
    badge: "MOBILES",
  },
  {
    id: "p4",
    title: "Beauty & Care",
    subtitle: "Premium skincare & makeup",
    discount: "Min 40% off",
    bgGradient: "from-purple-50 to-fuchsia-100",
    textColor: "text-fuchsia-900",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80",
    link: "/category/beauty",
    badge: "BEAUTY",
  },
];

export default function PromoBannerGrid() {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {PROMO_BANNERS.map((banner) => (
        <Link
          key={banner.id}
          to={banner.link}
          className={`relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br ${banner.bgGradient} p-3 sm:p-4 min-h-[130px] sm:min-h-[160px] flex flex-col justify-between hover:shadow-md transition-all duration-200 group border border-white/50`}
        >
          {/* Background image */}
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute right-0 bottom-0 w-1/2 h-full object-cover object-center opacity-70 group-hover:opacity-80 transition-opacity"
          />
          
          {/* Content overlay */}
          <div className="relative z-10">
            {banner.badge && (
              <span className={`text-[9px] sm:text-[10px] font-black ${banner.textColor} bg-white/70 px-1.5 py-0.5 rounded-full`}>
                {banner.badge}
              </span>
            )}
            <h3 className={`font-extrabold text-sm sm:text-base ${banner.textColor} mt-1.5 leading-tight`}>
              {banner.title}
            </h3>
            <p className={`text-[10px] sm:text-xs ${banner.textColor} opacity-70 mt-0.5`}>
              {banner.subtitle}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <span className={`font-extrabold text-[11px] sm:text-sm ${banner.textColor}`}>
              {banner.discount}
            </span>
            <ArrowRight className={`w-4 h-4 ${banner.textColor} opacity-70 group-hover:translate-x-0.5 transition-transform`} />
          </div>
        </Link>
      ))}
    </section>
  );
}