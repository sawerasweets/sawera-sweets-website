import React from 'react';
import { Award, Heart, ShieldCheck, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { isUrdu } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-xl mx-auto">
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

          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            {isUrdu ? 'ہمارے بارے میں' : '30+ Years Authentic Heritage'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#07643D]">
            Sawera Sweets &amp; Bakers
          </h1>
          <p className="urdu-text text-xl sm:text-2xl text-[#A5841D] font-bold">
            سویرا سویٹس اینڈ بیکرز - ہر خوشی کیساتھ
          </p>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            {isUrdu
              ? 'سویرا سویٹس اینڈ بیکرز پچھلے ۳۰ سالوں سے صارفین کو خالص دیسی گھی کی روایتی مٹھائیاں، تازہ بیکری اور روزمرہ گھریلو راشن فراہم کر رہا ہے۔'
              : 'Sawera Sweets & Bakers has been proudly serving customers for more than 30 years. We offer a wide range of sweets, bakery products, cosmetics, and everyday grocery essentials.'}
          </p>
        </div>

        {/* Story & Commitment */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-xl font-bold font-serif text-gray-900 border-b border-gray-100 pb-3">
            Our 30+ Years Journey &amp; Special Focus
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <strong>Sawera Sweets &amp; Bakers</strong> has been proudly serving customers for more than <strong>30 years</strong>. We offer a wide range of sweets, bakery products, cosmetics, and everyday grocery essentials. Our special focus is on our traditional sweets and fresh bakery products.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Every morning at our main store opposite DHQ Hospital on Gojra Road in Jhang, our experienced artisans begin preparing fresh batches of Gulab Jamun, Pista Barfi, Laddoo, and seasonal halwas using 100% certified pure desi ghee and fresh khoya. Our ovens bake cakes, biscuits, patties, and rusks daily to ensure your tea time is always served with the freshest flavors.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#07643D]" />
              <h3 className="text-sm font-bold text-gray-900">100% Fresh Daily</h3>
            </div>
            <p className="urdu-text text-xs text-[#A5841D] font-semibold">روزانہ تازہ تیار شدہ</p>
            <p className="text-xs text-gray-500 leading-relaxed">Sweets and bakery items prepared fresh daily with traditional recipes.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#07643D]" />
              <h3 className="text-sm font-bold text-gray-900">Pure Desi Ghee &amp; Premium Ingredients</h3>
            </div>
            <p className="urdu-text text-xs text-[#A5841D] font-semibold">خالص دیسی گھی اور معیاری اجزاء</p>
            <p className="text-xs text-gray-500 leading-relaxed">Pure khoya, authentic desi ghee, and uncompromising ingredient quality.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#07643D]" />
              <h3 className="text-sm font-bold text-gray-900">Hygienic Packaging</h3>
            </div>
            <p className="urdu-text text-xs text-[#A5841D] font-semibold">صاف ستھری محفوظ پیکنگ</p>
            <p className="text-xs text-gray-500 leading-relaxed">Strict hygiene standards and food-grade protective celebration boxes.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#07643D]" />
              <h3 className="text-sm font-bold text-gray-900">Fast Local &amp; Nationwide Delivery</h3>
            </div>
            <p className="urdu-text text-xs text-[#A5841D] font-semibold">فوری لوکل ڈلیوری</p>
            <p className="text-xs text-gray-500 leading-relaxed">Prompt doorstep delivery across Jhang and safe shipping across Pakistan.</p>
          </div>
        </div>

        {/* Store Highlights Note */}
        <div className="p-6 rounded-3xl bg-[#07643D] text-white space-y-3 text-center border-2 border-[#D4AF37]/50 shadow-md">
          <h3 className="text-base font-bold font-serif">Visit Shop 1 (Main Store)</h3>
          <p className="text-xs text-emerald-100 max-w-md mx-auto">
            Gojra Road, Opposite DHQ Hospital, Jhang
          </p>
          <p className="text-xs text-[#F4D375] font-mono">
            Operating Hours: 5:30 AM to 12:00 AM (Midnight) Every Day
          </p>
          <p className="text-xs text-emerald-200">
            Call: 0322 7434080 • WhatsApp: 0347 1702710
          </p>
        </div>

      </div>
    </div>
  );
}
