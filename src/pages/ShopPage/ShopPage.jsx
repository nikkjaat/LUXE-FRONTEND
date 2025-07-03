import React, { useState } from 'react';
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import styles from './ShopPage.module.css';

const ShopPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const products = [
    {
      id: '1',
      name: 'Premium Leather Handbag',
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Best Seller',
      category: 'accessories'
    },
    {
      id: '2',
      name: 'Designer Watch Collection',
      price: 599,
      originalPrice: 799,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Limited Edition',
      category: 'accessories'
    },
    {
      id: '3',
      name: 'Silk Scarf Set',
      price: 149,
      originalPrice: 199,
      rating: 4.7,
      reviews: 203,
      image: 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'New Arrival',
      category: 'accessories'
    },
    {
      id: '4',
      name: 'Artisan Jewelry Box',
      price: 189,
      originalPrice: 249,
      rating: 4.6,
      reviews: 67,
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Exclusive',
      category: 'home'
    },
    {
      id: '5',
      name: 'Elegant Evening Dress',
      price: 459,
      originalPrice: 599,
      rating: 4.9,
      reviews: 156,
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Trending',
      category: 'women'
    },
    {
      id: '6',
      name: 'Classic Men\'s Suit',
      price: 799,
      originalPrice: 999,
      rating: 4.8,
      reviews: 92,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Premium',
      category: 'men'
    },
    {
      id: '7',
      name: 'Luxury Skincare Set',
      price: 229,
      originalPrice: 299,
      rating: 4.7,
      reviews: 178,
      image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Best Value',
      category: 'beauty'
    },
    {
      id: '8',
      name: 'Smart Fitness Tracker',
      price: 349,
      originalPrice: 449,
      rating: 4.6,
      reviews: 234,
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Tech',
      category: 'electronics'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'women', name: 'Women\'s Fashion' },
    { id: 'men', name: 'Men\'s Collection' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'home', name: 'Home & Living' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'beauty', name: 'Beauty & Care' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Shop All Products</h1>
          <p className={styles.description}>
            Discover our complete collection of premium products curated for luxury and style
          </p>
        </div>

        <div className={styles.layout}>
          {/* Sidebar Filters */}
          <div className={`${styles.sidebar} ${showFilters ? styles.visible : ''}`}>
            <div className={styles.filtersCard}>
              <h3 className={styles.filtersTitle}>Filters</h3>
              
              {/* Categories */}
              <div className={styles.filterSection}>
                <h4 className={styles.filterSectionTitle}>Categories</h4>
                <div className={styles.categoryList}>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`${styles.categoryButton} ${
                        selectedCategory === category.id ? styles.active : styles.inactive
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className={styles.filterSection}>
                <h4 className={styles.filterSectionTitle}>Price Range</h4>
                <div className={styles.priceSection}>
                  <div className={styles.priceRange}>
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className={styles.priceSlider}
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className={styles.filterSection}>
                <h4 className={styles.filterSectionTitle}>Rating</h4>
                <div className={styles.ratingList}>
                  {[4, 3, 2, 1].map((rating) => (
                    <button key={rating} className={styles.ratingButton}>
                      <div className={styles.ratingStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`${styles.ratingStar} ${
                              i < rating ? styles.filled : styles.empty
                            }`}
                          />
                        ))}
                      </div>
                      & up
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Search and Controls */}
            <div className={styles.controlsCard}>
              <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                  <Search className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                
                <div className={styles.controlsRight}>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={styles.filtersToggle}
                  >
                    <SlidersHorizontal className={styles.filtersIcon} />
                    Filters
                  </button>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.sortSelect}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  
                  <div className={styles.viewToggle}>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : styles.inactive}`}
                    >
                      <Grid className={styles.viewIcon} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : styles.inactive}`}
                    >
                      <List className={styles.viewIcon} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className={styles.resultsCount}>
              <p className={styles.resultsText}>
                Showing {sortedProducts.length} of {products.length} products
              </p>
            </div>

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className={styles.productsGrid}>
                {sortedProducts.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.imageContainer}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                      />
                      <div className={styles.badge}>
                        {product.badge}
                      </div>
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className={`${styles.wishlistButton} ${
                          isInWishlist(product.id) ? styles.active : styles.inactive
                        }`}
                      >
                        <Heart className={`${styles.wishlistIcon} ${isInWishlist(product.id) ? styles.filled : ''}`} />
                      </button>
                    </div>

                    <div className={styles.productContent}>
                      <div className={styles.rating}>
                        <div className={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`${styles.star} ${
                                i < Math.floor(product.rating) ? styles.filled : styles.empty
                              }`}
                            />
                          ))}
                        </div>
                        <span className={styles.reviewCount}>({product.reviews})</span>
                      </div>

                      <h3 className={styles.productName}>{product.name}</h3>
                      
                      <div className={styles.priceContainer}>
                        <div className={styles.priceGroup}>
                          <span className={styles.price}>${product.price}</span>
                          {product.originalPrice && (
                            <span className={styles.originalPrice}>${product.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={styles.addToCartButton}
                      >
                        <ShoppingCart className={styles.cartIcon} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.productsList}>
                {sortedProducts.map((product) => (
                  <div key={product.id} className={styles.listCard}>
                    <div className={styles.listContent}>
                      <div className={styles.listImageContainer}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.listImage}
                        />
                        <div className={styles.listBadge}>
                          {product.badge}
                        </div>
                      </div>
                      
                      <div className={styles.listInfo}>
                        <div className={styles.listRating}>
                          <div className={styles.listStars}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`${styles.listStar} ${
                                  i < Math.floor(product.rating) ? styles.filled : styles.empty
                                }`}
                              />
                            ))}
                          </div>
                          <span className={styles.listReviewCount}>({product.reviews} reviews)</span>
                        </div>
                        <h3 className={styles.listProductName}>{product.name}</h3>
                        <div className={styles.listPriceGroup}>
                          <span className={styles.listPrice}>${product.price}</span>
                          {product.originalPrice && (
                            <span className={styles.listOriginalPrice}>${product.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.listActions}>
                        <button
                          onClick={() => handleWishlistToggle(product)}
                          className={`${styles.listWishlistButton} ${
                            isInWishlist(product.id) ? styles.active : styles.inactive
                          }`}
                        >
                          <Heart className={`${styles.listWishlistIcon} ${isInWishlist(product.id) ? styles.filled : ''}`} />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={styles.listAddToCartButton}
                        >
                          <ShoppingCart className={styles.listCartIcon} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Search className={styles.emptyIconSvg} />
                </div>
                <h3 className={styles.emptyTitle}>No products found</h3>
                <p className={styles.emptyDescription}>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;