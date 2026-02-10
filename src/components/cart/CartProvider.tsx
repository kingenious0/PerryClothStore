"use client";

import type { CartItem } from "@/lib/types";
import React, { createContext, useState, useEffect, useCallback } from "react";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
    try {
      const items = localStorage.getItem("cart");
      if (items) {
        setCartItems(JSON.parse(items));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (cartItems.length > 0) {
        localStorage.setItem("cart", JSON.stringify(cartItems));
      } else {
        localStorage.removeItem("cart");
      }
    }
  }, [cartItems, isHydrated]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
      );
      if (existingItem) {
        return prevItems.map((i) =>
          i.productId === item.productId && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevItems, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + (isNaN(item.quantity) ? 0 : item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
