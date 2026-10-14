import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  User, Package, MapPin, Heart, CreditCard, Bell, 
  Power, Shield, ChevronRight, UserCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AccountSidebarProps {
  activeTab?: "profile" | "orders" | "wishlist" | "addresses" | "cards" | "notifications";
}

export default function AccountSidebar({ activeTab }: AccountSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navSections = [
    {
      title: "MY ORDERS",
      items: [
        {
          label: "My Orders",
          to: "/orders",
          icon: Package,
          active: activeTab === "orders" || currentPath === "/orders",
        },
      ],
    },
    {
      title: "ACCOUNT SETTINGS",
      items: [
        {
          label: "Profile Information",
          to: "/profile",
          icon: User,
          active: activeTab === "profile" || currentPath === "/profile",
        },
        {
          label: "Manage Addresses",
          to: "/addresses",
          icon: MapPin,
          active: activeTab === "addresses" || currentPath === "/addresses",
        },
      ],
    },
    {
      title: "MY STUFF",
      items: [
        {
          label: "My Wishlist",
          to: "/wishlist",
          icon: Heart,
          active: activeTab === "wishlist" || currentPath === "/wishlist",
        },
        {
          label: "All Notifications",
          to: null,
          icon: Bell,
          active: activeTab === "notifications",
        },
      ],
    },
    {
      title: "PAYMENTS",
      items: [
        {
          label: "Saved Cards & Wallet",
          to: null,
          icon: CreditCard,
          active: activeTab === "cards",
        },
      ],
    },
  ];

  return (
    <div className="w-full lg:w-[280px] shrink-0 space-y-3 font-sans">
      {/* User Greeting Card */}
      <div className="bg-white rounded-lg p-3.5 flex items-center gap-3.5 shadow-xs border border-gray-100">
        <div className="w-12 h-12 rounded-full bg-[#2874f0]/10 flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-[#2874f0]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-gray-500 font-medium leading-none mb-1">Hello,</p>
          <h2 className="text-sm font-bold text-gray-900 truncate">
            {user?.name || "ShopZone Customer"}
          </h2>
        </div>
      </div>

      {/* Navigation Links Card */}
      <div className="bg-white rounded-lg shadow-xs border border-gray-100 divide-y divide-gray-100 overflow-hidden">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="py-2">
            <p className="px-4 py-1.5 text-[11px] font-bold text-gray-400 tracking-wider">
              {section.title}
            </p>
            <div>
              {section.items.map((item, iIdx) => {
                const Icon = item.icon;
                const isSelected = item.active;

                const content = (
                  <div
                    className={`flex items-center justify-between px-4 py-2.5 text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#2874f0]/10 text-[#2874f0] font-bold"
                        : "text-gray-700 hover:bg-gray-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-[#2874f0]" : "text-gray-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-[#2874f0]" : "text-gray-300"}`} />
                  </div>
                );

                return item.to ? (
                  <Link key={iIdx} to={item.to}>
                    {content}
                  </Link>
                ) : (
                  <div key={iIdx} className="opacity-70 cursor-not-allowed">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout Row */}
        {user && (
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer text-left"
            >
              <Power className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Trust & Safe Badge */}
      <div className="bg-white rounded-lg p-3 shadow-xs border border-gray-100 flex items-center gap-2.5 text-[11px] text-gray-500">
        <Shield className="w-4 h-4 text-[#388e3c] shrink-0" />
        <span>100% Safe & Secure Payments on ShopZone</span>
      </div>
    </div>
  );
}
