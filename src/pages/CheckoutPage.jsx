import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  Store, 
  Phone, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  Upload,
  User
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import db from '../services/db';
import { PAKISTAN_CITIES, TOP_CITIES } from '../data/pakistanCities';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { isUrdu } = useLanguage();
  const { sendNotification } = useNotifications();
  const navigate = useNavigate();

  const settings = db.getSettings();
  const branches = db.getBranches().filter(b => !b.isArchived && b.isOpen);

  // Form State - Online Delivery (Shop pickup disabled for now)
  const fulfillmentType = 'delivery';

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.addresses?.find(a => a.isDefault)?.address || '');
  const [city, setCity] = useState(user?.addresses?.find(a => a.isDefault)?.city || 'Jhang');
  const [specialNotes, setSpecialNotes] = useState('');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'easypaisa' | 'bank'
  const [paymentProofUrl, setPaymentProofUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Delivery fee calculation controlled by Admin Settings
  // Admin sets standard delivery charges and free delivery threshold in Admin Panel.
  const isFreeDelivery = Boolean(settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold);
  const configuredDeliveryFee = Number(settings.defaultDeliveryFee ?? settings.deliveryFee ?? 100);
  const deliveryFee = isFreeDelivery ? 0 : configuredDeliveryFee;
  const totalPayable = subtotal + deliveryFee;

  const handleProofUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Payment receipt image must be under 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setPaymentProofUrl(compressedDataUrl);
        };
        img.onerror = () => {
          setPaymentProofUrl(event.target.result);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Your shopping cart is currently empty.');
      return;
    }

    if (!fullName.trim() || !phone.trim()) {
      setError('Please provide your full name and contact phone number.');
      return;
    }

    if (fulfillmentType === 'delivery' && !address.trim()) {
      setError('Please provide a complete street address for home delivery.');
      return;
    }

    if ((paymentMethod === 'easypaisa' || paymentMethod === 'bank') && !paymentProofUrl) {
      if (!window.confirm('You have selected mobile/bank transfer without attaching a receipt screenshot. Proceed anyway and send receipt via WhatsApp?')) {
        return;
      }
    }

    setIsSubmitting(true);

    const deliveryArea = city.trim().toLowerCase() === 'jhang' ? 'jhang' : 'outside';

    const orderPayload = {
      customer: {
        name: fullName.trim(),
        email: user?.email || 'guest@sawerasweets.pk',
        phone: phone.trim(),
        city: city.trim(),
        address: `${address.trim()}, ${city.trim()}`
      },
      city: city.trim(),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        urduName: item.urduName,
        selectedVariation: item.unit,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        image: item.image,
        isCustomBox: item.isCustomBox || false,
        boxDetails: item.boxDetails || null
      })),
      fulfillmentType,
      deliveryArea,
      paymentMethod,
      paymentProofUrl,
      subtotal,
      deliveryFee,
      discount: 0,
      total: totalPayable,
      specialNotes: specialNotes.trim() || null
    };

    try {
      const createdOrder = await db.createOrder(orderPayload);

      // Build WhatsApp message for Store Owner (0322 7434080)
      const customerCity = createdOrder.city || createdOrder.customer?.city || 'Jhang';
      const itemsList = (createdOrder.items || [])
        .map(i => `• ${i.name} (${i.selectedVariation || i.unit || '1 unit'}) x ${i.quantity} = Rs. ${((i.price || 0) * (i.quantity || 1)).toLocaleString()}`)
        .join('\n');

      const waMsg = 
`Assalam o Alaikum Sawera Sweets & Bakers! 🍰

🛍️ *New Order Placed on Website:* #${createdOrder.id}

👤 *Customer:* ${createdOrder.customer?.name || ''}
📱 *Phone:* ${createdOrder.customer?.phone || ''}
📍 *City:* ${customerCity}
🏠 *Address:* ${createdOrder.customer?.address || ''}

📦 *Items Ordered:*
${itemsList}

🚚 *Delivery:* Rs. ${createdOrder.deliveryFee || 0}
💰 *Total Payable:* Rs. ${createdOrder.total?.toLocaleString()} (${createdOrder.paymentMethod?.toUpperCase() || 'COD'})

Baraye meharbani mera order confirm karein aur delivery time bata dein. Shukriya!`;

      const waUrl = `https://wa.me/923227434080?text=${encodeURIComponent(waMsg)}`;

      // Immediate WhatsApp dispatch trigger on customer submit
      try {
        window.open(waUrl, '_blank');
      } catch (e) {
        // Handled on confirmation page
      }

      // Notify local store session
      sendNotification({
        targetRole: 'admin',
        title: 'New Order Received',
        titleUrdu: 'نیا آرڈر موصول ہوا',
        message: `Order #${createdOrder.id} for Rs. ${createdOrder.total} placed by ${createdOrder.customer?.name || 'Customer'}.`,
        type: 'info'
      });

      // Call server notify API if online
      try {
        fetch('/api/notify-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: createdOrder })
        }).catch(() => {});
      } catch (e) {}

      clearCart();
      setIsSubmitting(false);
      navigate('/order-confirmation', { state: { order: createdOrder, waUrl, autoOpen: true } });
    } catch (err) {
      console.error('Failed to create order', err);
      setError('An unexpected error occurred while placing order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-[#FDFBF7]">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center max-w-md w-full shadow-sm space-y-3">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500">Add fresh sweets or bakery items before heading to checkout.</p>
          <Link to="/products" className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-[#07643D] text-white text-xs font-bold hover:bg-[#043E26]">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Secure Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#07643D] mt-2">
            Complete Your Order
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Single-branch fulfillment: your entire order will be prepared fresh and dispatched from one shop.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Details & Payment */}
          <div className="lg:col-span-2 space-y-6 text-xs">
            
            {/* All Pakistan Doorstep Delivery Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-[#07643D] to-teal-950 text-white p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-emerald-800/80">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-200 shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <span>{isUrdu ? 'پورے پاکستان میں ہوم ڈلیوری' : 'All Pakistan Doorstep Delivery'}</span>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 bg-[#D4AF37] text-gray-950 rounded-full font-mono">
                      A to Z Cities
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-100/90 mt-0.5">
                    {isUrdu 
                      ? 'جھنگ سمیت پاکستان کے ہر شہر، قصبے اور علاقے میں معیاری اور تازہ مٹھائی کی ترسیل' 
                      : 'Express safe doorstep delivery across Jhang and all cities across Pakistan'}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right sm:border-l sm:border-white/20 sm:pl-4 shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 block">
                  {isUrdu ? 'ڈلیوری چارجز' : 'Delivery Charges'}
                </span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {deliveryFee === 0 ? (isUrdu ? 'مفت ڈلیوری (FREE)' : 'FREE DELIVERY') : `Rs. ${deliveryFee}`}
                </span>
              </div>
            </div>

            {/* 1. Customer Contact & Delivery Info */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#07643D]" />
                  <span>{isUrdu ? '۱. کسٹمر اور ڈلیوری کی معلومات' : '1. Customer & Delivery Information'}</span>
                </h2>
                {!user && (
                  <Link to="/login" className="text-xs font-bold text-[#07643D] hover:underline">
                    {isUrdu ? 'اکاؤنٹ ہے؟ لاگ ان کریں' : 'Have an account? Sign in'}
                  </Link>
                )}
              </div>

              {/* Saved addresses shortcut for logged-in user */}
              {user?.addresses?.length > 0 && fulfillmentType === 'delivery' && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                  <span className="font-bold text-[#07643D] block text-[11px]">Choose from Saved Addresses:</span>
                  <div className="flex flex-wrap gap-2">
                    {user.addresses.map(addr => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => {
                          setAddress(addr.address);
                          setPhone(addr.phone || phone);
                          setCity(addr.city || 'Jhang');
                        }}
                        className="px-3 py-1 rounded-xl bg-white border border-emerald-200 text-gray-800 font-semibold hover:bg-emerald-100 text-[11px]"
                      >
                        {addr.label}: {addr.address.slice(0, 25)}...
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {isUrdu ? 'مکمل نام *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isUrdu ? 'اپنا نام درج کریں' : 'e.g. Muhammad Usman'}
                    className="w-full p-2.5 border rounded-xl outline-none focus:border-[#07643D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {isUrdu ? 'فون نمبر (کال / واٹس ایپ) *' : 'Phone Number (Call/WhatsApp) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX XXXXXXX"
                    className="w-full p-2.5 border rounded-xl outline-none focus:border-[#07643D] font-mono"
                  />
                </div>
              </div>

              {/* City Selection with A to Z Pakistan Coverage */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-gray-700 text-xs">
                    {isUrdu ? 'شہر منتخب کریں (تمام پاکستان A to Z) *' : 'Select City (All Pakistan A to Z) *'}
                  </label>
                  <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {PAKISTAN_CITIES.length}+ Cities Covered
                  </span>
                </div>

                {/* Popular Quick City Chips */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {TOP_CITIES.slice(0, 10).map((tc) => (
                    <button
                      key={tc}
                      type="button"
                      onClick={() => setCity(tc)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                        city.toLowerCase() === tc.toLowerCase()
                          ? 'bg-[#07643D] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-[#07643D]'
                      }`}
                    >
                      {tc} {tc === 'Jhang' ? '(مرکزی اسٹور)' : ''}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Search / Type Input with Datalist Autocomplete */}
                  <div>
                    <input
                      type="text"
                      list="pakistan-cities-list"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={isUrdu ? 'شہر کا نام ٹائپ کریں (مثلاً: Jhang, Lahore, Karachi)' : 'Type city name or search...'}
                      className="w-full p-2.5 border rounded-xl outline-none focus:border-[#07643D] bg-white text-xs"
                    />
                    <datalist id="pakistan-cities-list">
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.urduName} - {c.province})
                        </option>
                      ))}
                    </datalist>
                  </div>

                  {/* Dropdown Selector grouped A to Z */}
                  <div>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 border rounded-xl outline-none focus:border-[#07643D] bg-white text-xs cursor-pointer"
                    >
                      <option value="">-- {isUrdu ? 'فہرست سے شہر منتخب کریں' : 'Or select from A-Z list'} --</option>
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} - {c.urduName} ({c.province})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-xs">
                  {isUrdu ? 'گھر کا پتہ، محلہ / گلی / مکان نمبر *' : 'Street Address, House #, Colony / Mohallah *'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isUrdu ? 'مثلاً: مکان نمبر 12، گلی نمبر 4، بالمقابل ڈی ایچ کیو ہسپتال، گوجرہ روڈ...' : 'e.g. House #14, Street 5, Near DHQ Hospital, Gojra Road...'}
                  className="w-full p-2.5 border rounded-xl outline-none focus:border-[#07643D] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-xs">
                  {isUrdu ? 'آرڈر کی خاص ہدایات (اختیاری)' : 'Special Order Instructions (Optional)'}
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder={isUrdu ? 'مثلاً: گفٹ پیکنگ، کم شیرہ، پہنچ کر کال کریں...' : 'e.g. Gift packing with ribbon, less sugar syrup, call upon arrival...'}
                  className="w-full p-2.5 border rounded-xl outline-none text-xs"
                />
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#07643D]" />
                <span>{isUrdu ? '۲. ادائیگی کا طریقہ' : '2. Payment Method'}</span>
              </h2>

              <div className="space-y-3">
                {/* COD */}
                <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-[#07643D] bg-emerald-50/70 ring-1 ring-[#07643D]' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#07643D]"
                    />
                    <div>
                      <span className="font-bold text-gray-900 text-xs block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-gray-500">Pay cash upon package arrival at your doorstep</span>
                    </div>
                  </div>
                </label>

                {/* Easypaisa */}
                <label className={`p-4 rounded-2xl border block cursor-pointer transition-all ${
                  paymentMethod === 'easypaisa' ? 'border-[#07643D] bg-emerald-50/70 ring-1 ring-[#07643D]' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'easypaisa'}
                      onChange={() => setPaymentMethod('easypaisa')}
                      className="text-[#07643D]"
                    />
                    <div>
                      <span className="font-bold text-gray-900 text-xs block">Easypaisa Mobile Account</span>
                      <span className="text-[11px] text-gray-500">Instant transfer &amp; receipt verification</span>
                    </div>
                  </div>

                  {paymentMethod === 'easypaisa' && (
                    <div className="mt-3 pt-3 border-t border-emerald-200 space-y-2">
                      <div className="bg-white p-3 rounded-xl border font-mono">
                        <p className="text-[11px] text-gray-600">
                          Number: <span className="font-bold text-[#07643D] text-sm">{settings.payments?.easypaisa?.number || '0322 7434080'}</span>
                        </p>
                        <p className="text-[11px] text-gray-600">
                          Title: <span className="font-bold text-gray-900">{settings.payments?.easypaisa?.accountTitle || 'Muhammad Akash'}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-white text-gray-700 font-semibold shadow-xs">
                          <Upload className="w-3.5 h-3.5 text-gray-500" />
                          <span>Upload Payment Screenshot</span>
                          <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" />
                        </label>
                        {paymentProofUrl && <span className="text-emerald-700 font-bold">Screenshot attached ✓</span>}
                      </div>
                    </div>
                  )}
                </label>

                {/* MCB Bank */}
                <label className={`p-4 rounded-2xl border block cursor-pointer transition-all ${
                  paymentMethod === 'bank' ? 'border-[#07643D] bg-emerald-50/70 ring-1 ring-[#07643D]' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="text-[#07643D]"
                    />
                    <div>
                      <span className="font-bold text-gray-900 text-xs block">Direct Bank Transfer (MCB)</span>
                      <span className="text-[11px] text-gray-500">Transfer to official Sawera Sweets MCB Bank account</span>
                    </div>
                  </div>

                  {paymentMethod === 'bank' && (
                    <div className="mt-3 pt-3 border-t border-emerald-200 space-y-2">
                      <div className="bg-white p-3 rounded-xl border font-mono text-[11px]">
                        <p>Bank: <span className="font-bold text-gray-900">{settings.payments?.bank?.bankName || 'MCB Bank Limited'}</span></p>
                        <p>Account Title: <span className="font-bold text-gray-900">{settings.payments?.bank?.accountTitle || 'Sawera Sweets and Bakers'}</span></p>
                        {settings.payments?.bank?.accountNumber && (
                          <p>Account Number: <span className="font-bold text-[#07643D]">{settings.payments?.bank?.accountNumber}</span></p>
                        )}
                        {settings.payments?.bank?.iban && (
                          <p>IBAN: <span className="font-bold text-[#07643D]">{settings.payments?.bank?.iban}</span></p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-white text-gray-700 font-semibold shadow-xs">
                          <Upload className="w-3.5 h-3.5 text-gray-500" />
                          <span>Upload Transfer Receipt</span>
                          <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" />
                        </label>
                        {paymentProofUrl && <span className="text-emerald-700 font-bold">Receipt attached ✓</span>}
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6 text-xs">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 sticky top-24">
              <h2 className="text-sm font-bold text-gray-900 pb-2 border-b">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-center py-1">
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {item.unit} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-gray-900">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges:</span>
                  <span className="font-mono font-semibold">
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#07643D] pt-2 border-t">
                  <span>Total Amount:</span>
                  <span className="font-mono">Rs. {totalPayable.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#07643D] hover:bg-[#043E26] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <div className="p-3 bg-[#FDFBF7] rounded-xl border border-amber-100 text-[10px] text-gray-500 space-y-1">
                <p className="font-bold text-gray-700">Official Return Policy:</p>
                <p>No returns allowed. Exchange is allowed only if damaged or defective on delivery.</p>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
