import { useNavigate, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WishlistCard from "../components/wishlist/WishlistCard";
import AccountSidebar from "../components/account/AccountSidebar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMoveToCart = (product: Parameters<typeof addToCart>[0]) => {
    addToCart(product);
    toggleWishlist(product);
  };

  const handleRemove = (productId: string) => {
    const product = wishlist.find((p) => p.id === productId);
    if (product) toggleWishlist(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Header />

      <main className="max-w-[1440px] mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-3 sm:mb-4 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>›</span>
          <Link to="/profile" className="hover:text-[#2874f0]">My Account</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">My Wishlist</span>
        </div>

        {/* 2-Column Flipkart My Account Layout */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left Sidebar */}
          <AccountSidebar activeTab="wishlist" />

          {/* Right Main Content */}
          <div className="flex-1 w-full bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <h1 className="text-base sm:text-lg font-bold text-gray-900">
                  My Wishlist ({wishlist.length})
                </h1>
              </div>
              {wishlist.length > 0 && (
                <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                  Prices and availability are subject to change
                </span>
              )}
            </div>

            {/* Wishlist Items List */}
            {wishlist.length === 0 ? (
              <div className="py-16 sm:py-24 px-4 text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-12 h-12 text-red-400 stroke-1" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                  Empty Wishlist
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  You have no items in your wishlist. Start adding items you like!
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-[#2874f0] hover:bg-[#1e65d8] text-white text-xs sm:text-sm font-bold py-3 px-8 rounded shadow-sm transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {wishlist.map((product) => (
                  <WishlistCard
                    key={product.id}
                    product={product}
                    onMoveToCart={handleMoveToCart}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
