import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Package, Truck, MapPin, Phone, ChevronRight, Star, Home } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const [orderNumber] = useState(() => `OD${Date.now().toString().slice(-10)}`);
  const [deliveryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  });

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Header />

      <main className="max-w-[700px] mx-auto w-full px-3 sm:px-4 py-6 flex-1">
        {/* Success Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Green Header */}
          <div className="bg-gradient-to-r from-[#388e3c] to-[#43a047] text-white px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold mb-1">Order Placed!</h1>
            <p className="text-green-100 text-sm">Thank you for shopping with ShopZone</p>
          </div>

          {/* Order Info */}
          <div className="p-5 sm:p-6 space-y-5">
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Order ID</p>
                  <p className="font-bold text-gray-900 mt-0.5">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Expected Delivery</p>
                  <p className="font-bold text-[#2874f0] mt-0.5">{deliveryDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Payment</p>
                  <p className="font-bold text-gray-900 mt-0.5">UPI / Online</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Status</p>
                  <p className="font-bold text-[#388e3c] mt-0.5">Confirmed ✓</p>
                </div>
              </div>
            </div>

            {/* Order Tracking */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Track Your Order</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0">
                  <div
                    className="h-full bg-[#2874f0] transition-all duration-[2000ms] ease-out"
                    style={{ width: `${progress * 0.33}%` }}
                  />
                </div>

                <div className="relative z-10 grid grid-cols-4 gap-0">
                  {[
                    { icon: CheckCircle, label: "Order Placed", active: true },
                    { icon: Package, label: "Packed", active: false },
                    { icon: Truck, label: "Shipped", active: false },
                    { icon: Home, label: "Delivered", active: false },
                  ].map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          idx === 0 ? "bg-[#2874f0]" : "bg-gray-200"
                        }`}>
                          <Icon className={`w-4 h-4 ${idx === 0 ? "text-white" : "text-gray-400"}`} />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-semibold ${idx === 0 ? "text-[#2874f0]" : "text-gray-400"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Notification Options */}
            <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 text-sm">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#2874f0] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">We'll send you updates!</p>
                  <p className="text-xs text-gray-500 mt-0.5">You'll receive SMS and email notifications about your delivery.</p>
                </div>
              </div>
            </div>

            {/* Rate App */}
            <div className="border border-yellow-200 bg-yellow-50/50 rounded-xl p-4 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <p className="font-bold text-gray-800">Rate your shopping experience</p>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} className="w-8 h-8 rounded-full bg-white border border-yellow-200 flex items-center justify-center hover:bg-yellow-100 transition-colors cursor-pointer">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/orders")}
                className="flex items-center justify-center gap-2 border-2 border-[#2874f0] text-[#2874f0] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer text-sm"
              >
                <Package className="w-4 h-4" />My Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 bg-[#2874f0] text-white font-bold py-3 rounded-xl hover:bg-[#1e65d8] transition-colors cursor-pointer text-sm shadow-sm"
              >
                <Home className="w-4 h-4" />Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {/* "You Might Also Like" prompt */}
        <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-xs p-4 text-center">
          <p className="text-sm font-semibold text-gray-700 mb-2">Discover more products you'll love</p>
          <button
            onClick={() => navigate("/category/electronics")}
            className="flex items-center gap-1 text-sm font-bold text-[#2874f0] mx-auto hover:underline cursor-pointer"
          >
            Browse Electronics <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
