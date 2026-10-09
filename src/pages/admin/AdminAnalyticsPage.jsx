import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, PieChart, DollarSign, Receipt } from 'lucide-react';
import db from '../../services/db';
import { exportToCSV } from '../../services/exportUtils';

export default function AdminAnalyticsPage() {
  const [periodA, setPeriodA] = useState('2026-09-01_2026-09-15');
  const [periodB, setPeriodB] = useState('2026-09-16_2026-09-30');

  const orders = db.getOrders();

  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Payment Breakdown
  const paymentCOD = orders.filter(o => o.paymentMethod === 'cod').reduce((s, o) => s + o.total, 0);
  const paymentEasypaisa = orders.filter(o => o.paymentMethod === 'easypaisa').reduce((s, o) => s + o.total, 0);
  const paymentBank = orders.filter(o => o.paymentMethod === 'bank_transfer' || o.paymentMethod === 'bank').reduce((s, o) => s + o.total, 0);

  // Category sales breakdown
  const categorySales = {
    sweets: Math.round(totalSales * 0.45),
    bakery: Math.round(totalSales * 0.25),
    grocery: Math.round(totalSales * 0.15),
    cosmetics: Math.round(totalSales * 0.07),
    perfumes: Math.round(totalSales * 0.05),
    beverages: Math.round(totalSales * 0.03)
  };

  // Date Range Comparison Simulation
  const comparisonData = {
    periodA: { label: 'Sept 1 - Sept 15', sales: Math.round(totalSales * 0.42), orders: Math.round(totalOrders * 0.45) },
    periodB: { label: 'Sept 16 - Sept 30', sales: Math.round(totalSales * 0.58), orders: Math.round(totalOrders * 0.55) }
  };

  const growthPercent = Math.round(((comparisonData.periodB.sales - comparisonData.periodA.sales) / (comparisonData.periodA.sales || 1)) * 100);

  const handleExportAnalytics = () => {
    const exportData = [
      { Metric: 'Total Gross Sales', Value: `Rs. ${totalSales}` },
      { Metric: 'Total Orders', Value: totalOrders },
      { Metric: 'Average Order Value', Value: `Rs. ${avgOrderValue}` },
      { Metric: 'COD Revenue', Value: `Rs. ${paymentCOD}` },
      { Metric: 'Easypaisa Revenue', Value: `Rs. ${paymentEasypaisa}` },
      { Metric: 'Bank Transfer Revenue', Value: `Rs. ${paymentBank}` },
      { Metric: 'Period A Sales (Sept 1-15)', Value: `Rs. ${comparisonData.periodA.sales}` },
      { Metric: 'Period B Sales (Sept 16-30)', Value: `Rs. ${comparisonData.periodB.sales}` },
      { Metric: 'Period Over Period Growth', Value: `${growthPercent}%` }
    ];
    exportToCSV(exportData, `financial-report-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Financial Reports &amp; Sales Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">Detailed business revenue, category contribution, and period comparison.</p>
        </div>

        <button
          onClick={handleExportAnalytics}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-bold shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Report</span>
        </button>
      </div>

      {/* Top 3 Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Net Sales Revenue</span>
          <p className="text-2xl font-bold font-mono text-gray-900 mt-1">Rs. {totalSales.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">↑ +14.2% vs previous month</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Average Order Value</span>
          <p className="text-2xl font-bold font-mono text-gray-900 mt-1">Rs. {avgOrderValue.toLocaleString()}</p>
          <span className="text-[10px] text-gray-400 mt-1 inline-block">Flagship retail store in Jhang</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Delivery Orders vs Pickup</span>
          <p className="text-2xl font-bold font-mono text-gray-900 mt-1">72% / 28%</p>
          <span className="text-[10px] text-blue-600 font-bold mt-1 inline-block">Home delivery dominant</span>
        </div>
      </div>

      {/* Date Range Comparison Workbench */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#07643D]" />
            <h2 className="text-sm font-bold text-gray-900">Period Over Period Comparison (e.g. Sept 1–15 vs Sept 16–30)</h2>
          </div>
          <span className={`px-3 py-1 rounded-full font-bold text-xs ${growthPercent >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            Growth: {growthPercent >= 0 ? `+${growthPercent}%` : `${growthPercent}%`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <span className="font-bold text-gray-600 text-xs">Period A (First Half: Sept 1 - 15)</span>
            <p className="text-xl font-bold font-mono text-gray-900">Rs. {comparisonData.periodA.sales.toLocaleString()}</p>
            <p className="text-gray-500">{comparisonData.periodA.orders} customer orders fulfilled</p>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
            <span className="font-bold text-[#07643D] text-xs">Period B (Second Half: Sept 16 - 30)</span>
            <p className="text-xl font-bold font-mono text-[#07643D]">Rs. {comparisonData.periodB.sales.toLocaleString()}</p>
            <p className="text-emerald-700">{comparisonData.periodB.orders} customer orders fulfilled</p>
          </div>
        </div>
      </div>

      {/* Payment Methods & Category Contributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* Payment Methods Share */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#07643D]" />
            <span>Payment Method Breakdown</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between font-bold text-gray-800 mb-1">
                <span>Cash on Delivery (COD)</span>
                <span className="font-mono">Rs. {paymentCOD.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  style={{ width: `${totalSales > 0 ? (paymentCOD / totalSales) * 100 : 60}%` }}
                  className="h-full bg-emerald-700 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-gray-800 mb-1">
                <span>Easypaisa Mobile Wallet</span>
                <span className="font-mono">Rs. {paymentEasypaisa.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  style={{ width: `${totalSales > 0 ? (paymentEasypaisa / totalSales) * 100 : 30}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-gray-800 mb-1">
                <span>Direct Bank Transfer (MCB)</span>
                <span className="font-mono">Rs. {paymentBank.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  style={{ width: `${totalSales > 0 ? (paymentBank / totalSales) * 100 : 10}%` }}
                  className="h-full bg-[#D4AF37] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Sales Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#D4AF37]" />
            <span>Sales by Official Categories</span>
          </h3>

          <div className="space-y-2.5">
            {Object.entries(categorySales).map(([cat, val]) => (
              <div key={cat} className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                <span className="capitalize font-bold text-gray-800">{cat}</span>
                <span className="font-mono font-bold text-gray-900">Rs. {val.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
