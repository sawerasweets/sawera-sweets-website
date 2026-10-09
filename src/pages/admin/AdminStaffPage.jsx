import React, { useState } from 'react';
import { UserCheck, Plus, Shield, Check, X, Building2, Calendar, AlertCircle } from 'lucide-react';
import db from '../../services/db';

const ALL_PERMISSIONS = [
  { key: 'view_orders', label: 'View Branch Orders' },
  { key: 'manage_orders', label: 'Update Order Status & Dispatch' },
  { key: 'view_products', label: 'View Products Catalog' },
  { key: 'manage_stock', label: 'Submit Stock Adjustment Requests' },
  { key: 'view_customers', label: 'View Customer Phone & Addresses' },
  { key: 'manage_reviews', label: 'Review Customer Feedback & Q&A' }
];

export default function AdminStaffPage() {
  const [users, setUsers] = useState(() => db.get('users'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const branches = db.getBranches();
  const staffList = users.filter(u => u.role === 'staff');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [assignedBranch, setAssignedBranch] = useState('shop-1');
  const [selectedPermissions, setSelectedPermissions] = useState(['view_orders', 'manage_orders', 'manage_stock']);
  const [expiresAt, setExpiresAt] = useState('');

  const syncUsers = () => {
    setUsers(db.get('users'));
  };

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('staff123');
    setAssignedBranch('shop-1');
    setSelectedPermissions(['view_orders', 'manage_orders', 'manage_stock']);
    setExpiresAt('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (staff) => {
    setEditingStaff(staff);
    setName(staff.name);
    setEmail(staff.email);
    setPhone(staff.phone || '');
    setPassword(staff.password || '');
    setAssignedBranch(staff.assignedBranch || 'shop-1');
    setSelectedPermissions(staff.permissions || []);
    setExpiresAt(staff.expiresAt ? staff.expiresAt.slice(0, 10) : '');
    setIsModalOpen(true);
  };

  const handlePermissionToggle = (key) => {
    setSelectedPermissions(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (editingStaff) {
      const updated = users.map(u => {
        if (u.id === editingStaff.id) {
          return {
            ...u,
            name,
            phone,
            assignedBranch,
            permissions: selectedPermissions,
            expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
          };
        }
        return u;
      });
      db.set('users', updated);
    } else {
      const newStaff = {
        id: `usr-staff-${Date.now()}`,
        name,
        email: email.trim().toLowerCase(),
        phone,
        password,
        role: 'staff',
        assignedBranch,
        permissions: selectedPermissions,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      db.set('users', [...users, newStaff]);
    }

    setIsModalOpen(false);
    syncUsers();
  };

  const handleToggleActive = (id, currentActive) => {
    const updated = users.map(u => u.id === id ? { ...u, isActive: !currentActive } : u);
    db.set('users', updated);
    syncUsers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Staff Accounts &amp; Permissions Matrix</h1>
          <p className="text-xs text-gray-500 mt-0.5">Configure branch access, granular feature permissions, and account expiry dates.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {staffList.map((s) => {
          const branch = branches.find(b => b.id === s.assignedBranch);
          const isExpired = s.expiresAt && new Date() > new Date(s.expiresAt);

          return (
            <div key={s.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#07643D] flex items-center justify-center font-bold text-sm">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                      <p className="text-[11px] text-gray-400">{s.email}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    isExpired ? 'bg-red-100 text-red-800' :
                    s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isExpired ? 'Access Expired' : s.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#07643D]" />
                    <span className="font-semibold text-gray-800">Assigned Branch: {branch?.name || s.assignedBranch}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>
                      Expiry: {s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : 'Permanent (No expiry)'}
                    </span>
                  </div>
                </div>

                {/* Permissions Badges */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="font-bold text-gray-700 text-[11px] mb-1.5">Assigned Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {s.permissions?.map((pKey) => {
                      const match = ALL_PERMISSIONS.find(ap => ap.key === pKey);
                      return (
                        <span key={pKey} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-medium">
                          ✓ {match?.label || pKey}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                <button
                  onClick={() => handleToggleActive(s.id, s.isActive)}
                  className={`text-[11px] font-semibold hover:underline ${
                    s.isActive ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {s.isActive ? 'Disable Account' : 'Enable Account'}
                </button>

                <button
                  onClick={() => handleOpenEdit(s)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Edit Permissions
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl text-xs space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-sm font-bold text-gray-900">
                {editingStaff ? `Edit Permissions for ${editingStaff.name}` : 'Create New Staff Member Account'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Staff Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    disabled={Boolean(editingStaff)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-xl outline-none disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assigned Store</label>
                  <input
                    type="text"
                    disabled
                    value="Sawera Sweets & Bakers (Main Store)"
                    className="w-full p-2 border rounded-xl outline-none bg-gray-100 font-semibold text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">Leaves empty for permanent access.</p>
              </div>

              {/* Permissions Checkbox Matrix */}
              <div>
                <label className="block font-bold text-gray-700 mb-2">Permissions Matrix</label>
                <div className="space-y-1.5 border p-3 rounded-2xl bg-gray-50">
                  {ALL_PERMISSIONS.map((perm) => (
                    <label key={perm.key} className="flex items-center gap-2 cursor-pointer py-0.5">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.key)}
                        onChange={() => handlePermissionToggle(perm.key)}
                        className="rounded text-[#07643D]"
                      />
                      <span className="font-semibold text-gray-800">{perm.label}</span>
                    </label>
                  ))}
                </div>
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
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
