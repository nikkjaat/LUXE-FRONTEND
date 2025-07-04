import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VendorSignupPage from './pages/VendorSignupPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import CategoriesPage from './pages/CategoriesPage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SocialPage from './pages/SocialPage';
import ARShowroom from './pages/ARShowroom';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorApplications from './pages/admin/VendorApplications';
import PromotionManagement from './pages/admin/PromotionManagement';
import VendorDashboard from './pages/vendor/VendorDashboard';
import AddProduct from './pages/vendor/AddProduct';
import RoleBasedRoute from './components/RoleBasedRoute';
import PromotionBanner from './components/PromotionBanner';
import LiveChat from './components/LiveChat';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductProvider } from './context/ProductContext';
import { VendorProvider } from './context/VendorContext';
import { NotificationProvider } from './context/NotificationContext';
import { PromotionProvider } from './context/PromotionContext';
import { ReviewProvider } from './context/ReviewContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { AIProvider } from './context/AIContext';
import { SocialProvider } from './context/SocialContext';
import { ARProvider } from './context/ARContext';

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <Testimonials />
      <Newsletter />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AIProvider>
        <SocialProvider>
          <ARProvider>
            <NotificationProvider>
              <PromotionProvider>
                <ReviewProvider>
                  <AnalyticsProvider>
                    <ProductProvider>
                      <VendorProvider>
                        <CartProvider>
                          <WishlistProvider>
                            <Router>
                              <div className="min-h-screen bg-white">
                                <PromotionBanner />
                                <Header />
                                <Routes>
                                  {/* Public Routes */}
                                  <Route path="/" element={<HomePage />} />
                                  <Route path="/login" element={<LoginPage />} />
                                  <Route path="/signup" element={<SignupPage />} />
                                  <Route path="/vendor/signup" element={<VendorSignupPage />} />
                                  <Route path="/shop" element={<ShopPage />} />
                                  <Route path="/product/:id" element={<ProductDetailPage />} />
                                  <Route path="/categories" element={<CategoriesPage />} />
                                  <Route path="/social" element={<SocialPage />} />
                                  <Route path="/ar-showroom" element={<ARShowroom />} />
                                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                                  
                                  {/* User Routes */}
                                  <Route 
                                    path="/cart" 
                                    element={
                                      <RoleBasedRoute allowedRoles={['user']}>
                                        <CartPage />
                                      </RoleBasedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="/profile" 
                                    element={
                                      <RoleBasedRoute allowedRoles={['user']}>
                                        <ProfilePage />
                                      </RoleBasedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="/wishlist" 
                                    element={
                                      <RoleBasedRoute allowedRoles={['user']}>
                                        <WishlistPage />
                                      </RoleBasedRoute>
                                    } 
                                  />
                                  
                                  {/* Admin Routes */}
                                  <Route 
                                    path="/admin/dashboard" 
                                    element={
                                      <RoleBasedRoute allowedRoles={['admin']}>
                                        <AdminDashboard />
                                      </RoleBasedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="/admin/vendor-applications" 
                                    element={
                                      <RoleBasedRoute allowedRoles={['admin']}>
                                        <VendorApplications />
                                      </RoleBasedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="/admin/promotions" 
                                    element={
                                      <RoleBasedRoute allowedRoles={['admin']}>
                                        <PromotionManagement />
                                      </RoleBasedRoute>
                                    } 
                                  />
                                  
                                  {/* Vendor Routes */}
                                  <Route 
                                    path="/vendor/dashboard" 
                                    element={
                                      <RoleBasedRoute allowedRoles={['vendor']}>
                                        <VendorDashboard />
                                      </RoleBasedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="/vendor/add-product" 
                                    element={
                                      <RoleBasedRoute allowedRoles={['vendor']}>
                                        <AddProduct />
                                      </RoleBasedRoute>
                                    } 
                                  />
                                </Routes>
                                <Footer />
                                <LiveChat />
                              </div>
                            </Router>
                          </WishlistProvider>
                        </CartProvider>
                      </VendorProvider>
                    </ProductProvider>
                  </AnalyticsProvider>
                </ReviewProvider>
              </PromotionProvider>
            </NotificationProvider>
          </ARProvider>
        </SocialProvider>
      </AIProvider>
    </AuthProvider>
  );
}

export default App;