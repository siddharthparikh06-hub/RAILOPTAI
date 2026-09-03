'use client';

import React, { useState } from 'react';
import { CalendarDays, Info, CheckCircle2, Clock, Calendar } from 'lucide-react';

export default function WeeklyPlanningPage() {
  const [selectedDay, setSelectedDay] = useState('Tuesday');

  const days = [
    { name: 'Monday', traffic: 'High', color: 'rose', densityScore: 84, window: '01:30–04:30', tasksCount: 14, recommended: false },
    { name: 'Tuesday', traffic: 'Low', color: 'emerald', densityScore: 38, window: '14:00–17:00', tasksCount: 22, recommended: true, reason: 'Lower train density and 3 compatible maintenance tasks available.' },
    { name: 'Wednesday', traffic: 'Medium', color: 'amber', densityScore: 58, window: '02:00–05:30', tasksCount: 18, recommended: false },
    { name: 'Thursday', traffic: 'Medium', color: 'amber', densityScore: 62, window: '14:00–17:00', tasksCount: 16, recommended: false },
    { name: 'Friday', traffic: 'High', color: 'rose', densityScore: 88, window: '01:30–04:30', tasksCount: 12, recommended: false },
    { name: 'Saturday', traffic: 'Low', color: 'emerald', densityScore: 42, window: '01:00–05:30', tasksCount: 24, recommended: true, reason: 'Off-peak weekend freight window.' },
    { name: 'Sunday', traffic: 'Low', color: 'emerald', densityScore: 35, window: '00:30–05:30', tasksCount: 28, recommended: true, reason: 'Minimum suburban passenger traffic slot.' },
  ];

  const current = days.find((d) => d.name === selectedDay) || days[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-400" />
            Weekly Corridor Planning (7-Day Calendar)
          </h1>
          <p className="text-xs text-slate-400">Traffic Density Heatmap &amp; Recommended Maintenance Windows</p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">● Low Traffic</span>
          <span className="flex items-center gap-1 text-amber-400">● Medium Traffic</span>
          <span className="flex items-center gap-1 text-rose-400">● High Traffic</span>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
        {days.map((d) => (
          <div
            key={d.name}
            onClick={() => setSelectedDay(d.name)}
            className={`p-4 rounded-xl border space-y-2 cursor-pointer transition-all ${
              selectedDay === d.name
                ? 'bg-blue-950/40 border-blue-500 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold">{d.name.slice(0, 3)}</span>
              {d.recommended && (
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  REC
                </span>
              )}
            </div>

            <div className="text-2xl font-extrabold font-mono text-white">{d.densityScore}%</div>
            <div className="text-[10px] text-slate-400 font-mono">Train Density</div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Traffic:</span>
                <span className={`font-bold text-${d.color}-400`}>{d.traffic}</span>
              </div>
              <div className="text-blue-400 font-bold">{d.window}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Day Details Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
            <Clock className="w-4 h-4 text-emerald-400" />
            Recommended Maintenance Windows for {current.name}
          </h2>
          <span className="text-xs text-blue-400 font-bold">{current.window} SLOT</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="text-slate-400 font-bold uppercase">AI SELECTION REASON:</div>
          <p className="text-slate-200 font-sans text-sm leading-relaxed">
            &quot;{current.reason || 'Optimal low train density corridor slot with compatible departmental activities available.'}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
