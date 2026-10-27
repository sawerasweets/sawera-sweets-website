import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Phone, 
  Clock, 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Bike,
  Heart,
  HelpCircle,
  ChevronDown,
  Tag,
  Gift,
  Building2,
  Store
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from '../customer/NotificationBell';

export default function Header() {
  const { totalItems, setIsCartOpen, wishlist } = useCart();
  const { searchQuery, setSearchQuery, categories } = useStore();
  const { user, logout, isAdmin, isStaff, isRider, isCustomer } = useAuth();
  const { t, isUrdu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-[#E5E7EB]">
      {/* Top Notification / Announcement Bar */}
      <div className="bg-[#07643D] text-white text-xs py-1.5 px-4 border-b border-[#043E26]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-[#D4AF37] text-[#07643D] font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              {isUrdu ? 'سرکاری اسٹور' : 'Official Helpline'}
            </span>
            <span className="text-emerald-100 flex items-center gap-1 font-medium">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>UAN / Helpline: <a href="tel:03227434080" className="font-mono text-white font-bold hover:underline">0322 7434080</a> | Call us anytime</span>
            </span>
            <span className="text-[#F4D375] font-semibold hidden md:inline">
              • Delivering across 240+ cities in Pakistan
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-100 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>5:30 AM - Midnight</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#D4AF37] font-bold">WhatsApp:</span>
              <a 
                href="https://wa.me/923227434080" 
                target="_blank" 
                rel="noreferrer"
                className="font-mono text-white font-bold hover:underline"
              >
                0322 7434080
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-md transition-transform group-hover:scale-105">
              <img 
                src="/images/logo/logo.jpg" 
                alt="Sawera Sweets & Bakers Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/logo.jpg";
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#07643D] font-serif">
                  Sawera
                </span>
                <span className="text-[10px] bg-[#07643D]/10 text-[#07643D] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider hidden sm:inline">
                  Mithai &amp; Mart
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`tracking-widest ${
                  isUrdu ? 'text-xs text-[#07643D] font-bold urdu-text' : 'text-[10px] sm:text-xs font-semibold text-[#D4AF37] uppercase'
                }`}>
                  {isUrdu ? 'سویرا سویٹس اینڈ بیکرز' : 'Sweets & Bakers'}
                </span>
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop & Tablet */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-lg mx-2 relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isUrdu ? 'مٹھائی، کیک، کریانہ راشن، عطر تلاش کریں...' : 'Search fresh sweets, cakes, grocery, attar, perfumes...'}
                className="w-full pl-9 pr-24 py-2 rounded-full border border-gray-300 focus:border-[#07643D] focus:ring-2 focus:ring-[#07643D]/20 outline-none text-xs transition-all bg-gray-50/50 hover:bg-white focus:bg-white"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-semibold transition-colors flex items-center gap-1"
              >
                {t('searchButton')}
              </button>
            </div>
          </form>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* In-app Notification Bell */}
            <NotificationBell />

            {/* User Account Dropdown */}
            <div className="relative" ref={accountRef}>
              {user ? (
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-gray-300 hover:border-[#07643D] text-gray-700 hover:bg-gray-50 transition-colors text-xs font-semibold"
                >
                  <div className="w-7 h-7 rounded-full bg-[#07643D] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#07643D] hover:bg-emerald-100 border border-[#07643D]/30 text-xs font-bold transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('login')}</span>
                </Link>
              )}

              {/* Dropdown Menu */}
              {user && accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 text-xs">
                  <div className="px-4 py-2.5 border-b border-gray-100 bg-[#FDFBF7]">
                    <p className="font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#07643D]/10 text-[#07643D]">
                      Role: {user.role?.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Customer Links */}
                  {isCustomer && (
                    <>
                      <Link
                        to="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 text-[#07643D]" />
                        <span>My Account</span>
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4 text-[#07643D]" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/account/addresses"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <MapPin className="w-4 h-4 text-[#07643D]" />
                        <span>Saved Addresses</span>
                      </Link>
                      <Link
                        to="/account/wishlist"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>My Wishlist</span>
                      </Link>
                    </>
                  )}

                  {/* Admin & Staff Shortcuts */}
                  {(isAdmin || isStaff) && (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-emerald-800 font-bold hover:bg-emerald-50 bg-emerald-50/50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#07643D]" />
                        <span>Admin Panel</span>
                      </Link>
                      <Link
                        to="/admin/orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4 text-[#07643D]" />
                        <span>Manage Orders</span>
                      </Link>
                    </>
                  )}

                  {/* Rider Shortcuts */}
                  {isRider && (
                    <Link
                      to="/rider"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-emerald-800 font-bold hover:bg-emerald-50 bg-emerald-50/50"
                    >
                      <Bike className="w-4 h-4 text-[#07643D]" />
                      <span>Rider Dashboard</span>
                    </Link>
                  )}

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              aria-label="View Wishlist"
              className="relative p-2 rounded-full hover:bg-rose-50 text-neutral-600 hover:text-rose-600 transition-colors border border-gray-200"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
              {wishlist?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
              className="relative p-2 sm:px-3.5 sm:py-2 rounded-full bg-[#FDFBF7] hover:bg-[#F5EFE6] border border-[#D4AF37]/60 text-[#07643D] flex items-center gap-2 transition-all shadow-sm group"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#07643D] group-hover:scale-110 transition-transform" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">{t('cart')}</span>
                <span className="text-xs font-bold text-[#07643D]">
                  {totalItems > 0 ? `${totalItems} items` : 'Empty'}
                </span>
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 sm:static w-5 h-5 rounded-full bg-[#D4AF37] text-[#07643D] font-bold text-xs flex items-center justify-center border-2 border-white shadow">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-[#07643D] hover:bg-gray-100 md:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'مٹھائی، کیک، کریانہ راشن تلاش کریں...' : 'Search sweets, bakery, grocery...'}
              className="w-full pl-9 pr-20 py-2 rounded-full border border-gray-300 text-xs focus:border-[#07643D] outline-none bg-gray-50"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 rounded-full bg-[#07643D] text-white text-[11px] font-semibold"
            >
              {t('searchButton')}
            </button>
          </form>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop - Suleman Sweets Benchmark) */}
      <nav className="hidden md:block bg-[#07643D] text-white border-t border-[#043E26]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs">
          <div className="flex items-center overflow-x-auto scrollbar-none py-1.5 gap-1 lg:gap-2">
            <Link
              to="/"
              className="px-2.5 py-1 rounded-md text-xs font-bold text-white hover:bg-[#043E26] transition-colors flex-shrink-0"
            >
              {isUrdu ? 'ہوم' : 'Home'}
            </Link>

            <Link
              to="/products"
              className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-[#07643D] hover:bg-[#F4D375] transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-2xs"
            >
              <Sparkles className="w-3 h-3" />
              {t('allProducts')}
            </Link>

            <Link
              to="/mithai-box-studio"
              className="px-3 py-1 rounded-md text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-300 text-emerald-950 hover:brightness-105 transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm border border-amber-200"
            >
              <Gift className="w-3.5 h-3.5 text-emerald-900 fill-amber-400" />
              <span>{isUrdu ? 'مٹھائی بکس اسٹوڈیو' : 'Mithai Box Studio'}</span>
              <span className="text-[9px] bg-emerald-900 text-amber-200 px-1 py-0.2 rounded uppercase tracking-wider font-extrabold">NEW</span>
            </Link>

            <Link
              to="/deals"
              className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1 flex-shrink-0 shadow-xs"
            >
              <Tag className="w-3 h-3 text-amber-300" />
              <span>{isUrdu ? 'ڈیلز اور آفرز' : 'Hot Deals'}</span>
              <span className="text-[9px] bg-amber-400 text-red-950 px-1 py-0.2 rounded font-extrabold">HOT</span>
            </Link>

            <Link
              to="/outlets"
              className="px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-100 hover:text-white hover:bg-[#043E26] transition-colors whitespace-nowrap flex items-center gap-1 flex-shrink-0"
            >
              <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isUrdu ? 'ہماری برانچز' : 'Our Outlets'}</span>
            </Link>

            <Link
              to="/track-order"
              className="px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-100 hover:text-white hover:bg-[#043E26] transition-colors whitespace-nowrap flex items-center gap-1 flex-shrink-0"
            >
              <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isUrdu ? 'آرڈر ٹریکنگ' : 'Track Order'}</span>
            </Link>

            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-100 hover:text-white hover:bg-[#043E26] transition-colors whitespace-nowrap flex-shrink-0"
              >
                {isUrdu && cat.urduName ? cat.urduName : cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 text-emerald-200 text-xs flex-shrink-0">
            <Link to="/about" className="hover:text-white transition-colors">{t('aboutUs')}</Link>
            <span className="text-emerald-500">•</span>
            <Link to="/faq" className="hover:text-white transition-colors">{t('faq')}</Link>
            <span className="text-emerald-500">•</span>
            <Link to="/contact" className="hover:text-white transition-colors">{t('contactUs')}</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Sliding Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          {/* Mithai Box Studio Feature Pill */}
          <Link
            to="/mithai-box-studio"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3 rounded-xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white flex items-center justify-between border border-amber-400/40 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-200 font-serif">
                  {isUrdu ? 'سویرا مٹھائی بکس اسٹوڈیو' : 'Mithai Box Studio'}
                </div>
                <div className="text-[10px] text-emerald-200">
                  {isUrdu ? 'اپنی مرضی کا شاہی بکس تیار کریں' : 'Custom Assortment Box'}
                </div>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full">
              NEW
            </span>
          </Link>

          {/* Hot Deals & Offers Pill */}
          <Link
            to="/deals"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 rounded-xl bg-red-50 text-red-700 flex items-center justify-between border border-red-200 font-bold text-xs"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-red-600" />
              <span>{isUrdu ? 'ہاٹ ڈیلز اور اسپیشل آفرز' : 'Hot Deals & Offers'}</span>
            </div>
            <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">
              Save Up to 25%
            </span>
          </Link>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">
            {isUrdu ? 'کیٹیگریز' : 'Categories'}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-emerald-50 text-[#07643D] font-bold text-xs flex items-center justify-between border border-emerald-100"
            >
              <span>{t('allProducts')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-gray-50 text-gray-800 hover:bg-emerald-50 hover:text-[#07643D] text-xs font-medium flex items-center justify-between border border-gray-100"
              >
                <span>{isUrdu && cat.urduName ? cat.urduName : cat.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 text-xs space-y-2 text-gray-600">
            <Link to="/outlets" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-1 font-medium hover:text-[#07643D]">
              <span className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-[#07643D]" />
                {isUrdu ? 'ہماری برانچز' : 'Our Outlets & Hubs'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
            <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between py-1 font-medium hover:text-[#07643D]">
              <span className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-[#07643D]" />
                {t('trackOrder')}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-medium hover:text-[#07643D]">
              {t('aboutUs')}
            </Link>
            <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-medium hover:text-[#07643D]">
              {t('faq')}
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 font-medium hover:text-[#07643D]">
              {t('contactUs')}
            </Link>
          </div>

          <div className="p-3 bg-[#FDFBF7] rounded-lg border border-[#D4AF37]/30 text-xs">
            <div className="font-bold text-[#07643D] mb-1">Orders &amp; Inquiry:</div>
            <div className="font-mono text-gray-700">0322 7434080 (Call &amp; WhatsApp)</div>
            <div className="text-[11px] text-gray-500 mt-1">Gojra Road, Opposite DHQ Hospital, Jhang</div>
          </div>
        </div>
      )}
    </header>
  );
}
