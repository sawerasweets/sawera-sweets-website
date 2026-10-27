import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Minus, 
  Info, 
  ShoppingBag, 
  ChevronRight, 
  ArrowRight, 
  Scale, 
  Heart, 
  ShieldCheck,
  Check,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import db from '../services/db';
import { GIFT_RIBBON_OPTIONS, GIFT_OCCASION_TEMPLATES } from '../data/boxStudioConfig';

export default function MithaiBoxStudioPage() {
  const { t, isUrdu } = useLanguage();
  const { addCustomBoxToCart } = useCart();

  // Load box options and catalog sweets from db
  const [boxOptions, setBoxOptions] = useState([]);
  const [sweetsCatalog, setSweetsCatalog] = useState([]);
  const [selectedBoxId, setSelectedBoxId] = useState('');
  
  // Custom box state: array of { product, grams, price }
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRibbonId, setSelectedRibbonId] = useState('ribbon-gold');
  const [giftMessage, setGiftMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const boxes = db.getBoxOptions().filter(b => b.isActive !== false);
    setBoxOptions(boxes);
    if (boxes.length > 0 && !selectedBoxId) {
      // Default to 1kg Royal Emerald or first available
      const defaultBox = boxes.find(b => b.capacityGrams === 1000) || boxes[0];
      setSelectedBoxId(defaultBox.id);
    }

    // Filter available sweets from products catalog
    const allProducts = db.getProducts();
    const sweets = allProducts.filter(p => p.category === 'sweets' && p.inStock !== false && p.isActive !== false);
    setSweetsCatalog(sweets);
  }, []);

  const activeBox = useMemo(() => {
    return boxOptions.find(b => b.id === selectedBoxId) || boxOptions[0] || null;
  }, [boxOptions, selectedBoxId]);

  // Capacity calculations
  const totalGrams = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.grams, 0);
  }, [selectedItems]);

  const maxCapacity = activeBox ? activeBox.capacityGrams : 1000;
  const isOverCapacity = totalGrams > maxCapacity;
  const capacityPercent = Math.min(100, Math.round((totalGrams / maxCapacity) * 100));
  const remainingGrams = Math.max(0, maxCapacity - totalGrams);
  const isFull = totalGrams >= maxCapacity;

  // Price calculations based strictly on real product catalog prices
  const sweetsSubtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const prod = item.product;
      const effectivePerKgPrice = prod.discountPrice || prod.price;
      const itemCost = Math.round((item.grams / 1000) * effectivePerKgPrice);
      return sum + itemCost;
    }, 0);
  }, [selectedItems]);

  const packagingFee = activeBox ? (activeBox.packagingFee || 0) : 0;
  const totalPrice = sweetsSubtotal + packagingFee;

  // Add portion of sweet
  const handleAddSweet = (product, portionGrams = 200) => {
    if (remainingGrams <= 0) return;
    const addedPortion = Math.min(portionGrams, remainingGrams);
    if (addedPortion <= 0) return;

    setSelectedItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newGrams = updated[existingIdx].grams + addedPortion;
        const effectivePerKg = product.discountPrice || product.price;
        updated[existingIdx] = {
          ...updated[existingIdx],
          grams: newGrams,
          price: Math.round((newGrams / 1000) * effectivePerKg)
        };
        return updated;
      } else {
        const effectivePerKg = product.discountPrice || product.price;
        return [
          ...prev,
          {
            product,
            grams: addedPortion,
            price: Math.round((addedPortion / 1000) * effectivePerKg)
          }
        ];
      }
    });
  };

  // Adjust sweet grams
  const handleAdjustGrams = (productId, delta) => {
    setSelectedItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const currentGrams = item.grams;
            let targetGrams = currentGrams + delta;
            if (delta > 0 && targetGrams - currentGrams > remainingGrams) {
              targetGrams = currentGrams + remainingGrams;
            }
            if (targetGrams <= 0) return null;
            const effectivePerKg = item.product.discountPrice || item.product.price;
            return {
              ...item,
              grams: targetGrams,
              price: Math.round((targetGrams / 1000) * effectivePerKg)
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Remove sweet from box
  const handleRemoveSweet = (productId) => {
    setSelectedItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Quick fill preset template
  const handleApplyPreset = (template) => {
    setGiftMessage(template.defaultMsg);
  };

  // Submit custom box to cart
  const handleAddToCart = () => {
    if (!activeBox || selectedItems.length === 0 || isOverCapacity) return;

    const ribbonObj = GIFT_RIBBON_OPTIONS.find(r => r.id === selectedRibbonId);

    const boxData = {
      boxOption: activeBox,
      items: selectedItems,
      packagingFee,
      totalGrams,
      totalPrice,
      ribbon: ribbonObj?.name || null,
      giftMessage: giftMessage.trim(),
      recipientName: recipientName.trim()
    };

    addCustomBoxToCart(boxData);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-800 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-amber-500/30">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'دستخطی سگنیچر سروس' : 'Sawera Signature Experience'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-200">
                {isUrdu ? 'سویرا مٹھائی بکس اسٹوڈیو' : 'Sawera Mithai Box Studio'}
              </h1>
              <p className="text-emerald-100 max-w-2xl text-sm sm:text-base leading-relaxed">
                {isUrdu 
                  ? 'اپنی پسند کی روایتی مٹھائیاں خود منتخب کر کے شاہی پریزنٹیشن بکس سجائیں۔ خالص دیسی گھی مٹھائی، گولڈن ٹرے اور خوبصورت تحفہ پیکنگ۔' 
                  : 'Design your personalized luxury mithai assortment. Hand-pick your favorite traditional sweets into a royal presentation box with gold-foil finish and custom greeting note.'
                }
              </p>
            </div>

            {/* Quick Live Box Pill */}
            <div className="bg-emerald-900/80 border border-amber-400/30 rounded-2xl p-4 backdrop-blur-sm flex items-center gap-5 shrink-0 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-amber-300 font-medium">
                  {isUrdu ? 'منتخب شدہ بکس' : 'Selected Box'}
                </p>
                <p className="font-bold text-white text-base">
                  {activeBox ? (isUrdu ? activeBox.urduName : activeBox.name) : 'Box'}
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-200 mt-0.5">
                  <span>{totalGrams}g / {maxCapacity}g</span>
                  <span>•</span>
                  <span className="font-semibold text-amber-300">Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Studio Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Step Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => setCurrentStep(1)}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentStep === 1 
                ? 'bg-emerald-900 text-white border-amber-400 shadow-md ring-2 ring-amber-400/30' 
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-emerald-700'
            }`}
          >
            <span className="text-xs font-semibold block uppercase tracking-wide opacity-80">
              {isUrdu ? 'مرحلہ ۱' : 'Step 1'}
            </span>
            <span className="font-serif font-bold text-sm sm:text-base">
              {isUrdu ? 'بکس کا سائز' : 'Choose Box'}
            </span>
          </button>

          <button
            onClick={() => setCurrentStep(2)}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentStep === 2 
                ? 'bg-emerald-900 text-white border-amber-400 shadow-md ring-2 ring-amber-400/30' 
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-emerald-700'
            }`}
          >
            <span className="text-xs font-semibold block uppercase tracking-wide opacity-80">
              {isUrdu ? 'مرحلہ ۲' : 'Step 2'}
            </span>
            <span className="font-serif font-bold text-sm sm:text-base">
              {isUrdu ? 'مٹھائیاں چنیں' : 'Select Sweets'}
            </span>
          </button>

          <button
            onClick={() => setCurrentStep(3)}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentStep === 3 
                ? 'bg-emerald-900 text-white border-amber-400 shadow-md ring-2 ring-amber-400/30' 
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-emerald-700'
            }`}
          >
            <span className="text-xs font-semibold block uppercase tracking-wide opacity-80">
              {isUrdu ? 'مرحلہ ۳' : 'Step 3'}
            </span>
            <span className="font-serif font-bold text-sm sm:text-base">
              {isUrdu ? 'ٹرے اور گنجائش' : 'Review Tray'}
            </span>
          </button>

          <button
            onClick={() => setCurrentStep(4)}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentStep === 4 
                ? 'bg-emerald-900 text-white border-amber-400 shadow-md ring-2 ring-amber-400/30' 
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-emerald-700'
            }`}
          >
            <span className="text-xs font-semibold block uppercase tracking-wide opacity-80">
              {isUrdu ? 'مرحلہ ۴' : 'Step 4'}
            </span>
            <span className="font-serif font-bold text-sm sm:text-base">
              {isUrdu ? 'تحفہ کارڈ و آرڈر' : 'Gift & Checkout'}
            </span>
          </button>
        </div>

        {/* Studio Layout: Main Interaction Column + Sticky Summary Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Controls Area (7 cols on LG) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* STEP 1: Choose Box Option */}
            <section className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-neutral-900">
                      {isUrdu ? 'بکس کا سائز اور انداز منتخب کریں' : 'Choose Box Size & Presentation'}
                    </h2>
                    <p className="text-xs text-neutral-500">
                      {isUrdu ? 'اپنی ضرورت کے مطابق ۵۰۰ گرام، ۱ کلو یا ۲ کلو بکس چنیں' : 'Select the ideal box size for your family or gifting occasion'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {boxOptions.map(box => {
                  const isSelected = box.id === activeBox?.id;
                  return (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBoxId(box.id)}
                      className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-400/20' 
                          : 'border-neutral-200 bg-white hover:border-emerald-600 hover:shadow-sm'
                      }`}
                    >
                      {box.badge && (
                        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white">
                          {isUrdu ? box.urduBadge || box.badge : box.badge}
                        </span>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                          <img 
                            src={box.image} 
                            alt={box.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 pr-14">
                          <h3 className="font-serif font-bold text-neutral-900 text-sm sm:text-base">
                            {isUrdu ? box.urduName : box.name}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                            {isUrdu ? box.urduDescription : box.description}
                          </p>
                          <div className="flex items-center gap-3 mt-3 text-xs">
                            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                              {box.capacityGrams}g Capacity
                            </span>
                            <span className="text-neutral-500">
                              Box: +Rs. {box.packagingFee}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute bottom-3 right-3 text-amber-600 flex items-center gap-1 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 fill-amber-500 text-white" />
                          <span>{isUrdu ? 'منتخب' : 'Selected'}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* STEP 2: Real Mithai Catalog Picker */}
            <section className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-neutral-900">
                      {isUrdu ? 'روایتی مٹھائیاں شامل کریں' : 'Select Real Catalog Sweets'}
                    </h2>
                    <p className="text-xs text-neutral-500">
                      {isUrdu ? 'روزانہ خالص دیسی گھی اور تازہ کھوئے سے تیار کردہ مٹھائیاں' : 'Prepared fresh daily with pure desi ghee and genuine ingredients'}
                    </p>
                  </div>
                </div>

                <div className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-600" />
                  <span>
                    {isUrdu ? 'باقی گنجائش:' : 'Remaining:'}{' '}
                    <strong className="text-amber-900">{remainingGrams}g</strong>
                  </span>
                </div>
              </div>

              {/* Sweets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sweetsCatalog.map(product => {
                  const effectivePrice = product.discountPrice || product.price;
                  const selectedInBox = selectedItems.find(i => i.product.id === product.id);
                  const inBoxGrams = selectedInBox ? selectedInBox.grams : 0;
                  const isOutOfSpace = remainingGrams <= 0;

                  return (
                    <div 
                      key={product.id}
                      className={`rounded-xl p-3 border transition-all flex flex-col justify-between ${
                        inBoxGrams > 0 
                          ? 'border-emerald-600 bg-emerald-50/30' 
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200 relative">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                          {inBoxGrams > 0 && (
                            <span className="absolute bottom-1 right-1 bg-emerald-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                              {inBoxGrams}g
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-bold text-neutral-900 text-sm leading-tight truncate">
                            {isUrdu ? product.urduName || product.name : product.name}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Rs. {effectivePrice.toLocaleString()} / kg
                          </p>

                          {/* Quick portion add buttons */}
                          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleAddSweet(product, 100)}
                              disabled={isOutOfSpace || remainingGrams < 100}
                              className="px-2 py-1 text-[11px] font-medium rounded bg-neutral-100 hover:bg-emerald-800 hover:text-white transition disabled:opacity-40 disabled:hover:bg-neutral-100 disabled:hover:text-neutral-800"
                            >
                              +100g
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddSweet(product, 200)}
                              disabled={isOutOfSpace || remainingGrams < 200}
                              className="px-2 py-1 text-[11px] font-medium rounded bg-neutral-100 hover:bg-emerald-800 hover:text-white transition disabled:opacity-40 disabled:hover:bg-neutral-100 disabled:hover:text-neutral-800"
                            >
                              +200g
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddSweet(product, 250)}
                              disabled={isOutOfSpace || remainingGrams < 250}
                              className="px-2 py-1 text-[11px] font-medium rounded bg-neutral-100 hover:bg-emerald-800 hover:text-white transition disabled:opacity-40 disabled:hover:bg-neutral-100 disabled:hover:text-neutral-800"
                            >
                              +250g
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Active in-box controls */}
                      {inBoxGrams > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-emerald-100 flex items-center justify-between text-xs">
                          <span className="text-emerald-900 font-semibold">
                            {inBoxGrams}g • Rs. {selectedInBox.price.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAdjustGrams(product.id, -100)}
                              className="w-6 h-6 rounded bg-neutral-200 text-neutral-700 flex items-center justify-center hover:bg-neutral-300"
                              title="Reduce 100g"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleAdjustGrams(product.id, +100)}
                              disabled={isOutOfSpace}
                              className="w-6 h-6 rounded bg-emerald-800 text-white flex items-center justify-center hover:bg-emerald-900 disabled:opacity-40"
                              title="Add 100g"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveSweet(product.id)}
                              className="w-6 h-6 rounded bg-rose-100 text-rose-700 flex items-center justify-center hover:bg-rose-200 ml-1"
                              title="Remove"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* STEP 3: Gift Customization & Greeting Card */}
            <section className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-neutral-900">
                    {isUrdu ? 'تحفہ کارڈ، ربن اور خصوصی پیغام' : 'Gift Presentation & Personal Greeting'}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    {isUrdu ? 'شادی، عید، یا خاص تقریب کے لیے دستخطی تہنیتی کارڈ شامل کریں' : 'Complimentary satin ribbon seal and handwritten gift card with your warm wishes'}
                  </p>
                </div>
              </div>

              {/* Ribbon Selector */}
              <div className="space-y-3 mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  {isUrdu ? 'شاہی ساٹن ربن کا انتخاب:' : 'Satin Ribbon Presentation:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {GIFT_RIBBON_OPTIONS.map(ribbon => {
                    const isSelected = selectedRibbonId === ribbon.id;
                    return (
                      <button
                        key={ribbon.id}
                        type="button"
                        onClick={() => setSelectedRibbonId(ribbon.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-neutral-400 shrink-0" 
                          style={{ backgroundColor: ribbon.colorHex || ribbon.color }}
                        />
                        <span className="text-xs font-semibold text-neutral-800 leading-tight">
                          {isUrdu ? ribbon.urduName : ribbon.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Template Presets */}
              <div className="space-y-3 mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  {isUrdu ? 'آسان تہنیتی پیغامات (ایک کلک پر منتخب کریں):' : 'Quick Greeting Templates:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {GIFT_OCCASION_TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleApplyPreset(tpl)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-emerald-50 hover:border-emerald-600 text-neutral-700 transition"
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient & Message Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isUrdu ? 'وصول کنندہ کا نام (اختیاری):' : 'Recipient Name (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder={isUrdu ? 'مثلاً: چوہدری اصغر علی صاحب' : 'e.g., Dear Salman & Family'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isUrdu ? 'تہنیتی کارڈ کا پیغام (اختیاری):' : 'Gift Note (Optional):'}
                  </label>
                  <textarea
                    rows={2}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder={isUrdu ? 'شادی مبارک! سویرا سویٹس کی جانب سے ڈھیروں دعائیں...' : 'Heartiest congratulations on your auspicious celebration...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Live Box & Price Summary Column (4 cols on LG) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Box Tray Visualizer & Gauge */}
              <div className="bg-white rounded-2xl p-6 border-2 border-emerald-900/20 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="font-serif font-bold text-neutral-900 text-lg flex items-center gap-2">
                    <Box className="w-5 h-5 text-emerald-800" />
                    <span>{isUrdu ? 'بکس ٹرے اور گنجائش' : 'Assortment Tray'}</span>
                  </h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isFull 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {capacityPercent}% {isUrdu ? 'بھرا ہوا' : 'Filled'}
                  </span>
                </div>

                {/* Animated Capacity Progress Bar */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-neutral-600">
                    <span>{totalGrams}g {isUrdu ? 'شامل شدہ' : 'loaded'}</span>
                    <span>{maxCapacity}g {isUrdu ? 'مکمل گنجائش' : 'max'}</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-3 rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull 
                          ? 'bg-gradient-to-r from-emerald-700 to-amber-500' 
                          : 'bg-emerald-700'
                      }`}
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                  {remainingGrams > 0 ? (
                    <p className="text-[11px] text-neutral-500 text-right">
                      {isUrdu ? `ابھی مزید ${remainingGrams} گرام کی گنجائش موجود ہے` : `You can add ${remainingGrams}g more sweets`}
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-700 font-semibold text-right">
                      {isUrdu ? 'بکس کی گنجائش مکمل ہو چکی ہے' : 'Box is filled to maximum capacity'}
                    </p>
                  )}
                </div>

                {/* Selected Sweets Manifest */}
                <div className="mt-5 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    {isUrdu ? 'شامل کردہ مٹھائیاں:' : 'Selected Sweets in Box:'}
                  </p>

                  {selectedItems.length === 0 ? (
                    <div className="p-4 rounded-xl bg-amber-50/50 border border-dashed border-amber-300 text-center">
                      <p className="text-xs text-amber-800">
                        {isUrdu 
                          ? 'بکس ابھی خالی ہے۔ اوپر دی گئی مٹھائیوں میں سے منتخب کریں' 
                          : 'Your box is empty. Click "+100g" on sweets to add.'}
                      </p>
                    </div>
                  ) : (
                    selectedItems.map(item => (
                      <div 
                        key={item.product.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-8 h-8 rounded object-cover shrink-0" 
                          />
                          <div className="truncate">
                            <p className="font-semibold text-neutral-800 truncate">
                              {isUrdu ? item.product.urduName || item.product.name : item.product.name}
                            </p>
                            <p className="text-[10px] text-neutral-500">
                              {item.grams}g
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-bold text-neutral-900">
                            Rs. {item.price.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSweet(item.product.id)}
                            className="text-neutral-400 hover:text-rose-600 transition"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Transparent Live Price Breakdown */}
                <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>{isUrdu ? 'مٹھائی کی قیمت (وزن کے حساب سے):' : 'Sweets Content Subtotal:'}</span>
                    <span className="font-semibold text-neutral-900">Rs. {sweetsSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>{isUrdu ? 'پریزنٹیشن و پیکنگ فیس:' : 'Rigid Gift Box & Packaging:'}</span>
                    <span className="font-semibold text-neutral-900">Rs. {packagingFee.toLocaleString()}</span>
                  </div>
                  {recipientName && (
                    <div className="flex justify-between text-neutral-500 text-[11px]">
                      <span>{isUrdu ? 'تہنیتی کارڈ برائے:' : 'Card for:'}</span>
                      <span className="truncate max-w-[150px] font-medium">{recipientName}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                    <span className="font-serif font-bold text-neutral-900 text-sm">
                      {isUrdu ? 'کل بکس قیمت:' : 'Total Box Price:'}
                    </span>
                    <span className="font-serif font-bold text-emerald-900 text-xl">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Add Custom Box To Cart Button */}
                <div className="mt-6 space-y-3">
                  {isOverCapacity && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {isUrdu 
                        ? `کل وزن (${totalGrams} گرام) بکس کی گنجائش (${maxCapacity} گرام) سے زیادہ ہے۔ براہ کرم مقدار کم کریں یا بڑا بکس منتخب کریں۔`
                        : `Total weight (${totalGrams}g) exceeds box limit (${maxCapacity}g). Please reduce portions or select a larger box.`}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={selectedItems.length === 0 || isOverCapacity}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-5 h-5 text-amber-300" />
                        <span>{isUrdu ? 'بکس کارٹ میں شامل ہو گیا!' : 'Custom Box Added to Cart!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5 text-amber-300" />
                        <span>{isUrdu ? 'کسٹم بکس کارٹ میں شامل کریں' : 'Add Custom Box to Cart'}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-neutral-500 mt-2">
                    {isUrdu 
                      ? 'قیمت کی دوبارہ جانچ چیک آؤٹ پر خودکار طریقے سے کی جائے گی' 
                      : 'Authentic store pricing re-verified at checkout'}
                  </p>
                </div>
              </div>

              {/* Trust & Guarantee Card */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <span>{isUrdu ? 'سویرا سویٹس کا ۳۰ سالہ معیار' : 'Sawera 30+ Years Quality Promise'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900/80">
                  {isUrdu 
                    ? 'تمام مٹھائیاں حفظانِ صحت کے اصولوں کے مطابق خالص دیسی گھی اور اصلی کھوئے سے تیار کی جاتی ہیں۔ جھنگ شہر میں فوری ہوم ڈلیوری اور پاکستان بھر میں محفوظ ترسیل۔' 
                    : 'Every custom box is hand-packed freshly under strict food-hygiene standards using pure desi ghee and fresh khoya.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
