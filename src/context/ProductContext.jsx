import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const ProductContext = createContext(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Premium Leather Handbag",
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400",
      badge: "Best Seller",
      category: "accessories",
      vendorId: "vendor_1",
      vendorName: "Premium Store",
      status: "active",
      stock: 50,
      description: "Luxurious leather handbag crafted with premium materials.",
    },
    {
      id: "2",
      name: "Designer Watch Collection",
      price: 599,
      originalPrice: 799,
      rating: 4.9,
      reviews: 89,
      image:
        "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400",
      badge: "Limited Edition",
      category: "accessories",
      vendorId: "vendor_2",
      vendorName: "Luxury Timepieces",
      status: "active",
      stock: 25,
      description: "Elegant designer watch with Swiss movement.",
    },
  ]);

  const addProduct = async (product) => {
    console.log(addProduct);
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      rating: 0,
      reviews: 0,
      status: "active",
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        newProduct,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding product:", error);
      throw new Error("Failed to add product. Please try again.");
    }

    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProductsByVendor = (vendorId) => {
    return products.filter((product) => product.vendorId === vendorId);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
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
