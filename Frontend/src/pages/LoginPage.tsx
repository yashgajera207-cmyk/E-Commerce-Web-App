import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button, Input, Alert, Card, Spinner } from "../components/common";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  initialMode?: "login" | "signup";
}

export default function LoginPage({ initialMode = "login" }: LoginPageProps) {
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get("mode") === "signup" ? "signup" : initialMode;
  const [mode, setMode] = useState<"login" | "signup">(urlMode);

  const { login, register, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  // Login: SINGLE input field for either Email OR Mobile (not both)
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [loginWithPassword, setLoginWithPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Registration: BOTH fields required (name, mobile, email, password)
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regShowPassword, setRegShowPassword] = useState(false);

  // Real-time Validity Checking States
  const [emailValidating, setEmailValidating] = useState(false);
  const [emailValidStatus, setEmailValidStatus] = useState<"idle" | "valid" | "invalid" | "unknown">("idle");
  const [emailValidMsg, setEmailValidMsg] = useState<string | null>(null);

  const [phoneValidating, setPhoneValidating] = useState(false);
  const [phoneValidStatus, setPhoneValidStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [phoneValidMsg, setPhoneValidMsg] = useState<string | null>(null);

  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkEmailValidity = async (emailToCheck: string) => {
    const trimmed = emailToCheck.trim();
    if (!trimmed) {
      setEmailValidStatus("idle");
      setEmailValidMsg(null);
      return;
    }

    setEmailValidating(true);
    try {
      const res = await fetch("http://localhost:5000/api/validate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (data.status === "valid") {
        setEmailValidStatus("valid");
        setEmailValidMsg("✓ Email appears valid");
      } else if (data.status === "invalid") {
        setEmailValidStatus("invalid");
        setEmailValidMsg("✗ Email could not be validated");
      } else {
        setEmailValidStatus("unknown");
        setEmailValidMsg("~ Email deliverability could not be confirmed");
      }
    } catch {
      setEmailValidStatus("idle");
      setEmailValidMsg(null);
    } finally {
      setEmailValidating(false);
    }
  };

  const checkPhoneValidity = async (phoneToCheck: string) => {
    const trimmed = phoneToCheck.trim();
    if (!trimmed) {
      setPhoneValidStatus("idle");
      setPhoneValidMsg(null);
      return;
    }

    setPhoneValidating(true);
    try {
      const res = await fetch("http://localhost:5000/api/validate/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: trimmed }),
      });
      const data = await res.json();
      if (data.valid && data.status === "valid") {
        setPhoneValidStatus("valid");
        setPhoneValidMsg("✓ Phone number is valid");
      } else {
        setPhoneValidStatus("invalid");
        setPhoneValidMsg("✗ Phone number is invalid");
      }
    } catch {
      setPhoneValidStatus("idle");
      setPhoneValidMsg(null);
    } finally {
      setPhoneValidating(false);
    }
  };

  // LOGIN: REQUEST OTP (WORKS FOR REGISTERED MOBILE OR EMAIL)
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanInput = emailOrMobile.trim();

    if (!cleanInput) {
      setError("Please enter your registered mobile number or email ID.");
      return;
    }

    // Format validation
    if (cleanInput.includes("@")) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(cleanInput)) {
        setError("Email is not valid. Please enter a valid email address.");
        return;
      }
    } else {
      const cleanDigits = cleanInput.replace(/^(\+91|0)/, "").replace(/\D/g, "");
      if (cleanDigits.length !== 10 || !/^[6-9]\d{9}$/.test(cleanDigits)) {
        setError("Mobile number is not valid. Please enter a valid 10-digit mobile number.");
        return;
      }
    }

    setError(null);
    setLoading(true);
    try {
      const res = await sendOtp(cleanInput);
      setOtpSent(true);
      const destinationText = res.type === "email" ? `email (${res.destination})` : `mobile (+91 ${res.destination})`;
      setSuccess(`OTP has been sent to your registered ${destinationText}. Please check your ${res.type === "email" ? "inbox or spam folder" : "messages"}.`);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please check if this email/number is registered.");
    } finally {
      setLoading(false);
    }
  };

  // LOGIN: VERIFY OTP (WORKS FOR BOTH MOBILE AND EMAIL)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = emailOrMobile.trim();
    if (!cleanInput || !otpCode.trim()) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await verifyOtp(cleanInput, otpCode.trim());
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // LOGIN: PASSWORD AUTHENTICATION WITH JWT
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = emailOrMobile.trim();
    if (!cleanInput || !password) {
      setError("Please enter your email/mobile and password.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await login(cleanInput, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // REGISTRATION: BOTH EMAIL AND MOBILE ARE MANDATORY & VALIDATED
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regMobile.trim() || !regPassword) {
      setError("All fields (Full Name, Mobile Number, Email ID, and Password) are required.");
      return;
    }

    // Client-side quick syntax check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(regEmail.trim())) {
      setError("Email is not valid. Please enter a valid email address.");
      setEmailValidStatus("invalid");
      setEmailValidMsg("✗ Email could not be validated");
      return;
    }

    if (regPassword.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // 1. Authoritative backend phone validation
      const phoneRes = await fetch("http://localhost:5000/api/validate/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: regMobile.trim() }),
      });
      const phoneData = await phoneRes.json();
      if (!phoneData.valid || phoneData.status === "invalid") {
        setError("Phone number is invalid. Please enter a valid telephone number.");
        setPhoneValidStatus("invalid");
        setPhoneValidMsg("✗ Phone number is invalid");
        setLoading(false);
        return;
      }
      setPhoneValidStatus("valid");
      setPhoneValidMsg("✓ Phone number is valid");

      // 2. Authoritative backend email validation
      const emailRes = await fetch("http://localhost:5000/api/validate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail.trim() }),
      });
      const emailData = await emailRes.json();
      if (emailData.status === "invalid") {
        setError("Email could not be validated. Please enter a valid email address.");
        setEmailValidStatus("invalid");
        setEmailValidMsg("✗ Email could not be validated");
        setLoading(false);
        return;
      }
      if (emailData.status === "valid") {
        setEmailValidStatus("valid");
        setEmailValidMsg("✓ Email appears valid");
      }

      await register(regName.trim(), regEmail.trim(), regMobile.trim(), regPassword);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Account may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f6] font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 flex items-center justify-center">
        {/* Authentic ShopZone Card */}
        <Card className="w-full overflow-hidden flex flex-col md:flex-row min-h-[528px] border-none shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
          
          {/* LEFT PANE: Classic ShopZone Solid Blue Banner */}
          <div className="w-full md:w-[320px] bg-[#2874f0] text-white p-9 flex flex-col justify-between shrink-0">
            <div>
              <h1 className="text-[28px] font-semibold tracking-tight text-white mb-3 leading-tight">
                {mode === "login" ? "Login" : "Looks like you're new here!"}
              </h1>
              <p className="text-[15px] text-[#dbdbdb] leading-relaxed font-normal">
                {mode === "login"
                  ? "Get access to your Orders, Wishlist and Recommendations"
                  : "Sign up with your mobile number and email to get started"}
              </p>
            </div>

            {/* ShopZone Bottom Graphic */}
            <div className="text-center opacity-30 text-7xl select-none pt-8 pb-2">
              🛍️
            </div>
          </div>

          {/* RIGHT PANE: ShopZone Clean Form */}
          <div className="flex-1 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              
              {/* Feedback Alerts */}
              {error && (
                <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              {/* ======================================================== */}
              {/* LOGIN FORM: Enter Email OR Mobile number (Single Field)  */}
              {/* ======================================================== */}
              {mode === "login" && (
                <div>
                  {!otpSent ? (
                    <form onSubmit={loginWithPassword ? handlePasswordLogin : handleRequestOtp} className="space-y-6">
                      
                      {/* Single Input: Enter Email/Mobile number */}
                      <Input
                        id="loginIdentifier"
                        type="text"
                        required
                        floatingLabel
                        label="Enter Email/Mobile number"
                        value={emailOrMobile}
                        onChange={(e) => setEmailOrMobile(e.target.value)}
                      />

                      {/* Password Field (when in password login mode) */}
                      {loginWithPassword && (
                        <Input
                          id="loginPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          floatingLabel
                          label="Enter Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          endAdornment={
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-gray-400 hover:text-gray-700 cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />
                      )}

                      {/* Terms of Use Disclaimer */}
                      <p className="text-[12px] text-gray-500 leading-normal">
                        By continuing, you agree to ShopZone's{" "}
                        <a href="#" className="text-[#2874f0] hover:underline">Terms of Use</a> and{" "}
                        <a href="#" className="text-[#2874f0] hover:underline">Privacy Policy</a>.
                      </p>

                      {/* Primary CTA Button */}
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="md"
                        isLoading={loading}
                        loadingText="Please wait..."
                        className="py-3"
                      >
                        {loginWithPassword ? "Login" : "Request OTP"}
                      </Button>

                      {/* Secondary Switch (Password vs OTP) */}
                      <div className="pt-1">
                        {loginWithPassword ? (
                          <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            size="md"
                            onClick={() => {
                              setLoginWithPassword(false);
                              setError(null);
                            }}
                            className="text-[#2874f0] hover:text-[#1260e0]"
                          >
                            Request OTP
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            size="md"
                            onClick={() => {
                              setLoginWithPassword(true);
                              setError(null);
                            }}
                            className="text-[#2874f0] hover:text-[#1260e0]"
                          >
                            Use Password
                          </Button>
                        )}
                      </div>

                    </form>
                  ) : (
                    /* OTP Verification View */
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="text-sm text-gray-700">
                        Please enter the OTP sent to{" "}
                        <span className="font-bold text-gray-900">
                          {emailOrMobile.includes("@") ? emailOrMobile.trim() : `+91 ${emailOrMobile.trim()}`}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpCode("");
                            setError(null);
                          }}
                          className="text-[#2874f0] font-semibold text-xs ml-1 py-0 hover:underline inline"
                        >
                          Change
                        </Button>
                      </div>

                      {/* OTP Input */}
                      <div className="relative pt-3">
                        <input
                          id="otpInput"
                          type="text"
                          maxLength={6}
                          required
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="w-full text-center text-xl font-bold tracking-widest text-gray-900 border-b border-gray-300 focus:border-[#2874f0] pb-2 outline-none bg-transparent transition-colors"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Didn't receive the OTP?</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRequestOtp()}
                          className="text-[#2874f0] font-bold p-0 hover:underline"
                        >
                          Resend OTP
                        </Button>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="md"
                        isLoading={loading}
                        loadingText="Verifying..."
                        className="py-3"
                      >
                        Verify
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* REGISTER FORM: BOTH Email AND Mobile required            */}
              {/* ======================================================== */}
              {mode === "signup" && (
                <form onSubmit={handleRegister} className="space-y-5">
                  
                  {/* Full Name */}
                  <Input
                    id="regName"
                    type="text"
                    required
                    floatingLabel
                    label="Enter Full Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />

                  {/* Mobile Number */}
                  <div>
                    <Input
                      id="regMobile"
                      type="tel"
                      required
                      floatingLabel
                      label="Mobile Number (e.g. +91 9876543210)"
                      value={regMobile}
                      onChange={(e) => {
                        setRegMobile(e.target.value);
                        if (phoneValidStatus !== "idle") {
                          setPhoneValidStatus("idle");
                          setPhoneValidMsg(null);
                        }
                      }}
                      onBlur={() => checkPhoneValidity(regMobile)}
                    />
                    {phoneValidating && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                        <Spinner size="sm" color="blue" /> Checking phone number validity...
                      </div>
                    )}
                    {!phoneValidating && phoneValidMsg && (
                      <div
                        className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
                          phoneValidStatus === "valid" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {phoneValidMsg}
                      </div>
                    )}
                  </div>

                  {/* Email ID */}
                  <div>
                    <Input
                      id="regEmail"
                      type="email"
                      required
                      floatingLabel
                      label="Email (e.g. user@example.com)"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (emailValidStatus !== "idle") {
                          setEmailValidStatus("idle");
                          setEmailValidMsg(null);
                        }
                      }}
                      onBlur={() => checkEmailValidity(regEmail)}
                    />
                    {emailValidating && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                        <Spinner size="sm" color="blue" /> Checking email deliverability...
                      </div>
                    )}
                    {!emailValidating && emailValidMsg && (
                      <div
                        className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
                          emailValidStatus === "valid"
                            ? "text-emerald-600"
                            : emailValidStatus === "invalid"
                            ? "text-red-600"
                            : "text-amber-600"
                        }`}
                      >
                        {emailValidMsg}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <Input
                    id="regPassword"
                    type={regShowPassword ? "text" : "password"}
                    required
                    floatingLabel
                    label="Create Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    endAdornment={
                      <button
                        type="button"
                        onClick={() => setRegShowPassword(!regShowPassword)}
                        className="text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        {regShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  {/* Disclaimer */}
                  <p className="text-[12px] text-gray-500 leading-normal">
                    By continuing, you agree to ShopZone's{" "}
                    <a href="#" className="text-[#2874f0] hover:underline">Terms of Use</a> and{" "}
                    <a href="#" className="text-[#2874f0] hover:underline">Privacy Policy</a>.
                  </p>

                  {/* Primary Continue Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="md"
                    isLoading={loading}
                    loadingText="Creating Account..."
                    className="py-3"
                  >
                    CONTINUE
                  </Button>

                  {/* Existing user switch */}
                  <div className="pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      size="md"
                      onClick={() => {
                        setMode("login");
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-[#2874f0] hover:text-[#1260e0]"
                    >
                      Existing User? Log in
                    </Button>
                  </div>

                </form>
              )}

            </div>

            {/* Bottom Footer Switch Link */}
            <div className="pt-6 text-center">
              {mode === "login" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-sm font-semibold text-[#2874f0] hover:underline p-0"
                >
                  New to ShopZone? Create an account
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-sm font-semibold text-[#2874f0] hover:underline p-0"
                >
                  Already have an account? Sign in
                </Button>
              )}
            </div>

          </div>

        </Card>
      </main>

      <Footer />
    </div>
  );
}
