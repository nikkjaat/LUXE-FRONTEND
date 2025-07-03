import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password, role = 'user') => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on role
    let userData = {
      id: '1',
      email,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    };

    if (role === 'admin') {
      userData = {
        ...userData,
        name: 'Admin User',
        role: 'admin',
        permissions: ['manage_users', 'manage_vendors', 'manage_products', 'view_analytics']
      };
    } else if (role === 'vendor') {
      userData = {
        ...userData,
        name: 'Vendor User',
        role: 'vendor',
        vendorId: 'vendor_1',
        shopName: 'Premium Store',
        status: 'approved',
        permissions: ['manage_own_products', 'view_own_orders']
      };
    } else {
      userData = {
        ...userData,
        name: 'Customer User',
        role: 'user',
        permissions: ['shop', 'order']
      };
    }

    setUser(userData);
    setIsLoading(false);
  };

  const signup = async (name, email, password, role = 'user', additionalData = {}) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let userData = {
      id: Date.now().toString(),
      name,
      email,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    };

    if (role === 'vendor') {
      userData = {
        ...userData,
        role: 'vendor',
        shopName: additionalData.shopName,
        businessType: additionalData.businessType,
        status: 'pending', // Pending admin approval
        permissions: []
      };
    } else {
      userData = {
        ...userData,
        role: 'user',
        permissions: ['shop', 'order']
      };
    }

    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};