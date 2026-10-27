import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Sparkles, X, SlidersHorizontal, PlusCircle, Phone, ArrowUpDown } from 'lucide-react';
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
  const [maxPrice, setMaxPrice] = useState(5000);

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
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, onlyInStock, maxPrice, sortBy, products]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOnlyInStock(false);
    setMaxPrice(5000);
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

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'مٹھائی، کیک، حلوہ، چپس یا بسکٹس تلاش کریں...' : 'Search for sweets, cakes, halwa, bakery items, trending snacks...'}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-gray-200 text-xs sm:text-sm focus:border-[#07643D] focus:ring-2 focus:ring-[#07643D]/10 outline-none bg-white shadow-xs"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Chips (Shop by Category) */}
        <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-600 px-1">
            <span>{isUrdu ? 'کیٹیگری منتخب کریں:' : 'Shop by Category:'}</span>
            <span className="text-[11px] text-[#07643D] font-mono">{filteredProducts.length} Products</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#07643D] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-[#07643D]'
              }`}
            >
              {isUrdu ? 'تمام کیٹیگریز' : 'All'} ({categoryCounts.all || 0})
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory.toLowerCase() === c.slug.toLowerCase()
                    ? 'bg-[#07643D] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-[#07643D]'
                }`}
              >
                {c.badge?.includes('Viral') ? '🔥 ' : ''}
                {isUrdu ? (c.urduName || c.name) : c.name} ({categoryCounts[c.slug] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Main Layout: Left Sidebar + Right Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Sidebar Filters */}
          <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#07643D]" />
                {isUrdu ? 'فلٹرز' : 'Filters'}
              </span>
              {(selectedCategory !== 'all' || searchQuery || onlyInStock || maxPrice < 5000) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  {isUrdu ? 'ری سیٹ کریں' : 'Clear All'}
                </button>
              )}
            </div>

            {/* Categories List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 block">
                {isUrdu ? 'کیٹیگریز' : 'Categories'}
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-50 text-[#07643D] font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{isUrdu ? 'تمام مصنوعات' : 'All Categories'}</span>
                  <span className="font-mono text-[10px] text-gray-400">({categoryCounts.all || 0})</span>
                </button>
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                      selectedCategory.toLowerCase() === c.slug.toLowerCase()
                        ? 'bg-emerald-50 text-[#07643D] font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{isUrdu ? (c.urduName || c.name) : c.name}</span>
                    <span className="font-mono text-[10px] text-gray-400">({categoryCounts[c.slug] || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-gray-800">
                  {isUrdu ? 'قیمت کی حد' : 'Price Range'}
                </label>
                <span className="font-mono font-bold text-[#07643D]">
                  Up to Rs. {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#07643D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>PKR 0</span>
                <span>PKR 5,000+</span>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-800 block">
                {isUrdu ? 'دستیابی' : 'Availability'}
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#07643D] focus:ring-[#07643D]"
                />
                <span>{isUrdu ? 'صرف دستیاب آئٹمز (In Stock Only)' : 'In Stock Only'}</span>
              </label>
            </div>

            {/* Sort Options */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-800 block">
                {isUrdu ? 'ترتیب دیں' : 'Sort By'}
              </label>
              <div className="space-y-1 text-xs text-gray-700">
                {[
                  { id: 'featured', label: isUrdu ? 'نمایاں اشیاء' : 'Featured First' },
                  { id: 'price_low', label: isUrdu ? 'قیمت: کم سے زیادہ' : 'Price: Low to High' },
                  { id: 'price_high', label: isUrdu ? 'قیمت: زیادہ سے کم' : 'Price: High to Low' },
                  { id: 'rating', label: isUrdu ? 'بہترین ریٹنگ' : 'Highest Rated' },
                  { id: 'name', label: isUrdu ? 'نام A to Z' : 'Name: A to Z' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="radio"
                      name="sort_by"
                      value={opt.id}
                      checked={sortBy === opt.id}
                      onChange={() => setSortBy(opt.id)}
                      className="text-[#07643D] focus:ring-[#07643D]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Active Filter Chips & Results Count Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-gray-200/80 shadow-2xs text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-gray-500 font-medium">
                  {isUrdu ? 'ایکٹو فلٹرز:' : 'Active filters:'}
                </span>

                {selectedCategory !== 'all' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#07643D] border border-emerald-200 flex items-center gap-1 font-bold">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-red-500 cursor-pointer"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {searchQuery && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#07643D] border border-emerald-200 flex items-center gap-1 font-bold">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500 cursor-pointer"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {onlyInStock && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#07643D] border border-emerald-200 flex items-center gap-1 font-bold">
                    In Stock
                    <button onClick={() => setOnlyInStock(false)} className="hover:text-red-500 cursor-pointer"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {(selectedCategory !== 'all' || searchQuery || onlyInStock) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-rose-600 hover:underline font-bold ml-1 cursor-pointer"
                  >
                    {isUrdu ? 'تمام ختم کریں' : 'Clear all'}
                  </button>
                )}
              </div>

              <span className="text-gray-500 font-mono text-[11px]">
                {filteredProducts.length} {isUrdu ? 'پروڈکٹس دستیاب' : 'products found'}
              </span>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#07643D] flex items-center justify-center mx-auto border border-[#D4AF37]/30">
                  <Sparkles className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {isUrdu ? 'کوئی پراڈکٹ نہیں ملی' : 'No matching products found'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    {isUrdu 
                      ? 'براہ کرم سرچ کیورڈ تبدیل کریں یا فلٹرز ری سیٹ کریں۔' 
                      : 'Try adjusting your search terms or reset filters to view all products.'}
                  </p>
                </div>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-[#07643D] hover:bg-[#043E26] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {isUrdu ? 'تمام فلٹرز ری سیٹ کریں' : 'Clear All Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
