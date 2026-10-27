import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Truck, 
  Store, 
  ExternalLink, 
  ShieldCheck, 
  Mail, 
  Sparkles, 
  Navigation,
  MessageCircle,
  Star,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import db from '../services/db';
import { useLanguage } from '../context/LanguageContext';

export const OUTLETS_DATA = [
  {
    id: 'jhang-main',
    name: 'Sawera Sweets & Bakers (Flagship Store & Factory)',
    nameUrdu: 'سویرا سویٹس اینڈ بیکرز (مرکزی فلگ شپ اسٹور)',
    city: 'Jhang',
    address: 'Gojra Road, Opposite DHQ Hospital, Jhang, Punjab',
    addressUrdu: 'گوجرہ روڈ، بالمقابل ڈی ایچ کیو ہسپتال، جھنگ',
    phone: '0322 7434080',
    whatsapp: '0322 7434080',
    email: 'sawerasweets.pk@gmail.com',
    timings: '5:30 AM - 12:00 AM (Midnight) Daily',
    rating: 5.0,
    reviewsCount: 320,
    tags: ['Mithai Factory', 'Fresh Bakery', 'Desi Ghee', 'Dine-In & Takeaway', 'Instant Delivery'],
    isFlagship: true,
    isOpen: true,
    mapCoordinates: { x: 42, y: 58 }, // % on visual map
    googleMapsUrl: 'https://maps.google.com/?q=Sawera+Sweets+Gojra+Road+Opposite+DHQ+Hospital+Jhang'
  },
  {
    id: 'jhang-express',
    name: 'Sawera Sweets Express Counter',
    nameUrdu: 'سویرا سویٹس ایکسپریس کاؤنٹر',
    city: 'Jhang',
    address: 'Rail Bazaar, Near Ghanta Ghar, Jhang City',
    addressUrdu: 'ریل بازار، نزد گھنٹہ گھر، جھنگ سٹی',
    phone: '0322 7434080',
    whatsapp: '0322 7434080',
    email: 'sawerasweets.pk@gmail.com',
    timings: '8:00 AM - 11:00 PM Daily',
    rating: 4.9,
    reviewsCount: 145,
    tags: ['Fresh Mithai', 'Special Patisa', 'Takeaway Only'],
    isFlagship: false,
    isOpen: true,
    mapCoordinates: { x: 44, y: 60 },
    googleMapsUrl: 'https://maps.google.com/?q=Rail+Bazaar+Jhang+City'
  },
  {
    id: 'faisalabad-hub',
    name: 'Sawera Sweets Express Dispatch Hub Faisalabad',
    nameUrdu: 'سویرا سویٹس ڈسپیچ ہب فیصل آباد',
    city: 'Faisalabad',
    address: 'D Ground Commercial Area, Peoples Colony No. 1, Faisalabad',
    addressUrdu: 'ڈی گراؤنڈ کمرشل ایریا، پیپلز کالونی، فیصل آباد',
    phone: '0322 7434080',
    whatsapp: '0322 7434080',
    email: 'sawerasweets.pk@gmail.com',
    timings: '9:00 AM - 10:00 PM Daily',
    rating: 4.9,
    reviewsCount: 88,
    tags: ['Same Day Delivery', 'Insulated Packing', 'Event Mithai Orders'],
    isFlagship: false,
    isOpen: true,
    mapCoordinates: { x: 52, y: 54 },
    googleMapsUrl: 'https://maps.google.com/?q=D+Ground+Faisalabad'
  },
  {
    id: 'lahore-hub',
    name: 'Sawera Sweets Regional Fulfillment Hub Lahore',
    nameUrdu: 'سویرا سویٹس لاہور ریجنل فل فلمنٹ ہب',
    city: 'Lahore',
    address: 'Main Boulevard, Phase 2, Johar Town, Lahore',
    addressUrdu: 'مین بلیوارڈ، فیز 2، جوہر ٹاؤن، لاہور',
    phone: '0322 7434080',
    whatsapp: '0322 7434080',
    email: 'sawerasweets.pk@gmail.com',
    timings: '9:00 AM - 11:00 PM Daily',
    rating: 4.9,
    reviewsCount: 194,
    tags: ['Express Home Delivery', 'Corporate Gifting', 'Halwa Cold Dispatch'],
    isFlagship: false,
    isOpen: true,
    mapCoordinates: { x: 62, y: 52 },
    googleMapsUrl: 'https://maps.google.com/?q=Johar+Town+Lahore'
  },
  {
    id: 'islamabad-hub',
    name: 'Sawera Sweets Twin Cities Dispatch Hub',
    nameUrdu: 'سویرا سویٹس اسلام آباد / راولپنڈی ہب',
    city: 'Islamabad',
    address: 'Blue Area Commercial Center, Jinnah Avenue, Islamabad',
    addressUrdu: 'بلیو ایریا، جناح ایونیو، اسلام آباد',
    phone: '0322 7434080',
    whatsapp: '0322 7434080',
    email: 'sawerasweets.pk@gmail.com',
    timings: '9:00 AM - 10:00 PM Daily',
    rating: 5.0,
    reviewsCount: 76,
    tags: ['VIP Gift Hampers', 'Overnight Dispatch', 'Pure Desi Ghee'],
    isFlagship: false,
    isOpen: true,
    mapCoordinates: { x: 50, y: 32 },
    googleMapsUrl: 'https://maps.google.com/?q=Blue+Area+Islamabad'
  },
  {
    id: 'multan-hub',
    name: 'Sawera Sweets South Punjab Dispatch Hub Multan',
    nameUrdu: 'سویرا سویٹس ساؤتھ پنجاب ہب ملتان',
    city: 'Multan',
    address: 'Gulgasht Colony Commercial Circle, Multan',
    addressUrdu: 'گلگشت کالونی، ملتان',
    phone: '0322 7434080',
    whatsapp: '0322 7434080',
    email: 'sawerasweets.pk@gmail.com',
    timings: '9:00 AM - 10:00 PM Daily',
    rating: 4.9,
    reviewsCount: 65,
    tags: ['Sohan Halwa Express', 'Fast Courier Hub'],
    isFlagship: false,
    isOpen: true,
    mapCoordinates: { x: 38, y: 70 },
    googleMapsUrl: 'https://maps.google.com/?q=Gulgasht+Colony+Multan'
  },
  {
    id: 'karachi-hub',
    name: 'Sawera Sweets Air Express Center Karachi',
    nameUrdu: 'سویرا سویٹس کراچی ائیر ایکسپریس ڈسپیچ',
    city: 'Karachi',
    address: 'Shahrah-e-Faisal / PECHS Block 2, Karachi',
    addressUrdu: 'شاہراہ فیصل، پی ای سی ایچ ایس، کراچی',
    phone: '0322 7434080',
    whatsapp: '0322 7434080',
    email: 'sawerasweets.pk@gmail.com',
    timings: '10:00 AM - 9:00 PM Daily',
    rating: 4.8,
    reviewsCount: 112,
    tags: ['Air Courier Delivery', 'Custom Gift Boxes', 'Nationwide Guarantee'],
    isFlagship: false,
    isOpen: true,
    mapCoordinates: { x: 25, y: 92 },
    googleMapsUrl: 'https://maps.google.com/?q=Shahrah-e-Faisal+Karachi'
  }
];

