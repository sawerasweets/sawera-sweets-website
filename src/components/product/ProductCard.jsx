import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Star, Zap, Check, Heart, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ProductCard({ product }) {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const { isUrdu } = useLanguage();
  const navigate = useNavigate();
  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const hasVariations = product.variations && product.variations.length > 0;
  
  // Detect if product has 500g/1kg/2kg weight options (traditional sweets)
  const oneKgVariation = product.variations?.find(v => 
    v.weight === '1kg' || 
    v.id === 'var-1kg' || 
    v.label?.toLowerCase().includes('1 kilo') || 
    v.label?.toLowerCase().includes('1kg') ||
    v.label?.includes('1 کلو')
  ) || null;

  const hasKgVariations = Boolean(
    oneKgVariation || 
    product.variations?.some(v => v.label?.toLowerCase().includes('500') || v.weight === '500g')
  );

  // If sweet with kg options, enforce 1kg rate as requested by user; otherwise use first variation or null
  const defaultVar = hasKgVariations ? (oneKgVariation || null) : (hasVariations ? product.variations[0] : null);
  const [selectedVariation, setSelectedVariation] = useState(defaultVar);

  const currentPrice = selectedVariation 
    ? (selectedVariation.discountPrice ?? selectedVariation.price) 
    : (product.discountPrice ?? product.price);

  const originalPrice = selectedVariation 
    ? selectedVariation.price 
    : product.price;

  const hasDiscount = (selectedVariation?.discountPrice && selectedVariation.discountPrice < selectedVariation.price) ||
    (!selectedVariation && product.discountPrice && product.discountPrice < product.price);

  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedVariation);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedVariation);
    navigate('/checkout');
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/80 hover:border-[#D4AF37]/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Badges (Text badges like Special Desi Ghee removed per user request) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent && (
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 items-end">
          <span className="bg-white/95 backdrop-blur-xs text-[#07643D] border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {product.inStock !== false && product.stockStatus !== 'out_of_stock'
              ? (isUrdu ? 'دستیاب ہے' : 'In Stock')
              : (isUrdu ? 'پری آرڈر' : 'Pre-Order')}
          </span>
          {product.isDemo && (
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              {isUrdu ? 'ڈیمو آئٹم' : 'Demo Item'}
            </span>
          )}
        </div>
      </div>

      {/* Image Container */}
      <div className="relative w-full pt-[90%] bg-gradient-to-br from-gray-50 to-[#FDFBF7] overflow-hidden">
        <Link 
          to={`/product/${product.id}`}
          className="absolute inset-0 block w-full h-full"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/products/gulab-jamun.svg";
            }}
          />

          {/* Quick View Overlay on Hover */}
          <div className="absolute inset-0 bg-[#07643D]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white text-[#07643D] font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5" /> {isUrdu ? 'دیکھیں' : 'Quick View'}
            </span>
          </div>
        </Link>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute bottom-2.5 right-2.5 p-2 rounded-full z-10 transition-all shadow-md ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' 
              : 'bg-white/90 text-neutral-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="uppercase text-[10px] font-bold tracking-wider text-[#07643D]">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className={`text-sm font-bold text-gray-900 group-hover:text-[#07643D] transition-colors line-clamp-2 leading-snug ${isUrdu ? 'urdu-text text-base' : ''}`}>
              {isUrdu ? (product.urduName || product.name) : product.name}
            </h3>
          </Link>

          {/* Packaging Unit / Subtitle */}
          <p className="text-xs text-gray-500 mt-1">
            {isUrdu ? 'پیکنگ:' : 'Packaging:'}{' '}
            <span className="font-medium text-gray-700">
              {hasKgVariations
                ? (isUrdu ? '1 کلوگرام (ایک کلو)' : '1 Kilogram (1 kg)')
                : (selectedVariation
                    ? (isUrdu ? (selectedVariation.urduLabel || selectedVariation.label) : selectedVariation.label)
                    : (isUrdu ? (product.urduUnit || product.unit) : product.unit))}
            </span>
          </p>

          {/* Variation Selector (only for non-weight items; 500g/1kg/2kg pills removed as requested) */}
          {hasVariations && !hasKgVariations && product.variations.length > 1 && (
            <div className="mt-2.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                {isUrdu ? 'آپشن منتخب کریں:' : 'Select Option:'}
              </label>
              <div className="flex flex-wrap gap-1">
                {product.variations.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariation(v);
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                      selectedVariation?.label === v.label
                        ? 'border-[#07643D] bg-emerald-50 text-[#07643D] font-bold shadow-2xs'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {isUrdu ? (v.urduLabel || v.label) : v.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing and Action Buttons */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-base font-extrabold text-[#07643D]">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  Rs. {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">PKR</span>
          </div>

          {/* Action Buttons: Add to Cart, Instant Checkout, WhatsApp */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={handleAddToCart}
                className="w-full py-2 px-1 rounded-xl bg-emerald-50 hover:bg-[#07643D] text-[#07643D] hover:text-white border border-[#07643D]/30 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer group/btn"
                title="Add to Shopping Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                <span>{isUrdu ? 'شامل کریں' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-2 px-1 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs hover:shadow transition-all cursor-pointer"
                title="Buy Now and Proceed to Checkout"
              >
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isUrdu ? 'فوری خریدیں' : 'Checkout'}</span>
              </button>
            </div>

            <a
              href={`https://wa.me/923227434080?text=${encodeURIComponent(
                `Assalam o Alaikum Sawera Sweets!\nI want to order: ${product.name} (${hasKgVariations ? '1 Kilogram' : (selectedVariation?.label || product.unit || '1 kg')})\nPrice: Rs. ${currentPrice}\nPlease confirm delivery.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-1.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'واٹس ایپ آرڈر' : 'WhatsApp'}</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
