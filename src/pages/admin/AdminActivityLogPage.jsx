import React, { useState } from 'react';
import { Activity, Search, ShieldCheck } from 'lucide-react';
import db from '../../services/db';

export default function AdminActivityLogPage() {
  const [logs] = useState(() => db.get('activityLogs'));
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(l => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return l.action.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.performedBy.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">System Activity Audit Trail</h1>
        <p className="text-xs text-gray-500 mt-0.5">Immutable audit log recording product updates, order dispatches, and stock approvals.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit actions..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full border border-gray-300 text-xs outline-none focus:border-[#07643D]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
        </div>
        <span className="text-gray-400 font-semibold">{filteredLogs.length} logged actions</span>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-xs">{log.action}</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-[#07643D] font-bold text-[9px] border border-emerald-200">
                    By: {log.performedBy}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed text-xs">{log.details}</p>
              </div>

              <span className="font-mono text-[10px] text-gray-400 whitespace-nowrap">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
