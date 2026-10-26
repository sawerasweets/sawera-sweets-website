import React from 'react';
import { X, Printer, CheckCircle, Package } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function InvoiceModal({ order, isOpen, onClose }) {
  const { isUrdu } = useLanguage();
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
        
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="bg-gray-100 px-6 py-3 border-b flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Official Order Invoice</span>
            <span className="text-xs font-mono font-bold text-[#07643D]">{order.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'پرنٹ / پی ڈی ایف' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div id="printable-invoice" className="p-8 text-gray-800 bg-white">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm flex-shrink-0">
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
                <h1 className="text-xl font-bold font-serif text-[#07643D]">Sawera Sweets &amp; Bakers</h1>
                <p className="text-xs text-amber-700 font-semibold urdu-text">سویرا سویٹس اینڈ بیکرز - ہر خوشی کیساتھ</p>
                <p className="text-[11px] text-gray-500 mt-1">Gojra Road, Opposite DHQ Hospital, Jhang</p>
                <p className="text-[11px] text-gray-500">Call &amp; WhatsApp: 0322 7434080</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                {order.status?.toUpperCase() || 'CONFIRMED'}
              </span>
              <p className="text-xs font-mono font-bold text-gray-900 mt-2">Invoice #: {order.id}</p>
              <p className="text-[11px] text-gray-500">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Billing & Fulfillment Info */}
          <div className="grid grid-cols-2 gap-6 my-6 text-xs bg-[#FDFBF7] p-4 rounded-xl border border-amber-100">
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Customer Details</p>
              <p className="font-bold text-gray-900 text-sm">{order.customer?.name}</p>
              <p className="text-gray-600 font-mono mt-0.5">{order.customer?.phone}</p>
              <p className="text-gray-600 mt-0.5 leading-relaxed">{order.customer?.address}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">Fulfillment &amp; Payment</p>
              <p className="font-semibold text-gray-900">
                Type: <span className="text-[#07643D]">{order.fulfillmentType === 'delivery' ? 'Home Delivery' : 'Shop Pickup'}</span>
              </p>
              <p className="text-gray-600 mt-0.5">
                Store: <span className="font-medium">{order.assignedBranchName || 'Sawera Sweets & Bakers (Main Store)'}</span>
              </p>
              <p className="text-gray-600 mt-0.5">
                Payment: <span className="font-semibold uppercase">{order.paymentMethod}</span> ({order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border rounded-xl overflow-hidden mb-6">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#07643D] text-white">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Item &amp; Variation</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Unit / Size</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Qty</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Price</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {item.name}
                      {item.urduName && (
                        <span className="block text-[11px] text-gray-500 urdu-text">{item.urduName}</span>
                      )}
                      {item.isCustomBox && item.boxDetails?.items && (
                        <div className="mt-1 text-[10px] text-gray-600 bg-emerald-50/70 p-1.5 rounded border border-emerald-100">
                          <p className="font-semibold text-emerald-900">Assortment Manifest ({item.boxDetails.totalGrams}g):</p>
                          <p className="text-neutral-700">{item.boxDetails.items.map(sub => `${sub.name} (${sub.grams}g)`).join(' • ')}</p>
                          {item.boxDetails.ribbon && <p className="text-amber-800 font-semibold mt-0.5">🎀 Ribbon Seal: {item.boxDetails.ribbon}</p>}
                          {item.boxDetails.giftMessage && <p className="italic text-neutral-600 mt-0.5">Note: "{item.boxDetails.giftMessage}"</p>}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{item.selectedVariation || item.unit}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-mono">Rs. {item.price?.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between py-1 text-gray-600 border-b border-gray-100">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">Rs. {order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-600 border-b border-gray-100">
                <span>Delivery Charges:</span>
                <span className="font-mono font-semibold">
                  {order.deliveryFee > 0 ? `Rs. ${order.deliveryFee}` : 'FREE'}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between py-1 text-emerald-700 border-b border-gray-100">
                  <span>Discount:</span>
                  <span className="font-mono font-semibold">- Rs. {order.discount}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-base font-bold text-[#07643D] border-t-2 border-[#07643D]">
                <span>Total Amount:</span>
                <span className="font-mono">Rs. {order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Policy Notice */}
          <div className="mt-8 pt-4 border-t text-[11px] text-gray-500 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-700">Official Return Policy Notice:</p>
              <p className="leading-relaxed">
                As per food safety standards, items cannot be returned. Exchange is allowed only in case of damaged or defective items verified upon delivery.
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Thank you for choosing Sawera Sweets &amp; Bakers! (ہر خوشی کیساتھ)
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
