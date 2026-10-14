import { Smartphone, Star } from "lucide-react";

export default function AppDownloadBanner() {
  return (
    <section className="bg-gradient-to-br from-[#2874f0] via-[#1a62d0] to-[#0d3fa3] rounded-xl sm:rounded-2xl overflow-hidden text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between px-5 sm:px-8 py-6 sm:py-8 gap-5 sm:gap-6">
        {/* Left Content */}
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-blue-200">4.8 (2.1M ratings)</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold leading-tight mb-1.5">
            Shop faster on the<br className="hidden sm:block" /> ShopZone App
          </h2>
          <p className="text-blue-200 text-xs sm:text-sm mb-4">
            Get exclusive app-only deals • Track orders • Instant checkout
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
            <button className="flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="text-left">
                <div className="text-[9px] font-normal text-gray-500">Download on the</div>
                <div className="text-xs font-extrabold leading-none">App Store</div>
              </div>
            </button>
            <button className="flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer shadow-sm">
              <Smartphone className="w-5 h-5" />
              <div className="text-left">
                <div className="text-[9px] font-normal text-gray-500">GET IT ON</div>
                <div className="text-xs font-extrabold leading-none">Google Play</div>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Phone Mockup / QR */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* QR Code Placeholder */}
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-5 gap-0.5 w-full h-full p-1">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[1px] ${
                      [0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24,7,8,16,17].includes(i) ? "bg-gray-900" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[9px] font-bold text-gray-600 text-center mt-1.5">Scan QR Code</p>
          </div>

          {/* Phone illustration */}
          <div className="hidden sm:flex flex-col items-center gap-1">
            <div className="w-16 h-28 bg-white/20 rounded-2xl border-2 border-white/30 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white/70" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}