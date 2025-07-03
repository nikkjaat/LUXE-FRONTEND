import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, Settings, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'vendor') return '/vendor/dashboard';
    return '/profile';
  };

  const getDashboardLabel = () => {
    if (user?.role === 'admin') return 'Admin Dashboard';
    if (user?.role === 'vendor') return 'Vendor Dashboard';
    return 'Profile';
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.nav}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>LUXE</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/shop" className={styles.navLink}>Shop</Link>
            <Link to="/categories" className={styles.navLink}>Categories</Link>
            {!user && (
              <Link to="/vendor/signup" className={styles.navLink}>
                <Store className="h-4 w-4 inline mr-1" />
                Become a Vendor
              </Link>
            )}
            <a href="#" className={styles.navLink}>About</a>
            <a href="#" className={styles.navLink}>Contact</a>
          </nav>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Search products..."
                className={styles.searchInput}
              />
              <Search className={styles.searchIcon} />
            </div>
          </div>

          {/* Right Actions */}
          <div className={styles.actions}>
            {user?.role === 'user' && (
              <Link to="/wishlist" className={styles.actionButton}>
                <Heart />
                {wishlistItems.length > 0 && (
                  <span className={`${styles.badge} ${styles.wishlistBadge}`}>
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className={styles.userMenu}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={styles.userButton}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={styles.avatar}
                  />
                  <span className="hidden md:block ml-2 text-sm font-medium">
                    {user.role === 'admin' ? 'Admin' : user.role === 'vendor' ? 'Vendor' : 'User'}
                  </span>
                </button>
                {isUserMenuOpen && (
                  <div className={styles.dropdown}>
                    <Link
                      to={getDashboardLink()}
                      className={styles.dropdownItem}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {getDashboardLabel()}
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/vendor-applications"
                        className={styles.dropdownItem}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Store className="h-4 w-4 mr-2" />
                        Vendor Applications
                      </Link>
                    )}
                    {user.role === 'vendor' && (
                      <Link
                        to="/vendor/add-product"
                        className={styles.dropdownItem}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Store className="h-4 w-4 mr-2" />
                        Add Product
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className={styles.dropdownButton}
                    >
                      <LogOut className={styles.logoutIcon} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={styles.actionButton}>
                <User />
              </Link>
            )}

            {user?.role === 'user' && (
              <Link to="/cart" className={styles.actionButton}>
                <ShoppingCart />
                {totalItems > 0 && (
                  <span className={`${styles.badge} ${styles.cartBadge}`}>
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileNavLinks}>
              <Link to="/" className={styles.mobileNavLink}>Home</Link>
              <Link to="/shop" className={styles.mobileNavLink}>Shop</Link>
              <Link to="/categories" className={styles.mobileNavLink}>Categories</Link>
              {!user && (
                <Link to="/vendor/signup" className={styles.mobileNavLink}>
                  Become a Vendor
                </Link>
              )}
              <a href="#" className={styles.mobileNavLink}>About</a>
              <a href="#" className={styles.mobileNavLink}>Contact</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;