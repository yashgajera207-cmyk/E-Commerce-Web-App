import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  ClipboardList,
  Users,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  ChevronRight,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Package,
  UserCheck,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";

// Interfaces
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  discount?: number;
  rating?: number;
  ratingCount?: number;
  image?: string;
  category_id: number;
  category_name?: string;
  section?: string;
}

interface Category {
  id: number;
  name: string;
  icon?: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
  };
}

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    mobile?: string;
  };
  items: OrderItem[];
}

interface User {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  created_at: string;
}

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  salesTrend: Array<{ day: string; sales: number; orders: number }>;
}

export default function AdminDashboard() {
  const { token, user, logout, openLoginModal } = useAuth();

  // Selected sidebar tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "categories" | "orders" | "users">("dashboard");

  // Core Data States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search & Filter state
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    discount: "",
    image: "🛍️",
    category_id: "",
    section: "regular",
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "🛍️",
  });

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Load all dashboard components data
  const loadDashboardData = async () => {
    if (!token || !user || user.role !== "admin") {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch stats
      const statsRes = await fetch("http://localhost:5000/api/admin/stats", { headers });
      const statsData = await statsRes.ok ? await statsRes.json() : null;

      // Fetch products
      const productsRes = await fetch("http://localhost:5000/api/products");
      const productsData = await productsRes.ok ? await productsRes.json() : [];

      // Fetch categories
      const categoriesRes = await fetch("http://localhost:5000/api/categories");
      const categoriesData = await categoriesRes.ok ? await categoriesRes.json() : [];

      // Fetch orders
      const ordersRes = await fetch("http://localhost:5000/api/admin/orders", { headers });
      const ordersData = await ordersRes.ok ? await ordersRes.json() : [];

      // Fetch users
      const usersRes = await fetch("http://localhost:5000/api/admin/users", { headers });
      const usersData = await usersRes.ok ? await usersRes.json() : [];

      if (statsData) setStats(statsData);
      setProducts(productsData);
      setCategories(categoriesData);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === "admin") {
      loadDashboardData();
    }
  }, [token, user]);

  // Temporary Toast Feedback triggers
  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    if (type === "success") {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setError(msg);
      setTimeout(() => setError(null), 4000);
    }
  };

  // ==========================================
  // Category Actions
  // ==========================================
  const handleOpenCategoryModal = (cat: Category | null = null) => {
    setEditingCategory(cat);
    if (cat) {
      setCategoryForm({ name: cat.name, icon: cat.icon || "🛍️" });
    } else {
      setCategoryForm({ name: "", icon: "🛍️" });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;

    try {
      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory
        ? `http://localhost:5000/api/categories/${editingCategory.id}`
        : "http://localhost:5000/api/categories";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm),
      });

      if (!res.ok) throw new Error("Failed to save category");

      triggerToast(`Category ${editingCategory ? "updated" : "created"} successfully!`);
      setIsCategoryModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category? This might affect products.")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      triggerToast("Category deleted successfully!");
      loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  // ==========================================
  // Product Actions
  // ==========================================
  const handleOpenProductModal = (prod: Product | null = null) => {
    setEditingProduct(prod);
    if (prod) {
      setProductForm({
        name: prod.name,
        description: prod.description || "",
        price: String(prod.price),
        mrp: String(prod.mrp || prod.price),
        discount: String(prod.discount || 0),
        image: prod.image || "🛍️",
        category_id: String(prod.category_id),
        section: prod.section || "regular",
      });
    } else {
      setProductForm({
        name: "",
        description: "",
        price: "",
        mrp: "",
        discount: "",
        image: "🛍️",
        category_id: categories[0]?.id ? String(categories[0].id) : "1",
        section: "regular",
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, price } = productForm;
    if (!name || !price) return;

    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : "http://localhost:5000/api/products";

      const bodyData = {
        ...productForm,
        price: Number(productForm.price),
        mrp: productForm.mrp ? Number(productForm.mrp) : Number(productForm.price),
        discount: productForm.discount ? Number(productForm.discount) : undefined,
        category_id: Number(productForm.category_id),
        categoryId: Number(productForm.category_id),
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error("Failed to save product");

      triggerToast(`Product ${editingProduct ? "updated" : "created"} successfully!`);
      setIsProductModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete product");

      triggerToast("Product deleted successfully!");
      loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  // ==========================================
  // Order Lifecycle Management
  // ==========================================
  const handleUpdateOrderStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      triggerToast(`Order status updated to "${newStatus}"`);
      loadDashboardData();
      if (selectedOrderDetails && selectedOrderDetails.id === id) {
        setSelectedOrderDetails(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  // ==========================================
  // User Management
  // ==========================================
  const handleToggleUserRole = async (userId: number, currentRole: string) => {
    const targetRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change user role to ${targetRole}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: targetRole }),
      });

      if (!res.ok) throw new Error("Failed to update user role");

      triggerToast(`User role successfully changed to ${targetRole}!`);
      loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = productCategoryFilter === "all" || String(p.category_id) === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = String(o.id).includes(orderSearch) ||
      o.user.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.user.email.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === "all" || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate SVG line/bar chart variables
  const getSalesChartData = () => {
    if (!stats || !stats.salesTrend || stats.salesTrend.length === 0) return [];
    return stats.salesTrend;
  };
  const salesTrend = getSalesChartData();
  const maxSales = salesTrend.length > 0 ? Math.max(...salesTrend.map(t => t.sales), 500) : 500;

  // 1. If not logged in, show login required layout
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f3f6] font-sans">
        <header className="h-[56px] bg-[#2874f0] flex items-center px-6 shadow-md shrink-0">
          <span className="italic font-extrabold text-lg tracking-tight text-white">
            Ship<span className="text-[#ffe500]">Zone</span> Seller Portal
          </span>
        </header>
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded shadow-md p-8 text-center flex flex-col items-center gap-6 border border-gray-200">
            <div className="text-7xl text-gray-300">🔑</div>
            <h2 className="text-xl font-bold text-gray-900">Admin Login Required</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Please sign in with your administrative credentials to access the Seller Hub and manage products, categories, orders, and user directories.
            </p>
            <div className="bg-blue-50 p-4 rounded text-left border border-blue-100 w-full text-xs text-gray-600 flex flex-col gap-1">
              <p className="font-bold text-gray-800">Default Admin Credentials:</p>
              <p>Email: <span className="font-semibold select-all">admin@shipzone.com</span></p>
              <p>Password: <span className="font-semibold select-all">admin123</span></p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => openLoginModal("login")}
                className="w-full bg-[#2874f0] hover:bg-blue-600 transition-colors text-white font-bold py-3 rounded text-sm cursor-pointer shadow"
              >
                Sign In to Admin Portal
              </button>
              <Link to="/" className="text-xs text-[#2874f0] font-semibold hover:underline">
                Back to Home Page
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 2. If logged in but not admin, show access denied layout
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f3f6] font-sans">
        <header className="h-[56px] bg-[#2874f0] flex items-center px-6 shadow-md shrink-0">
          <span className="italic font-extrabold text-lg tracking-tight text-white">
            Ship<span className="text-[#ffe500]">Zone</span> Seller Portal
          </span>
        </header>
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded shadow-md p-8 text-center flex flex-col items-center gap-6 border border-gray-200">
            <div className="text-7xl text-red-500">🚫</div>
            <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your account (<span className="font-semibold text-gray-800">{user.email}</span>) does not have administrator or seller privileges.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Link
                to="/seller"
                className="w-full bg-[#ffe500] hover:bg-yellow-500 transition-colors text-gray-900 font-extrabold py-3 rounded text-sm text-center shadow"
              >
                Join Seller Hub (Activate Admin)
              </Link>
              <button
                onClick={logout}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded text-sm cursor-pointer border border-gray-200"
              >
                Sign Out & Use Different Account
              </button>
              <Link to="/" className="text-xs text-[#2874f0] font-semibold hover:underline">
                Back to Home Page
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f1f3f6] font-sans">
      {/* Sidebar - Flipkart Blue details */}
      <aside className="w-64 bg-[#172337] text-white flex flex-col justify-between shrink-0">
        <div>
          <div className="h-[56px] bg-[#2874f0] flex items-center px-6 border-b border-blue-600 gap-2 shrink-0">
            <span className="italic font-extrabold text-lg tracking-tight text-white">
              Ship<span className="text-[#ffe500]">Zone</span> Seller
            </span>
          </div>

          <nav className="p-4 flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors cursor-pointer ${activeTab === "dashboard" ? "bg-[#2874f0] text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors cursor-pointer ${activeTab === "products" ? "bg-[#2874f0] text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
            >
              <ShoppingBag className="w-4 h-4" /> Products
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors cursor-pointer ${activeTab === "categories" ? "bg-[#2874f0] text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
            >
              <FolderTree className="w-4 h-4" /> Categories
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors cursor-pointer ${activeTab === "orders" ? "bg-[#2874f0] text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
            >
              <ClipboardList className="w-4 h-4" /> Orders
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-colors cursor-pointer ${activeTab === "users" ? "bg-[#2874f0] text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
            >
              <Users className="w-4 h-4" /> Users
            </button>
          </nav>
        </div>  

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800 flex flex-col gap-2">
          <Link to="/" className="text-center text-xs text-gray-400 hover:underline hover:text-white py-1">
            Back to Client Storefront
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-red-950 hover:text-red-300 transition-colors py-2 rounded text-xs font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-[56px] bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-base font-bold text-gray-800 capitalize">
            {activeTab} Management
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold bg-[#2874f0]/10 text-[#2874f0] px-2.5 py-1 rounded">
              Seller: {user?.name}
            </span>
          </div>
        </header>

        {/* Body Container */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Toast Feedbacks */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-xs font-semibold mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
              {successMsg}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-xs font-semibold mb-4 animate-in fade-in slide-in-from-top-1 duration-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-[#2874f0]/20 border-t-[#2874f0] rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Fetching records...</p>
            </div>
          ) : (
            <>
              {/* ========================================== */}
              {/* TAB: DASHBOARD */}
              {/* ========================================== */}
              {activeTab === "dashboard" && stats && (
                <div className="flex flex-col gap-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-5 rounded border border-gray-200 flex items-center justify-between shadow-xs">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Total Sales</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalSales.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="bg-green-50 text-green-600 p-3 rounded-full">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded border border-gray-200 flex items-center justify-between shadow-xs">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Orders Received</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                      </div>
                      <div className="bg-blue-50 text-blue-600 p-3 rounded-full">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded border border-gray-200 flex items-center justify-between shadow-xs">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Active Products</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                      </div>
                      <div className="bg-yellow-50 text-yellow-600 p-3 rounded-full">
                        <Package className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded border border-gray-200 flex items-center justify-between shadow-xs">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Registered Customers</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                      </div>
                      <div className="bg-purple-50 text-purple-600 p-3 rounded-full">
                        <UserCheck className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Graph Section */}
                  <div className="bg-white rounded border border-gray-200 p-5 shadow-xs flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-green-600" /> Weekly Sales Trend (₹)
                    </h3>
                    <div className="h-64 w-full flex items-end justify-between pt-4 border-b border-gray-200 px-4 relative">
                      {salesTrend.map((t, idx) => {
                        const pctHeight = (t.sales / maxSales) * 80; // Scale height up to 80%
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                            {/* Hover info badge */}
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 px-1.5 rounded absolute bottom-full mb-1 z-20 pointer-events-none whitespace-nowrap">
                              ₹{t.sales.toLocaleString("en-IN")} ({t.orders} orders)
                            </span>
                            {/* Bar item */}
                            <div
                              style={{ height: `${Math.max(pctHeight, 4)}%` }}
                              className="w-12 bg-gradient-to-t from-[#2874f0] to-blue-400 hover:from-blue-600 hover:to-blue-500 rounded-t transition-all duration-300"
                            ></div>
                            <span className="text-[10px] font-semibold text-gray-500">{t.day.slice(0, 3)}</span>
                          </div>
                        );
                      })}
                      {/* Empty state graph grid line */}
                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-100"></div>
                      <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-gray-100"></div>
                    </div>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="bg-white rounded border border-gray-200 shadow-xs">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-800">Recent Customer Orders</h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-xs text-[#2874f0] font-semibold flex items-center hover:underline"
                      >
                        View All Orders <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Items Count</th>
                            <th className="px-6 py-3">Total Amount</th>
                            <th className="px-6 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                          {orders.slice(0, 5).map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-3.5 text-[#2874f0]">#SZ{o.id}</td>
                              <td className="px-6 py-3.5">{o.user.name}</td>
                              <td className="px-6 py-3.5">
                                {o.items.reduce((sum, item) => sum + item.quantity, 0)} items
                              </td>
                              <td className="px-6 py-3.5">₹{o.total.toLocaleString("en-IN")}</td>
                              <td className="px-6 py-3.5">
                                <span className={`px-2 py-0.5 rounded-xs text-[9px] uppercase font-bold ${o.status === "delivered" ? "bg-green-100 text-green-700" :
                                    o.status === "shipped" ? "bg-blue-100 text-blue-700" :
                                      o.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                  }`}>
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================== */}
              {/* TAB: PRODUCTS */}
              {/* ========================================== */}
              {activeTab === "products" && (
                <div className="flex flex-col gap-5">
                  {/* Controls Header */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded border border-gray-200 shadow-xs">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="Search product inventory..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full bg-gray-50 text-xs py-2 pl-8 pr-4 rounded border border-gray-200 outline-none focus:border-[#2874f0] transition-colors"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                      </div>

                      <div className="flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5 text-gray-400" />
                        <select
                          value={productCategoryFilter}
                          onChange={(e) => setProductCategoryFilter(e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded text-xs py-1.5 px-2 outline-none"
                        >
                          <option value="all">All Categories</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenProductModal(null)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2874f0] hover:bg-blue-600 transition-colors text-white font-bold text-xs py-2.5 px-4 rounded cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add New Product
                    </button>
                  </div>

                  {/* Table Inventory */}
                  <div className="bg-white rounded border border-gray-200 shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Product Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price / MRP</th>
                            <th className="px-6 py-3">Section</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-3.5 text-gray-400">#P{p.id}</td>
                              <td className="px-6 py-3.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{p.image}</span>
                                  <span className="truncate max-w-[200px]" title={p.name}>{p.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-3.5 text-gray-500">{p.category_name || "Uncategorized"}</td>
                              <td className="px-6 py-3.5">
                                <div>₹{p.price.toLocaleString("en-IN")}</div>
                                {p.mrp && p.mrp > p.price && (
                                  <div className="text-[10px] text-gray-400 line-through">₹{p.mrp.toLocaleString("en-IN")}</div>
                                )}
                              </td>
                              <td className="px-6 py-3.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] capitalize font-bold ${p.section === "deal" ? "bg-red-50 text-red-600" :
                                    p.section === "trending" ? "bg-orange-50 text-orange-600" :
                                      p.section === "new" ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-500"
                                  }`}>
                                  {p.section || "regular"}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 text-right flex items-center justify-end gap-2.5 h-full">
                                <button
                                  onClick={() => handleOpenProductModal(p)}
                                  className="text-blue-500 hover:text-blue-700 bg-gray-50 p-1.5 rounded transition-colors cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="text-red-500 hover:text-red-700 bg-gray-50 p-1.5 rounded transition-colors cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================== */}
              {/* TAB: CATEGORIES */}
              {/* ========================================== */}
              {activeTab === "categories" && (
                <div className="flex flex-col gap-5 max-w-3xl">
                  <div className="flex items-center justify-between bg-white p-4 rounded border border-gray-200 shadow-xs">
                    <h3 className="text-sm font-bold text-gray-800">Categories log</h3>
                    <button
                      onClick={() => handleOpenCategoryModal(null)}
                      className="flex items-center gap-1.5 bg-[#2874f0] hover:bg-blue-600 transition-colors text-white font-bold text-xs py-2 px-3 rounded cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Category
                    </button>
                  </div>

                  <div className="bg-white rounded border border-gray-200 shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">
                          <th className="px-6 py-3">ID</th>
                          <th className="px-6 py-3">Icon</th>
                          <th className="px-6 py-3">Category Name</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                        {categories.map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3.5 text-gray-400">#C{c.id}</td>
                            <td className="px-6 py-3.5 text-lg">{c.icon || "🛍️"}</td>
                            <td className="px-6 py-3.5">{c.name}</td>
                            <td className="px-6 py-3.5 text-right flex items-center justify-end gap-2.5">
                              <button
                                onClick={() => handleOpenCategoryModal(c)}
                                className="text-blue-500 hover:text-blue-700 bg-gray-50 p-1.5 rounded transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(c.id)}
                                className="text-red-500 hover:text-red-700 bg-gray-50 p-1.5 rounded transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================== */}
              {/* TAB: ORDERS */}
              {/* ========================================== */}
              {activeTab === "orders" && (
                <div className="flex flex-col gap-5">
                  {/* Filters Header */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded border border-gray-200 shadow-xs">
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full bg-gray-50 text-xs py-2 pl-8 pr-4 rounded border border-gray-200 outline-none focus:border-[#2874f0] transition-colors"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>

                    <div className="flex items-center gap-1 self-start sm:self-center">
                      <Filter className="w-3.5 h-3.5 text-gray-400" />
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded text-xs py-1.5 px-2 outline-none"
                      >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-white rounded border border-gray-200 shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Total Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                          {filteredOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-3.5 text-[#2874f0]">#SZ{o.id}</td>
                              <td className="px-6 py-3.5">
                                <div>{o.user.name}</div>
                                <div className="text-[10px] text-gray-400">{o.user.email}</div>
                              </td>
                              <td className="px-6 py-3.5 text-gray-500">
                                {new Date(o.created_at).toLocaleDateString("en-IN")}
                              </td>
                              <td className="px-6 py-3.5">₹{o.total.toLocaleString("en-IN")}</td>
                              <td className="px-6 py-3.5">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                  className={`rounded-xs text-[10px] uppercase font-bold py-1 px-1.5 border border-transparent focus:border-gray-300 outline-none ${o.status === "delivered" ? "bg-green-100 text-green-700" :
                                      o.status === "shipped" ? "bg-blue-100 text-blue-700" :
                                        o.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-6 py-3.5 text-right">
                                <button
                                  onClick={() => setSelectedOrderDetails(o)}
                                  className="text-gray-500 hover:text-blue-600 bg-gray-50 p-1.5 rounded transition-colors cursor-pointer"
                                  title="View Order Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================== */}
              {/* TAB: USERS */}
              {/* ========================================== */}
              {activeTab === "users" && (
                <div className="flex flex-col gap-5 max-w-4xl">
                  <div className="bg-white rounded border border-gray-200 shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">
                            <th className="px-6 py-3">User ID</th>
                            <th className="px-6 py-3">Full Name</th>
                            <th className="px-6 py-3">Email Address</th>
                            <th className="px-6 py-3">Mobile Number</th>
                            <th className="px-6 py-3">Access Role</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                          {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-3.5 text-gray-400">#U{u.id}</td>
                              <td className="px-6 py-3.5 font-bold">{u.name}</td>
                              <td className="px-6 py-3.5 text-gray-600">{u.email}</td>
                              <td className="px-6 py-3.5 text-gray-600">{u.mobile || "--"}</td>
                              <td className="px-6 py-3.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] capitalize font-bold ${u.role === "admin" ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"
                                  }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 text-right">
                                <button
                                  onClick={() => handleToggleUserRole(u.id, u.role)}
                                  className="text-xs text-[#2874f0] font-semibold hover:underline bg-transparent border-none cursor-pointer"
                                >
                                  Make {u.role === "admin" ? "User" : "Admin"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ========================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingProduct ? "Edit Product Details" : "Create New Product Listing"}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 flex flex-col gap-4 text-xs font-semibold text-gray-700">
              <div className="flex flex-col gap-1.5">
                <label>Product Name / Title</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Samsung Galaxy S23"
                  className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label>Description / Specification</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Summarize specifications here..."
                  className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0] resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label>MRP (₹)</label>
                  <input
                    type="number"
                    value={productForm.mrp}
                    onChange={e => setProductForm({ ...productForm, mrp: e.target.value })}
                    className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    value={productForm.discount}
                    onChange={e => setProductForm({ ...productForm, discount: e.target.value })}
                    className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label>Category</label>
                  <select
                    value={productForm.category_id}
                    onChange={e => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label>Display Section</label>
                  <select
                    value={productForm.section}
                    onChange={e => setProductForm({ ...productForm, section: e.target.value })}
                    className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none"
                  >
                    <option value="regular">Regular catalog</option>
                    <option value="deal">Deals of the Day</option>
                    <option value="trending">Trending Now</option>
                    <option value="new">New Arrivals</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label>Image Icon / URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="e.g. 📱 or image URL"
                  className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2874f0] hover:bg-blue-600 transition-colors text-white font-bold rounded cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* ========================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingCategory ? "Edit Category Details" : "Create New Category"}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 flex flex-col gap-4 text-xs font-semibold text-gray-700">
              <div className="flex flex-col gap-1.5">
                <label>Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Appliances"
                  className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label>Icon (Emoji or Icon Name)</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  placeholder="e.g. 📺"
                  className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2874f0] hover:bg-blue-600 transition-colors text-white font-bold rounded cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: VIEW ORDER DETAILS */}
      {/* ========================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-900 text-sm">
                Order details: #SZ{selectedOrderDetails.id}
              </h3>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-gray-600">
              {/* Buyer info */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 flex flex-col gap-1 text-gray-800">
                <h4 className="font-bold text-gray-900 text-xs border-b border-gray-200 pb-1.5 mb-1">Customer Profile</h4>
                <p>Name: <span className="font-bold">{selectedOrderDetails.user.name}</span></p>
                <p>Email: <span>{selectedOrderDetails.user.email}</span></p>
                <p>Mobile: <span>{selectedOrderDetails.user.mobile || "--"}</span></p>
                <p>Status: <span className="font-bold capitalize text-blue-600">{selectedOrderDetails.status}</span></p>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-gray-800 text-xs">Ordered Products</h4>
                <div className="divide-y divide-gray-100">
                  {selectedOrderDetails.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{item.product.image}</span>
                        <div>
                          <p className="font-semibold text-gray-800 max-w-[240px] truncate">{item.product.name}</p>
                          <p className="text-[10px] text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total amount */}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">Total Purchase Amount:</span>
                <span className="text-sm font-bold text-gray-900">₹{selectedOrderDetails.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded text-xs font-bold text-gray-800 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
