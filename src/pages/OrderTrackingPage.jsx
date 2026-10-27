import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, Phone, AlertCircle, FileText, MessageCircle, MapPin } from 'lucide-react';
import db from '../services/db';
import { useLanguage } from '../context/LanguageContext';
import InvoiceModal from '../components/customer/InvoiceModal';

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('orderId') || searchParams.get('id') || '';
  const { isUrdu } = useLanguage();

  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [contactInput, setContactInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const performLookup = (idVal, contactVal) => {
    setHasSearched(true);
    const idClean = idVal.trim().toUpperCase();
    const contactClean = contactVal.trim().toLowerCase();

    if (!idClean && !contactClean) {
      setSearchedOrder(null);
      return;
    }

    const orders = db.getOrders();
    const match = orders.find(o => {
      const matchId = idClean ? o.id?.toUpperCase() === idClean : false;
      const phoneClean = (o.customer?.phone || '').replace(/\D/g, '');
      const queryPhoneClean = contactClean.replace(/\D/g, '');
      const matchPhone = queryPhoneClean && phoneClean.includes(queryPhoneClean);
      const matchEmail = contactClean && o.customer?.email?.toLowerCase() === contactClean;

      if (idClean && contactClean) {
        return (matchId || o.id?.toUpperCase().includes(idClean)) && (matchPhone || matchEmail);
      }
      return matchId || matchPhone || matchEmail;
    });

    setSearchedOrder(match || null);
  };

  useEffect(() => {
    if (initialId) {
      performLookup(initialId, '');
    }
  }, [initialId]);

  const handleSearch = (e) => {
    e.preventDefault();
    performLookup(orderIdInput, contactInput);
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'placed': return 1;
      case 'confirmed': return 2;
      case 'preparing': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  const step = searchedOrder ? getStepIndex(searchedOrder.status) : 1;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Badge & Title (Suleman Sweets benchmark) */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#07643D]/10 text-[#07643D] border border-[#07643D]/20 shadow-sm mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#07643D] tracking-tight">
            {isUrdu ? 'اپنا آرڈر ٹریک کریں' : 'Track Your Order'}
          </h1>
          <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            {isUrdu
              ? 'اپنے آرڈر کی لائیو پوزیشن چیک کرنے کے لیے نیچے آرڈر آئی ڈی یا فون نمبر درج کریں۔'
              : 'To track your order, please enter your Order ID or phone number below and click "Track Order". This was provided on your receipt or SMS.'}
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                {isUrdu ? 'آرڈر آئی ڈی' : 'Order ID'} <span className="text-stone-400 font-normal">(e.g. SAV-108291)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="e.g. SAV-108291"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:border-[#07643D] focus:ring-2 focus:ring-[#07643D]/10 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                {isUrdu ? 'فون نمبر یا ای میل' : 'Billing Phone or Email'} <span className="text-stone-400 font-normal">(e.g. 0322 7434080)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  placeholder="0322 7434080 or customer@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:border-[#07643D] focus:ring-2 focus:ring-[#07643D]/10 outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              <Search className="w-4 h-4" />
              <span>{isUrdu ? 'آرڈر تلاش کریں' : 'Track Order'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-500">
            <span>{isUrdu ? 'مدد درکار ہے؟' : 'Need help with your order?'}</span>
            <a
              href="https://wa.me/923227434080?text=Assalam-o-Alaikum%20Sawera%20Sweets,%20I%20need%20help%20tracking%20my%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#07643D] hover:text-[#043E26] font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp (0322 7434080)</span>
            </a>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && searchedOrder && (
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Order Reference</span>
                <h3 className="text-xl font-bold font-mono text-[#07643D]">{searchedOrder.id}</h3>
                <span className="text-xs text-stone-500">
                  Placed on {searchedOrder.createdAt ? new Date(searchedOrder.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' }) : 'Recently'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full font-bold text-xs uppercase ${
                  searchedOrder.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                  searchedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {searchedOrder.status?.replace(/_/g, ' ')}
                </span>
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>

            {/* Tracking Progress Stepper */}
            {searchedOrder.status !== 'cancelled' ? (
              <div className="py-2">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="space-y-1.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-colors ${
                      step >= 1 ? 'bg-[#07643D] text-white shadow-sm' : 'bg-stone-100 text-stone-400'
                    }`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className={`font-bold text-[11px] ${step >= 1 ? 'text-[#07643D]' : 'text-stone-400'}`}>
                      Order Placed
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-colors ${
                      step >= 2 ? 'bg-[#07643D] text-white shadow-sm' : 'bg-stone-100 text-stone-400'
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className={`font-bold text-[11px] ${step >= 2 ? 'text-[#07643D]' : 'text-stone-400'}`}>
                      In Kitchen
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-colors ${
                      step >= 3 ? 'bg-[#07643D] text-white shadow-sm' : 'bg-stone-100 text-stone-400'
                    }`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <p className={`font-bold text-[11px] ${step >= 3 ? 'text-[#07643D]' : 'text-stone-400'}`}>
                      On The Way
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-colors ${
                      step >= 4 ? 'bg-[#07643D] text-white shadow-sm' : 'bg-stone-100 text-stone-400'
                    }`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <p className={`font-bold text-[11px] ${step >= 4 ? 'text-[#07643D]' : 'text-stone-400'}`}>
                      Delivered
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>This order was cancelled prior to preparation.</span>
              </div>
            )}

            {/* Details Table */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Recipient:</span>
                <span className="font-semibold text-stone-900">{searchedOrder.customer?.name} ({searchedOrder.customer?.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Fulfilling Store:</span>
                <span className="font-semibold text-emerald-800">{searchedOrder.assignedBranchName || 'Sawera Sweets & Bakers (Main Store)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Destination:</span>
                <span className="font-semibold text-stone-900 text-right max-w-xs">{searchedOrder.customer?.address}, {searchedOrder.customer?.city || 'Jhang'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment:</span>
                <span className="font-bold uppercase text-[#07643D]">
                  {searchedOrder.paymentMethod} • {searchedOrder.paymentStatus || 'Pending'}
                </span>
              </div>
              {searchedOrder.riderName && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Assigned Rider:</span>
                  <span className="font-bold text-stone-800">{searchedOrder.riderName}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-sm">
                <span className="text-stone-900">Total Payable:</span>
                <span className="font-mono text-[#07643D]">Rs. {searchedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Itemized List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Order Items</h4>
              <div className="divide-y divide-stone-100 rounded-xl border border-stone-200 overflow-hidden bg-white">
                {searchedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-3">
                    <span className="font-medium text-stone-800">
                      {item.quantity}× {item.name} <span className="text-stone-400 font-normal">({item.selectedVariation || item.unit || 'Standard'})</span>
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Action for this specific order */}
            <div className="pt-2">
              <a
                href={`https://wa.me/923227434080?text=${encodeURIComponent(`Assalam-o-Alaikum Sawera Sweets, I am inquiring about Order ID: ${searchedOrder.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#07643D] text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Need updates for this order? Chat on WhatsApp</span>
              </a>
            </div>

          </div>
        )}

        {hasSearched && !searchedOrder && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-stone-900">No Order Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't locate an order with the provided details. Please verify your Order ID or phone number.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/923227434080?text=Assalam-o-Alaikum%20Sawera%20Sweets,%20I%20cannot%20find%20my%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07643D] text-white text-xs font-bold hover:bg-[#043E26] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Sawera Helpline on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={searchedOrder}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
}