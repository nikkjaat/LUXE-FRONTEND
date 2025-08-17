import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import apiService from "../services/api";

const ProductContext = createContext(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const getProducts = async (params = {}) => {
    const response = await apiService.getProducts(params);
    if (!response.success) {
      throw new Error("Failed to fetch products");
    }
    setProducts(
      response.products.map((product) => ({
        ...product,
        id: product._id,
      }))
    );
    return response.products;
  };

  const getProduct = async (productId) => {
    const response = await apiService.getProduct(productId);
    return response;
  };

  const addProduct = async (product) => {
    const response = await apiService.createProduct(product);
    if (!response.success) {
      throw new Error("Failed to create product");
    }
    setProducts((prev) => [
      ...prev,
      {
        ...response.product, // Use the actual product from backend
        id: response.product._id, // Use the real ID from database
      },
    ]);

    return response; // Return the full response if needed
  };

  const updateProduct = async (id, updates) => {
    const response = await apiService.updateProduct(id, updates);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProductsByVendor = (vendorId) => {
    return products.filter((product) => product.vendor._id === vendorId);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        getProducts,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByVendor,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
