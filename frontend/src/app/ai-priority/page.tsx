'use client';

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Info, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import AIExplanation from '@/components/AIExplanation';
import { getMaintenanceTasks } from '@/services/api';
import { MaintenanceTask } from '@/data/mockData';

export default function AIPriorityEnginePage() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);

  useEffect(() => {
    getMaintenanceTasks().then((data) => {
      setTasks(data);
      if (data.length > 0) setSelectedTask(data[0]);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-blue-400" />
            AI Maintenance Priority Engine
          </h1>
          <p className="text-xs text-slate-400">Risk-based prioritization of maintenance activities across departments</p>
        </div>

        <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold">
          AI DEMO — Simulated Priority Model
        </span>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-slate-400">Tasks Analyzed</div>
          <div className="text-3xl font-black text-white">248</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-slate-400">Critical Risk</div>
          <div className="text-3xl font-black text-rose-400">31</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-slate-400">High Risk</div>
          <div className="text-3xl font-black text-amber-400">67</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-slate-400">Normal Priority</div>
          <div className="text-3xl font-black text-blue-400">150</div>
        </div>
      </div>

      {/* Main Grid: Priority Table & AI Explanation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Priority Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white">Prioritized Maintenance Inventory</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px]">
                <tr>
                  <th className="p-2.5">Task ID</th>
                  <th className="p-2.5">Asset</th>
                  <th className="p-2.5">Priority Score</th>
                  <th className="p-2.5">Risk Level</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tasks.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTask(t)}
                    className={`cursor-pointer transition-colors ${
                      selectedTask?.id === t.id ? 'bg-blue-950/50 text-white' : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="p-2.5 font-bold text-blue-400">{t.taskCode}</td>
                    <td className="p-2.5 font-medium text-white">{t.asset}</td>
                    <td className="p-2.5 font-bold text-rose-400">{t.priorityScore}/100</td>
                    <td className="p-2.5"><StatusBadge status={t.criticality} /></td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedTask(t); }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                      >
                        Inspect AI
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: AI Explanation Panel (5 cols) */}
        <div className="lg:col-span-5">
          <AIExplanation task={selectedTask} />
        </div>
      </div>
    </div>
  );
}
