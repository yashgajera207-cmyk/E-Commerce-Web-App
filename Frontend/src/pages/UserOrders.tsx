import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AccountSidebar from "../components/account/AccountSidebar";
import { useAuth } from "../context/AuthContext";
import { RefreshCw, Calendar, Package, Search } from "lucide-react";
import { Button, Alert, Card, Spinner, Badge } from "../components/common";

interface OrderItem {
  id?: number | string;
  productId?: string;
  productName?: string;
  productImage?: string | null;
  quantity: number;
  price: number;
  mrp?: number;
  product?: {
    id: number | string;
    name: string;
    image: string;
    price: number;
    mrp?: number;
    discount?: number;
  };
}

interface Order {
  id: number | string;
  orderNumber?: string;
  total?: number;
  totalAmount?: number;
  status?: string;
  orderStatus?: string;
  created_at?: string;
  createdAt?: string;
  items?: OrderItem[];
}

export default function UserOrders() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const getOrderStatus = (order: Order): string => {
    return order.status || order.orderStatus || "CONFIRMED";
  };

  const getStatusText = (status?: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "cancelled":
        return "Cancelled";
      case "confirmed":
        return "Confirmed";
      default:
        return "Order Placed";
    }
  };

  const getStepActive = (status: string | undefined, step: string) => {
    const s = (status || "").toLowerCase();
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
          <Card className="max-w-md w-full p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-[#2874f0]">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Login to view orders</h2>
            <p className="text-xs text-gray-500">
              Please sign in to your ShopZone account to view your purchase history and track active shipments.
            </p>
            <Button onClick={() => navigate("/login")} fullWidth className="py-2.5 text-xs font-bold">
              Login Now
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const orderNum = (order.orderNumber || `#sz${order.id}`).toLowerCase();
    const matchesItems = (order.items || []).some((it) => {
      const name = it.productName || it.product?.name || "";
      return name.toLowerCase().includes(q);
    });
    return orderNum.includes(q) || matchesItems;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f6] font-sans">
      <Header />

      <main className="max-w-[1440px] mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-3 sm:mb-4 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>›</span>
          <Link to="/profile" className="hover:text-[#2874f0]">My Account</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">My Orders</span>
        </div>

        {/* 2-Column Flipkart My Account Layout */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left Sidebar */}
          <AccountSidebar activeTab="orders" />

          {/* Right Main Content */}
          <div className="flex-1 w-full space-y-4">
            {/* Search orders & Refresh bar */}
            <div className="bg-white rounded-lg shadow-xs border border-gray-100 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <input
                  type="text"
                  placeholder="Search your orders here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-4 py-2 border border-gray-200 rounded focus:border-[#2874f0] focus:outline-hidden"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchOrders}
                  icon={RefreshCw}
                  className="text-[#2874f0] text-xs"
                >
                  Refresh
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg border border-gray-100 p-16 flex flex-col items-center justify-center gap-3">
                <Spinner size="lg" color="blue" />
                <p className="text-xs text-gray-500 font-medium">Loading your orders...</p>
              </div>
            ) : error ? (
              <Alert variant="error">{error}</Alert>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-xs border border-gray-100 p-12 text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#2874f0] mb-2">
                  <Package className="w-8 h-8" />
                </div>
                <h2 className="text-base font-bold text-gray-800">
                  {searchQuery ? "No matching orders found" : "You haven't placed any orders yet"}
                </h2>
                <p className="text-xs text-gray-400 max-w-sm">
                  {searchQuery
                    ? "Try searching for a different product name or order ID."
                    : "Your order logs are empty. Head back to the homepage to explore products and place your first order!"}
                </p>
                <Button onClick={() => navigate("/")} className="px-6 py-2.5 text-xs font-bold mt-2">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const rawDate = order.createdAt || order.created_at || new Date().toISOString();
                  const formattedDate = new Date(rawDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  const status = getOrderStatus(order);
                  const s = status.toLowerCase();

                  const badgeTone =
                    s === "delivered"
                      ? "green"
                      : s === "shipped"
                      ? "blue"
                      : s === "cancelled"
                      ? "red"
                      : "orange";

                  const total = Number(order.totalAmount ?? order.total ?? 0);
                  const orderIdentifier = order.orderNumber || `#SZ${order.id}`;

                  return (
                    <div key={order.id} className="bg-white rounded-lg shadow-xs border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors">
                      {/* Order header strip */}
                      <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>
                            ORDER: <strong className="text-gray-900">{orderIdentifier}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" /> {formattedDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>
                            Total: <strong className="text-gray-900">₹{total.toLocaleString("en-IN")}</strong>
                          </span>
                          <Badge tone={badgeTone} dot>
                            {getStatusText(status)}
                          </Badge>
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="p-4 divide-y divide-gray-100">
                        {(order.items || []).map((item, idx) => {
                          const pName = item.productName || item.product?.name || "Product";
                          const pImage = item.productImage || item.product?.image;
                          const pId = item.productId || item.product?.id || "";
                          const pPrice = Number(item.price || item.product?.price || 0);
                          const pMrp = item.mrp || item.product?.mrp;

                          return (
                            <div
                              key={item.id ?? idx}
                              className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                <Link
                                  to={pId ? `/product/${pId}` : "/"}
                                  className="w-16 h-16 shrink-0 rounded bg-white border border-gray-100 p-1 flex items-center justify-center overflow-hidden"
                                >
                                  {pImage && (pImage.startsWith("http") || pImage.startsWith("/")) ? (
                                    <img
                                      src={pImage}
                                      alt={pName}
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  ) : (
                                    <span className="text-2xl">{pImage || "🛍️"}</span>
                                  )}
                                </Link>
                                <div className="min-w-0 space-y-0.5">
                                  <Link
                                    to={pId ? `/product/${pId}` : "/"}
                                    className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-[#2874f0] line-clamp-1 transition-colors"
                                  >
                                    {pName}
                                  </Link>
                                  <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="font-bold text-gray-900">
                                      ₹{pPrice.toLocaleString("en-IN")}
                                    </span>
                                    {pMrp && pMrp > pPrice && (
                                      <span className="text-[11px] text-gray-400 line-through">
                                        ₹{Number(pMrp).toLocaleString("en-IN")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Tracking bar */}
                              <div className="flex items-center gap-2 self-start sm:self-center">
                                {s === "cancelled" ? (
                                  <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">
                                    Order Cancelled
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                                    <div className="flex items-center gap-1">
                                      <span className={`w-2.5 h-2.5 rounded-full ${getStepActive(status, "pending") ? "bg-green-600" : "bg-gray-200"}`} />
                                      <span className={getStepActive(status, "pending") ? "text-green-700 font-bold" : ""}>Placed</span>
                                    </div>
                                    <span className={`w-6 h-0.5 ${getStepActive(status, "shipped") ? "bg-green-600" : "bg-gray-200"}`} />
                                    <div className="flex items-center gap-1">
                                      <span className={`w-2.5 h-2.5 rounded-full ${getStepActive(status, "shipped") ? "bg-green-600" : "bg-gray-200"}`} />
                                      <span className={getStepActive(status, "shipped") ? "text-green-700 font-bold" : ""}>Shipped</span>
                                    </div>
                                    <span className={`w-6 h-0.5 ${getStepActive(status, "delivered") ? "bg-green-600" : "bg-gray-200"}`} />
                                    <div className="flex items-center gap-1">
                                      <span className={`w-2.5 h-2.5 rounded-full ${getStepActive(status, "delivered") ? "bg-green-600" : "bg-gray-200"}`} />
                                      <span className={getStepActive(status, "delivered") ? "text-green-700 font-bold" : ""}>Delivered</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
