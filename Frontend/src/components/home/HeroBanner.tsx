import { Headphones, Watch, Smartphone, Truck, ShieldCheck, Percent, Clock } from "lucide-react";
import Button from "../common/Button";

export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-br from-brand-navy via-[#1b2960] to-brand-blue-dark rounded-2xl overflow-hidden relative">
      {/* Ambient glow accents */}
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-56 h-56 bg-brand-blue-dark/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 sm:py-14 flex items-center justify-between gap-6 relative">
        {/* Copy column */}
        <div className="max-w-md relative z-10">
          {/* Eyebrow + live countdown chip */}
          <div className="flex items-center gap-3 mb-3">
            <p className="text-brand-yellow font-semibold text-sm tracking-wide uppercase">
              Big Savings on Top Brands
            </p>
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full pl-2 pr-3 py-1 text-white text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-brand-yellow" />
              Ends in 06:00:00 PM
            </span>
          </div>

          {/* Headline with weighted number treatment */}
          <h1 className="text-white font-display font-extrabold leading-none mb-3">
            <span className="text-4xl sm:text-5xl">70%</span>{" "}
            <span className="text-2xl sm:text-3xl align-middle text-gray-200 font-bold">off top gadgets</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base mb-5">
            Headphones, smartwatches &amp; the latest gadgets — deals refreshed daily.
          </p>

          <div className="flex items-center gap-3 mb-6">
            <Button variant="secondary" size="lg">
              Shop Now
            </Button>
            <span className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
              <Percent className="w-3.5 h-3.5 text-brand-yellow" />
              10% instant discount on bank cards
            </span>
          </div>

          {/* Trust strip */}
          <div className="flex items-center gap-5 text-gray-300 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-brand-yellow" />
              Free delivery
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-yellow" />
              Secure checkout
            </span>
          </div>
        </div>

        {/* Floating product icon scene */}
        <div className="hidden sm:block relative w-56 h-56 shrink-0">
          <div className="absolute inset-0 flex items-center justify-center w-44 h-44 m-auto rounded-full bg-white/10 backdrop-blur-sm">
            <Headphones className="w-20 h-20 text-brand-yellow" strokeWidth={1.5} />
          </div>
          <div className="absolute top-0 right-2 flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            <Watch className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-2 left-0 flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            <Smartphone className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Carousel indicator dots */}
      <div className="flex items-center justify-center gap-1.5 pb-4 relative z-10">
        <span className="w-5 h-1.5 rounded-full bg-brand-yellow" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>
    </section>
  );
}