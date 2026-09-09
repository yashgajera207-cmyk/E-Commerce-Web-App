import React, { createContext, useState, useEffect, useContext } from "react";
import type { CartItem, Product } from "../types";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cartItems: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string | number) => boolean;
  placeOrder: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { token, openLoginModal } = useAuth();

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("shopzone_cart");
    const storedWishlist = localStorage.getItem("shopzone_wishlist");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.product.id) === String(product.id));
      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          String(item.product.id) === String(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prev, { product, quantity: 1 }];
      }
      localStorage.setItem("shopzone_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCartItems((prev) => {
      const newCart = prev.filter((item) => String(item.product.id) !== String(productId));
      localStorage.setItem("shopzone_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productId: string | number, delta: number) => {
    setCartItems((prev) => {
      const newCart = prev.map((item) =>
        String(item.product.id) === String(productId)
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );
      localStorage.setItem("shopzone_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("shopzone_cart");
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => String(p.id) === String(product.id));
      let newWishlist;
      if (exists) {
        newWishlist = prev.filter((p) => String(p.id) !== String(product.id));
      } else {
        newWishlist = [...prev, product];
      }
      localStorage.setItem("shopzone_wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isInWishlist = (productId: string | number) => {
    return wishlist.some((p) => String(p.id) === String(productId));
  };

  const placeOrder = async () => {
    if (!token) {
      openLoginModal();
      throw new Error("Login required to place order");
    }

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cartItems,
        total,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to place order");
    }

    clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