export default function LocationsPage() {
  const { isUrdu } = useLanguage();
  const [selectedCity, setSelectedCity] = useState('All');
  const [activeOutletId, setActiveOutletId] = useState('jhang-main');
  const [modalOutlet, setModalOutlet] = useState(null);

  const filteredOutlets = OUTLETS_DATA.filter(o => {
    if (selectedCity === 'All') return true;
    return o.city.toLowerCase() === selectedCity.toLowerCase();
  });

  const citiesList = ['All', 'Jhang', 'Lahore', 'Faisalabad', 'Islamabad', 'Multan', 'Karachi'];

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Title (Suleman Sweets Benchmark) */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#07643D] border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ہماری برانچز اور ڈسپیچ سینٹرز' : 'Store Network & Regional Hubs'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#07643D] tracking-tight">
            {isUrdu ? 'ہماری برانچز (Our Outlets)' : 'Our Outlets'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {isUrdu
              ? 'پنجاب اور پورے پاکستان میں سویرا سویٹس کے قریبی فزیکل اسٹورز اور ایکسپریس ڈسپیچ سینٹرز تلاش کریں۔'
              : 'Find Sawera Sweets & Bakers flagship store and regional dispatch hubs near you across Punjab and Pakistan.'}
          </p>
        </div>

        {/* Visual Interactive Map of Punjab & Pakistan */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50/60">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Interactive Location Map</span>
              <h3 className="text-base font-bold text-stone-900">
                Sawera Sweets Flagship &amp; Regional Hubs Across Pakistan
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping inline-block"></span>
              <span className="font-bold text-[#07643D]">Flagship: Gojra Road, Jhang</span>
            </div>
          </div>

          <div className="relative h-72 sm:h-96 bg-[#E8F1EC] overflow-hidden flex items-center justify-center p-4">
            {/* Background Stylized Map Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(#07643D 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}></div>

            {/* Stylized Punjab / Pakistan Map Outline Box */}
            <div className="relative w-full max-w-2xl h-full border-2 border-dashed border-[#07643D]/20 rounded-2xl flex items-center justify-center">
              
              <div className="absolute top-4 left-4 text-left pointer-events-none">
                <span className="text-[10px] font-mono font-bold text-emerald-900 uppercase tracking-widest bg-emerald-100/80 px-2 py-0.5 rounded">
                  PAKISTAN • PUNJAB NETWORK
                </span>
                <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                  Daily Fresh Dispatch from Jhang Factory Since 1994
                </p>
              </div>

              {/* Interactive Pins */}
              {OUTLETS_DATA.map((outlet) => {
                const isSelected = activeOutletId === outlet.id;
                return (
                  <button
                    key={outlet.id}
                    onClick={() => {
                      setActiveOutletId(outlet.id);
                      setModalOutlet(outlet);
                    }}
                    style={{
                      left: `${outlet.mapCoordinates.x}%`,
                      top: `${outlet.mapCoordinates.y}%`
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 group cursor-pointer ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-115'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full shadow-md flex items-center justify-center transition-all ${
                        outlet.isFlagship
                          ? 'bg-red-600 text-white ring-4 ring-red-200'
                          : isSelected
                          ? 'bg-[#07643D] text-white ring-4 ring-emerald-200'
                          : 'bg-white text-[#07643D] border border-stone-200'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs ${
                        outlet.isFlagship
                          ? 'bg-red-600 text-white'
                          : isSelected
                          ? 'bg-[#07643D] text-white'
                          : 'bg-white/90 text-stone-800 border border-stone-200'
                      }`}>
                        {outlet.city} {outlet.isFlagship ? '★ Flagship' : ''}
                      </span>
                    </div>
                  </button>
                );
              })}

              <div className="absolute bottom-3 right-3 text-right pointer-events-none">
                <span className="text-[10px] text-stone-500 font-mono">
                  Click any pin to view address &amp; phone
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar (Suleman Sweets: '12 Outlets Found' & 'All Cities' dropdown) */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-stone-600">
            <span className="font-bold text-stone-900 font-mono text-sm">{filteredOutlets.length}</span> Outlets &amp; Regional Hubs found
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {citiesList.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCity.toLowerCase() === city.toLowerCase()
                    ? 'bg-[#07643D] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {city === 'All' ? 'All Cities' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Outlets Grid (3 Columns Benchmark) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutlets.map((outlet) => {
            return (
              <div
                key={outlet.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                  outlet.isFlagship ? 'border-[#07643D] ring-2 ring-[#07643D]/20' : 'border-stone-200'
                }`}
              >
                {/* Header */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-stone-900 font-serif leading-snug">
                        {outlet.name}
                      </h3>
                      <p className="text-xs font-semibold text-amber-800 urdu-text mt-0.5">
                        {outlet.nameUrdu}
                      </p>
                    </div>
                    {outlet.isFlagship && (
                      <span className="bg-[#D4AF37] text-[#07643D] font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0">
                        Flagship
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-500">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-stone-500 text-[11px] font-mono font-semibold">
                      {outlet.rating} ({outlet.reviewsCount})
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-xs text-stone-600 pt-1">
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{outlet.address}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <Phone className="w-4 h-4 text-[#07643D] flex-shrink-0" />
                    <a href={`tel:${outlet.phone}`} className="font-mono font-bold text-stone-900 hover:underline">
                      {outlet.phone}
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Mail className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    <span className="font-mono text-[11px] truncate">{outlet.email}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {outlet.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => setModalOutlet(outlet)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white text-xs font-bold transition-colors shadow-2xs text-center cursor-pointer"
                  >
                    View Details
                  </button>

                  <a
                    href={outlet.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in Google Maps"
                    className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-[#07643D]" />
                  </a>

                  <a
                    href={`https://wa.me/92${outlet.whatsapp.replace(/^0/, '')}?text=Assalam-o-Alaikum%20Sawera%20Sweets%20${encodeURIComponent(outlet.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Outlet Details Modal */}
      {modalOutlet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-stone-200 shadow-xl relative">
            <button
              onClick={() => setModalOutlet(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#07643D]/10 px-2.5 py-1 rounded-full">
                {modalOutlet.city} Center
              </span>
              <h2 className="text-xl font-bold font-serif text-[#07643D] mt-2">
                {modalOutlet.name}
              </h2>
              <p className="text-sm font-semibold text-amber-800 urdu-text mt-0.5">
                {modalOutlet.nameUrdu}
              </p>
            </div>

            <div className="space-y-3 text-xs text-stone-700 bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-stone-900">Address:</span>
                  <span>{modalOutlet.address}</span>
                  <span className="block urdu-text text-stone-500 mt-0.5">{modalOutlet.addressUrdu}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-stone-900">Timings:</span>
                  <span>{modalOutlet.timings}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-stone-900">Phone:</span>
                  <a href={`tel:${modalOutlet.phone}`} className="font-mono font-bold text-[#07643D] hover:underline">
                    {modalOutlet.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={modalOutlet.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Google Maps</span>
              </a>

              <a
                href={`https://wa.me/92${modalOutlet.whatsapp.replace(/^0/, '')}?text=Assalam-o-Alaikum%20Sawera%20Sweets`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}