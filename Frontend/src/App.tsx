import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import SellerHub from "./pages/SellerHub";
import AdminDashboard from "./pages/AdminDashboard";
import UserOrders from "./pages/UserOrders";
import LoginPage from "./pages/LoginPage";
import WishlistPage from "./pages/WishlistPage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AddressPage from "./pages/AddressPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProfilePage from "./pages/ProfilePage";
import MobileBottomNav from "./components/layout/MobileBottomNav";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col pb-14 sm:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage initialMode="login" />} />
          <Route path="/register" element={<LoginPage initialMode="signup" />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/seller" element={<SellerHub />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/account/orders" element={<UserOrders />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/addresses" element={<AddressPage />} />
          <Route path="/account/addresses" element={<AddressPage />} />
          <Route path="/category/:categoryId" element={<ProductListingPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
        </Routes>
        <MobileBottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;