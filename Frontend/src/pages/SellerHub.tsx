import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import { ShieldCheck, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function SellerHub() {
  const { user, becomeSeller } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSelling = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await becomeSeller();
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to promote account to seller");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Register/Login your Account",
      desc: "Sign up on ShopZone with your email address and mobile number.",
    },
    {
      id: 2,
      title: "Activate Seller Hub",
      desc: "Promote your account role with one click to unlock administrative control.",
    },
    {
      id: 3,
      title: "Manage Inventory & Orders",
      desc: "Add your catalog products, control categories, and ship customer orders.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f6] font-sans">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-[#172337] text-white py-16 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl flex flex-col gap-4">
              <span className="bg-[#ffe500] text-gray-900 text-xs font-bold px-3 py-1 rounded-sm w-fit uppercase tracking-wider">
                Seller Hub
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Sell online to crores of customers on ShopZone
              </h1>
              <p className="text-gray-300 text-base md:text-lg">
                Become a seller or administrator today and manage products, track real-time orders, and oversee user roles.
              </p>
              {error && (
                <div className="bg-red-500/20 text-red-300 text-sm font-semibold p-3 rounded-sm border border-red-500/40">
                  {error}
                </div>
              )}
            </div>

            {/* Registration Box */}
            <div className="w-full max-w-sm bg-white rounded-sm p-6 shadow-xl text-gray-800 flex flex-col gap-5">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                Create Seller Account
              </h2>
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Logged In As</p>
                    <p className="font-semibold text-gray-800 text-sm mt-0.5">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Current Role: <span className="font-semibold text-[#2874f0] capitalize">{user.role}</span></p>
                  </div>
                  {user.role === "admin" ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> You are already a registered seller/admin.
                      </p>
                      <Button onClick={() => navigate("/admin")} className="w-full py-3">
                        Go to Admin Dashboard
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleStartSelling} disabled={loading} className="w-full py-3 font-semibold">
                      {loading ? "Activating..." : "Start Selling / Activate Admin"}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-gray-600">
                    You need to log in or create a customer account before promoting yourself to a seller.
                  </p>
                  <Link to="/login" className="w-full">
                    <Button className="w-full py-3">
                      Login / Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-5xl mx-auto py-16 px-4 flex flex-col gap-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
            Why Sell on ShopZone?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-sm shadow-xs border border-gray-100 flex flex-col items-center text-center gap-3">
              <div className="bg-blue-50 p-4 rounded-full text-[#2874f0]">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Crores of Customers</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Reach active buyers across the nation, listing products in electronics, fashion, beauty, home and more.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm shadow-xs border border-gray-100 flex flex-col items-center text-center gap-3">
              <div className="bg-blue-50 p-4 rounded-full text-[#2874f0]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Secure & Simple</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Enjoy transparent processing. Change rates, set discounts, and ship items with total administrative security.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm shadow-xs border border-gray-100 flex flex-col items-center text-center gap-3">
              <div className="bg-blue-50 p-4 rounded-full text-[#2874f0]">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Full Analytics Suite</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Oversee customer registrations, manage user permissions, and track daily sales trend graphs effortlessly.
              </p>
            </div>
          </div>

          {/* Steps section */}
          <div className="bg-[#2874f0]/5 rounded-md p-8 md:p-12 border border-[#2874f0]/10 flex flex-col gap-8 mt-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
              How does it work?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col gap-3 items-center text-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#2874f0] text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {step.id}
                  </div>
                  <h4 className="font-bold text-gray-800 text-base mt-2">{step.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
