'use client';

import React from 'react';
import { BrainCircuit, Info, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MaintenanceTask } from '../data/mockData';

interface AIExplanationProps {
  task: MaintenanceTask | null;
}

export default function AIExplanation({ task }: AIExplanationProps) {
  if (!task) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400 space-y-2 font-mono text-xs">
        <BrainCircuit className="w-8 h-8 text-slate-600 mx-auto" />
        <p>Select any maintenance task to inspect its AI priority risk breakdown.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI EXPLANATION</h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold">
          AI DEMO — Simulated Priority Model
        </span>
      </div>

      <div className="space-y-1">
        <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">{task.taskCode} • {task.asset}</div>
        <h4 className="text-base font-bold text-white">{task.issue}</h4>
      </div>

      {/* Priority & Risk Score */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Calculated Priority Score:</span>
          <span className="text-2xl font-black text-rose-400">{task.priorityScore} / 100</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Assigned Risk Level:</span>
          <span className={`font-bold ${task.criticality === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`}>
            {task.criticality.toUpperCase()}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-slate-400 text-[11px] font-bold">Primary Risk Factors:</span>
          <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
            {task.aiReasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-1.5">
        <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>AI RECOMMENDATION</span>
        </div>
        <p className="text-xs text-slate-200 font-sans leading-relaxed">
          &quot;{task.aiRecommendation}&quot;
        </p>
      </div>
    </div>
  );
}
