import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, ArrowRight, XCircle, Search, ExternalLink, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import db from '../../services/db';
import InvoiceModal from '../../components/customer/InvoiceModal';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const { isUrdu } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const allOrders = db.getOrders().filter(o => o.customer?.email === user?.email);

  const filteredOrders = allOrders.filter(order => {
    if (filter === 'active' && (order.status === 'delivered' || order.status === 'cancelled')) return false;
    if (filter === 'delivered' && order.status !== 'delivered') return false;
    if (filter === 'cancelled' && order.status !== 'cancelled') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchItem = order.items?.some(i => i.name.toLowerCase().includes(q));
      if (!matchId && !matchItem) return false;
    }
    return true;
  });

  const handleCancelOrder = (orderId) => {
    db.updateOrderStatus(orderId, 'cancelled', {
      cancellationReason: cancelReason || 'Customer requested cancellation prior to kitchen preparation.'
    });
    setCancellingOrderId(null);
    setCancelReason('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
          <Link to="/account" className="hover:text-[#07643D]">My Account</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Orders</span>
        </div>
        <h1 className="text-2xl font-bold font-serif text-gray-900">Order History &amp; Tracking</h1>
        <p className="text-xs text-gray-500 mt-1">Review your past orders, download official invoices, and check live delivery status.</p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['all', 'active', 'delivered', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider text-[11px] transition-colors whitespace-nowrap ${
                filter === tab
                  ? 'bg-[#07643D] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or item..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full border border-gray-300 text-xs focus:border-[#07643D] outline-none"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-xs text-gray-500">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-700 text-sm">No orders found.</p>
          <p className="mt-1">Try changing your filters or browse our fresh sweet collection.</p>
          <Link to="/products" className="inline-block mt-4 px-5 py-2 rounded-xl bg-[#07643D] text-white font-bold">
            Explore Sweets &amp; Bakery
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const canCancel = order.status === 'placed' || order.status === 'confirmed';

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow transition-shadow">
                
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-gray-100 gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-gray-900 text-sm">{order.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5 text-gray-500" />
                      <span>Invoice</span>
                    </button>
                    <Link
                      to={`/track-order?orderId=${order.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#07643D] text-white hover:bg-[#043E26] font-semibold"
                    >
                      <span>Live Track</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Items & Fulfillment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-2 space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 bg-gray-50/60 px-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{item.name}</span>
                          <span className="text-[11px] text-gray-500">({item.selectedVariation || item.unit})</span>
                          <span className="font-bold text-gray-700">× {item.quantity}</span>
                        </div>
                        <span className="font-mono font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    {order.specialNotes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                        <span className="font-bold">Order Note:</span> {order.specialNotes}
                      </p>
                    )}
                  </div>

                  <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-amber-100 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-gray-800">
                        {order.fulfillmentType === 'delivery' ? 'Home Delivery' : 'Shop Pickup'}
                      </p>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Store: <span className="font-semibold text-emerald-800">{order.assignedBranchName || 'Sawera Sweets & Bakers (Main Store)'}</span>
                      </p>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Payment: <span className="uppercase font-semibold">{order.paymentMethod}</span> ({order.paymentStatus})
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-200/60 mt-3 flex items-center justify-between">
                      <span className="font-bold text-gray-700">Total:</span>
                      <span className="text-base font-bold font-mono text-[#07643D]">
                        Rs. {order.total?.toLocaleString()}
                      </span>
                    </div>

                    {/* Cancellation Trigger */}
                    {canCancel && (
                      <button
                        onClick={() => setCancellingOrderId(order.id)}
                        className="mt-3 text-[11px] text-red-600 hover:text-red-800 font-semibold text-center hover:underline"
                      >
                        Cancel this order
                      </button>
                    )}
                  </div>
                </div>

                {/* Cancel confirmation dialog inline */}
                {cancellingOrderId === order.id && (
                  <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-200 text-xs">
                    <p className="font-bold text-red-900 mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Are you sure you want to cancel Order #{order.id}?</span>
                    </p>
                    <p className="text-gray-600 text-[11px] mb-2">
                      Orders can only be cancelled before kitchen preparation begins.
                    </p>
                    <input
                      type="text"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Reason for cancellation (optional)..."
                      className="w-full p-2 rounded-lg border border-red-200 text-xs bg-white mb-2 outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setCancellingOrderId(null)}
                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold"
                      >
                        Keep Order
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
}
