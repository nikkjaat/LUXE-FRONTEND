import React, { useEffect, useState } from "react";
import {
  Package,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useNavigate } from "react-router-dom";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, getProductsByVendor, deleteProduct, getProducts } =
    useProducts();
  const [activeTab, setActiveTab] = useState("overview");

  const vendorId = user?.role === "vendor" ? user._id : null;
  const vendorProducts = getProductsByVendor(vendorId);

  useEffect(() => {
    getProducts();
  }, []);

  const stats = [
    {
      name: "Total Products",
      value: vendorProducts.length,
      change: "+3",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      name: "Total Sales",
      value: "$12,543",
      change: "+15%",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      name: "Orders",
      value: "89",
      change: "+8",
      icon: ShoppingBag,
      color: "bg-purple-500",
    },
    {
      name: "Revenue Growth",
      value: "+23%",
      change: "This month",
      icon: TrendingUp,
      color: "bg-yellow-500",
    },
  ];

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
    }
  };

  const editProduct = (productId) => {
    navigate("/vendor/add-product?edit=true", {
      state: { productId },
    });
  };

  if (user?.status === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Under Review
          </h2>
          <p className="text-gray-600 mb-6">
            Your vendor application is currently being reviewed by our admin
            team. You'll receive an email notification once your application is
            approved.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Shop Name:</strong> {user?.shopName}
            </p>
            <p className="text-sm text-yellow-800">
              <strong>Business Type:</strong> {user?.businessType}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.shopName}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <span className="ml-2 text-sm text-green-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", name: "Overview" },
              { id: "products", name: "My Products" },
              { id: "orders", name: "Orders" },
              { id: "analytics", name: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Orders
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((order) => (
                    <div
                      key={order}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          Order #ORD-00{order}
                        </p>
                        <p className="text-sm text-gray-500">
                          2 items • $299.99
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Top Products
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {vendorProducts.slice(0, 3).map((product) => (
                    <div key={product._id} className="flex items-center">
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${product.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm">
                            {typeof product.rating === 'object' 
                              ? product.rating.average?.toFixed(1) || '0.0'
                              : product.rating?.toFixed(1) || '0.0'
                            }
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {typeof product.rating === 'object' 
                            ? product.rating.count || 0
                            : product.reviews || 0
                          } reviews
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">My Products</h3>
              <button
                onClick={() => {
                  navigate("/vendor/add-product");
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>
            <div className="p-6">
              {vendorProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start by adding your first product to the store.
                  </p>
                  <button
                    onClick={() => {
                      navigate("/vendor/add-product");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendorProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          {product.category}
                        </p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold text-blue-600">
                            ${product.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              editProduct(product._id);
                            }}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Order Management
              </h3>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No recent orders
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Orders for your products will appear here.
                  </p>
                  <Link
                    to="/vendor/orders"
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analytics Coming Soon
              </h3>
              <p className="text-gray-500 mb-6">
                Get detailed insights about your store performance.
              </p>
              <Link
                to="/vendor/analytics"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                View Full Analytics
              </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
