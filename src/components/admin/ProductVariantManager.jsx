import React from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Star, 
  Package, 
  Scale, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function ProductVariantManager({ 
  variations = [], 
  onChange, 
  basePrice = 0, 
  baseDiscountPrice = null,
  category = 'sweets' 
}) {
  const currentList = Array.isArray(variations) ? variations : [];
  const hasVariants = currentList.length > 0;

  const numBase = Number(basePrice) || 0;
  const numBaseDisc = (baseDiscountPrice !== '' && baseDiscountPrice !== null && !isNaN(Number(baseDiscountPrice)))
    ? Number(baseDiscountPrice) 
    : null;

  // Update specific field on variant
  const updateVariant = (index, field, value) => {
    const updated = currentList.map((v, i) => {
      if (i === index) {
        return { ...v, [field]: value };
      }
      return v;
    });
    onChange(updated);
  };

  // Toggle variant active
  const toggleVariantActive = (index) => {
    const updated = currentList.map((v, i) => {
      if (i === index) {
        return { ...v, isActive: v.isActive === false };
      }
      return v;
    });
    onChange(updated);
  };

  // Set default selected variant
  const setDefaultVariant = (index) => {
    const updated = currentList.map((v, i) => ({
      ...v,
      isDefault: i === index
    }));
    onChange(updated);
  };

  // Move variant up or down
  const moveVariant = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;
    const next = [...currentList];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    onChange(next);
  };

  // Delete variant
  const deleteVariant = (index) => {
    const next = currentList.filter((_, i) => i !== index);
    // If the deleted one was default, make index 0 default
    if (next.length > 0 && !next.some(v => v.isDefault)) {
      next[0].isDefault = true;
    }
    onChange(next);
  };

  // Add a blank new variant
  const addBlankVariant = () => {
    const newVar = {
      id: `var-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      label: '',
      urduLabel: '',
      weight: '',
      price: numBase || 100,
      discountPrice: numBaseDisc || '',
      stock: 50,
      isActive: true,
      isDefault: currentList.length === 0
    };
    onChange([...currentList, newVar]);
  };

  // Preset: Standard Sweets (250g, 500g, 1kg, 2kg)
  const addStandardSweetsPresets = () => {
    const p1kg = numBase || 1400;
    const d1kg = numBaseDisc;

    const presets = [
      {
        id: `var-250g-${Date.now()}`,
        label: '250 Grams (پاؤ)',
        urduLabel: '250 گرام (پاؤ)',
        weight: '250g',
        price: Math.round(p1kg * 0.25),
        discountPrice: d1kg ? Math.round(d1kg * 0.25) : '',
        stock: 50,
        isActive: true,
        isDefault: false
      },
      {
        id: `var-500g-${Date.now()}`,
        label: '500 Grams (آدھا کلو)',
        urduLabel: '500 گرام (آدھا کلو)',
        weight: '500g',
        price: Math.round(p1kg * 0.5),
        discountPrice: d1kg ? Math.round(d1kg * 0.5) : '',
        stock: 50,
        isActive: true,
        isDefault: false
      },
      {
        id: `var-1kg-${Date.now()}`,
        label: '1 Kilogram (ایک کلو)',
        urduLabel: '1 کلوگرام (ایک کلو)',
        weight: '1kg',
        price: p1kg,
        discountPrice: d1kg || '',
        stock: 50,
        isActive: true,
        isDefault: true // Default to 1kg as standard
      },
      {
        id: `var-2kg-${Date.now()}`,
        label: '2 Kilograms Gift Box (دو کلو تحفہ بکس)',
        urduLabel: '2 کلوگرام (دو کلو تحفہ بکس)',
        weight: '2kg',
        price: p1kg * 2,
        discountPrice: d1kg ? d1kg * 2 : '',
        stock: 50,
        isActive: true,
        isDefault: false
      }
    ];

    onChange(presets);
  };

  // Preset: Half Kg & 1 Kg
  const addHalfAndOneKgPresets = () => {
    const p1kg = numBase || 1400;
    const d1kg = numBaseDisc;

    const presets = [
      {
        id: `var-500g-${Date.now()}`,
        label: '500 Grams (آدھا کلو)',
        urduLabel: '500 گرام',
        weight: '500g',
        price: Math.round(p1kg * 0.5),
        discountPrice: d1kg ? Math.round(d1kg * 0.5) : '',
        stock: 50,
        isActive: true,
        isDefault: false
      },
      {
        id: `var-1kg-${Date.now()}`,
        label: '1 Kilogram (ایک کلو)',
        urduLabel: '1 کلوگرام',
        weight: '1kg',
        price: p1kg,
        discountPrice: d1kg || '',
        stock: 50,
        isActive: true,
        isDefault: true
      }
    ];

    onChange(presets);
  };

  // Preset: Piece & Box (Bakery / Snacks)
  const addPieceAndBoxPresets = () => {
    const pieceP = numBase || 150;
    const presets = [
      {
        id: `var-1pc-${Date.now()}`,
        label: '1 Piece (ایک دانہ)',
        urduLabel: '1 دانہ',
        weight: '1pc',
        price: pieceP,
        discountPrice: '',
        stock: 50,
        isActive: true,
        isDefault: true
      },
      {
        id: `var-half-dozen-${Date.now()}`,
        label: 'Half Dozen (آدھا درجن - 6 Pcs)',
        urduLabel: 'آدھا درجن (6 دانے)',
        weight: '6pc',
        price: Math.round(pieceP * 5.8),
        discountPrice: '',
        stock: 30,
        isActive: true,
        isDefault: false
      },
      {
        id: `var-dozen-${Date.now()}`,
        label: 'Full Dozen (ایک درجن - 12 Pcs Box)',
        urduLabel: 'ایک درجن (12 دانے)',
        weight: '12pc',
        price: Math.round(pieceP * 11.5),
        discountPrice: '',
        stock: 20,
        isActive: true,
        isDefault: false
      }
    ];

    onChange(presets);
  };

  // Clear all variants (revert to single price product)
  const handleClearAll = () => {
    onChange([]);
  };

  // Price range summary calculation
  const activeVars = currentList.filter(v => v.isActive !== false);
  const prices = activeVars.map(v => Number(v.discountPrice || v.price)).filter(p => !isNaN(p) && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : numBase;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : numBase;

  return (
    <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
      {/* Header and Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#07643D]" />
            <h4 className="font-bold text-sm text-gray-900">
              Multiple Weight &amp; Price Options (ویریئنٹس)
            </h4>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Set custom prices and separate stock for 250g, 500g, 1kg, 2kg, or custom pack sizes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasVariants ? (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 font-semibold transition-colors cursor-pointer"
            >
              Disable Variants (Single Price Mode)
            </button>
          ) : (
            <button
              type="button"
              onClick={addStandardSweetsPresets}
              className="px-3 py-1.5 bg-[#07643D] text-white text-xs font-bold rounded-xl hover:bg-[#043E26] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enable Multiple Weights</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Preset Buttons (Shown when variants enabled or to quickly populate) */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
          Quick Presets:
        </span>
        <button
          type="button"
          onClick={addStandardSweetsPresets}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#07643D] hover:text-[#07643D] font-medium transition-colors cursor-pointer shadow-2xs"
          title="Add 250g, 500g, 1kg, 2kg options with auto-calculated rates"
        >
          + 250g, 500g, 1kg, 2kg Sweets Pack
        </button>
        <button
          type="button"
          onClick={addHalfAndOneKgPresets}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#07643D] hover:text-[#07643D] font-medium transition-colors cursor-pointer shadow-2xs"
          title="Add 500g & 1kg options"
        >
          + 500g &amp; 1kg Box
        </button>
        <button
          type="button"
          onClick={addPieceAndBoxPresets}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#07643D] hover:text-[#07643D] font-medium transition-colors cursor-pointer shadow-2xs"
          title="Add 1 Piece, Half Dozen, 1 Dozen"
        >
          + Piece &amp; Dozen Box
        </button>
      </div>

      {/* When Variants are OFF: Single Price Mode */}
      {!hasVariants ? (
        <div className="p-4 bg-white rounded-xl border border-dashed border-gray-300 text-center space-y-1">
          <CheckCircle2 className="w-6 h-6 text-[#07643D] mx-auto mb-1" />
          <p className="text-gray-800 text-xs font-bold">
            Single Fixed Price Mode Active
          </p>
          <p className="text-gray-500 text-[11px] max-w-md mx-auto">
            This product sells at the Base Price <strong>{numBase ? `Rs. ${numBase.toLocaleString()}` : 'configured above'}</strong>. Click "+ Enable Multiple Weights" or choose a preset above to sell in 250g, 500g, 1kg, or custom portions.
          </p>
        </div>
      ) : (
        /* When Variants are ON: Interactive Variants Table */
        <div className="space-y-2">
          {/* Summary Banner */}
          <div className="flex items-center justify-between text-xs bg-emerald-50/70 border border-emerald-200 text-[#07643D] px-3 py-1.5 rounded-xl font-medium">
            <span>
              ✓ <strong>{currentList.length} Weight Options</strong> configured ({activeVars.length} Active).
            </span>
            <span className="font-mono font-bold">
              Starting from Rs. {minPrice?.toLocaleString()} {minPrice !== maxPrice ? `to Rs. ${maxPrice?.toLocaleString()}` : ''}
            </span>
          </div>

          {/* Variants Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">
            <span className="col-span-1 text-center">Default</span>
            <span className="col-span-4">Weight / Option Label</span>
            <span className="col-span-2">Regular Price</span>
            <span className="col-span-2">Sale Price (Opt)</span>
            <span className="col-span-1 text-center">Stock</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {/* Variant Rows */}
          {currentList.map((v, i) => {
            const isDefault = Boolean(v.isDefault);
            const isActive = v.isActive !== false;

            return (
              <div 
                key={v.id || i}
                className={`p-2.5 rounded-xl border transition-all ${
                  !isActive 
                    ? 'bg-gray-100/80 border-gray-300 opacity-60' 
                    : isDefault 
                      ? 'bg-white border-[#D4AF37] ring-1 ring-[#D4AF37]/30 shadow-xs' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  {/* Default Radio / Star */}
                  <div className="sm:col-span-1 flex items-center justify-between sm:justify-center">
                    <span className="sm:hidden text-xs font-semibold text-gray-600">Default:</span>
                    <button
                      type="button"
                      onClick={() => setDefaultVariant(i)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                        isDefault 
                          ? 'text-[#D4AF37] bg-amber-50 font-bold' 
                          : 'text-gray-300 hover:text-gray-500'
                      }`}
                      title={isDefault ? 'Default Selected Weight' : 'Set as default weight'}
                    >
                      <Star className={`w-4 h-4 ${isDefault ? 'fill-[#D4AF37]' : ''}`} />
                      <span className="sm:hidden text-[11px]">{isDefault ? 'Default Weight' : 'Set Default'}</span>
                    </button>
                  </div>

                  {/* Label Inputs */}
                  <div className="sm:col-span-4 space-y-1">
                    <input
                      type="text"
                      value={v.label}
                      onChange={(e) => updateVariant(i, 'label', e.target.value)}
                      placeholder="e.g. 500 Grams (آدھا کلو)"
                      className="w-full p-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#07643D] font-medium"
                    />
                    <input
                      type="text"
                      value={v.urduLabel || ''}
                      onChange={(e) => updateVariant(i, 'urduLabel', e.target.value)}
                      placeholder="اردو نام (e.g. 500 گرام)"
                      className="w-full p-1 border border-gray-200 rounded-md text-[11px] urdu-text outline-none focus:border-[#07643D]"
                    />
                  </div>

                  {/* Regular Price */}
                  <div className="sm:col-span-2">
                    <span className="sm:hidden text-[10px] text-gray-400 font-bold block mb-0.5">Regular Price (PKR):</span>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-[10px] text-gray-400 font-mono">Rs.</span>
                      <input
                        type="number"
                        min="0"
                        value={v.price}
                        onChange={(e) => updateVariant(i, 'price', e.target.value ? Number(e.target.value) : '')}
                        placeholder="700"
                        className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold outline-none focus:border-[#07643D]"
                      />
                    </div>
                  </div>

                  {/* Sale / Discount Price */}
                  <div className="sm:col-span-2">
                    <span className="sm:hidden text-[10px] text-gray-400 font-bold block mb-0.5">Sale Price (Opt):</span>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-[10px] text-gray-400 font-mono">Rs.</span>
                      <input
                        type="number"
                        min="0"
                        value={v.discountPrice ?? ''}
                        onChange={(e) => updateVariant(i, 'discountPrice', e.target.value ? Number(e.target.value) : '')}
                        placeholder="Optional"
                        className="w-full pl-7 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-mono outline-none focus:border-[#07643D]"
                      />
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div className="sm:col-span-1">
                    <span className="sm:hidden text-[10px] text-gray-400 font-bold block mb-0.5">Stock (Units):</span>
                    <input
                      type="number"
                      min="0"
                      value={v.stock ?? 50}
                      onChange={(e) => updateVariant(i, 'stock', e.target.value ? Number(e.target.value) : 0)}
                      placeholder="Qty"
                      className="w-full p-1.5 border border-gray-300 rounded-lg text-xs font-mono text-center outline-none focus:border-[#07643D]"
                      title="Stock units available for this weight"
                    />
                  </div>

                  {/* Actions (Toggle, Reorder, Delete) */}
                  <div className="sm:col-span-2 flex items-center justify-end gap-1 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                    {/* Active Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleVariantActive(i)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-100 text-[#07643D] hover:bg-emerald-200' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      title={isActive ? 'Active on store - Click to Pause' : 'Paused - Click to Activate'}
                    >
                      {isActive ? 'ON' : 'OFF'}
                    </button>

                    {/* Move Up / Down */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => moveVariant(i, -1)}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={i === currentList.length - 1}
                        onClick={() => moveVariant(i, 1)}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => deleteVariant(i)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete this weight option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Another Variant Button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={addBlankVariant}
              className="px-4 py-2 bg-white border border-[#07643D] text-[#07643D] hover:bg-emerald-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Another Weight / Size Option</span>
            </button>
            
            <span className="text-[11px] text-gray-400">
              * Click the Star icon to choose the default pre-selected weight.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
