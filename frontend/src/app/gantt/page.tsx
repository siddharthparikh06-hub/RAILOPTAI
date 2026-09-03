'use client';

import React from 'react';
import BlockTimeline from '@/components/BlockTimeline';
import { Clock, Sparkles } from 'lucide-react';

export default function GanttTimelinePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Recommended Block Plan — Gantt Timeline
          </h1>
          <p className="text-xs text-slate-400">Departmental Swimlanes (Engineering, Traction, Signal &amp; Telecom, Train Operations)</p>
        </div>

        <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OPTIMIZED SHARED BLOCKS</span>
        </span>
      </div>

      {/* Gantt Timeline View */}
      <BlockTimeline />
    </div>
  );
}
