'use client';

import React, { useState } from 'react';
import { Activity, MapPin, AlertTriangle, Search, Clock, ShieldAlert } from 'lucide-react';
import RailwayMap from '@/components/RailwayMap';
import StatusBadge from '@/components/StatusBadge';
import BlockTimeline from '@/components/BlockTimeline';
import { mockSections, mockAlerts } from '@/data/mockData';

export default function OperationsControlCenter() {
  const [selectedSec, setSelectedSec] = useState(mockSections[2]);
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
            Live Operations Control Center
          </h1>
          <p className="text-xs text-slate-400">Real-time Chennai Division Command Room View &amp; Section Status</p>
        </div>

        <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          COMMAND CENTER ACTIVE
        </span>
      </div>

      {/* 3-Column Command Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: Railway Section List (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3 shadow-lg flex flex-col h-[520px]">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-white">Corridor Sections ({mockSections.length})</span>
            <span className="text-slate-400">Trunk Lines</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search section..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            {mockSections.map((sec) => (
              <div
                key={sec.id}
                onClick={() => setSelectedSec(sec)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedSec.id === sec.id
                    ? 'bg-blue-950/50 border-blue-500/60 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-blue-400">{sec.code}</span>
                  <StatusBadge status={sec.status} />
                </div>
                <div className="font-medium text-slate-200 truncate mt-1">{sec.name}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
                  <span>Traffic: {sec.trafficDensity}</span>
                  <span>Tasks: {sec.activeTasks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: SVG Schematic Railway Map (6 cols) */}
        <div className="lg:col-span-6">
          <RailwayMap />
        </div>

        {/* RIGHT: Alerts Feed (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3 shadow-lg flex flex-col h-[520px]">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Live Corridor Alerts
            </span>
            <span className="text-emerald-400 font-bold text-[10px]">3 ACTIVE</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
            {mockAlerts.map((al) => (
              <div key={al.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <StatusBadge status={al.severity} />
                  <span className="text-slate-500">{al.timestamp}</span>
                </div>
                <div className="font-semibold text-slate-200 leading-snug">{al.title}</div>
                <p className="text-[11px] text-slate-400 leading-tight">{al.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM: Timeline */}
      <BlockTimeline />
    </div>
  );
}
