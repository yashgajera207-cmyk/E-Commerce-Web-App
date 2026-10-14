import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const safeImages = images.length > 0 ? images : ["🛍️"];
  const active = safeImages[activeIndex];

  const isUrl = (img: string) =>
    img.startsWith("http") || img.startsWith("/") || img.startsWith("data:");

  const prev = () => setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setActiveIndex((i) => (i + 1) % safeImages.length);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image */}
      <div
        className={`relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center min-h-[260px] sm:min-h-[380px] h-[280px] sm:h-[380px] ${
          zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onClick={() => setZoomed(!zoomed)}
      >
        {isUrl(active) ? (
          <img
            src={active}
            alt={name}
            className={`object-contain transition-transform duration-300 max-h-[260px] sm:max-h-[360px] max-w-full p-2 ${
              zoomed ? "scale-150" : "scale-100"
            }`}
          />
        ) : (
          <span className={`select-none transition-transform duration-300 ${zoomed ? "scale-150 text-8xl" : "text-7xl sm:text-8xl"}`}>
            {active}
          </span>
        )}

        {/* Zoom hint */}
        {!zoomed && (
          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-sm">
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
          </div>
        )}

        {/* Nav arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-md rounded-full p-1.5 hover:bg-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-md rounded-full p-1.5 hover:bg-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 flex items-center justify-center overflow-hidden bg-gray-50 transition-all cursor-pointer ${
                i === activeIndex
                  ? "border-[#2874f0] shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {isUrl(img) ? (
                <img src={img} alt={`Thumbnail ${i + 1}`} className="max-h-full max-w-full object-contain p-1" />
              ) : (
                <span className="text-xl sm:text-2xl">{img}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
