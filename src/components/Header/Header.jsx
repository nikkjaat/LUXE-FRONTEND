import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, Settings, Store, Sparkles, Users, Phone, Info, Bell, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';
import SmartSearch from '../SmartSearch';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { getUserNotifications, getUnreadCount } = useNotifications();
  const navigate = useNavigate();
  
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchOverlayRef = useRef(null);

  // Get notifications and unread count
  useEffect(() => {
    if (user) {
      const userId = user?.role === 'admin' ? 'admin' : user?.vendorId || 'user';
      setUnreadCount(getUnreadCount(userId));
    }
  }, [user, getUnreadCount]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }

      if (searchOverlayRef.current && !searchOverlayRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key for search overlay
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (query) => {
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  const handleMobileNavClick = (path) => {
    setIsMenuOpen(false);
    if (path) {
      navigate(path);
    }
  };

  const handleUserMenuClick = (action) => {
    setIsUserMenuOpen(false);
    if (typeof action === 'function') {
      action();
    }
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
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Main Navigation Row */}
          <div className={styles.mainNav}>
            {/* Logo */}
            <div className={styles.logo}>
              <Link to="/" className={styles.logoLink}>
                <span className={styles.logoText}>LUXE</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className={`${styles.desktopNav} ${isSearchOpen ? styles.hidden : ''}`}>
              <Link to="/" className={styles.navLink}>
                <span>Home</span>
              </Link>
              <Link to="/shop" className={styles.navLink}>
                <span>Shop</span>
              </Link>
              <Link to="/categories" className={styles.navLink}>
                <span>Categories</span>
              </Link>
              <Link to="/ar-showroom" className={styles.navLink}>
                <Sparkles className="h-4 w-4" />
                <span>AR Showroom</span>
              </Link>
              <Link to="/social" className={styles.navLink}>
                <Users className="h-4 w-4" />
                <span>Social</span>
              </Link>
              {!user && (
                <Link to="/vendor/signup" className={styles.navLink}>
                  <Store className="h-4 w-4" />
                  <span>Become a Vendor</span>
                </Link>
              )}
            </nav>

            {/* Desktop Search Container */}
            <div className={`${styles.searchContainer} ${isSearchOpen ? styles.hidden : ''}`}>
              <SmartSearch onSearch={handleSearch} />
            </div>

            {/* Desktop Actions */}
            <div className={styles.desktopActions}>
              {/* Search Button for Tablet */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`${styles.searchButton} ${isSearchOpen ? styles.hidden : ''}`}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist - Desktop Only for Users */}
              {user?.role === 'user' && (
                <Link 
                  to="/wishlist" 
                  className={`${styles.actionButton} ${styles.desktopOnly} ${isSearchOpen ? styles.hidden : ''}`}
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <span className={`${styles.badge} ${styles.wishlistBadge}`}>
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart - Users Only */}
              {user?.role === 'user' && (
                <Link 
                  to="/cart" 
                  className={styles.actionButton}
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className={`${styles.badge} ${styles.cartBadge}`}>
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* User Menu */}
              {user ? (
                <div className={styles.userMenu} ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={styles.userButton}
                    aria-label="User Menu"
                  >
                    <div className={styles.avatarContainer}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={styles.avatar}
                      />
                      {unreadCount > 0 && (
                        <span className={styles.notificationDot}></span>
                      )}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownHeader}>
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={styles.dropdownAvatar}
                        />
                        <div className={styles.dropdownUserInfo}>
                          <span className={styles.dropdownUserName}>{user.name}</span>
                          <span className={styles.dropdownUserRole}>
                            {user.role === 'admin' ? 'Administrator' : 
                             user.role === 'vendor' ? 'Vendor' : 'Customer'}
                          </span>
                        </div>
                      </div>

                      <div className={styles.dropdownDivider}></div>

                      <Link
                        to={getDashboardLink()}
                        className={styles.dropdownItem}
                        onClick={() => handleUserMenuClick()}
                      >
                        <Settings className="h-4 w-4" />
                        <span>{getDashboardLabel()}</span>
                      </Link>

                      {/* Notifications */}
                      <div className={styles.dropdownItem}>
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className={styles.notificationCount}>{unreadCount}</span>
                        )}
                      </div>

                      {/* User-specific items */}
                      {user?.role === 'user' && (
                        <>
                          <Link
                            to="/wishlist"
                            className={`${styles.dropdownItem} ${styles.mobileTabletOnly}`}
                            onClick={() => handleUserMenuClick()}
                          >
                            <Heart className="h-4 w-4" />
                            <span>Wishlist</span>
                            {wishlistItems.length > 0 && (
                              <span className={styles.itemCount}>{wishlistItems.length}</span>
                            )}
                          </Link>
                          <Link
                            to="/cart"
                            className={`${styles.dropdownItem} ${styles.mobileOnly}`}
                            onClick={() => handleUserMenuClick()}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Cart</span>
                            {totalItems > 0 && (
                              <span className={styles.itemCount}>{totalItems}</span>
                            )}
                          </Link>
                        </>
                      )}

                      {/* Admin-specific items */}
                      {user.role === 'admin' && (
                        <>
                          <Link
                            to="/admin/vendor-applications"
                            className={styles.dropdownItem}
                            onClick={() => handleUserMenuClick()}
                          >
                            <Store className="h-4 w-4" />
                            <span>Vendor Applications</span>
                          </Link>
                          <Link
                            to="/admin/promotions"
                            className={styles.dropdownItem}
                            onClick={() => handleUserMenuClick()}
                          >
                            <Sparkles className="h-4 w-4" />
                            <span>Promotions</span>
                          </Link>
                        </>
                      )}

                      {/* Vendor-specific items */}
                      {user.role === 'vendor' && (
                        <Link
                          to="/vendor/add-product"
                          className={styles.dropdownItem}
                          onClick={() => handleUserMenuClick()}
                        >
                          <Store className="h-4 w-4" />
                          <span>Add Product</span>
                        </Link>
                      )}

                      <div className={styles.dropdownDivider}></div>

                      <a 
                        href="#about" 
                        className={styles.dropdownItem}
                        onClick={() => handleUserMenuClick()}
                      >
                        <Info className="h-4 w-4" />
                        <span>About</span>
                      </a>
                      <a 
                        href="#contact" 
                        className={styles.dropdownItem}
                        onClick={() => handleUserMenuClick()}
                      >
                        <Phone className="h-4 w-4" />
                        <span>Contact</span>
                      </a>

                      <div className={styles.dropdownDivider}></div>

                      <button
                        onClick={() => handleUserMenuClick(handleLogout)}
                        className={styles.dropdownButton}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className={styles.actionButton} aria-label="Login">
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className={styles.mobileActions}>
              {/* User Menu */}
              {user ? (
                <div className={styles.userMenu} ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={styles.mobileUserButton}
                    aria-label="User Menu"
                  >
                    <div className={styles.avatarContainer}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={styles.avatar}
                      />
                      {unreadCount > 0 && (
                        <span className={styles.notificationDot}></span>
                      )}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className={styles.mobileDropdown}>
                      <div className={styles.dropdownHeader}>
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={styles.dropdownAvatar}
                        />
                        <div className={styles.dropdownUserInfo}>
                          <span className={styles.dropdownUserName}>{user.name}</span>
                          <span className={styles.dropdownUserRole}>
                            {user.role === 'admin' ? 'Administrator' : 
                             user.role === 'vendor' ? 'Vendor' : 'Customer'}
                          </span>
                        </div>
                      </div>

                      <div className={styles.dropdownDivider}></div>

                      <Link
                        to={getDashboardLink()}
                        className={styles.dropdownItem}
                        onClick={() => handleUserMenuClick()}
                      >
                        <Settings className="h-4 w-4" />
                        <span>{getDashboardLabel()}</span>
                      </Link>

                      <div className={styles.dropdownItem}>
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className={styles.notificationCount}>{unreadCount}</span>
                        )}
                      </div>

                      {user?.role === 'user' && (
                        <>
                          <Link
                            to="/wishlist"
                            className={styles.dropdownItem}
                            onClick={() => handleUserMenuClick()}
                          >
                            <Heart className="h-4 w-4" />
                            <span>Wishlist</span>
                            {wishlistItems.length > 0 && (
                              <span className={styles.itemCount}>{wishlistItems.length}</span>
                            )}
                          </Link>
                          <Link
                            to="/cart"
                            className={styles.dropdownItem}
                            onClick={() => handleUserMenuClick()}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Cart</span>
                            {totalItems > 0 && (
                              <span className={styles.itemCount}>{totalItems}</span>
                            )}
                          </Link>
                        </>
                      )}

                      {user.role === 'admin' && (
                        <>
                          <Link
                            to="/admin/vendor-applications"
                            className={styles.dropdownItem}
                            onClick={() => handleUserMenuClick()}
                          >
                            <Store className="h-4 w-4" />
                            <span>Vendor Applications</span>
                          </Link>
                          <Link
                            to="/admin/promotions"
                            className={styles.dropdownItem}
                            onClick={() => handleUserMenuClick()}
                          >
                            <Sparkles className="h-4 w-4" />
                            <span>Promotions</span>
                          </Link>
                        </>
                      )}

                      {user.role === 'vendor' && (
                        <Link
                          to="/vendor/add-product"
                          className={styles.dropdownItem}
                          onClick={() => handleUserMenuClick()}
                        >
                          <Store className="h-4 w-4" />
                          <span>Add Product</span>
                        </Link>
                      )}

                      <div className={styles.dropdownDivider}></div>

                      <a 
                        href="#about" 
                        className={styles.dropdownItem}
                        onClick={() => handleUserMenuClick()}
                      >
                        <Info className="h-4 w-4" />
                        <span>About</span>
                      </a>
                      <a 
                        href="#contact" 
                        className={styles.dropdownItem}
                        onClick={() => handleUserMenuClick()}
                      >
                        <Phone className="h-4 w-4" />
                        <span>Contact</span>
                      </a>

                      <div className={styles.dropdownDivider}></div>

                      <button
                        onClick={() => handleUserMenuClick(handleLogout)}
                        className={styles.dropdownButton}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className={styles.actionButton} aria-label="Login">
                  <User className="h-5 w-5" />
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className={styles.mobileMenuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className={styles.mobileSearchBar}>
            <div className={styles.mobileSearchContainer}>
              <SmartSearch onSearch={handleSearch} />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenuOverlay} onClick={() => setIsMenuOpen(false)}>
            <div 
              className={styles.mobileMenu} 
              ref={mobileMenuRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.mobileNavLinks}>
                <button 
                  onClick={() => handleMobileNavClick('/')} 
                  className={styles.mobileNavLink}
                >
                  <span>Home</span>
                </button>
                <button 
                  onClick={() => handleMobileNavClick('/shop')} 
                  className={styles.mobileNavLink}
                >
                  <span>Shop</span>
                </button>
                <button 
                  onClick={() => handleMobileNavClick('/categories')} 
                  className={styles.mobileNavLink}
                >
                  <span>Categories</span>
                </button>
                <button 
                  onClick={() => handleMobileNavClick('/ar-showroom')} 
                  className={styles.mobileNavLink}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AR Showroom</span>
                </button>
                <button 
                  onClick={() => handleMobileNavClick('/social')} 
                  className={styles.mobileNavLink}
                >
                  <Users className="h-4 w-4" />
                  <span>Social</span>
                </button>
                {!user && (
                  <button 
                    onClick={() => handleMobileNavClick('/vendor/signup')} 
                    className={styles.mobileNavLink}
                  >
                    <Store className="h-4 w-4" />
                    <span>Become a Vendor</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay for Tablet */}
      {isSearchOpen && (
        <div className={styles.searchOverlay} onClick={() => setIsSearchOpen(false)}>
          <div 
            className={styles.searchOverlayContent} 
            ref={searchOverlayRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.searchOverlayHeader}>
              <div className={styles.searchOverlayLogo}>
                <Link to="/" className={styles.logoLink}>
                  <span className={styles.logoText}>LUXE</span>
                </Link>
              </div>
              <div className={styles.searchOverlaySearch}>
                <SmartSearch onSearch={handleSearch} autoFocus />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className={styles.searchOverlayClose}
                aria-label="Close Search"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;