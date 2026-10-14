import { useState, type ChangeEvent } from "react";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ClipboardList,
  Heart,
  Gift,
  CreditCard,
  Bell,
  MapPin,
  Plane,
  ChevronRight,
  Menu,
  X,
  Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useAddress } from "../../context/AddressContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { cartItems, wishlist } = useCart();
  const { getDefaultAddress } = useAddress();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const defaultAddress = user ? getDefaultAddress() : null;
  const locationLabel = defaultAddress
    ? `${defaultAddress.city}, ${defaultAddress.pincode}`
    : "Select location";

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"shopzone" | "travel">("shopzone");
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isMoreHovered, setIsMoreHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLocationClick = () => {
    if (user) {
      navigate("/addresses");
    } else {
      navigate("/login");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/category/all?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 font-sans shadow-xs">
      {/* DESKTOP & TABLET HEADER (sm and up) */}
      <div className="hidden sm:flex max-w-[1440px] mx-auto px-4 sm:px-6 h-[64px] items-center justify-between gap-4 sm:gap-6">
        {/* LEFT: ShopZone Brand & Travel Pills */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            onClick={() => setActiveTab("shopzone")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 shadow-xs ${
              activeTab === "shopzone"
                ? "bg-[#ffdf00] text-gray-900 shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5 text-[#2874f0]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
            </svg>
            <span className="tracking-tight text-[15px] font-extrabold italic">ShopZone</span>
          </Link>

          <button
            type="button"
            onClick={() => setActiveTab("travel")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
              activeTab === "travel"
                ? "bg-[#ffdf00] text-gray-900"
                : "bg-[#f1f3f6] text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Plane className="w-4 h-4 text-orange-600 transform -rotate-45" />
            <span className="italic font-bold">Travel</span>
          </button>
        </div>

        {/* LOCATION SELECTOR */}
        <button
          onClick={handleLocationClick}
          className="hidden lg:flex items-center gap-1 text-xs text-gray-600 shrink-0 cursor-pointer hover:text-[#2874f0] transition-colors group"
          title={user ? "Manage delivery addresses" : "Login to set delivery location"}
        >
          <MapPin className="w-3.5 h-3.5 text-gray-800 shrink-0 group-hover:text-[#2874f0]" />
          <span className="font-semibold text-gray-800 group-hover:text-[#2874f0]">
            {defaultAddress ? "Deliver to" : "Location"}
          </span>
          <span className="text-[#2874f0] font-medium flex items-center max-w-[120px] truncate">
            {locationLabel}
            <ChevronRight className="w-3 h-3 ml-0.5 shrink-0" />
          </span>
        </button>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl min-w-[200px]">
          <div className="relative flex items-center bg-[#f0f5ff] rounded-lg border border-transparent focus-within:border-[#2874f0] focus-within:bg-white transition-all shadow-inner/10">
            <Search className="w-4 h-4 text-gray-500 ml-3.5 shrink-0" strokeWidth={2.2} />
            <input
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search for Products, Brands and More"
              className="w-full pl-3 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none bg-transparent"
            />
          </div>
        </form>

        {/* RIGHT: SuperCoins, Account, More, Wishlist, Cart */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-xs font-bold text-amber-800">
            <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[10px] text-white font-black shadow-xs">
              ₹
            </div>
            <span>{user ? 50 : 0}</span>
          </div>

          {/* Account Profile / Login Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsLoginHovered(true)}
            onMouseLeave={() => setIsLoginHovered(false)}
          >
            {user ? (
              <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-[#2874f0] cursor-pointer py-2">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold text-xs border border-blue-100">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isLoginHovered ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-[#2874f0] cursor-pointer py-2"
              >
                <User className="w-4 h-4 text-gray-700" />
                <span>Login</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isLoginHovered ? "rotate-180" : ""}`} />
              </Link>
            )}

            {isLoginHovered && (
              <div className="absolute top-full right-0 w-60 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {!user ? (
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">New customer?</span>
                    <Link
                      to="/register"
                      className="text-xs font-bold text-[#2874f0] hover:underline"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-400">Signed in as</p>
                    <p className="text-xs font-bold text-gray-800 truncate">{user.email || user.mobile}</p>
                  </div>
                )}

                <div className="py-1">
                  {user?.role === "admin" && (
                    <MenuRow icon={<Settings className="w-4 h-4" />} label="Admin Dashboard" to="/admin" />
                  )}
                  <MenuRow icon={<User className="w-4 h-4 text-gray-600" />} label="My Profile" to="/addresses" />
                  <MenuRow icon={<ClipboardList className="w-4 h-4 text-gray-600" />} label="Orders" to="/orders" />
                  <MenuRow icon={<Gift className="w-4 h-4 text-gray-600" />} label="Rewards" />
                  <MenuRow
                    icon={
                      <div className="relative">
                        <Heart className="w-4 h-4 text-gray-600" />
                        {wishlistCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                            {wishlistCount > 9 ? "9+" : wishlistCount}
                          </span>
                        )}
                      </div>
                    }
                    label="Wishlist"
                    to="/wishlist"
                  />
                  <MenuRow icon={<CreditCard className="w-4 h-4 text-gray-600" />} label="Gift Cards" />
                  <MenuRow icon={<Bell className="w-4 h-4 text-gray-600" />} label="Notifications" />

                  {user && (
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* More dropdown */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setIsMoreHovered(true)}
            onMouseLeave={() => setIsMoreHovered(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-[#2874f0] cursor-pointer py-2">
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isMoreHovered ? "rotate-180" : ""}`} />
            </button>

            {isMoreHovered && (
              <div className="absolute top-full right-0 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                <MenuRow icon={<Bell className="w-4 h-4 text-gray-600" />} label="Notification Preferences" />
                <MenuRow icon={<HelpCircle className="w-4 h-4 text-gray-600" />} label="24x7 Customer Care" />
                <MenuRow icon={<Settings className="w-4 h-4 text-gray-600" />} label="Advertise" />
              </div>
            )}
          </div>

          {/* Wishlist shortcut */}
          <Link
            to="/wishlist"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-red-500 transition-colors relative cursor-pointer"
            aria-label="Wishlist"
          >
            <div className="relative">
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-red-500 text-red-500" : "text-gray-800"}`} strokeWidth={2} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </div>
            <span className="hidden lg:inline font-bold">Wishlist</span>
          </Link>

          {/* Cart Icon & Count */}
          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#2874f0] transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-800" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-[#e41b1b] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="inline font-bold">Cart</span>
          </Link>
        </div>
      </div>

      {/* MOBILE OPTIMIZED 2-ROW HEADER (screen < 640px) */}
      <div className="sm:hidden px-3 pt-2.5 pb-2 flex flex-col gap-2">
        {/* Top Row: Menu Button, Brand Logo, Location, Login/User & Cart */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Mobile Hamburger Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-1.5 -ml-1 text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-sm bg-[#ffdf00] text-gray-950 shadow-xs"
            >
              <svg className="w-4 h-4 text-[#2874f0]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
              </svg>
              <span className="italic tracking-tight text-[14px]">ShopZone</span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Mobile Location Pill */}
            <button
              onClick={handleLocationClick}
              className="flex items-center gap-1 text-[11px] text-gray-700 bg-gray-100 hover:bg-blue-50 px-2 py-1 rounded-full max-w-[130px] truncate"
              title={user ? "Manage addresses" : "Login to set location"}
            >
              <MapPin className="w-3 h-3 text-[#2874f0] shrink-0" />
              <span className="truncate font-semibold text-gray-800">
                {defaultAddress ? defaultAddress.city : "Location"}
              </span>
            </button>

            {/* Profile / Login */}
            {user ? (
              <Link
                to="/addresses"
                className="w-7 h-7 rounded-full bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold text-xs border border-blue-200"
              >
                {user.name.charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-bold text-gray-800 hover:text-[#2874f0] px-2 py-1 bg-gray-100 rounded-md"
              >
                Login
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-1 text-gray-800" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e41b1b] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Row 2: Full-width Mobile Search Bar */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative flex items-center bg-[#f0f5ff] rounded-lg border border-transparent focus-within:border-[#2874f0] focus-within:bg-white transition-all shadow-inner/10">
            <Search className="w-4 h-4 text-gray-500 ml-3 shrink-0" strokeWidth={2.2} />
            <input
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search for Products, Brands and More"
              className="w-full pl-2.5 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-500 outline-none bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* MOBILE SLIDE-OUT NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-[82%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header (Flipkart-style Solid Blue Banner) */}
            <div className="bg-[#2874f0] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-base">
                  {user ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-sm leading-snug">
                    {user ? user.name : "Welcome, Shopper"}
                  </p>
                  <p className="text-[11px] text-blue-100 truncate max-w-[170px]">
                    {user ? (user.email || user.mobile) : "Explore exciting deals"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Auth Prompt if Guest */}
            {!user && (
              <div className="p-3 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
                <span className="text-xs text-gray-700 font-medium">Have an account?</span>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-bold text-[#2874f0] bg-white px-3 py-1 rounded shadow-xs border border-blue-200"
                >
                  Login / Sign Up
                </Link>
              </div>
            )}

            {/* SuperCoins Banner */}
            <div className="px-4 py-2.5 bg-amber-50/80 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs text-white font-black">
                  ₹
                </div>
                <span className="text-xs font-bold text-amber-900">SuperCoins Balance</span>
              </div>
              <span className="text-xs font-black text-amber-800">{user ? 50 : 0}</span>
            </div>

            {/* Navigation Menu Links */}
            <div className="py-2 flex-1 divide-y divide-gray-100">
              <div className="py-1">
                <MobileDrawerRow
                  icon={<Store className="w-4 h-4 text-[#2874f0]" />}
                  label="All Categories"
                  to="/category/for-you"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileDrawerRow
                  icon={<ClipboardList className="w-4 h-4 text-emerald-600" />}
                  label="My Orders"
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileDrawerRow
                  icon={<Heart className="w-4 h-4 text-red-500" />}
                  label="My Wishlist"
                  to="/wishlist"
                  badge={wishlistCount > 0 ? String(wishlistCount) : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileDrawerRow
                  icon={<MapPin className="w-4 h-4 text-amber-600" />}
                  label="My Addresses"
                  to="/addresses"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </div>

              <div className="py-1">
                <MobileDrawerRow
                  icon={<Plane className="w-4 h-4 text-orange-500 -rotate-45" />}
                  label="Flights & Travel"
                  to="/"
                  onClick={() => {
                    setActiveTab("travel");
                    setIsMobileMenuOpen(false);
                  }}
                />
                <MobileDrawerRow
                  icon={<Store className="w-4 h-4 text-purple-600" />}
                  label="Sell on ShopZone"
                  to="/seller"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                {user?.role === "admin" && (
                  <MobileDrawerRow
                    icon={<Settings className="w-4 h-4 text-indigo-600" />}
                    label="Admin Dashboard"
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                )}
              </div>

              <div className="py-1">
                <MobileDrawerRow
                  icon={<HelpCircle className="w-4 h-4 text-gray-600" />}
                  label="24x7 Customer Care"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileDrawerRow
                  icon={<Bell className="w-4 h-4 text-gray-600" />}
                  label="Notifications"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </div>

            {/* Drawer Footer (Logout) */}
            {user && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout of ShopZone
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MenuRow({
  icon,
  label,
  to,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
}) {
  const content = (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      {icon}
      <span>{label}</span>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

function MobileDrawerRow({
  icon,
  label,
  to,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  badge?: string;
  onClick?: () => void;
}) {
  const content = (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
          {badge}
        </span>
      )}
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}