'use client';

import React, { useState } from 'react';
import { MapPin, AlertTriangle, Wrench, TrainTrack, X, Info } from 'lucide-react';
import { mockStations, mockSections, Section } from '../data/mockData';

export default function RailwayMap() {
  const [selectedSection, setSelectedSection] = useState<Section | null>(mockSections[2]); // S-14 default

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-[520px] relative overflow-hidden flex flex-col justify-between shadow-xl">
      {/* Top Banner */}
      <div className="flex items-center justify-between z-10 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white">Live Railway Operations Schematic Canvas</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
          SCHEMATIC DEMO MAP — NOT REAL-TIME
        </span>
      </div>

      {/* Custom SVG Schematic Canvas */}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl my-3 p-4 relative flex items-center justify-center overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />

        <svg className="w-full h-full min-h-[300px]" viewBox="0 0 1000 300" fill="none">
          {/* Main Corridor Double Track Lines */}
          <path d="M 100 150 L 300 150 L 500 150 L 700 150 L 900 150" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
          <path d="M 100 150 L 300 150 L 500 150 L 700 150 L 900 150" stroke="#3B82F6" strokeWidth="3" strokeDasharray="10 5" strokeLinecap="round" />

          {/* Section Click Zones */}
          {/* Section S-10 (MAS-AJJ) */}
          <line x1="100" y1="150" x2="300" y2="150" stroke="transparent" strokeWidth="30" className="cursor-pointer" onClick={() => setSelectedSection(mockSections[0])} />

          {/* Section S-12 (AJJ-KPD) */}
          <line x1="300" y1="150" x2="500" y2="150" stroke="transparent" strokeWidth="30" className="cursor-pointer" onClick={() => setSelectedSection(mockSections[1])} />

          {/* Section S-14 (KPD-JTJ) — ACTIVE BLOCK & CONFLICT */}
          <g className="cursor-pointer" onClick={() => setSelectedSection(mockSections[2])}>
            <rect x="520" y="132" width="160" height="36" rx="6" fill="#F59E0B" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="2" />
            <text x="535" y="154" fill="#FCD34D" fontSize="11" fontFamily="monospace" fontWeight="bold">⛔ BLOCK B-113 (ACTIVE)</text>
          </g>

          {/* Section S-18 (JTJ-SA) */}
          <line x1="700" y1="150" x2="900" y2="150" stroke="transparent" strokeWidth="30" className="cursor-pointer" onClick={() => setSelectedSection(mockSections[3])} />

          {/* Moving Train Icons 🚆 */}
          <g className="animate-pulse">
            <rect x="200" y="138" width="50" height="24" rx="4" fill="#0066FF" stroke="#60A5FA" strokeWidth="1.5" />
            <text x="206" y="154" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">🚆 20608</text>
          </g>

          <g>
            <rect x="780" y="138" width="50" height="24" rx="4" fill="#10B981" stroke="#34D399" strokeWidth="1.5" />
            <text x="786" y="154" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">🚆 G-9021</text>
          </g>

          {/* Maintenance Point Icons 🔧 */}
          <g className="cursor-pointer" onClick={() => setSelectedSection(mockSections[2])}>
            <circle cx="580" cy="115" r="14" fill="#EF4444" className="animate-ping opacity-75" />
            <circle cx="580" cy="115" r="12" fill="#EF4444" />
            <text x="574" y="120" fill="#FFFFFF" fontSize="12">🔧</text>
          </g>

          {/* Conflict Alert Marker ⚠ */}
          <g>
            <circle cx="630" cy="185" r="12" fill="#F59E0B" />
            <text x="625" y="190" fill="#FFFFFF" fontSize="12">⚠</text>
          </g>

          {/* Stations A to E Nodes */}
          {mockStations.map((st) => (
            <g key={st.id} className="cursor-pointer">
              <circle cx={st.x} cy={st.y} r="12" fill="#0F172A" stroke="#0066FF" strokeWidth="3" />
              <circle cx={st.x} cy={st.y} r="5" fill="#38BDF8" />
              <text x={st.x - 25} y={st.y + 32} fill="#F8FAFC" fontSize="11" fontFamily="monospace" fontWeight="bold">
                {st.code}
              </text>
              <text x={st.x - 40} y={st.y + 46} fill="#94A3B8" fontSize="9" fontFamily="monospace">
                {st.name.split(' ')[0]}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend & Quick Section Summary */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">🚆 Train Movement</span>
          <span className="flex items-center gap-1 text-amber-400">⛔ Active Block</span>
          <span className="flex items-center gap-1 text-rose-400">🔧 Maintenance</span>
          <span className="flex items-center gap-1 text-amber-400">⚠ Section Conflict</span>
        </div>
        <span className="text-slate-500">Click any section or station node for details</span>
      </div>

      {/* Section Details Modal Drawer */}
      {selectedSection && (
        <div className="absolute right-4 top-16 bottom-4 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl z-20 flex flex-col justify-between">
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-blue-400">{selectedSection.code} DETAILS</span>
              <button onClick={() => setSelectedSection(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 text-[10px]">SECTION NAME</span>
                <div className="font-bold text-white">{selectedSection.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px]">STATUS</span>
                  <div className="font-bold text-amber-400 text-[11px]">{selectedSection.status}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">TRAFFIC</span>
                  <div className="font-bold text-blue-400 text-[11px]">{selectedSection.trafficDensity}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px]">ACTIVE TASKS</span>
                  <div className="font-bold text-emerald-400 text-sm">{selectedSection.activeTasks} Tasks</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">LENGTH</span>
                  <div className="font-bold text-white text-sm">{selectedSection.lengthKm} km</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 text-[10px]">NEXT AVAILABLE WINDOW</span>
                <div className="font-bold text-cyan-400 text-xs mt-0.5">{selectedSection.nextWindow}</div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setSelectedSection(null)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded-lg text-xs font-mono"
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}
