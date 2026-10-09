import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Download, 
  FileText, 
  CheckCircle2, 
  Eye, 
  Bike, 
  Building2, 
  Clock, 
  AlertCircle,
  X
} from 'lucide-react';
import db from '../../services/db';
import { exportToCSV } from '../../services/exportUtils';
import InvoiceModal from '../../components/customer/InvoiceModal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(() => db.getOrders());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');
  
  // Modals
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [proofModalOrder, setProofModalOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);

  const branches = db.getBranches();
  const riders = db.get('users').filter(u => u.role === 'rider');

  const syncOrders = () => {
    setOrders(db.getOrders());
  };

  const handleStatusChange = (orderId, newStatus) => {
    db.updateOrderStatus(orderId, newStatus);
    syncOrders();
  };

  const handleAssignRider = (orderId, riderId) => {
    const rider = riders.find(r => r.id === riderId);
    db.updateOrderStatus(orderId, 'out_for_delivery', {
      riderId,
      riderName: rider?.name || 'Assigned Rider'
    });
    syncOrders();
  };

  const handleExportCSV = () => {
    const exportData = orders.map(o => ({
      OrderID: o.id,
      Date: new Date(o.createdAt).toLocaleDateString(),
      Customer: o.customer?.name,
      Phone: o.customer?.phone,
      Address: o.customer?.address,
      Branch: o.assignedBranchName,
      Fulfillment: o.fulfillmentType,
      PaymentMethod: o.paymentMethod,
      PaymentStatus: o.paymentStatus,
      TotalAmount: o.total,
      Status: o.status
    }));
    exportToCSV(exportData, `sawera-orders-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const filteredOrders = orders.filter(o => {
    if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCust = o.customer?.name?.toLowerCase().includes(q);
      const matchPhone = o.customer?.phone?.includes(q);
      if (!matchId && !matchCust && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Orders &amp; Store Fulfillment</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage pipeline, assign delivery riders, and verify mobile payment proofs.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1.5 border rounded-lg bg-gray-50 font-bold outline-none text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="placed">Order Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, name, or phone..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full border border-gray-300 text-xs outline-none focus:border-[#07643D]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#07643D] text-white font-semibold">
              <tr>
                <th className="py-3 px-4">Order ID &amp; Date</th>
                <th className="py-3 px-4">Customer &amp; Address</th>
                <th className="py-3 px-4">Fulfillment / Branch</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total (PKR)</th>
                <th className="py-3 px-4">Status Pipeline</th>
                <th className="py-3 px-4">Rider</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="font-bold text-gray-700">No orders recorded yet</p>
                    <p className="text-[11px] text-gray-400">All customer orders placed online will appear here in real-time.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-gray-900 block">{o.id}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-900">{o.customer?.name}</p>
                    <p className="text-[11px] text-gray-500 font-mono">{o.customer?.phone}</p>
                    <p className="text-[10px] text-gray-400 line-clamp-1 max-w-xs">{o.customer?.address}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-emerald-800 capitalize block">
                      {o.fulfillmentType === 'delivery' 
                        ? (o.deliveryArea === 'outside' ? 'Out City Courier' : 'Jhang City Delivery') 
                        : 'Shop Pickup'}
                    </span>
                    <span className="text-[10px] text-gray-500">{o.assignedBranchName}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="uppercase font-bold text-gray-800 text-[11px]">{o.paymentMethod}</span>
                      {o.paymentProofUrl && (
                        <button
                          onClick={() => setProofModalOrder(o)}
                          className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-bold hover:bg-blue-200"
                        >
                          View Receipt
                        </button>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold ${
                      o.paymentStatus === 'verified' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-sm text-gray-900">
                    Rs. {o.total?.toLocaleString()}
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`font-bold text-[11px] p-1 rounded-lg border outline-none ${
                        o.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        o.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-300' :
                        'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="placed">Order Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    {o.fulfillmentType === 'delivery' ? (
                      <select
                        value={o.riderId || ''}
                        onChange={(e) => handleAssignRider(o.id, e.target.value)}
                        className="p-1 border rounded-lg bg-gray-50 text-[11px] outline-none"
                      >
                        <option value="">Select Rider</option>
                        {riders.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[10px] text-gray-400">Shop Pickup</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setDetailOrder(o)}
                        className="p-1.5 text-gray-500 hover:text-emerald-800 hover:bg-gray-100 rounded-lg"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setInvoiceOrder(o)}
                        className="p-1.5 text-gray-500 hover:text-[#07643D] hover:bg-gray-100 rounded-lg"
                        title="Print invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Proof Modal (Admin inspection) */}
      {proofModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Customer Payment Screenshot</h3>
                <span className="font-mono text-gray-500">{proofModalOrder.id} • {proofModalOrder.paymentMethod}</span>
              </div>
              <button onClick={() => setProofModalOrder(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border max-h-80 bg-black/5 flex items-center justify-center">
              <img
                src={proofModalOrder.paymentProofUrl}
                alt="Payment Receipt"
                className="max-h-full object-contain"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  db.updateOrderStatus(proofModalOrder.id, proofModalOrder.status, { paymentStatus: 'verified' });
                  syncOrders();
                  setProofModalOrder(null);
                }}
                className="px-4 py-2 bg-[#07643D] text-white rounded-xl font-bold hover:bg-[#043E26]"
              >
                Mark Payment as Verified
              </button>
              <button
                onClick={() => setProofModalOrder(null)}
                className="px-4 py-2 border rounded-xl font-semibold text-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Drawer / Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Order Details ({detailOrder.id})</h3>
                <span className="text-[10px] text-gray-400">{new Date(detailOrder.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setDetailOrder(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-3 bg-gray-50 rounded-xl space-y-1">
              <p className="font-bold text-gray-900">{detailOrder.customer?.name}</p>
              <p className="font-mono text-gray-600">{detailOrder.customer?.phone} • {detailOrder.customer?.email}</p>
              <p className="text-gray-700 mt-1">{detailOrder.customer?.address}</p>
              {detailOrder.specialNotes && (
                <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                  <span className="font-bold">Customer Note:</span> {detailOrder.specialNotes}
                </p>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {detailOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1.5 px-3 border rounded-xl bg-white">
                  <div>
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="text-[10px] text-gray-500 ml-1">({item.selectedVariation || item.unit})</span>
                    <span className="font-bold text-[#07643D] ml-2">× {item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-gray-900">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t flex items-center justify-between font-bold text-sm">
              <span>Total Payable:</span>
              <span className="font-mono text-[#07643D]">Rs. {detailOrder.total?.toLocaleString()}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailOrder(null)}
                className="px-5 py-2 bg-gray-200 rounded-xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        order={invoiceOrder}
        isOpen={Boolean(invoiceOrder)}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
}
