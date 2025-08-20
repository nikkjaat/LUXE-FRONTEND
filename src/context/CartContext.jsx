import React, { createContext, useContext, useEffect, useState } from "react";
import apiService from "../services/api";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const getCartItems = async () => {
    try {
      const response = await apiService.getCartItems();
      // console.log(response);
      setItems(response || []);
    } catch (error) {
      console.error("Failed to load cart items", error);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCartItems();
    }
  }, [localStorage.getItem("token")]);

  const addToCart = async (item) => {
    try {
      const response = await apiService.addToCart(item);
      if (response.success) {
        getCartItems();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const response = await apiService.removeFromCart(id);
      if (response.success) {
        getCartItems();
      }
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    const response = await apiService.updateQuantity(id, quantity);
    if (!response.success) {
      console.error("Failed to update quantity", response.message);
      return;
    }
    getCartItems();
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
