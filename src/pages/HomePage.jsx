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
  const { products, categories } = useStore();
  const { isAdmin } = useAuth();
  const { isUrdu, t } = useLanguage();

  const activeProducts = useMemo(() => (products || []).filter(p => p.isActive !== false), [products]);
  const activeCategories = useMemo(() => (categories || CATEGORIES).filter(c => c.isActive !== false), [categories]);

  const featuredProducts = useMemo(() => {
    return activeProducts.filter(p => p.isFeatured).slice(0, 4);
  }, [activeProducts]);

  const bestSellers = useMemo(() => {
    return activeProducts.filter(p => p.salesCount > 0 || p.isBestSeller).slice(0, 4);
  }, [activeProducts]);

  const specialOffers = useMemo(() => {
    return activeProducts.filter(p => p.discountPrice && p.discountPrice < p.price).slice(0, 4);
  }, [activeProducts]);

  const marqueeCategories = useMemo(() => {
    return [...activeCategories, ...activeCategories, ...activeCategories];
  }, [activeCategories]);

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
      .map(id => activeProducts.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, 4);
  }, [recentlyViewedIds, activeProducts]);

  // Full-width VIP Hero Slider Slides (Showcasing authentic Sawera Sweets handmade in Jhang)
  const heroSlides = useMemo(() => {
    return [
      {
        id: "slide-roll-barfi",
        productId: "prd-special-roll-barfi",
        tag: "⭐ Flagship Signature Since 1994",
        urduTag: "⭐ سویرا کا ۳۰ سالہ بااعتماد نام",
        title: "Special Roll Barfi",
        urduTitle: "سوئیرا اسپیشل رول برفی",
        subtitle: "Hand-rolled with 100% pure thick khoya, fragrant desi ghee, and lavishly coated with crunchy roasted pistachios and almonds.",
        urduSubtitle: "سو فیصد خالص کڑھے ہوئے کھوئے اور دیسی گھی سے تیار کردہ، پستے اور بادام کے لذیذ مغز میں لپٹی منہ میں گھل جانے والی شاہی رول برفی۔",
        image: "/images/hero/hero-roll-barfi.jpg",
        link: "/product/prd-special-roll-barfi",
        buttonText: "Order Roll Barfi (Rs. 1,200/kg)",
        urduButtonText: "رول برفی آرڈر کریں (1,200 روپے)",
        badge: "Top Seller #1"
      },
      {
        id: "slide-paltawa-patisa",
        productId: "prd-paltawa-patisa",
        tag: "Flaky & Melt-in-Mouth",
        urduTag: "خالص دیسی گھی خستہ پتیسہ",
        title: "Paltawa Patisa (Flaky Patisa)",
        urduTitle: "مشہور پلٹواں پتیسہ (خستہ دیسی گھی)",
        subtitle: "Multi-layered crispy caramelized desi ghee patisa loaded with hand-sliced almond slivers. Traditional royal perfection.",
        urduSubtitle: "خالص دیسی گھی اور الائچی کی سوندھی خوشبو میں پکا ہوا خستہ اور لذیذ تہوں والا روایتی پلٹواں پتیسہ۔",
        image: "/images/hero/hero-paltawa-patisa.jpg",
        link: "/product/prd-paltawa-patisa",
        buttonText: "Order Paltawa Patisa",
        urduButtonText: "پلٹواں پتیسہ آرڈر کریں",
        badge: "Pure Desi Ghee"
      },
      {
        id: "slide-pista-patisa",
        productId: "prd-shapper-pista-patisa",
        tag: "Royal Green Pistachio",
        urduTag: "شاہی شاپڑ پستہ پتیسہ",
        title: "Special Shapper Pista Patisa",
        urduTitle: "اسپیشل شاپڑ پستہ پتیسہ (گول لچھا)",
        subtitle: "Iconic green pistachio round flaky cakes studded with almond flakes. Fragrant, crisp, and freshly prepared.",
        urduSubtitle: "سبز پستے اور بادام سے سجا ہوا لچھے دار گول شاپڑ پتیسہ، ہر نوالے میں روایتی خستہ مٹھاس۔",
        image: "/images/hero/hero-pista-patisa.jpg",
        link: "/product/prd-shapper-pista-patisa",
        buttonText: "Order Pista Patisa",
        urduButtonText: "پستہ پتیسہ آرڈر کریں",
        badge: "Crispy Royal"
      },
      {
        id: "slide-shahi-halwa",
        productId: "prd-dry-fruit-halwa",
        tag: "Rich & Loaded Dry Fruits",
        urduTag: "شاہی ڈرائی فروٹ حلوہ",
        title: "Special Shahi Dry Fruit Halwa",
        urduTitle: "اسپیشل شاہی ڈرائی فروٹ حلوہ",
        subtitle: "Slow-simmered in pure desi ghee, richly crowned with whole cashews, almonds, pistachios, and golden raisins.",
        urduSubtitle: "خالص دیسی گھی میں روایتی کڑھائی میں پکا ہوا حلوہ، کاجو، بادام، پستہ اور کشمش کے وافر مغز سے مالا مال۔",
        image: "/images/hero/hero-shahi-halwa.jpg",
        link: "/product/prd-dry-fruit-halwa",
        buttonText: "Order Shahi Halwa",
        urduButtonText: "شاہی حلوہ آرڈر کریں",
        badge: "Desi Ghee Recipe"
      },
      {
        id: "slide-coconut-halwa",
        productId: "prd-special-coconut-halwa",
        tag: "Fresh Coconut & Khoya",
        urduTag: "بادامی و اسپیشل کوکونٹ حلوہ",
        title: "Special Coconut & Badami Halwa",
        urduTitle: "اسپیشل کوکونٹ و بادامی حلوہ",
        subtitle: "Delicate shredded coconut and fresh buffalo milk khoya cooked in pure desi ghee, garnished with toasted pistachios and almonds.",
        urduSubtitle: "تازہ ناریل اور کھوئے سے تیار کردہ منفرد ذائقے دار حلوہ، بادام اور پستے کے لذیذ چھڑکاؤ کے ساتھ۔",
        image: "/images/hero/hero-coconut-halwa.jpg",
        link: "/product/prd-special-coconut-halwa",
        buttonText: "Order Coconut Halwa",
        urduButtonText: "کوکونٹ حلوہ آرڈر کریں",
        badge: "Fresh Daily"
      }
    ];
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Categorized product selections for shelves (only from active products and active categories)
  const topSellingProducts = useMemo(() => {
    const priorityIds = [
      'prd-special-roll-barfi',
      'prd-paltawa-patisa',
      'prd-shapper-pista-patisa',
      'prd-dry-fruit-halwa',
      'prd-special-coconut-halwa',
      'prd-special-badam-barfi'
    ];
    const prioritized = [];
    priorityIds.forEach(id => {
      const found = activeProducts.find(p => p.id === id);
      if (found) prioritized.push(found);
    });
    const rest = activeProducts.filter(p => !priorityIds.includes(p.id) && (p.isBestSeller || p.salesCount > 0));
    return [...prioritized, ...rest].slice(0, 6);
  }, [activeProducts]);

  const halwaSweets = useMemo(() => {
    if (!activeCategories.some(c => c.slug === 'sweets')) return [];
    const items = activeProducts.filter(p => p.category === 'sweets' && (p.subCategory?.includes('Halwa') || p.name.includes('Halwa') || p.name.includes('Barfi')));
    return (items.length > 0 ? items : activeProducts.filter(p => p.category === 'sweets')).slice(0, 6);
  }, [activeProducts, activeCategories]);

  const patisaSweets = useMemo(() => {
    if (!activeCategories.some(c => c.slug === 'sweets')) return [];
    const items = activeProducts.filter(p => p.category === 'sweets' && (p.subCategory?.includes('Patisa') || p.name.includes('Patisa') || p.name.includes('Tafi')));
    return (items.length > 0 ? items : activeProducts.filter(p => p.category === 'sweets')).slice(0, 6);
  }, [activeProducts, activeCategories]);

  const trendingProducts = useMemo(() => {
    if (!activeCategories.some(c => c.slug === 'trending')) return [];
    return activeProducts.filter(p => p.category === 'trending').slice(0, 6);
  }, [activeProducts, activeCategories]);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 bg-white font-sans">

      {/* 1. FULL-WIDTH EDGE-TO-EDGE VIP HERO SLIDER */}
      <section className="relative w-full overflow-hidden bg-black border-b-4 border-[#D4AF37]">
        <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px]">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              {/* Full-bleed VIP High-Res Photo */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Elegant ambient contrast gradient - Food photo stays bright & mouthwatering */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent/10 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

              {/* VIP Frosted Glass Slide Content */}
              <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 lg:px-12 flex items-center relative z-20">
                <div className="max-w-xl bg-black/50 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-3.5 text-left">
                  
                  {/* Tag Pill */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37] text-neutral-950 font-extrabold text-xs uppercase tracking-wider shadow-lg">
                    <span>{isUrdu ? slide.urduTag : slide.tag}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-950" />
                    <span className="text-[10px] opacity-90">{slide.badge}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white leading-tight drop-shadow-md">
                    {isUrdu ? slide.urduTitle : slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-light drop-shadow-xs">
                    {isUrdu ? slide.urduSubtitle : slide.subtitle}
                  </p>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap gap-2.5">
                    <Link
                      to={slide.link}
                      className="px-5 py-3 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-transform hover:-translate-y-0.5 border border-emerald-400/40 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isUrdu ? slide.urduButtonText : slide.buttonText}</span>
                    </Link>

                    <a
                      href={`https://wa.me/923227434080?text=${encodeURIComponent(`Assalam o Alaikum Sawera Sweets!\nI want to order: ${slide.title}.\nPlease share details and confirm delivery.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{isUrdu ? 'واٹس ایپ آرڈر' : 'WhatsApp (0322 7434080)'}</span>
                    </a>
                  </div>

                </div>
              </div>
            </div>
          ))}

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 flex items-center justify-center z-30 transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 flex items-center justify-center z-30 transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Pagination Dots */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? 'w-8 h-2.5 bg-[#D4AF37] shadow-md'
                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. BRAND TITLE & 4 VALUE PROPOSITION CARDS (Image 2 from Suleman Sweets) */}
      <section className="bg-white border-y border-gray-100 py-8 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Centered Brand Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#07643D] font-serif">
              {isUrdu 
                ? 'سویرا سویٹس اینڈ بیکرز — خالص روایتی مٹھائیاں، کیکس اور بیکری' 
                : 'Sawera Sweets & Bakers — Fresh Pakistani Mithai, Cakes & Bakery'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl mx-auto">
              {isUrdu 
                ? 'جھنگ کی تیس سالہ بااعتماد روایت، خالص دیسی گھی کے اجزاء اور ملک گیر محفوظ ترسیل' 
                : 'Over 30 years of sweet heritage in Jhang, handcrafted daily with pure ingredients'}
            </p>
          </div>

          {/* 4 Cards Grid - Crisp White & Emerald Green */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {/* 1. Fast Delivery */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 hover:border-[#07643D] transition-all shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#07643D] flex items-center justify-center shrink-0 border border-emerald-100">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                  {isUrdu ? 'تیز ترین ترسیل' : 'Fast Delivery'}
                </h4>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                  {isUrdu ? 'جھنگ میں ہوم ڈلیوری اور پاکستان بھر میں کورئیر' : 'Same-day in Jhang & express nationwide'}
                </p>
              </div>
            </div>

            {/* 2. 100% Desi Ghee & Halal */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 hover:border-[#07643D] transition-all shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#07643D] flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                  {isUrdu ? '۱۰۰٪ خالص دیسی گھی' : '100% Desi Ghee'}
                </h4>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                  {isUrdu ? 'سو فیصد خالص کڑھے ہوئے کھوئے کی تیاری' : 'Pure milk solids & certified halal'}
                </p>
              </div>
            </div>

            {/* 3. Loyalty Rewards */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 hover:border-[#07643D] transition-all shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#07643D] flex items-center justify-center shrink-0 border border-emerald-100">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                  {isUrdu ? 'لوئلٹی ریوارڈ پوائنٹس' : 'Loyalty Rewards'}
                </h4>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                  {isUrdu ? 'ہر آرڈر پر پوائنٹس اور ڈسکاؤنٹ حاصل کریں' : 'Earn reward points on every order'}
                </p>
              </div>
            </div>

            {/* 4. Premium Packing */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 hover:border-[#07643D] transition-all shadow-2xs">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#07643D] flex items-center justify-center shrink-0 border border-emerald-100">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                  {isUrdu ? 'شاہی گفٹ پیکنگ' : 'Premium Packing'}
                </h4>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                  {isUrdu ? 'ساٹن ربن اور کسٹم مٹھائی بکس اسٹوڈیو' : 'Luxury boxes & satin ribbon presentation'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HOT & TOP SELLING SECTION (Image 2 from Suleman Sweets) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-widest text-rose-700">
                {isUrdu ? 'سب سے زیادہ پسندیدہ' : 'Hot & Top Selling'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 mt-1">
              {isUrdu ? 'سب سے زیادہ فروخت ہونے والی اشیاء' : 'Hot & Top Selling'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isUrdu ? 'وہ مٹھائیاں جو گاہک اس وقت سب سے زیادہ آرڈر کر رہے ہیں' : 'The sweets everyone is ordering right now'}
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-[#07643D] hover:underline flex items-center gap-1"
          >
            <span>{isUrdu ? 'سب دیکھیں' : 'View All'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {topSellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SHOP BY CATEGORY GRID (Image 3 from Suleman Sweets) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#07643D]">
                {isUrdu ? 'ہمارے شعبہ جات' : 'Departments'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 mt-1">
              {isUrdu ? 'کیٹیگری کے لحاظ سے خریداری کریں' : 'Shop by Category'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isUrdu ? 'ہماری تمام کیٹیگریز اور پروڈکٹس کو دیکھیں' : 'Explore our wide range of authentic products'}
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-[#07643D] hover:underline flex items-center gap-1"
          >
            <span>{isUrdu ? 'تمام شعبہ جات دیکھیں' : 'View All'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2-Row Photographic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {activeCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/80 hover:border-[#D4AF37]"
            >
              <img
                src={cat.image || `/images/categories/${cat.id}.jpg`}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/products/gulab-jamun.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity" />
              
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {cat.badge || 'Store'}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className={`font-serif font-bold text-sm sm:text-base group-hover:text-[#F4D375] transition-colors ${isUrdu ? 'urdu-text text-base sm:text-lg' : ''}`}>
                  {isUrdu ? (cat.urduName || cat.name) : cat.name}
                </h3>
                <span className="text-[11px] text-gray-300 block opacity-90">
                  {isUrdu ? 'دیکھنے کے لیے کلک کریں ←' : 'Browse Items →'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. CATEGORY SHELF: HALWAJAAT & TRADITIONAL SWEETS (Image 3 & 4 from Suleman Sweets) */}
      {halwaSweets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#07643D]">
                {isUrdu ? 'روایتی حلوہ جات و برفی' : 'Heritage Confectionery'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 mt-1">
                {isUrdu ? 'حلوہ جات و اسپیشل برفی' : 'Halwajaat & Traditional Sweets'}
              </h2>
            </div>

            <Link
              to="/category/sweets"
              className="text-xs font-bold text-[#07643D] hover:underline flex items-center gap-1"
            >
              <span>{isUrdu ? 'سب حلوہ جات دیکھیں' : 'View All'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {halwaSweets.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. CATEGORY SHELF: PATISA & SOHAN HALWA (Image 3 from Suleman Sweets) */}
      {patisaSweets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                {isUrdu ? 'خستہ مٹھاس' : 'Flaky & Crispy Delights'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 mt-1">
                {isUrdu ? 'پتیسہ و سوہن حلوہ' : 'Patisa & Sohan Halwa'}
              </h2>
            </div>

            <Link
              to="/category/sweets"
              className="text-xs font-bold text-[#07643D] hover:underline flex items-center gap-1"
            >
              <span>{isUrdu ? 'سب پتیسہ دیکھیں' : 'View All'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {patisaSweets.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. CATEGORY SHELF: SOCIAL MEDIA TRENDING ITEMS (New Category Shelf) */}
      {trendingProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-rose-700">
                {isUrdu ? '🔥 وائرل اشیاء' : '🔥 Social Media Viral'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 mt-1">
                {isUrdu ? 'سوشل میڈیا ٹرینڈنگ آئٹمز' : 'Social Media Trending Items'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isUrdu ? 'کوکیز، چاکلیٹ، امپورٹڈ بسکٹس اور وائرل اسنیکس' : 'Viral cookies, chocolates, chips and daily new arrivals'}
              </p>
            </div>

            <Link
              to="/category/trending"
              className="text-xs font-bold text-[#07643D] hover:underline flex items-center gap-1"
            >
              <span>{isUrdu ? 'تمام ٹرینڈنگ اشیاء' : 'View All'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 8. SAWERA MITHAI BOX STUDIO (SIGNATURE LUXURY FEATURE) */}
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

      {/* 9. OCCASION-BASED COLLECTIONS SECTION */}
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

      {/* 10. SPECIAL OFFERS SECTION */}
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {specialOffers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
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
