import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Receipt, 
  Boxes, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import db from '../../services/db';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const [timeframe, setTimeframe] = useState('weekly'); // 'daily' | 'weekly' | 'monthly' | 'yearly'
  const [rejectionModalId, setRejectionModalId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [orders, setOrders] = useState(() => db.getOrders());
  const [products, setProducts] = useState(() => db.getProducts());
  const [stockRequests, setStockRequests] = useState(() => db.getStockRequests());
  const [chats, setChats] = useState(() => db.get('chats'));

  useEffect(() => {
    db.syncOrdersFromSupabase().then(() => {
      setOrders(db.getOrders());
    });
    const unsubscribe = db.subscribe(() => {
      setOrders(db.getOrders());
      setProducts(db.getProducts());
      setStockRequests(db.getStockRequests());
      setChats(db.get('chats'));
    });
    return unsubscribe;
  }, []);

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'placed' || o.status === 'confirmed').length;
  const pendingApprovals = stockRequests.filter(r => r.status === 'pending');
  const lowStockProducts = products.filter(p => {
    const totalStock = Object.values(p.stocks || {}).reduce((a, b) => a + b, 0);
    return totalStock <= (p.lowStockThreshold || 10);
  });

  // Sales Chart Data dynamically driven by 100% real store orders
  const chartPoints = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'cancelled');

    if (validOrders.length === 0) {
      if (timeframe === 'daily') {
        return ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'].map(l => ({ label: l, val: 0 }));
      }
      if (timeframe === 'weekly') {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(l => ({ label: l, val: 0 }));
      }
      if (timeframe === 'monthly') {
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(l => ({ label: l, val: 0 }));
      }
      return ['Q1', 'Q2', 'Q3', 'Q4'].map(l => ({ label: l, val: 0 }));
    }

    if (timeframe === 'weekly') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const map = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      for (const o of validOrders) {
        if (!o.createdAt) continue;
        const d = new Date(o.createdAt);
        const day = dayNames[d.getDay()];
        if (map[day] !== undefined) {
          map[day] += Number(o.total) || 0;
        }
      }
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(label => ({ label, val: map[label] }));
    }

    if (timeframe === 'daily') {
      const map = { '6 AM': 0, '9 AM': 0, '12 PM': 0, '3 PM': 0, '6 PM': 0, '9 PM': 0, '12 AM': 0 };
      const todayStr = new Date().toISOString().slice(0, 10);
      for (const o of validOrders) {
        if (!o.createdAt) continue;
        const d = new Date(o.createdAt);
        if (d.toISOString().slice(0, 10) === todayStr) {
          const hour = d.getHours();
          const amt = Number(o.total) || 0;
          if (hour < 8) map['6 AM'] += amt;
          else if (hour < 11) map['9 AM'] += amt;
          else if (hour < 14) map['12 PM'] += amt;
          else if (hour < 17) map['3 PM'] += amt;
          else if (hour < 20) map['6 PM'] += amt;
          else if (hour < 23) map['9 PM'] += amt;
          else map['12 AM'] += amt;
        }
      }
      return Object.entries(map).map(([label, val]) => ({ label, val }));
    }

    if (timeframe === 'monthly') {
      const map = { 'Week 1': 0, 'Week 2': 0, 'Week 3': 0, 'Week 4': 0 };
      const now = new Date();
      for (const o of validOrders) {
        if (!o.createdAt) continue;
        const d = new Date(o.createdAt);
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
          const dateNum = d.getDate();
          const amt = Number(o.total) || 0;
          if (dateNum <= 7) map['Week 1'] += amt;
          else if (dateNum <= 14) map['Week 2'] += amt;
          else if (dateNum <= 21) map['Week 3'] += amt;
          else map['Week 4'] += amt;
        }
      }
      return Object.entries(map).map(([label, val]) => ({ label, val }));
    }

    // Yearly
    const map = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    const curYear = new Date().getFullYear();
    for (const o of validOrders) {
      if (!o.createdAt) continue;
      const d = new Date(o.createdAt);
      if (d.getFullYear() === curYear) {
        const m = d.getMonth();
        const amt = Number(o.total) || 0;
        if (m <= 2) map.Q1 += amt;
        else if (m <= 5) map.Q2 += amt;
        else if (m <= 8) map.Q3 += amt;
        else map.Q4 += amt;
      }
    }
    return Object.entries(map).map(([label, val]) => ({ label, val }));
  }, [orders, timeframe]);

  const maxVal = Math.max(1, ...chartPoints.map(p => p.val));

  const handleApproveRequest = (id) => {
    db.reviewStockRequest(id, true, user.name);
  };

  const handleRejectRequest = (id) => {
    db.reviewStockRequest(id, false, user.name, rejectionReason || 'Adjustments rejected by admin.');
    setRejectionModalId(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Store Management Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time business performance for Sawera Sweets &amp; Bakers.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-3.5 py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-bold shadow-sm transition-colors"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#07643D] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sales</p>
            <p className="text-xl font-bold font-mono text-gray-900 mt-0.5">Rs. {totalRevenue.toLocaleString()}</p>
            <span className="text-[10px] text-emerald-600 font-bold">● Active orders</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-xl font-bold font-mono text-gray-900 mt-0.5">{totalOrders}</p>
            <span className="text-[10px] text-blue-600 font-bold">{pendingOrders} pending fulfillment</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Approvals</p>
            <p className="text-xl font-bold font-mono text-amber-800 mt-0.5">{pendingApprovals.length}</p>
            <span className="text-[10px] text-amber-700 font-bold">Awaiting your approval</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Low Stock Items</p>
            <p className="text-xl font-bold font-mono text-rose-600 mt-0.5">{lowStockProducts.length}</p>
            <span className="text-[10px] text-rose-500 font-bold">Below threshold level</span>
          </div>
        </div>
      </div>

      {/* Interactive Sales Chart */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#07643D]" />
            <h2 className="text-base font-bold text-gray-900">Revenue &amp; Sales Trend</h2>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
            {['daily', 'weekly', 'monthly', 'yearly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  timeframe === tf
                    ? 'bg-[#07643D] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Bar Chart Visualization */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 px-2 sm:px-6">
          {chartPoints.map((point, idx) => {
            const heightPercent = point.val > 0 ? Math.max(10, Math.round((point.val / maxVal) * 100)) : 2;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Rs. {point.val >= 1000 ? `${(point.val / 1000).toFixed(0)}k` : point.val}
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 shadow-sm ${
                    point.val > 0 
                      ? 'bg-gradient-to-t from-[#07643D] to-emerald-500 group-hover:brightness-110' 
                      : 'bg-gray-200'
                  }`}
                />
                <span className="text-[11px] font-bold text-gray-600 mt-1">{point.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Pending Stock Approvals & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Staff Stock Approvals Queue */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-bold text-gray-900">Pending Staff Stock Adjustments</h3>
            </div>
            <Link to="/admin/inventory" className="text-xs font-semibold text-[#07643D] hover:underline">
              Manage All
            </Link>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p>All stock adjustment requests have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {pendingApprovals.map((req) => (
                <div key={req.id} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{req.productName}</span>
                      <span className="bg-emerald-800 text-white font-mono px-2 py-0.2 rounded-full font-bold text-[10px]">
                        +{req.changeQty} Units
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Store: <span className="font-semibold">{req.branchName}</span> • By: {req.requestedBy}
                    </p>
                    <p className="text-[11px] text-amber-900 italic mt-0.5">"{req.reason}"</p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleApproveRequest(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#07643D] text-white hover:bg-[#043E26] font-bold text-xs shadow-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectionModalId(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-bold text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#07643D]" />
              <h3 className="text-sm font-bold text-gray-900">Recent Customer Orders</h3>
            </div>
            <Link to="/admin/orders" className="text-xs font-semibold text-[#07643D] hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900">{order.id}</span>
                    <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] uppercase ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-0.5">{order.customer?.name} • {order.items?.length} items</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-gray-900">Rs. {order.total?.toLocaleString()}</span>
                  <p className="text-[10px] text-gray-400">{order.assignedBranchName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Reject Reason Modal */}
      {rejectionModalId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl text-xs space-y-3">
            <h4 className="text-sm font-bold text-gray-900">Reject Stock Request</h4>
            <p className="text-gray-500">Please provide a mandatory reason for rejecting this staff stock request:</p>
            <input
              type="text"
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Mismatched inventory batch count..."
              className="w-full p-2 border rounded-xl outline-none focus:border-red-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalId(null)}
                className="px-3 py-1.5 rounded-lg border text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectRequest(rejectionModalId)}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
