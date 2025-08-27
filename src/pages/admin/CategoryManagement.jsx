import React, { useState, useEffect } from 'react';
import {
  Grid,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  ArrowLeft,
  Save,
  X,
  Upload,
  RefreshCw,
  Package,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.adminGetCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Use default categories as fallback
      const defaultCategories = [
        {
          _id: '1',
          name: "Women's Fashion",
          slug: 'women',
          description: 'Latest trends in women\'s clothing and accessories',
          image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
          isActive: true,
          productCount: 45,
          sortOrder: 1
        },
        {
          _id: '2',
          name: "Men's Collection",
          slug: 'men',
          description: 'Premium men\'s fashion and accessories',
          image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
          isActive: true,
          productCount: 32,
          sortOrder: 2
        },
        {
          _id: '3',
          name: 'Accessories',
          slug: 'accessories',
          description: 'Complete your look with luxury accessories',
          image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600',
          isActive: true,
          productCount: 28,
          sortOrder: 3
        },
        {
          _id: '4',
          name: 'Home & Living',
          slug: 'home',
          description: 'Transform your space with elegant home decor',
          image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
          isActive: true,
          productCount: 19,
          sortOrder: 4
        },
        {
          _id: '5',
          name: 'Electronics',
          slug: 'electronics',
          description: 'Latest technology and gadgets',
          image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600',
          isActive: true,
          productCount: 15,
          sortOrder: 5
        },
        {
          _id: '6',
          name: 'Beauty & Care',
          slug: 'beauty',
          description: 'Premium beauty products and personal care',
          image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600',
          isActive: true,
          productCount: 22,
          sortOrder: 6
        }
      ];
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(prev => ({ ...prev, form: 'saving' }));
      
      if (editingCategory) {
        await apiService.adminUpdateCategory(editingCategory._id, formData);
      } else {
        await apiService.adminCreateCategory(formData);
      }
      
      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    } finally {
      setActionLoading(prev => ({ ...prev, form: null }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      isActive: true,
      sortOrder: 0
    });
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive !== false,
      sortOrder: category.sortOrder || 0
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        setActionLoading(prev => ({ ...prev, [categoryId]: 'deleting' }));
        await apiService.adminDeleteCategory(categoryId);
        setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category');
      } finally {
        setActionLoading(prev => ({ ...prev, [categoryId]: null }));
      }
    }
  };

  const toggleCategoryStatus = async (category) => {
    try {
      setActionLoading(prev => ({ ...prev, [category._id]: 'updating' }));
      const updatedCategory = { ...category, isActive: !category.isActive };
      await apiService.adminUpdateCategory(category._id, updatedCategory);
      setCategories(prev => prev.map(cat => 
        cat._id === category._id ? updatedCategory : cat
      ));
    } catch (error) {
      console.error('Failed to update category status:', error);
      alert('Failed to update category status');
    } finally {
      setActionLoading(prev => ({ ...prev, [category._id]: null }));
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-700 mr-3">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
                <p className="text-gray-600 mt-2">Organize and manage product categories</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Grid className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(cat => cat.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg. Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length > 0 ? Math.round(categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0) / categories.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCategories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={category.image || 'https://via.placeholder.com/400x200'}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    category.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <span className="text-sm text-gray-500">#{category.sortOrder || 0}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-sm text-gray-600">{category.productCount || 0} products</span>
                  </div>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    /{category.slug}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleCategoryStatus(category)}
                    disabled={actionLoading[category._id]}
                    className={`px-3 py-2 rounded text-sm flex items-center justify-center disabled:opacity-50 ${
                      category.isActive 
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {actionLoading[category._id] ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : category.isActive ? (
                      'Hide'
                    ) : (
                      'Show'
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    disabled={actionLoading[category._id]}
                    className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading[category._id] === 'deleting' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Grid className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Create your first category to get started.'}
            </p>
          </div>
        )}

        {/* Category Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData(prev => ({ 
                          ...prev, 
                          name,
                          slug: generateSlug(name)
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">URL: /category/{formData.slug}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active Category
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading.form}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {actionLoading.form ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;