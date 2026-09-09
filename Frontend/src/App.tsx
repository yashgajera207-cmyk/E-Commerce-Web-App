import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import SellerHub from "./pages/SellerHub";
import AdminDashboard from "./pages/AdminDashboard";
import UserOrders from "./pages/UserOrders";
import AuthModal from "./components/auth/AuthModal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/seller" element={<SellerHub />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/orders" element={<UserOrders />} />
      </Routes>
      <AuthModal />
    </BrowserRouter>
  );
}

export default App;