import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { ClipboardList, RefreshCw, Calendar } from "lucide-react";
import Button from "../components/common/Button";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    mrp?: number;
    discount?: number;
  };
}

interface Order {
  id: number;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled" | string;
  created_at: string;
  items: OrderItem[];
}

export default function UserOrders() {
  const { token, openLoginModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch order history");
      }
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-600 text-white";
      case "shipped":
        return "bg-blue-600 text-white";
      case "cancelled":
        return "bg-red-600 text-white";
      default:
        return "bg-yellow-500 text-white";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending Confirmation";
    }
  };

  const getStepActive = (status: string, step: string) => {
    const s = status.toLowerCase();
    if (s === "cancelled") return false;
    if (step === "pending") return true;
    if (step === "shipped") return s === "shipped" || s === "delivered";
    if (step === "delivered") return s === "delivered";
    return false;
  };
                    
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f3f6] font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6 py-24">
          <div className="max-w-md w-full bg-white rounded-sm shadow-sm p-8 text-center flex flex-col items-center gap-4">
            <div className="text-6xl text-gray-300">🔒</div>
            <h2 className="text-xl font-bold text-gray-800">Login to view orders</h2>
            <p className="text-sm text-gray-500">
              Please sign in to your ShipZone account to view your purchase history and track active shipments.
            </p>
            <Button onClick={() => openLoginModal("login")} className="w-full py-3">
              Login Now
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f6] font-sans">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-950 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#2874f0]" />
            My Orders
          </h1>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 text-sm text-[#2874f0] font-semibold hover:underline bg-transparent outline-none border-none cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#2874f0]/20 border-t-[#2874f0] rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 font-medium">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded border border-red-100 text-sm">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-sm p-12 text-center flex flex-col items-center gap-4 border border-gray-100 shadow-xs">
            <div className="text-6xl text-gray-200">📦</div>
            <h2 className="text-lg font-bold text-gray-800">You haven't placed any orders yet</h2>
            <p className="text-sm text-gray-400 max-w-sm">
              Your order logs are empty. Head back to the homepage to explore products and place your first order!
            </p>
            <Button onClick={() => window.location.href = "/"} className="px-6 py-2.5">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order) => {
              const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div key={order.id} className="bg-white rounded-sm shadow-xs border border-gray-200 overflow-hidden">
                  {/* Order header strip */}
                  <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>ORDER ID: <span className="text-gray-800 font-bold">#SZ{order.id}</span></span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> {formattedDate}
                       </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Total Amount: <span className="text-gray-800 text-sm font-bold">₹{order.total.toLocaleString("en-IN")}</span></span>
                      <span className={`px-2 py-0.5 rounded-xs text-[10px] uppercase font-extrabold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Items loop */}
                  <div className="p-5 flex flex-col gap-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row justify-between gap-6 pb-6 last:pb-0 last:border-b-0 border-b border-gray-100">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 shrink-0 rounded bg-gray-50 flex items-center justify-center text-3xl border border-gray-100">
                            {item.product.image}
                           </div>
                          <div className="flex flex-col gap-1 max-w-md">
                            <h3 className="text-sm font-medium text-gray-800 leading-snug hover:text-[#2874f0] transition-colors cursor-pointer">
                               {item.product.name}
                            </h3>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString("en-IN")}</span>
                              {item.product.mrp && item.product.mrp > item.price && (
                                <span className="text-xs text-gray-400 line-through">₹{item.product.mrp.toLocaleString("en-IN")}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order status tracking timeline */}
                        {order.status.toLowerCase() === "cancelled" ? (
                          <div className="flex items-center gap-2 self-start md:self-center text-red-600 font-bold text-xs bg-red-50 px-3 py-2 rounded">
                            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
                            This order was cancelled.
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 self-start md:self-center">
                            {/* Track Timeline */}
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                              <div className="flex items-center gap-1">
                                <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${getStepActive(order.status, "pending") ? "bg-green-600 text-white font-bold" : "bg-gray-200 text-gray-400"}`}>✓</span>
                                <span className={getStepActive(order.status, "pending") ? "text-green-600 font-bold" : ""}>Ordered</span>
                              </div>
                              <div className={`w-8 h-0.5 ${getStepActive(order.status, "shipped") ? "bg-green-600" : "bg-gray-200"}`}></div>
                              <div className="flex items-center gap-1">
                                <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${getStepActive(order.status, "shipped") ? "bg-green-600 text-white font-bold" : "bg-gray-200 text-gray-400"}`}>✓</span>
                                <span className={getStepActive(order.status, "shipped") ? "text-green-600 font-bold" : ""}>Shipped</span>
                              </div>
                              <div className={`w-8 h-0.5 ${getStepActive(order.status, "delivered") ? "bg-green-600" : "bg-gray-200"}`}></div>
                              <div className="flex items-center gap-1">
                                <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${getStepActive(order.status, "delivered") ? "bg-green-600 text-white font-bold" : "bg-gray-200 text-gray-400"}`}>✓</span>
                                <span className={getStepActive(order.status, "delivered") ? "text-green-600 font-bold" : ""}>Delivered</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
