'use client';

import React from 'react';
import { BarChart3, ArrowRight, Sparkles, CheckCircle2, Info, TrendingUp, Clock, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function OptimizationImpactPage() {
  const comparisonData = [
    { metric: 'Block Hours', before: 184, after: 121, unit: 'hrs' },
    { metric: 'Asset Downtime', before: 241, after: 126, unit: 'hrs' },
    { metric: 'Conflicts', before: 29, after: 3, unit: 'count' },
    { metric: 'Train Delay %', before: 17.2, after: 6.8, unit: '%' },
    { metric: 'Critical Completed', before: 18, after: 29, unit: 'tasks' },
    { metric: 'Asset Availability %', before: 87.4, after: 94.7, unit: '%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OPTIMIZATION PERFORMANCE SHOWCASE</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Optimization Impact
          </h1>
          <p className="text-xs text-slate-400">Independent Department Planning vs RAILOPT AI Coordinated Planning</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400 font-bold">
          TOTAL YIELD: 126.5 HOURS SAVED
        </div>
      </div>

      {/* Side-by-Side Comparison Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE CARD */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div>
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">PREVIOUS SYSTEM</span>
              <h2 className="text-lg font-bold text-white">Independent Department Planning</h2>
            </div>
            <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">
              UNCOORDINATED
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Total Block Hours:</span>
              <span className="text-xl font-bold text-rose-400">184 hrs</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Asset Downtime:</span>
              <span className="text-xl font-bold text-rose-400">241 hrs</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Section Conflicts:</span>
              <span className="text-xl font-bold text-rose-400">29 Overlaps</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Train Disruption Impact:</span>
              <span className="text-xl font-bold text-rose-400">17.2%</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Critical Tasks Completed:</span>
              <span className="text-xl font-bold text-slate-300">18 / 31</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Asset Availability:</span>
              <span className="text-xl font-bold text-slate-300">87.4%</span>
            </div>
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">PROPOSED SOLUTION</span>
              <h2 className="text-lg font-bold text-white">RAILOPT AI Coordinated Planning</h2>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              OPTIMIZED CP-SAT
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Total Block Hours:</span>
              <span className="text-xl font-bold text-emerald-400">121 hrs <span className="text-xs text-emerald-500">(-34%)</span></span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Asset Downtime:</span>
              <span className="text-xl font-bold text-emerald-400">126 hrs <span className="text-xs text-emerald-500">(-47%)</span></span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Section Conflicts:</span>
              <span className="text-xl font-bold text-emerald-400">3 Overlaps <span className="text-xs text-emerald-500">(26 Avoided)</span></span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Train Disruption Impact:</span>
              <span className="text-xl font-bold text-emerald-400">6.8% <span className="text-xs text-emerald-500">(-60%)</span></span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Critical Tasks Completed:</span>
              <span className="text-xl font-bold text-emerald-400">29 / 31</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Asset Availability:</span>
              <span className="text-xl font-bold text-emerald-400">94.7% <span className="text-xs text-emerald-500">(+8.3%)</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-5 space-y-2 text-xs">
        <div className="font-bold text-blue-400 font-mono flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          KEY SYSTEM TAKEAWAY
        </div>
        <p className="text-slate-200 text-sm leading-relaxed">
          &quot;AI coordinates compatible maintenance activities from Engineering, Traction, and S&amp;T into shared block windows, dramatically reducing total corridor downtime while protecting train timetables.&quot;
        </p>
      </div>
    </div>
  );
}
