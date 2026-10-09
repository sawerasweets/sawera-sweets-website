import React from 'react';
import { Check, Scale } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function VariationSelector({
  product,
  selectedVariation,
  onSelectVariation,
  quantity,
  onChangeQuantity
}) {
  const { isUrdu } = useLanguage();
  const variations = product?.variations || [];
  const allowsDecimal = product?.allowsDecimalQuantity || product?.unit?.toLowerCase().includes('kg');

  return (
    <div className="space-y-4">
      {/* Variations List (if available) */}
      {variations.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[#07643D]" />
            <span>{isUrdu ? 'وزن اور پیکنگ کا انتخاب کریں' : 'Select Packaging / Weight:'}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {variations.map((v, idx) => {
              const isSelected = selectedVariation?.label === v.label;
              const currentPrice = v.discountPrice || v.price;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectVariation(v)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                    isSelected
                      ? 'border-[#07643D] bg-emerald-50/70 ring-1 ring-[#07643D]'
                      : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#07643D] bg-[#07643D]' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{v.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-[#07643D]">
                      Rs. {currentPrice?.toLocaleString()}
                    </span>
                    {v.discountPrice && (
                      <span className="block text-[10px] text-gray-400 line-through font-mono">
                        Rs. {v.price}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector with Decimal Support (e.g. 0.5 kg, 1 kg, 1.5 kg) */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          {isUrdu ? 'مقدار (Quantity)' : 'Quantity:'}
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              onClick={() => {
                const step = allowsDecimal && !selectedVariation ? 0.5 : 1;
                onChangeQuantity(Math.max(step, quantity - step));
              }}
              className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors"
            >
              -
            </button>
            <span className="w-14 text-center text-xs font-mono font-bold text-gray-800">
              {allowsDecimal && !selectedVariation ? quantity.toFixed(1) : quantity}
            </span>
            <button
              type="button"
              onClick={() => {
                const step = allowsDecimal && !selectedVariation ? 0.5 : 1;
                onChangeQuantity(quantity + step);
              }}
              className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors"
            >
              +
            </button>
          </div>

          <span className="text-xs text-gray-500 font-medium">
            {selectedVariation ? selectedVariation.label : product?.unit || 'Unit'}
          </span>
        </div>
      </div>
    </div>
  );
}
