import React, { createContext, useContext, useState } from 'react';

const VendorContext = createContext(undefined);

export const useVendors = () => {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendors must be used within a VendorProvider');
  }
  return context;
};

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([
    {
      id: 'vendor_1',
      name: 'John Smith',
      email: 'john@premiumstore.com',
      shopName: 'Premium Store',
      businessType: 'Fashion & Accessories',
      status: 'approved',
      joinDate: '2024-01-15',
      totalProducts: 15,
      totalSales: 25000
    },
    {
      id: 'vendor_2',
      name: 'Sarah Johnson',
      email: 'sarah@luxurytimepieces.com',
      shopName: 'Luxury Timepieces',
      businessType: 'Watches & Jewelry',
      status: 'approved',
      joinDate: '2024-02-20',
      totalProducts: 8,
      totalSales: 45000
    },
    {
      id: 'vendor_3',
      name: 'Mike Wilson',
      email: 'mike@techgadgets.com',
      shopName: 'Tech Gadgets Pro',
      businessType: 'Electronics',
      status: 'pending',
      joinDate: '2024-12-01',
      totalProducts: 0,
      totalSales: 0
    }
  ]);

  const [vendorApplications, setVendorApplications] = useState([
    {
      id: 'app_1',
      name: 'Emma Davis',
      email: 'emma@beautyhub.com',
      shopName: 'Beauty Hub',
      businessType: 'Beauty & Cosmetics',
      status: 'pending',
      appliedDate: '2024-12-15',
      documents: ['business_license.pdf', 'tax_certificate.pdf']
    }
  ]);

  const approveVendor = (vendorId) => {
    setVendors(prev => prev.map(vendor => 
      vendor.id === vendorId ? { ...vendor, status: 'approved' } : vendor
    ));
  };

  const rejectVendor = (vendorId) => {
    setVendors(prev => prev.map(vendor => 
      vendor.id === vendorId ? { ...vendor, status: 'rejected' } : vendor
    ));
  };

  const addVendorApplication = (application) => {
    const newApplication = {
      ...application,
      id: `app_${Date.now()}`,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setVendorApplications(prev => [...prev, newApplication]);
  };

  const approveApplication = (applicationId) => {
    const application = vendorApplications.find(app => app.id === applicationId);
    if (application) {
      const newVendor = {
        id: `vendor_${Date.now()}`,
        name: application.name,
        email: application.email,
        shopName: application.shopName,
        businessType: application.businessType,
        status: 'approved',
        joinDate: new Date().toISOString().split('T')[0],
        totalProducts: 0,
        totalSales: 0
      };
      setVendors(prev => [...prev, newVendor]);
      setVendorApplications(prev => prev.filter(app => app.id !== applicationId));
    }
  };

  const rejectApplication = (applicationId) => {
    setVendorApplications(prev => prev.filter(app => app.id !== applicationId));
  };

  return (
    <VendorContext.Provider value={{
      vendors,
      vendorApplications,
      approveVendor,
      rejectVendor,
      addVendorApplication,
      approveApplication,
      rejectApplication
    }}>
      {children}
    </VendorContext.Provider>
  );
};