import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, Phone, AlertCircle, FileText, Building2 } from 'lucide-react';
import db from '../services/db';
import { useLanguage } from '../context/LanguageContext';
import InvoiceModal from '../components/customer/InvoiceModal';

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('orderId') || searchParams.get('id') || '';
  const { isUrdu } = useLanguage();

  const [searchQuery, setSearchQuery] = useState(initialId);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const performLookup = (query) => {
    setHasSearched(true);
    if (!query.trim()) {
      setSearchedOrder(null);
      return;
    }

    const orders = db.getOrders();
    const q = query.trim().toUpperCase();
    const match = orders.find(
      o => o.id?.toUpperCase() === q || o.customer?.phone?.includes(query.trim())
    );
    setSearchedOrder(match || null);
  };

  useEffect(() => {
    if (initialId) {
      performLookup(initialId);
    }
  }, [initialId]);

  const handleSearch = (e) => {
    e.preventDefault();
    performLookup(searchQuery);
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
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            {isUrdu ? 'لائیو اسٹیٹس' : 'Real-time Tracking'}
          </span>
          <h1 className="text-3xl font-extrabold font-serif text-[#07643D]">
            Track Your Order
          </h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Enter your Order ID (e.g. SAV-108291) or customer phone number to view live status.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. SAV-108291) or phone number..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-xs focus:border-[#07643D] outline-none font-mono"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Track Order</span>
            </button>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && searchedOrder && (
          <div className="bg-white rounded-3xl border border-[#D4AF37]/50 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Order Reference ID</span>
                <h3 className="text-lg font-bold font-mono text-[#07643D]">{searchedOrder.id}</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full font-bold text-xs uppercase ${
                  searchedOrder.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                  searchedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {searchedOrder.status.replace(/_/g, ' ')}
                </span>
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                >
                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>

            {/* Tracking Progress Steps */}
            {searchedOrder.status !== 'cancelled' ? (
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px]">
                <div className="space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    step >= 1 ? 'bg-[#07643D] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className={`font-bold ${step >= 1 ? 'text-[#07643D]' : 'text-gray-400'}`}>Placed</span>
                </div>

                <div className="space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    step >= 2 ? 'bg-[#07643D] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className={`font-semibold ${step >= 2 ? 'text-[#07643D]' : 'text-gray-400'}`}>Kitchen Preparation</span>
                </div>

                <div className="space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    step >= 3 ? 'bg-[#07643D] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className={`font-semibold ${step >= 3 ? 'text-[#07643D]' : 'text-gray-400'}`}>Out for Delivery</span>
                </div>

                <div className="space-y-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    step >= 4 ? 'bg-[#07643D] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <span className={`font-semibold ${step >= 4 ? 'text-[#07643D]' : 'text-gray-400'}`}>Delivered</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>This order was cancelled prior to preparation.</span>
              </div>
            )}

            {/* Details Table */}
            <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-amber-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span>
                <span className="font-semibold text-gray-900">{searchedOrder.customer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fulfilling Store:</span>
                <span className="font-semibold text-emerald-800">{searchedOrder.assignedBranchName || 'Sawera Sweets & Bakers (Main Store)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Address:</span>
                <span className="font-semibold text-gray-900 text-right max-w-xs">{searchedOrder.customer?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment:</span>
                <span className="font-bold uppercase text-[#07643D]">{searchedOrder.paymentMethod} ({searchedOrder.paymentStatus})</span>
              </div>
              {searchedOrder.riderName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Rider:</span>
                  <span className="font-bold text-gray-800">{searchedOrder.riderName}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-amber-200/60 pt-2 font-bold text-sm">
                <span className="text-gray-900">Total Amount:</span>
                <span className="font-mono text-[#07643D]">Rs. {searchedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Itemized List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700">Order Items:</h4>
              <div className="space-y-1">
                {searchedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1.5 px-3 bg-gray-50 rounded-lg">
                    <span>{item.quantity}× {item.name} ({item.selectedVariation || item.unit})</span>
                    <span className="font-mono font-bold text-gray-800">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {hasSearched && !searchedOrder && (
          <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">No Order Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We couldn't locate an order matching "{searchQuery}". Please verify the Order ID or phone number.
            </p>
            <p className="text-xs text-gray-500">
              Need assistance? Call Shop 1 directly: <a href="tel:03227434080" className="font-mono font-bold text-[#07643D] hover:underline">0322 7434080</a>
            </p>
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
