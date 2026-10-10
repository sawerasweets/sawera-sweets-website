import React, { useMemo } from 'react';
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
  Zap,
  CheckCircle2,
  Heart,
  PlusCircle
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { STORE_CONFIG } from '../data/storeConfig';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';

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

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-[#07643D] to-[#043E26] text-white overflow-hidden py-12 md:py-20 border-b-4 border-[#D4AF37]">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-between">
          <div className="w-96 h-96 rounded-full bg-[#D4AF37] blur-3xl transform -translate-x-1/2" />
          <div className="w-96 h-96 rounded-full bg-emerald-400 blur-3xl transform translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
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
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold urdu-text tracking-tight leading-tight text-white">
                  خالص روایتی <span className="text-[#F4D375]">مٹھائیاں</span>، بیکری اور ضروریاتِ زندگی
                </h1>
              ) : (
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight leading-tight text-white">
                  Fresh Traditional <span className="text-[#F4D375]">Sweets</span>, Bakery &amp; Daily Essentials
                </h1>
              )}

              {/* Subtitle */}
              {isUrdu ? (
                <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto lg:mx-0 leading-relaxed urdu-text">
                  خالص دیسی گھی سے بنے گلاب جامن، تازہ کیک، روزمرہ کریانہ، اور خوشبودار عطورات سیدھے آپ کے گھر تک۔
                </p>
              ) : (
                <p className="text-xs sm:text-base text-emerald-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Indulge in melt-in-the-mouth Gulab Jamun made with pure desi ghee, fresh daily celebration cakes, kitchen grocery staples, and fine personal fragrances delivered to your doorstep.
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
                  to="/category/bakery"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-xs transition-colors"
                >
                  <span>{isUrdu ? 'بیکری کا وزٹ کریں' : 'Explore Bakery'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </Link>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent("Assalam-o-Alaikum Sawera Sweets! I would like to place an order.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-[#043E26] hover:bg-emerald-950 border border-emerald-600/50 text-emerald-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isUrdu ? 'واٹس ایپ آرڈر' : 'WhatsApp Order'}</span>
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
                  <span className="font-bold text-white block">{isUrdu ? 'گھر پر فوری ترسیل' : 'Doorstep Delivery'}</span>
                  <span>{isUrdu ? 'جھنگ اور گردونواح' : 'Fast local delivery'}</span>
                </div>
              </div>

            </div>

            {/* Right Brand Badge / Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-tr from-[#D4AF37] via-emerald-600 to-[#D4AF37] shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/90 bg-[#07643D] flex items-center justify-center relative">
                  <img
                    src="/images/logo/logo.jpg"
                    alt="Sawera Sweets & Bakers Official Badge"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/src/assets/logo.jpg";
                    }}
                  />
                </div>
                
                {/* Floating Tag */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-[#07643D] px-4 py-1.5 rounded-full border-2 border-[#D4AF37] shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    {isUrdu ? 'اعلیٰ ترین معیار کی ضمانت' : 'Premium Quality Guaranteed'}
                  </span>
                </div>
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-2xl border border-gray-200 hover:border-[#D4AF37] p-4 text-center flex flex-col items-center justify-between shadow-2xs hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 group-hover:bg-[#07643D] text-[#07643D] group-hover:text-white flex items-center justify-center transition-colors mb-3 border border-emerald-100">
                <span className="text-lg font-serif font-bold group-hover:scale-110 transition-transform">
                  {cat.name.slice(0, 2).toUpperCase()}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className={`text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#07643D] transition-colors leading-tight ${isUrdu ? 'urdu-text text-sm' : ''}`}>
                  {isUrdu ? (cat.urduName || cat.name) : cat.name}
                </h3>
              </div>

              <span className="mt-3 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                {cat.badge}
              </span>
            </Link>
          ))}
        </div>
      </section>

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
                href="https://wa.me/923471702710"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>WhatsApp Order (0347 1702710)</span>
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
                      Call: <a href="tel:03227434080" className="font-bold hover:underline">0322 7434080</a> • WhatsApp: <a href="https://wa.me/923471702710" target="_blank" rel="noreferrer" className="text-[#07643D] font-bold hover:underline">0347 1702710</a>
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
                {isUrdu ? 'شادی کے ڈبوں، کیکس اور کیٹرنگ کے لیے 0322 7434080 یا واٹس ایپ 0347 1702710 پر رابطہ فرمائیں۔' : 'Call 0322 7434080 or WhatsApp 0347 1702710 for wedding boxes, celebration cakes, and event catering.'}
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/923471702710?text=Assalam-o-Alaikum%20Sawera%20Sweets,%20I%20want%20to%20inquire%20about%20an%20order."
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
