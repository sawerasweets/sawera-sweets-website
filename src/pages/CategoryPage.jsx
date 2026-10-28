import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, SlidersHorizontal, Sparkles, PlusCircle } from 'lucide-react';
import { CATEGORIES, getCategoryBySlug } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';

export default function CategoryPage({ explicitCategorySlug }) {
  const params = useParams();
  const categorySlug = explicitCategorySlug || params.categorySlug || 'sweets';
  
  const { products, categories } = useStore();
  const { isAdmin } = useAuth();

  const activeCategories = (categories || CATEGORIES).filter(c => c.isActive !== false);
  const category = (categories || []).find(c => c.slug === categorySlug || c.id === categorySlug) || getCategoryBySlug(categorySlug) || CATEGORIES[0];
  const isCategoryActive = category?.isActive !== false;

  const allCategoryProducts = useMemo(() => {
    return products.filter(p => p.category === category.slug && p.isActive !== false);
  }, [products, category.slug]);

  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setSelectedSubCategory('all');
  }, [categorySlug]);

  const filteredProducts = useMemo(() => {
    let list = [...allCategoryProducts];
    if (selectedSubCategory !== 'all') {
      list = list.filter(p => p.subCategory === selectedSubCategory);
    }
    if (sortBy === 'price_low') {
      list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [allCategoryProducts, selectedSubCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-[#07643D] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#07643D] transition-colors">Categories</Link>
          <span>/</span>
          <span className="font-bold text-[#07643D]">{category.name}</span>
        </div>

        {/* Category Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#043E26] via-[#07643D] to-[#0A4D3C] text-white p-6 sm:p-10 shadow-lg overflow-hidden border-2 border-[#D4AF37]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
            <span className="urdu-text text-8xl font-bold">{category.urduName}</span>
          </div>

          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#D4AF37] text-[#07643D] font-bold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {category.badge}
              </span>
              <span className="urdu-text text-[#F4D375] text-lg font-bold">
                {category.urduName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white tracking-tight">
              {category.name}
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xl">
              {category.description}
            </p>
          </div>

          {/* Category Visual Avatar */}
          {category.image && (
            <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-[#D4AF37] shadow-xl flex-shrink-0 bg-white/10">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/products/gulab-jamun.svg";
                }}
              />
            </div>
          )}
        </div>

        {/* Inactive Category Notice */}
        {!isCategoryActive && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-center space-y-2">
            <span className="inline-block px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
              Category Temporarily Paused / فی الوقت معطل
            </span>
            <h3 className="text-base font-bold text-gray-900">
              {category.name} is currently offline
            </h3>
            <p className="text-xs text-gray-600 max-w-lg mx-auto">
              This department has been temporarily turned off by store management. Please explore our other authentic sweets and fresh bakery treats.
            </p>
            <div className="pt-2">
              <Link to="/products" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#07643D] text-white rounded-xl text-xs font-semibold hover:bg-[#043E26] transition-colors">
                Browse All Available Products →
              </Link>
            </div>
            {isAdmin && (
              <p className="text-[11px] text-amber-800 font-bold mt-2">
                👑 Admin Notice: As an administrator, you are previewing these products below. Public visitors cannot see or purchase items from this paused category.
              </p>
            )}
          </div>
        )}

        {/* Subcategory Pills & Sort Bar and Product Grid - Only visible if Active or Admin */}
        {(isCategoryActive || isAdmin) && (
          <>
            {/* Subcategory Pills & Sort Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              
              {/* Subcategory Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedSubCategory('all')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedSubCategory === 'all'
                      ? 'bg-[#07643D] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Items ({allCategoryProducts.length})
                </button>

                {category.featuredSubcategories?.map((sub, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                      selectedSubCategory === sub
                        ? 'bg-[#07643D] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs self-end md:self-auto">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold text-gray-800 outline-none focus:border-[#07643D]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name">Product Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center max-w-md mx-auto space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#07643D] flex items-center justify-center mx-auto border border-[#D4AF37]/30">
                  <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900">
                    {selectedSubCategory !== 'all' ? `No items in ${selectedSubCategory}` : `No items in ${category.name} yet`}
                  </h3>
                  <p className="urdu-text text-[#A5841D] font-bold text-sm">
                    اس شعبہ کی تازہ مصنوعات جلد شامل کی جا رہی ہیں
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {selectedSubCategory !== 'all'
                    ? `No products found under "${selectedSubCategory}". Switch to another category or reset filter.`
                    : `We are currently updating stock for ${category.name}. Check back shortly or contact our shop on WhatsApp.`}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  {selectedSubCategory !== 'all' ? (
                    <button
                      onClick={() => setSelectedSubCategory('all')}
                      className="px-4 py-2 bg-[#07643D] text-white rounded-xl text-xs font-semibold"
                    >
                      Show All {category.name}
                    </button>
                  ) : (
                    <a
                      href="https://wa.me/923227434080"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#07643D] text-white rounded-xl text-xs font-semibold hover:bg-[#043E26] transition-colors"
                    >
                      Order on WhatsApp
                    </a>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin/products"
                      className="px-4 py-2 bg-[#D4AF37] text-[#07643D] font-bold rounded-xl text-xs hover:bg-[#F4D375] transition-colors"
                    >
                      + Add Product (Admin)
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Category Navigation Footer Banner */}
        <div className="p-6 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Explore other categories</h4>
            <p className="text-xs text-gray-500">Discover all fresh food, sweets, and shop items</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeCategories.filter(c => c.slug !== category.slug).map(c => (
              <Link
                key={c.id}
                to={`/category/${c.slug}`}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#07643D] hover:text-[#07643D] bg-gray-50 font-medium transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
