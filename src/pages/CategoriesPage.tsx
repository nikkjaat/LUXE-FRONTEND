import React, { useState } from 'react';
import { Search, Filter, Grid, List, ArrowRight } from 'lucide-react';

const CategoriesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      id: 1,
      name: 'Women\'s Fashion',
      itemCount: 245,
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
      gradient: 'from-pink-500 to-rose-500',
      description: 'Discover the latest trends in women\'s clothing, from casual wear to elegant evening dresses.',
      subcategories: ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Activewear']
    },
    {
      id: 2,
      name: 'Men\'s Collection',
      itemCount: 189,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
      gradient: 'from-blue-500 to-indigo-500',
      description: 'Premium men\'s fashion featuring sophisticated styles for the modern gentleman.',
      subcategories: ['Shirts', 'Suits', 'Casual Wear', 'Accessories', 'Shoes']
    },
    {
      id: 3,
      name: 'Accessories',
      itemCount: 156,
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600',
      gradient: 'from-purple-500 to-violet-500',
      description: 'Complete your look with our curated selection of luxury accessories.',
      subcategories: ['Jewelry', 'Bags', 'Watches', 'Sunglasses', 'Scarves']
    },
    {
      id: 4,
      name: 'Home & Living',
      itemCount: 298,
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      gradient: 'from-emerald-500 to-teal-500',
      description: 'Transform your space with our elegant home decor and living essentials.',
      subcategories: ['Furniture', 'Decor', 'Lighting', 'Textiles', 'Kitchen']
    },
    {
      id: 5,
      name: 'Electronics',
      itemCount: 167,
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600',
      gradient: 'from-orange-500 to-red-500',
      description: 'Latest technology and gadgets to enhance your digital lifestyle.',
      subcategories: ['Smartphones', 'Laptops', 'Audio', 'Smart Home', 'Gaming']
    },
    {
      id: 6,
      name: 'Beauty & Care',
      itemCount: 223,
      image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600',
      gradient: 'from-amber-500 to-yellow-500',
      description: 'Premium beauty products and personal care essentials for your daily routine.',
      subcategories: ['Skincare', 'Makeup', 'Fragrance', 'Hair Care', 'Wellness']
    },
    {
      id: 7,
      name: 'Sports & Fitness',
      itemCount: 134,
      image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600',
      gradient: 'from-green-500 to-emerald-500',
      description: 'High-performance gear and apparel for your active lifestyle.',
      subcategories: ['Activewear', 'Equipment', 'Footwear', 'Outdoor', 'Fitness']
    },
    {
      id: 8,
      name: 'Kids & Baby',
      itemCount: 178,
      image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=600',
      gradient: 'from-cyan-500 to-blue-500',
      description: 'Safe, comfortable, and stylish products for children of all ages.',
      subcategories: ['Baby Clothes', 'Toys', 'Shoes', 'Accessories', 'Gear']
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of carefully curated categories and find exactly what you're looking for
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white">
                <div className="relative h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-70 group-hover:opacity-80 transition-opacity duration-300`}></div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90 mb-3">{category.itemCount} items</p>
                    
                    <button className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300 text-sm">
                      Explore
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.slice(0, 3).map((sub, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="text-xs text-gray-500">+{category.subcategories.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-6">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-70`}></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                      <span className="text-sm text-gray-500">{category.itemCount} items</span>
                    </div>
                    <p className="text-gray-600 mb-3">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((sub, index) => (
                        <span key={index} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;