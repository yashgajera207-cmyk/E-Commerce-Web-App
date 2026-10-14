import React, { useState, useEffect, useMemo } from "react";
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
  CheckCircle2,
  Clock,
  Truck,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Store,
  Menu,
  ShieldCheck,
  Grid,
  List,
  Copy,
  Check,
} from "lucide-react";

// ==========================================
// Interfaces & Types
// ==========================================
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
  categoryId?: number;
  category_id?: number;
  category_name?: string;
  category?: { id: number; name: string };
  section?: string;
  brand?: string;
  isAssured?: boolean;
}

interface Category {
  id: number;
  name: string;
  slug?: string;
  icon?: string;
}

interface OrderItem {
  id: number;
  productId?: string | number;
  productName?: string;
  productImage?: string;
  quantity: number;
  price: number;
  mrp?: number;
  product?: {
    id: number | string;
    name: string;
    image: string;
    price: number;
  };
}

interface Order {
  id: number;
  orderNumber?: string;
  total: number;
  totalAmount?: number;
  status: string;
  orderStatus?: string;
  created_at?: string;
  createdAt?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  address?: string;
  user: {
    id?: number;
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
  superCoins?: number;
  createdAt?: string;
  created_at?: string;
  _count?: { orders: number };
}

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  salesTrend: Array<{ day: string; sales: number; orders: number }>;
}

