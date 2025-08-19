import React, { createContext, useContext, useState } from "react";
import apiService from "../services/api";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const WishlistContext = createContext(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToWishlist = async (item) => {
    const response = await apiService.addToWishlist(item);
    // console.log(response.wishlist);
    setItems(response.wishlist);
    // setItems((prevItems) => {
    //   if (prevItems.find((i) => i.id === item.id)) {
    //     return prevItems;
    //   }
    //   return [...prevItems, item];
    // });
  };

  const removeFromWishlist = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const isInWishlist = (id) => {
    return items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
