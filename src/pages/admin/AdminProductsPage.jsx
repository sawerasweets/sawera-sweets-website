import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download, 
  X, 
  Check, 
  Tag, 
  Layers, 
  AlertCircle,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';
import db from '../../services/db';
import { exportToCSV } from '../../services/exportUtils';
import { CATEGORIES } from '../../data/categories';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(() => db.getProducts());
  const [categories, setCategories] = useState(() => db.getCategories());
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [notification, setNotification] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const syncProducts = () => {
    setProducts(db.getProducts());
    setCategories(db.getCategories());
  };

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setProducts(db.getProducts());
      setCategories(db.getCategories());
    });
    return unsubscribe;
  }, []);

  const getDefaultUnitForCategory = (cat) => {
    if (cat === 'cosmetics' || cat === 'perfumes') return '1 Bottle';
    if (cat === 'trending') return '1 Piece';
    if (cat === 'beverages') return '1 Bottle';
    if (cat === 'bakery' || cat === 'grocery') return '1 Pack';
    return 'per 1 kg';
  };

  const getDefaultImageForCategory = (cat) => {
    if (cat === 'cosmetics' || cat === 'perfumes') return '/images/categories/cosmetics.jpg';
    if (cat === 'trending') return '/images/categories/trending.jpg';
    if (cat === 'beverages') return '/images/categories/beverages.jpg';
    if (cat === 'bakery') return '/images/categories/bakery.jpg';
    if (cat === 'grocery') return '/images/categories/grocery.jpg';
    return '/images/products/gulab-jamun.svg';
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    urduName: '',
    category: 'sweets',
    subCategory: '',
    price: '',
    discountPrice: '',
    unit: 'per 1 kg',
    unitType: 'kg',
    allowsDecimalQuantity: true,
    image: '/images/products/gulab-jamun.svg',
    description: '',
    ingredients: '',
    badge: 'Fresh Stock',
    isFeatured: false,
    isBestSeller: false,
    isSpecialOffer: false,
    isActive: true,
    variations: []
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const initialCategory = selectedCat !== 'all' ? selectedCat : 'sweets';
    const defaultUnit = getDefaultUnitForCategory(initialCategory);
    const defaultImage = getDefaultImageForCategory(initialCategory);

    setFormData({
      name: '',
      urduName: '',
      category: initialCategory,
      subCategory: '',
      price: '',
      discountPrice: '',
      unit: defaultUnit,
      unitType: initialCategory === 'sweets' ? 'kg' : 'piece',
      allowsDecimalQuantity: initialCategory === 'sweets',
      image: defaultImage,
      description: '',
      ingredients: '',
      badge: 'Fresh Stock',
      isFeatured: false,
      isBestSeller: false,
      isSpecialOffer: false,
      isActive: true,
      variations: [] // Clean empty variations: Single item / piece by default
    });
    setIsModalOpen(true);
  };

  const handleCategoryChange = (newCat) => {
    const isDefaultOrSweetUnit = !formData.name || formData.unit === 'per 1 kg' || formData.unit === '1 Piece' || formData.unit === '1 Bottle' || formData.unit === '1 Pack';
    const newUnit = isDefaultOrSweetUnit ? getDefaultUnitForCategory(newCat) : formData.unit;
    const newImg = getDefaultImageForCategory(newCat);

    setFormData(prev => ({
      ...prev,
      category: newCat,
      unit: newUnit,
      image: prev.image.includes('/images/categories/') || prev.image.includes('/images/products/gulab-jamun.svg') ? newImg : prev.image,
      unitType: newCat === 'sweets' ? 'kg' : 'piece',
      allowsDecimalQuantity: newCat === 'sweets'
    }));
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      urduName: prod.urduName || '',
      category: prod.category || 'sweets',
      subCategory: prod.subCategory || '',
      price: prod.price || '',
      discountPrice: prod.discountPrice || '',
      unit: prod.unit || getDefaultUnitForCategory(prod.category),
      unitType: prod.unitType || (prod.category === 'sweets' ? 'kg' : 'piece'),
      allowsDecimalQuantity: Boolean(prod.allowsDecimalQuantity),
      image: prod.image || getDefaultImageForCategory(prod.category),
      description: prod.description || '',
      ingredients: prod.ingredients || '',
      badge: prod.badge || '',
      isFeatured: Boolean(prod.isFeatured),
      isBestSeller: Boolean(prod.isBestSeller),
      isSpecialOffer: Boolean(prod.isSpecialOffer),
      isActive: prod.isActive !== false,
      variations: prod.variations ? [...prod.variations] : []
    });
    setIsModalOpen(true);
  };

  const handleToggleProductActive = async (prod) => {
    const updated = await db.toggleProductActive(prod.id);
    syncProducts();
    const isNowActive = updated?.isActive !== false;
    setNotification(
      isNowActive
        ? `Product "${prod.name}" is now Active (Live in store).`
        : `Product "${prod.name}" is now Inactive (Hidden from store).`
    );
    setTimeout(() => setNotification(''), 3500);
  };

  const handleDeleteClick = (prod) => {
    setProductToDelete(prod);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const targetId = productToDelete.id;
    const targetName = productToDelete.name;

    // Delete in DB (local + Supabase cloud)
    await db.deleteProduct(targetId);

    // Immediate reactive local state update
    setProducts(db.getProducts());
    setProductToDelete(null);

    // Show toast confirmation
    setNotification(`Product "${targetName}" was successfully deleted.`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handlePriceChange = (newPrice) => {
    setFormData(prev => {
      const next = { ...prev, price: newPrice };
      const num = Number(newPrice);
      // If variations contain standard 500g, 1kg, 2kg, auto-align them with new Base Price!
      if (num > 0 && prev.variations.length > 0) {
        next.variations = prev.variations.map(v => {
          const lbl = (v.label || '').toLowerCase();
          if (lbl.includes('500') || lbl.includes('half') || lbl.includes('آدھا')) {
            return { ...v, price: Math.round(num * 0.5) };
          }
          if (lbl.includes('1 kg') || lbl.includes('1kg') || lbl.includes('1 kilo') || lbl.includes('ایک کلو')) {
            return { ...v, price: num };
          }
          if (lbl.includes('2 kg') || lbl.includes('2kg') || lbl.includes('2 kilo') || lbl.includes('دو کلو')) {
            return { ...v, price: num * 2 };
          }
          return v;
        });
      }
      return next;
    });
  };

  const syncVariationsFromBasePrice = () => {
    const numPrice = Number(formData.price) || 0;
    const numDisc = formData.discountPrice ? Number(formData.discountPrice) : null;
    if (!numPrice) return;

    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map(v => {
        const lbl = (v.label || '').toLowerCase();
        if (lbl.includes('500') || lbl.includes('half') || lbl.includes('آدھا')) {
          return {
            ...v,
            price: Math.round(numPrice * 0.5),
            discountPrice: numDisc ? Math.round(numDisc * 0.5) : ''
          };
        }
        if (lbl.includes('1 kg') || lbl.includes('1kg') || lbl.includes('1 kilo') || lbl.includes('ایک کلو')) {
          return {
            ...v,
            price: numPrice,
            discountPrice: numDisc ? numDisc : ''
          };
        }
        if (lbl.includes('2 kg') || lbl.includes('2kg') || lbl.includes('2 kilo') || lbl.includes('دو کلو')) {
          return {
            ...v,
            price: numPrice * 2,
            discountPrice: numDisc ? numDisc * 2 : ''
          };
        }
        return v;
      })
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Clean up variations: remove any empty labels
      const cleanedVariations = (formData.variations || [])
        .filter(v => v.label && v.label.trim())
        .map(v => ({
          label: v.label.trim(),
          price: Number(v.price) || Number(formData.price) || 0,
          discountPrice: (v.discountPrice !== '' && v.discountPrice !== null && !isNaN(Number(v.discountPrice))) ? Number(v.discountPrice) : null
        }));

      const productPayload = {
        ...formData,
        id: editingProduct?.id,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        isActive: formData.isActive !== false,
        variations: cleanedVariations,
        stocks: editingProduct?.stocks || { 'shop-1': 50 },
        updatedAt: new Date().toISOString()
      };

      await db.saveProduct(productPayload);
      syncProducts();
      setIsModalOpen(false);
      setNotification(`Product "${productPayload.name}" saved successfully to Cloud & Store.`);
      setTimeout(() => setNotification(''), 3500);
    } catch (err) {
      console.error('Error saving product:', err);
      setNotification('Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCSV = () => {
    const exportData = products.map(p => ({
      ID: p.id,
      Name: p.name,
      UrduName: p.urduName || '',
      Category: p.category,
      SubCategory: p.subCategory || '',
      Price: p.price,
      DiscountPrice: p.discountPrice || '',
      Unit: p.unit,
      StockShop1: p.stocks?.['shop-1'] || 0,
      StockShop2: p.stocks?.['shop-2'] || 0,
      StockShop3: p.stocks?.['shop-3'] || 0,
      StockShop4: p.stocks?.['shop-4'] || 0
    }));
    exportToCSV(exportData, `sawera-products-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Variation helpers & presets
  const addVariationRow = () => {
    const isPerfume = formData.category === 'cosmetics' || formData.category === 'perfumes';
    const isTrending = formData.category === 'trending';
    const defaultLabel = isPerfume ? '1 Bottle (50ml)' : isTrending ? '1 Piece' : '500 Grams';

    setFormData(prev => ({
      ...prev,
      variations: [
        ...prev.variations, 
        { 
          label: defaultLabel, 
          price: prev.price ? Number(prev.price) : '', 
          discountPrice: prev.discountPrice ? Number(prev.discountPrice) : '' 
        }
      ]
    }));
  };

  const addPieceBoxPresets = () => {
    const basePrice = Number(formData.price) || 100;
    const baseDiscount = formData.discountPrice ? Number(formData.discountPrice) : '';
    setFormData(prev => ({
      ...prev,
      unit: '1 Piece',
      unitType: 'piece',
      variations: [
        { label: '1 Piece', price: basePrice, discountPrice: baseDiscount },
        { label: 'Full Box (ڈبہ)', price: basePrice * 12, discountPrice: baseDiscount ? baseDiscount * 12 : '' }
      ]
    }));
  };

  const addPerfumePresets = () => {
    const basePrice = Number(formData.price) || 1500;
    const baseDiscount = formData.discountPrice ? Number(formData.discountPrice) : '';
    setFormData(prev => ({
      ...prev,
      unit: '1 Bottle',
      unitType: 'piece',
      variations: [
        { label: '50ml Bottle', price: basePrice, discountPrice: baseDiscount },
        { label: '100ml Bottle', price: Math.round(basePrice * 1.8), discountPrice: baseDiscount ? Math.round(baseDiscount * 1.8) : '' }
      ]
    }));
  };

  const addSweetsWeightPresets = () => {
    const basePrice = Number(formData.price) || 1000;
    const baseDiscount = formData.discountPrice ? Number(formData.discountPrice) : '';
    setFormData(prev => ({
      ...prev,
      unit: 'per 1 kg',
      unitType: 'kg',
      variations: [
        { label: '500 Grams', price: Math.round(basePrice * 0.5), discountPrice: baseDiscount ? Math.round(baseDiscount * 0.5) : '' },
        { label: '1 Kilogram Box', price: basePrice, discountPrice: baseDiscount }
      ]
    }));
  };

  const clearAllVariations = () => {
    setFormData(prev => ({
      ...prev,
      variations: []
    }));
  };

  const updateVariation = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.variations];
      updated[index][field] = value;
      return { ...prev, variations: updated };
    });
  };

  const removeVariation = (index) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const filteredProducts = products.filter(p => {
    if (selectedCat !== 'all' && p.category.toLowerCase() !== selectedCat.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !(p.urduName && p.urduName.includes(q))) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Success Notification Alert */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-[#07643D] text-xs font-bold rounded-2xl flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-emerald-800 hover:text-emerald-950 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Products &amp; Catalog</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage demo &amp; real product items, weights, prices, and decimal units.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] whitespace-nowrap ${
              selectedCat === 'all' ? 'bg-[#07643D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id || cat.slug}
              onClick={() => setSelectedCat(cat.slug || cat.id)}
              className={`px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] whitespace-nowrap ${
                (selectedCat === cat.id || selectedCat === cat.slug) ? 'bg-[#07643D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name} ({products.filter(p => p.category === (cat.slug || cat.id)).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full border border-gray-300 text-xs outline-none focus:border-[#07643D]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#07643D] text-white font-semibold">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Variations</th>
                <th className="py-3 px-4 text-center">Shop 1 Stock</th>
                <th className="py-3 px-4 text-center">Total Stock</th>
                <th className="py-3 px-4 text-center">Status (On / Off)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((p) => {
                const totalStock = Object.values(p.stocks || {}).reduce((a, b) => a + b, 0);
                const isLow = totalStock <= (p.lowStockThreshold || 10);
                const isActive = p.isActive !== false;

                return (
                  <tr key={p.id} className={`transition-colors ${isActive ? 'hover:bg-gray-50' : 'bg-gray-50/70 opacity-75'}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border p-1 flex-shrink-0 flex items-center justify-center">
                          <img src={p.image} alt={p.name} className="max-h-full object-contain" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-gray-900">{p.name}</p>
                            {!isActive && (
                              <span className="text-[9px] bg-gray-200 text-gray-600 font-bold px-1.5 py-0.2 rounded-full uppercase">
                                OFF
                              </span>
                            )}
                          </div>
                          {p.urduName && (
                            <p className="text-[11px] text-amber-800 font-semibold urdu-text">{p.urduName}</p>
                          )}
                          <span className="text-[10px] text-gray-400">{p.unit}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 capitalize font-medium text-gray-700">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#07643D] font-bold text-[10px] border border-emerald-200">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-gray-900">
                        Rs. {(p.discountPrice || p.price).toLocaleString()}
                      </span>
                      {p.discountPrice && (
                        <span className="block text-[10px] text-gray-400 line-through font-mono">
                          Rs. {p.price}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {p.variations?.length > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-800">
                          {p.variations.length} options ({p.variations.map(v => v.label).join(', ')})
                        </span>
                      ) : (
                        <span className="text-gray-400">Standard only</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-gray-800">
                      {p.stocks?.['shop-1'] ?? 0}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                        isLow ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {totalStock} Units
                      </span>
                    </td>

                    {/* ACTIVE ON / OFF SWITCH */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleProductActive(p)}
                          className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? 'bg-[#07643D]' : 'bg-gray-300'
                          }`}
                          role="switch"
                          aria-checked={isActive}
                          title={isActive ? 'Click to Turn Off (Hide from store)' : 'Click to Turn On (Make live)'}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                          isActive ? 'text-[#07643D]' : 'text-gray-400'
                        }`}>
                          {isActive ? 'Active' : 'Off'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#07643D] hover:bg-emerald-50"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 my-8">
            <div className="bg-[#07643D] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingProduct ? 'Edit Product Details' : 'Add New Store Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Product Name (English)</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Special Khoya Pera"
                    className="w-full p-2 border rounded-xl outline-none focus:border-[#07643D]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Product Name (Urdu)</label>
                  <input
                    type="text"
                    value={formData.urduName}
                    onChange={(e) => setFormData({ ...formData, urduName: e.target.value })}
                    placeholder="e.g. اسپیشل کھویا پیڑا"
                    className="w-full p-2 border rounded-xl outline-none focus:border-[#07643D] urdu-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Store Category (کیٹیگری)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-2 border rounded-xl outline-none focus:border-[#07643D]"
                  >
                    {categories.map(c => (
                      <option key={c.id || c.slug} value={c.slug || c.id}>
                        {c.name} {c.urduName ? `(${c.urduName})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sub-Category</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder={
                      formData.category === 'trending' ? 'e.g. Chocolates, Biscuits, Chips' :
                      formData.category === 'cosmetics' || formData.category === 'perfumes' ? 'e.g. Men Perfumes, Attar, Skincare' :
                      formData.category === 'beverages' ? 'e.g. Juices, Cold Drinks' :
                      'e.g. Barfi & Peda'
                    }
                    className="w-full p-2 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Unit / Packaging (پیکنگ)</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. 1 Piece, 1 Bottle, Full Box, per 1 kg..."
                    className="w-full p-2 border rounded-xl outline-none focus:border-[#07643D]"
                  />
                  {/* Quick Unit Selection Pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['1 Piece', '1 Bottle', 'Full Box', '1 Pack', 'per 1 kg', '500g', '1 Dozen'].map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setFormData({ ...formData, unit: u })}
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-medium transition-colors cursor-pointer ${
                          formData.unit === u
                            ? 'bg-[#07643D] text-white border-[#07643D]'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-emerald-50 hover:text-[#07643D]'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="e.g. 1400"
                    className="w-full p-2 border rounded-xl outline-none font-mono focus:border-[#07643D]"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Price for single item ({formData.unit || 'Piece'})</span>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount / Sale Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="Optional promo price"
                    className="w-full p-2 border rounded-xl outline-none font-mono focus:border-[#07643D]"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Agar sale ya discount lagana ho</span>
                </div>
              </div>

              {/* Variations & Sizes Builder (Optional) */}
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/70 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-gray-800 text-xs block">
                      Sizes, Packs &amp; Variations (اختیاری - سائز و مختلف آپشنز)
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Agar 1 Piece vs Full Box, ya 50ml vs 100ml, ya 500g vs 1kg offer karna ho to add karein. Warna isko khali chhor dein.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {formData.variations.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={syncVariationsFromBasePrice}
                          className="text-[#07643D] bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md font-bold text-[11px] hover:bg-emerald-100 cursor-pointer"
                          title="Recalculate 500g (50%), 1kg (100%), 2kg (200%) from current Base Price"
                        >
                          ⚡ Sync with Base Price
                        </button>
                        <button
                          type="button"
                          onClick={clearAllVariations}
                          className="text-red-600 font-semibold text-[11px] hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={addVariationRow}
                      className="text-[#07643D] font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      + Add Option Row
                    </button>
                  </div>
                </div>

                {/* Quick Presets for fast 1-click addition */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-200/60">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                    Quick Presets:
                  </span>
                  <button
                    type="button"
                    onClick={addPieceBoxPresets}
                    className="text-[10px] px-2 py-1 rounded-md bg-white border border-gray-200 hover:border-[#07643D] hover:text-[#07643D] font-medium transition-colors cursor-pointer"
                    title="Add 1 Piece & Full Box options"
                  >
                    + 1 Piece &amp; Full Box (ڈبہ)
                  </button>
                  <button
                    type="button"
                    onClick={addPerfumePresets}
                    className="text-[10px] px-2 py-1 rounded-md bg-white border border-gray-200 hover:border-[#07643D] hover:text-[#07643D] font-medium transition-colors cursor-pointer"
                    title="Add 50ml & 100ml options"
                  >
                    + 50ml &amp; 100ml Bottle
                  </button>
                  <button
                    type="button"
                    onClick={addSweetsWeightPresets}
                    className="text-[10px] px-2 py-1 rounded-md bg-white border border-gray-200 hover:border-[#07643D] hover:text-[#07643D] font-medium transition-colors cursor-pointer"
                    title="Add 500g & 1kg sweet weights"
                  >
                    + 500g &amp; 1kg Box
                  </button>
                </div>

                {formData.variations.length === 0 ? (
                  <div className="p-3.5 bg-white rounded-xl border border-dashed border-gray-300 text-center space-y-1">
                    <p className="text-gray-700 text-xs font-semibold">
                      ✓ Single Price Item (کوئی اضافی سائز نہیں)
                    </p>
                    <p className="text-gray-400 text-[11px]">
                      Ye product upar di gayi <strong>Regular Price {formData.price ? `(Rs. ${Number(formData.price).toLocaleString()})` : ''}</strong> par <strong>{formData.unit || 'Single Piece'}</strong> ke hisaab se sell hoga. Agar alag alag pack size nahi hain to yahan kuch add karne ki zaroorat nahi hai.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.variations.map((v, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={v.label}
                          onChange={(e) => updateVariation(i, 'label', e.target.value)}
                          placeholder="Option Name (e.g. 1 Piece, Full Box, 50ml, 500g)"
                          className="flex-1 p-2 border rounded-lg bg-white text-xs outline-none focus:border-[#07643D]"
                        />
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => updateVariation(i, 'price', e.target.value ? Number(e.target.value) : '')}
                          placeholder="Price (PKR)"
                          className="w-28 p-2 border rounded-lg bg-white font-mono text-xs outline-none focus:border-[#07643D]"
                        />
                        <input
                          type="number"
                          value={v.discountPrice ?? ''}
                          onChange={(e) => updateVariation(i, 'discountPrice', e.target.value ? Number(e.target.value) : '')}
                          placeholder="Sale Price (Opt)"
                          className="w-28 p-2 border rounded-lg bg-white font-mono text-xs outline-none focus:border-[#07643D]"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariation(i)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove this option"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/products/gulab-jamun.svg"
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Traditional authentic preparation..."
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Ingredients</label>
                <input
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="Pure Khoya, Desi Ghee, Sugar..."
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              {/* Status Active Toggle in Form */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-800 block">Product Status</span>
                  <span className="text-[11px] text-gray-400">Turn On to show on storefront, or Off to pause</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.isActive ? 'bg-[#07643D]' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={formData.isActive}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      formData.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#07643D] text-white rounded-xl font-bold hover:bg-[#043E26] disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to Cloud...</span>
                    </>
                  ) : (
                    <span>Save Product</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-gray-900">
                Delete Product?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-gray-900">{productToDelete.name}</strong> ({productToDelete.urduName || productToDelete.category})? This product will be removed from your store and customer catalog.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
