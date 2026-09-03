'use client';

import React, { useState } from 'react';
import { CalendarRange, Info, CheckCircle2, Clock } from 'lucide-react';

export default function MonthlyPlanningPage() {
  const [selectedDate, setSelectedDate] = useState(14);

  const days = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const isHighOpp = (day === 14 || day === 7 || day === 21 || day === 28);
    return {
      day,
      demand: isHighOpp ? 'High' : 'Normal',
      density: isHighOpp ? 'Low' : 'High',
      risk: isHighOpp ? 'Critical' : 'Low',
      recommendedBlock: '14:00–17:00',
      tasks: isHighOpp ? 6 : 2,
      departments: isHighOpp ? 3 : 1,
      trainImpact: 'Low',
      isHighOpp
    };
  });

  const activeDay = days.find((d) => d.day === selectedDate) || days[13];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-blue-400" />
            Monthly Planning Calendar (30-Day View)
          </h1>
          <p className="text-xs text-slate-400">Strategic Preventive Maintenance Opportunity Heatmap</p>
        </div>

        <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
          AUGUST 2026 HORIZON
        </span>
      </div>

      {/* 30-Day Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
        <h2 className="text-sm font-bold text-white uppercase font-mono">30-Day Corridor Availability Heatmap</h2>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 font-mono text-xs">
          {days.map((d) => (
            <div
              key={d.day}
              onClick={() => setSelectedDate(d.day)}
              className={`p-3 rounded-lg border text-center space-y-1 cursor-pointer transition-all ${
                selectedDate === d.day
                  ? 'bg-blue-600 text-white font-bold shadow-lg scale-105'
                  : d.isHighOpp
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-sm">{d.day} AUG</div>
              <div className="text-[9px] uppercase font-bold">
                {d.isHighOpp ? 'HIGH OPP' : 'NORMAL'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Details Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] text-blue-400 font-bold uppercase">{activeDay.day} AUGUST 2026</span>
            <h3 className="text-lg font-bold text-white font-sans mt-0.5">
              {activeDay.isHighOpp ? 'High Maintenance Opportunity Date' : 'Standard Operations Date'}
            </h3>
          </div>
          <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            RECOMMENDED: {activeDay.recommendedBlock}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-400">RECOMMENDED BLOCK</div>
            <div className="text-xl font-bold text-cyan-400 mt-1">{activeDay.recommendedBlock}</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-400">BUNDLED TASKS</div>
            <div className="text-xl font-bold text-white mt-1">{activeDay.tasks} Tasks</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-400">DEPARTMENTS</div>
            <div className="text-xl font-bold text-amber-400 mt-1">{activeDay.departments} Departments</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-400">TRAIN IMPACT</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{activeDay.trainImpact}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
