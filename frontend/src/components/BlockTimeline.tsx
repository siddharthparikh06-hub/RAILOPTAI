'use client';

import React, { useState } from 'react';
import { Clock, Info, CheckCircle2 } from 'lucide-react';
import BlockDetailsDrawer from './BlockDetailsDrawer';

export default function BlockTimeline() {
  const [selectedBlock, setSelectedBlock] = useState<any>(null);

  const blocks = [
    {
      id: 'B-104',
      code: 'BLOCK B-104',
      section: 'Section S-10 (MAS-AJJ)',
      sectionCode: 'S-10',
      timeSlot: '08:00–11:00',
      duration: '3.0 hrs',
      departments: ['Engineering', 'S&T'],
      tasksCount: 3,
      trainImpact: 'Low',
      priority: 'Routine',
      leftPct: '14.2%',
      widthPct: '21.4%',
      aiRecommendation: 'Combined morning window for Track Tamping and Signal lumen recalibration. Saved 2.0 hours corridor downtime.'
    },
    {
      id: 'B-108',
      code: 'BLOCK B-108',
      section: 'Section S-12 (AJJ-KPD)',
      sectionCode: 'S-12',
      timeSlot: '12:00–14:00',
      duration: '2.0 hrs',
      departments: ['Traction'],
      tasksCount: 2,
      trainImpact: 'Low',
      priority: 'High',
      leftPct: '42.8%',
      widthPct: '14.2%',
      aiRecommendation: 'Shifted OHE insulator inspection to off-peak afternoon window to protect Vande Bharat Express slot.'
    },
    {
      id: 'B-113',
      code: 'BLOCK B-113',
      section: 'Section S-14 (KPD-JTJ)',
      sectionCode: 'S-14',
      timeSlot: '15:00–18:00',
      duration: '3.0 hrs',
      departments: ['Engineering', 'Traction', 'S&T'],
      tasksCount: 6,
      trainImpact: 'Low',
      priority: 'Critical',
      leftPct: '64.2%',
      widthPct: '21.4%',
      aiRecommendation: 'Combined window recommended because three departments have compatible maintenance activities in the same section.'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg overflow-x-auto">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Recommended Block Plan — Gantt Timeline
          </h3>
          <p className="text-[11px] text-slate-400">Coordinated Multi-Departmental Maintenance Windows</p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded font-bold">
          3 SHARED JOINT BLOCKS
        </span>
      </div>

      {/* Time Header X-Axis (06:00 to 20:00) */}
      <div className="flex items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-2 pl-44 min-w-[700px]">
        <span className="w-[14.2%] text-left">06:00</span>
        <span className="w-[14.2%] text-left">08:00</span>
        <span className="w-[14.2%] text-left">10:00</span>
        <span className="w-[14.2%] text-left">12:00</span>
        <span className="w-[14.2%] text-left">14:00</span>
        <span className="w-[14.2%] text-left">16:00</span>
        <span className="w-[14.2%] text-left">18:00</span>
        <span className="w-[14.2%] text-left">20:00</span>
      </div>

      {/* Row 1: Engineering Swimlane */}
      <div className="flex items-center space-x-4 min-w-[700px]">
        <div className="w-40 shrink-0 font-mono text-xs font-bold text-blue-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          Engineering (P-Way)
        </div>
        <div className="flex-1 h-12 bg-slate-950 rounded-lg border border-slate-800 relative">
          <div 
            onClick={() => setSelectedBlock(blocks[0])}
            className="absolute top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-500 rounded-md border border-blue-400/40 px-2 py-1 text-[10px] font-mono text-white cursor-pointer shadow-lg truncate transition-all flex items-center justify-between"
            style={{ left: blocks[0].leftPct, width: blocks[0].widthPct }}
          >
            <span className="font-bold truncate">B-104 (Eng+S&amp;T)</span>
            <span className="opacity-80">3h</span>
          </div>

          <div 
            onClick={() => setSelectedBlock(blocks[2])}
            className="absolute top-1.5 bottom-1.5 bg-blue-600 hover:bg-blue-500 rounded-md border border-blue-400/40 px-2 py-1 text-[10px] font-mono text-white cursor-pointer shadow-lg truncate transition-all flex items-center justify-between"
            style={{ left: blocks[2].leftPct, width: blocks[2].widthPct }}
          >
            <span className="font-bold truncate">B-113 (Eng+Trd+S&amp;T)</span>
            <span className="opacity-80">3h</span>
          </div>
        </div>
      </div>

      {/* Row 2: Traction Distribution Swimlane */}
      <div className="flex items-center space-x-4 min-w-[700px]">
        <div className="w-40 shrink-0 font-mono text-xs font-bold text-amber-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          Traction (TRD/OHE)
        </div>
        <div className="flex-1 h-12 bg-slate-950 rounded-lg border border-slate-800 relative">
          <div 
            onClick={() => setSelectedBlock(blocks[1])}
            className="absolute top-1.5 bottom-1.5 bg-amber-600 hover:bg-amber-500 rounded-md border border-amber-400/40 px-2 py-1 text-[10px] font-mono text-white cursor-pointer shadow-lg truncate transition-all flex items-center justify-between"
            style={{ left: blocks[1].leftPct, width: blocks[1].widthPct }}
          >
            <span className="font-bold truncate">B-108 (Traction)</span>
            <span className="opacity-80">2h</span>
          </div>

          <div 
            onClick={() => setSelectedBlock(blocks[2])}
            className="absolute top-1.5 bottom-1.5 bg-amber-600 hover:bg-amber-500 rounded-md border border-amber-400/40 px-2 py-1 text-[10px] font-mono text-white cursor-pointer shadow-lg truncate transition-all flex items-center justify-between"
            style={{ left: blocks[2].leftPct, width: blocks[2].widthPct }}
          >
            <span className="font-bold truncate">B-113 (Eng+Trd+S&amp;T)</span>
            <span className="opacity-80">3h</span>
          </div>
        </div>
      </div>

      {/* Row 3: Signal & Telecom Swimlane */}
      <div className="flex items-center space-x-4 min-w-[700px]">
        <div className="w-40 shrink-0 font-mono text-xs font-bold text-emerald-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Signal &amp; Telecom
        </div>
        <div className="flex-1 h-12 bg-slate-950 rounded-lg border border-slate-800 relative">
          <div 
            onClick={() => setSelectedBlock(blocks[0])}
            className="absolute top-1.5 bottom-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-md border border-emerald-400/40 px-2 py-1 text-[10px] font-mono text-white cursor-pointer shadow-lg truncate transition-all flex items-center justify-between"
            style={{ left: blocks[0].leftPct, width: blocks[0].widthPct }}
          >
            <span className="font-bold truncate">B-104 (Eng+S&amp;T)</span>
            <span className="opacity-80">3h</span>
          </div>

          <div 
            onClick={() => setSelectedBlock(blocks[2])}
            className="absolute top-1.5 bottom-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-md border border-emerald-400/40 px-2 py-1 text-[10px] font-mono text-white cursor-pointer shadow-lg truncate transition-all flex items-center justify-between"
            style={{ left: blocks[2].leftPct, width: blocks[2].widthPct }}
          >
            <span className="font-bold truncate">B-113 (Eng+Trd+S&amp;T)</span>
            <span className="opacity-80">3h</span>
          </div>
        </div>
      </div>

      {/* Row 4: Train Operations Corridor Protection */}
      <div className="flex items-center space-x-4 min-w-[700px]">
        <div className="w-40 shrink-0 font-mono text-xs font-bold text-cyan-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          Train Operations
        </div>
        <div className="flex-1 h-12 bg-slate-950 rounded-lg border border-slate-800 relative flex items-center px-4 font-mono text-[10px] text-cyan-400 justify-between">
          <span>PEAK EXPRESS TRAIN CORRIDOR SLOTS (06:00 - 08:00 &amp; 18:00 - 20:00)</span>
          <span className="text-emerald-400 font-bold">100% PROTECTED</span>
        </div>
      </div>

      {/* Block Details Drawer */}
      <BlockDetailsDrawer 
        block={selectedBlock} 
        onClose={() => setSelectedBlock(null)} 
      />
    </div>
  );
}
