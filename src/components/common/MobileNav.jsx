import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Search, ShoppingBag, PhoneCall } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { STORE_CONFIG } from '../../data/storeConfig';

export default function MobileNav() {
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden shadow-lg safe-bottom">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isActive('/') ? 'text-[#07643D]' : 'text-gray-500 hover:text-[#07643D]'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>

        {/* Categories */}
        <Link
          to="/products"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            location.pathname.startsWith('/category') || isActive('/products')
              ? 'text-[#07643D]'
              : 'text-gray-500 hover:text-[#07643D]'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Categories</span>
        </Link>

        {/* Call / Contact Store */}
        {STORE_CONFIG.contact.phone.replace(/[^0-9+]/g, '') ? (
          <a
            href={`tel:${STORE_CONFIG.contact.phone.replace(/[^0-9+]/g, '')}`}
            className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-[#07643D] transition-colors"
            title="Direct Phone Order"
          >
            <div className="w-9 h-9 rounded-full bg-[#07643D] text-white flex items-center justify-center -mt-3 shadow-md border-2 border-white">
              <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <span className="text-[10px] font-medium mt-0.5">Call Store</span>
          </a>
        ) : (
          <Link
            to="/contact"
            className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-[#07643D] transition-colors"
            title="Contact Store & Timings"
          >
            <div className="w-9 h-9 rounded-full bg-[#07643D] text-white flex items-center justify-center -mt-3 shadow-md border-2 border-white">
              <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <span className="text-[10px] font-medium mt-0.5">Contact</span>
          </Link>
        )}

        {/* Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-[#07643D] relative transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#D4AF37] text-[#07643D] font-bold text-[9px] rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Cart</span>
        </button>

        {/* Track Order */}
        <Link
          to="/track-order"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isActive('/track-order') ? 'text-[#07643D]' : 'text-gray-500 hover:text-[#07643D]'
          }`}
        >
          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
            #
          </span>
          <span className="text-[10px] font-medium mt-1">Track</span>
        </Link>
      </div>
    </nav>
  );
}
