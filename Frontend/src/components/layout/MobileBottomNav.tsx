import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Heart, User, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartItems, wishlist } = useCart();
  const { user } = useAuth();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      label: "Home",
      to: "/",
      icon: Home,
      badge: 0,
    },
    {
      label: "Categories",
      to: "/category/for-you",
      icon: LayoutGrid,
      badge: 0,
    },
    {
      label: "Wishlist",
      to: "/wishlist",
      icon: Heart,
      badge: wishlistCount,
    },
    {
      label: user ? "Profile" : "Login",
      to: user ? "/profile" : "/login",
      icon: User,
      badge: 0,
    },
    {
      label: "Cart",
      to: "/cart",
      icon: ShoppingCart,
      badge: cartCount,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.to);

        return (
          <Link
            key={item.label}
            to={item.to}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg relative transition-all duration-150 ${
              active
                ? "text-[#2874f0] font-bold"
                : "text-gray-500 hover:text-gray-900 font-medium"
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform duration-150 ${
                  active ? "scale-110 stroke-[2.5]" : "stroke-[1.75]"
                }`}
              />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-xs">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
