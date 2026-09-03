'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarCheck, Cpu, Play, CheckCircle2, RefreshCw, BarChart3, 
  Clock, ShieldAlert, ArrowRight, Sparkles 
} from 'lucide-react';
import OptimizationProgress from '@/components/OptimizationProgress';
import { runOptimizationSimulation } from '@/services/api';

export default function AutomaticBlockPlannerPage() {
  const [horizon, setHorizon] = useState('7 Days');
  const [division, setDivision] = useState('Chennai Demo Division');
  const [objective, setObjective] = useState('Maximize Asset Availability');

  const [optimizing, setOptimizing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleStartOptimization = () => {
    setOptimizing(true);
    setCompleted(false);
  };

  const handleProgressComplete = async () => {
    setOptimizing(false);
    setCompleted(true);
    const res = await runOptimizationSimulation(horizon, division, objective);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-400" />
            Automatic Block Planner
          </h1>
          <p className="text-xs text-slate-400">AI-Powered Multi-Departmental Corridor Scheduling Engine</p>
        </div>

        <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
          MAIN DEMO FEATURE
        </span>
      </div>

      {/* Inputs & Controls Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Optimization Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Horizon */}
          <div className="space-y-2">
            <label className="text-slate-300 font-medium">Planning Horizon</label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="1 Day">1 Day (24 Hours)</option>
              <option value="7 Days">7 Days (Weekly Plan)</option>
              <option value="30 Days">30 Days (Monthly Plan)</option>
            </select>
          </div>

          {/* Division */}
          <div className="space-y-2">
            <label className="text-slate-300 font-medium">Railway Division</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Chennai Demo Division">Chennai Demo Division</option>
              <option value="Northern Trunk Division">Northern Trunk Division</option>
              <option value="Western Express Division">Western Express Division</option>
            </select>
          </div>

          {/* Objective */}
          <div className="space-y-2">
            <label className="text-slate-300 font-medium">Optimization Objective</label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Maximize Asset Availability">Maximize Asset Availability</option>
              <option value="Minimum Train Disruption">Minimum Train Disruption</option>
              <option value="Maximum Maintenance Completion">Maximum Maintenance Completion</option>
              <option value="Balanced Optimization">Balanced Optimization</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleStartOptimization}
          disabled={optimizing}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all text-sm flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          <Cpu className="w-5 h-5" />
          <span>⚡ GENERATE OPTIMIZED BLOCK PLAN</span>
        </button>
      </div>

      {/* Simulated Progress Overlay Modal */}
      {optimizing && <OptimizationProgress onComplete={handleProgressComplete} />}

      {/* Optimization Completed Showcase */}
      {completed && result && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 space-y-6 shadow-2xl animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">SOLVER STATUS</span>
                <h2 className="text-xl font-extrabold text-white">{result.status}</h2>
              </div>
            </div>

            <Link
              href="/gantt"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition-all font-mono"
            >
              <span>VIEW RECOMMENDED BLOCK GANTT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Results Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs text-center">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">TASKS CONSIDERED</div>
              <div className="text-2xl font-black text-white mt-1">{result.tasksConsidered}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">AVAILABLE WINDOWS</div>
              <div className="text-2xl font-black text-blue-400 mt-1">{result.availableWindows}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">CONFLICTS DETECTED</div>
              <div className="text-2xl font-black text-rose-400 mt-1">{result.conflictsDetected}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">RECOMMENDED BLOCKS</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{result.recommendedBlocks}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">DOWNTIME SAVED</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{result.estimatedDowntimeSavedHrs} hrs</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">TRAIN IMPACT REDUCTION</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">-{result.estimatedTrainImpactReductionPct}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
