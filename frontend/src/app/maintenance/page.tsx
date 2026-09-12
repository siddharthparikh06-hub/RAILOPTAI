'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, Search, Plus, Filter, Eye, Edit2, Calendar, X } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { getMaintenanceTasks } from '@/services/api';
import { MaintenanceTask } from '@/data/mockData';
import { useInputData } from '@/context/InputDataContext';

export default function MaintenanceManagementPage() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [department, setDepartment] = useState('ALL');
  const [criticality, setCriticality] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'schedule' | null>(null);
  const { maintenanceTasks: localTasks, datasets } = useInputData();

  useEffect(() => {
    getMaintenanceTasks().then(setTasks);
  }, []);

  const importedMaintenanceTasks: MaintenanceTask[] = (datasets.maintenance || []).map((row, idx) => {
    const rawCrit = String(row.criticality || 'Medium').trim();
    const critCapitalized = (rawCrit.charAt(0).toUpperCase() + rawCrit.slice(1).toLowerCase()) as MaintenanceTask['criticality'];
    const validCrit = ['Critical', 'High', 'Medium', 'Low'].includes(critCapitalized) ? critCapitalized : 'Medium';
    const priorityScore = row.priority_score ? Number(row.priority_score) : ({ Critical: 90, High: 75, Medium: 60, Low: 40 }[validCrit] || 50);

    return {
      id: `imported-maint-${idx}-${row.task_code || idx}`,
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
      aiReasons: ['Imported via Data Intake file', `Section: ${row.section_id}`],
      aiRecommendation: 'Awaiting block schedule allocation.'
    };
  });

  const allTasks = [...localTasks, ...importedMaintenanceTasks, ...tasks];

  const filteredTasks = allTasks.filter((t) => {
    if (department !== 'ALL' && t.department !== department) return false;
    if (criticality !== 'ALL' && t.criticality !== criticality) return false;
    if (search && !t.taskCode.toLowerCase().includes(search.toLowerCase()) && !t.issue.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAction = (task: MaintenanceTask, mode: 'view' | 'edit' | 'schedule') => {
    setSelectedTask(task);
    setDialogMode(mode);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-400" />
            Maintenance Management
          </h1>
          <p className="text-xs text-slate-400">Engineering, Traction (OHE), and Signal &amp; Telecom Tasks</p>
        </div>

        <Link
          href="/data-input"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all font-mono"
        >
          <Plus className="w-4 h-4" />
          <span>New Maintenance Task</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter by Task ID or Issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering (P-Way)</option>
            <option value="Traction">Traction Distribution (TRD)</option>
            <option value="Signal & Telecom">Signal &amp; Telecom (S&amp;T)</option>
          </select>

          <select
            value={criticality}
            onChange={(e) => setCriticality(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">All Criticality Levels</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
          </select>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Showing <span className="text-white font-bold">{filteredTasks.length}</span> tasks
        </div>
      </div>

      {/* Tasks Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px]">
              <tr>
                <th className="p-3">Task ID</th>
                <th className="p-3">Asset</th>
                <th className="p-3">Department</th>
                <th className="p-3">Section</th>
                <th className="p-3 font-sans">Issue Description</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-blue-400">{t.taskCode}</td>
                  <td className="p-3 text-white font-medium">{t.asset}</td>
                  <td className="p-3 text-slate-300">{t.department}</td>
                  <td className="p-3 text-slate-300">{t.sectionId}</td>
                  <td className="p-3 font-sans text-slate-200 max-w-xs truncate">{t.issue}</td>
                  <td className="p-3">
                    <span className="font-bold text-rose-400">{t.priorityScore}/100</span>
                  </td>
                  <td className="p-3 text-slate-300">{t.dueDate}</td>
                  <td className="p-3 text-slate-300">{t.durationHrs}h</td>
                  <td className="p-3"><StatusBadge status={t.status} /></td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button 
                        onClick={() => handleAction(t, 'view')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300" 
                        title="View Task Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleAction(t, 'edit')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300" 
                        title="Edit Task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleAction(t, 'schedule')}
                        className="p-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30" 
                        title="Schedule Block Window"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Dialog Modal */}
      {selectedTask && dialogMode && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative font-mono">
            <button onClick={() => setDialogMode(null)} className="absolute right-4 top-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] text-blue-400 font-bold uppercase">{selectedTask.taskCode} {dialogMode.toUpperCase()} MODAL</span>
              <h3 className="text-base font-bold text-white font-sans">{selectedTask.asset} Maintenance</h3>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div><span className="text-slate-400">Department:</span> <span className="text-white font-bold">{selectedTask.department}</span></div>
              <div><span className="text-slate-400">Section:</span> <span className="text-white font-bold">{selectedTask.sectionId}</span></div>
              <div><span className="text-slate-400">Issue:</span> <span className="text-slate-200 font-sans">{selectedTask.issue}</span></div>
              <div><span className="text-slate-400">Priority Score:</span> <span className="text-rose-400 font-bold">{selectedTask.priorityScore}/100</span></div>
            </div>

            <button
              onClick={() => setDialogMode(null)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs shadow-lg shadow-blue-600/30"
            >
              {dialogMode === 'schedule' ? 'Confirm Block Window Schedule' : 'Close Modal'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
