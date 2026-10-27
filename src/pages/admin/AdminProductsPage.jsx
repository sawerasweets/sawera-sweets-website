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
  Image as ImageIcon
} from 'lucide-react';
import db from '../../services/db';
import { exportToCSV } from '../../services/exportUtils';
import { CATEGORIES } from '../../data/categories';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(() => db.getProducts());
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [notification, setNotification] = useState('');

  const syncProducts = () => {
    setProducts(db.getProducts());
  };

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setProducts(db.getProducts());
    });
    return unsubscribe;
  }, []);

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
    badge: 'Fresh Batch',
    isFeatured: false,
    isBestSeller: false,
    isSpecialOffer: false,
    variations: [
      { label: '500 Grams', price: 500, discountPrice: '' },
      { label: '1 Kilogram', price: 1000, discountPrice: 900 }
    ]
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
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
      badge: 'Fresh Batch',
      isFeatured: false,
      isBestSeller: false,
      isSpecialOffer: false,
      variations: [
        { label: '500 Grams', price: 500, discountPrice: '' },
        { label: '1 Kilogram Box', price: 1000, discountPrice: 900 }
      ]
    });
    setIsModalOpen(true);
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
      unit: prod.unit || 'per 1 kg',
      unitType: prod.unitType || 'kg',
      allowsDecimalQuantity: Boolean(prod.allowsDecimalQuantity),
      image: prod.image || '/images/products/gulab-jamun.svg',
      description: prod.description || '',
      ingredients: prod.ingredients || '',
      badge: prod.badge || '',
      isFeatured: Boolean(prod.isFeatured),
      isBestSeller: Boolean(prod.isBestSeller),
      isSpecialOffer: Boolean(prod.isSpecialOffer),
      variations: prod.variations ? [...prod.variations] : []
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (prod) => {
    setProductToDelete(prod);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    const targetId = productToDelete.id;
    const targetName = productToDelete.name;

    // Delete in DB
    db.deleteProduct(targetId);

    // Immediate reactive local state update
    setProducts(prev => prev.filter(p => p.id !== targetId));
    setProductToDelete(null);

    // Show toast confirmation
    setNotification(`Product "${targetName}" was successfully deleted.`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const productPayload = {
      ...formData,
      id: editingProduct?.id,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      stocks: editingProduct?.stocks || { 'shop-1': 50 }
    };

    db.saveProduct(productPayload);
    syncProducts();
    setIsModalOpen(false);
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

  // Add variation row
  const addVariationRow = () => {
    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, { label: 'New Size / Weight', price: '', discountPrice: '' }]
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
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] whitespace-nowrap ${
                selectedCat === cat.id ? 'bg-[#07643D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
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
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((p) => {
                const totalStock = Object.values(p.stocks || {}).reduce((a, b) => a + b, 0);
                const isLow = totalStock <= (p.lowStockThreshold || 10);

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border p-1 flex-shrink-0 flex items-center justify-center">
                          <img src={p.image} alt={p.name} className="max-h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{p.name}</p>
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
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded-xl outline-none focus:border-[#07643D]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.displayName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sub-Category</label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="e.g. Barfi & Peda"
                    className="w-full p-2 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Unit Label</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. per 1 kg / 2 Pound"
                    className="w-full p-2 border rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Regular Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1200"
                    className="w-full p-2 border rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="Optional sale price"
                    className="w-full p-2 border rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              {/* Variations Builder */}
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">Weights &amp; Variations (250g, 500g, 1kg, 2kg)</span>
                  <button
                    type="button"
                    onClick={addVariationRow}
                    className="text-[#07643D] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    + Add Size Option
                  </button>
                </div>

                {formData.variations.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={v.label}
                      onChange={(e) => updateVariation(i, 'label', e.target.value)}
                      placeholder="e.g. 500 Grams"
                      className="flex-1 p-1.5 border rounded-lg bg-white"
                    />
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVariation(i, 'price', Number(e.target.value))}
                      placeholder="Price"
                      className="w-24 p-1.5 border rounded-lg bg-white font-mono"
                    />
                    <input
                      type="number"
                      value={v.discountPrice || ''}
                      onChange={(e) => updateVariation(i, 'discountPrice', e.target.value ? Number(e.target.value) : '')}
                      placeholder="Sale Price"
                      className="w-24 p-1.5 border rounded-lg bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariation(i)}
                      className="p-1.5 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
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
                  className="px-5 py-2 bg-[#07643D] text-white rounded-xl font-bold hover:bg-[#043E26]"
                >
                  Save Product
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
