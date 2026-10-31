import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_CONFIG } from '../data/storeConfig';
import { db } from '../services/db';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  const settings = db.getSettings();
  const freeThreshold = Number(settings.freeDeliveryThreshold || 3000);
  const isFreeDelivery = Boolean(freeThreshold > 0 && subtotal >= freeThreshold);
  const deliveryFee = isFreeDelivery ? 0 : Number(settings.defaultDeliveryFee ?? settings.deliveryFee ?? settings.deliveryOptions?.inCityFee ?? 180);
  const totalAmount = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#07643D] flex items-center justify-center mb-4 border border-emerald-100">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-gray-900">Your Cart is Currently Empty</h1>
        <p className="text-xs text-gray-500 mt-2 max-w-sm text-center">
          Add fresh mithai, bakery cakes, groceries, or perfumes from Sawera Sweets &amp; Bakers to get started.
        </p>
        <Link
          to="/products"
          className="mt-6 px-6 py-3 rounded-full bg-[#07643D] hover:bg-[#043E26] text-white text-xs font-bold shadow-md transition-colors"
        >
          Explore All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#07643D]">
              Shopping Cart
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review your selected items ({totalItems} item{totalItems > 1 ? 's' : ''})
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items List */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/products/gulab-jamun.svg";
                      }}
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#07643D] bg-emerald-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1">{item.name}</h3>
                    <p className="text-xs text-gray-500">Unit: {item.unit}</p>

                    {/* Custom Mithai Box Assortment Details */}
                    {item.isCustomBox && item.boxDetails?.items && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs space-y-1.5 max-w-sm">
                        <div className="font-semibold text-emerald-950 flex items-center justify-between">
                          <span>Box Manifest ({item.boxDetails.totalGrams}g):</span>
                          {item.boxDetails.ribbon && (
                            <span className="text-amber-800 text-[11px] font-bold">🎀 {item.boxDetails.ribbon}</span>
                          )}
                        </div>
                        <ul className="space-y-1 text-neutral-700 text-[11px]">
                          {item.boxDetails.items.map((sub, sIdx) => (
                            <li key={sIdx} className="flex justify-between items-center bg-white/70 px-2 py-0.5 rounded">
                              <span className="truncate pr-2 font-medium">• {sub.name}</span>
                              <span className="shrink-0 text-emerald-800 font-bold">{sub.grams}g</span>
                            </li>
                          ))}
                        </ul>
                        {item.boxDetails.recipientName && (
                          <div className="text-[10px] text-neutral-600 pt-1 border-t border-emerald-200">
                            Gift Card for: <span className="font-bold text-neutral-800">{item.boxDetails.recipientName}</span>
                          </div>
                        )}
                        {item.boxDetails.giftMessage && (
                          <div className="text-[10px] italic text-neutral-600 bg-white/60 p-1.5 rounded">
                            "{item.boxDetails.giftMessage}"
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs font-bold text-[#07643D] mt-1">
                      Rs. {item.price.toLocaleString()} each
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-2xs">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1.5 text-gray-600 hover:text-black"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1.5 text-gray-600 hover:text-black"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-[#07643D]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                to="/products"
                className="text-xs font-bold text-[#07643D] hover:underline inline-flex items-center gap-1"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6 h-fit">
            <h2 className="text-base font-bold font-serif text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span>Delivery Charges:</span>
                {isFreeDelivery ? (
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] tracking-wide border border-emerald-200">
                    FREE DELIVERY (مفت ڈلیوری)
                  </span>
                ) : (
                  <span className="font-mono font-bold text-gray-900">Rs. {deliveryFee}</span>
                )}
              </div>

              {!isFreeDelivery && freeThreshold > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                  <span>Add <strong>Rs. {(freeThreshold - subtotal).toLocaleString()}</strong> more for <strong>FREE Delivery</strong>!</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-[#07643D]">
                <p className="font-semibold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Doorstep Delivery Policy:</span>
                </p>
                <p className="mt-0.5 text-emerald-800">
                  Fixed Rs. 180 delivery across Pakistan. <strong>FREE Delivery</strong> on all orders of Rs. 3,000 or more!
                </p>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Total Payable:</span>
                <span className="text-xl font-extrabold text-[#07643D]">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe &amp; Authentic Order Processing</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
