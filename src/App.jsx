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
import DealsPage from './pages/DealsPage';
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
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
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

// Route Guard for Owner/Admin only pages
function AdminOnlyRoute({ element }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-red-200 text-center max-w-md mx-auto my-12 space-y-3 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 font-bold text-lg">
          !
        </div>
        <h3 className="text-base font-bold text-gray-900">Owner Access Required</h3>
        <p className="text-xs text-gray-500">
          This management section is restricted to the store owner (Muhammad Akash). Staff accounts do not have authorization to view or modify store configurations, financial analytics, or personnel.
        </p>
      </div>
    );
  }
  return element;
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
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="branches" element={<AdminOnlyRoute element={<AdminBranchesPage />} />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="staff" element={<AdminOnlyRoute element={<AdminStaffPage />} />} />
          <Route path="riders" element={<AdminOnlyRoute element={<AdminRidersPage />} />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="questions" element={<AdminQuestionsPage />} />
          <Route path="tickets" element={<AdminTicketsPage />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="analytics" element={<AdminOnlyRoute element={<AdminAnalyticsPage />} />} />
          <Route path="banners" element={<AdminOnlyRoute element={<AdminBannersPage />} />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="logs" element={<AdminOnlyRoute element={<AdminActivityLogPage />} />} />
          <Route path="settings" element={<AdminOnlyRoute element={<AdminSettingsPage />} />} />
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
          <Route path="/trending" element={<CategoryPage explicitCategorySlug="trending" />} />
          <Route path="/trending-items" element={<CategoryPage explicitCategorySlug="trending" />} />
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
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/offers" element={<DealsPage />} />
          <Route path="/wishlist" element={<CustomerWishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/outlets" element={<LocationsPage />} />
          <Route path="/branches" element={<LocationsPage />} />
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
