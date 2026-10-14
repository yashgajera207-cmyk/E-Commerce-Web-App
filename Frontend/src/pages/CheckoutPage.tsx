import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, MapPin, Plus, CreditCard, Smartphone, Landmark, Truck, ShieldCheck, Tag, ChevronDown, ChevronUp } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useAddress } from "../context/AddressContext";
import { useAuth } from "../context/AuthContext";

type Step = "address" | "order_summary" | "payment";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone, desc: "GPay, PhonePe, Paytm & more" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Rupay" },
  { id: "netbanking", label: "Net Banking", icon: Landmark, desc: "All major banks" },
  { id: "cod", label: "Cash on Delivery", icon: Truck, desc: "Pay when delivered" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, placeOrder } = useCart();
  const { addresses } = useAddress();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("address");
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const mrpTotal = cartItems.reduce((sum, item) => sum + (item.product.mrp || item.product.price) * item.quantity, 0);
  const discount = mrpTotal - subtotal;
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal - couponDiscount + deliveryFee;
  const savings = discount + couponDiscount;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!user) { navigate("/login"); return; }
    if (!selectedAddress) { setError("Please select a delivery address."); return; }
    setPlacing(true);
    setError("");
    try {
      await placeOrder();
      navigate("/order-confirmation");
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const steps: { key: Step; label: string }[] = [
    { key: "address", label: "Delivery Address" },
    { key: "order_summary", label: "Order Summary" },
    { key: "payment", label: "Payment" },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🛒</span>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <button onClick={() => navigate("/")} className="mt-4 bg-[#2874f0] text-white font-bold px-8 py-3 rounded-lg cursor-pointer hover:bg-[#1e65d8] transition-colors">
              Continue Shopping
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

      <main className="max-w-[1200px] mx-auto w-full px-3 sm:px-4 py-4 flex-1">
        {/* Step Progress Bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 mb-4">
          <div className="flex items-center gap-0">
            {steps.map((s, idx) => (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => idx <= stepIndex && setStep(s.key)}
                  className={`flex items-center gap-2 cursor-pointer ${idx <= stepIndex ? "opacity-100" : "opacity-40"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    idx < stepIndex ? "bg-[#2874f0] border-[#2874f0] text-white" :
                    idx === stepIndex ? "border-[#2874f0] text-[#2874f0] bg-blue-50" :
                    "border-gray-300 text-gray-400 bg-gray-50"
                  }`}>
                    {idx < stepIndex ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-bold hidden sm:block ${idx === stepIndex ? "text-[#2874f0]" : idx < stepIndex ? "text-gray-700" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${idx < stepIndex ? "bg-[#2874f0]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* LEFT: Step Content */}
          <div className="flex-1 space-y-3">

            {/* STEP 1: Address */}
            <div className={`bg-white rounded-xl border shadow-xs overflow-hidden ${step === "address" ? "border-[#2874f0]" : "border-gray-100"}`}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setStep("address")}
              >
                <div className="flex items-center gap-3">
                  {stepIndex > 0 ? (
                    <CheckCircle className="w-5 h-5 text-[#2874f0] shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#2874f0] text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  )}
                  <div>
                    <h2 className="font-bold text-gray-900 text-sm sm:text-base">Delivery Address</h2>
                    {step !== "address" && selectedAddress && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[300px]">
                        {selectedAddress.name} • {selectedAddress.street}, {selectedAddress.city}
                      </p>
                    )}
                  </div>
                </div>
                {step !== "address" && (
                  <button className="text-xs font-bold text-[#2874f0] border border-[#2874f0] px-3 py-1 rounded cursor-pointer hover:bg-blue-50 transition-colors">
                    Change
                  </button>
                )}
              </div>

              {step === "address" && (
                <div className="border-t border-gray-100 p-4 space-y-3">
                  {addresses.length === 0 ? (
                    <div className="text-center py-6">
                      <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-3">No saved addresses</p>
                      <button onClick={() => navigate("/addresses")} className="text-sm font-bold text-[#2874f0] border border-[#2874f0] px-4 py-2 rounded cursor-pointer hover:bg-blue-50 transition-colors">
                        <Plus className="w-4 h-4 inline mr-1" />Add New Address
                      </button>
                    </div>
                  ) : (
                    <>
                      {addresses.map((address) => (
                        <label key={address.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAddressId === address.id ? "border-[#2874f0] bg-blue-50/40" : "border-gray-200 hover:border-gray-300"
                        }`}>
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="mt-0.5 accent-[#2874f0]"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-gray-900">{address.name}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{address.type}</span>
                              {address.isDefault && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">Default</span>}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              {address.street}, {address.city}, {address.state} – {address.pincode}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">📞 {address.phone}</p>
                          </div>
                        </label>
                      ))}

                      <button
                        onClick={() => navigate("/addresses")}
                        className="flex items-center gap-2 text-sm font-bold text-[#2874f0] border border-dashed border-[#2874f0] w-full justify-center py-2.5 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />Add New Address
                      </button>

                      <button
                        onClick={() => { if (selectedAddressId) setStep("order_summary"); }}
                        disabled={!selectedAddressId}
                        className="w-full bg-[#2874f0] hover:bg-[#1e65d8] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-sm"
                      >
                        Deliver Here
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* STEP 2: Order Summary */}
            <div className={`bg-white rounded-xl border shadow-xs overflow-hidden ${step === "order_summary" ? "border-[#2874f0]" : "border-gray-100"}`}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => stepIndex >= 1 && setStep("order_summary")}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    stepIndex > 1 ? "bg-[#2874f0] text-white" : stepIndex === 1 ? "bg-[#2874f0] text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {stepIndex > 1 ? <CheckCircle className="w-4 h-4" /> : 2}
                  </div>
                  <h2 className={`font-bold text-sm sm:text-base ${stepIndex >= 1 ? "text-gray-900" : "text-gray-400"}`}>Order Summary</h2>
                </div>
                {step !== "order_summary" && stepIndex > 1 && (
                  <button className="text-xs font-bold text-[#2874f0] border border-[#2874f0] px-3 py-1 rounded cursor-pointer hover:bg-blue-50">Change</button>
                )}
              </div>

              {step === "order_summary" && (
                <div className="border-t border-gray-100 p-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-b-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-100 shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/60x60?text=Product"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                        {item.product.mrp && item.product.mrp > item.product.price && (
                          <p className="text-xs text-[#388e3c] font-semibold">{item.product.discount}% off</p>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setStep("payment")}
                    className="w-full bg-[#2874f0] hover:bg-[#1e65d8] text-white font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>

            {/* STEP 3: Payment */}
            <div className={`bg-white rounded-xl border shadow-xs overflow-hidden ${step === "payment" ? "border-[#2874f0]" : "border-gray-100"}`}>
              <div className="flex items-center p-4 gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  stepIndex >= 2 ? "bg-[#2874f0] text-white" : "bg-gray-200 text-gray-500"
                }`}>3</div>
                <h2 className={`font-bold text-sm sm:text-base ${stepIndex >= 2 ? "text-gray-900" : "text-gray-400"}`}>Payment</h2>
              </div>

              {step === "payment" && (
                <div className="border-t border-gray-100 p-4 space-y-3">
                  {/* Coupon */}
                  <div className="border border-dashed border-orange-300 bg-orange-50/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-bold text-gray-800">Apply Coupon</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2874f0] bg-white"
                      />
                      <button
                        onClick={() => coupon === "SAVE10" ? setCouponApplied(true) : alert("Invalid coupon code. Try SAVE10")}
                        className="bg-[#2874f0] text-white text-sm font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-[#1e65d8] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-xs text-[#388e3c] font-bold mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />Coupon SAVE10 applied! You save ₹{couponDiscount.toLocaleString("en-IN")}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-500 mt-1">Try code: SAVE10</p>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      return (
                        <label key={method.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method.id ? "border-[#2874f0] bg-blue-50/40" : "border-gray-200 hover:border-gray-300"
                        }`}>
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                            className="accent-[#2874f0]"
                          />
                          <Icon className="w-5 h-5 text-gray-600 shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{method.label}</p>
                            <p className="text-xs text-gray-500">{method.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {paymentMethod === "upi" && (
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-[#2874f0]"
                      />
                    </div>
                  )}

                  {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                  <div className="pt-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <ShieldCheck className="w-4 h-4 text-[#388e3c]" />
                      <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      className="w-full bg-[#fb641b] hover:bg-[#e85a18] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors cursor-pointer shadow-md text-base"
                    >
                      {placing ? "Placing Order..." : `Place Order • ₹${total.toLocaleString("en-IN")}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Price Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 sticky top-20">
              <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-3">Price Details</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium">₹{mrpTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#388e3c]">
                  <span>Discount</span>
                  <span className="font-semibold">– ₹{discount.toLocaleString("en-IN")}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-[#388e3c]">
                    <span>Coupon (SAVE10)</span>
                    <span className="font-semibold">– ₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges</span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#388e3c] font-semibold">FREE</span>
                  ) : (
                    <span>₹{deliveryFee}</span>
                  )}
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              {savings > 0 && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2.5 text-xs text-[#388e3c] font-bold text-center">
                  🎉 You will save ₹{savings.toLocaleString("en-IN")} on this order!
                </div>
              )}

              {/* Secure payment icons */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-medium text-center mb-2">100% SECURE PAYMENT</p>
                <div className="flex items-center justify-center gap-2 opacity-60">
                  {["VISA", "MC", "UPI", "Paytm"].map((brand) => (
                    <span key={brand} className="text-[9px] font-black bg-gray-100 px-1.5 py-0.5 rounded">{brand}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
