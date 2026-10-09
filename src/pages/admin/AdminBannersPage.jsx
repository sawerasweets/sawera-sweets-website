import React, { useState } from 'react';
import { Image, Plus, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';
import db from '../../services/db';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState(() => db.get('banners'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [title, setTitle] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subtitleUrdu, setSubtitleUrdu] = useState('');
  const [category, setCategory] = useState('sweets');
  const [link, setLink] = useState('/category/sweets');
  const [buttonText, setButtonText] = useState('Order Now');

  const syncBanners = () => {
    setBanners(db.get('banners'));
  };

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setTitleUrdu('');
    setSubtitle('');
    setSubtitleUrdu('');
    setCategory('sweets');
    setLink('/category/sweets');
    setButtonText('Order Fresh Mithai');
    setIsModalOpen(true);
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (editingBanner) {
      const updated = banners.map(b => b.id === editingBanner.id ? {
        ...b,
        title,
        titleUrdu,
        subtitle,
        subtitleUrdu,
        category,
        link,
        buttonText
      } : b);
      db.set('banners', updated);
    } else {
      const newBanner = {
        id: `ban-${Date.now()}`,
        title,
        titleUrdu,
        subtitle,
        subtitleUrdu,
        category,
        link,
        buttonText,
        badge: 'Special Announcement',
        bgColor: 'from-emerald-900 to-teal-950',
        active: true
      };
      db.set('banners', [...banners, newBanner]);
    }
    setIsModalOpen(false);
    syncBanners();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this banner?')) {
      const filtered = banners.filter(b => b.id !== id);
      db.set('banners', filtered);
      syncBanners();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Homepage Banners &amp; Offers</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage carousel slides, discount promotions, and seasonal sweet announcements.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      <div className="space-y-4 text-xs">
        {banners.map((b) => (
          <div key={b.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                {b.badge || 'Banner Slide'}
              </span>
              <h3 className="text-sm font-bold text-gray-900 mt-1">{b.title}</h3>
              {b.titleUrdu && (
                <p className="text-xs text-amber-800 font-semibold urdu-text">{b.titleUrdu}</p>
              )}
              <p className="text-gray-500 text-[11px]">{b.subtitle}</p>
              <p className="text-gray-400 text-[10px]">Target: {b.link} • Button: "{b.buttonText}"</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(b.id)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl text-xs space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm text-gray-900">Add Homepage Banner Slide</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Banner Title (English)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Banner Title (Urdu)</label>
                <input
                  type="text"
                  value={titleUrdu}
                  onChange={(e) => setTitleUrdu(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none urdu-text"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Destination URL / Route</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/category/sweets"
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#07643D] text-white rounded-xl font-bold hover:bg-[#043E26]"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
