import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Truck, 
  Store, 
  ExternalLink, 
  Mail, 
  Sparkles, 
  Navigation,
  MessageCircle,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LocationsPage() {
  const { isUrdu } = useLanguage();

  const mainStore = {
    name: "Sawera Sweets & Bakers (Flagship Store & Sweets Factory)",
    nameUrdu: "سویرا سویٹس اینڈ بیکرز (مرکزی فلگ شپ اسٹور و فیکٹری)",
    city: "Jhang",
    address: "Gojra Road, Opposite DHQ Hospital, Jhang, Punjab",
    addressUrdu: "گوجرہ روڈ، بالمقابل ڈی ایچ کیو ہسپتال، جھنگ",
    phone: "0322 7434080",
    whatsapp: "0322 7434080",
    email: "sawerasweets.pk@gmail.com",
    timings: "5:30 AM - 12:00 AM (Midnight) Daily",
    rating: 5.0,
    reviewsCount: 340,
    tags: ["Authentic Desi Ghee", "Live Sweet Kitchen", "Fresh Daily Bakery", "Takeaway & Delivery"],
    googleMapsUrl: "https://maps.google.com/?q=Sawera+Sweets+Gojra+Road+Opposite+DHQ+Hospital+Jhang"
  };

  const expressStore = {
    name: "Sawera Sweets Express City Counter",
    nameUrdu: "سویرا سویٹس سٹی ایکسپریس کاؤنٹر",
    city: "Jhang",
    address: "Rail Bazaar, Near Ghanta Ghar, Jhang City",
    addressUrdu: "ریل بازار، نزد گھنٹہ گھر، جھنگ سٹی",
    phone: "0322 7434080",
    whatsapp: "0322 7434080",
    email: "sawerasweets.pk@gmail.com",
    timings: "8:00 AM - 11:00 PM Daily",
    rating: 4.9,
    reviewsCount: 120,
    tags: ["Special Patisa", "Fresh Mithai", "Fast Takeaway"],
    googleMapsUrl: "https://maps.google.com/?q=Rail+Bazaar+Jhang"
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Header (Clean Emerald & White) */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#07643D] border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ہماری برانچز' : 'Our Outlets'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#07643D] tracking-tight">
            {isUrdu ? 'سویرا سویٹس کے مراکز' : 'Our Store Locations'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {isUrdu
              ? 'گوجرہ روڈ جھنگ پر واقع ہمارا مرکزی اسٹور۔ روزانہ خالص دیسی گھی کی روایتی مٹھائیاں اور تازہ بیکری۔'
              : 'Visit our flagship physical store at Gojra Road, Opposite DHQ Hospital, Jhang, or order nationwide with fresh insulated delivery.'}
          </p>
        </div>

        {/* Flagship Store Card */}
        <div className="bg-white rounded-3xl border-2 border-[#07643D]/30 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#D4AF37] flex-shrink-0 shadow-xs">
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
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{mainStore.name}</h2>
                  <span className="text-[10px] bg-[#D4AF37] text-[#07643D] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Flagship
                  </span>
                </div>
                <p className="text-xs font-semibold text-amber-800 urdu-text mt-0.5">{mainStore.nameUrdu}</p>
                <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-gray-500 text-[11px] font-mono ml-1">5.0 (340+ Verified Reviews)</span>
                </div>
              </div>
            </div>

            <span className="self-start sm:self-auto px-3 py-1 rounded-full font-bold text-xs bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Open Daily
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Physical Address:</span>
              </div>
              <p className="text-gray-800 pl-6">{mainStore.address}</p>
              <p className="text-gray-500 urdu-text pl-6 text-[11px]">{mainStore.addressUrdu}</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Opening Hours:</span>
              </div>
              <p className="text-gray-800 pl-6 font-medium">{mainStore.timings}</p>
              <p className="text-emerald-800 pl-6 text-[11px] font-semibold">Fresh morning sweets ready at 5:30 AM</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Phone className="w-4 h-4 text-[#07643D]" />
                <span>Direct Contact:</span>
              </div>
              <p className="pl-6">
                Helpline &amp; WhatsApp: <a href="tel:03227434080" className="font-mono font-bold text-[#07643D] hover:underline">0322 7434080</a>
              </p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>Official Email:</span>
              </div>
              <p className="pl-6 font-mono text-gray-700">{mainStore.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {mainStore.tags.map((tag, idx) => (
                <span key={idx} className="text-[11px] bg-emerald-50 text-[#07643D] font-semibold px-2.5 py-1 rounded-lg border border-emerald-100">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={mainStore.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Navigation className="w-4 h-4 text-[#F4D375]" />
                <span>Open in Google Maps</span>
              </a>

              <a
                href="https://wa.me/923227434080?text=Assalam-o-Alaikum%20Sawera%20Sweets"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Express Counter Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-gray-900">{expressStore.name}</h3>
              <p className="text-xs text-amber-800 font-semibold urdu-text">{expressStore.nameUrdu}</p>
            </div>
            <span className="text-[10px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-bold uppercase">
              City Center Outlet
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{expressStore.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
              <span>{expressStore.timings}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#07643D] flex-shrink-0" />
              <span>Orders: <a href="tel:03227434080" className="font-mono font-bold hover:underline">0322 7434080</a></span>
            </div>
          </div>
        </div>

        {/* Nationwide Delivery Notice */}
        <div className="bg-emerald-50/80 rounded-2xl border border-emerald-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#07643D] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#07643D]">
                {isUrdu ? 'پورے پاکستان میں ہوم ڈلیوری' : 'Delivering Across Pakistan (240+ Cities)'}
              </h4>
              <p className="text-xs text-gray-600">
                Freshly packed sweets dispatched directly from Jhang in temperature-insulated sealed boxes.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/923227434080?text=Assalam-o-Alaikum%20Sawera%20Sweets,%20I%20want%20to%20order%20sweets%20delivery"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#07643D] text-white text-xs font-bold hover:bg-[#043E26] transition-colors whitespace-nowrap"
          >
            Order for Delivery
          </a>
        </div>

        {/* Branch Expansion Info */}
        <div className="text-center text-xs text-gray-500 py-2">
          <span>More official retail branches are being finalized. For franchise or corporate inquiries: </span>
          <a href="tel:03227434080" className="font-mono font-bold text-[#07643D] hover:underline">0322 7434080</a>
        </div>

      </div>
    </div>
  );
}