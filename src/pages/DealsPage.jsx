import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tag, Sparkles, Check, ShoppingBag, ArrowRight, ShieldCheck, Clock, MessageCircle, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const DEALS_DATA = [
  {
    id: 'deal-patisa-duo',
    title: 'Jhang Royal Patisa Duo (1kg Special)',
    urduTitle: 'جھنگ اسپیشل شاہی پتیسہ جوڑی (1 کلو)',
    badge: 'Best Seller Deal',
    image: '/images/products/pista-patisa.jpg',
    originalPrice: 1600,
    price: 1399,
    savings: 201,
    description: 'Fresh batch of signature Shapper Pista Patisa (500g) and Milky Patisa (500g) packed in our luxury golden celebration box.',
    urduDescription: 'خالص پستہ پتیسہ اور ملکی پتیسہ کی شاہی جوڑی، خوبصورت گولڈن گفٹ بکس کے ساتھ۔',
    items: ['500g Shapper Pista Patisa', '500g Shappar Milky Patisa', 'Complimentary Royal Gift Box'],
    rating: 5.0,
    reviewsCount: 38
  },
  {
    id: 'deal-mithai-celebration',
    title: 'Grand Family Mithai Feast (2kg Assortment)',
    urduTitle: 'گرینڈ فیملی مٹھائی دعوت پیک (2 کلو)',
    badge: 'Mega Saver',
    image: '/images/products/roll-barfi.jpg',
    originalPrice: 2850,
    price: 2490,
    savings: 360,
    description: 'A lavish 2kg festival assortment featuring Roll Barfi, Badam Barfi, Dry Fruit Halwa, and Gulab Jamun. Ideal for family celebrations.',
    urduDescription: 'رول برفی، بادام برفی، ڈرائی فروٹ حلوہ اور گلاب جامن کا شاندار 2 کلو پیکج، ہر خوشی کے لیے بہترین۔',
    items: ['500g Roll Barfi (Desi Ghee)', '500g Badam Barfi', '500g Special Dry Fruit Halwa', '500g Motichoor / Gulab Jamun'],
    rating: 4.9,
    reviewsCount: 52
  },
  {
    id: 'deal-tafi-deluxe',
    title: 'Special Badam Tafi & Dry Fruit Deluxe Pack (1kg)',
    urduTitle: 'اسپیشل بادام ٹافی اور ڈرائی فروٹ ڈیلکس پیک (1 کلو)',
    badge: 'Signature Heritage',
    image: '/images/products/badam-tafi.jpg',
    originalPrice: 1850,
    price: 1599,
    savings: 251,
    description: 'Our viral chewy nutty Special Badam Tafi paired with rich Walnut Injeer Halwa for the true dry fruit connoisseur.',
    urduDescription: 'کرسپی اور لذیذ بادام ٹافی اور اخروٹ انجیر حلوہ کا شاہی تحفہ۔',
    items: ['500g Special Badam Tafi (Rich Almonds)', '500g Akhrot Injeer Halwa', 'Moisture-Lock Sealed Packing'],
    rating: 5.0,
    reviewsCount: 29
  },
  {
    id: 'deal-halwa-heritage',
    title: 'Desi Ghee Halwajaat Heritage Pack (1.5kg)',
    urduTitle: 'دیسی گھی حلوہ جات ہیرٹیج پیک (1.5 کلو)',
    badge: 'Winter Special',
    image: '/images/products/sohan-halwa.jpg',
    originalPrice: 2200,
    price: 1899,
    savings: 301,
    description: 'Authentic Multani-style Sohan Halwa, Habshi Halwa, and Badam Halwa slow-cooked in 100% pure desi ghee.',
    urduDescription: 'خالص دیسی گھی سے تیار کردہ سوہن حلوہ، حبشی حلوہ اور بادام حلوہ۔',
    items: ['500g Multani Sohan Halwa', '500g Classic Habshi Halwa', '500g Desi Ghee Badam Halwa'],
    rating: 4.9,
    reviewsCount: 44
  },
  {
    id: 'deal-bakery-teatime',
    title: 'Fresh Bakery Afternoon Tea Hamper',
    urduTitle: 'تازہ بیکری ایوننگ ٹی ہیمپیر',
    badge: 'Daily Fresh',
    image: '/images/categories/bakery.jpg',
    originalPrice: 1500,
    price: 1250,
    savings: 250,
    description: 'Crisp golden cake rusks, freshly baked almond butter biscuits, zeera cookies, and premium tea-time snacks.',
    urduDescription: 'شام کی چائے کے لیے خستہ کیک رسک، مکھن والے بسکٹس اور زیرہ کوکیز کا تازہ سیٹ۔',
    items: ['1x Premium Crispy Cake Rusk (Box)', '1x Desi Ghee Almond Nan Khatai', '1x Zeera Butter Cookies Pack', '1x Fresh Bakarkhani Box'],
    rating: 4.8,
    reviewsCount: 31
  },
  {
    id: 'deal-trending-munchies',
    title: 'Social Media Trending Snack Basket',
    urduTitle: 'سوشل میڈیا ٹرینڈنگ سنیک باسکٹ',
    badge: 'Trending Viral',
    image: '/images/products/lays-gourmet.jpg',
    originalPrice: 2050,
    price: 1750,
    savings: 300,
    description: 'A handpicked mix of viral imported snacks: Lays Gourmet, Danish butter cookies, hazelnut chocolates, and crispy wafer rolls.',
    urduDescription: 'ٹرینڈنگ لیز گورمے، بٹر کوکیز، چاکلیٹس اور ویفرز کا وائرل سنیک مکس۔',
    items: ['1x Lays Gourmet Chips', '1x Danish Butter Cookies Tin', '2x Hazelnut Chocolate Bars', '1x Crispy Cream Wafers'],
    rating: 5.0,
    reviewsCount: 22
  }
];

