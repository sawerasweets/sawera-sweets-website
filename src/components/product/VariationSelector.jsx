import React, { useState } from 'react';
import { Check, Scale, Package, Calculator, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function VariationSelector({
  product,
  selectedVariation,
  onSelectVariation,
  quantity,
  onChangeQuantity
}) {
  const { isUrdu } = useLanguage();
  const variations = (product?.variations || []).filter(v => v.isActive !== false);
  const allowsDecimal = Boolean(product?.allowsDecimalQuantity || product?.unit?.toLowerCase().includes('kg'));
  const isWeightBased = variations.some(v => 
    v.label?.toLowerCase().includes('kg') || 
    v.label?.toLowerCase().includes('gram') ||
    v.weight?.includes('kg') ||
    v.weight?.includes('g')
  );

  // Mode: 'variants' (fixed packs) vs 'custom' (rupees/decimal calculator)
  const [mode, setMode] = useState('variants');
  const [enteredRupees, setEnteredRupees] = useState('');

  const baseKgPrice = Number(product?.price) || 1000;

  // Handle rupee-to-weight calculation
  const handleRupeesInput = (e) => {
    const val = e.target.value;
    setEnteredRupees(val);
    const num = Number(val);
    if (num > 0 && baseKgPrice > 0) {
      // Calculate weight in kg to 3 decimal places
      const calculatedKg = Number((num / baseKgPrice).toFixed(3));
      onChangeQuantity(calculatedKg);
      onSelectVariation(null); // Unset fixed variant
    }
  };

  const handleSelectFixedVariant = (v) => {
    onSelectVariation(v);
    setMode('variants');
  };

  const handleSwitchToCustom = () => {
    setMode('custom');
    onSelectVariation(null);
    if (!enteredRupees && quantity > 0) {
      setEnteredRupees(Math.round(quantity * baseKgPrice));
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher Tabs (Only shown if product has both fixed variants AND allows custom decimal weight) */}
      {variations.length > 0 && allowsDecimal && (
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl border border-gray-200">
          <button
            type="button"
            onClick={() => {
              setMode('variants');
              if (variations.length > 0 && !selectedVariation) {
                onSelectVariation(variations[0]);
              }
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'variants'
                ? 'bg-white text-[#07643D] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'مقررہ سائز / پیکنگ' : 'Standard Weight Packs'}</span>
          </button>

          <button
            type="button"
            onClick={handleSwitchToCustom}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'custom'
                ? 'bg-white text-[#07643D] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'روپوں کے حساب سے لیں' : 'Custom Weight (By Rupees)'}</span>
          </button>
        </div>
      )}

      {/* Mode A: Fixed Variants List */}
      {mode === 'variants' && variations.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              {isWeightBased ? (
                <Scale className="w-3.5 h-3.5 text-[#07643D]" />
              ) : (
                <Package className="w-3.5 h-3.5 text-[#07643D]" />
              )}
              <span>{isUrdu ? (isWeightBased ? 'وزن یا پیکنگ منتخب کریں:' : 'سائز یا آپشن منتخب کریں:') : (isWeightBased ? 'Select Weight / Packaging:' : 'Select Size / Option:')}</span>
            </span>

            {selectedVariation?.stock !== undefined && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedVariation.stock > 0 
                  ? 'bg-emerald-50 text-[#07643D] border border-emerald-200' 
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {selectedVariation.stock > 0 
                  ? (isUrdu ? `اسٹاک: ${selectedVariation.stock} دستیاب` : `In Stock: ${selectedVariation.stock}`) 
                  : (isUrdu ? 'اسٹاک ختم ہے' : 'Out of Stock')}
              </span>
            )}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {variations.map((v, idx) => {
              const isSelected = selectedVariation?.id ? selectedVariation.id === v.id : selectedVariation?.label === v.label;
              const currentPrice = v.discountPrice || v.price;
              const isOutOfStock = v.stock !== undefined && v.stock <= 0;

              return (
                <button
                  key={v.id || idx}
                  type="button"
                  onClick={() => handleSelectFixedVariant(v)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#07643D] bg-emerald-50/80 ring-2 ring-[#07643D]/30 shadow-xs'
                      : isOutOfStock
                        ? 'border-gray-200 bg-gray-50/60 opacity-60 hover:border-gray-300'
                        : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#07643D] bg-[#07643D]' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        {isUrdu ? (v.urduLabel || v.label) : v.label}
                      </span>
                      {isOutOfStock && (
                        <span className="text-[10px] text-red-600 font-semibold block">
                          {isUrdu ? 'اسٹاک ختم ہے' : 'Out of Stock'}
                        </span>
                      )}
                    </div>
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

      {/* Mode B: Special Custom Weight / Price Calculator */}
      {mode === 'custom' && allowsDecimal && (
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#07643D]" />
            <h4 className="text-xs font-bold text-[#07643D] uppercase tracking-wider">
              {isUrdu ? 'روپوں کے حساب سے وزن کا حساب لگائیں' : 'Calculate Custom Weight by Rupees'}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                {isUrdu ? 'کتنے روپے کی مٹھائی چاہیے؟' : 'Enter Desired Amount (Rupees):'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-mono">Rs.</span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={enteredRupees}
                  onChange={handleRupeesInput}
                  placeholder="e.g. 500"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-mono font-bold text-gray-900 outline-none focus:border-[#07643D]"
                />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  {isUrdu ? 'کل وزن بنے گا:' : 'Resulting Weight:'}
                </span>
                <span className="text-base font-extrabold text-[#07643D] font-mono">
                  {quantity > 0 ? `${quantity.toFixed(3)} Kg` : '0.000 Kg'}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                {quantity > 0 ? `(~${Math.round(quantity * 1000)}g)` : ''}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-gray-400 font-semibold">Quick Amounts:</span>
            {[250, 500, 750, 1000, 1500, 2000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setEnteredRupees(amt);
                  const kg = Number((amt / baseKgPrice).toFixed(3));
                  onChangeQuantity(kg);
                  onSelectVariation(null);
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-gray-200 hover:border-[#07643D] text-[11px] font-mono font-semibold text-gray-700 cursor-pointer"
              >
                Rs. {amt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Increment/Decrement Adjuster */}
      {mode === 'variants' && (
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            {isUrdu ? 'تعداد / ڈبے (Quantity):' : 'Packs / Quantity:'}
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                type="button"
                onClick={() => onChangeQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-14 text-center text-xs font-mono font-bold text-gray-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onChangeQuantity(quantity + 1)}
                className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors cursor-pointer"
              >
                +
              </button>
            </div>

            <span className="text-xs text-gray-500 font-medium">
              {selectedVariation 
                ? (isUrdu ? (selectedVariation.urduLabel || selectedVariation.label) : selectedVariation.label) 
                : product?.unit || 'Unit'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
