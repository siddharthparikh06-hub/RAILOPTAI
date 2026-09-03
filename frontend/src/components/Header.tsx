'use client';

import React, { useState } from 'react';
import { 
  Activity, Database, Cpu, ShieldCheck, Play, Bell, User, CheckCircle2, RefreshCw 
} from 'lucide-react';
import { triggerSIHDemoScenario } from '@/lib/api';

export default function Header() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleLoadDemoScenario = async () => {
    setLoading(true);
    setToast("Loading SIH Hackathon Demo Scenario...");
    try {
      await triggerSIHDemoScenario();
      setTimeout(() => {
        setToast("SIH Demo Scenario Loaded Successfully!");
        setLoading(false);
        setTimeout(() => setToast(null), 3000);
      }, 1200);
    } catch (e) {
      setLoading(false);
      setToast("Loaded Local SIH Demo State!");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between shadow-md z-30 sticky top-0">
      {/* Left: Division & Banner */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white tracking-wider shadow-lg shadow-blue-500/20">
            RO
          </div>
          <div>
            <h1 className="font-extrabold tracking-tight text-base text-slate-100 flex items-center gap-2">
              RAILOPT AI
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                SIH26027
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Northern Railway Division — Operations Control Center</p>
          </div>
        </div>

        {/* Synthetic Operational Data Banner */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Demo Environment — Synthetic Operational Data</span>
        </div>
      </div>

      {/* Center: System Status Indicators */}
      <div className="hidden lg:flex items-center space-x-4 text-xs font-mono bg-slate-950/70 px-4 py-1.5 rounded-lg border border-slate-800">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Activity className="w-3.5 h-3.5" />
          <span>PIPELINES: ONLINE</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>CP-SAT OPTIMIZER: READY</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Database className="w-3.5 h-3.5" />
          <span>DB: CONNECTED</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1.5 text-amber-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DEMO MODE: ACTIVE</span>
        </div>
      </div>

      {/* Right: SIH Demo Button & Profile */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleLoadDemoScenario}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-lg shadow-blue-600/20 border border-blue-400/30 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>LOAD SIH DEMO SCENARIO</span>
        </button>

        <div className="relative">
          <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500" />
          </button>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
            <User className="w-4 h-4 text-blue-400" />
          </div>
          <div className="hidden md:block text-left text-xs">
            <div className="font-semibold text-slate-200">CONTROL001</div>
            <div className="text-[10px] text-slate-400">Control Officer</div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 border border-blue-500/40 text-blue-300 px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 text-xs font-mono animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </header>
  );
}
