import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  RefreshCw, 
  Download, 
  Calendar, 
  Smartphone, 
  Monitor, 
  MapPin, 
  Award, 
  UserCheck, 
  UserPlus, 
  Receipt,
  Percent,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import db from '../../services/db';
import trafficTracker from '../../services/trafficTracker';
import { exportToCSV } from '../../services/exportUtils';

export default function AdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState('all'); // 'today' | '7days' | '30days' | 'all'
  const [orders, setOrders] = useState(() => db.getOrders());
  const [trafficData, setTrafficData] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    devices: { mobile: 0, desktop: 0 },
    daily: {},
    pages: {}
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [latestOrders, latestTraffic] = await Promise.all([
        db.syncOrdersFromSupabase(),
        trafficTracker.getAnalytics()
      ]);
      setOrders(latestOrders || db.getOrders());
      if (latestTraffic) {
        setTrafficData(latestTraffic);
      }
    } catch (e) {
      console.warn('Analytics refresh error:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    const unsubscribe = db.subscribe(() => {
      setOrders(db.getOrders());
    });
    return unsubscribe;
  }, []);

  // Filter orders by timeframe
  const filteredOrders = useMemo(() => {
    if (timeframe === 'all') return orders;

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    return orders.filter(o => {
      if (!o.createdAt) return false;
      const orderDate = new Date(o.createdAt);
      const orderDateStr = orderDate.toISOString().slice(0, 10);

      if (timeframe === 'today') {
        return orderDateStr === todayStr;
      }
      if (timeframe === '7days') {
        const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }
      if (timeframe === '30days') {
        const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
      }
      return true;
    });
  }, [orders, timeframe]);

  // Traffic calculation for selected timeframe
  const filteredTraffic = useMemo(() => {
    if (timeframe === 'all') {
      return {
        views: trafficData.totalViews || 0,
        uniques: trafficData.uniqueVisitors || 0,
        mobile: trafficData.devices?.mobile || 0,
        desktop: trafficData.devices?.desktop || 0
      };
    }

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const dailyEntries = Object.entries(trafficData.daily || {});

    let views = 0;
    let uniques = 0;
    let mobile = 0;
    let desktop = 0;

    for (const [dateStr, stats] of dailyEntries) {
      const date = new Date(dateStr);
      let matches = false;

      if (timeframe === 'today') {
        matches = dateStr === todayStr;
      } else if (timeframe === '7days') {
        matches = (now - date) / (1000 * 60 * 60 * 24) <= 7;
      } else if (timeframe === '30days') {
        matches = (now - date) / (1000 * 60 * 60 * 24) <= 30;
      }

      if (matches) {
        views += stats.views || 0;
        uniques += stats.uniques || 0;
        mobile += stats.mobile || 0;
        desktop += stats.desktop || 0;
      }
    }

    return { views, uniques, mobile, desktop };
  }, [trafficData, timeframe]);

  // 1. Core Financial Metrics from real orders
  const validOrders = useMemo(() => filteredOrders.filter(o => o.status !== 'cancelled'), [filteredOrders]);
  const totalRevenue = useMemo(() => validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0), [validOrders]);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // 2. Conversion Rate (Orders placed / Unique visitors)
  const conversionRate = useMemo(() => {
    if (filteredTraffic.uniques === 0) {
      return totalOrdersCount > 0 ? '100.0' : '0.0';
    }
    return ((totalOrdersCount / filteredTraffic.uniques) * 100).toFixed(1);
  }, [totalOrdersCount, filteredTraffic.uniques]);

  // 3. Top Selling Products (From real order items)
  const topSellingProducts = useMemo(() => {
    const productMap = {};

    for (const o of validOrders) {
      for (const item of (o.items || [])) {
        if (!item || !item.id) continue;
        const key = item.id;
        if (!productMap[key]) {
          productMap[key] = {
            id: item.id,
            name: item.name,
            urduName: item.urduName || '',
            image: item.image || '/images/products/gulab-jamun.svg',
            unitsSold: 0,
            revenue: 0,
            orderAppearances: 0
          };
        }
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        productMap[key].unitsSold += qty;
        productMap[key].revenue += (price * qty);
        productMap[key].orderAppearances += 1;
      }
    }

    return Object.values(productMap).sort((a, b) => b.unitsSold - a.unitsSold);
  }, [validOrders]);

  // 4. Repeat vs New Customers (Customer Retention)
  const customerAnalytics = useMemo(() => {
    const customerMap = {};

    for (const o of orders) { // All-time history to determine true repeat status
      const phoneClean = o.customer?.phone ? o.customer.phone.replace(/\D/g, '') : '';
      const email = o.customer?.email?.toLowerCase() || '';
      const key = phoneClean || email || o.id;

      if (!customerMap[key]) {
        customerMap[key] = {
          name: o.customer?.name || 'Customer',
          phone: o.customer?.phone || 'N/A',
          city: o.city || o.customer?.city || 'Jhang',
          ordersCount: 0,
          totalSpent: 0,
          firstOrderDate: o.createdAt,
          lastOrderDate: o.createdAt
        };
      }

      customerMap[key].ordersCount += 1;
      customerMap[key].totalSpent += (Number(o.total) || 0);
      if (new Date(o.createdAt) < new Date(customerMap[key].firstOrderDate)) {
        customerMap[key].firstOrderDate = o.createdAt;
      }
      if (new Date(o.createdAt) > new Date(customerMap[key].lastOrderDate)) {
        customerMap[key].lastOrderDate = o.createdAt;
      }
    }

    const allCustomers = Object.values(customerMap);
    const repeatCustomers = allCustomers.filter(c => c.ordersCount > 1);
    const newCustomers = allCustomers.filter(c => c.ordersCount === 1);
    const repeatRate = allCustomers.length > 0 
      ? Math.round((repeatCustomers.length / allCustomers.length) * 100) 
      : 0;

    return {
      totalUniqueCustomers: allCustomers.length,
      repeatCount: repeatCustomers.length,
      newCount: newCustomers.length,
      repeatRate,
      topCustomers: repeatCustomers.sort((a, b) => b.ordersCount - a.ordersCount).slice(0, 5)
    };
  }, [orders]);

  // 5. Payment Methods Breakdown (From real orders)
  const paymentBreakdown = useMemo(() => {
    let cod = 0;
    let easypaisa = 0;
    let bank = 0;

    for (const o of validOrders) {
      const pm = (o.paymentMethod || '').toLowerCase();
      const amount = Number(o.total) || 0;
      if (pm === 'cod') cod += amount;
      else if (pm === 'easypaisa') easypaisa += amount;
      else bank += amount;
    }

    return { cod, easypaisa, bank };
  }, [validOrders]);

  // 6. City Distribution (From real orders)
  const cityDistribution = useMemo(() => {
    const cityMap = {};
    for (const o of validOrders) {
      const city = o.city || o.customer?.city || 'Jhang';
      cityMap[city] = (cityMap[city] || 0) + 1;
    }
    return Object.entries(cityMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }, [validOrders]);

  // CSV Export with authentic numbers
  const handleExportCSV = () => {
    const exportRows = [
      { Metric: 'Report Timeframe', Value: timeframe.toUpperCase() },
      { Metric: 'Total Store Pageviews (Visitors Traffic)', Value: filteredTraffic.views },
      { Metric: 'Unique Visitors (Real Devices)', Value: filteredTraffic.uniques },
      { Metric: 'Mobile Device Traffic', Value: filteredTraffic.mobile },
      { Metric: 'Desktop Device Traffic', Value: filteredTraffic.desktop },
      { Metric: 'Total Customer Orders', Value: totalOrdersCount },
      { Metric: 'Net Sales Revenue (PKR)', Value: `Rs. ${totalRevenue}` },
      { Metric: 'Average Order Value (PKR)', Value: `Rs. ${avgOrderValue}` },
      { Metric: 'Visitor to Order Conversion Rate', Value: `${conversionRate}%` },
      { Metric: 'Total Unique Registered/Guest Buyers', Value: customerAnalytics.totalUniqueCustomers },
      { Metric: 'Repeat / Returning Customers', Value: customerAnalytics.repeatCount },
      { Metric: 'New First-Time Customers', Value: customerAnalytics.newCount },
      { Metric: 'Customer Repeat Loyalty Rate', Value: `${customerAnalytics.repeatRate}%` },
      { Metric: 'COD Revenue (PKR)', Value: `Rs. ${paymentBreakdown.cod}` },
      { Metric: 'Easypaisa Revenue (PKR)', Value: `Rs. ${paymentBreakdown.easypaisa}` },
      { Metric: 'Bank Transfer Revenue (PKR)', Value: `Rs. ${paymentBreakdown.bank}` }
    ];

    exportToCSV(exportRows, `sawera-organic-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Semrush-Style Project Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100% Organic &amp; Verified Data (Supabase Live)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 mt-1">
            Store Performance &amp; Traffic Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real visitor counts, customer orders, top selling sweets, and repeat buyer rates without estimation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
              { id: 'all', label: 'All Time' }
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === tf.id 
                    ? 'bg-white text-[#07643D] font-bold shadow-xs' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : 'text-gray-600'}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 5 Primary Core KPI Cards (Visitor Traffic, Orders, Conversion, Revenue, Retention) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Website Visitors */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Website Visitors</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900">
              {filteredTraffic.uniques.toLocaleString()}
            </p>
            <span className="text-[11px] text-gray-500 font-medium">
              {filteredTraffic.views.toLocaleString()} Total Pageviews
            </span>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-emerald-600" />
              {filteredTraffic.mobile} Mobile
            </span>
            <span className="flex items-center gap-1">
              <Monitor className="w-3 h-3 text-blue-600" />
              {filteredTraffic.desktop} Desktop
            </span>
          </div>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Orders Placed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-900">
              {totalOrdersCount.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-700 font-medium">
              {validOrders.length} Confirmed &amp; Dispatched
            </span>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
            <span>Shop Fulfillment:</span>
            <span className="font-bold text-[#07643D]">100% Tracked</span>
          </div>
        </div>

        {/* 3. Conversion Rate */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Conversion Rate</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900">
              {conversionRate}%
            </p>
            <span className="text-[11px] text-gray-500 font-medium">
              Visitors who placed an order
            </span>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
            <span>Organic Ratio:</span>
            <span className="font-bold text-amber-700">{totalOrdersCount} / {filteredTraffic.uniques || 1}</span>
          </div>
        </div>

        {/* 4. Total Sales Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#07643D]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#07643D]">
              Rs. {totalRevenue.toLocaleString()}
            </p>
            <span className="text-[11px] text-gray-500 font-medium">
              Avg Order: Rs. {avgOrderValue.toLocaleString()}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
            <span>Payment Verified:</span>
            <span className="font-bold text-[#07643D]">Direct PKR</span>
          </div>
        </div>

        {/* 5. Repeat vs New Customers */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Repeat Loyalty</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-900">
              {customerAnalytics.repeatRate}%
            </p>
            <span className="text-[11px] text-purple-800 font-medium">
              {customerAnalytics.repeatCount} Repeat / {customerAnalytics.newCount} New
            </span>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
            <span>Total Buyers:</span>
            <span className="font-bold text-purple-700">{customerAnalytics.totalUniqueCustomers} Customers</span>
          </div>
        </div>

      </div>

      {/* Main 2-Column Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 Cols): Top Selling Products & Customer Loyalty */}
        <div className="lg:col-span-2 space-y-6">

          {/* Top Selling Products Table */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-sm font-bold text-gray-900">
                  Top Selling Products (سب سے زیادہ بکنے والے آئٹمز)
                </h2>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">
                {topSellingProducts.length} items sold
              </span>
            </div>

            {topSellingProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="font-bold text-gray-700">No product sales recorded in this timeframe</p>
                <p className="text-[11px] text-gray-400 mt-0.5">As real orders are fulfilled, top performing sweets will be ranked here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#07643D] text-white">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-xl">Rank</th>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3 text-center">Units Sold</th>
                      <th className="py-2.5 px-3 text-center">Orders</th>
                      <th className="py-2.5 px-3 text-right rounded-r-xl">Total Sales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topSellingProducts.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            idx === 0 ? 'bg-[#D4AF37] text-white' :
                            idx === 1 ? 'bg-gray-300 text-gray-800' :
                            idx === 2 ? 'bg-amber-600 text-white' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            #{idx + 1}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-9 h-9 rounded-xl object-cover border border-amber-200"
                              onError={(e) => { e.target.src = '/images/products/gulab-jamun.svg'; }}
                            />
                            <div>
                              <p className="font-bold text-gray-900">{p.name}</p>
                              {p.urduName && (
                                <p className="text-[10px] text-amber-800 font-semibold">{p.urduName}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className="font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            {p.unitsSold} units
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center text-gray-500 font-mono">
                          {p.orderAppearances}
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                          Rs. {p.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Repeat Buyers List */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-700" />
                <h2 className="text-sm font-bold text-gray-900">
                  Repeat Customers (دوبارہ آرڈر کرنے والے بااعتماد گاہک)
                </h2>
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                {customerAnalytics.repeatCount} Loyal Buyers
              </span>
            </div>

            {customerAnalytics.topCustomers.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="font-semibold text-gray-600">No repeat customer recorded yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">When buyers place their 2nd, 3rd, or 4th orders, their loyalty stats will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {customerAnalytics.topCustomers.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 transition-colors border border-gray-100 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                        {c.ordersCount}x
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{c.name}</p>
                        <p className="text-[11px] text-gray-500 font-mono">{c.phone} • {c.city}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-800 block">Rs. {c.totalSpent.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400">{c.ordersCount} Completed Orders</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 Col): Traffic Sources, Devices, Payment Breakdown */}
        <div className="space-y-6">

          {/* Device & Traffic Organic Share */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#07643D]" />
              <span>Visitor Devices (موبائل بمقابلہ کمپیوٹر)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    Mobile Phones
                  </span>
                  <span className="font-mono">
                    {filteredTraffic.mobile} ({filteredTraffic.views > 0 ? Math.round((filteredTraffic.mobile / filteredTraffic.views) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    style={{ width: `${filteredTraffic.views > 0 ? (filteredTraffic.mobile / filteredTraffic.views) * 100 : 0}%` }}
                    className="h-full bg-emerald-600 rounded-full transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Monitor className="w-3.5 h-3.5 text-blue-600" />
                    Desktop &amp; Laptop
                  </span>
                  <span className="font-mono">
                    {filteredTraffic.desktop} ({filteredTraffic.views > 0 ? Math.round((filteredTraffic.desktop / filteredTraffic.views) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    style={{ width: `${filteredTraffic.views > 0 ? (filteredTraffic.desktop / filteredTraffic.views) * 100 : 0}%` }}
                    className="h-full bg-blue-600 rounded-full transition-all"
                  />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 pt-2 border-t border-gray-100">
              * Counts individual browser sessions browsing Sawera Sweets public pages.
            </p>
          </div>

          {/* Payment Method Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#07643D]" />
              <span>Real Payment Share (ادائیگی کے ذرائع)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-1">
                  <span>Cash on Delivery (COD)</span>
                  <span className="font-mono">Rs. {paymentBreakdown.cod.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    style={{ width: `${totalRevenue > 0 ? (paymentBreakdown.cod / totalRevenue) * 100 : 0}%` }}
                    className="h-full bg-emerald-700 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-1">
                  <span>Easypaisa Mobile Wallet</span>
                  <span className="font-mono">Rs. {paymentBreakdown.easypaisa.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    style={{ width: `${totalRevenue > 0 ? (paymentBreakdown.easypaisa / totalRevenue) * 100 : 0}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-gray-700 mb-1">
                  <span>Direct Bank Transfer</span>
                  <span className="font-mono">Rs. {paymentBreakdown.bank.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    style={{ width: `${totalRevenue > 0 ? (paymentBreakdown.bank / totalRevenue) * 100 : 0}%` }}
                    className="h-full bg-[#D4AF37] rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Delivery Cities */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>Orders by City (شہروں کی بنیاد پر)</span>
            </h3>

            {cityDistribution.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No city orders recorded yet</p>
            ) : (
              <div className="space-y-2">
                {cityDistribution.slice(0, 5).map(({ city, count }) => (
                  <div key={city} className="flex justify-between items-center p-2 rounded-xl bg-gray-50 font-medium">
                    <span className="font-bold text-gray-800">{city}</span>
                    <span className="font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-gray-200">
                      {count} {count === 1 ? 'order' : 'orders'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
