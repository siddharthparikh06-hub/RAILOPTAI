'use client';

import React, { useState } from 'react';
import { TrainTrack, Play, CheckCircle2, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { mockBlockWindows, mockTrainMovements } from '@/data/mockData';

export default function TrainImpactSimulatorPage() {
  const [selectedBlockId, setSelectedBlockId] = useState('blk-3');

  const selectedBlock = mockBlockWindows.find((b) => b.id === selectedBlockId) || mockBlockWindows[2];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrainTrack className="w-5 h-5 text-blue-400" />
            Train Impact Simulator
          </h1>
          <p className="text-xs text-slate-400">Timetable Conflict Evaluation &amp; Train Delay Minimization Pipeline</p>
        </div>

        <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
          TIMETABLE SIMULATION MODE
        </span>
      </div>

      {/* Main Grid: Select Block (4 cols) & Impact Summary (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Select Block Selector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg font-mono text-xs">
          <h2 className="text-sm font-bold text-white font-sans uppercase tracking-wider">Select Maintenance Block</h2>

          <div className="space-y-2">
            <label className="text-slate-300 font-medium">Select Block Window</label>
            <select
              value={selectedBlockId}
              onChange={(e) => setSelectedBlockId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 font-bold"
            >
              {mockBlockWindows.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.blockCode} ({b.sectionName} - {b.timeSlot})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div><span className="text-slate-400">Block ID:</span> <span className="text-blue-400 font-bold">{selectedBlock.blockCode}</span></div>
            <div><span className="text-slate-400">Time Slot:</span> <span className="text-white font-bold">{selectedBlock.timeSlot}</span></div>
            <div><span className="text-slate-400">Duration:</span> <span className="text-emerald-400 font-bold">{selectedBlock.durationHrs} Hours</span></div>
            <div><span className="text-slate-400">Departments:</span> <span className="text-amber-400 font-bold">{selectedBlock.departments.join(', ')}</span></div>
          </div>
        </div>

        {/* Right: Impact Summary (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white font-sans uppercase tracking-wider">Simulated Traffic Impact Summary</h2>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
              LOW OVERALL IMPACT
            </span>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs text-center">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">TRAINS ANALYZED</div>
              <div className="text-2xl font-black text-white mt-1">42</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">POTENTIALLY AFFECTED</div>
              <div className="text-2xl font-black text-amber-400 mt-1">6</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">EXPECTED DELAY</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">8 min</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">REROUTED TRAINS</div>
              <div className="text-2xl font-black text-blue-400 mt-1">2</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">PASSENGER IMPACT</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">Low</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">GOODS TRAIN IMPACT</div>
              <div className="text-2xl font-black text-amber-400 mt-1">Medium</div>
            </div>
          </div>

          {/* Visual Train Movement Timeline */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-300 font-mono">Visual Train Timetable Movements</div>
            <div className="space-y-2 font-mono text-xs">
              {mockTrainMovements.map((tm) => (
                <div key={tm.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-400">{tm.trainNo}</span> - <span className="text-white font-sans">{tm.trainName}</span>
                    {tm.rerouted && <span className="ml-2 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">{tm.reroutePath}</span>}
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">{tm.scheduledTime}</span>
                    <span className="ml-3 font-bold text-emerald-400">+{tm.expectedDelayMin} min delay</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
