import { useState } from "react";
import { Trash2, Minus, Plus, ShieldCheck, Tag, MapPin, ChevronRight, Truck, Star } from "lucide-react";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const { cartItems, updateQuantity: contextUpdateQuantity, removeFromCart, placeOrder } = useCart();
  const { user, openLoginModal } = useAuth();

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [couponOpen, setCouponOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuantity = (id: string | number, delta: number) => {
    contextUpdateQuantity(id, delta);
  };

  const removeItem = (id: string | number) => {
    setRemovingId(String(id));
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 200);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      await placeOrder();
      setCheckoutSuccess(true);
    } catch (err: any) {
      if (err.message !== "Login required to place order") {
        setError(err.message || "Failed to place order");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalMRP = cartItems.reduce(
    (sum, i) => sum + (i.product.mrp ?? i.product.price) * i.quantity,
    0
  );
  const totalPrice = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discount = totalMRP - totalPrice;
  const deliveryCharge = totalPrice > 500 ? 0 : 40;
  const finalAmount = totalPrice + deliveryCharge;

  if (checkoutSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f5f7]">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4 py-24">
          <div className="max-w-md w-full bg-white rounded-md shadow-sm p-8 text-center">
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-2xl font-semibold text-green-600 mb-2">Order Placed Successfully!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Thank you for your purchase. We are preparing your order for shipment.
            </p>
            <Button onClick={() => window.location.href = "/"} className="w-full py-3">
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f5f7]">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4 py-24">
          <div className="max-w-md w-full bg-white rounded-md shadow-sm p-8 text-center">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty!</h2>
            <p className="text-sm text-gray-500 mb-6">Add items to it now.</p>
            <Button onClick={() => window.location.href = "/"} className="w-full py-3">
              Shop Now
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f7]">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-4">
        {error && (
          <div className="bg-red-50 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-sm mb-4 border border-red-100">
            {error}
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* LEFT: Cart items */}
          <div className="flex-1 w-full bg-white rounded-md shadow-sm">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">
                My Cart <span className="text-gray-400 font-normal text-sm">({totalItems} items)</span>
              </h2>
            </div>

            {/* Delivery address strip */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-blue-50/40">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-brand-blue" />
                <span>
                  Deliver to: <span className="font-medium">{user ? `${user.name}, ${user.mobile || "380001"}` : "Guest, 380001"}</span>
                </span>
              </div>
              {!user ? (
                <button onClick={() => openLoginModal("login")} className="text-brand-blue text-sm font-semibold hover:underline cursor-pointer">
                  Login to Change
                </button>
              ) : (
                <button className="text-brand-blue text-sm font-semibold hover:underline cursor-pointer">
                  Change
                </button>
              )}
            </div>

            {/* Cart item rows */}
            <div>
              {cartItems.map((item) => {
                const { product, quantity } = item;
                const discountPct =
                  product.discount ??
                  (product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);

                return (
                  <div
                    key={product.id}
                    className={`flex gap-4 px-4 sm:px-6 py-5 border-b border-gray-100 transition-all duration-200 ${removingId === product.id ? "opacity-0 -translate-x-4" : "opacity-100"
                      }`}
                  >
                    {/* Image (emoji placeholder) */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-md bg-gray-50 flex items-center justify-center text-4xl sm:text-5xl">
                      {product.image}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-800 leading-snug line-clamp-2 pr-2">
                          {product.name}
                        </p>
                        {discountPct > 0 && (
                          <span className="shrink-0 bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">
                            {discountPct}% off
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      {product.rating != null && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                            {product.rating}
                            <Star className="w-2.5 h-2.5 fill-white" />
                          </span>
                          {product.ratingCount != null && (
                            <span className="text-xs text-gray-400">
                              ({product.ratingCount.toLocaleString("en-IN")})
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-base font-semibold text-gray-900">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                        {discountPct > 0 && (
                          <span className="text-sm text-green-600 font-medium">{discountPct}% off</span>
                        )}
                      </div>

                      <div className="flex items-center gap-6 mt-4">
                        {/* Quantity stepper */}
                        <div className="flex items-center border border-gray-300 rounded-sm">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            disabled={quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(product.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors duration-150 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Place order footer (mobile) */}
            <div className="lg:hidden px-4 sm:px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">₹{finalAmount.toLocaleString("en-IN")}</p>
                <p className="text-xs text-gray-500">Total amount</p>
              </div>
              <Button onClick={handlePlaceOrder} disabled={loading} className="px-10">
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>

          {/* RIGHT: Price details sidebar */}
          <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-md shadow-sm">
              <div className="px-5 py-4 border-b border-dashed border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
                  Price Details
                </h3>
              </div>

              <div className="px-5 py-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>
                    Price ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                  <span>₹{totalMRP.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Discount</span>
                  <span className="text-green-600">− ₹{discount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Delivery Charges
                  </span>
                  {deliveryCharge === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span>₹{deliveryCharge}</span>
                  )}
                </div>
              </div>

              <div className="px-5 py-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">Total Amount</span>
                <span className="text-base font-semibold text-gray-900">
                  ₹{finalAmount.toLocaleString("en-IN")}
                </span>
              </div>

              {discount > 0 && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-green-600 font-medium">
                    You will save ₹{discount.toLocaleString("en-IN")} on this order
                  </p>
                </div>
              )}
            </div>

            {/* Coupon strip */}
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              <button
                onClick={() => setCouponOpen((v) => !v)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-blue" />
                  Apply Coupon
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${couponOpen ? "rotate-90" : "group-hover:translate-x-0.5"
                    }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${couponOpen ? "max-h-24" : "max-h-0"
                  }`}
              >
                <div className="px-5 pb-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-200 rounded-sm px-3 py-2 text-sm outline-none focus:border-brand-blue transition-colors"
                  />
                  <button className="text-brand-blue text-sm font-semibold px-3 hover:underline cursor-pointer whitespace-nowrap">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 px-1 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Safe and Secure Payments. Easy returns. 100% Authentic products.
            </div>

            {/* Place order button (desktop) */}
            <div className="hidden lg:block">
              <Button onClick={handlePlaceOrder} disabled={loading} className="w-full py-3.5">
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}