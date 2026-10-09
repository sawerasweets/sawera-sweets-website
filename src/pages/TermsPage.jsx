import React from 'react';
import { ShieldCheck, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TermsPage() {
  const { isUrdu } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        
        <div className="border-b border-gray-200 pb-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            {isUrdu ? 'پالیسی و شرائط' : 'Official Store Policy'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#07643D] mt-1">
            Terms, Returns &amp; Exchange Policy
          </h1>
          <p className="text-xs text-gray-500 mt-1">Sawera Sweets &amp; Bakers (سویرا سویٹس اینڈ بیکرز - ہر خوشی کیساتھ)</p>
        </div>

        {/* Highlights Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Important Food Safety &amp; Return Policy Summary</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs text-amber-900">
            <li><strong>No Returns:</strong> In accordance with food hygiene and confectionery safety standards, returns are not accepted.</li>
            <li><strong>Exchanges Allowed:</strong> Product exchange is permitted exclusively if an item is found to be defective or physically damaged upon delivery.</li>
            <li><strong>Order Cancellation:</strong> Customers may cancel an order before kitchen preparation or bakery packaging commences.</li>
          </ul>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">1. Fresh Food &amp; Mithai Standards</h2>
          <p>
            All traditional sweets (mithai) and fresh bakery products are prepared with pure desi ghee and fresh ingredients daily. Customers are encouraged to inspect goods upon receipt from our delivery rider or at branch counter pickup.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">2. Defective or Damaged Items (Exchange Procedure)</h2>
          <p>
            If any item arrives damaged or compromised during transit, please notify our customer helpline at <strong>0322 7434080</strong> or via WhatsApp at <strong>0347 1702710</strong> within 2 hours of receipt with a photo of the package. We will immediately arrange an exchange or fresh replacement batch from our nearest branch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">3. Direct Store Fulfillment</h2>
          <p>
            To maintain peak freshness and ensure premium food hygiene standards, customer orders are freshly packed and dispatched directly from our flagship store at Gojra Road, Opposite DHQ Hospital, Jhang.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">4. Payment &amp; Confirmation</h2>
          <p>
            We support Cash on Delivery (COD), verified Easypaisa mobile wallet payments (0348 1702710 - Muhammad Akash), and direct MCB Bank transfers. Proof of payment receipts are inspected confidentially.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">5. Contact Information</h2>
          <p>
            Shop 1 (Head Office): Gojra Road, Opposite DHQ Hospital, Jhang, Pakistan.<br />
            Phone: <span className="font-mono font-bold text-[#07643D]">0322 7434080</span> • WhatsApp: <span className="font-mono font-bold text-[#07643D]">0347 1702710</span>
          </p>
        </section>

      </div>
    </div>
  );
}
