import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Providers
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import MobileNav from './components/common/MobileNav';
import CartDrawer from './components/common/CartDrawer';
import Toast from './components/common/Toast';
import LiveChatWidget from './components/customer/LiveChatWidget';

// Public Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import AllProductsPage from './pages/AllProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import MithaiBoxStudioPage from './pages/MithaiBoxStudioPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import LocationsPage from './pages/LocationsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import MaintenancePage from './pages/MaintenancePage';

// Customer & Auth Pages
import CustomerLoginPage from './pages/customer/CustomerLoginPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerOrdersPage from './pages/customer/CustomerOrdersPage';
import CustomerAddressesPage from './pages/customer/CustomerAddressesPage';
import CustomerWishlistPage from './pages/customer/CustomerWishlistPage';
import CustomerTicketsPage from './pages/customer/CustomerTicketsPage';

// Rider Portal
import RiderDashboard from './pages/rider/RiderDashboard';

// Admin Panel Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminBranchesPage from './pages/admin/AdminBranchesPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminStaffPage from './pages/admin/AdminStaffPage';
import AdminRidersPage from './pages/admin/AdminRidersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminTicketsPage from './pages/admin/AdminTicketsPage';
import AdminChatPage from './pages/admin/AdminChatPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminBannersPage from './pages/admin/AdminBannersPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminActivityLogPage from './pages/admin/AdminActivityLogPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Helper to scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Storefront Wrapper to conditionally display Header, Footer, and Floating Widgets
function StorefrontLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { user, isAdmin, isStaff } = useAuth();
  const { settings } = useStore();

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="branches" element={<AdminBranchesPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="staff" element={<AdminStaffPage />} />
          <Route path="riders" element={<AdminRidersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="questions" element={<AdminQuestionsPage />} />
          <Route path="tickets" element={<AdminTicketsPage />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="logs" element={<AdminActivityLogPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    );
  }

  // Maintenance Mode Gate:
  // If enabled, ordinary visitors see MaintenancePage, while Admin/Staff and /login remain accessible.
  if (settings?.maintenanceMode && !isAdmin && !isStaff && location.pathname !== '/login') {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1F2937]">
      {/* Global Customer Header */}
      <Header />

      {/* Main Storefront Content View */}
      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          {/* Public Store Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/sweets" element={<CategoryPage explicitCategorySlug="sweets" />} />
          <Route path="/bakery" element={<CategoryPage explicitCategorySlug="bakery" />} />
          <Route path="/grocery" element={<CategoryPage explicitCategorySlug="grocery" />} />
          <Route path="/cosmetics" element={<CategoryPage explicitCategorySlug="cosmetics" />} />
          <Route path="/perfumes" element={<CategoryPage explicitCategorySlug="perfumes" />} />
          <Route path="/beverages" element={<CategoryPage explicitCategorySlug="beverages" />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/mithai-box-studio" element={<MithaiBoxStudioPage />} />
          <Route path="/box-builder" element={<MithaiBoxStudioPage />} />
          <Route path="/wishlist" element={<CustomerWishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />

          {/* Authentication & Customer Portal */}
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/account" element={<CustomerDashboard />} />
          <Route path="/account/orders" element={<CustomerOrdersPage />} />
          <Route path="/account/addresses" element={<CustomerAddressesPage />} />
          <Route path="/account/wishlist" element={<CustomerWishlistPage />} />
          <Route path="/account/tickets" element={<CustomerTicketsPage />} />

          {/* Rider Portal */}
          <Route path="/rider" element={<RiderDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Floating Live Chat Widget */}
      <LiveChatWidget />

      {/* Toast Feedback */}
      <Toast />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <NotificationProvider>
              <BrowserRouter>
                <ScrollToTop />
                <StorefrontLayout />
              </BrowserRouter>
            </NotificationProvider>
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
