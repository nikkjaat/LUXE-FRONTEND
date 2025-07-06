import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const ProductContext = createContext(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  // Fetch products
  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProducts(params);
      
      setProducts(response.products);
      setPagination({
        page: response.page,
        pages: response.pages,
        total: response.total
      });
      
      return response;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get single product
  const getProduct = async (id) => {
    try {
      const response = await apiService.getProduct(id);
      return response.product;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  };

  // Add product (vendor only)
  const addProduct = async (productData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add text fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Add image files
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const response = await apiService.createProduct(formData);
      
      // Add to local state
      setProducts(prev => [response.product, ...prev]);
      
      return response.product;
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  // Update product (vendor only)
  const updateProduct = async (id, productData) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add text fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Add image files if provided
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const response = await apiService.updateProduct(id, formData);
      
      // Update local state
      setProducts(prev => 
        prev.map(product => 
          product._id === id ? response.product : product
        )
      );
      
      return response.product;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  // Delete product (vendor only)
  const deleteProduct = async (id) => {
    try {
      await apiService.deleteProduct(id);
      
      // Remove from local state
      setProducts(prev => prev.filter(product => product._id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  // Get products by vendor
  const getProductsByVendor = async (params = {}) => {
    try {
      const response = await apiService.getVendorProducts(params);
      return response.products;
    } catch (error) {
      console.error('Failed to fetch vendor products:', error);
      throw error;
    }
  };

  // Search products
  const searchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.searchProducts(params);
      
      setProducts(response.products);
      setPagination({
        page: response.page,
        pages: response.pages,
        total: response.total
      });
      
      return response;
    } catch (error) {
      console.error('Failed to search products:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load initial products
  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByVendor,
    searchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};