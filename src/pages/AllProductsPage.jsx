import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Sparkles, X, SlidersHorizontal, PlusCircle, Phone, ArrowUpDown, Check, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';

export default function AllProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || 'all';

  const { products } = useStore();
  const { isAdmin } = useAuth();
  const { isUrdu } = useLanguage();

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyHalalCertified, setOnlyHalalCertified] = useState(false);
  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchFromUrl]);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    for (const p of products) {
      const c = p.category?.toLowerCase() || 'other';
      counts[c] = (counts[c] || 0) + 1;
    }
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Price filter
      const effectivePrice = p.discountPrice || p.price;
      if (effectivePrice > maxPrice) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesUrdu = p.urduName?.includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesSub = p.subCategory?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesUrdu && !matchesCategory && !matchesSub && !matchesDesc) {
          return false;
        }
      }
      // Stock filter
      if (onlyInStock && p.stockStatus !== 'in_stock') {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') {
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      } else if (sortBy === 'price_high') {
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      } else if (sortBy === 'rating') {
        return (b.rating || 5) - (a.rating || 5);
      } else if (sortBy === 'newest') {
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, onlyInStock, maxPrice, sortBy, products]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOnlyInStock(false);
    setOnlyHalalCertified(false);
    setMaxPrice(10000);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header (Suleman Sweets Standard) */}
        <div className="text-center space-y-1.5 py-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#07643D]">
            {isUrdu ? 'تمام مصنوعات کی خریداری' : 'Shop All Products'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
            {isUrdu 
              ? 'روایتی مٹھائیاں، تازہ بیکری، راشن اور روزمرہ ضروریات کی مکمل کلیکشن' 
              : 'Browse our complete collection of traditional sweets, bakery, and daily essentials'}
          </p>
        </div>

        {/* Search Bar - Suleman Sweets style placeholder */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for sweets, cakes, bakery items..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:border-[#07643D] focus:ring-2 focus:ring-[#07643D]/10 outline-none bg-white shadow-2xs"
            />
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Chips (Shop by Category) */}
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600 px-1">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#07643D]"></span>
              {isUrdu ? 'کیٹیگری منتخب کریں:' : 'Shop by Category'}
            </span>
            <span className="text-[11px] text-[#07643D] font-mono">{filteredProducts.length} Products</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#07643D] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-[#07643D] border border-stone-200'
              }`}
            >
              {isUrdu ? 'تمام' : 'All'}
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`text-xs px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory.toLowerCase() === c.slug.toLowerCase()
                    ? 'bg-[#07643D] text-white shadow-xs'
                    : 'bg-stone-50 text-stone-700 hover:bg-emerald-50 hover:text-[#07643D] border border-stone-200'
                }`}
              >
                {c.badge?.includes('Viral') ? '🔥 ' : ''}
                {isUrdu ? (c.urduName || c.name) : c.name} {categoryCounts[c.slug] || 0}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Main Layout: Left Sidebar + Right Products Grid (Exact Screenshot 4 Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Sidebar Filters (Screenshot 4) */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
            
            {/* Categories Pills Group */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                {isUrdu ? 'کیٹیگریز' : 'Categories'}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#07643D] text-white font-bold'
                      : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer ${
                      selectedCategory.toLowerCase() === c.slug.toLowerCase()
                        ? 'bg-[#07643D] text-white font-bold'
                        : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="ml-1 text-[11px] text-stone-400">({categoryCounts[c.slug] || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters Header + Clear All */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                {isUrdu ? 'فلٹرز' : 'Filters'}
              </h3>
              {(selectedCategory !== 'all' || searchQuery || onlyInStock || onlyHalalCertified || maxPrice < 10000 || sortBy !== 'featured') && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-stone-500 hover:text-stone-900 font-semibold cursor-pointer underline"
                >
                  {isUrdu ? 'ری سیٹ کریں' : 'Clear All'}
                </button>
              )}
            </div>

            {/* Price Range Slider (PKR 0 to PKR 10,000) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-stone-800">
                  {isUrdu ? 'قیمت کی حد' : 'Price Range'}
                </label>
                <span className="font-mono font-bold text-[#07643D]">
                  Rs. {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="10000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#07643D] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                <span>PKR 0</span>
                <span>PKR 10,000</span>
              </div>
            </div>

            {/* Availability Radio / Checkbox */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {isUrdu ? 'دستیابی' : 'Availability'}
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-[#07643D] focus:ring-[#07643D] accent-[#07643D]"
                  />
                  <span>{isUrdu ? 'صرف دستیاب آئٹمز' : 'In Stock Only'}</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyHalalCertified}
                    onChange={(e) => setOnlyHalalCertified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#07643D] focus:ring-[#07643D] accent-[#07643D]"
                  />
                  <span>{isUrdu ? '100% حلال و خالص دیسی گھی' : 'Halal Certified & Pure Desi Ghee'}</span>
                </label>
              </div>
            </div>

            {/* Sort By Radio Group */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {isUrdu ? 'ترتیب دیں' : 'Sort By'}
              </h4>
              <div className="space-y-2 text-xs text-stone-700">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value="featured"
                    checked={sortBy === 'featured'}
                    onChange={() => setSortBy('featured')}
                    className="w-4 h-4 text-[#07643D] accent-[#07643D]"
                  />
                  <span>Featured &amp; Best Sellers</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value="price_low"
                    checked={sortBy === 'price_low'}
                    onChange={() => setSortBy('price_low')}
                    className="w-4 h-4 text-[#07643D] accent-[#07643D]"
                  />
                  <span>Price: Low to High</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value="price_high"
                    checked={sortBy === 'price_high'}
                    onChange={() => setSortBy('price_high')}
                    className="w-4 h-4 text-[#07643D] accent-[#07643D]"
                  />
                  <span>Price: High to Low</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value="rating"
                    checked={sortBy === 'rating'}
                    onChange={() => setSortBy('rating')}
                    className="w-4 h-4 text-[#07643D] accent-[#07643D]"
                  />
                  <span>Highest Rated</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value="newest"
                    checked={sortBy === 'newest'}
                    onChange={() => setSortBy('newest')}
                    className="w-4 h-4 text-[#07643D] accent-[#07643D]"
                  />
                  <span>Newest First</span>
                </label>
              </div>
            </div>

            {/* Need Direct Advice */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
              <span className="font-bold text-stone-800 block">Need Order Advice?</span>
              <p className="text-[11px]">Chat with our sweet masters directly for fresh morning recommendations.</p>
              <a
                href="https://wa.me/923227434080"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-[#07643D] font-bold hover:underline"
              >
                WhatsApp: 0322 7434080
              </a>
            </div>

          </div>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Active Filters Pill Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-2xl border border-stone-200 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-stone-500">Active Filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#07643D] font-semibold border border-emerald-200">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')} className="cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {onlyInStock && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                    In Stock Only
                    <button onClick={() => setOnlyInStock(false)} className="cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory === 'all' && !searchQuery && !onlyInStock && (
                  <span className="text-stone-400">None (Showing all items)</span>
                )}
              </div>

              <div className="text-stone-500 font-mono text-[11px]">
                Showing <strong className="text-stone-900">{filteredProducts.length}</strong> items
              </div>
            </div>

            {/* Products Grid with 3-button cards */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">No matching products found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  We couldn't find any products matching your current search or filter criteria. Try clearing some filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#07643D] text-white text-xs font-bold hover:bg-[#043E26] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}