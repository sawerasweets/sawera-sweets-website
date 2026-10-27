import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  Award, 
  ShieldCheck, 
  Truck, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ChevronRight,
  ChevronLeft,
  Zap,
  CheckCircle2,
  Heart,
  PlusCircle,
  Box,
  Gift,
  Scale
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { STORE_CONFIG } from '../data/storeConfig';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';
import db from '../services/db';

export default function HomePage() {
  const { products } = useStore();
  const { isAdmin } = useAuth();
  const { isUrdu, t } = useLanguage();

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.isFeatured).slice(0, 4);
  }, [products]);

  const bestSellers = useMemo(() => {
    return products.filter(p => p.salesCount > 0 || p.isBestSeller).slice(0, 4);
  }, [products]);

  const specialOffers = useMemo(() => {
    return products.filter(p => p.discountPrice && p.discountPrice < p.price).slice(0, 4);
  }, [products]);

  const marqueeCategories = useMemo(() => {
    return [...CATEGORIES, ...CATEGORIES, ...CATEGORIES, ...CATEGORIES];
  }, []);

  const occasions = useMemo(() => {
    return db.getOccasions().filter(o => o.isActive !== false);
  }, []);

  const [recentlyViewedIds, setRecentlyViewedIds] = useState([]);
  useEffect(() => {
    setRecentlyViewedIds(db.getRecentlyViewed());
  }, []);

  const recentlyViewedProducts = useMemo(() => {
    if (!recentlyViewedIds || recentlyViewedIds.length === 0) return [];
    return recentlyViewedIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, 4);
  }, [recentlyViewedIds, products]);

  // Featured Signature Sweets for the Hero Showcase Card
  const heroShowcaseItems = useMemo(() => {
    return [
      {
        id: "prd-special-roll-barfi",
        name: "Special Roll Barfi",
        urduName: "اسپیشل رول برفی",
        tag: "100% Desi Ghee",
        urduTag: "خالص دیسی گھی",
        price: 1200,
        regularPrice: 1300,
        image: "/images/products/special-roll-barfi.jpg",
        description: "Prepared with thick slow-simmered khoya, desi ghee & premium pistachios.",
        urduDescription: "سو فیصد خالص کڑھے ہوئے کھوئے اور دیسی گھی سے تیار کردہ شاہی رول برفی۔",
        link: "/product/prd-special-roll-barfi"
      },
      {
        id: "prd-special-badam-barfi",
        name: "Special Badam Barfi",
        urduName: "اسپیشل بادام برفی",
        tag: "Signature Almonds",
        urduTag: "شاہی بادام برفی",
        price: 1200,
        regularPrice: 1300,
        image: "/images/products/special-badam-barfi.jpg",
        description: "Pure slow-simmered khoya loaded inside and out with sliced California almonds.",
        urduDescription: "خالص کڑھے ہوئے کھوئے اور بادام کے وافر مغز سے تیار کردہ مربع برفی۔",
        link: "/product/prd-special-badam-barfi"
      },
      {
        id: "prd-special-sohan-halwa",
        name: "Special Sohan Halwa",
        urduName: "اسپیشل سوہن حلوہ",
        tag: "Heritage Recipe",
        urduTag: "روایتی سوہن حلوہ",
        price: 1200,
        regularPrice: 1300,
        image: "/images/products/special-sohan-halwa.jpg",
        description: "Caramelized wheat sprout halwa slow-cooked with pure desi ghee & walnuts.",
        urduDescription: "دیسی گھی اور سمنک سے روایتی کڑھائی میں پکا ہوا مشہور سوہن حلوہ۔",
        link: "/product/prd-special-sohan-halwa"
      },
      {
        id: "prd-viral-kunafa-chocolate",
        name: "Dubai Viral Kunafa Bar",
        urduName: "دبئی وائرل کنافہ بار",
        tag: "🔥 Social Media Trend",
        urduTag: "🔥 سوشل میڈیا ٹرینڈ",
        price: 1250,
        regularPrice: 1350,
        image: "/images/categories/bakery.jpg",
        description: "Crunchy toasted kunafa phyllo & velvety Turkish pistachio cream.",
        urduDescription: "کرسپی کنافہ اور شاہی پستہ بٹر سے بھرپور وائرل چاکلیٹ بار۔",
        link: "/product/prd-viral-kunafa-chocolate"
      }
    ];
  }, []);

  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx(prev => (prev + 1) % heroShowcaseItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroShowcaseItems.length]);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">

      {/* 1. HERO SECTION (100% Solid & Full-Bleed Royal Islamic Emerald Background) */}
      <section className="relative bg-gradient-to-br from-[#022112] via-[#064227] to-[#021A0F] text-white overflow-hidden py-10 md:py-16 border-b-4 border-[#D4AF37]">
        
        {/* Full-Bleed Royal Islamic Star Lattice Pattern (Seamless on 100% of screens, 0 blank gaps) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="royal-lattice" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M24 0 L48 24 L24 48 L0 24 Z" fill="none" stroke="#D4AF37" strokeWidth="0.8"/>
                <circle cx="24" cy="24" r="5" fill="none" stroke="#D4AF37" strokeWidth="0.6"/>
                <circle cx="24" cy="24" r="1.5" fill="#D4AF37"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#royal-lattice)"/>
          </svg>
        </div>

        {/* Ambient Gold & Emerald Lighting */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none animate-glow-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none animate-glow-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              {/* Badge & motto */}
              <div className="inline-flex items-center gap-2 bg-emerald-900/80 border border-[#D4AF37]/50 px-3.5 py-1.5 rounded-full shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                {isUrdu ? (
                  <span className="text-[#D4AF37] font-bold urdu-text text-sm">
                    {STORE_CONFIG.mottoUrdu} • خالص اور تازہ
                  </span>
                ) : (
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Authentic Taste &amp; Freshness • With Every Joy
                  </span>
                )}
              </div>

              {/* Main Headline */}
              {isUrdu ? (
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold urdu-text tracking-tight leading-tight text-white drop-shadow-sm">
                  خالص روایتی <span className="text-[#F4D375]">مٹھائیاں</span>، بیکری اور ضروریاتِ زندگی
                </h1>
              ) : (
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight leading-tight text-white drop-shadow-sm">
                  Fresh Traditional <span className="text-[#F4D375]">Sweets</span>, Bakery &amp; Daily Essentials
                </h1>
              )}

              {/* Subtitle */}
              {isUrdu ? (
                <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto lg:mx-0 leading-relaxed urdu-text">
                  جھنگ کی تیس سالہ بااعتماد روایت! خالص دیسی گھی اور کڑھے ہوئے کھوئے سے تیار کردہ مٹھائیاں، تازہ بیکری اور معیاری راشن، سیدھے آپ کے گھر تک۔
                </p>
              ) : (
                <p className="text-xs sm:text-base text-emerald-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Handcrafted with pure desi ghee, slow-simmered khoya, and 30+ years of authentic recipes from Jhang. Safe, express delivery to your doorstep across Pakistan.
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Link
                  to="/category/sweets"
                  className="px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#F4D375] text-[#07643D] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isUrdu ? 'مٹھائی آرڈر کریں' : 'Order Fresh Mithai'}</span>
                </Link>

                <Link
                  to="/mithai-box-studio"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-xs transition-colors"
                >
                  <Box className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isUrdu ? 'کسٹم بکس اسٹوڈیو' : 'Mithai Box Studio'}</span>
                </Link>

                <a
                  href={`https://wa.me/923227434080?text=${encodeURIComponent("Assalam-o-Alaikum Sawera Sweets! I would like to place an order.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-[#043E26] hover:bg-emerald-950 border border-emerald-600/50 text-emerald-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isUrdu ? 'واٹس ایپ آرڈر (0322 7434080)' : 'WhatsApp (0322 7434080)'}</span>
                </a>
              </div>

              {/* Mini Guarantees */}
              <div className="pt-4 border-t border-emerald-800/80 grid grid-cols-3 gap-2 text-center lg:text-left text-[11px] text-emerald-200">
                <div>
                  <span className="font-bold text-white block">{isUrdu ? '۱۰۰٪ خالص دیسی گھی' : '100% Desi Ghee'}</span>
                  <span>{isUrdu ? 'معیاری اجزاء' : 'Pure ingredients'}</span>
                </div>
                <div>
                  <span className="font-bold text-white block">{isUrdu ? 'روزانہ تازہ تیاری' : 'Daily Fresh Batches'}</span>
                  <span>{isUrdu ? 'آج ہی تیار کردہ' : 'Baked & made today'}</span>
                </div>
                <div>
                  <span className="font-bold text-white block">{isUrdu ? 'پورے پاکستان میں ڈلیوری' : 'All Pakistan Delivery'}</span>
                  <span>{isUrdu ? 'جھنگ اور تمام شہر' : 'Express door delivery'}</span>
                </div>
              </div>

            </div>

            {/* Right Brand & Signature Sweets Showcase Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
                
                {/* Gold Top Header with Official Logo & Heritage */}
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] to-amber-200 shadow-md shrink-0">
                      <img
                        src="/images/logo/logo.jpg"
                        alt="Sawera Sweets"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/src/assets/logo.jpg";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                        <span>{isUrdu ? 'سویرا سویٹس اینڈ بیکرز' : 'Sawera Sweets & Bakers'}</span>
                        <span className="text-[10px] text-[#D4AF37] font-normal">Est. 1994</span>
                      </h4>
                      <p className="text-[10px] text-emerald-200 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" />
                        <span>{isUrdu ? 'گوجرہ روڈ، بالمقابل ڈی ایچ کیو ہسپتال، جھنگ' : 'Opp. DHQ Hospital, Jhang'}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F4D375] font-mono">
                    30+ Years
                  </span>
                </div>

                {/* Active Showcase Item (Mouth-watering authentic photography) */}
                {(() => {
                  const currentItem = heroShowcaseItems[activeHeroIdx] || heroShowcaseItems[0];
                  return (
                    <div className="pt-3 space-y-3">
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-inner group">
                        <img
                          src={currentItem.image}
                          alt={currentItem.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Subtle bottom shadow gradient for text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        
                        {/* Top Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#07643D] text-emerald-100 border border-emerald-400/30 shadow-md">
                            {isUrdu ? currentItem.urduTag : currentItem.tag}
                          </span>
                        </div>

                        {/* Price Pill */}
                        <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#D4AF37]/60 font-mono text-xs font-bold text-amber-300">
                          Rs. {currentItem.price.toLocaleString()}
                          {currentItem.regularPrice && (
                            <span className="text-[9px] line-through text-gray-400 ml-1">
                              {currentItem.regularPrice}
                            </span>
                          )}
                        </div>

                        {/* Bottom Information */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                          <div className="pr-2">
                            <h3 className="font-bold text-sm sm:text-base text-white drop-shadow-md">
                              {isUrdu ? currentItem.urduName : currentItem.name}
                            </h3>
                            <p className="text-[11px] text-emerald-100/90 line-clamp-1 drop-shadow-xs">
                              {isUrdu ? currentItem.urduDescription : currentItem.description}
                            </p>
                          </div>
                          <Link
                            to={currentItem.link}
                            className="px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#F4D375] text-[#07643D] font-extrabold text-[11px] shrink-0 shadow-md transition-transform hover:scale-105"
                          >
                            {isUrdu ? 'آرڈر کریں' : 'Order Now'}
                          </Link>
                        </div>
                      </div>

                      {/* Thumbnails Navigator to Switch Featured Sweets */}
                      <div className="grid grid-cols-4 gap-1.5 pt-1">
                        {heroShowcaseItems.map((item, idx) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveHeroIdx(idx)}
                            className={`p-1 rounded-xl border transition-all text-left flex flex-col items-center gap-1 cursor-pointer ${
                              activeHeroIdx === idx
                                ? 'border-[#D4AF37] bg-white/20 ring-1 ring-[#D4AF37]'
                                : 'border-white/10 bg-white/5 hover:bg-white/10 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-10 object-cover rounded-lg"
                            />
                            <span className="text-[9px] font-semibold text-white truncate max-w-full text-center">
                              {isUrdu ? item.urduName.split(' ')[0] : item.name.split(' ')[0]}
                            </span>
                          </button>
                        ))}
                      </div>

                    </div>
                  );
                })()}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#07643D]">
                {isUrdu ? 'ہمارے شعبہ جات' : 'Curated Departments'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 mt-1">
              {isUrdu ? 'کیٹیگری منتخب کریں' : 'Shop by Category'}
            </h2>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-[#07643D] hover:underline flex items-center gap-1"
          >
            <span>{isUrdu ? 'تمام شعبہ جات دیکھیں' : 'View All Departments'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Infinite Auto-Scrolling Categories Marquee */}
        <div className="relative w-full overflow-hidden py-3" dir="ltr">
          {/* Left Disappearing Edge Mask */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent z-10" />

          {/* Right Emerging Edge Mask */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent z-10" />

          {/* Scrolling Track with Enlarged Category Cards */}
          <div className="animate-marquee-infinite flex gap-5 sm:gap-6 w-max py-2">
            {marqueeCategories.map((cat, idx) => (
              <Link
                key={`${cat.id}-${idx}`}
                to={`/category/${cat.slug}`}
                className="group w-56 sm:w-64 shrink-0 flex-shrink-0 bg-white rounded-3xl border border-gray-200 hover:border-[#D4AF37] p-5 sm:p-6 text-center flex flex-col items-center justify-between shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Enlarged Category Photo Circle */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 border-3 border-emerald-100 group-hover:border-[#D4AF37] shadow-md group-hover:shadow-xl transition-all duration-300 relative bg-emerald-50 flex-shrink-0">
                  <img
                    src={cat.image || `/images/categories/${cat.id}.jpg`}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/products/gulab-jamun.svg";
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <h3 className={`text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#07643D] transition-colors leading-snug ${isUrdu ? 'urdu-text text-base sm:text-lg' : ''}`}>
                    {isUrdu ? (cat.urduName || cat.name) : cat.name}
                  </h3>
                </div>

                <span className="mt-3.5 text-[11px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                  {cat.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 SAWERA MITHAI BOX STUDIO (SIGNATURE FEATURE SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white border-2 border-amber-400/40 shadow-2xl p-6 sm:p-10 lg:p-12">
          {/* Background Ambient Motif */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-400" />
                <span>{isUrdu ? 'دستخطی سگنیچر فیچر • نیا' : 'Sawera Signature Feature • Live'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-200 leading-tight">
                {isUrdu ? 'سویرا مٹھائی بکس اسٹوڈیو' : 'Sawera Mithai Box Studio'}
              </h2>

              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-xl">
                {isUrdu
                  ? 'اپنی مرضی کی روایتی مٹھائیاں خود منتخب کر کے شاہی پریزنٹیشن بکس تیار کریں۔ لائیو ویٹ کاؤنٹر، گولڈن ٹرے، ساٹن ربن اور ہاتھ سے تحریر کردہ تہنیتی کارڈ کے ساتھ۔'
                  : 'Craft your custom luxury mithai box. Hand-pick sweet portions from our authentic daily-fresh catalog, monitor your box capacity in real time, and personalize with custom ribbon seals and greeting cards.'}
              </p>

              {/* 4 Feature Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-center">
                  <Box className="w-5 h-5 text-amber-300 mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-white block">
                    {isUrdu ? 'بکس کا سائز' : 'Box Sizes'}
                  </span>
                  <span className="text-[10px] text-emerald-300">500g, 1kg, 2kg</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-center">
                  <Scale className="w-5 h-5 text-amber-300 mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-white block">
                    {isUrdu ? 'لائیو گنجائش' : 'Live Gauge'}
                  </span>
                  <span className="text-[10px] text-emerald-300">Auto Capacity</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-center">
                  <Gift className="w-5 h-5 text-amber-300 mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-white block">
                    {isUrdu ? 'شاہی ساٹن ربن' : 'Royal Ribbon'}
                  </span>
                  <span className="text-[10px] text-emerald-300">Gold &amp; Emerald</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-center">
                  <Heart className="w-5 h-5 text-amber-300 mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-white block">
                    {isUrdu ? 'تہنیتی کارڈ' : 'Gift Note'}
                  </span>
                  <span className="text-[10px] text-emerald-300">Custom Wishes</span>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/mithai-box-studio"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-bold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-emerald-950 text-emerald-950" />
                  <span>{isUrdu ? 'اپنا مٹھائی بکس تیار کریں ←' : 'Start Designing Your Box →'}</span>
                </Link>

                <Link
                  to="/category/sweets"
                  className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
                >
                  <span>{isUrdu ? 'تمام مٹھائیاں دیکھیں' : 'Browse All Sweets'}</span>
                </Link>
              </div>
            </div>

            {/* Right Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-emerald-900/80 p-3">
                <div className="rounded-xl overflow-hidden aspect-[4/3] bg-neutral-900 relative">
                  <img
                    src="/images/hero/all-sweets.jpg"
                    alt="Sawera Luxury Mithai Presentation Box"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-amber-500 text-emerald-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                    {isUrdu ? 'دستخطی باکس' : 'Signature Tray'}
                  </div>
                </div>

                <div className="p-3 text-center space-y-1">
                  <p className="font-serif font-bold text-amber-200 text-base">
                    {isUrdu ? 'رائل ایمرلڈ مٹھائی بکس' : 'Royal Emerald Presentation Box'}
                  </p>
                  <p className="text-[11px] text-emerald-200">
                    {isUrdu ? 'خالص دیسی گھی مٹھائی • تازہ پیکنگ • محفوظ ترسیل' : 'Pure Desi Ghee • Freshly Packed • Express Nationwide Shipping'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.6 OCCASION-BASED COLLECTIONS SECTION */}
      {occasions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-8">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#07643D]">
                {isUrdu ? 'ہر خوشی کیساتھ' : 'Celebrations & Gifting'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 mt-1">
                {isUrdu ? 'تقاریب اور خاص مواقع کے مجموعے' : 'Occasion-Based Collections'}
              </h2>
            </div>

            <Link
              to="/mithai-box-studio"
              className="text-xs font-bold text-[#07643D] hover:underline flex items-center gap-1"
            >
              <span>{isUrdu ? 'کسٹم بکس بنائیں' : 'Create Custom Assortment'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {occasions.map(occ => (
              <Link
                key={occ.id}
                to="/mithai-box-studio"
                className="group relative rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                      {isUrdu ? occ.urduBadge : occ.badge}
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-neutral-900 text-lg group-hover:text-emerald-800 transition-colors">
                      {isUrdu ? occ.urduName : occ.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {isUrdu ? occ.urduSubtitle : occ.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>{isUrdu ? 'آرڈر تیار کریں' : 'Build Box'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. PRODUCTS SECTION (OR CATALOG UPDATE NOTICE) */}
      {products.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border-2 border-emerald-100 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#07643D] flex items-center justify-center mx-auto border border-[#D4AF37]/40 shadow-inner">
              <Sparkles className="w-8 h-8 text-[#D4AF37]" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#07643D] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {isUrdu ? 'تازہ مینو تیاری میں ہے' : 'Fresh Inventory in Progress'}
              </span>
              <h3 className={`text-xl sm:text-2xl font-extrabold font-serif text-gray-900 pt-2 ${isUrdu ? 'urdu-text' : ''}`}>
                {isUrdu ? 'اسٹور کیٹیلاگ اپڈیٹ ہو رہا ہے' : 'Store Catalog Being Freshly Updated'}
              </h3>
            </div>

            <p className={`text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed ${isUrdu ? 'urdu-text' : ''}`}>
              {isUrdu 
                ? 'ہم نئی تازہ مٹھائیاں، بیکری اور راشن آئٹمز آن لائن کیٹیلاگ میں شامل کر رہے ہیں۔ آپ فون یا واٹس ایپ پر براہِ راست آرڈر کر سکتے ہیں۔'
                : 'We are currently loading fresh batches of traditional sweets, bakery goods, and groceries into our online catalog. You can order directly by phone or WhatsApp in the meantime.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://wa.me/923227434080"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>WhatsApp Order (0322 7434080)</span>
              </a>

              {isAdmin && (
                <Link
                  to="/admin/products"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F4D375] text-[#07643D] font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Products (Admin)</span>
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Products */}
          {(featuredProducts.length > 0 || products.length > 0) && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-[#07643D]">
                    {isUrdu ? 'محبت سے تیار کردہ' : 'Handcrafted With Love'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 mt-1">
                    {isUrdu ? 'خاص منتخب مصنوعات' : (featuredProducts.length > 0 ? "Featured Selections" : "Fresh Daily Selections")}
                  </h2>
                </div>

                <Link
                  to="/products"
                  className="text-xs font-bold text-[#07643D] hover:underline flex items-center gap-1"
                >
                  <span>{isUrdu ? 'مزید دیکھیں' : 'See more items'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {(featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Best-Selling Products */}
          {bestSellers.length > 0 && (
            <section className="bg-white py-12 border-y border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                      {isUrdu ? 'گاہکوں کی پسندیدہ' : 'Customer Favorites'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 mt-1">
                      {isUrdu ? 'سب سے زیادہ فروخت ہونے والی اشیاء' : 'Best-Selling Products'}
                    </h2>
                  </div>

                  <Link
                    to="/products"
                    className="text-xs font-bold text-[#07643D] hover:underline flex items-center gap-1"
                  >
                    <span>{isUrdu ? 'تمام مصنوعات دیکھیں' : 'Explore all items'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {bestSellers.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Special Offers Section */}
          {specialOffers.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#043E26] via-[#07643D] to-[#0A4D3C] text-white shadow-xl border-2 border-[#D4AF37]/50 mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="bg-[#D4AF37] text-[#07643D] font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                      {isUrdu ? 'محدود مدت کی آفرز' : 'Limited Time Deals'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
                      {isUrdu ? 'خصوصی جشن اور خوشیوں کی آفرز' : 'Special Festive & Celebration Offers'}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
                      {isUrdu 
                        ? 'روایتی مٹھائی کے ڈبوں، فیملی پیکس اور پریمیم کریانے پر خصوصی رعایت۔'
                        : 'Exclusive bundle discounts on traditional sweet boxes, family packs, and premium groceries.'}
                    </p>
                  </div>

                  <Link
                    to="/products"
                    className="px-6 py-3 rounded-xl bg-white hover:bg-[#FDFBF7] text-[#07643D] font-extrabold text-xs shadow-md transition-colors flex-shrink-0"
                  >
                    {isUrdu ? 'تمام ڈیلز دیکھیں ←' : 'Browse All Deals →'}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {specialOffers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* 5.5 RECENTLY VIEWED PRODUCTS */}
      {recentlyViewedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#07643D]">
                {isUrdu ? 'آپ کی پسند' : 'Pick Up Where You Left Off'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 mt-1">
                {isUrdu ? 'حال ہی میں دیکھی گئی اشیاء' : 'Recently Viewed Products'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {recentlyViewedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. WHY CHOOSE US (4 Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#07643D]">
            {isUrdu ? 'ہماری امتیازی خصوصیات' : 'Our Commitment to Excellence'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900">
            {isUrdu ? 'سویرا سویٹس اینڈ بیکرز کا انتخاب کیوں؟' : 'Why Choose Sawera Sweets & Bakers?'}
          </h2>
          <p className="text-base text-[#A5841D] font-bold">
            {isUrdu ? (
              <span className="urdu-text">{STORE_CONFIG.mottoUrdu}</span>
            ) : (
              'With Every Joy - Pure Desi Ghee & Fresh Daily Bakery'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORE_CONFIG.features.map((feat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#07643D] flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-6 h-6 text-[#07643D]" />
              </div>
              <h3 className={`text-base font-bold text-gray-900 ${isUrdu ? 'urdu-text text-lg' : ''}`}>
                {isUrdu ? (feat.titleUrdu || feat.title) : feat.title}
              </h3>
              <p className={`text-xs text-gray-500 leading-relaxed ${isUrdu ? 'urdu-text text-sm' : ''}`}>
                {isUrdu ? (feat.descriptionUrdu || feat.description) : feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SHOP INFORMATION & LOCAL STORE LOCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Store Information Details */}
            <div className="p-8 sm:p-10 space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                  {isUrdu ? 'ہماری دکان' : 'Local Retail Store'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900">
                  {isUrdu ? 'دکان پر تشریف لائیں یا گھر بیٹھے منگوائیں' : 'Visit Us or Order Locally'}
                </h2>
                <p className="text-xs text-gray-500">
                  {isUrdu ? 'ہم آپ کی فیملی کی خدمت کے لیے تازہ مٹھائیوں اور بیکری کے ساتھ حاضر ہیں۔' : 'We look forward to serving your family with fresh sweets, bakery delights, and daily mart groceries.'}
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-gray-200">
                  <MapPin className="w-5 h-5 text-[#07643D] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">
                      {isUrdu ? 'دکان ۱ (مین ہیڈ آفس اسٹور):' : 'Shop 1 (Main Head Office Store):'}
                    </span>
                    <span className="text-gray-700 font-semibold text-xs block mt-0.5">
                      {isUrdu ? 'گوجرہ روڈ، بالمقابل ڈی ایچ کیو ہسپتال، جھنگ' : 'Gojra Road, Opposite DHQ Hospital, Jhang'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-gray-200">
                  <Clock className="w-5 h-5 text-[#07643D] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">
                      {isUrdu ? 'اوقاتِ کار:' : 'Opening Timings:'}
                    </span>
                    <span className="text-gray-700 text-xs block mt-0.5 font-medium">
                      {isUrdu ? 'روزانہ: صبح ۵:۳۰ سے رات ۱۲:۰۰ بجے تک (رات گئے)' : 'Every Day: 5:30 AM to 12:00 AM (Midnight)'}
                    </span>
                    <span className="text-[10px] text-[#07643D] font-bold block mt-0.5">
                      {isUrdu ? 'ہفتے کے ساتوں دن کھلی ہے' : 'Open 7 days a week with fresh morning batches'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FDFBF7] border border-gray-200">
                  <Phone className="w-5 h-5 text-[#07643D] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">
                      {isUrdu ? 'براہِ راست آرڈرز اور واٹس ایپ:' : 'Direct Orders & WhatsApp:'}
                    </span>
                    <span className="font-mono text-gray-800 text-xs block mt-0.5">
                      Call &amp; WhatsApp: <a href="https://wa.me/923227434080" target="_blank" rel="noreferrer" className="text-[#07643D] font-bold hover:underline">0322 7434080</a>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="tel:03227434080"
                  className="px-5 py-2.5 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isUrdu ? 'دکان پر کال کریں (0322 7434080)' : 'Call Store (0322 7434080)'}</span>
                </a>

                <Link
                  to="/locations"
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  {isUrdu ? 'لوکیشن دیکھیں' : 'Visit Store Location'}
                </Link>
              </div>
            </div>

            {/* Visual Store Banner / Map Placeholder */}
            <div className="bg-[#043E26] p-8 flex flex-col items-center justify-center text-center text-white relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#D4AF37] mb-4 shadow-xl">
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

              <h3 className="text-xl font-bold font-serif text-white">
                {isUrdu ? 'سویرا سویٹس اینڈ بیکرز' : 'Sawera Sweets & Bakers'}
              </h3>
              <p className={`text-xl text-[#F4D375] font-bold mt-1 ${isUrdu ? 'urdu-text' : ''}`}>
                {isUrdu ? 'ہر خوشی کیساتھ' : 'With Every Joy'}
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 text-xs max-w-sm">
                <p className="font-semibold text-emerald-200">
                  {isUrdu ? '۳۰+ سالہ روایتی معیار کی ضمانت' : '30+ Years Heritage Guarantee'}
                </p>
                <p className="text-[11px] text-emerald-300 mt-1">
                  {isUrdu ? 'جھنگ اور پورے پاکستان میں خالص دیسی گھی کی روایتی مٹھائیاں پیش کر رہے ہیں۔' : 'Proudly serving authentic pure desi ghee sweets and fresh bakery treats across Jhang and Pakistan.'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. CONTACT / DIRECT ORDER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#07643D] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                {isUrdu ? 'شادی بیاہ یا بڑی تقاریب کے آرڈرز درکار ہیں؟' : 'Need Custom Sweets or Bulk Orders?'}
              </h4>
              <p className="text-xs text-gray-500">
                {isUrdu ? 'شادی کے ڈبوں، کیکس اور کیٹرنگ کے لیے 0322 7434080 پر رابطہ فرمائیں۔' : 'Call or WhatsApp 0322 7434080 for wedding boxes, celebration cakes, and event catering.'}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/923227434080?text=Assalam-o-Alaikum%20Sawera%20Sweets,%20I%20want%20to%20inquire%20about%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors flex-shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isUrdu ? 'واٹس ایپ پر رابطہ کریں' : 'Chat on WhatsApp'}</span>
          </a>
        </div>
      </section>

    </div>
  );
}
