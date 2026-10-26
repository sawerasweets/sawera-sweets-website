import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CustomerWishlistPage() {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { products } = useStore();
  const { isUrdu } = useLanguage();

  const wishlistProducts = products.filter(p => wishlist?.includes(p.id));

  const handleRemove = (id) => {
    toggleWishlist(id);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1, product.variations?.[0] || null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
          <Link to="/account" className="hover:text-[#07643D]">My Account</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Wishlist</span>
        </div>
        <h1 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span>My Saved Favorites</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Easily reorder your favorite sweets, bakery treats, and kitchen essentials.</p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-xs text-gray-500">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-700 text-sm">Your wishlist is empty.</p>
          <p className="mt-1">Browse our store and tap the heart icon on items you love.</p>
          <Link to="/products" className="inline-block mt-4 px-5 py-2 rounded-xl bg-[#07643D] text-white font-bold">
            Explore All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistProducts.map((prod) => (
            <div key={prod.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-40 bg-gray-50 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2">
                  <img src={prod.image} alt={prod.name} className="max-h-full object-contain" />
                  <button
                    onClick={() => handleRemove(prod.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">{prod.category}</p>
                <Link to={`/product/${prod.id}`} className="font-bold text-gray-900 text-xs hover:text-[#07643D] line-clamp-1 mt-0.5">
                  {prod.name}
                </Link>
                {prod.urduName && (
                  <p className="text-[11px] text-gray-500 urdu-text mt-0.5">{prod.urduName}</p>
                )}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-sm font-bold font-mono text-[#07643D]">
                    Rs. {(prod.discountPrice || prod.price).toLocaleString()}
                  </span>
                  {prod.discountPrice && (
                    <span className="text-xs text-gray-400 line-through font-mono">
                      Rs. {prod.price}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleAddToCart(prod)}
                  className="w-full py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
