import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import styles from './FeaturedProducts.module.css';

const FeaturedProducts = () => {
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
      badge: 'Best Seller'
    },
    {
      id: '2',
      name: 'Designer Watch Collection',
      price: 599,
      originalPrice: 799,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Limited Edition'
    },
    {
      id: '3',
      name: 'Silk Scarf Set',
      price: 149,
      originalPrice: 199,
      rating: 4.7,
      reviews: 203,
      image: 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'New Arrival'
    },
    {
      id: '4',
      name: 'Artisan Jewelry Box',
      price: 189,
      originalPrice: 249,
      rating: 4.6,
      reviews: 67,
      image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Exclusive'
    }
  ];

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
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Featured Products</h2>
          <p className={styles.description}>
            Discover our handpicked selection of premium products that embody luxury and sophistication
          </p>
        </div>

        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <Link to={`/product/${product.id}`} className={styles.imageContainer}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
                <div className={styles.badge}>
                  {product.badge}
                </div>
              </Link>
              
              <button
                onClick={() => handleWishlistToggle(product)}
                className={`${styles.wishlistButton} ${
                  isInWishlist(product.id) ? styles.active : styles.inactive
                }`}
              >
                <Heart className={`${styles.wishlistIcon} ${isInWishlist(product.id) ? styles.filled : ''}`} />
              </button>

              <div className={styles.content}>
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

                <Link to={`/product/${product.id}`}>
                  <h3 className={styles.productName}>{product.name}</h3>
                </Link>
                
                <div className={styles.priceContainer}>
                  <div className={styles.priceGroup}>
                    <span className={styles.price}>${product.price}</span>
                    <span className={styles.originalPrice}>${product.originalPrice}</span>
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
      </div>
    </section>
  );
};

export default FeaturedProducts;