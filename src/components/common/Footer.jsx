import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Award, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { STORE_CONFIG } from '../../data/storeConfig';
import { CATEGORIES } from '../../data/categories';

export default function Footer() {
  return (
    <footer className="bg-[#043E26] text-white pt-12 pb-24 md:pb-12 border-t-4 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Features Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-emerald-800/80 mb-10">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/30">
            <Award className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">100% Fresh Daily</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5">Prepared fresh with pure desi ghee</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/30">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Hygienic Packaging</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5">Food-grade sealed boxes &amp; tins</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/30">
            <Truck className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Fast Doorstep Delivery</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5">Delivered fresh across your locality</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-900/40 border border-emerald-700/30">
            <MessageCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">WhatsApp &amp; COD</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5">Easy cash on delivery &amp; phone orders</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow bg-emerald-950 flex-shrink-0">
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
              <div>
                <h3 className="text-xl font-bold font-serif text-white tracking-tight">Sawera</h3>
                <p className="text-xs text-[#D4AF37] font-semibold tracking-wider uppercase">Sweets &amp; Bakers</p>
              </div>
            </div>

            <div className="text-right py-1">
              <span className="text-lg text-[#F4D375] font-bold urdu-text inline-block">
                {STORE_CONFIG.mottoUrdu}
              </span>
            </div>

            <p className="text-xs text-emerald-100 leading-relaxed">
              Your trusted local neighborhood store for traditional sweets made with pure desi ghee, fresh daily bakery items, grocery essentials, cosmetics, and fine fragrances.
            </p>

            <div className="pt-2">
              <span className="text-[11px] text-emerald-300 block mb-1 uppercase tracking-wider font-semibold">Payment Modes Accepted</span>
              <div className="flex flex-wrap gap-2 text-[11px] text-emerald-100">
                <span className="px-2 py-1 rounded bg-emerald-900/80 border border-emerald-700">Cash on Delivery</span>
                <span className="px-2 py-1 rounded bg-emerald-900/80 border border-emerald-700">WhatsApp Order</span>
              </div>
            </div>
          </div>

          {/* Business Categories */}
          <div>
            <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4 border-b border-emerald-800 pb-2">
              Our Products
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link 
                    to={`/category/${cat.slug}`}
                    className="text-emerald-100 hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-emerald-400 font-normal">({cat.urduName})</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link 
                  to="/products"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] hover:underline"
                >
                  View All Products &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4 border-b border-emerald-800 pb-2">
              Customer Links
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100">
              <li>
                <Link to="/about" className="hover:text-white flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  About Us (30+ Years)
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:text-white flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  Store Location &amp; Timings
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-white flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  Contact Store
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  Exchange &amp; Return Policy
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white flex items-center gap-1.5 text-emerald-300">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  Staff &amp; Admin Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Info & Shop 1 Real Data */}
          <div>
            <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4 border-b border-emerald-800 pb-2">
              Shop 1 (Main Store)
            </h4>
            <div className="space-y-3 text-xs text-emerald-100">
              
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white">Physical Address:</span>
                  <p className="text-[11px] text-emerald-200 mt-0.5">
                    Gojra Road, Opposite DHQ Hospital, Jhang
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white">Opening Timings:</span>
                  <p className="text-[11px] text-emerald-200">5:30 AM to 12:00 AM (Midnight)</p>
                  <p className="text-[10px] text-emerald-400">Open 7 days a week</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white">Phone / Orders:</span>
                  <a href="tel:03227434080" className="text-[11px] font-mono text-emerald-200 block hover:underline">0322 7434080</a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white">WhatsApp Orders:</span>
                  <a href="https://wa.me/923227434080" target="_blank" rel="noreferrer" className="text-[11px] font-mono text-[#F4D375] font-bold block hover:underline">0322 7434080</a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-emerald-800 text-center md:flex md:justify-between items-center text-xs text-emerald-300">
          <p>© {new Date().getFullYear()} Sawera Sweets &amp; Bakers. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-[11px]">
            Authentic Pakistani Mithai, Bakery &amp; Mart Store • <span className="urdu-text text-[#F4D375]">ہر خوشی کیساتھ</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
