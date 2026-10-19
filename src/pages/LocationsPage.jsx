import React from 'react';
import { Building2, MapPin, Phone, Clock, Truck, Store, ExternalLink, ShieldCheck, Mail, Sparkles, Navigation } from 'lucide-react';
import db from '../services/db';
import { useLanguage } from '../context/LanguageContext';

export default function LocationsPage() {
  const { isUrdu } = useLanguage();
  const branches = db.getBranches().filter(b => !b.isArchived);
  const store = branches[0] || {
    id: "shop-1",
    name: "Sawera Sweets & Bakers (Main Store)",
    nameUrdu: "سویرا سویٹس اینڈ بیکرز (مرکزی اسٹور)",
    address: "Gojra Road, Opposite DHQ Hospital, Jhang",
    addressUrdu: "گوجرہ روڈ، بالمقابل ڈی ایچ کیو ہسپتال، جھنگ",
    whatsapp: "0322 7434080",
    phone: "0322 7434080",
    email: "sawerasweets.pk@gmail.com",
    timings: "5:30 AM - 12:00 AM (Midnight), Every Day",
    isOpen: true,
    deliveryEnabled: true,
    pickupEnabled: false
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#07643D]/10 px-3 py-1 rounded-full">
          {isUrdu ? 'ہماری دکان کا پتہ' : 'Official Store Location'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#07643D] mt-2">
          {isUrdu ? 'سویرا سویٹس اینڈ بیکرز - جھنگ' : 'Sawera Sweets & Bakers Store'}
        </h1>
        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
          {isUrdu
            ? 'گوجرہ روڈ، بالمقابل ڈی ایچ کیو ہسپتال جھنگ پر واقع ہمارا مرکزی اسٹور۔ روزانہ خالص دیسی گھی کی روایتی مٹھائیاں اور تازہ بیکری۔'
            : 'Visit our flagship physical store at Gojra Road, Opposite DHQ Hospital, Jhang. Serving authentic taste, pure desi ghee sweets, and oven-fresh bakery items with 30+ years of excellence.'}
        </p>
      </div>

      {/* Main Store Card */}
      <div className="bg-white rounded-3xl border-2 border-[#07643D]/30 shadow-md p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#D4AF37] flex-shrink-0 shadow-sm">
              <img
                src="/images/logo/logo.jpg"
                alt="Sawera Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/logo.jpg";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{store.name}</h2>
                <span className="text-[10px] bg-[#D4AF37] text-[#07643D] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Flagship Store
                </span>
              </div>
              <p className="text-sm text-amber-800 font-semibold urdu-text mt-0.5">{store.nameUrdu}</p>
            </div>
          </div>

          <span className={`self-start sm:self-auto px-3 py-1 rounded-full font-bold text-xs uppercase ${
            store.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
          }`}>
            {store.isOpen ? 'Open Today' : 'Temporarily Closed'}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
          {/* Address & Timings */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block text-xs">Physical Address:</span>
                <span className="text-gray-800 font-medium block mt-0.5">{store.address}</span>
                <span className="text-gray-500 urdu-text text-[11px] block mt-0.5">{store.addressUrdu}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block text-xs">Operating Hours:</span>
                <span className="text-gray-800 font-medium block mt-0.5">{store.timings}</span>
                <span className="text-[11px] text-[#07643D] font-semibold block mt-0.5">Fresh morning sweet batches ready at 5:30 AM</span>
              </div>
            </div>
          </div>

          {/* Contact Numbers & Email */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <Phone className="w-5 h-5 text-[#07643D] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block text-xs">Direct Orders &amp; Inquiries:</span>
                <div className="mt-1 space-y-0.5">
                  <p>
                    Call: <a href={`tel:${store.phone}`} className="font-mono font-bold text-gray-900 hover:underline">{store.phone}</a>
                  </p>
                  <p>
                    WhatsApp: <a href={`https://wa.me/92${store.whatsapp.replace(/^0/, '')}`} target="_blank" rel="noreferrer" className="font-mono font-bold text-[#07643D] hover:underline">{store.whatsapp}</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <Mail className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block text-xs">Official Email:</span>
                <a href={`mailto:${store.email}`} className="text-gray-700 font-mono hover:underline block mt-0.5">
                  {store.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Guarantees */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-[#07643D] font-bold border border-emerald-200 text-xs">
              <Truck className="w-4 h-4" />
              <span>Jhang City Home Delivery</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200 text-xs">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>All-Pakistan Courier Shipping</span>
            </span>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] font-bold text-xs shadow-sm transition-colors"
          >
            <Navigation className="w-4 h-4 text-[#D4AF37]" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
