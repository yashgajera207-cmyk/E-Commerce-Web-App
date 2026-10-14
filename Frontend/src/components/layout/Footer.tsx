import { Link } from "react-router-dom";
import { 
  Smartphone, Mail, Phone, MapPin, ShieldCheck
} from "lucide-react";

interface FooterColumn {
  title: string;
  links: { label: string; to?: string }[];
}

const columns: FooterColumn[] = [
  {
    title: "About",
    links: [
      { label: "About ShopZone" },
      { label: "Careers" },
      { label: "Press Releases" },
      { label: "ShopZone Cares" },
      { label: "Gift Cards" },
      { label: "ShopZone SuperCoin" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Payments" },
      { label: "Shipping" },
      { label: "Cancellation & Returns" },
      { label: "FAQ" },
      { label: "Report Infringement" },
      { label: "Accessibility" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Sell on ShopZone", to: "/seller" },
      { label: "Seller Hub" },
      { label: "Advertise" },
      { label: "ShopZone Business" },
      { label: "Become an Affiliate" },
    ],
  },
  {
    title: "Policy",
    links: [
      { label: "Privacy Policy" },
      { label: "Terms of Use" },
      { label: "Security" },
      { label: "Sitemap" },
      { label: "Cookie Policy" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Facebook" },
      { label: "Instagram" },
      { label: "X (Twitter)" },
      { label: "YouTube" },
      { label: "Pinterest" },
    ],
  },
];

const paymentIcons = ["Visa", "MC", "Maestro", "Netbanking", "UPI", "AmEx", "Rupay"];

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-gray-300 mt-8 sm:mt-12 pb-16 sm:pb-0">
      {/* Main Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-bold text-xs mb-3 uppercase tracking-wider">{col.title}</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="hover:text-[#ffe500] hover:underline transition-colors cursor-pointer">
                      {link.label}
                    </Link>
                  ) : (
                    <a href="#" className="hover:text-[#ffe500] hover:underline transition-colors">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* App Download Column */}
        <div>
          <h4 className="text-white font-bold text-xs mb-3 uppercase tracking-wider">Download App</h4>
          <div className="space-y-2">
            <div className="text-[10px] text-gray-400 mb-2">
              Get ₹50 off on your 1st order via App
            </div>
            <div className="flex items-center gap-2 mb-3">
              {/* QR placeholder */}
              <div className="w-12 h-12 bg-white rounded p-1 flex items-center justify-center shrink-0">
                <div className="grid grid-cols-3 gap-px w-full h-full">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={`${[0,2,4,6,8].includes(i) ? "bg-gray-900" : "bg-white"} rounded-[1px]`} />
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-gray-400">Scan for QR code</div>
            </div>
            <button className="w-full flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold py-2 rounded-md transition-colors cursor-pointer">
              <Smartphone className="w-3.5 h-3.5" />
              App Store
            </button>
            <button className="w-full flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold py-2 rounded-md transition-colors cursor-pointer">
              <Smartphone className="w-3.5 h-3.5" />
              Google Play
            </button>
          </div>
        </div>
      </div>

      {/* Payment & Trust Badges */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <ShieldCheck className="w-4 h-4 text-[#ffe500]" />
            <span className="text-xs text-gray-400 font-medium">100% SECURE PAYMENT</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {paymentIcons.map((icon) => (
                <span key={icon} className="bg-white/10 text-[9px] font-bold text-gray-300 px-1.5 py-0.5 rounded">
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {/* Facebook */}
            <button className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </button>
            {/* Twitter/X */}
            <button className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M4 4l16 16M20 4 4 20"/></svg>
            </button>
            {/* Instagram */}
            <button className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </button>
            {/* YouTube */}
            <button className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-gray-500 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white text-base font-display">
              Shop<span className="text-[#ffe500]">Zone</span>
            </span>
            <span>© {new Date().getFullYear()} ShopZone.com, Inc.</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>support@shopzone.in</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>1800-202-9898</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Mumbai, India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
