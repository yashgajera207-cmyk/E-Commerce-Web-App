import { useState, type ChangeEvent } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  User,
  LogIn,
  UserPlus,
  Settings,
  HelpCircle,
  LogOut,
  ClipboardList,
  Heart,
  Gift,
  CreditCard,
  Bell,
  Store,
  Smartphone,
  Megaphone,
  X,
} from "lucide-react";
import { categories } from "../../data/products";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const { user, logout, openLoginModal } = useAuth();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isMoreHovered, setIsMoreHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 font-sans">
      {/* Main bar - Flipkart blue, single row */}
      <div className="bg-[#2874f0]">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-[56px]">
          {/* Logo + tagline stacked, italic wordmark like Flipkart */}
          <a href="/" className="flex flex-col justify-center shrink-0 leading-none pt-1">
            <span className="italic font-extrabold text-[22px] tracking-tight text-white">
              Ship<span className="text-white">Zone</span>
            </span>
            <span className="flex items-center gap-1 -mt-0.5">
              <span className="italic text-[11px] font-medium text-[#ffe500]">Explore Plus</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffe500" className="shrink-0">
                <path d="M12 2l2.6 6.9L21 12l-6.4 3.1L12 22l-2.6-6.9L3 12l6.4-3.1z" />
              </svg>
            </span>
          </a>

          {/* Search bar - white box, icon sits inside on the right, no separate colored button */}
          <div className="flex-1 max-w-xl hidden sm:block">
            <div
              className={`relative flex items-center bg-white rounded-sm transition-shadow duration-200 ${
                isSearchFocused ? "shadow-[0_1px_8px_rgba(0,0,0,0.25)]" : "shadow-sm"
              }`}
            >
              <input
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search for products, brands and more"
                className="w-full pl-4 pr-11 py-[9px] text-sm text-gray-800 placeholder:text-gray-500 outline-none rounded-sm bg-transparent"
              />
              <button
                aria-label="Search"
                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center cursor-pointer text-[#2874f0] hover:opacity-80 transition-opacity"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Right-side actions */}
          <div className="hidden md:flex items-center gap-7 shrink-0 h-full">
            {/* Login - white pill, dropdown panel on hover like Flipkart */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsLoginHovered(true)}
              onMouseLeave={() => setIsLoginHovered(false)}
            >
              {user ? (
                <button className="flex items-center gap-1 text-sm font-semibold text-white cursor-pointer py-[6px]">
                  {user.name}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLoginHovered ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <button
                  onClick={() => openLoginModal("login")}
                  className="bg-white text-[#2874f0] text-sm font-semibold px-9 py-[6px] rounded-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  Login
                </button>
              )}

              {isLoginHovered && (
                <div className="absolute top-full right-0 w-64 bg-white rounded-sm shadow-2xl border border-gray-100 py-1 z-50 before:content-[''] before:absolute before:-top-1 before:right-8 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border-l before:border-t before:border-gray-100">
                  {!user ? (
                    <button
                      onClick={() => openLoginModal("signup")}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
                    >
                      <span>
                        New customer? <span className="text-[#2874f0] font-semibold">Sign Up</span>
                      </span>
                      <UserPlus className="w-4 h-4 text-[#2874f0]" />
                    </button>
                  ) : (
                    <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-400 font-semibold">
                      Account: {user.email}
                    </div>
                  )}
                  <div className="py-1">
                    {user && user.role === "admin" && (
                      <MenuRow icon={<Settings className="w-4 h-4" />} label="Admin Dashboard" to="/admin" />
                    )}
                    <MenuRow icon={<User className="w-4 h-4" />} label="My Profile" />
                    <MenuRow icon={<ClipboardList className="w-4 h-4" />} label="Orders" to="/orders" />
                    <MenuRow icon={<Gift className="w-4 h-4" />} label="Rewards" />
                    <MenuRow icon={<Heart className="w-4 h-4" />} label="Wishlist" />
                    <MenuRow icon={<CreditCard className="w-4 h-4" />} label="Gift Cards" />
                    <MenuRow icon={<Bell className="w-4 h-4" />} label="Notifications" />
                  </div>
                  {user && (
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <MenuRow icon={<LogOut className="w-4 h-4" />} label="Logout" onClick={logout} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Become a Seller */}
            <Link
              to={user && user.role === "admin" ? "/admin" : "/seller"}
              className="flex items-center gap-1.5 text-sm font-medium text-white hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
            >
              <Store className="w-4 h-4" />
              Become a Seller
            </Link>

            {/* More dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsMoreHovered(true)}
              onMouseLeave={() => setIsMoreHovered(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-white cursor-pointer">
                More
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreHovered ? "rotate-180" : ""}`} />
              </button>

              {isMoreHovered && (
                <div className="absolute top-full right-0 w-56 bg-white rounded-sm shadow-2xl border border-gray-100 py-1 z-50">
                  <MenuRow icon={<Bell className="w-4 h-4" />} label="Notification Preferences" />
                  <MenuRow icon={<HelpCircle className="w-4 h-4" />} label="24x7 Customer Care" />
                  <MenuRow icon={<Smartphone className="w-4 h-4" />} label="Download App" />
                  <MenuRow icon={<Megaphone className="w-4 h-4" />} label="Advertise" />
                  <MenuRow icon={<Settings className="w-4 h-4" />} label="Settings" />
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-2 text-white cursor-pointer">
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff6161] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">Cart</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden ml-auto text-white cursor-pointer"
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile search - visible below logo row on small screens */}
        <div className="sm:hidden px-4 pb-2.5">
          <div className="relative flex items-center bg-white rounded-sm shadow-sm">
            <input
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full pl-4 pr-11 py-2 text-sm text-gray-800 placeholder:text-gray-500 outline-none rounded-sm bg-transparent"
            />
            <button aria-label="Search" className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-[#2874f0]">
              <Search className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Category strip */}
      <nav className="hidden md:block bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8 py-2.5 text-[13px] text-[#212121] overflow-x-auto scrollbar-hide">
            {categories.map((c) => (
              <span
                key={c.id}
                className="shrink-0 cursor-pointer font-medium whitespace-nowrap hover:text-[#2874f0] transition-colors duration-150"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="py-1">
            {user ? (
              <>
                <div className="px-4 py-2 text-xs text-gray-400 font-semibold border-b border-gray-100">
                  Logged in as {user.name}
                </div>
                <MenuRow icon={<LogOut className="w-4 h-4" />} label="Logout" onClick={logout} />
              </>
            ) : (
              <>
                <MenuRow icon={<LogIn className="w-4 h-4" />} label="Login" onClick={() => openLoginModal("login")} />
                <MenuRow icon={<UserPlus className="w-4 h-4" />} label="Sign Up" onClick={() => openLoginModal("signup")} />
              </>
            )}
            {user && user.role === "admin" && (
              <MenuRow icon={<Settings className="w-4 h-4" />} label="Admin Dashboard" to="/admin" onClick={() => setIsMobileMenuOpen(false)} />
            )}
            <MenuRow icon={<ClipboardList className="w-4 h-4" />} label="Orders" to="/orders" onClick={() => setIsMobileMenuOpen(false)} />
            <MenuRow icon={<Heart className="w-4 h-4" />} label="Wishlist" />
            <MenuRow icon={<Store className="w-4 h-4" />} label="Become a Seller" to={user && user.role === "admin" ? "/admin" : "/seller"} onClick={() => setIsMobileMenuOpen(false)} />
            <MenuRow icon={<HelpCircle className="w-4 h-4" />} label="24x7 Customer Care" />
          </div>
          <div className="border-t border-gray-100 py-2 px-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c.id}
                  className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuRow({ icon, label, to, onClick }: { icon: React.ReactNode; label: string; to?: string; onClick?: () => void }) {
  const content = (
    <>
      <span className="text-[#2874f0]">{icon}</span>
      <span>{label}</span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      {content}
    </button>
  );
}