import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#043E26] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#D4AF37]/50 max-w-sm">
        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
        <p className="text-xs font-semibold">{toastMessage}</p>
      </div>
    </div>
  );
}
