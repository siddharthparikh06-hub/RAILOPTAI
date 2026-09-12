'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { BlockWindow, CorridorConflict, MaintenanceTask, Section, Station, TrainMovement, mockBlockWindows, mockConflicts, mockMaintenanceTasks, mockSections, mockStations, mockTrainMovements } from '../data/mockData';

interface RailwayMapProps {
  section: Section;
  stations: Station[];
  trains: TrainMovement[];
  blocks: BlockWindow[];
  tasks: MaintenanceTask[];
  conflicts: CorridorConflict[];
}

export default function RailwayMap({
  section = mockSections[2],
  stations = mockStations.filter((station) => mockSections[2].stationIds.includes(station.id)),
  trains = mockTrainMovements.filter((train) => train.sectionId === mockSections[2].id),
  blocks = mockBlockWindows.filter((block) => block.sectionId === mockSections[2].id),
  tasks = mockMaintenanceTasks.filter((task) => task.sectionId === mockSections[2].id),
  conflicts = mockConflicts.filter((conflict) => conflict.sectionId === mockSections[2].id),
}: Partial<RailwayMapProps>) {
  const [detailsOpen, setDetailsOpen] = useState(true);

  useEffect(() => {
    setDetailsOpen(true);
  }, [section.id]);

  const nodePositions = stations.map((station, index) => ({
    station,
    x: stations.length === 1 ? 500 : 140 + (720 / (stations.length - 1)) * index,
    y: 150,
  }));

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 h-[520px] relative overflow-hidden flex flex-col justify-between shadow-2xl">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">Live Railway Operations Schematic Canvas</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]">
          SCHEMATIC DEMO MAP — NOT REAL-TIME
        </span>
      </div>

      {/* Custom SVG Schematic Canvas */}
      <div className="flex-1 bg-slate-950/80 border border-slate-800/80 rounded-xl my-3 p-4 relative flex items-center justify-center overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none" />

        <svg className="w-full h-full min-h-[300px]" viewBox="0 0 1000 300" fill="none">
          {nodePositions.slice(0, -1).map(({ station }, index) => {
            const nextStation = nodePositions[index + 1];
            return <g key={`${station.id}-${nextStation.station.id}`}>
              <line x1={nodePositions[index].x} y1="150" x2={nextStation.x} y2="150" stroke="#1E293B" strokeWidth="12" strokeLinecap="round" />
              <line x1={nodePositions[index].x} y1="150" x2={nextStation.x} y2="150" stroke="#3B82F6" strokeWidth="4" strokeDasharray="12 6" strokeLinecap="round" />
            </g>;
          })}

          {blocks.map((block, index) => {
            const x = nodePositions[Math.min(index, nodePositions.length - 1)]?.x ?? 500;
            return <g key={block.id}>
              <rect x={x - 58} y="126" width="116" height="48" rx="8" fill="#F59E0B" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="2" />
              <text x={x - 48} y="146" fill="#FCD34D" fontSize="10" fontFamily="monospace" fontWeight="bold">BLOCK ACTIVE</text>
              <text x={x - 48} y="160" fill="#FDE68A" fontSize="10" fontFamily="monospace">{block.blockCode.replace('BLOCK ', '')}</text>
            </g>;
          })}

          {trains.map((train, index) => {
            const x = nodePositions.length > 1 ? nodePositions[index % nodePositions.length].x : 500;
            return <motion.g key={train.id} animate={{ x: [0, 70, 0] }} transition={{ repeat: Infinity, duration: 10 + index * 3, ease: 'easeInOut' }}>
              <rect x={x - 28} y="178" width="82" height="25" rx="6" fill={index % 2 ? '#10B981' : '#0066FF'} stroke="#93C5FD" strokeWidth="1.5" />
              <text x={x - 20} y="194" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">{train.trainNo}</text>
            </motion.g>;
          })}

          {tasks.map((task, index) => {
            const x = nodePositions[Math.min(index, nodePositions.length - 1)]?.x ?? 500;
            return <g key={task.id}>
              <circle cx={x - 20} cy="112" r="10" fill="#EF4444" />
              <text x={x - 24} y="116" fill="#FFFFFF" fontSize="10">M</text>
            </g>;
          })}

          {conflicts.map((conflict, index) => {
            const x = nodePositions[Math.min(index, nodePositions.length - 1)]?.x ?? 500;
            return <g key={conflict.id}>
              <circle cx={x + 22} cy="190" r="10" fill="#F59E0B" />
              <text x={x + 18} y="194" fill="#FFFFFF" fontSize="10">!</text>
            </g>;
          })}

          {nodePositions.map(({ station, x, y }) => (
            <motion.g key={station.id} whileHover={{ scale: 1.15 }}>
              <circle cx={x} cy={y} r="14" fill="#0F172A" stroke="#0066FF" strokeWidth="3" />
              <circle cx={x} cy={y} r="6" fill="#38BDF8" />
              <text x={x - 25} y={y + 32} fill="#F8FAFC" fontSize="11" fontFamily="monospace" fontWeight="bold">{station.code}</text>
              <text x={x - 40} y={y + 46} fill="#94A3B8" fontSize="9" fontFamily="monospace">{station.name.split(' ')[0]}</text>
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">🚆 Train Movement</span>
          <span className="flex items-center gap-1 text-amber-400">⛔ Active Block</span>
          <span className="flex items-center gap-1 text-rose-400">🔧 Maintenance</span>
          <span className="flex items-center gap-1 text-amber-400">⚠ Section Conflict</span>
        </div>
        <span className="text-slate-500">{section.code} • {stations.length} stations • {trains.length} trains • {tasks.length} tasks</span>
      </div>

      {/* Section Details Modal Drawer with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {detailsOpen && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute right-4 top-16 bottom-4 w-72 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl p-5 shadow-2xl z-20 flex flex-col justify-between"
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-blue-400">{section.code} DETAILS</span>
                <button onClick={() => setDetailsOpen(false)} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 text-[10px]">SECTION NAME</span>
                  <div className="font-bold text-white">{section.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px]">STATUS</span>
                    <div className="font-bold text-amber-400 text-[11px]">{section.status}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">TRAFFIC</span>
                    <div className="font-bold text-blue-400 text-[11px]">{section.trafficDensity}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px]">ACTIVE TASKS</span>
                    <div className="font-bold text-emerald-400 text-sm">{tasks.length} Tasks</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">LENGTH</span>
                    <div className="font-bold text-white text-sm">{section.lengthKm} km</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 text-[10px]">NEXT AVAILABLE WINDOW</span>
                  <div className="font-bold text-cyan-400 text-xs mt-0.5">{section.nextWindow}</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setDetailsOpen(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs font-mono shadow-md transition-colors"
            >
              Close Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
