import { Smartphone, Star } from "lucide-react";

export default function AppDownloadBanner() {
  return (
    <section className="bg-gradient-to-r from-[#2874f0] to-[#1e5fd1] rounded-md shadow-sm px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
      <div className="relative z-10 text-white text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-semibold mb-2">Shop on the go</h3>
        <p className="text-sm text-white/80 mb-5 max-w-md">
          Download the ShipZone app for exclusive app-only deals, faster checkout, and order tracking.
        </p>
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <button className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2.5 rounded-sm text-sm font-medium hover:shadow-md transition-shadow duration-150 cursor-pointer">
            <Smartphone className="w-4 h-4" />
            Get the App
          </button>
          <div className="flex items-center gap-1 text-white/90 text-sm">
            <Star className="w-4 h-4 fill-[#ffe500] text-[#ffe500]" />
            4.6 · 50M+ downloads
          </div>
        </div>
      </div>

      <div className="hidden sm:flex relative z-10 shrink-0">
        <svg width="160" height="120" viewBox="0 0 200 150" fill="none">
          <rect x="60" y="10" width="80" height="130" rx="14" fill="#ffffff" fillOpacity="0.15" />
          <rect x="70" y="22" width="60" height="95" rx="4" fill="#ffffff" fillOpacity="0.25" />
          <circle cx="100" cy="128" r="4" fill="#ffffff" fillOpacity="0.4" />
        </svg>
      </div>

      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
    </section>
  );
}