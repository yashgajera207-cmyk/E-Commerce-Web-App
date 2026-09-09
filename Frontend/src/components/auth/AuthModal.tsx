import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

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

  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  // OTP state
  const [otpLoginMode, setOtpLoginMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [receivedOtp, setReceivedOtp] = useState<string | null>(null);

  // Errors and feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isModalOpen) return null;

  const resetFormState = () => {
    setEmailOrMobile("");
    setPassword("");
    setName("");
    setEmail("");
    setMobile("");
    setOtpLoginMode(false);
    setOtpSent(false);
    setOtpCode(false as any);
    setOtpCode("");
    setReceivedOtp(null);
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetFormState();
    closeLoginModal();
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrMobile || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(emailOrMobile, password);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!emailOrMobile && !mobile) {
      setError("Please enter a valid mobile number");
      return;
    }
    const phone = mobile || emailOrMobile;
    // Basic digit validation
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const code = await sendOtp(phone);
      setReceivedOtp(code);
      setOtpSent(true);
      setSuccess("OTP sent successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = mobile || emailOrMobile;
    if (!phone || !otpCode) {
      setError("Please enter the OTP");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await verifyOtp(phone, otpCode);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Invalid OTP entered");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !mobile || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(name, email, mobile, password);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans backdrop-blur-xs">
      {/* Modal Container */}
      <div className="relative flex w-full max-w-[650px] h-[528px] bg-white rounded-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Banner: Flipkart Blue */}
        <div className="w-[240px] bg-[#2874f0] p-9 hidden sm:flex flex-col justify-between text-white shrink-0">
          <div>
            <h2 className="text-[28px] font-semibold leading-tight mb-4">
              {modalMode === "login" ? "Login" : "Looks like you're new here!"}
            </h2>
            <p className="text-[15px] text-[#dbdbdb] leading-relaxed font-medium">
              {modalMode === "login"
                ? "Get access to your Orders, Wishlist and Recommendations"
                : "Sign up with your mobile number to get started"}
            </p>
          </div>
          <div className="text-center opacity-40 text-7xl select-none mb-4">
            🛍️
          </div>
        </div>

        {/* Right Section: Form Inputs */}
        <div className="flex-1 p-9 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Form Title (Mobile only) */}
            <h2 className="text-xl font-bold text-gray-900 sm:hidden mb-4">
              {modalMode === "login" ? "Login" : "Sign Up"}
            </h2>

            {/* Notification Messages */}
            {error && (
              <div className="bg-red-50 text-red-700 text-xs font-semibold px-3 py-2.5 rounded-sm mb-4 border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-2.5 rounded-sm mb-4 border border-green-100">
                {success}
              </div>
            )}

            {/* Test Helper Banner for OTP */}
            {otpSent && receivedOtp && (
              <div className="bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-2.5 rounded-sm mb-4 border border-amber-100">
                🔑 Test Verification Code: <span className="font-bold text-base text-brand-orange ml-1">{receivedOtp}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {modalMode === "login" && (
              <form onSubmit={otpLoginMode ? handleVerifyOtp : handlePasswordLogin} className="space-y-5">

                {/* Username Input */}
                <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors py-1">
                  <input
                    type="text"
                    required
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    placeholder={otpLoginMode ? "Enter 10-digit Mobile Number" : "Enter Email/Mobile number"}
                    className="w-full text-[14px] text-gray-800 outline-none bg-transparent placeholder:text-gray-400 py-1"
                  />
                </div>

                {/* Password / OTP Input */}
                {!otpLoginMode ? (
                  <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors py-1">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      className="w-full text-[14px] text-gray-800 outline-none bg-transparent placeholder:text-gray-400 py-1"
                    />
                  </div>
                ) : (
                  otpSent && (
                    <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors py-1">
                      <input
                        type="text"
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="w-full text-[14px] text-gray-800 outline-none bg-transparent placeholder:text-gray-400 py-1"
                      />
                    </div>
                  )
                )}

                {/* Disclaimer */}
                <p className="text-[12px] text-gray-500 leading-normal">
                  By continuing, you agree to ShipZone's{" "}
                  <a href="#" className="text-[#2874f0] hover:underline">Terms of Use</a> and{" "}
                  <a href="#" className="text-[#2874f0] hover:underline">Privacy Policy</a>.
                </p>

                {/* Submit Action buttons */}
                {otpLoginMode && !otpSent ? (
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full bg-[#fb641b] text-white hover:bg-[#e25410] font-semibold py-3 rounded-xs border-none shadow-xs mt-4"
                    onClick={handleRequestOtp}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Request OTP"}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full bg-[#fb641b] text-white hover:bg-[#e25410] font-semibold py-3 rounded-xs border-none shadow-xs mt-4"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : otpLoginMode ? "Verify & Log In" : "Login"}
                  </Button>
                )}
              </form>
            )}

            {/* SIGNUP FORM */}
            {modalMode === "signup" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors py-0.5">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Full Name"
                    className="w-full text-[14px] text-gray-800 outline-none bg-transparent placeholder:text-gray-400 py-1"
                  />
                </div>
                <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors py-0.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email Address"
                    className="w-full text-[14px] text-gray-800 outline-none bg-transparent placeholder:text-gray-400 py-1"
                  />
                </div>
                <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors py-0.5">
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter Mobile Number"
                    className="w-full text-[14px] text-gray-800 outline-none bg-transparent placeholder:text-gray-400 py-1"
                  />
                </div>
                <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] transition-colors py-0.5">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password"
                    className="w-full text-[14px] text-gray-800 outline-none bg-transparent placeholder:text-gray-400 py-1"
                  />
                </div>

                <p className="text-[12px] text-gray-500 leading-normal mt-2">
                  By continuing, you agree to ShipZone's{" "}
                  <a href="#" className="text-[#2874f0] hover:underline">Terms of Use</a> and{" "}
                  <a href="#" className="text-[#2874f0] hover:underline">Privacy Policy</a>.
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full bg-[#fb641b] text-white hover:bg-[#e25410] font-semibold py-3 rounded-xs border-none shadow-xs mt-4"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Sign Up"}
                </Button>
              </form>
            )}
          </div>

          {/* Bottom Switch Links */}
          <div className="mt-6 flex flex-col items-center gap-4 text-center">
            {modalMode === "login" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setOtpLoginMode(!otpLoginMode);
                    setError(null);
                    setSuccess(null);
                    setOtpSent(false);
                    setReceivedOtp(null);
                  }}
                  className="text-sm font-semibold text-[#2874f0] hover:underline cursor-pointer"
                >
                  {otpLoginMode ? "Use Username & Password" : "Login with OTP"}
                </button>

                <button
                  onClick={() => {
                    openLoginModal("signup");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-sm font-semibold text-[#2874f0] hover:underline cursor-pointer mt-4"
                >
                  New to ShipZone? Create an account
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  openLoginModal("login");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-sm font-semibold text-[#2874f0] hover:underline cursor-pointer"
              >
                Existing User? Log in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
