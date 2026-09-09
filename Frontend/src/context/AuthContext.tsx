import React, { createContext, useState, useContext } from "react";

export interface User {
  id: number | string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isModalOpen: boolean;
  modalMode: "login" | "signup";
  login: (emailOrMobile: string, password?: string) => Promise<void>;
  register: (name: string, email: string, mobile: string, password?: string) => Promise<void>;
  sendOtp: (mobile: string) => Promise<string>;
  verifyOtp: (mobile: string, otp: string) => Promise<void>;
  logout: () => void;
  openLoginModal: (mode?: "login" | "signup") => void;
  closeLoginModal: () => void;
  becomeSeller: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("shopzone_user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("shopzone_token");
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup">("login");

  const login = async (emailOrMobile: string, password?: string) => {
    const isEmail = emailOrMobile.includes("@");
    const body = isEmail 
      ? { email: emailOrMobile, password } 
      : { mobile: emailOrMobile, password };

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("shopzone_token", data.token);
    localStorage.setItem("shopzone_user", JSON.stringify(data.user));
    setIsModalOpen(false);
  };

  const register = async (name: string, email: string, mobile: string, password?: string) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, mobile, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("shopzone_token", data.token);
    localStorage.setItem("shopzone_user", JSON.stringify(data.user));
    setIsModalOpen(false);
  };

  const sendOtp = async (mobile: string): Promise<string> => {
    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }
    return data.otp; // Return the generated OTP so frontend can show it
  };

  const verifyOtp = async (mobile: string, otp: string) => {
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "OTP verification failed");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("shopzone_token", data.token);
    localStorage.setItem("shopzone_user", JSON.stringify(data.user));
    setIsModalOpen(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("shopzone_token");
    localStorage.removeItem("shopzone_user");
  };

  const openLoginModal = (mode: "login" | "signup" = "login") => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsModalOpen(false);
  };

  const becomeSeller = async () => {
    if (!token) throw new Error("Authentication required");

    const res = await fetch("http://localhost:5000/api/auth/become-seller", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to register as seller");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("shopzone_token", data.token);
    localStorage.setItem("shopzone_user", JSON.stringify(data.user));
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
        logout,
        openLoginModal,
        closeLoginModal,
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
