import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
  const { products, getProducts, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVendor, setFilterVendor] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    getProducts();
  }, []);

  const categories = ['all', 'women', 'men', 'accessories', 'home', 'electronics', 'beauty', 'sports'];
  const vendors = [...new Set(products.map(p => p.vendorName).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesVendor = filterVendor === 'all' || product.vendorName === filterVendor;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesVendor;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'price':
        aValue = a.price || 0;
        bValue = b.price || 0;
        break;
      case 'stock':
        aValue = a.stock || 0;
        bValue = b.stock || 0;
        break;
      case 'rating':
        aValue = typeof a.rating === 'object' ? a.rating.average : a.rating || 0;
        bValue = typeof b.rating === 'object' ? b.rating.average : b.rating || 0;
        break;
      case 'date':
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
        break;
      default:
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
    }
    
    if (sortOrder === 'desc') {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    } else {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
  });

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-red-600', label: 'Out of Stock', icon: XCircle };
    if (stock < 10) return { color: 'text-yellow-600', label: 'Low Stock', icon: AlertTriangle };
    return { color: 'text-green-600', label: 'In Stock', icon: CheckCircle };
  };

  const formatRating = (rating) => {
    if (typeof rating === 'object' && rating !== null) {
      return rating.average ? rating.average.toFixed(1) : '0.0';
    }
    return typeof rating === 'number' ? rating.toFixed(1) : '0.0';
  };

  const formatReviews = (rating) => {
    if (typeof rating === 'object' && rating !== null) {
      return rating.count || 0;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage all products across the platform</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.stock < 10).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0) : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Vendors</option>
              {vendors.map(vendor => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
              <option value="stock-asc">Stock Low-High</option>
              <option value="stock-desc">Stock High-Low</option>
              <option value="rating-desc">Rating High-Low</option>
              <option value="date-desc">Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock || 0);
            
            return (
              <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">
                      {product.badge}
                    </span>
                  )}
                  <div className={`absolute top-2 right-2 ${stockStatus.color}`}>
                    <stockStatus.icon className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Vendor:</span>
                      <span className="font-medium">{product.vendorName || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-bold text-blue-600">${product.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Stock:</span>
                      <span className={`font-medium ${stockStatus.color}`}>
                        {product.stock || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Rating:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{formatRating(product.rating)}</span>
                        <span className="text-gray-400 ml-1">
                          ({formatReviews(product.rating)})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-center hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                    <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded hover:bg-blue-200 transition-colors flex items-center justify-center">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded hover:bg-red-200 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;