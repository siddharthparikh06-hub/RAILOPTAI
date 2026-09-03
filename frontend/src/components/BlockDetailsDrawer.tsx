'use client';

import React from 'react';
import { X, CheckCircle2, ShieldAlert, Clock, Wrench } from 'lucide-react';

interface BlockDetailsDrawerProps {
  block: any;
  onClose: () => void;
}

export default function BlockDetailsDrawer({ block, onClose }: BlockDetailsDrawerProps) {
  if (!block) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-end p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative h-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">{block.code || block.id} DETAILS</span>
            <h3 className="text-lg font-bold text-white mt-0.5">{block.section}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Specs Table */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Block ID:</span>
            <span className="font-bold text-blue-400">{block.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Section Code:</span>
            <span className="font-bold text-white">{block.sectionCode || 'S-14'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Time Duration:</span>
            <span className="font-bold text-emerald-400">{block.timeSlot} ({block.duration})</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Participating Departments:</span>
            <span className="font-bold text-amber-400">{block.departments ? block.departments.join(', ') : 'Engineering, Traction, S&T'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Tasks Bundled:</span>
            <span className="font-bold text-white">{block.tasksCount || 6} Tasks</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Train Disruption Impact:</span>
            <span className="font-bold text-emerald-400">{block.trainImpact || 'Low'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Priority Level:</span>
            <span className="font-bold text-rose-400">{block.priority || 'Critical'}</span>
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI RECOMMENDATION</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            &quot;{block.aiRecommendation || 'Combined window recommended because three departments have compatible maintenance activities in the same section.'}&quot;
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs font-mono shadow-lg shadow-blue-600/30"
        >
          Close Block Details
        </button>
      </div>
    </div>
  );
}
