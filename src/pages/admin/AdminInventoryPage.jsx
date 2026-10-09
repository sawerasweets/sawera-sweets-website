import React, { useState } from 'react';
import { Boxes, CheckCircle2, XCircle, AlertTriangle, Plus, Search, Check, X, ShieldAlert } from 'lucide-react';
import db from '../../services/db';
import { useAuth } from '../../context/AuthContext';

export default function AdminInventoryPage() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState(() => db.getProducts());
  const [stockRequests, setStockRequests] = useState(() => db.getStockRequests());
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('shop-1');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  
  // New Request Form
  const [reqProductId, setReqProductId] = useState('');
  const [reqQty, setReqQty] = useState(10);
  const [reqType, setReqType] = useState('add');
  const [reqReason, setReqReason] = useState('');

  // Rejection Dialog
  const [rejectionModalId, setRejectionModalId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const branches = db.getBranches();

  const syncData = () => {
    setProducts(db.getProducts());
    setStockRequests(db.getStockRequests());
  };

  const handleUpdateDirectStock = (productId, branchId, newStock) => {
    const qty = Math.max(0, Number(newStock));
    const updated = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stocks: {
            ...p.stocks,
            [branchId]: qty
          }
        };
      }
      return p;
    });
    db.set('products', updated);
    db.logActivity('Stock Level Updated', `Stock for product ${productId} at ${branchId} changed to ${qty}.`, user.name);
    syncData();
  };

  const handleSubmitStaffRequest = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === reqProductId);
    const branch = branches.find(b => b.id === selectedBranch);

    db.createStockRequest({
      productId: reqProductId,
      productName: product?.name || 'Item',
      branchId: selectedBranch,
      branchName: branch?.name || 'Branch',
      requestedBy: user.name,
      changeQty: Number(reqQty),
      type: reqType,
      reason: reqReason
    });

    setIsRequestModalOpen(false);
    setReqReason('');
    syncData();
  };

  const handleApprove = (id) => {
    db.reviewStockRequest(id, true, user.name);
    syncData();
  };

  const handleReject = (id) => {
    db.reviewStockRequest(id, false, user.name, rejectionReason || 'Adjustment rejected by admin');
    setRejectionModalId(null);
    setRejectionReason('');
    syncData();
  };

  const pendingRequests = stockRequests.filter(r => r.status === 'pending');
  const historyRequests = stockRequests.filter(r => r.status !== 'pending');

  const filteredProducts = products.filter(p => {
    if (search.trim()) {
      return p.name.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Store Inventory &amp; Stock Approvals</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage live stock for Sawera Sweets &amp; Bakers and review staff adjustment submissions.</p>
        </div>

        <button
          onClick={() => {
            setReqProductId(products[0]?.id || '');
            setIsRequestModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Stock Request</span>
        </button>
      </div>

      {/* Pending Approvals Section */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-gray-900">
              Staff Adjustment Approvals Queue ({pendingRequests.length} Pending)
            </h2>
          </div>
          <span className="text-[11px] text-gray-500">Requires Owner/Admin Review</span>
        </div>

        {pendingRequests.length === 0 ? (
          <p className="text-xs text-gray-500 py-3 text-center">No pending stock requests at this time.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">{req.productName}</span>
                    <span className="font-mono font-bold bg-[#07643D] text-white px-2 py-0.5 rounded-full text-[10px]">
                      {req.type === 'add' ? `+${req.changeQty}` : req.type === 'deduct' ? `-${req.changeQty}` : `Set ${req.changeQty}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Store: <span className="font-semibold">{req.branchName}</span> • By: {req.requestedBy}
                  </p>
                  <p className="text-[11px] text-amber-900 italic mt-1 bg-white/70 p-2 rounded-lg border border-amber-200">
                    "{req.reason}"
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-200 mt-3">
                  <button
                    onClick={() => setRejectionModalId(req.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-bold text-xs"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="px-4 py-1.5 rounded-lg bg-[#07643D] text-white hover:bg-[#043E26] font-bold text-xs shadow-sm"
                  >
                    Approve Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Management Table for Store */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden text-xs">
        {/* Table Filter & Search Header */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-sm">Sawera Sweets &amp; Bakers (Main Store)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Live Inventory</span>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full border border-gray-300 text-xs outline-none focus:border-[#07643D]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#07643D] text-white font-semibold">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Base Unit</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Store Stock</th>
                <th className="py-3 px-4 text-right">Quick Edit Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((p) => {
                const currentStock = p.stocks?.[selectedBranch] ?? 0;
                const isOutOfStock = currentStock === 0;
                const isLow = currentStock <= (p.lowStockThreshold || 10) && !isOutOfStock;

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">{p.name}</td>
                    <td className="py-3 px-4 capitalize font-semibold text-gray-600">{p.category}</td>
                    <td className="py-3 px-4 text-gray-500">{p.unit}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        isOutOfStock ? 'bg-red-100 text-red-800' :
                        isLow ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isOutOfStock ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-base text-gray-800">
                      {currentStock}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          onClick={() => handleUpdateDirectStock(p.id, selectedBranch, currentStock - 5)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold"
                        >
                          -5
                        </button>
                        <input
                          type="number"
                          value={currentStock}
                          onChange={(e) => handleUpdateDirectStock(p.id, selectedBranch, e.target.value)}
                          className="w-16 text-center font-mono font-bold p-1 border rounded bg-white text-xs outline-none"
                        />
                        <button
                          onClick={() => handleUpdateDirectStock(p.id, selectedBranch, currentStock + 5)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Stock Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 text-xs shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-gray-900 mb-3">Submit Staff Stock Adjustment</h3>
            <p className="text-gray-500 mb-4">Stock requests require verification and approval from the Owner/Admin.</p>

            <form onSubmit={handleSubmitStaffRequest} className="space-y-3.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product</label>
                <select
                  value={reqProductId}
                  onChange={(e) => setReqProductId(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Adjustment Type</label>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value)}
                    className="w-full p-2 border rounded-xl outline-none"
                  >
                    <option value="add">Add (+)</option>
                    <option value="deduct">Deduct (-)</option>
                    <option value="set">Set to Exact Count</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                    className="w-full p-2 border rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mandatory Reason / Kitchen Batch Info</label>
                <textarea
                  required
                  rows={2}
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  placeholder="e.g. Prepared 20 fresh 1kg boxes of Gulab Jamun in sweet kitchen..."
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#07643D] text-white rounded-xl font-bold hover:bg-[#043E26]"
                >
                  Send for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModalId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl text-xs space-y-3">
            <h4 className="text-sm font-bold text-gray-900">Reason for Rejection</h4>
            <input
              type="text"
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Discrepancy with morning raw ingredient log..."
              className="w-full p-2 border rounded-xl outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setRejectionModalId(null)} className="px-3 py-1.5 border rounded-lg">
                Cancel
              </button>
              <button onClick={() => handleReject(rejectionModalId)} className="px-4 py-1.5 bg-red-600 text-white rounded-lg font-bold">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
