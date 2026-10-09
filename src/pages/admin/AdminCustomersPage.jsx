import React, { useState } from 'react';
import { Users, Search, Download, Award, ShieldCheck, ShieldAlert, Edit2 } from 'lucide-react';
import db from '../../services/db';
import { exportToCSV } from '../../services/exportUtils';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState(() => db.get('users'));
  const [search, setSearch] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newPoints, setNewPoints] = useState(0);

  const customers = users.filter(u => u.role === 'customer');

  const syncUsers = () => {
    setUsers(db.get('users'));
  };

  const handleToggleStatus = (id, currentActive) => {
    const updated = users.map(u => u.id === id ? { ...u, isActive: !currentActive } : u);
    db.set('users', updated);
    syncUsers();
  };

  const handleSavePoints = (e) => {
    e.preventDefault();
    const updated = users.map(u => u.id === editingCustomer.id ? { ...u, loyaltyPoints: Number(newPoints) } : u);
    db.set('users', updated);
    setEditingCustomer(null);
    syncUsers();
  };

  const handleExportCSV = () => {
    const exportData = customers.map(c => ({
      ID: c.id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      LoyaltyPoints: c.loyaltyPoints || 0,
      Status: c.isActive ? 'Active' : 'Deactivated',
      Joined: new Date(c.createdAt).toLocaleDateString()
    }));
    exportToCSV(exportData, `sawera-customers-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const filteredCustomers = customers.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Customer Directory &amp; Loyalty Rewards</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage registered buyers, reward points balances, and customer accounts.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" />
          <span>Export Customer CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            className="w-full pl-8 pr-3 py-2 rounded-full border border-gray-300 text-xs outline-none focus:border-[#07643D]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
        <span className="text-gray-500 font-semibold">{filteredCustomers.length} registered customers</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#07643D] text-white font-semibold">
              <tr>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4 text-center">Loyalty Points</th>
                <th className="py-3 px-4 text-center">Saved Addresses</th>
                <th className="py-3 px-4 text-center">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <p className="text-[11px] text-gray-400">{c.email}</p>
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-gray-700">
                    {c.phone}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-100 text-amber-900 text-[11px]">
                      <Award className="w-3 h-3 text-[#D4AF37]" />
                      <span>{c.loyaltyPoints || 0} Pts</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-gray-600">
                    {c.addresses?.length || 0} locations
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(c.id, c.isActive)}
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingCustomer(c);
                        setNewPoints(c.loyaltyPoints || 0);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Points</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Points Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Adjust Loyalty Points for {editingCustomer.name}</h3>
            <form onSubmit={handleSavePoints} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Points Balance</label>
                <input
                  type="number"
                  required
                  value={newPoints}
                  onChange={(e) => setNewPoints(e.target.value)}
                  className="w-full p-2 border rounded-xl font-mono text-base outline-none"
                />
                <p className="text-[10px] text-gray-500 mt-1">1 Point = Rs. 1 discount voucher value.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#07643D] text-white rounded-xl font-bold"
                >
                  Save Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
