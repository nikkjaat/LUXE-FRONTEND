import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, Settings, Store, Sparkles, Users, Phone, Info, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import NotificationDropdown from '../NotificationDropdown';
import SmartSearch from '../SmartSearch';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user menu if clicking outside
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      
      // Close mobile menu if clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (query) => {
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  const handleMobileNavClick = (path) => {
    setIsMenuOpen(false);
    if (path) {
      navigate(path);
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
            <Link to="/ar-showroom" className={styles.navLink}>
              <Sparkles className="h-4 w-4 inline mr-1" />
              AR Showroom
            </Link>
            <Link to="/social" className={styles.navLink}>
              <Users className="h-4 w-4 inline mr-1" />
              Social
            </Link>
            {!user && (
              <Link to="/vendor/signup" className={styles.navLink}>
                <Store className="h-4 w-4 inline mr-1" />
                Become a Vendor
              </Link>
            )}
          </nav>

          {/* Desktop Search Bar */}
          <div className={styles.searchContainer}>
            <SmartSearch onSearch={handleSearch} />
          </div>

          {/* Desktop Actions */}
          <div className={styles.desktopActions}>
            {/* Notifications */}
            {user && <NotificationDropdown />}

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
              <div className={styles.userMenu} ref={userMenuRef}>
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
                      <>
                        <Link
                          to="/admin/vendor-applications"
                          className={styles.dropdownItem}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Store className="h-4 w-4 mr-2" />
                          Vendor Applications
                        </Link>
                        <Link
                          to="/admin/promotions"
                          className={styles.dropdownItem}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Promotions
                        </Link>
                      </>
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
                    <div className={styles.dropdownDivider}></div>
                    <a href="#about" className={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                      <Info className="h-4 w-4 mr-2" />
                      About
                    </a>
                    <a href="#contact" className={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </a>
                    <div className={styles.dropdownDivider}></div>
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
          </div>

          {/* Mobile Actions */}
          <div className={styles.mobileActions}>
            {/* Mobile Search */}
            <div className={styles.mobileSearchContainer}>
              <SmartSearch onSearch={handleSearch} />
            </div>

            {/* Mobile User Menu */}
            {user ? (
              <div className={styles.userMenu} ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={styles.mobileUserButton}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={styles.avatar}
                  />
                </button>
                {isUserMenuOpen && (
                  <div className={styles.mobileDropdown}>
                    <Link
                      to={getDashboardLink()}
                      className={styles.dropdownItem}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {getDashboardLabel()}
                    </Link>
                    
                    {/* Mobile-specific items */}
                    {user?.role === 'user' && (
                      <>
                        <Link
                          to="/wishlist"
                          className={styles.dropdownItem}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Wishlist ({wishlistItems.length})
                        </Link>
                        <Link
                          to="/cart"
                          className={styles.dropdownItem}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Cart ({totalItems})
                        </Link>
                      </>
                    )}

                    {/* Notifications for mobile */}
                    <div className={styles.dropdownItem}>
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </div>

                    {user.role === 'admin' && (
                      <>
                        <Link
                          to="/admin/vendor-applications"
                          className={styles.dropdownItem}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Store className="h-4 w-4 mr-2" />
                          Vendor Applications
                        </Link>
                        <Link
                          to="/admin/promotions"
                          className={styles.dropdownItem}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Promotions
                        </Link>
                      </>
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
                    <div className={styles.dropdownDivider}></div>
                    <a href="#about" className={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                      <Info className="h-4 w-4 mr-2" />
                      About
                    </a>
                    <a href="#contact" className={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </a>
                    <div className={styles.dropdownDivider}></div>
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
          <div className={styles.mobileMenuOverlay}>
            <div className={styles.mobileMenu} ref={mobileMenuRef}>
              <div className={styles.mobileNavLinks}>
                <button 
                  onClick={() => handleMobileNavClick('/')} 
                  className={styles.mobileNavLink}
                >
                  Home
                </button>
                <button 
                  onClick={() => handleMobileNavClick('/shop')} 
                  className={styles.mobileNavLink}
                >
                  Shop
                </button>
                <button 
                  onClick={() => handleMobileNavClick('/categories')} 
                  className={styles.mobileNavLink}
                >
                  Categories
                </button>
                <button 
                  onClick={() => handleMobileNavClick('/ar-showroom')} 
                  className={styles.mobileNavLink}
                >
                  <Sparkles className="h-4 w-4 inline mr-2" />
                  AR Showroom
                </button>
                <button 
                  onClick={() => handleMobileNavClick('/social')} 
                  className={styles.mobileNavLink}
                >
                  <Users className="h-4 w-4 inline mr-2" />
                  Social
                </button>
                {!user && (
                  <button 
                    onClick={() => handleMobileNavClick('/vendor/signup')} 
                    className={styles.mobileNavLink}
                  >
                    <Store className="h-4 w-4 inline mr-2" />
                    Become a Vendor
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;