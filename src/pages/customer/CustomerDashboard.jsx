import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Award, 
  Clock, 
  ChevronRight, 
  MessageSquare,
  FileText,
  Edit3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import db from '../../services/db';
import InvoiceModal from '../../components/customer/InvoiceModal';

export default function CustomerDashboard() {
  const { user, updateProfile } = useAuth();
  const { isUrdu } = useLanguage();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#07643D] flex items-center justify-center mx-auto border border-emerald-100">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 font-serif">Customer Login Required</h2>
          <p className="text-xs text-gray-500">
            Please sign in to view your orders, reward points, and saved delivery addresses.
          </p>
          <Link
            to="/login"
            className="inline-block mt-3 px-6 py-2.5 bg-[#07643D] text-white rounded-xl text-xs font-bold hover:bg-[#043E26] shadow-sm transition-colors"
          >
            Sign In / Register
          </Link>
        </div>
      </div>
    );
  }

  const orders = db.getOrders().filter(o => o.customer?.email === user?.email);
  const tickets = db.get('tickets').filter(t => t.customerEmail === user?.email);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name: editName, phone: editPhone });
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#07643D] to-[#043E26] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#07643D] flex items-center justify-center font-bold text-2xl shadow-inner border-2 border-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif">{user?.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-emerald-100">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-1">{user?.email} • {user?.phone}</p>
            </div>
          </div>

          {/* Loyalty Points Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right min-w-[180px]">
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-[#F4D375] font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Sawera Rewards</span>
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              {user?.loyaltyPoints || 0} <span className="text-xs font-normal">Pts</span>
            </p>
            <p className="text-[10px] text-emerald-200 mt-0.5">Worth Rs. {user?.loyaltyPoints || 0} in discounts</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Link
          to="/account/orders"
          className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#07643D] hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#07643D] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">My Orders</p>
            <p className="text-base font-bold text-gray-900">{orders.length}</p>
          </div>
        </Link>

        <Link
          to="/account/addresses"
          className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#07643D] hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Addresses</p>
            <p className="text-base font-bold text-gray-900">{user?.addresses?.length || 0}</p>
          </div>
        </Link>

        <Link
          to="/account/wishlist"
          className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#07643D] hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Saved Items</p>
            <p className="text-base font-bold text-gray-900">Wishlist</p>
          </div>
        </Link>

        <Link
          to="/account/tickets"
          className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#07643D] hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Support</p>
            <p className="text-base font-bold text-gray-900">{tickets.length} Tickets</p>
          </div>
        </Link>
      </div>

      {/* Main Content: Recent Orders */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#07643D]" />
            <span>Recent Orders</span>
          </h2>
          <Link to="/account/orders" className="text-xs font-semibold text-[#07643D] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-500">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="inline-block mt-3 px-4 py-2 rounded-xl bg-[#07643D] text-white font-semibold">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1">
                    {order.items?.length} items • Total: <span className="font-bold text-[#07643D]">Rs. {order.total?.toLocaleString()}</span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Store: {order.assignedBranchName || 'Sawera Sweets & Bakers (Main Store)'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span>Invoice</span>
                  </button>
                  <Link
                    to={`/track-order?orderId=${order.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#07643D] text-white hover:bg-[#043E26] font-semibold"
                  >
                    <span>Track</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
}
