'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarCheck, Cpu, Play, CheckCircle2, RefreshCw, BarChart3, 
  Clock, ShieldAlert, ArrowRight, Sparkles 
} from 'lucide-react';
import OptimizationProgress from '@/components/OptimizationProgress';
import { runOptimizationSimulation } from '@/services/api';
import { useInputData } from '@/context/InputDataContext';

export default function AutomaticBlockPlannerPage() {
  const [horizon, setHorizon] = useState('7 Days');
  const [division, setDivision] = useState('Chennai Demo Division');
  const [objective, setObjective] = useState('Maximize Asset Availability');

  const [optimizing, setOptimizing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { maintenanceTasks: localTasks, imports, datasets, setLatestResult } = useInputData();

  const handleStartOptimization = () => {
    setError(null);
    setResult(null);
    setOptimizing(true);
    setCompleted(false);
  };

  const handleProgressComplete = async () => {
    setOptimizing(false);
    setCompleted(true);
    try {
      const manualTasks = localTasks.map((task) => ({ task_code: task.taskCode, department: task.department, asset: task.asset, section_id: task.sectionId, duration_hours: task.durationHrs, deadline: task.dueDate, criticality: task.criticality, crew_required: task.crewRequired }));
      
      let tasksToSolve = [...manualTasks, ...datasets.maintenance];
      if (tasksToSolve.length === 0) {
        tasksToSolve = [
          { task_code: 'TASK-2001', department: 'Engineering', asset: 'P-Way Track Tamping T-14', section_id: 'S-14', duration_hours: 2.5, deadline: '2026-09-20', criticality: 'Critical', crew_required: 6 },
          { task_code: 'TASK-2002', department: 'Traction', asset: 'OHE Overhead Wire Inspection-08', section_id: 'S-14', duration_hours: 2.0, deadline: '2026-09-21', criticality: 'High', crew_required: 4 },
          { task_code: 'TASK-2003', department: 'Signal & Telecom', asset: 'Point Machine Overhaul PM-04', section_id: 'S-14', duration_hours: 1.5, deadline: '2026-09-22', criticality: 'Critical', crew_required: 3 },
          { task_code: 'TASK-2004', department: 'Engineering', asset: 'Rail Defect Ultrasonic Testing UT-02', section_id: 'S-12', duration_hours: 3.0, deadline: '2026-09-23', criticality: 'High', crew_required: 5 }
        ];
      }

      let timetableToSolve = datasets.timetable;
      if (!timetableToSolve || timetableToSolve.length === 0) {
        timetableToSolve = [
          { train_number: '12625', train_name: 'Kerala Superfast Express', section_id: 'S-14', planned_entry: '06:00', planned_exit: '07:15', priority: '1', direction: 'UP' },
          { train_number: '20607', train_name: 'Vande Bharat Express', section_id: 'S-14', planned_entry: '08:30', planned_exit: '09:30', priority: '1', direction: 'DOWN' }
        ];
      }

      const res = await runOptimizationSimulation(horizon, division, objective, { tasks: tasksToSolve, train_movements: timetableToSolve, sections: datasets.sections, crews: datasets.crews });
      const finalRes = { ...res, inputTasks: tasksToSolve.length, importedFiles: imports.length };
      setResult(finalRes);
      setLatestResult(finalRes);
    } catch (calculationError) {
      setError(calculationError instanceof Error ? calculationError.message : 'The calculation service could not be reached.');
    }
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

      {error && <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">{error}</div>}

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
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-xs text-slate-300">
            <span className="font-bold text-blue-300">Validated input:</span> {result.inputValidation?.valid_tasks || result.inputTasks} task(s), {result.inputValidation?.sections || 0} section(s), and {result.inputValidation?.train_movements || 0} train movement(s). {result.inputValidation?.rejected_rows ? `${result.inputValidation.rejected_rows} row(s) were rejected.` : 'No input rows were rejected.'}
          </div>
          {result.assignments?.length > 0 && <div className="overflow-x-auto rounded-xl border border-slate-800"><table className="w-full text-left font-mono text-xs"><thead className="bg-slate-950 text-slate-400"><tr><th className="p-3">Task</th><th className="p-3">Section</th><th className="p-3">Department</th><th className="p-3">Scheduled start</th><th className="p-3">Duration</th></tr></thead><tbody>{result.assignments.map((assignment: any) => <tr key={`${assignment.task_code}-${assignment.start}`} className="border-t border-slate-800"><td className="p-3 font-bold text-blue-300">{assignment.task_code}</td><td className="p-3">{assignment.section_id}</td><td className="p-3">{assignment.department}</td><td className="p-3">{assignment.start}</td><td className="p-3">{assignment.duration_hours}h</td></tr>)}</tbody></table></div>}
        </div>
      )}
    </div>
  );
}
