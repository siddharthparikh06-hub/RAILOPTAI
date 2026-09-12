'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { CorridorConflict, mockConflicts } from '@/data/mockData';

export default function AlertsPage() {
  const [conflicts, setConflicts] = useState<CorridorConflict[]>(mockConflicts);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredConflicts = conflicts.filter((conflict) => filterSeverity === 'ALL' || conflict.severity === filterSeverity);

  const handleResolve = (id: string) => {
    setConflicts(conflicts.map((conflict) => conflict.id === id ? { ...conflict, status: 'Resolved' } : conflict));
  };

  const handleApplyRecommendation = (conflict: CorridorConflict) => {
    if (conflict.canApplyRecommendation) handleResolve(conflict.id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Alerts &amp; Conflict Management
          </h1>
          <p className="text-xs text-slate-400">Automated Identification of Corridor Conflicts &amp; Task Deadlines</p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 font-bold">
            {conflicts.filter((conflict) => conflict.status === 'Active').length} ACTIVE CONFLICTS
          </span>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center space-x-2 text-xs font-mono">
        <span className="text-slate-400 font-bold mr-2">Severity Filter:</span>
        <button
          onClick={() => setFilterSeverity('ALL')}
          className={`px-3 py-1 rounded ${filterSeverity === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          All Conflicts ({conflicts.length})
        </button>
        <button
          onClick={() => setFilterSeverity('Critical')}
          className={`px-3 py-1 rounded ${filterSeverity === 'Critical' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          Critical Only
        </button>
        <button
          onClick={() => setFilterSeverity('High')}
          className={`px-3 py-1 rounded ${filterSeverity === 'High' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          High Only
        </button>
        <button
          onClick={() => setFilterSeverity('Medium')}
          className={`px-3 py-1 rounded ${filterSeverity === 'Medium' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
        >
          Medium Only
        </button>
      </div>

      {/* Conflict Cards Feed */}
      <div className="space-y-4">
        {filteredConflicts.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-8 text-center text-sm text-slate-400">No conflicts match the selected severity.</div>
        ) : filteredConflicts.map((conflict) => (
          <div
            key={conflict.id}
            className={`bg-slate-900 border rounded-xl p-5 space-y-3 shadow-lg transition-all ${
              conflict.status === 'Resolved' ? 'border-slate-800 opacity-60' : 'border-amber-500/40'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <StatusBadge status={conflict.severity} />
                <span className="text-blue-400 font-bold">Section {conflict.sectionId}</span>
                <span className="text-slate-500">| {conflict.conflictType}</span>
              </div>

              <div className="flex items-center space-x-2">
                {conflict.status === 'Resolved' ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> RESOLVED
                  </span>
                ) : (
                  <>
                    <button 
                      onClick={() => handleResolve(conflict.id)}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4" /> CONFLICT DETECTED
            </div>
            <h3 className="text-base font-bold text-white">{conflict.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{conflict.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2"><span className="block text-slate-500">TYPE</span><strong className="text-white">{conflict.conflictType}</strong></div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2"><span className="block text-slate-500">TRAIN</span><strong className="text-cyan-400">{conflict.trainNo || 'Not applicable'}</strong></div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2"><span className="block text-slate-500">SECTION</span><strong className="text-white">{conflict.sectionLabel || conflict.sectionId}</strong></div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2"><span className="block text-slate-500">BLOCK</span><strong className="text-amber-400">{conflict.blockTime || conflict.blockCode || 'Not applicable'}</strong></div>
            </div>

            {conflict.recommendation && (
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 font-mono">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" /> AI RECOMMENDATION
                </div>
                <div className="text-xs text-slate-200 font-mono">
                  <span className="text-slate-400">{conflict.recommendation}: </span>
                  <strong className="text-emerald-400">{conflict.recommendedTime || 'Review next available approved window'}</strong>
                </div>
                {conflict.expectedDelayAvoidedMin !== undefined && <div className="text-xs text-slate-300 font-mono">Expected delay avoided: <strong className="text-emerald-400">{conflict.expectedDelayAvoidedMin} minutes</strong></div>}
                {conflict.canApplyRecommendation && conflict.status === 'Active' && <button onClick={() => handleApplyRecommendation(conflict)} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] font-mono">Apply Recommendation</button>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
