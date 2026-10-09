import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Clock, ShieldCheck } from 'lucide-react';
import db from '../services/db';

export default function MaintenancePage() {
  const settings = db.getSettings();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
        
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] mx-auto shadow-md">
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
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Store Maintenance
          </span>
          <h1 className="text-2xl font-bold font-serif text-[#07643D] mt-2">
            Sawera Sweets &amp; Bakers
          </h1>
          <p className="text-xs text-amber-800 font-semibold urdu-text">سویرا سویٹس اینڈ بیکرز - ہر خوشی کیساتھ</p>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
          {settings.maintenanceMessage || 'We are currently performing routine upgrades to improve your shopping experience. We will be back online shortly!'}
        </p>

        <div className="pt-4 border-t text-xs text-gray-500 space-y-2">
          <p className="font-semibold text-gray-700">For phone orders during maintenance:</p>
          <p className="font-mono font-bold text-gray-900">Call: 0322 7434080 • WhatsApp: 0347 1702710</p>
          <p className="text-[11px] text-gray-400">Shop 1, Gojra Road, Opposite DHQ Hospital, Jhang</p>
        </div>

        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#07643D] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Staff &amp; Admin Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
