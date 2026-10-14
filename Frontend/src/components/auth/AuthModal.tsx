import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  Smartphone,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Coins,
  Package,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AuthModal() {
  const {
    isModalOpen,
    modalMode,
    login,
    register,
    sendOtp,
    verifyOtp,
    closeLoginModal,
    openLoginModal,
  } = useAuth();

  // Form Fields
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  // OTP State
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Status & Feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isModalOpen) return null;

  const resetForm = () => {
    setEmailOrMobile("");
    setPassword("");
    setShowPassword(false);
    setName("");
    setEmail("");
    setMobile("");
    setIsOtpMode(false);
    setOtpSent(false);
    setOtpCode("");
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    closeLoginModal();
  };

  // PASSWORD LOGIN
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrMobile.trim() || !password) {
      setError("Please enter your email/mobile and password.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await login(emailOrMobile.trim(), password);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // REQUEST MOBILE OTP
  const handleRequestOtp = async () => {
    const phone = (mobile || emailOrMobile).trim();
    if (!phone || !/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await sendOtp(phone);
      setOtpSent(true);
      setSuccess(res.message || `OTP sent to +91 ${phone}`);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP LOGIN
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = (mobile || emailOrMobile).trim();
    if (!phone || !otpCode.trim()) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await verifyOtp(phone, otpCode.trim());
      handleClose();
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // REGISTER NEW ACCOUNT
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !mobile.trim() || !password) {
      setError("All fields are required for registration.");
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), mobile.trim(), password);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Registration failed. An account may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative flex w-full max-w-[780px] min-h-[520px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT PANE: Authentic ShopZone Branding & Value Props */}
        <div className="w-[300px] bg-gradient-to-br from-[#2874f0] via-[#1f65d6] to-[#184ea8] p-8 hidden md:flex flex-col justify-between text-white shrink-0 relative overflow-hidden">
          
          {/* Ambient decorative glowing circle */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-yellow-400/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-6">
              <span className="italic font-black text-2xl tracking-tight text-white">
                ShopZone
              </span>
              <span className="italic text-xs font-bold text-[#ffe500] ml-1 flex items-center gap-0.5">
                Plus <span className="text-sm">✦</span>
              </span>
            </div>

            <h2 className="text-2xl font-extrabold leading-tight text-white mb-2">
              {modalMode === "login"
                ? isOtpMode
                  ? "Login with OTP"
                  : "Login"
                : "Looks like you're new here!"}
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              {modalMode === "login"
                ? "Get access to your Orders, Wishlist and Personalized Recommendations"
                : "Sign up with your mobile number to get started"}
            </p>
          </div>

          {/* Middle Value Props */}
          <div className="relative z-10 space-y-3.5 my-6">
            <div className="flex items-center gap-2.5 text-xs text-blue-100 font-medium">
              <Package className="w-4 h-4 text-[#ffe500] shrink-0" />
              <span>Track orders in real-time</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-blue-100 font-medium">
              <Coins className="w-4 h-4 text-[#ffe500] shrink-0" />
              <span>Earn 50 SuperCoins on signup</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-blue-100 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#ffe500] shrink-0" />
              <span>100% Safe & Secure Payments</span>
            </div>
          </div>

          {/* Bottom Bag Emblem */}
          <div className="relative z-10 flex items-center justify-center opacity-30 select-none">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl">
              🛍️
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Modern Interactive Form */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Top Mode Tabs */}
            <div className="flex items-center border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  openLoginModal("login");
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 pb-3 text-sm font-bold transition-colors relative cursor-pointer ${
                  modalMode === "login"
                    ? "text-[#2874f0]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Sign In
                {modalMode === "login" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#2874f0] rounded-full" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  openLoginModal("signup");
                  setError(null);
                  setSuccess(null);
                }}
                className={`flex-1 pb-3 text-sm font-bold transition-colors relative cursor-pointer ${
                  modalMode === "signup"
                    ? "text-[#2874f0]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Create Account
                {modalMode === "signup" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#2874f0] rounded-full" />
                )}
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-lg mb-4 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-3 rounded-lg mb-4 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {modalMode === "login" && (
              <form onSubmit={isOtpMode ? handleVerifyOtp : handlePasswordLogin} className="space-y-4">
                
                {/* Identifier Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isOtpMode ? "Mobile Number" : "Email or Mobile Number"}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                      {isOtpMode || /^\d+$/.test(emailOrMobile) ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={emailOrMobile}
                      onChange={(e) => setEmailOrMobile(e.target.value)}
                      placeholder={isOtpMode ? "Enter 10-digit mobile number" : "Enter Email or Mobile"}
                      className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/15 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Input (in Password Mode) */}
                {!isOtpMode && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOtpMode(true);
                          setError(null);
                        }}
                        className="text-xs font-bold text-[#2874f0] hover:underline"
                      >
                        Forgot? Use OTP
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-9 pr-10 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/15 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* OTP Input (in OTP Mode) */}
                {isOtpMode && otpSent && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Verification OTP</label>
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="text-xs font-bold text-[#2874f0] hover:underline"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-3 py-2.5 text-center tracking-widest text-lg font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/15 outline-none transition-all"
                    />
                  </div>
                )}

                {/* Terms Disclaimer */}
                <p className="text-[11px] text-gray-500 leading-normal pt-1">
                  By continuing, you agree to ShopZone's{" "}
                  <a href="#" className="text-[#2874f0] hover:underline font-medium">Terms of Use</a> and{" "}
                  <a href="#" className="text-[#2874f0] hover:underline font-medium">Privacy Policy</a>.
                </p>

                {/* Submit Action */}
                {isOtpMode && !otpSent ? (
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={loading}
                    className="w-full bg-[#fb641b] hover:bg-[#e8550f] text-white font-bold py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    {loading ? "Sending OTP..." : "Request OTP"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#fb641b] hover:bg-[#e8550f] text-white font-bold py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    {loading
                      ? "Verifying..."
                      : isOtpMode
                      ? "Verify & Sign In"
                      : "Sign In"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Alternate Login Toggle */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpMode(!isOtpMode);
                      setError(null);
                      setSuccess(null);
                      setOtpSent(false);
                    }}
                    className="text-xs font-bold text-[#2874f0] hover:underline cursor-pointer"
                  >
                    {isOtpMode ? "Sign In with Password instead" : "Sign In with Mobile OTP instead"}
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {modalMode === "signup" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Yash Gajera"
                      className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/15 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/15 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e  ) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/15 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Create Password</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 4 characters"
                      className="w-full pl-9 pr-10 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/15 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms Disclaimer */}
                <p className="text-[11px] text-gray-500 leading-normal pt-1">
                  By continuing, you agree to ShopZone's{" "}
                  <a href="#" className="text-[#2874f0] hover:underline font-medium">Terms of Use</a> and{" "}
                  <a href="#" className="text-[#2874f0] hover:underline font-medium">Privacy Policy</a>.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#fb641b] hover:bg-[#e8550f] text-white font-bold py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-2"
                >
                  {loading ? "Creating Account..." : "Create Account & Get 50 SuperCoins"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            {modalMode === "login" ? (
              <p>
                New to ShopZone?{" "}
                <button
                  type="button"
                  onClick={() => {
                    openLoginModal("signup");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-[#2874f0] font-bold hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Existing User?{" "}
                <button
                  type="button"
                  onClick={() => {
                    openLoginModal("login");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-[#2874f0] font-bold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
