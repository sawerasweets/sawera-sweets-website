import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CustomerAddressesPage() {
  const { user, updateProfile } = useAuth();
  const { isUrdu } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jhang');

  const addresses = user?.addresses || [];

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!address.trim()) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      label,
      recipientName,
      phone,
      address,
      city,
      isDefault: addresses.length === 0
    };

    updateProfile({
      addresses: [...addresses, newAddr]
    });

    setShowAddForm(false);
    setAddress('');
  };

  const handleDeleteAddress = (id) => {
    updateProfile({
      addresses: addresses.filter(a => a.id !== id)
    });
  };

  const handleSetDefault = (id) => {
    updateProfile({
      addresses: addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
            <Link to="/account" className="hover:text-[#07643D]">My Account</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Saved Addresses</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Delivery Addresses</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage delivery locations for fast 1-click checkout.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* New Address Form Modal/Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-2xl border border-[#07643D]/30 shadow-md mb-6 space-y-4 text-xs animate-in fade-in">
          <h3 className="text-sm font-bold text-gray-900">Add New Delivery Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Address Label</label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 outline-none"
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Shop / Business">Shop / Business</option>
                <option value="Family Relative">Family Relative</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Recipient Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Complete Street Address / House / Area</label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. House #24, Street 5, Near DHQ Hospital, Gojra Road..."
              className="w-full p-2 rounded-lg border border-gray-300 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg border text-gray-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#07643D] text-white font-semibold hover:bg-[#043E26]"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {/* Address Cards List */}
      {addresses.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 text-xs text-gray-500">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="font-semibold text-gray-700">No saved addresses found.</p>
          <p className="mt-1">Add your home or office address for fast delivery checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                addr.isDefault
                  ? 'border-[#07643D] bg-emerald-50/40 shadow-sm ring-1 ring-[#07643D]/20'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    {addr.label === 'Home' ? <Home className="w-4 h-4 text-[#07643D]" /> : <Briefcase className="w-4 h-4 text-amber-700" />}
                    <span>{addr.label}</span>
                  </div>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Default
                    </span>
                  )}
                </div>

                <p className="font-bold text-gray-800">{addr.recipientName}</p>
                <p className="text-gray-500 font-mono mt-0.5">{addr.phone}</p>
                <p className="text-gray-700 mt-2 leading-relaxed">{addr.address}, {addr.city}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[11px] text-[#07643D] font-semibold hover:underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[11px] text-gray-400">Primary delivery address</span>
                )}
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
