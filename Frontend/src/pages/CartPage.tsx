import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShieldCheck, Tag, MapPin, ChevronRight, Truck, Star, Bookmark } from "lucide-react";
import { Button, Alert, Card } from "../components/common";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useAddress } from "../context/AddressContext";
import type { CartItem } from "../types";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, addToCart } = useCart();
  const { user } = useAuth();
  const { getDefaultAddress } = useAddress();
  const navigate = useNavigate();

  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const defaultAddr = user ? getDefaultAddress() : null;

  const handleSaveForLater = (item: CartItem) => {
    setSavedForLater((prev) => [...prev, item]);
    removeFromCart(item.product.id);
  };

  const handleMoveToCart = (item: CartItem) => {
    addToCart(item.product);
    setSavedForLater((prev) => prev.filter((i) => i.product.id !== item.product.id));
  };

  const handleRemoveSaved = (productId: string | number) => {
    setSavedForLater((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "SAVE10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Use SAVE10 for 10% off.");
    }
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalMRP = cartItems.reduce(
    (sum, i) => sum + (i.product.mrp ?? i.product.price) * i.quantity,
    0
  );
  const totalPrice = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discount = totalMRP - totalPrice;
  const couponDiscount = couponApplied ? Math.round(totalPrice * 0.1) : 0;
  const deliveryCharge = totalPrice > 500 ? 0 : 40;
  const finalAmount = totalPrice - couponDiscount + deliveryCharge;
  const totalSavings = discount + couponDiscount;

  if (cartItems.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 py-20">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xs border border-gray-100 p-8 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">🛒</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Your Cart is empty!</h2>
            <p className="text-xs text-gray-500 mb-6">
              Explore our best deals and add items to your cart now.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#2874f0] hover:bg-[#1e65d8] text-white text-xs sm:text-sm font-bold py-3 px-8 rounded shadow-xs transition-colors cursor-pointer uppercase tracking-wider"
            >
              Shop Now
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Header />

      <main className="max-w-[1440px] mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1 pb-28 lg:pb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* LEFT COLUMN: Delivery Address + Items + Place Order (68%) */}
          <div className="flex-1 w-full space-y-4">
            {/* 1. Flipkart Delivery Address Header Strip */}
            <div className="bg-white rounded-lg shadow-xs border border-gray-100 p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 min-w-0">
                <MapPin className="w-4 h-4 text-[#2874f0] shrink-0" />
                <div className="truncate">
                  {user && defaultAddr ? (
                    <span>
                      Deliver to: <strong className="text-gray-900">{defaultAddr.name}, {defaultAddr.pincode}</strong>{" "}
                      <span className="text-gray-500 hidden sm:inline">• {defaultAddr.locality}, {defaultAddr.city}</span>
                    </span>
                  ) : user ? (
                    <span>
                      Deliver to: <strong className="text-gray-900">{user.name}</strong>{" "}
                      <span className="text-gray-500">• Set delivery address</span>
                    </span>
                  ) : (
                    <span>
                      Delivery location: <strong className="text-gray-900">Select address</strong>
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate(user ? "/addresses" : "/login")}
                className="text-xs font-bold text-[#2874f0] border border-[#2874f0] hover:bg-blue-50 px-3 py-1.5 rounded transition-colors cursor-pointer shrink-0 ml-2"
              >
                {user ? "CHANGE" : "LOGIN"}
              </button>
            </div>

            {/* 2. Active Cart Items Box */}
            {cartItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
                <div className="p-3.5 sm:p-4 border-b border-gray-100 flex items-center justify-between">
                  <h1 className="text-sm sm:text-base font-bold text-gray-900">
                    Flipkart ({totalItems} {totalItems === 1 ? "Item" : "Items"})
                  </h1>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map(({ product, quantity }) => {
                    const discountPct =
                      product.discount ??
                      (product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);

                    return (
                      <div key={product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
                        {/* Thumbnail & Quantity Stepper */}
                        <div className="flex sm:flex-col items-center gap-3 shrink-0">
                          <Link
                            to={`/product/${product.id}`}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded bg-white border border-gray-100 p-1.5 flex items-center justify-center overflow-hidden"
                          >
                            {product.image && (product.image.startsWith("http") || product.image.startsWith("/")) ? (
                              <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                              <span className="text-4xl">{product.image || "🛍️"}</span>
                            )}
                          </Link>

                          {/* Stepper */}
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-gray-900">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <Link
                            to={`/product/${product.id}`}
                            className="text-xs sm:text-sm font-medium text-gray-900 hover:text-[#2874f0] line-clamp-2 transition-colors leading-snug"
                          >
                            {product.name}
                          </Link>

                          <p className="text-[11px] text-gray-400">Seller: SuperComNet</p>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 pt-1 flex-wrap">
                            {product.mrp && product.mrp > product.price && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{Number(product.mrp).toLocaleString("en-IN")}
                              </span>
                            )}
                            <span className="text-base sm:text-lg font-black text-gray-900">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </span>
                            {discountPct > 0 && (
                              <span className="text-xs font-bold text-[#388e3c]">
                                {discountPct}% Off
                              </span>
                            )}
                          </div>

                          {/* Delivery info */}
                          <p className="text-[11px] text-gray-600">
                            Delivery by <strong className="text-gray-900">{product.deliveryDate || "Tomorrow"}</strong> |{" "}
                            <span className="text-[#388e3c] font-bold">Free</span>
                          </p>

                          {/* Action Buttons: Save for Later & Remove */}
                          <div className="flex items-center gap-4 pt-2">
                            <button
                              onClick={() => handleSaveForLater({ product, quantity })}
                              className="text-xs font-bold text-gray-700 hover:text-[#2874f0] uppercase tracking-wider cursor-pointer transition-colors"
                            >
                              Save for Later
                            </button>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-xs font-bold text-gray-700 hover:text-red-600 uppercase tracking-wider cursor-pointer transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Bar: PLACE ORDER (Flipkart Desktop Standard) */}
                <div className="hidden lg:flex justify-end p-4 border-t border-gray-100 bg-white shadow-xs">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="bg-[#fb641b] hover:bg-[#e85a18] text-white font-bold text-sm py-3 px-10 rounded shadow-md active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}

            {/* 3. Flipkart Saved For Later Section */}
            {savedForLater.length > 0 && (
              <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden">
                <div className="p-3.5 sm:p-4 border-b border-gray-100">
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    Saved For Later ({savedForLater.length})
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {savedForLater.map((item) => (
                    <div key={item.product.id} className="p-4 sm:p-5 flex items-start gap-4">
                      <Link
                        to={`/product/${item.product.id}`}
                        className="w-20 h-20 rounded bg-white border border-gray-100 p-1.5 flex items-center justify-center overflow-hidden shrink-0"
                      >
                        {item.product.image && (item.product.image.startsWith("http") || item.product.image.startsWith("/")) ? (
                          <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-3xl">{item.product.image || "🛍️"}</span>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0 space-y-1">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="text-xs sm:text-sm font-medium text-gray-900 hover:text-[#2874f0] line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-gray-900">
                            ₹{Number(item.product.price).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 pt-1.5">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="text-xs font-bold text-[#2874f0] hover:underline uppercase tracking-wider cursor-pointer"
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => handleRemoveSaved(item.product.id)}
                            className="text-xs font-bold text-gray-500 hover:text-red-500 uppercase tracking-wider cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Price Details & Coupons (32%) */}
          <div className="w-full lg:w-[360px] shrink-0 space-y-3.5 sticky top-20">
            {/* Price Details Card */}
            <div className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden font-sans">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Price Details
                </h2>
              </div>

              <div className="p-5 space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Price ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                  <span>₹{totalMRP.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between text-gray-700">
                  <span>Discount</span>
                  <span className="text-[#388e3c] font-semibold">− ₹{discount.toLocaleString("en-IN")}</span>
                </div>

                {couponApplied && (
                  <div className="flex items-center justify-between text-[#388e3c] font-semibold">
                    <span>Coupon Discount (SAVE10)</span>
                    <span>− ₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-[#388e3c] font-semibold">FREE</span>
                  ) : (
                    <span>₹{deliveryCharge}</span>
                  )}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-3.5 flex items-center justify-between text-sm sm:text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{finalAmount.toLocaleString("en-IN")}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="border-t border-dashed border-gray-200 pt-3 text-xs text-[#388e3c] font-bold">
                    You will save ₹{totalSavings.toLocaleString("en-IN")} on this order
                  </div>
                )}
              </div>
            </div>

            {/* Apply Coupon Box */}
            <div className="bg-white rounded-lg shadow-xs border border-gray-100 p-4">
              <button
                onClick={() => setCouponOpen(!couponOpen)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#2874f0] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#2874f0]" />
                  <span>Apply Coupon Code</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${couponOpen ? "rotate-90" : ""}`} />
              </button>

              {couponOpen && (
                <div className="pt-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SAVE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 text-xs border border-gray-200 rounded px-3 py-1.5 uppercase focus:border-[#2874f0] focus:outline-hidden"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-[#2874f0] text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-[#1e65d8] cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
                  {couponApplied && <p className="text-[11px] text-[#388e3c] font-semibold">Coupon applied: 10% discount!</p>}
                </div>
              )}
            </div>

            {/* Trust Shield Badge */}
            <div className="flex items-center gap-2.5 p-3 text-[11px] text-gray-500 bg-white rounded-lg border border-gray-100">
              <ShieldCheck className="w-4 h-4 text-[#388e3c] shrink-0" />
              <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="lg:hidden fixed bottom-14 sm:bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div>
          <p className="text-base font-black text-gray-900">₹{finalAmount.toLocaleString("en-IN")}</p>
          <p className="text-[10px] text-gray-500 font-semibold uppercase">Total amount</p>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-[#fb641b] hover:bg-[#e85a18] text-white font-bold text-xs py-2.5 px-6 rounded shadow-sm cursor-pointer uppercase tracking-wider"
        >
          Place Order
        </button>
      </div>

      <Footer />
    </div>
  );
}