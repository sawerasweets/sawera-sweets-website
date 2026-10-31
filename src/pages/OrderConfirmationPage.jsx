import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, MessageCircle, FileText, ArrowRight, Package, MapPin, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import InvoiceModal from '../components/customer/InvoiceModal';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isUrdu } = useLanguage();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [waOpened, setWaOpened] = useState(false);

  const order = location.state?.order;

  // Auto-trigger WhatsApp dispatch if not already opened
  React.useEffect(() => {
    if (order && !waOpened) {
      const timer = setTimeout(() => {
        try {
          window.open(waUrl, '_blank');
          setWaOpened(true);
        } catch (e) {}
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [order?.id, waOpened]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border text-center space-y-4">
        <Package className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="text-base font-bold text-gray-900">No recent order found</h2>
        <Link to="/" className="inline-block px-5 py-2 bg-[#07643D] text-white rounded-xl text-xs font-bold">
          Return to Home
        </Link>
      </div>
    );
  }

  // Pre-fill WhatsApp message with complete item breakdown
  const customerCity = order.city || order.customer?.city || '';
  const itemsText = (order.items || [])
    .map(i => `• ${i.name} (${i.selectedVariation || i.unit || '1 unit'}) x ${i.quantity} = Rs. ${((i.price || 0) * (i.quantity || 1)).toLocaleString()}`)
    .join('\n');

  const waMessage = 
`Assalam o Alaikum Sawera Sweets & Bakers! 🍰

🛍️ *Order Placed on Website:* #${order.id}

👤 *Customer:* ${order.customer?.name || ''}
📱 *Phone:* ${order.customer?.phone || ''}
📍 *City:* ${customerCity || 'Jhang'}
🏠 *Address:* ${order.customer?.address || ''}

📦 *Items Ordered:*
${itemsText}

🚚 *Delivery Charges:* Rs. ${order.deliveryFee || 0}
💰 *Total Amount:* Rs. ${order.total?.toLocaleString()} (${order.paymentMethod?.toUpperCase() || 'COD'})

Baraye meharbani mera order confirm karein aur delivery time bata dein. Shukriya!`;

  const waUrl = `https://wa.me/923227434080?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xl text-center space-y-6 animate-in zoom-in-95">
        
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#07643D] border-4 border-emerald-100 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isUrdu ? 'آرڈر کامیابی سے محفوظ ہوا' : 'Order Placed Successfully'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#07643D] mt-3">
            Thank You for Your Order!
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Your authentic sweets &amp; bakery items have been recorded in our store database.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-amber-100 text-left text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
            <span className="font-bold text-gray-600">Order Number:</span>
            <span className="font-mono font-bold text-sm text-[#07643D]">{order.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Customer:</span>
            <span className="font-bold text-gray-900">{order.customer?.name} ({order.customer?.phone})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Delivery Address:</span>
            <span className="font-semibold text-gray-900 text-right max-w-xs">{order.customer?.address || order.city}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Fulfillment:</span>
            <span className="font-semibold text-gray-900 capitalize">
              {order.fulfillmentType === 'delivery' ? 'Home Delivery' : 'Shop Pickup'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Payment:</span>
            <span className="font-semibold uppercase text-gray-900">
              {order.paymentMethod} ({order.paymentStatus})
            </span>
          </div>

          {/* Items Breakdown */}
          {order.items && order.items.length > 0 && (
            <div className="pt-2 border-t border-amber-200/60 space-y-1.5">
              <span className="font-bold text-gray-700 block text-[11px]">Items in this Order:</span>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] text-gray-600">
                  <span>{item.name} ({item.selectedVariation || item.unit || '1 unit'}) x {item.quantity}</span>
                  <span className="font-mono font-semibold text-gray-900">Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 font-bold text-sm">
            <span>Total Amount:</span>
            <span className="font-mono text-[#07643D]">Rs. {order.total?.toLocaleString()}</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* WhatsApp Direct Connect */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Confirm Order on WhatsApp (0322 7434080)</span>
            </a>
            <p className="text-[11px] text-emerald-800 font-medium">
              {isUrdu 
                ? 'فوری آرڈر تصدیق اور تیز ترین ڈیلیوری کے لیے سبز بٹن دبا کر دکان کے واٹس ایپ پر تفصیلات ارسال فرمائیں۔'
                : 'Tap the green button above to send this order receipt to Sawera Sweets WhatsApp helpline for priority packing.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="py-2.5 rounded-2xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-gray-500" />
              <span>Official Invoice</span>
            </button>

            <Link
              to={`/track-order?orderId=${order.id}`}
              className="py-2.5 rounded-2xl bg-[#07643D] hover:bg-[#043E26] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Live Track Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-gray-400">
          Need immediate assistance? Call our Jhang Helpline directly: <a href="tel:03227434080" className="font-mono font-bold text-gray-700 hover:underline">0322 7434080</a>
        </p>

      </div>

      {/* Printable Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
}
