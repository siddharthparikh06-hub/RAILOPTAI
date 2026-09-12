'use client';

import React, { useMemo, useState } from 'react';
import { Activity, MapPin, AlertTriangle, Search, Clock, ShieldAlert } from 'lucide-react';
import RailwayMap from '@/components/RailwayMap';
import StatusBadge from '@/components/StatusBadge';
import BlockTimeline from '@/components/BlockTimeline';
import {
  mockAlerts,
  mockAssets,
  mockBlockWindows,
  mockConflicts,
  mockMaintenanceTasks,
  mockTrainMovements,
  mockSections,
  mockStations,
} from '@/data/mockData';

export default function OperationsControlCenter() {
  const [selectedSec, setSelectedSec] = useState(mockSections[2]);
  const [search, setSearch] = useState('');
  const selectedData = useMemo(() => {
    const sectionId = selectedSec.id;
    return {
      stations: mockStations.filter((station) => selectedSec.stationIds.includes(station.id)),
      trains: mockTrainMovements.filter((movement) => movement.sectionId === sectionId),
      blocks: mockBlockWindows.filter((block) => block.sectionId === sectionId),
      tasks: mockMaintenanceTasks.filter((task) => task.sectionId === sectionId),
      assets: mockAssets.filter((asset) => asset.sectionId === sectionId),
      conflicts: mockConflicts.filter((conflict) => conflict.sectionId === sectionId && conflict.status === 'Active'),
      alerts: mockAlerts.filter((alert) => alert.sectionId === sectionId && alert.status === 'Active'),
    };
  }, [selectedSec]);

  const visibleSections = mockSections.filter((section) =>
    `${section.code} ${section.name}`.toLowerCase().includes(search.toLowerCase())
  );

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
            {visibleSections.map((sec) => (
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
          <RailwayMap
            section={selectedSec}
            stations={selectedData.stations}
            trains={selectedData.trains}
            blocks={selectedData.blocks}
            tasks={selectedData.tasks}
            conflicts={selectedData.conflicts}
          />
        </div>

        {/* RIGHT: Alerts Feed (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3 shadow-lg flex flex-col h-[520px]">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Live Corridor Alerts
            </span>
            <span className="text-emerald-400 font-bold text-[10px]">{selectedData.alerts.length} ACTIVE</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
            <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-2.5 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold text-amber-400">ACTIVE CONFLICTS</span>
                <span className="text-slate-400">{selectedData.conflicts.length}</span>
              </div>
              {selectedData.conflicts.length === 0 ? (
                <p className="text-[11px] text-slate-400">No active conflicts detected for this corridor.</p>
              ) : selectedData.conflicts.map((conflict) => (
                <div key={conflict.id} className="border-t border-amber-500/10 pt-2 space-y-1">
                  <StatusBadge status={conflict.severity} />
                  <div className="font-semibold text-slate-200 leading-snug">{conflict.title}</div>
                  <p className="text-[11px] text-slate-400 leading-tight">{conflict.description}</p>
                </div>
              ))}
            </div>
            {selectedData.alerts.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-center text-[11px] text-slate-400">
                No active alerts for {selectedSec.code}.
              </div>
            ) : selectedData.alerts.map((al) => (
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
      <BlockTimeline
        section={selectedSec}
        blocks={selectedData.blocks}
        tasks={selectedData.tasks}
        trains={selectedData.trains}
        conflicts={selectedData.conflicts}
      />
    </div>
  );
}
