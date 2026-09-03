'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Eye, Calendar, Check } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { mockAlerts, AlertItem } from '@/data/mockData';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    return true;
  });

  const handleResolve = (id: string) => {
    setAlerts(alerts.map((a) => a.id === id ? { ...a, status: 'Resolved' } : a));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Alerts &amp; Conflict Management
          </h1>
          <p className="text-xs text-slate-400">Automated Identification of Corridor Conflicts &amp; Task Deadlines</p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 font-bold">
            {alerts.filter(a => a.status === 'Active').length} ACTIVE ALERTS
          </span>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center space-x-2 text-xs font-mono">
        <span className="text-slate-400 font-bold mr-2">Severity Filter:</span>
        <button
          onClick={() => setFilterSeverity('ALL')}
          className={`px-3 py-1 rounded ${filterSeverity === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setFilterSeverity('Critical')}
          className={`px-3 py-1 rounded ${filterSeverity === 'Critical' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          Critical Only
        </button>
        <button
          onClick={() => setFilterSeverity('High')}
          className={`px-3 py-1 rounded ${filterSeverity === 'High' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          High Only
        </button>
        <button
          onClick={() => setFilterSeverity('Medium')}
          className={`px-3 py-1 rounded ${filterSeverity === 'Medium' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          Medium Only
        </button>
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((al) => (
          <div
            key={al.id}
            className={`bg-slate-900 border rounded-xl p-5 space-y-3 shadow-lg transition-all ${
              al.status === 'Resolved' ? 'border-slate-800 opacity-60' : 'border-amber-500/40'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <StatusBadge status={al.severity} />
                <span className="text-blue-400 font-bold">Section {al.sectionId}</span>
                <span className="text-slate-500">| {al.timestamp}</span>
              </div>

              <div className="flex items-center space-x-2">
                {al.status === 'Resolved' ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> RESOLVED
                  </span>
                ) : (
                  <>
                    <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]">
                      View
                    </button>
                    <button 
                      onClick={() => handleResolve(al.id)}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                    >
                      Resolve
                    </button>
                    <button className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px]">
                      Schedule Block
                    </button>
                  </>
                )}
              </div>
            </div>

            <h3 className="text-base font-bold text-white">{al.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{al.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