export default function DealsPage() {
  const { addItem } = useCart();
  const { isUrdu } = useLanguage();
  const navigate = useNavigate();
  const [addedDealId, setAddedDealId] = useState(null);

  const handleAddToCart = (deal) => {
    addItem({
      id: deal.id,
      name: deal.title,
      urduName: deal.urduTitle,
      price: deal.price,
      image: deal.image,
      unit: 'Special Deal Box',
      category: 'deals'
    }, 1);

    setAddedDealId(deal.id);
    setTimeout(() => setAddedDealId(null), 1800);
  };

  const handleInstantCheckout = (deal) => {
    addItem({
      id: deal.id,
      name: deal.title,
      urduName: deal.urduTitle,
      price: deal.price,
      image: deal.image,
      unit: 'Special Deal Box',
      category: 'deals'
    }, 1);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Banner Header (Suleman Sweets Benchmark) */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'محدود وقت کے لیے خصوصی بچت' : 'Limited Time Savings'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#07643D] tracking-tight">
            {isUrdu ? 'ہاٹ ڈیلز اور خصوصی آفرز' : 'Hot Deals & Offers'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {isUrdu
              ? 'اپنی پسندیدہ روایتی مٹھائیوں اور بیکری پر خصوصی رعایتی ڈیلز اور فیملی پیکجز حاصل کریں'
              : 'Discover exclusive value deals and curated bundles on your favorite traditional sweets and bakery.'}
          </p>
        </div>

        {/* Value Banner */}
        <div className="bg-gradient-to-r from-[#07643D] to-[#0A8050] text-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-[#F4D375] flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {isUrdu ? 'ڈیل آرڈرز پر مفت تحفہ پیکنگ' : 'Complimentary Luxury Gift Box with Every Deal'}
              </h3>
              <p className="text-xs text-emerald-100">
                {isUrdu ? 'تمام ڈیلز پر جھنگ میں 45 منٹ اور پورے پاکستان میں فوری ترسیل' : 'Nationwide 24-48h insulated delivery across 240+ cities in Pakistan.'}
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/923227434080?text=Assalam-o-Alaikum%20Sawera%20Sweets,%20I%20want%20to%20order%20a%20Special%20Deal"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F4D375] text-[#07643D] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#07643D]" />
            <span>{isUrdu ? 'واٹس ایپ ڈیل ہیلپ لائن' : 'WhatsApp Deal Helpline'}</span>
          </a>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEALS_DATA.map((deal) => {
            const isAdded = addedDealId === deal.id;
            const waMessage = encodeURIComponent(
              `Assalam-o-Alaikum Sawera Sweets, I want to order this Deal: *${deal.title}* at discounted price Rs. ${deal.price}. Please confirm.`
            );

            return (
              <div
                key={deal.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative aspect-video sm:aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/products/roll-barfi.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className="bg-[#07643D] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      {deal.badge}
                    </span>
                    <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
                      Save Rs. {deal.savings}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="text-amber-700 font-semibold font-serif">{isUrdu ? deal.urduTitle : deal.title}</span>
                      <span className="font-mono text-emerald-800 font-bold">⭐ {deal.rating} ({deal.reviewsCount})</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 group-hover:text-[#07643D] transition-colors leading-snug">
                      {deal.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {isUrdu ? deal.urduDescription : deal.description}
                    </p>

                    {/* Included Items List */}
                    <div className="pt-2 border-t border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Package Contents:</span>
                      {deal.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-stone-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & 3 Action Buttons */}
                  <div className="space-y-3 pt-3 border-t border-stone-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-stone-400 line-through mr-2">
                          Rs. {deal.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xl font-extrabold font-mono text-[#07643D]">
                          Rs. {deal.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                        {Math.round((deal.savings / deal.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    {/* 3 High-Conversion Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(deal)}
                        className={`py-2 px-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-[#07643D] border border-emerald-200'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInstantCheckout(deal)}
                        className="py-2 px-3 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>Buy Now</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <a
                      href={`https://wa.me/923227434080?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Order on WhatsApp (0322 7434080)</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}