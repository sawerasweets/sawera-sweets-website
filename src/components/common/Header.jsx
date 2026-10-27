import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  ChevronDown,
  Tag,
  Gift,
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
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  
  const accountRef = useRef(null);
  const catRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCategoriesDropdownOpen(false);
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

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs border-b border-gray-100 font-sans">
      
      {/* 1. Slim Top Bar (Emerald Green & White - Suleman Sweets Benchmark) */}
      <div className="bg-[#07643D] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1 text-emerald-100">
              <Phone className="w-3.5 h-3.5 text-[#F4D375]" />
              <span className="hidden sm:inline">UAN / Helpline:</span>
              <a href="tel:03227434080" className="font-mono font-bold text-white hover:underline">
                0322 7434080
              </a>
              <span className="text-[#F4D375] font-semibold hidden md:inline">| Call us anytime</span>
            </span>
            <span className="text-emerald-300 hidden lg:inline">• Delivering across 240+ cities in Pakistan</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs text-emerald-100">
            <div className="hidden sm:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#F4D375]" />
              <span>5:30 AM - Midnight</span>
            </div>
            <a 
              href="https://wa.me/923227434080" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 font-mono text-white hover:underline"
            >
              <span className="text-[#F4D375] font-bold">WhatsApp:</span>
              <span>0322 7434080</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar (Clean White Background, Compact Logo, Links in same row) */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-4 lg:gap-6">
          
          {/* Logo & Brand Name - Compact & Elegant (No bulky giant logo) */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-xs flex-shrink-0">
              <img 
                src="/images/logo/logo.jpg" 
                alt="Sawera Sweets Logo" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/logo.jpg";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold font-serif text-[#07643D] leading-tight tracking-tight">
                Sawera
              </span>
              <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                {isUrdu ? 'سویرا سویٹس اینڈ بیکرز' : 'Sweets & Bakers'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Directly next to Logo (Suleman Sweets Benchmark) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-gray-700">
            
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                isActive('/') 
                  ? 'bg-[#07643D] text-white font-bold shadow-2xs' 
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              {isUrdu ? 'ہوم' : 'Home'}
            </Link>

            <Link
              to="/products"
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                isActive('/products') 
                  ? 'bg-[#07643D] text-white font-bold shadow-2xs' 
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              {isUrdu ? 'شاپ' : 'Shop'}
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={catRef}>
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
                  categoriesDropdownOpen ? 'bg-gray-100 text-[#07643D] font-bold' : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                <span>{isUrdu ? 'کیٹیگریز' : 'Categories'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {isUrdu ? 'تمام کیٹیگریز' : 'All Categories'}
                  </div>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      to={`/category/${c.slug}`}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-[#07643D] transition-colors"
                    >
                      <span>{isUrdu && c.urduName ? c.urduName : c.name}</span>
                      {c.badge?.includes('Viral') && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                          Viral
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      to="/products"
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="block px-3.5 py-1.5 text-xs font-bold text-[#07643D] hover:bg-emerald-50"
                    >
                      {isUrdu ? 'تمام مصنوعات دیکھیں →' : 'Browse All Products →'}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Mithai Box */}
            <Link
              to="/mithai-box-studio"
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive('/mithai-box-studio')
                  ? 'bg-[#07643D] text-white font-bold shadow-2xs'
                  : 'hover:bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isUrdu ? 'مٹھائی بکس اسٹوڈیو' : 'Custom Mithai Box'}</span>
            </Link>

            {/* Track Order */}
            <Link
              to="/track-order"
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
                isActive('/track-order')
                  ? 'bg-[#07643D] text-white font-bold shadow-2xs'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#07643D]" />
              <span>{isUrdu ? 'ٹریک آرڈر' : 'Track Order'}</span>
            </Link>

            {/* Hot Deals */}
            <Link
              to="/deals"
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
                isActive('/deals')
                  ? 'bg-[#07643D] text-white font-bold shadow-2xs'
                  : 'hover:bg-emerald-50 text-[#07643D]'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-[#07643D]" />
              <span>{isUrdu ? 'ڈیلز' : 'Deals'}</span>
            </Link>

            {/* Outlets */}
            <Link
              to="/outlets"
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
                isActive('/outlets')
                  ? 'bg-[#07643D] text-white font-bold shadow-2xs'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#07643D]" />
              <span>{isUrdu ? 'برانچز' : 'Outlets'}</span>
            </Link>

          </nav>

          {/* Right Action Icons: Language, Wishlist, User, Cart */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors relative"
            >
              <Heart className="w-4 h-4 text-gray-700" />
              {wishlist?.length > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account */}
            <div className="relative" ref={accountRef}>
              {user ? (
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-full border border-gray-200 hover:border-[#07643D] text-xs font-semibold text-gray-700 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#07643D] text-white flex items-center justify-center text-[11px] font-bold uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[80px] truncate">{user.name}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors flex items-center justify-center"
                  aria-label="Login"
                >
                  <User className="w-4 h-4 text-gray-700" />
                </Link>
              )}

              {/* Account Dropdown */}
              {user && accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  {isCustomer && (
                    <>
                      <Link to="/account" onClick={() => setAccountMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                        <User className="w-3.5 h-3.5 text-[#07643D]" />
                        <span>My Account</span>
                      </Link>
                      <Link to="/account/orders" onClick={() => setAccountMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                        <Package className="w-3.5 h-3.5 text-[#07643D]" />
                        <span>My Orders</span>
                      </Link>
                    </>
                  )}
                  {(isAdmin || isStaff) && (
                    <Link to="/admin" onClick={() => setAccountMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-emerald-800 font-bold hover:bg-emerald-50">
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#07643D]" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#07643D] border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#07643D]" />
              <span className="font-mono font-bold text-xs">{totalItems}</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-[#07643D] hover:bg-gray-100 lg:hidden cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-gray-800" />}
            </button>

          </div>

        </div>

        {/* 3. Sleek Full-Width Search Input Bar (Suleman Sweets Benchmark) */}
        <div className="mt-2.5">
          <form onSubmit={handleSearchSubmit} className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for sweets, cakes, bakery items..."
              className="w-full pl-10 pr-24 py-2.5 rounded-full border border-gray-200 focus:border-[#07643D] focus:ring-2 focus:ring-[#07643D]/10 outline-none text-xs sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-full bg-[#07643D] hover:bg-[#043E26] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

      </div>

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 animate-in fade-in">
          
          <Link
            to="/mithai-box-studio"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Gift className="w-5 h-5 text-amber-600" />
              <div>
                <div className="text-xs font-bold">{isUrdu ? 'مٹھائی بکس اسٹوڈیو' : 'Custom Mithai Box'}</div>
                <div className="text-[10px] text-amber-700">Custom Luxury Assortment</div>
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">NEW</span>
          </Link>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-800 font-semibold flex items-center justify-between"
            >
              <span>{isUrdu ? 'تمام مصنوعات' : 'All Products'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            <Link
              to="/deals"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-emerald-50 text-[#07643D] font-bold flex items-center justify-between"
            >
              <span>{isUrdu ? 'ڈیلز اور آفرز' : 'Hot Deals'}</span>
              <Tag className="w-3.5 h-3.5 text-[#07643D]" />
            </Link>

            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-800 font-semibold flex items-center justify-between"
            >
              <span>{isUrdu ? 'ٹریک آرڈر' : 'Track Order'}</span>
              <Package className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            <Link
              to="/outlets"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-800 font-semibold flex items-center justify-between"
            >
              <span>{isUrdu ? 'ہماری برانچز' : 'Outlets'}</span>
              <Store className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Categories
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/category/${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg text-gray-700 hover:bg-gray-50 truncate"
                >
                  {isUrdu && c.urduName ? c.urduName : c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link to="/faq" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </div>

        </div>
      )}

    </header>
  );
}