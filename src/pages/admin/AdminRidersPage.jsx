import React, { useState } from 'react';
import { Bike, Plus, Phone, DollarSign, CheckCircle2, X } from 'lucide-react';
import db from '../../services/db';

export default function AdminRidersPage() {
  const [users, setUsers] = useState(() => db.get('users'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState(null);

  const branches = db.getBranches();
  const orders = db.getOrders();
  const riders = users.filter(u => u.role === 'rider');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('Motorbike');
  const [commissionRate, setCommissionRate] = useState(80);
  const [assignedBranch, setAssignedBranch] = useState('shop-1');

  const syncUsers = () => {
    setUsers(db.get('users'));
  };

  const handleOpenAdd = () => {
    setEditingRider(null);
    setName('');
    setEmail('');
    setPhone('');
    setVehicle('Honda 125');
    setCommissionRate(80);
    setAssignedBranch('shop-1');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRider(r);
    setName(r.name);
    setEmail(r.email);
    setPhone(r.phone || '');
    setVehicle(r.vehicle || 'Motorbike');
    setCommissionRate(r.commissionRate || 80);
    setAssignedBranch(r.assignedBranch || 'shop-1');
    setIsModalOpen(true);
  };

  const handleSaveRider = (e) => {
    e.preventDefault();
    if (editingRider) {
      const updated = users.map(u => {
        if (u.id === editingRider.id) {
          return {
            ...u,
            name,
            phone,
            vehicle,
            commissionRate: Number(commissionRate),
            assignedBranch
          };
        }
        return u;
      });
      db.set('users', updated);
    } else {
      const newRider = {
        id: `usr-rider-${Date.now()}`,
        name,
        email: email.trim().toLowerCase(),
        phone,
        password: 'rider123',
        role: 'rider',
        vehicle,
        commissionRate: Number(commissionRate),
        assignedBranch,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      db.set('users', [...users, newRider]);
    }

    setIsModalOpen(false);
    syncUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Delivery Riders &amp; Commission Tracking</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage delivery personnel, assigned dispatch branches, and per-delivery commissions.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Rider</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {riders.map((r) => {
          const completedDeliveries = orders.filter(o => o.riderId === r.id && o.status === 'delivered');
          const totalEarnings = completedDeliveries.length * (r.commissionRate || 80);
          const branch = branches.find(b => b.id === r.assignedBranch);

          return (
            <div key={r.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                      <Bike className="w-5 h-5 text-amber-800" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{r.phone}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase bg-emerald-100 text-emerald-800">
                    Active Rider
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-gray-600">
                  <p>Branch: <span className="font-semibold text-gray-800">{branch?.name || r.assignedBranch}</span></p>
                  <p>Vehicle: <span className="font-semibold text-gray-800">{r.vehicle}</span></p>
                  <p>Commission Rate: <span className="font-mono font-bold text-[#07643D]">Rs. {r.commissionRate || 80}</span> per delivery</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-[#FDFBF7] rounded-2xl border border-amber-100 text-center">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Delivered</span>
                    <p className="text-base font-bold font-mono text-gray-900">{completedDeliveries.length}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Total Earned</span>
                    <p className="text-base font-bold font-mono text-[#07643D]">Rs. {totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-gray-100 mt-4">
                <button
                  onClick={() => handleOpenEdit(r)}
                  className="px-3.5 py-1.5 rounded-lg border font-semibold hover:bg-gray-50"
                >
                  Edit Rider Info
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl text-xs space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm text-gray-900">
                {editingRider ? 'Edit Rider' : 'Add New Delivery Rider'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRider} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Rider Name</label>
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
                  disabled={Boolean(editingRider)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Vehicle Description</label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="Honda 125"
                    className="w-full p-2 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Commission (Rs)</label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full p-2 border rounded-xl outline-none font-mono"
                  />
                </div>
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
                  Save Rider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
