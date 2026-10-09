import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bike, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import db from '../../services/db';

export default function RiderDashboard() {
  const { user, logout, isRider, isAdmin } = useAuth();
  const { isUrdu } = useLanguage();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  if (!user || (!isRider && !isAdmin)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-red-200 text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">Rider Access Restricted</h2>
          <p className="text-xs text-gray-500">You must be logged in as a registered Delivery Rider to access this portal.</p>
          <Link to="/login" className="inline-block mt-3 px-5 py-2 bg-[#07643D] text-white rounded-xl text-xs font-bold">
            Rider Login
          </Link>
        </div>
      </div>
    );
  }

  // Branch assigned to rider
  const riderBranch = user?.assignedBranch || 'shop-1';
  const orders = db.getOrders().filter(o => 
    (o.assignedBranch === riderBranch || isAdmin) &&
    o.fulfillmentType === 'delivery'
  );

  const completedOrders = orders.filter(o => o.status === 'delivered');
  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const commissionRate = user?.commissionRate || 80;
  const totalEarnedCommission = completedOrders.length * commissionRate;

  const handleUpdateStatus = (orderId, newStatus) => {
    db.updateOrderStatus(orderId, newStatus, {
      riderId: user.id,
      riderName: user.name
    });
  };

  const filteredList = filter === 'active' ? activeOrders : filter === 'completed' ? completedOrders : orders;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Rider Profile Bar */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white rounded-3xl p-5 shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#07643D] flex items-center justify-center font-bold text-lg border-2 border-white">
              <Bike className="w-6 h-6 text-[#07643D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">{user.name}</h1>
                <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded-full uppercase">
                  Delivery Rider
                </span>
              </div>
              <p className="text-xs text-amber-200 mt-0.5">
                Assigned: Sawera Main Store (Gojra Road Jhang) • Vehicle: {user.vehicle || 'Motorbike'}
              </p>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/10 text-center">
          <div>
            <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">Active Deliveries</p>
            <p className="text-xl font-bold font-mono mt-0.5">{activeOrders.length}</p>
          </div>
          <div>
            <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">Completed</p>
            <p className="text-xl font-bold font-mono mt-0.5">{completedOrders.length}</p>
          </div>
          <div>
            <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">Earnings (Rs)</p>
            <p className="text-xl font-bold font-mono mt-0.5 text-[#F4D375]">Rs. {totalEarnedCommission}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 text-xs font-bold">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            filter === 'all' ? 'bg-[#07643D] text-white shadow' : 'bg-white border text-gray-600'
          }`}
        >
          All Deliveries ({orders.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            filter === 'active' ? 'bg-[#07643D] text-white shadow' : 'bg-white border text-gray-600'
          }`}
        >
          Pending / On Way ({activeOrders.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            filter === 'completed' ? 'bg-[#07643D] text-white shadow' : 'bg-white border text-gray-600'
          }`}
        >
          Delivered ({completedOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 text-xs text-gray-500">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No deliveries in this section.</p>
          </div>
        ) : (
          filteredList.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-xs">
              
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-900 text-sm">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                    order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="font-mono font-bold text-sm text-[#07643D]">
                  Rs. {order.total?.toLocaleString()} ({order.paymentMethod?.toUpperCase()})
                </span>
              </div>

              {/* Customer Delivery Info */}
              <div className="bg-gray-50 p-3 rounded-xl mb-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-xs">{order.customer?.name}</p>
                  <a
                    href={`tel:${order.customer?.phone}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shadow-sm hover:bg-emerald-700"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Customer</span>
                  </a>
                </div>
                <div className="flex items-start gap-1.5 text-gray-600 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{order.customer?.address}</span>
                </div>
              </div>

              {/* Order Items Snapshot */}
              <div className="text-[11px] text-gray-500 mb-3">
                <span className="font-semibold text-gray-700">Items: </span>
                {order.items?.map(i => `${i.name} (${i.selectedVariation || i.unit}) × ${i.quantity}`).join(', ')}
              </div>

              {/* Action Buttons Pipeline */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                {order.status !== 'out_for_delivery' && order.status !== 'delivered' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                    className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    📦 Picked Up &amp; On The Way
                  </button>
                )}

                {order.status === 'out_for_delivery' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                    className="flex-1 py-2 rounded-xl bg-[#07643D] text-white font-bold text-xs hover:bg-[#043E26] transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Delivered to Customer</span>
                  </button>
                )}

                {order.status === 'delivered' && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Delivered (+Rs. {commissionRate} commission recorded)</span>
                  </span>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
