import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

export interface User {
  id: number | string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  superCoins?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isModalOpen: boolean;
  modalMode: "login" | "signup";
  login: (emailOrMobile: string, password?: string) => Promise<void>;
  register: (name: string, email: string, mobile: string, password?: string) => Promise<void>;
  sendOtp: (identifier: string) => Promise<{ message: string; otp: string; type: "email" | "mobile"; destination: string; exists: boolean }>;
  verifyOtp: (identifier: string, otp: string) => Promise<void>;
  checkIdentifier: (identifier: string) => Promise<{ valid: boolean; exists: boolean; type?: "email" | "mobile"; value?: string; message: string }>;
  logout: () => void;
  openLoginModal: (mode?: "login" | "signup") => void;
  closeLoginModal: () => void;
  refreshUser: () => Promise<void>;
  becomeSeller: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("shopzone_user") || localStorage.getItem("flipkart_user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("shopzone_token") || localStorage.getItem("flipkart_token");
  });

  const isModalOpen = false;
  const modalMode: "login" | "signup" = "login";

  // Save session state to localStorage
  const saveSession = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("shopzone_token", newToken);
    localStorage.setItem("shopzone_user", JSON.stringify(newUser));
    localStorage.removeItem("flipkart_token");
    localStorage.removeItem("flipkart_user");
  };

  // Clear session
  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("shopzone_token");
    localStorage.removeItem("shopzone_user");
    localStorage.removeItem("flipkart_token");
    localStorage.removeItem("flipkart_user");
  };

  // Validate and refresh user session with JWT token on mount
  const refreshUser = useCallback(async () => {
    const currentToken = token || localStorage.getItem("shopzone_token") || localStorage.getItem("flipkart_token");
    if (!currentToken) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("shopzone_user", JSON.stringify(data.user));
        }
      } else if (res.status === 401) {
        // Token expired or invalid
        clearSession();
      }
    } catch (err) {
      console.warn("Could not verify session with backend:", err);
    }
  }, [token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // LOGIN WITH PASSWORD OR IDENTIFIER
  const login = async (emailOrMobile: string, password?: string) => {
    const isEmail = emailOrMobile.includes("@");
    const body = isEmail
      ? { email: emailOrMobile.trim(), password }
      : { mobile: emailOrMobile.trim(), password };

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed. Please check credentials.");
    }

    saveSession(data.token, data.user);
  };

  // REGISTER USER
  const register = async (name: string, email: string, mobile: string, password?: string) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed. Please try again.");
    }

    saveSession(data.token, data.user);
  };

  // SEND OTP (WORKS FOR BOTH EMAIL AND MOBILE)
  const sendOtp = async (identifier: string) => {
    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: identifier.trim() }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to send OTP.");
    }
    return data;
  };

  // VERIFY OTP (WORKS FOR BOTH EMAIL AND MOBILE)
  const verifyOtp = async (identifier: string, otp: string) => {
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: identifier.trim(), otp: otp.trim() }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Invalid or expired OTP.");
    }

    saveSession(data.token, data.user);
  };

  // CHECK IDENTIFIER (EMAIL OR MOBILE VALIDITY & EXISTENCE)
  const checkIdentifier = async (identifier: string) => {
    const res = await fetch("http://localhost:5000/api/auth/check-identifier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: identifier.trim() }),
    });

    return await res.json();
  };

  const logout = () => {
    clearSession();
  };

  const openLoginModal = (mode: "login" | "signup" = "login") => {
    window.location.href = mode === "signup" ? "/register" : "/login";
  };

  const closeLoginModal = () => {
    // no-op
  };

  const becomeSeller = async () => {
    const currentToken = token || localStorage.getItem("shopzone_token") || localStorage.getItem("flipkart_token");
    if (!currentToken) throw new Error("Authentication required");

    const res = await fetch("http://localhost:5000/api/auth/become-seller", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) saveSession(data.token || currentToken, data.user);
    } else {
      // Fallback local update
      const updatedUser = user ? { ...user, role: "admin" } : null;
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("shopzone_user", JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isModalOpen,
        modalMode,
        login,
        register,
        sendOtp,
        verifyOtp,
        checkIdentifier,
        logout,
        openLoginModal,
        closeLoginModal,
        refreshUser,
        becomeSeller,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
