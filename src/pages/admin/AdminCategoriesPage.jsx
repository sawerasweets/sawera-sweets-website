import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle,
  Tag,
  ShoppingBag
} from 'lucide-react';
import db from '../../services/db';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(() => db.getCategories());
  const [products, setProducts] = useState(() => db.getProducts());
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    name: '',
    urduName: '',
    description: '',
    image: '/images/categories/sweets.jpg',
    badge: '',
    isActive: true
  });

  const syncData = () => {
    setCategories(db.getCategories());
    setProducts(db.getProducts());
  };

  useEffect(() => {
    const unsubscribe = db.subscribe(syncData);
    return unsubscribe;
  }, []);

  // Calculate product counts per category
  const productCountMap = React.useMemo(() => {
    const map = {};
    for (const p of products) {
      const c = p.category?.toLowerCase() || 'other';
      map[c] = (map[c] || 0) + 1;
    }
    return map;
  }, [products]);

  const handleToggleActive = (cat) => {
    const updated = db.toggleCategoryActive(cat.slug || cat.id);
    syncData();
    const isNowActive = updated?.isActive !== false;
    setNotification(
      isNowActive
        ? `Category "${cat.name}" is now Active and visible on the website.`
        : `Category "${cat.name}" is now Inactive (Hidden from customer view).`
    );
    setTimeout(() => setNotification(''), 3500);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      id: '',
      slug: '',
      name: '',
      urduName: '',
      description: '',
      image: '/images/categories/sweets.jpg',
      badge: 'New Collection',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      id: cat.id || cat.slug,
      slug: cat.slug || cat.id,
      name: cat.name || '',
      urduName: cat.urduName || '',
      description: cat.description || '',
      image: cat.image || '/images/categories/sweets.jpg',
      badge: cat.badge || '',
      isActive: cat.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const slug = formData.slug.trim() 
      ? formData.slug.trim().toLowerCase().replace(/\s+/g, '-')
      : formData.name.trim().toLowerCase().replace(/\s+/g, '-');

    const catPayload = {
      ...formData,
      id: editingCategory?.id || slug,
      slug: slug,
      isActive: formData.isActive
    };

    db.saveCategory(catPayload);
    syncData();
    setIsModalOpen(false);
    setNotification(`Category "${catPayload.name}" saved successfully.`);
    setTimeout(() => setNotification(''), 3500);
  };

  const filteredCategories = categories.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.urduName && c.urduName.includes(q)) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  const activeCount = categories.filter(c => c.isActive !== false).length;
  const inactiveCount = categories.filter(c => c.isActive === false).length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-[#07643D] text-xs font-bold rounded-2xl flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#07643D]" />
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">
              Categories Management
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Turn store categories On or Off, manage visibility, Urdu translations, and badges.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Categories</span>
            <div className="text-2xl font-bold font-mono text-gray-900 mt-1">{categories.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Active (Live in Store)</span>
            <div className="text-2xl font-bold font-mono text-[#07643D] mt-1">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#07643D] flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Inactive (Turned Off)</span>
            <div className="text-2xl font-bold font-mono text-amber-900 mt-1">{inactiveCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name, urdu or slug..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#07643D] focus:ring-2 focus:ring-[#07643D]/10 outline-none bg-white shadow-2xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-gray-400 font-mono hidden sm:inline">
          Showing {filteredCategories.length} categories
        </span>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#07643D] text-white font-semibold">
              <tr>
                <th className="py-3.5 px-4">Category Details</th>
                <th className="py-3.5 px-4">Slug Identifier</th>
                <th className="py-3.5 px-4 text-center">Products Count</th>
                <th className="py-3.5 px-4">Badge / Highlight</th>
                <th className="py-3.5 px-4 text-center">Status (On / Off)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((cat) => {
                const isActive = cat.isActive !== false;
                const pCount = productCountMap[cat.slug.toLowerCase()] || 0;

                return (
                  <tr key={cat.id || cat.slug} className={`transition-colors ${isActive ? 'hover:bg-gray-50' : 'bg-gray-50/60 opacity-80'}`}>
                    
                    {/* Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/categories/sweets.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900 text-sm">{cat.name}</span>
                            {!isActive && (
                              <span className="text-[9px] bg-gray-200 text-gray-600 font-bold px-1.5 py-0.2 rounded-full uppercase">
                                OFF
                              </span>
                            )}
                          </div>
                          {cat.urduName && (
                            <p className="text-xs text-amber-800 font-semibold urdu-text mt-0.5">
                              {cat.urduName}
                            </p>
                          )}
                          <p className="text-[11px] text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-gray-600">
                      <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px]">
                        /{cat.slug}
                      </span>
                    </td>

                    {/* Product count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono font-bold text-[11px] bg-emerald-50 text-[#07643D] border border-emerald-100">
                        <ShoppingBag className="w-3 h-3 text-[#07643D]" />
                        <span>{pCount} Products</span>
                      </span>
                    </td>

                    {/* Badge */}
                    <td className="py-3.5 px-4">
                      {cat.badge ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-amber-900 border border-[#D4AF37]/40">
                          {cat.badge}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-mono text-[10px]">None</span>
                      )}
                    </td>

                    {/* ACTIVE ON / OFF SWITCH */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? 'bg-[#07643D]' : 'bg-gray-300'
                          }`}
                          role="switch"
                          aria-checked={isActive}
                          title={isActive ? 'Click to Turn Off (Hide from store)' : 'Click to Turn On (Make live)'}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          isActive ? 'text-[#07643D]' : 'text-gray-400'
                        }`}>
                          {isActive ? 'Active (On)' : 'Inactive (Off)'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:text-[#07643D] hover:bg-emerald-50 transition-colors font-semibold text-xs cursor-pointer"
                        title="Edit Category Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 my-8">
            <div className="bg-[#07643D] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sweets, Cold Drinks..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#07643D]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Category Name (Urdu)
                </label>
                <input
                  type="text"
                  value={formData.urduName}
                  onChange={(e) => setFormData({ ...formData, urduName: e.target.value })}
                  placeholder="مثال: روایتی مٹھائیاں، کولڈ ڈرنکس..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#07643D] text-right font-serif"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Slug (URL Path)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. cold-drinks"
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#07643D] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Badge Text (Optional)
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Special Offer, Baked Daily..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#07643D]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/categories/sweets.jpg"
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#07643D] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of items in this category..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#07643D]"
                />
              </div>

              {/* Status Active Toggle in Form */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-800 block">Category Status</span>
                  <span className="text-[11px] text-gray-400">Enable or disable category visibility in the store</span>
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

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#07643D] hover:bg-[#043E26] text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}