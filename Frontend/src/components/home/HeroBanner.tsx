import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  Zap, Sparkles, ChevronLeft, ChevronRight, 
  ArrowRight, ShieldCheck, Flame, Play
} from "lucide-react";

interface BannerSlide {
  id: string;
  brand: string;
  brandBg: string;
  brandTextColor: string;
  badge?: string;
  badgeBg?: string;
  title: string;
  subtitle: string;
  price?: string;
  originalPrice?: string;
  discountTag?: string;
  features: { label: string; icon?: "zap" | "sparkles" | "shield" }[];
  image: string;
  bgGradient: string;
  textColor: "light" | "dark";
  link: string;
  ctaText: string;
  disclaimer?: string;
}

const SLIDES: BannerSlide[] = [
  {
    id: "mivi",
    brand: "MIVI",
    brandBg: "bg-gray-900 text-white",
    brandTextColor: "text-white",
    badge: "ShopZone Unique",
    badgeBg: "bg-[#2874f0] text-white",
    title: "Mivi One 5G",
    subtitle: "Launch 24th Sep • Pre-Book Now",
    price: "From ₹12,999*",
    originalPrice: "₹18,999",
    discountTag: "31% OFF",
    features: [
      { label: "Pure Android 16", icon: "sparkles" },
      { label: "Snapdragon® 5G Speed", icon: "zap" },
      { label: "120Hz Fluid AMOLED", icon: "shield" },
    ],
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80",
    bgGradient: "from-[#e4f5ee] via-[#f1faf5] to-[#d2ede2]",
    textColor: "dark",
    link: "/category/electronics",
    ctaText: "Pre-Order Now",
    disclaimer: "AD • Introductory Offer",
  },
  {
    id: "poco",
    brand: "POCO",
    brandBg: "bg-yellow-400 text-black",
    brandTextColor: "text-black",
    badge: "ShopZone Unique",
    badgeBg: "bg-[#2874f0] text-white",
    title: "POCO X8 Series 5G",
    subtitle: "Sale Starts 11th Sep, 12 PM",
    price: "From ₹26,999*",
    originalPrice: "₹34,999",
    discountTag: "Special Price",
    features: [
      { label: "10000 mAh Monster Battery", icon: "zap" },
      { label: "120W HyperCharge In-Box", icon: "zap" },
      { label: "Sony Flagship OIS Camera", icon: "sparkles" },
    ],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&auto=format&fit=crop&q=80",
    bgGradient: "from-[#20180d] via-[#352714] to-[#120d07]",
    textColor: "light",
    link: "/category/electronics",
    ctaText: "Notify Me",
    disclaimer: "AD • T&C Apply",
  },
  {
    id: "realme",
    brand: "realme TechLife",
    brandBg: "bg-yellow-400 text-black",
    brandTextColor: "text-black",
    badge: "Big Savings",
    badgeBg: "bg-emerald-600 text-white",
    title: "Perfect Entertainment",
    subtitle: "32\" Bezel-less QLED Smart TV",
    price: "From ₹10,499*",
    originalPrice: "₹21,999",
    discountTag: "52% OFF",
    features: [
      { label: "Dolby Audio™ Surround", icon: "sparkles" },
      { label: "Quantum Dot Vivid Colors", icon: "sparkles" },
      { label: "Google TV with Voice Control", icon: "shield" },
    ],
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900&auto=format&fit=crop&q=80",
    bgGradient: "from-[#080d19] via-[#101a30] to-[#040812]",
    textColor: "light",
    link: "/category/appliances",
    ctaText: "Shop Television",
    disclaimer: "*T&C Apply • 1 Year Warranty",
  },
  {
    id: "iphone",
    brand: "Apple",
    brandBg: "bg-white/20 text-white backdrop-blur-md border border-white/30",
    brandTextColor: "text-white",
    badge: "Festive Blockbuster",
    badgeBg: "bg-amber-500 text-gray-950 font-bold",
    title: "iPhone 15 & 15 Pro",
    subtitle: "Dynamic Island • 48MP Main Camera",
    price: "From ₹54,999*",
    originalPrice: "₹69,900",
    discountTag: "Extra ₹4,000 Off",
    features: [
      { label: "Super Retina XDR Display", icon: "sparkles" },
      { label: "A16 Bionic Ultra-Fast Chip", icon: "zap" },
      { label: "All-Day Battery Life", icon: "shield" },
    ],
    image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=900&auto=format&fit=crop&q=80",
    bgGradient: "from-[#0d203d] via-[#173a6b] to-[#081528]",
    textColor: "light",
    link: "/product/d1",
    ctaText: "Claim Offer",
    disclaimer: "Limited Time Bank Offers",
  },
];

