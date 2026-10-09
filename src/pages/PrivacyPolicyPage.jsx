import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { STORE_CONFIG } from '../data/storeConfig';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        
        <div className="border-b border-gray-200 pb-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">Legal &amp; Privacy</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#07643D] mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 mt-1">Sawera Sweets &amp; Bakers • Effective 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">1. Customer Information We Collect</h2>
          <p>
            When you place an order on <strong>Sawera Sweets &amp; Bakers</strong> website, we collect your full name, mobile contact number, WhatsApp number, and delivery street address to accurately process and deliver your order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">2. How Your Data Is Protected</h2>
          <p>
            Your delivery address and phone number are exclusively utilized by our local store dispatch team and riders to coordinate order verification and prompt doorstep delivery. We do not sell or share customer data with any third-party marketing companies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">3. Contacting Us About Privacy</h2>
          <p>
            If you have questions regarding your order records or wish to update your details, please reach out directly to our shop via WhatsApp at <span className="font-mono font-bold text-[#07643D]">{STORE_CONFIG.contact.whatsapp}</span>.
          </p>
        </section>

      </div>
    </div>
  );
}