const SAMPLE_IMAGE_PRESETS = [
  { label: "Mobiles", url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80" },
  { label: "Earbuds", url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80" },
  { label: "Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80" },
  { label: "Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80" },
  { label: "Smart TV", url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=80" },
  { label: "Laptop", url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80" },
  { label: "Fashion", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80" },
  { label: "Sneakers", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80" },
];

export default function AdminDashboard() {
  const { token, user, logout, login, becomeSeller } = useAuth();

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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [demoLoginLoading, setDemoLoginLoading] = useState(false);
  const [copiedCreds, setCopiedCreds] = useState(false);

  // Responsive mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global search input
  const [globalSearch, setGlobalSearch] = useState("");

  // Product Tab States
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productSectionFilter, setProductSectionFilter] = useState("all");
  const [productSortBy, setProductSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [productViewMode, setProductViewMode] = useState<"table" | "grid">("table");

  // Order Tab States
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // User Tab States
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Chart view mode (Revenue vs Orders)
  const [chartMetric, setChartMetric] = useState<"sales" | "orders">("sales");

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    discount: "",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80",
    category_id: "",
    section: "deal",
    brand: "",
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "🛍️",
  });

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Temporary Toast Feedback triggers
  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    if (type === "success") {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3500);
    } else {
      setError(msg);
      setTimeout(() => setError(null), 4500);
    }
  };

  // Load all dashboard components data
  const loadDashboardData = async (isManualRefresh = false) => {
    if (!token || !user || user.role !== "admin") {
      setLoading(false);
      return;
    }
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all endpoints concurrently
      const [statsRes, productsRes, categoriesRes, ordersRes, usersRes] = await Promise.allSettled([
        fetch("http://localhost:5000/api/admin/stats", { headers }),
        fetch("http://localhost:5000/api/products?limit=100"),
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/admin/orders", { headers }),
        fetch("http://localhost:5000/api/admin/users", { headers }),
      ]);

      // 1. Process Categories
      let loadedCategories: Category[] = [];
      if (categoriesRes.status === "fulfilled" && categoriesRes.value.ok) {
        const catJson = await categoriesRes.value.json();
        loadedCategories = Array.isArray(catJson) ? catJson : (catJson.categories || []);
        setCategories(loadedCategories);
      }

      // 2. Process Products
      let loadedProducts: Product[] = [];
      if (productsRes.status === "fulfilled" && productsRes.value.ok) {
        const prodJson = await productsRes.value.json();
        const rawProds = Array.isArray(prodJson) ? prodJson : (prodJson.products || []);
        loadedProducts = rawProds.map((p: any) => ({
          ...p,
          categoryId: p.categoryId || p.category_id || (p.category?.id),
          category_id: p.categoryId || p.category_id || (p.category?.id),
          category_name: p.category?.name || "General",
        }));
        setProducts(loadedProducts);
      }

      // 3. Process Orders
      let loadedOrders: Order[] = [];
      if (ordersRes.status === "fulfilled" && ordersRes.value.ok) {
        const ordJson = await ordersRes.value.json();
        const rawOrders = Array.isArray(ordJson) ? ordJson : (ordJson.orders || []);
        loadedOrders = rawOrders.map((o: any) => ({
          ...o,
          total: Number(o.total ?? o.totalAmount ?? 0),
          totalAmount: Number(o.totalAmount ?? o.total ?? 0),
          status: (o.status || o.orderStatus || "pending").toLowerCase(),
          orderStatus: o.orderStatus || o.status || "CONFIRMED",
          created_at: o.created_at || o.createdAt || new Date().toISOString(),
          createdAt: o.createdAt || o.created_at || new Date().toISOString(),
          paymentMethod: o.paymentMethod || "COD",
          paymentStatus: o.paymentStatus || "COMPLETED",
          address: o.address || "Main Delivery Address",
          user: o.user || { name: "Customer", email: "", mobile: "" },
          items: Array.isArray(o.items)
            ? o.items.map((item: any) => ({
                ...item,
                quantity: item.quantity || 1,
                price: Number(item.price || 0),
                mrp: Number(item.mrp || item.price || 0),
                product: item.product || {
                  id: item.productId || item.id,
                  name: item.productName || "Product Listing",
                  image: item.productImage || "🛍️",
                  price: Number(item.price || 0),
                },
              }))
            : [],
        }));
        setOrders(loadedOrders);
      }

      // 4. Process Users
      let loadedUsers: User[] = [];
      if (usersRes.status === "fulfilled" && usersRes.value.ok) {
        const usrJson = await usersRes.value.json();
        loadedUsers = Array.isArray(usrJson) ? usrJson : (usrJson.users || []);
        setUsers(loadedUsers);
      }

      // 5. Process Stats (with automatic fallback computation if stats endpoint is empty)
      if (statsRes.status === "fulfilled" && statsRes.value.ok) {
        const statsJson = await statsRes.value.json();
        setStats(statsJson);
      } else {
        // Compute live fallback stats from orders, products, and users
        const derivedSales = loadedOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0);

        // Build last 7 days trend from loadedOrders
        const dayLabels: Array<{ day: string; sales: number; orders: number }> = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const label = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
          const dateStr = d.toISOString().split("T")[0];
          const daysOrders = loadedOrders.filter((o) => (o.createdAt || o.created_at || "").startsWith(dateStr));
          const daysSales = daysOrders.reduce((sum, o) => sum + o.total, 0);
          dayLabels.push({ day: label, sales: daysSales, orders: daysOrders.length });
        }

        setStats({
          totalSales: derivedSales,
          totalOrders: loadedOrders.length,
          totalProducts: loadedProducts.length,
          totalUsers: loadedUsers.length,
          salesTrend: dayLabels,
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === "admin") {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  // Quick 1-Click Demo Admin Login
  const handle1ClickAdminLogin = async () => {
    setDemoLoginLoading(true);
    setError(null);
    try {
      await login("admin@shopzone.com", "admin123");
      triggerToast("Logged in as Administrator successfully!");
    } catch (err: any) {
      setError(err.message || "Demo login failed. Make sure backend is running.");
    } finally {
      setDemoLoginLoading(false);
    }
  };

  // Quick 1-Click Activate Admin for current logged-in user
  const handlePromoteCurrentAccount = async () => {
    try {
      await becomeSeller();
      triggerToast("Account promoted to Administrator! Loading portal...");
      await loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || "Failed to promote account", "error");
    }
  };

  // Copy credentials helper
  const copyCredentials = () => {
    navigator.clipboard.writeText("admin@shopzone.com / admin123");
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2000);
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
    if (!categoryForm.name.trim()) return;

    try {
      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory
        ? `http://localhost:5000/api/admin/categories/${editingCategory.id}`
        : "http://localhost:5000/api/admin/categories";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm),
      });

      if (!res.ok) throw new Error("Failed to save category");

      triggerToast(`Category "${categoryForm.name}" ${editingCategory ? "updated" : "created"}!`);
      setIsCategoryModalOpen(false);
      loadDashboardData(true);
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? Products in this category may be unlinked.`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      triggerToast(`Category "${name}" deleted successfully!`);
      loadDashboardData(true);
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
        image: prod.image || SAMPLE_IMAGE_PRESETS[0].url,
        category_id: String(prod.categoryId || prod.category_id || categories[0]?.id || "1"),
        section: prod.section || "deal",
        brand: prod.brand || "",
      });
    } else {
      setProductForm({
        name: "",
        description: "",
        price: "",
        mrp: "",
        discount: "",
        image: SAMPLE_IMAGE_PRESETS[0].url,
        category_id: categories[0]?.id ? String(categories[0].id) : "1",
        section: "deal",
        brand: "",
      });
    }
    setIsProductModalOpen(true);
  };

  // Auto-calculate discount % when price or MRP changes
  const handlePriceChange = (newPrice: string, newMrp: string) => {
    const p = parseFloat(newPrice);
    const m = parseFloat(newMrp);
    let disc = productForm.discount;
    if (!isNaN(p) && !isNaN(m) && m > p && m > 0) {
      disc = String(Math.round(((m - p) / m) * 100));
    }
    setProductForm((prev) => ({
      ...prev,
      price: newPrice,
      mrp: newMrp,
      discount: disc,
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, price, category_id } = productForm;
    if (!name || !price) {
      triggerToast("Please provide product name and price", "error");
      return;
    }

    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `http://localhost:5000/api/admin/products/${editingProduct.id}`
        : "http://localhost:5000/api/admin/products";

      const catId = Number(category_id) || (categories[0]?.id ? categories[0].id : 1);
      const bodyData = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        mrp: productForm.mrp ? Number(productForm.mrp) : Number(productForm.price),
        discount: productForm.discount ? Number(productForm.discount) : undefined,
        image: productForm.image || SAMPLE_IMAGE_PRESETS[0].url,
        category_id: catId,
        categoryId: catId,
        section: productForm.section || "regular",
        brand: productForm.brand || null,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save product");
      }

      triggerToast(`Product "${productForm.name}" ${editingProduct ? "updated" : "created"}!`);
      setIsProductModalOpen(false);
      loadDashboardData(true);
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!window.confirm(`Delete product "${name}" permanently?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete product");

      triggerToast(`Product "${name}" removed from catalog!`);
      loadDashboardData(true);
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  // ==========================================
  // Order Lifecycle Management
  // ==========================================
  const handleUpdateOrderStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to update status");
      }

      triggerToast(`Order #SZ${id} status updated to ${newStatus.toUpperCase()}!`);
      // Optimistically update orders state
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus.toLowerCase(), orderStatus: newStatus.toUpperCase() } : o))
      );
      if (selectedOrderDetails && selectedOrderDetails.id === id) {
        setSelectedOrderDetails((prev) =>
          prev ? { ...prev, status: newStatus.toLowerCase(), orderStatus: newStatus.toUpperCase() } : null
        );
      }
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  // ==========================================
  // User Role Management
  // ==========================================
  const handleToggleUserRole = async (userId: number, currentRole: string, userName: string) => {
    const targetRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change ${userName}'s permissions to "${targetRole.toUpperCase()}"?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: targetRole }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to update role");
      }

      triggerToast(`Role updated for ${userName} to ${targetRole}!`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u)));
    } catch (err: any) {
      triggerToast(err.message || "Operation failed", "error");
    }
  };

  // ==========================================
  // Filtering & Computed Data
  // ==========================================
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const query = (productSearch || globalSearch).toLowerCase();
        const matchesSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.brand && p.brand.toLowerCase().includes(query));

        const matchesCategory =
          productCategoryFilter === "all" ||
          String(p.categoryId) === productCategoryFilter ||
          String(p.category_id) === productCategoryFilter;

        const matchesSection = productSectionFilter === "all" || p.section === productSectionFilter;

        return matchesSearch && matchesCategory && matchesSection;
      })
      .sort((a, b) => {
        if (productSortBy === "price-asc") return a.price - b.price;
        if (productSortBy === "price-desc") return b.price - a.price;
        if (productSortBy === "name") return a.name.localeCompare(b.name);
        return b.id - a.id;
      });
  }, [products, productSearch, globalSearch, productCategoryFilter, productSectionFilter, productSortBy]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const query = (orderSearch || globalSearch).toLowerCase();
      const userName = o.user?.name || "";
      const userEmail = o.user?.email || "";
      const userMobile = o.user?.mobile || "";

      const matchesSearch =
        !query ||
        String(o.id).includes(query) ||
        (o.orderNumber && o.orderNumber.toLowerCase().includes(query)) ||
        userName.toLowerCase().includes(query) ||
        userEmail.toLowerCase().includes(query) ||
        userMobile.includes(query);

      const status = (o.status || o.orderStatus || "").toLowerCase();
      const matchesStatus = orderStatusFilter === "all" || status === orderStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, globalSearch, orderStatusFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = (userSearch || globalSearch).toLowerCase();
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.mobile && u.mobile.includes(query));

      const matchesRole = userRoleFilter === "all" || u.role.toLowerCase() === userRoleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, globalSearch, userRoleFilter]);

  // Chart data calculations
  const salesTrend = stats?.salesTrend || [];
  const maxMetricValue = useMemo(() => {
    if (salesTrend.length === 0) return 500;
    if (chartMetric === "sales") {
      const maxVal = Math.max(...salesTrend.map((t) => t.sales), 1000);
      return Math.ceil(maxVal / 1000) * 1000;
    } else {
      const maxVal = Math.max(...salesTrend.map((t) => t.orders), 5);
      return Math.ceil(maxVal);
    }
  }, [salesTrend, chartMetric]);

  // Order count badges
  const pendingOrdersCount = orders.filter((o) => ["pending", "confirmed", "placed"].includes(o.status.toLowerCase())).length;

  // ==========================================
  // UNLOGGED / UNAUTHORIZED RENDERING
  // ==========================================
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f3f6] font-sans antialiased text-[#212121]">
        {/* Top Minimal Seller Header */}
        <header className="h-[60px] bg-[#2874f0] flex items-center justify-between px-6 shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="italic font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              Shop<span className="text-[#ffe500]">Zone</span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider not-italic">
                Seller Hub
              </span>
            </span>
          </div>
          <Link to="/" className="text-xs text-white/90 hover:text-white font-semibold flex items-center gap-1">
            <Store className="w-3.5 h-3.5" /> Back to Storefront
          </Link>
        </header>

        <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 sm:p-8 text-center flex flex-col items-center gap-5 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-50 text-[#2874f0] rounded-full flex items-center justify-center text-3xl shadow-inner">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Admin & Seller Portal</h1>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Sign in with administrative privileges to manage catalog inventory, dispatch orders, and inspect financial metrics.
              </p>
            </div>

            {/* Error badge if any */}
            {error && (
              <div className="w-full bg-red-50 text-red-700 text-xs px-3.5 py-2.5 rounded border border-red-200 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1-CLICK DEMO LOGIN BUTTON */}
            <button
              onClick={handle1ClickAdminLogin}
              disabled={demoLoginLoading}
              className="w-full bg-gradient-to-r from-[#2874f0] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-md text-sm cursor-pointer shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              {demoLoginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authenticating Demo Admin...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#ffe500]" />
                  ⚡ 1-Click Demo Admin Login
                </>
              )}
            </button>

            {/* Default Credentials Box */}
            <div className="bg-slate-50 p-3.5 rounded-md text-left border border-slate-200 w-full text-xs text-gray-600 flex flex-col gap-1.5 relative">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-800 text-[11px] uppercase tracking-wide">Pre-configured Admin Credentials:</p>
                <button
                  onClick={copyCredentials}
                  className="text-[11px] text-[#2874f0] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copiedCreds ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  {copiedCreds ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-gray-200 font-mono text-[11px]">
                <span className="text-gray-500">Email:</span>
                <span className="font-bold text-gray-800 select-all">admin@shopzone.com</span>
              </div>
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-gray-200 font-mono text-[11px]">
                <span className="text-gray-500">Password:</span>
                <span className="font-bold text-gray-800 select-all">admin123</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full my-1">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="text-[11px] text-gray-400 font-medium uppercase">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Link
              to="/login"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded border border-gray-300 text-xs text-center transition-colors block"
            >
              Sign In via Standard Login Screen
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // 2. If logged in but user role is not admin, show Access Denied with 1-click promote
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f3f6] font-sans antialiased text-[#212121]">
        <header className="h-[60px] bg-[#2874f0] flex items-center px-6 shadow-md shrink-0">
          <span className="italic font-extrabold text-xl tracking-tight text-white">
            Shop<span className="text-[#ffe500]">Zone</span> Seller Hub
          </span>
        </header>

        <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center flex flex-col items-center gap-5 border border-gray-200 animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-3xl">
              <AlertCircle className="w-9 h-9" />
            </div>

            <h2 className="text-xl font-extrabold text-gray-900">Administrator Access Required</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              You are logged in as <strong className="text-gray-800 font-semibold">{user.email}</strong>, but your account currently has the role <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">{user.role}</span>.
            </p>

            <button
              onClick={handlePromoteCurrentAccount}
              className="w-full bg-[#ffe500] hover:bg-yellow-400 text-gray-900 font-extrabold py-3 rounded-md text-sm shadow cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-gray-900" />
              ⚡ Enable Admin Access for My Account (1-Click)
            </button>

            <div className="flex flex-col gap-2 w-full pt-2">
              <button
                onClick={handle1ClickAdminLogin}
                className="w-full bg-[#2874f0] hover:bg-blue-600 text-white font-bold py-2.5 rounded text-xs cursor-pointer"
              >
                Switch to Default Admin Account
              </button>
              <button
                onClick={logout}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded text-xs cursor-pointer"
              >
                Sign Out
              </button>
              <Link to="/" className="text-xs text-[#2874f0] font-semibold hover:underline mt-1">
                Return to Storefront
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // MAIN ADMIN DASHBOARD UI
  // ==========================================
  return (
    <div className="min-h-screen flex bg-[#f1f3f6] font-sans antialiased text-[#212121]">
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar - Flipkart Dark Tone #172337 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#172337] text-white flex flex-col justify-between shrink-0 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-[60px] bg-[#111a2a] flex items-center justify-between px-5 border-b border-gray-800 shrink-0">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="italic font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                Shop<span className="text-[#ffe500]">Zone</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#2874f0] text-white px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 flex flex-col gap-1">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#2874f0] text-white shadow-sm"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" /> Overview & Stats
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("products");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "products"
                  ? "bg-[#2874f0] text-white shadow-sm"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" /> Products Catalog
              </span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("categories");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "categories"
                  ? "bg-[#2874f0] text-white shadow-sm"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <FolderTree className="w-4 h-4" /> Categories
              </span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("orders");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#2874f0] text-white shadow-sm"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4" /> Customer Orders
              </span>
              {pendingOrdersCount > 0 ? (
                <span className="bg-[#ffe500] text-gray-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {pendingOrdersCount} new
                </span>
              ) : (
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("users");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "users"
                  ? "bg-[#2874f0] text-white shadow-sm"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Users className="w-4 h-4" /> Registered Users
              </span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {users.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer & Live Server Status */}
        <div className="p-4 border-t border-gray-800 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              PostgreSQL Live
            </span>
            <span className="font-mono text-[10px] text-gray-500">v1.0.0</span>
          </div>

          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-gray-200 py-2 rounded text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Storefront
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-300 transition-colors py-2 rounded text-xs font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-gray-700 hover:text-[#2874f0] p-1.5 rounded cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-base sm:text-lg font-extrabold text-gray-800 capitalize tracking-tight flex items-center gap-2">
              {activeTab === "dashboard" ? "Admin Command Center" : `${activeTab} Management`}
            </h1>
          </div>

          {/* Quick Header Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-48 sm:w-64">
              <input
                type="text"
                placeholder="Global admin search..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-gray-50 text-xs py-2 pl-8 pr-4 rounded-full border border-gray-200 outline-none focus:border-[#2874f0] transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch("")}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Manual Data Refresh */}
            <button
              onClick={() => loadDashboardData(true)}
              disabled={refreshing}
              className="text-gray-600 hover:text-[#2874f0] hover:bg-blue-50 p-2 rounded-full transition-colors cursor-pointer"
              title="Refresh Data from Server"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#2874f0]" : ""}`} />
            </button>

            {/* Quick Add Product Button */}
            <button
              onClick={() => handleOpenProductModal(null)}
              className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs py-2 px-3 rounded shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Product</span>
            </button>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2874f0] to-blue-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {(user?.name || "Admin")[0].toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[120px]">
                  {user?.name || "Administrator"}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Toast Notification Alerts */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-md text-xs font-semibold mb-4 shadow-xs flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {successMsg}
              </span>
              <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-xs font-semibold mb-4 shadow-xs flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                {error}
              </span>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 border-4 border-[#2874f0]/20 border-t-[#2874f0] rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-semibold tracking-wide">Syncing data from ShopZone backend...</p>
            </div>
          ) : (
            <>
              {/* ========================================================================= */}
              {/* TAB: DASHBOARD (ANALYTICS & OVERVIEW) */}
              {/* ========================================================================= */}
              {activeTab === "dashboard" && (
                <div className="flex flex-col gap-6">
                  {/* Top 4 KPI Metrics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metric 1: Total Gross Revenue */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between hover:border-blue-300 transition-colors">
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gross Revenue</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">
                          ₹{(stats?.totalSales || 0).toLocaleString("en-IN")}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
                            <ArrowUpRight className="w-3 h-3 inline" /> +14.8%
                          </span>
                          <span className="text-[10px] text-gray-400">vs last cycle</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-50 to-green-100 text-emerald-600 flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Metric 2: Orders Received */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between hover:border-blue-300 transition-colors">
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer Orders</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">{stats?.totalOrders || orders.length}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            {pendingOrdersCount} Action Needed
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-100 text-[#2874f0] flex items-center justify-center">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Metric 3: Active Catalog Products */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between hover:border-blue-300 transition-colors">
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Catalog Inventory</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">{stats?.totalProducts || products.length}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            {categories.length} Categories
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-50 to-yellow-100 text-amber-600 flex items-center justify-center">
                        <Package className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Metric 4: Registered Customers */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between hover:border-blue-300 transition-colors">
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer Accounts</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">{stats?.totalUsers || users.length}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                            {users.filter((u) => u.role === "admin").length} Admins
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-50 to-fuchsia-100 text-purple-600 flex items-center justify-center">
                        <UserCheck className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Interactive Chart Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xs flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#2874f0]" /> 7-Day Performance Matrix
                        </h2>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Daily gross volume and customer checkout run-rate
                        </p>
                      </div>

                      <div className="flex items-center bg-gray-100 p-1 rounded-md text-xs font-semibold">
                        <button
                          onClick={() => setChartMetric("sales")}
                          className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                            chartMetric === "sales" ? "bg-white text-[#2874f0] shadow-xs font-bold" : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          Revenue (₹)
                        </button>
                        <button
                          onClick={() => setChartMetric("orders")}
                          className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                            chartMetric === "orders" ? "bg-white text-[#2874f0] shadow-xs font-bold" : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          Order Count
                        </button>
                      </div>
                    </div>

                    {/* SVG Chart Graphic */}
                    <div className="h-64 w-full flex items-end justify-between pt-6 border-b border-gray-200 px-4 relative">
                      {/* Horizontal Gridlines */}
                      <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-gray-100 flex justify-end pr-2 text-[10px] text-gray-300 pointer-events-none">
                        {chartMetric === "sales" ? `₹${(maxMetricValue * 0.75).toLocaleString("en-IN")}` : Math.round(maxMetricValue * 0.75)}
                      </div>
                      <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-gray-100 flex justify-end pr-2 text-[10px] text-gray-300 pointer-events-none">
                        {chartMetric === "sales" ? `₹${(maxMetricValue * 0.5).toLocaleString("en-IN")}` : Math.round(maxMetricValue * 0.5)}
                      </div>
                      <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-gray-100 flex justify-end pr-2 text-[10px] text-gray-300 pointer-events-none">
                        {chartMetric === "sales" ? `₹${(maxMetricValue * 0.25).toLocaleString("en-IN")}` : Math.round(maxMetricValue * 0.25)}
                      </div>

                      {salesTrend.map((t, idx) => {
                        const val = chartMetric === "sales" ? t.sales : t.orders;
                        const pctHeight = (val / maxMetricValue) * 82;

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                            {/* Hover info tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[11px] py-1 px-2.5 rounded shadow-lg absolute bottom-full mb-2 z-20 pointer-events-none whitespace-nowrap text-center">
                              <p className="font-bold text-[#ffe500]">{t.day}</p>
                              <p>Revenue: ₹{t.sales.toLocaleString("en-IN")}</p>
                              <p>Orders: {t.orders}</p>
                            </div>

                            {/* Bar Graphic */}
                            <div
                              style={{ height: `${Math.max(pctHeight, 6)}%` }}
                              className={`w-9 sm:w-14 rounded-t-md transition-all duration-300 cursor-pointer ${
                                chartMetric === "sales"
                                  ? "bg-gradient-to-t from-[#2874f0] to-blue-400 group-hover:from-blue-600 group-hover:to-blue-500 shadow-sm"
                                  : "bg-gradient-to-t from-emerald-500 to-teal-400 group-hover:from-emerald-600 group-hover:to-teal-500 shadow-sm"
                              }`}
                            ></div>

                            <span className="text-[10px] font-bold text-gray-500">{t.day.slice(0, 3)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2-Column Split: Recent Orders & Catalog Highlights */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Recent Customer Orders (2 cols) */}
                    <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-xs flex flex-col">
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                          <h2 className="text-sm font-bold text-gray-900">Recent Customer Orders</h2>
                          <p className="text-[11px] text-gray-400">Latest checkouts awaiting fulfillment</p>
                        </div>
                        <button
                          onClick={() => setActiveTab("orders")}
                          className="text-xs text-[#2874f0] font-bold flex items-center hover:underline cursor-pointer"
                        >
                          All Orders ({orders.length}) <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50/80 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                              <th className="px-4 py-3">Order</th>
                              <th className="px-4 py-3">Customer</th>
                              <th className="px-4 py-3">Items</th>
                              <th className="px-4 py-3">Total</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                            {orders.slice(0, 5).map((o) => (
                              <tr key={o.id} className="hover:bg-blue-50/40 transition-colors">
                                <td className="px-4 py-3 text-[#2874f0] font-mono font-bold">#SZ{o.id}</td>
                                <td className="px-4 py-3">
                                  <div className="font-bold text-gray-800">{o.user?.name || "Customer"}</div>
                                  <div className="text-[10px] text-gray-400 font-normal truncate max-w-[130px]">
                                    {o.user?.email || ""}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                  {o.items.reduce((s, i) => s + (i.quantity || 1), 0)} items
                                </td>
                                <td className="px-4 py-3 font-bold text-gray-900">
                                  ₹{o.total.toLocaleString("en-IN")}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                                      o.status === "delivered"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : o.status === "shipped"
                                        ? "bg-blue-100 text-blue-800"
                                        : o.status === "cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {o.orderStatus || o.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    onClick={() => setSelectedOrderDetails(o)}
                                    className="p-1.5 text-gray-500 hover:text-[#2874f0] bg-gray-50 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                    title="View Full Order Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {orders.length === 0 && (
                              <tr>
                                <td colSpan={6} className="text-center py-8 text-xs text-gray-400">
                                  No customer orders received yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right: Catalog Highlights (1 col) */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-xs flex flex-col">
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                          <h2 className="text-sm font-bold text-gray-900">Featured Products</h2>
                          <p className="text-[11px] text-gray-400">Deals and trending items</p>
                        </div>
                        <button
                          onClick={() => setActiveTab("products")}
                          className="text-xs text-[#2874f0] font-bold hover:underline cursor-pointer"
                        >
                          View All
                        </button>
                      </div>

                      <div className="p-3 divide-y divide-gray-100 flex flex-col">
                        {products.slice(0, 5).map((p) => (
                          <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                                {p.image && (p.image.startsWith("http") || p.image.startsWith("/")) ? (
                                  <img src={p.image} alt={p.name} className="w-full h-full object-contain p-0.5" />
                                ) : (
                                  <span className="text-xl">{p.image || "🛍️"}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-800 truncate" title={p.name}>
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-gray-400 truncate">
                                  {p.category_name || "General"} • {p.section || "regular"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-black text-gray-900">₹{p.price.toLocaleString("en-IN")}</p>
                              {p.discount && (
                                <p className="text-[10px] text-emerald-600 font-bold">{p.discount}% off</p>
                              )}
                            </div>
                          </div>
                        ))}
                        {products.length === 0 && (
                          <div className="text-center py-8 text-xs text-gray-400">
                            No products currently in catalog.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB: PRODUCTS (CATALOG MANAGEMENT) */}
              {/* ========================================================================= */}
              {activeTab === "products" && (
                <div className="flex flex-col gap-5">
                  {/* Controls Header */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                      {/* Product Search */}
                      <div className="relative w-full sm:w-56">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full bg-gray-50 text-xs py-2 pl-8 pr-3 rounded border border-gray-200 outline-none focus:border-[#2874f0] transition-colors"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                      </div>

                      {/* Category Filter */}
                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded text-xs py-2 px-2.5 outline-none font-medium"
                      >
                        <option value="all">All Categories ({products.length})</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      {/* Section Filter */}
                      <select
                        value={productSectionFilter}
                        onChange={(e) => setProductSectionFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded text-xs py-2 px-2.5 outline-none font-medium"
                      >
                        <option value="all">All Sections</option>
                        <option value="deal">Deals of the Day</option>
                        <option value="trending">Trending Now</option>
                        <option value="new">New Arrivals</option>
                        <option value="regular">Regular Catalog</option>
                      </select>

                      {/* Sort by */}
                      <select
                        value={productSortBy}
                        onChange={(e: any) => setProductSortBy(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded text-xs py-2 px-2.5 outline-none font-medium"
                      >
                        <option value="featured">Sort: Newest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name">Name: A to Z</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                      {/* View Switcher */}
                      <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-200">
                        <button
                          onClick={() => setProductViewMode("table")}
                          className={`p-1.5 rounded cursor-pointer ${
                            productViewMode === "table" ? "bg-white text-[#2874f0] shadow-xs" : "text-gray-500"
                          }`}
                          title="Table View"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductViewMode("grid")}
                          className={`p-1.5 rounded cursor-pointer ${
                            productViewMode === "grid" ? "bg-white text-[#2874f0] shadow-xs" : "text-gray-500"
                          }`}
                          title="Grid View"
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenProductModal(null)}
                        className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs py-2 px-3.5 rounded shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add New Product
                      </button>
                    </div>
                  </div>

                  {/* Product Inventory Table View */}
                  {productViewMode === "table" ? (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                              <th className="px-4 py-3">Product</th>
                              <th className="px-4 py-3">Category</th>
                              <th className="px-4 py-3">Price & MRP</th>
                              <th className="px-4 py-3">Section</th>
                              <th className="px-4 py-3">Rating</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                            {filteredProducts.map((p) => (
                              <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-white shrink-0 flex items-center justify-center p-0.5">
                                      {p.image && (p.image.startsWith("http") || p.image.startsWith("/")) ? (
                                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                                      ) : (
                                        <span className="text-xl">{p.image || "🛍️"}</span>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <span className="font-bold text-gray-900 truncate block max-w-xs" title={p.name}>
                                        {p.name}
                                      </span>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-mono text-gray-400">#P{p.id}</span>
                                        {p.brand && (
                                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1 rounded">
                                            {p.brand}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{p.category_name || "General"}</td>
                                <td className="px-4 py-3">
                                  <div className="font-bold text-gray-900">₹{p.price.toLocaleString("en-IN")}</div>
                                  {p.mrp && p.mrp > p.price && (
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
                                      <span className="line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                                      <span className="text-emerald-600 font-bold">
                                        {p.discount || Math.round(((p.mrp - p.price) / p.mrp) * 100)}% off
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                                      p.section === "deal"
                                        ? "bg-red-50 text-red-700 border border-red-200"
                                        : p.section === "trending"
                                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                                        : p.section === "new"
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {p.section || "regular"}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    ★ {p.rating || "4.2"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Link
                                      to={`/product/${p.id}`}
                                      target="_blank"
                                      className="p-1.5 text-gray-500 hover:text-[#2874f0] bg-gray-50 hover:bg-blue-50 rounded transition-colors"
                                      title="Preview on Storefront"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                    <button
                                      onClick={() => handleOpenProductModal(p)}
                                      className="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                                      title="Edit Product"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(p.id, p.name)}
                                      className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded transition-colors cursor-pointer"
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                              <tr>
                                <td colSpan={6} className="text-center py-10 text-xs text-gray-400">
                                  No products matched your search or filters.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* Product Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          <div className="p-4 flex flex-col items-center text-center">
                            <div className="w-32 h-32 flex items-center justify-center mb-3">
                              {p.image && (p.image.startsWith("http") || p.image.startsWith("/")) ? (
                                <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-4xl">{p.image || "🛍️"}</span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                              {p.category_name || "General"}
                            </span>
                            <h3 className="text-xs font-bold text-gray-900 mt-1 line-clamp-2" title={p.name}>
                              {p.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm font-black text-gray-900">₹{p.price.toLocaleString("en-IN")}</span>
                              {p.mrp && p.mrp > p.price && (
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{p.mrp.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-gray-400">#P{p.id}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenProductModal(p)}
                                className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB: CATEGORIES */}
              {/* ========================================================================= */}
              {activeTab === "categories" && (
                <div className="flex flex-col gap-5">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">Taxonomy & Categories</h2>
                      <p className="text-[11px] text-gray-400">
                        Manage navigational menu classification and iconography
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenCategoryModal(null)}
                      className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs py-2 px-3.5 rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((c) => {
                      const count = products.filter((p) => p.categoryId === c.id || p.category_id === c.id).length;
                      return (
                        <div
                          key={c.id}
                          className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-lg bg-blue-50 text-[#2874f0] flex items-center justify-center text-xl shrink-0">
                              {c.icon || "🛍️"}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900 text-xs truncate">{c.name}</h3>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {c.slug || `cat-${c.id}`} • {count} items
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">ID: #C{c.id}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenCategoryModal(c)}
                                className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                                title="Edit Category"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(c.id, c.name)}
                                className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB: ORDERS */}
              {/* ========================================================================= */}
              {activeTab === "orders" && (
                <div className="flex flex-col gap-5">
                  {/* Filters & Status Tabs */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      {/* Search */}
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="Search by Order ID, Customer..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full bg-gray-50 text-xs py-2 pl-8 pr-3 rounded border border-gray-200 outline-none focus:border-[#2874f0] transition-colors"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                      </div>

                      {/* Status Filter */}
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded text-xs py-2 px-2.5 outline-none font-medium"
                      >
                        <option value="all">All Orders ({orders.length})</option>
                        <option value="confirmed">Confirmed / Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="text-xs text-gray-500 font-semibold self-end md:self-center">
                      Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Fulfillment Status</th>
                            <th className="px-4 py-3 text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                          {filteredOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-4 py-3 text-[#2874f0] font-mono font-bold">#SZ{o.id}</td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-gray-900">{o.user?.name || "Customer"}</div>
                                <div className="text-[10px] text-gray-400 font-normal">
                                  {o.user?.email || o.user?.mobile || ""}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {new Date(o.createdAt || o.created_at || Date.now()).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-3 font-bold text-gray-900">
                                ₹{o.total.toLocaleString("en-IN")}
                              </td>
                              <td className="px-4 py-3 text-[10px] font-bold text-gray-600 uppercase">
                                <span className="bg-gray-100 px-2 py-0.5 rounded">
                                  {o.paymentMethod || "COD"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  value={(o.status || o.orderStatus || "pending").toLowerCase()}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                  className={`rounded text-[10px] uppercase font-bold py-1 px-2 border border-transparent focus:border-gray-300 outline-none cursor-pointer ${
                                    (o.status || "").toLowerCase() === "delivered"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : (o.status || "").toLowerCase() === "shipped"
                                      ? "bg-blue-100 text-blue-800"
                                      : (o.status || "").toLowerCase() === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  <option value="confirmed">Confirmed</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => setSelectedOrderDetails(o)}
                                  className="text-gray-600 hover:text-[#2874f0] bg-gray-50 hover:bg-blue-50 p-1.5 rounded transition-colors cursor-pointer"
                                  title="View Order Breakdown"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {filteredOrders.length === 0 && (
                            <tr>
                              <td colSpan={7} className="text-center py-10 text-xs text-gray-400">
                                No orders matching the selected criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB: USERS */}
              {/* ========================================================================= */}
              {activeTab === "users" && (
                <div className="flex flex-col gap-5">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="Search users by name, email..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="w-full bg-gray-50 text-xs py-2 pl-8 pr-3 rounded border border-gray-200 outline-none focus:border-[#2874f0] transition-colors"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                      </div>

                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded text-xs py-2 px-2.5 outline-none font-medium"
                      >
                        <option value="all">All Roles ({users.length})</option>
                        <option value="admin">Administrators</option>
                        <option value="user">Standard Customers</option>
                      </select>
                    </div>

                    <div className="text-xs text-gray-500 font-semibold self-end md:self-center">
                      Showing {filteredUsers.length} accounts
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                            <th className="px-4 py-3">Account</th>
                            <th className="px-4 py-3">Contact</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">SuperCoins</th>
                            <th className="px-4 py-3">Orders</th>
                            <th className="px-4 py-3 text-right">Access Control</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-600 to-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                    {(u.name || "U")[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900">{u.name}</div>
                                    <div className="text-[10px] text-gray-400 font-mono">ID: #U{u.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-gray-700">{u.email}</div>
                                <div className="text-[10px] text-gray-400">{u.mobile || "No Mobile"}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                    u.role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-amber-600">
                                🪙 {u.superCoins || 0}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {u._count?.orders ?? orders.filter((o) => o.user?.email === u.email).length} orders
                              </td>
                              <td className="px-4 py-3 text-right">
                                {u.id === user.id ? (
                                  <span className="text-[10px] text-gray-400 italic">Current Session</span>
                                ) : (
                                  <button
                                    onClick={() => handleToggleUserRole(u.id, u.role, u.name)}
                                    className={`text-xs font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                                      u.role === "admin"
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-[#2874f0] hover:bg-blue-50"
                                    }`}
                                  >
                                    {u.role === "admin" ? "Demote to User" : "Make Admin"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                          {filteredUsers.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-10 text-xs text-gray-400">
                                No user accounts matching the search query.
                              </td>
                            </tr>
                          )}
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

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-black text-gray-900 text-sm">
                  {editingProduct ? "Update Product Catalog Item" : "Create New Product Listing"}
                </h3>
                <p className="text-[11px] text-gray-400">
                  Provide detailed specifications, pricing, and thumbnail assets
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex flex-col gap-4 text-xs font-semibold text-gray-700">
              {/* Product Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-800">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)"
                  className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0] transition-colors"
                />
              </div>

              {/* Brand & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-800">Brand Name</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="e.g. Samsung, Apple, Sony"
                    className="w-full bg-gray-50 py-2 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-800">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="w-full bg-gray-50 py-2 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Row: Price, MRP, Discount */}
              <div className="grid grid-cols-3 gap-3 bg-blue-50/40 p-3 rounded-lg border border-blue-100">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-800">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => handlePriceChange(e.target.value, productForm.mrp)}
                    placeholder="999"
                    className="w-full bg-white py-2 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-800">MRP (₹)</label>
                  <input
                    type="number"
                    value={productForm.mrp}
                    onChange={(e) => handlePriceChange(productForm.price, e.target.value)}
                    placeholder="1499"
                    className="w-full bg-white py-2 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-800">Discount (%)</label>
                  <input
                    type="number"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                    placeholder="33"
                    className="w-full bg-white py-2 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                  />
                </div>
              </div>

              {/* Section Tag */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-800">Homepage Showcase Section</label>
                <select
                  value={productForm.section}
                  onChange={(e) => setProductForm({ ...productForm, section: e.target.value })}
                  className="w-full bg-gray-50 py-2 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                >
                  <option value="deal">Deals of the Day (Countdown Widget)</option>
                  <option value="trending">Trending Now Carousel</option>
                  <option value="new">New Arrivals Feed</option>
                  <option value="regular">Regular Catalog Only</option>
                </select>
              </div>

              {/* Image URL & Presets */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-800">Product Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="Paste direct HTTPS image link"
                  className="w-full bg-gray-50 py-2 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                />

                {/* Quick Presets Picker */}
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  <span className="text-[10px] text-gray-400 font-semibold mr-1">Quick Sample Images:</span>
                  {SAMPLE_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: preset.url })}
                      className="text-[10px] bg-gray-100 hover:bg-blue-50 hover:text-[#2874f0] px-2 py-0.5 rounded cursor-pointer transition-colors border border-gray-200"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-800">Product Specifications & Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Enter detailed bullet points or specs..."
                  className="w-full bg-gray-50 py-2 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded font-bold cursor-pointer text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2874f0] hover:bg-blue-600 text-white font-bold rounded cursor-pointer transition-colors"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingCategory ? "Edit Category" : "New Category Classification"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 flex flex-col gap-4 text-xs font-semibold text-gray-700">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-800">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Gaming & VR"
                  className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-800">Emoji or Icon Identifier</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  placeholder="e.g. 🎮 or gamepad-2"
                  className="w-full bg-gray-50 py-2.5 px-3 rounded border border-gray-200 outline-none focus:border-[#2874f0]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded font-bold cursor-pointer text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2874f0] hover:bg-blue-600 text-white font-bold rounded cursor-pointer transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW FULL ORDER DETAILS */}
      {/* ========================================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-gray-50/50">
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                  Order Breakdown: <span className="font-mono text-[#2874f0]">#SZ{selectedOrderDetails.id}</span>
                </h3>
                <p className="text-[10px] text-gray-400">
                  Placed on {new Date(selectedOrderDetails.createdAt || selectedOrderDetails.created_at || Date.now()).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-gray-600">
              {/* Status Stepper Preview */}
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current Status</span>
                  <span className="text-sm font-black uppercase text-[#2874f0] mt-0.5">
                    {selectedOrderDetails.orderStatus || selectedOrderDetails.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <select
                    value={(selectedOrderDetails.status || selectedOrderDetails.orderStatus || "pending").toLowerCase()}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrderDetails.id, e.target.value)}
                    className="bg-white border border-gray-300 rounded font-bold text-xs py-1.5 px-2 outline-none cursor-pointer text-gray-800"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Profile & Delivery Address */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col gap-1.5 text-gray-700">
                <h4 className="font-bold text-gray-900 text-xs border-b border-gray-200 pb-1.5 mb-1">
                  Recipient & Fulfillment Info
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <span className="text-gray-400">Customer:</span>{" "}
                    <strong className="text-gray-900">{selectedOrderDetails.user?.name || "Guest Customer"}</strong>
                  </p>
                  <p>
                    <span className="text-gray-400">Phone:</span>{" "}
                    <span>{selectedOrderDetails.user?.mobile || "Not specified"}</span>
                  </p>
                  <p className="col-span-2">
                    <span className="text-gray-400">Email:</span>{" "}
                    <span>{selectedOrderDetails.user?.email || "N/A"}</span>
                  </p>
                  <p className="col-span-2">
                    <span className="text-gray-400">Address:</span>{" "}
                    <span>{selectedOrderDetails.address || "Standard User Address"}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Payment:</span>{" "}
                    <strong className="text-gray-800 uppercase">{selectedOrderDetails.paymentMethod || "COD"}</strong>
                  </p>
                  <p>
                    <span className="text-gray-400">Pay Status:</span>{" "}
                    <strong className="text-emerald-700 uppercase">{selectedOrderDetails.paymentStatus || "COMPLETED"}</strong>
                  </p>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-gray-900 text-xs">Ordered Products Breakdown</h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg p-2 bg-white">
                  {(selectedOrderDetails.items || []).map((item) => (
                    <div key={item.id} className="py-2.5 px-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                          {item.product?.image && (item.product.image.startsWith("http") || item.product.image.startsWith("/")) ? (
                            <img src={item.product.image} alt="" className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <span className="text-xl">{item.product?.image || "🛍️"}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 max-w-[220px] truncate">
                            {item.product?.name || item.productName || "Product"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Qty: {item.quantity || 1} × ₹{(item.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Balance */}
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Total Charged to Customer:</span>
                <span className="text-base font-black text-gray-900">
                  ₹{selectedOrderDetails.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-gray-100 flex justify-end shrink-0 bg-gray-50">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2 bg-[#2874f0] hover:bg-blue-600 text-white rounded text-xs font-bold cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
