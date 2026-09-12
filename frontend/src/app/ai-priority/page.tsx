'use client';

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Info, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import AIExplanation from '@/components/AIExplanation';
import { getMaintenanceTasks } from '@/services/api';
import { MaintenanceTask } from '@/data/mockData';

import { useInputData } from '@/context/InputDataContext';

export default function AIPriorityEnginePage() {
  const [apiTasks, setApiTasks] = useState<MaintenanceTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const { maintenanceTasks: localTasks, datasets } = useInputData();

  useEffect(() => {
    getMaintenanceTasks().then(setApiTasks);
  }, []);

  const importedTasks: MaintenanceTask[] = (datasets.maintenance || []).map((row, idx) => {
    const rawCrit = String(row.criticality || 'Medium').trim();
    const critCapitalized = (rawCrit.charAt(0).toUpperCase() + rawCrit.slice(1).toLowerCase()) as MaintenanceTask['criticality'];
    const validCrit = ['Critical', 'High', 'Medium', 'Low'].includes(critCapitalized) ? critCapitalized : 'Medium';
    const priorityScore = row.priority_score ? Number(row.priority_score) : ({ Critical: 90, High: 75, Medium: 60, Low: 40 }[validCrit] || 50);

    return {
      id: `imported-ai-${idx}-${row.task_code || idx}`,
      taskCode: row.task_code || `TASK-${idx + 100}`,
      department: (row.department || 'Engineering') as MaintenanceTask['department'],
      asset: row.asset || 'Corridor Asset',
      assetId: row.asset_id || `ASSET-${row.section_id || 'S1'}`,
      sectionId: row.section_id || 'S-14',
      issue: row.issue || row.work_description || `${row.department || 'Maintenance'} Activity`,
      criticality: validCrit,
      dueDate: row.deadline || row.due_date || '2026-09-20',
      durationHrs: Number(row.duration_hours || 2),
      crewRequired: Number(row.crew_required || 4),
      priorityScore,
      status: validCrit === 'Critical' ? 'Critical' : 'Pending',
      aiReasons: ['Data Intake CSV/Excel record', `Priority score: ${priorityScore}/100`, `Corridor Section: ${row.section_id}`],
      aiRecommendation: 'High priority maintenance item prioritized for upcoming block schedule window.'
    };
  });

  const allTasks = [...localTasks, ...importedTasks, ...apiTasks].sort((a, b) => b.priorityScore - a.priorityScore);

  useEffect(() => {
    if (allTasks.length > 0 && !selectedTask) {
      setSelectedTask(allTasks[0]);
    }
  }, [allTasks.length]);

  const criticalCount = allTasks.filter(t => t.criticality === 'Critical').length;
  const highCount = allTasks.filter(t => t.criticality === 'High').length;
  const normalCount = allTasks.filter(t => t.criticality === 'Medium' || t.criticality === 'Low').length;

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
          LIVE DATA PRIORITY MODEL
        </span>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-slate-400">Tasks Analyzed</div>
          <div className="text-3xl font-black text-white">{allTasks.length}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-slate-400">Critical Risk</div>
          <div className="text-3xl font-black text-rose-400">{criticalCount}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-slate-400">High Risk</div>
          <div className="text-3xl font-black text-amber-400">{highCount}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow-md">
          <div className="text-slate-400">Normal Priority</div>
          <div className="text-3xl font-black text-blue-400">{normalCount}</div>
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
                {allTasks.map((t) => (
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
