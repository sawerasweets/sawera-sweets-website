import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Sparkles, X, SlidersHorizontal, PlusCircle, Phone } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';

export default function AllProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  const { products } = useStore();
  const { isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchFromUrl]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
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
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, onlyInStock, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOnlyInStock(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#07643D]">
              All Products Catalog
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Browse our complete catalog of authentic sweets, fresh bakery, groceries, cosmetics, and perfumes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-[#07643D] border border-emerald-200">
              {filteredProducts.length} Items Available
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          
          {/* Top Row: Search Input & Sort */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, ingredient, category..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-[#07643D] focus:ring-1 focus:ring-[#07643D] outline-none bg-gray-50/50"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-semibold text-gray-700 outline-none focus:border-[#07643D]"
              >
                <option value="featured">Featured First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#07643D] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === c.slug
                    ? 'bg-[#07643D] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

        </div>

        {/* Active Filter Indicators */}
        {(searchQuery || selectedCategory !== 'all' || onlyInStock) && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-gray-500 font-medium">Active filters:</span>
            {searchQuery && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#07643D] border border-emerald-200 flex items-center gap-1">
                Keyword: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#07643D] border border-emerald-200 flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-red-600 hover:underline font-semibold ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-10 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#07643D] flex items-center justify-center mx-auto border border-[#D4AF37]/30">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            </div>

            {products.length === 0 ? (
              <>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Store Catalog in Preparation</h3>
                  <p className="urdu-text text-[#A5841D] font-bold text-sm">تمام شعبہ جات کی پروڈکٹس جلد شامل کی جا رہی ہیں</p>
                </div>
                <p className="text-xs text-gray-500">
                  Muhammad Akash is currently adding fresh stock and prices to the catalog. You can order directly via phone or WhatsApp.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <a
                    href="https://wa.me/923471702710"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-[#07643D] hover:bg-[#043E26] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>WhatsApp (0347 1702710)</span>
                  </a>
                  {isAdmin && (
                    <Link
                      to="/admin/products"
                      className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F4D375] text-[#07643D] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Add Products</span>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-gray-900">No matching products</h3>
                <p className="text-xs text-gray-500">
                  We couldn't find any products matching your filters. Try adjusting your search query or reset filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-[#07643D] hover:bg-[#043E26] text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Clear All Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