const AUTO_ROTATE_INTERVAL = 10000; // 10 seconds automatic change

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // 10-Second Automatic Rotation Timer
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [isHovered, nextSlide, currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="w-full relative select-none py-1 sm:py-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional Hero Banner Carousel"
    >
      {/* FULL-WIDTH CARD HERO STAGE */}
      <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-sm bg-gray-100 group">
        
        {/* Sliding Canvas */}
        <div
          className="flex transition-transform duration-700 cubic-bezier(0.25, 1, 0.5, 1)"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {SLIDES.map((slide) => {
            const isLight = slide.textColor === "light";

            return (
              <div
                key={slide.id}
                className="w-full shrink-0 min-w-full"
              >
                <Link
                  to={slide.link}
                  className={`relative block w-full bg-gradient-to-r ${slide.bgGradient} px-4 py-5 sm:px-8 sm:py-7 md:px-12 md:py-8 min-h-[220px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[340px] overflow-hidden`}
                >
                  {/* Subtle Background Glow Accent */}
                  <div className="absolute right-[25%] top-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

                  {/* Right Side: Product Showcase Image */}
                  <div className="absolute right-3 sm:right-8 md:right-12 lg:right-16 top-0 bottom-0 w-[42%] sm:w-[46%] md:w-[44%] flex items-center justify-end pointer-events-none z-10">
                    <div className="relative h-[82%] sm:h-[88%] md:h-[92%] w-auto flex items-center justify-center">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className={`object-contain max-h-full w-auto rounded-xl sm:rounded-2xl transition-transform duration-700 group-hover:scale-105 drop-shadow-xl ${
                          !isLight ? "mix-blend-multiply" : ""
                        }`}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Left Side: Professional Typography & Callouts */}
                  <div className={`relative z-20 max-w-[62%] sm:max-w-[55%] md:max-w-[52%] flex flex-col justify-between h-full min-h-[180px] sm:min-h-[220px] md:min-h-[260px] ${
                    isLight ? "text-white" : "text-gray-900"
                  }`}>
                    
                    {/* Top Badges */}
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 flex-wrap">
                        <span className={`text-[10px] sm:text-xs font-black tracking-wider uppercase px-2 py-0.5 rounded-sm shadow-2xs ${slide.brandBg}`}>
                          {slide.brand}
                        </span>

                        {slide.badge && (
                          <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-2xs ${slide.badgeBg}`}>
                            {slide.badge}
                          </span>
                        )}
                      </div>

                      {/* Main Title */}
                      <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight sm:leading-tight drop-shadow-xs">
                        {slide.title}
                      </h2>

                      {/* Subtitle */}
                      <p className={`text-xs sm:text-sm md:text-base font-semibold mt-1 sm:mt-1.5 ${
                        isLight ? "text-gray-200" : "text-gray-700"
                      }`}>
                        {slide.subtitle}
                      </p>

                      {/* Pricing Tagline */}
                      {slide.price && (
                        <div className="flex items-baseline gap-2 mt-1.5 sm:mt-2 flex-wrap">
                          <span className="text-base sm:text-2xl md:text-3xl font-black text-[#ff9f00]">
                            {slide.price}
                          </span>
                          {slide.originalPrice && (
                            <span className={`text-xs sm:text-sm line-through ${
                              isLight ? "text-gray-400" : "text-gray-500"
                            }`}>
                              {slide.originalPrice}
                            </span>
                          )}
                          {slide.discountTag && (
                            <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-xs border border-emerald-400/30">
                              {slide.discountTag}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Feature Chips */}
                      <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 mt-3 flex-wrap">
                        {slide.features.map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-md ${
                              isLight
                                ? "bg-white/10 text-gray-200 border border-white/15"
                                : "bg-black/8 text-gray-800 border border-black/10"
                            }`}
                          >
                            {feat.icon === "zap" ? (
                              <Zap className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                            ) : feat.icon === "sparkles" ? (
                              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <ShieldCheck className="w-3 h-3 text-blue-400 shrink-0" />
                            )}
                            <span>{feat.label}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA Action Button */}
                    <div className="mt-3 sm:mt-4 flex items-center gap-3">
                      <div className="inline-flex items-center gap-2 bg-[#2874f0] hover:bg-[#1e65d8] text-white text-xs sm:text-sm font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-md shadow-md hover:shadow-lg transition-all transform group-hover:translate-x-0.5 cursor-pointer">
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </div>

                  {/* AD & Disclaimer Tag */}
                  {slide.disclaimer && (
                    <span className={`absolute bottom-2.5 right-3 z-20 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-md ${
                      isLight
                        ? "text-gray-300 bg-black/60 border border-white/10"
                        : "text-gray-600 bg-white/80 border border-black/5"
                    }`}>
                      {slide.disclaimer}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* FLIPKART STYLE NAVIGATION ARROWS (On Desktop Hover) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          aria-label="Previous Slide"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-16 sm:w-11 sm:h-20 bg-white/90 hover:bg-white text-gray-900 rounded-r-lg shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-30 hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          aria-label="Next Slide"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-16 sm:w-11 sm:h-20 bg-white/90 hover:bg-white text-gray-900 rounded-l-lg shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-30 hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* PAUSE BADGE INDICATOR (Appears when hovering) */}
        {isHovered && (
          <div className="absolute top-3 right-3 z-30 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span>Paused</span>
          </div>
        )}
      </div>

      {/* PROFESSIONAL PROGRESS BAR PAGINATION (10s Visual Fill) */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {SLIDES.map((slide, idx) => {
          const isActive = currentIndex === idx;

          return (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}: ${slide.title}`}
              className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                isActive ? "w-10 sm:w-12 bg-gray-200" : "w-2.5 sm:w-3 bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {/* Animated Progress Fill for Active Slide */}
              {isActive && (
                <div
                  key={`${idx}-${isHovered ? "paused" : "running"}`}
                  className="h-full bg-[#2874f0] rounded-full"
                  style={{
                    animation: isHovered
                      ? "none"
                      : `progressFill ${AUTO_ROTATE_INTERVAL}ms linear forwards`,
                    width: isHovered ? "100%" : undefined,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Keyframe animation inline style for the 10-second progress bar */}
      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}