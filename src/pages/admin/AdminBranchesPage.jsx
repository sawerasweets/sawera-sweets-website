import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Edit3, 
  Archive, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Store,
  X
} from 'lucide-react';
import db from '../../services/db';

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState(() => db.getBranches());
  const [editingBranch, setEditingBranch] = useState(null);

  const syncBranches = () => {
    setBranches(db.getBranches());
  };

  const handleToggleStatus = (id, currentStatus) => {
    db.updateBranch(id, { isOpen: !currentStatus });
    syncBranches();
  };

  const handleToggleDelivery = (id, current) => {
    db.updateBranch(id, { deliveryEnabled: !current });
    syncBranches();
  };

  const handleTogglePickup = (id, current) => {
    db.updateBranch(id, { pickupEnabled: !current });
    syncBranches();
  };

  const handleArchiveToggle = (id, isArchived) => {
    db.updateBranch(id, { isArchived: !isArchived });
    syncBranches();
  };

  const handleSaveBranch = (e) => {
    e.preventDefault();
    db.updateBranch(editingBranch.id, editingBranch);
    setEditingBranch(null);
    syncBranches();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Store Information &amp; Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage official store address, contact phone numbers, daily operating hours, and fulfillment services.
        </p>
      </div>

      {/* Store Card */}
      <div className="max-w-2xl">
        {branches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-[#07643D] ring-2 ring-[#07643D]/10 p-6 shadow-sm flex flex-col justify-between transition-all"
          >
            <div>
              {/* Branch Header */}
              <div className="flex items-start justify-between pb-3 mb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
                    b.isMain ? 'bg-emerald-100 text-[#07643D]' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-gray-900">{b.name}</h2>
                      {b.isMain && (
                        <span className="text-[10px] bg-[#D4AF37] text-[#07643D] font-bold px-2 py-0.2 rounded-full uppercase">
                          Head Office
                        </span>
                      )}
                    </div>
                    {b.nameUrdu && (
                      <p className="text-xs text-amber-800 font-semibold urdu-text">{b.nameUrdu}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setEditingBranch(b)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#07643D] hover:bg-emerald-50 transition-colors"
                  title="Edit Branch Information"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Branch Details */}
              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800">{b.address}</p>
                    {b.addressUrdu && (
                      <p className="text-[11px] text-gray-500 urdu-text">{b.addressUrdu}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span className="font-medium text-gray-700">{b.timings}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#07643D] flex-shrink-0" />
                  <span>Call: <span className="font-mono font-bold text-gray-800">{b.phone}</span> • WhatsApp: <span className="font-mono font-bold text-[#07643D]">{b.whatsapp}</span></span>
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-gray-50 p-3 rounded-2xl space-y-2 text-xs border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Operating Status:</span>
                  <button
                    onClick={() => handleToggleStatus(b.id, b.isOpen)}
                    className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase transition-colors ${
                      b.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {b.isOpen ? 'Open for Orders' : 'Temporarily Closed'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-gray-500" />
                    <span>Home Delivery:</span>
                  </span>
                  <button
                    onClick={() => handleToggleDelivery(b.id, b.deliveryEnabled)}
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      b.deliveryEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {b.deliveryEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-gray-500" />
                    <span>Customer Pickup:</span>
                  </span>
                  <button
                    onClick={() => handleTogglePickup(b.id, b.pickupEnabled)}
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      b.pickupEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {b.pickupEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>

            {/* Archive / Restore Button */}
            {!b.isMain && (
              <div className="pt-3 border-t border-gray-100 mt-4 flex justify-end">
                <button
                  onClick={() => handleArchiveToggle(b.id, b.isArchived)}
                  className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1"
                >
                  {b.isArchived ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Branch</span>
                    </>
                  ) : (
                    <>
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive Branch</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Branch Modal */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl text-xs space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-sm font-bold text-gray-900">Edit Branch Details ({editingBranch.name})</h3>
              <button onClick={() => setEditingBranch(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-3.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  value={editingBranch.name}
                  onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Branch Name (Urdu)</label>
                <input
                  type="text"
                  value={editingBranch.nameUrdu || ''}
                  onChange={(e) => setEditingBranch({ ...editingBranch, nameUrdu: e.target.value })}
                  className="w-full p-2 border rounded-xl outline-none urdu-text"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.whatsapp}
                    onChange={(e) => setEditingBranch({ ...editingBranch, whatsapp: e.target.value })}
                    className="w-full p-2 border rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.phone}
                    onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                    className="w-full p-2 border rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Operating Hours</label>
                <input
                  type="text"
                  required
                  value={editingBranch.timings}
                  onChange={(e) => setEditingBranch({ ...editingBranch, timings: e.target.value })}
                  placeholder="e.g. 5:30 AM - 12:00 AM"
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#07643D] text-white rounded-xl font-bold hover:bg-[#043E26]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
